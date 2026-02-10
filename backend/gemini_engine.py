"""
Civisense Gemini AI Engine
===========================
Unified AI engine powered by Google Gemini API.
Handles classification, priority scoring, scheme recommendation,
and Tanglish/Tamil translation in a single API call.

Falls back gracefully if Gemini is unavailable.
"""

import json
import os
import re
from typing import Any, Dict, Optional

# ---------------------------------------------------------------------------
# Lazy-load the SDK so the module can be imported even without the package
# installed (in which case the engine will report itself as unavailable).
# ---------------------------------------------------------------------------
_genai = None

def _ensure_genai():
    global _genai
    if _genai is None:
        try:
            from google import genai
            _genai = genai
        except ImportError:
            raise ImportError(
                "google-genai package is required. Install with: pip install google-genai"
            )
    return _genai


# ---------------------------------------------------------------------------
# Load the detailed schemes data (10 real government schemes)
# ---------------------------------------------------------------------------
def _load_schemes() -> list:
    """Load the rich scheme dataset from data/schemes.json."""
    paths_to_try = [
        os.path.join(os.path.dirname(__file__), "..", "data", "schemes.json"),
        os.path.join(os.path.dirname(__file__), "schemes.json"),
    ]
    for path in paths_to_try:
        abs_path = os.path.abspath(path)
        if os.path.exists(abs_path):
            with open(abs_path, "r", encoding="utf-8") as f:
                return json.load(f)
    return []


SCHEMES_DATA = _load_schemes()


def _build_schemes_context() -> str:
    """Format schemes into a concise context string for the prompt."""
    if not SCHEMES_DATA:
        return "No welfare scheme data available."

    lines = []
    for s in SCHEMES_DATA:
        sid = s.get("scheme_id", "N/A")
        name = s.get("name", "Unknown")
        desc = s.get("description", "")
        keywords = ", ".join(s.get("keywords", []))
        age = s.get("age_limits", {})
        age_str = ""
        if age:
            min_age = age.get("min", "any")
            max_age = age.get("max", "any")
            age_str = f"Age: {min_age}-{max_age}"
        eligibility = s.get("eligibility_rules", {})
        target = ", ".join(eligibility.get("target_group", []))
        lines.append(
            f"- {sid} | {name}: {desc} | Keywords: {keywords} | {age_str} | Target: {target}"
        )
    return "\n".join(lines)


SCHEMES_CONTEXT = _build_schemes_context()


# ---------------------------------------------------------------------------
# System Prompt
# ---------------------------------------------------------------------------
SYSTEM_PROMPT = """You are Civisense AI, a civic grievance intelligence system for Indian government officers.

Your job: analyse a citizen complaint and return a JSON object with classification, priority scores, and welfare scheme recommendation.

CATEGORIES (pick exactly one):
Water, Roads, Electricity, Health, Welfare, Sanitation, Housing, Other

AVAILABLE WELFARE SCHEMES:
{schemes}

RULES:
1. If the complaint is in Tamil, Tanglish (Tamil+English mix), or any Indian regional language, translate it to English first and put the translation in "translated_text".
2. Classify into exactly ONE category with a confidence score (0.0-1.0).
3. Calculate urgency_score (0.0-1.0): based on emergency keywords, duration of problem, safety risks.
4. Calculate population_impact (0.0-1.0): how many people are affected? Single person = 0.2, whole area = 0.8+.
5. Calculate vulnerability_score (0.0-1.0): are vulnerable groups involved (elderly, disabled, BPL, pregnant, children)?
6. Calculate priority_score (0-100): weighted combination considering all factors.
7. Recommend the BEST matching welfare scheme from the list above. Check eligibility rules. If none match, use "General Grievance Redressal Cell".
8. Provide clear, concise reasoning for each score.

RESPOND WITH ONLY A VALID JSON OBJECT, no markdown, no extra text."""


