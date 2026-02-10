import os
from datetime import datetime
from typing import List, Optional

from dotenv import load_dotenv
from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from sqlalchemy import func
from sqlalchemy.orm import Session

from db import Complaint, Feedback, create_all, get_db
from nlp import NLPEngine
from priority import evaluate_complaint
from schemes import map_scheme


load_dotenv()

app = FastAPI(
    title="Civisense Civic Intelligence API",
    description="Backend-only FastAPI service for prioritising civic grievances.",
    version="0.1.0",
)

# ----------------------------
# ROOT HOMEPAGE (IMPORTANT)
# ----------------------------
@app.get("/")
def root():
    return {
        "service": "Civisense Civic Intelligence API",
        "status": "running",
        "docs": "/docs",
        "message": "Welcome to Civisense. Open /docs to test complaint intake, AI classification, priority scoring, and welfare scheme mapping."
    }

# Allow browser tools / frontends to call this API from anywhere by default.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

nlp_engine = NLPEngine()


class ComplaintIn(BaseModel):
    text: str = Field(..., description="Raw grievance text from citizen.")
    area: Optional[str] = Field(None, description="Geographical area / ward / locality.")
    status: Optional[str] = Field(default="new", description="Initial status of the complaint.")
    vulnerability: Optional[dict] = Field(default={}, description="Flags for Senior Citizen, BPL, Disability, etc.")


class ComplaintOut(BaseModel):
    id: int
    text: str
    area: Optional[str]
    category: str
    confidence: float
    urgency: float
    population_impact: float
    vulnerability: float
    priority_score: float
    scheme: str
    status: str
    timestamp: datetime
    explanation: dict


class StatusUpdate(BaseModel):
    status: str = Field(..., description="New status for the complaint.")


class FeedbackIn(BaseModel):
    complaint_id: int
    correct_category: Optional[str] = None
    correct_scheme: Optional[str] = None
    notes: Optional[str] = None


class DashboardMetric(BaseModel):
    total_complaints: int
    by_status: dict
    by_category: dict
    top_areas: List[dict]
    recent_high_priority: List[dict]


@app.on_event("startup")
def on_startup() -> None:
    # Ensure DB schema exists
    create_all()


@app.post("/complaint", response_model=ComplaintOut)
def create_complaint(payload: ComplaintIn, db: Session = Depends(get_db)) -> ComplaintOut:
    # =====================================================
    # STRATEGY: Try Gemini first (unified AI), fallback to
    # existing sklearn + rules pipeline if Gemini fails.
    # =====================================================

    gemini_result = nlp_engine.analyze_with_gemini(
        text=payload.text,
        area=payload.area,
        vulnerability_flags=payload.vulnerability,
    )

    if gemini_result:
        # ----- GEMINI PATH (primary) -----
        category = gemini_result["category"]
        confidence = gemini_result["confidence"]
        urgency = gemini_result["urgency_score"]
        population_impact = gemini_result["population_impact"]
        vulnerability = gemini_result["vulnerability_score"]
        priority_score = gemini_result["priority_score"] / 100.0  # normalise to 0-1
        scheme = gemini_result["recommended_scheme"]
        scheme_reason = gemini_result["scheme_reason"]

        explanation = {
            "category": {
                "value": category,
                "confidence": confidence,
                "notes": f"Classified by Gemini AI. {gemini_result.get('summary', '')}",
            },
            "urgency": {
                "value": urgency,
                "notes": gemini_result.get("urgency_reason", "Assessed by Gemini AI."),
            },
            "population_impact": {
                "value": population_impact,
                "notes": gemini_result.get("population_reason", "Assessed by Gemini AI."),
            },
            "vulnerability": {
                "value": vulnerability,
                "notes": gemini_result.get("vulnerability_reason", "Assessed by Gemini AI."),
            },
            "priority_score": {
                "value": priority_score,
                "notes": f"Priority {gemini_result['priority_score']}/100 — weighted by urgency, impact, and vulnerability.",
            },
            "scheme": {
                "value": scheme,
                "notes": scheme_reason,
            },
        }

        # Use Gemini's translation if available, otherwise original text
        stored_text = payload.text

    else:
        # ----- FALLBACK PATH (sklearn + rules) -----
        processed_text = nlp_engine.translate_input(payload.text)

        # 1) NLP classification
        category, confidence = nlp_engine.predict_category(processed_text)

        # 2-4) Priority pipeline
        urgency, population_impact, vulnerability, priority_score = evaluate_complaint(
            db=db,
            text=processed_text,
            area=payload.area,
            category=category,
            confidence=confidence,
            vulnerability_flags=payload.vulnerability,
        )

        # 5) Welfare scheme engine
        metadata = {}
        if payload.vulnerability:
            if payload.vulnerability.get("seniorCitizen"):
                metadata["age"] = 70
            if payload.vulnerability.get("lowIncome"):
                metadata["income_group"] = "bpl"

        scheme, scheme_reason = map_scheme(
            category=category,
            text=processed_text,
            area=payload.area,
            metadata=metadata,
        )

        stored_text = payload.text

        explanation = {
            "category": {
                "value": category,
                "confidence": confidence,
                "notes": "Predicted by NLP engine (model or rules).",
            },
            "urgency": {
                "value": urgency,
                "notes": "Derived from keywords indicating emergencies or time sensitivity.",
            },
            "population_impact": {
                "value": population_impact,
                "notes": "Estimated from number of similar complaints in the same area and category.",
            },
            "vulnerability": {
                "value": vulnerability,
                "notes": "Higher if vulnerable groups are involved (Senior Citizen, BPL, Disability).",
            },
            "priority_score": {
                "value": priority_score,
                "notes": "Weighted combination of urgency, impact, vulnerability and model confidence.",
            },
            "scheme": {
                "value": scheme,
                "notes": scheme_reason,
            },
        }

    # 6) Persist complaint
    complaint = Complaint(
        text=stored_text,
        area=payload.area,
        category=category,
        confidence=confidence,
        urgency=urgency,
        population_impact=population_impact,
        vulnerability=vulnerability,
        priority_score=priority_score,
        scheme=scheme,
        status=payload.status or "new",
    )
    db.add(complaint)
    db.commit()
    db.refresh(complaint)

    return ComplaintOut(
        id=complaint.id,
        text=complaint.text,
        area=complaint.area,
        category=complaint.category,
        confidence=complaint.confidence or 0.0,
        urgency=complaint.urgency or 0.0,
        population_impact=complaint.population_impact or 0.0,
        vulnerability=complaint.vulnerability or 0.0,
        priority_score=complaint.priority_score or 0.0,
        scheme=complaint.scheme or "",
        status=complaint.status,
        timestamp=complaint.timestamp,
        explanation=explanation,
    )