# ---------------------------------------------------------------------------
# Main Engine Class
# ---------------------------------------------------------------------------
class GeminiEngine:
    """Gemini-powered AI engine for civic grievance analysis."""

    def __init__(self):
        genai = _ensure_genai()
        api_key = os.getenv("GEMINI_API_KEY", "")
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable is not set")

        self.client = genai.Client(api_key=api_key)
        self.model = "gemini-2.0-flash"
        self.available = True
        print("✅ Gemini AI engine initialised successfully")

    def analyze_complaint(
        self,
        text: str,
        area: Optional[str] = None,
        vulnerability_flags: Optional[Dict] = None,
    ) -> Dict[str, Any]:
        """
        Analyse a complaint using Gemini API.

        Returns a dict with keys:
            translated_text, category, confidence, urgency_score, urgency_reason,
            population_impact, population_reason, vulnerability_score, vulnerability_reason,
            recommended_scheme, scheme_id, scheme_reason, priority_score, summary
        """
        # Build the user message with all context
        user_parts = [f"COMPLAINT TEXT:\n{text}"]

        if area:
            user_parts.append(f"\nAREA/LOCATION: {area}")

        if vulnerability_flags:
            flags = []
            if vulnerability_flags.get("seniorCitizen"):
                flags.append("Senior Citizen (60+ years)")
            if vulnerability_flags.get("lowIncome"):
                flags.append("Below Poverty Line (BPL)")
            if vulnerability_flags.get("disability"):
                flags.append("Person with Disability")
            if flags:
                user_parts.append(f"\nVULNERABILITY FLAGS: {', '.join(flags)}")

        user_message = "\n".join(user_parts)

        system = SYSTEM_PROMPT.format(schemes=SCHEMES_CONTEXT)

        try:
            response = self.client.models.generate_content(
                model=self.model,
                contents=user_message,
                config={
                    "system_instruction": system,
                    "temperature": 0.2,
                    "max_output_tokens": 1024,
                },
            )

            result_text = response.text.strip()

            # Strip markdown code fences if present
            if result_text.startswith("```"):
                result_text = re.sub(r"^```(?:json)?\s*", "", result_text)
                result_text = re.sub(r"\s*```$", "", result_text)

            result = json.loads(result_text)
            return self._validate_result(result)

        except json.JSONDecodeError as e:
            print(f"⚠️ Gemini returned invalid JSON: {e}")
            raise
        except Exception as e:
            print(f"⚠️ Gemini API call failed: {e}")
            raise

    def _validate_result(self, result: Dict) -> Dict:
        """Ensure all required fields exist with proper types and ranges."""
        defaults = {
            "translated_text": "",
            "category": "Other",
            "confidence": 0.5,
            "urgency_score": 0.3,
            "urgency_reason": "Could not determine urgency",
            "population_impact": 0.2,
            "population_reason": "Single complaint",
            "vulnerability_score": 0.0,
            "vulnerability_reason": "No vulnerable groups detected",
            "recommended_scheme": "General Grievance Redressal Cell",
            "scheme_id": "",
            "scheme_reason": "No matching scheme found",
            "priority_score": 30,
            "summary": "",
        }

        validated = {}
        for key, default in defaults.items():
            val = result.get(key, default)

            # Clamp numeric values
            if key in ("confidence", "urgency_score", "population_impact", "vulnerability_score"):
                try:
                    val = max(0.0, min(1.0, float(val)))
                except (TypeError, ValueError):
                    val = default
            elif key == "priority_score":
                try:
                    val = max(0, min(100, int(float(val))))
                except (TypeError, ValueError):
                    val = default

            validated[key] = val

        # Validate category
        valid_categories = {"Water", "Roads", "Electricity", "Health", "Welfare", "Sanitation", "Housing", "Other"}
        if validated["category"] not in valid_categories:
            # Try case-insensitive match
            for c in valid_categories:
                if c.lower() == str(validated["category"]).lower():
                    validated["category"] = c
                    break
            else:
                validated["category"] = "Other"

        return validated