@app.get("/dashboard", response_model=DashboardMetric)
def get_dashboard(db: Session = Depends(get_db)) -> DashboardMetric:
    total = db.query(Complaint).count()

    by_status_rows = db.query(Complaint.status, func.count(Complaint.id)).group_by(Complaint.status).all()
    by_status = {status or "unknown": count for status, count in by_status_rows}

    by_category_rows = db.query(Complaint.category, func.count(Complaint.id)).group_by(Complaint.category).all()
    by_category = {category or "uncategorized": count for category, count in by_category_rows}

    area_rows = (
        db.query(Complaint.area, func.count(Complaint.id).label("count"))
        .group_by(Complaint.area)
        .order_by(func.count(Complaint.id).desc())
        .limit(5)
        .all()
    )

    top_areas = [{"area": area or "unknown", "count": count} for area, count in area_rows]

    recent_high_priority = (
        db.query(Complaint)
        .order_by(Complaint.priority_score.desc(), Complaint.timestamp.desc())
        .limit(50)
        .all()
    )

    recent_data = [
        {
            "id": c.id,
            "text": c.text,
            "area": c.area,
            "category": c.category,
            "priority_score": c.priority_score,
            "status": c.status,
            "timestamp": c.timestamp,
            # NEW fields for dashboard detail view
            "scheme": c.scheme,
            "confidence": c.confidence,
            "urgency": c.urgency,
            "population_impact": c.population_impact,
            "vulnerability": c.vulnerability,
        }
        for c in recent_high_priority
    ]

    return DashboardMetric(
        total_complaints=total,
        by_status=by_status,
        by_category=by_category,
        top_areas=top_areas,
        recent_high_priority=recent_data,
    )


@app.patch("/status/{complaint_id}", response_model=ComplaintOut)
def update_status(
    complaint_id: int,
    payload: StatusUpdate,
    db: Session = Depends(get_db),
) -> ComplaintOut:
    complaint = db.query(Complaint).filter(Complaint.id == complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    complaint.status = payload.status
    db.add(complaint)
    db.commit()
    db.refresh(complaint)

    explanation = {
        "priority_score": {
            "value": complaint.priority_score or 0.0,
            "notes": "Priority did not change; only status updated.",
        }
    }

    return ComplaintOut(
        id=complaint.id,
        text=complaint.text,
        area=complaint.area,
        category=complaint.category,
        confidence=complaint.confidence or 0.0,
        urgency=complaint.urgency or 0.0,
        population_impact=complaint.population_impact or 0.0,
        vulnerability=complaint.vulnerability or 0.0,
        priority_score=complaint.priority_score or 0.0,
        scheme=complaint.scheme or "",
        status=complaint.status,
        timestamp=complaint.timestamp,
        explanation=explanation,
    )


@app.post("/feedback")
def create_feedback(payload: FeedbackIn, db: Session = Depends(get_db)) -> dict:
    complaint = db.query(Complaint).filter(Complaint.id == payload.complaint_id).first()
    if not complaint:
        raise HTTPException(status_code=404, detail="Complaint not found")

    feedback = Feedback(
        complaint_id=payload.complaint_id,
        correct_category=payload.correct_category,
        correct_scheme=payload.correct_scheme,
        notes=payload.notes,
    )
    db.add(feedback)

    if payload.correct_category:
        complaint.category = payload.correct_category
    if payload.correct_scheme:
        complaint.scheme = payload.correct_scheme

    db.commit()
    return {"message": "Feedback recorded successfully"}


if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", "8000"))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
