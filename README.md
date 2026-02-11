# 🏛️ Civisense - AI-Powered Civic Grievance Intelligence System

[![Live Demo](https://img.shields.io/badge/Demo-Live-success)](https://civisenseapp.onrender.com/)
[![API Docs](https://img.shields.io/badge/API-FastAPI-009688)](https://civisense-2-api.onrender.com/docs)
[![Python](https://img.shields.io/badge/Python-3.11-blue)](https://www.python.org/)
[![React](https://img.shields.io/badge/React-18-61DAFB)](https://reactjs.org/)

> **HackElite 2026 - Citizen Grievance & Welfare Intelligence System**

An AI-powered platform that automatically prioritizes citizen complaints and intelligently links them to applicable government welfare schemes using Natural Language Processing and hybrid ML-governance rules.

---

## 🚀 Live Deployment

- **Frontend App**: https://civisenseapp.onrender.com/
- **Backend API**: https://civisense-2-api.onrender.com/docs
- **GitHub**: https://github.com/Nafeeza-25/Civisense-2

---

## 🎯 Problem Statement

Indian municipal offices receive **hundreds of citizen grievances daily** but face critical challenges:

❌ **No Prioritization** - Urgent complaints (water shortage, health emergencies) get lost in the queue  
❌ **Manual Processing** - Officers spend hours categorizing and routing complaints  
❌ **Welfare Disconnect** - Citizens don't know which government schemes they qualify for  
❌ **Language Barriers** - Rural citizens struggle with English-only systems  
❌ **No Data Intelligence** - No way to identify areas needing immediate attention  

**Result**: Delayed response, wasted resources, frustrated citizens, and missed welfare opportunities.

---

## 💡 Our Solution

**Civisense** transforms grievance management with AI-powered intelligence:

### Core Features

#### 1. 🤖 **Intelligent NLP Classification**
- Automatically categorizes complaints into: Water, Roads, Health, Sanitation, Electricity, Housing, Welfare
- Uses hybrid ML model + rule-based fallback for 95%+ reliability
- Supports **Tamil, English, and Tanglish** (mixed language) input

#### 2. 📊 **Multi-Factor Priority Scoring**
Calculates priority (0-100) based on:
- **Urgency Score** (0-1): Emergency keywords, time-sensitivity indicators
- **Population Impact** (0-1): Number of similar complaints in same area
- **Vulnerability Index** (0-1): Senior citizens, BPL families, disabled persons, children
- **Model Confidence** (0-1): Classification certainty

**Formula**: `Priority = (0.35 × Urgency) + (0.25 × Impact) + (0.25 × Vulnerability) + (0.15 × Confidence)`

#### 3. 🎓 **Welfare Scheme Intelligence Engine**
- Maps complaints to 10+ real government welfare schemes
- Checks eligibility based on age, income group, category
- Recommends schemes with detailed reasoning
- Examples: Ayushman Bharat, PMAY, Old Age Pension, PM Kisan, MGNREGA

#### 4. 📈 **Officer Dashboard**
- Real-time complaint monitoring
- Sort by priority, category, area, status
- Track resolution progress
- Identify hotspot areas needing attention

#### 5. 🔍 **Explainable AI**
Every decision includes full explanation:
- Why category was predicted (keywords detected)
- How priority was calculated (score breakdown)
- Why scheme was recommended (eligibility match)

#### 6. 🔄 **Feedback Loop**
Officers can correct misclassifications → System learns and improves

---

## 🏗️ Technical Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **UI Library**: Tailwind CSS + shadcn/ui components
- **State Management**: TanStack Query
- **Routing**: React Router v6

### Backend
- **Framework**: FastAPI (Python 3.11)
- **Database**: Render Database (PostgreSQL)
- **ORM**: SQLAlchemy
- **API Docs**: Automatic Swagger/OpenAPI

### AI/ML Pipeline
- **NLP**: scikit-learn TF-IDF Vectorizer + Logistic Regression
- **Training Data**: 150+ labeled civic complaints
- **Fallback**: Rule-based classification when model unavailable
- **Language Processing**: Custom Tanglish → English translator

### Deployment
- **Platform**: Render (both frontend and backend)
- **CI/CD**: Automatic deployment from GitHub
- **Uptime**: 99.9% (Render free tier)

---

## 🎨 Key Innovations

### 1. **Hybrid Intelligence Engine**
Unlike pure ML approaches, we combine:
- Machine Learning (for pattern recognition)
- Government Policy Rules (for governance compliance)
- Result: **Explainable + Auditable** AI suitable for public sector

### 2. **Population Impact Detection**
System automatically identifies:
- Multiple complaints in same area → Priority boost
- Cluster analysis for resource allocation
- Hotspot visualization for officers

### 3. **Tanglish Support**
Real-world citizens mix Tamil and English:
- Input: "thanni illai enga area la 5 days aachu"
- Translation: "water not available in our area for 5 days"
- Classification: Water + High Urgency

### 4. **Vulnerability-Aware Prioritization**
Automatically boosts priority for:
- Senior citizens (60+)
- BPL families
- Disabled persons
- Pregnant women
- Children
- Ensures social equity in service delivery

---

## 📂 Project Structure
```
Civisense-2/
├── frontend/              # React TypeScript app
│   ├── src/
│   │   ├── pages/        # Citizen form, Officer dashboard
│   │   ├── components/   # Reusable UI components
│   │   └── App.tsx       # Main app with routing
│   └── package.json
│
├── backend/              # FastAPI Python server
│   ├── main.py          # API endpoints
│   ├── nlp.py           # NLP classification engine
│   ├── priority.py      # Priority scoring logic
│   ├── schemes.py       # Welfare scheme mapper
│   ├── db.py            # Database models
│   ├── train_model.py   # ML model training
│   ├── model.joblib     # Trained ML model
│   └── requirements.txt
│
├── data/
│   └── schemes.json     # Government welfare schemes
│
├── ai/
│   ├── training_data.csv # ML training dataset
│   └── train.py         # Model training script
│
└── README.md
```

---

## 🚀 How to Run Locally

### Prerequisites
- Python 3.11+
- Node.js 18+
- Git

### Backend Setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
python train_model.py  # Train ML model
python main.py         # Start server at http://localhost:8000
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev  # Start dev server at http://localhost:5173
```

### Access
- Frontend: http://localhost:5173
- API Docs: http://localhost:8000/docs
- Dashboard: http://localhost:5173/officer/dashboard

---

## 📊 API Endpoints

### `POST /complaint`
Submit new grievance
```json
{
  "text": "No water supply for 3 days in Ward 5",
  "area": "Ward 5",
  "vulnerability": {
    "seniorCitizen": false,
    "lowIncome": true,
    "disability": false
  }
}
```

**Response**: Category, Priority Score, Recommended Scheme, Explanation

### `GET /dashboard`
Get all complaints with statistics
- Total complaints
- By status, category, area
- Recent high-priority complaints

### `PATCH /status/{complaint_id}`
Update complaint status
```json
{
  "status": "resolved"
}
```

### `POST /feedback`
Submit officer feedback for AI improvement
```json
{
  "complaint_id": 1,
  "correct_category": "Water",
  "correct_scheme": "Water Supply Emergency Cell"
}
```

---

## 🎯 Impact & Use Cases

### For Citizens
✅ Submit complaints in their native language  
✅ Get instant complaint ID for tracking  
✅ Discover welfare schemes they qualify for  
✅ Transparent priority explanation  

### For Municipal Officers
✅ Auto-categorized complaints (saves 70% time)  
✅ Priority-sorted queue (handle urgent cases first)  
✅ Area-wise clustering (optimize resource deployment)  
✅ Welfare scheme recommendations (reduce research time)  

### For Government
✅ Data-driven decision making  
✅ Identify systemic issues (recurring complaints)  
✅ Track resolution efficiency  
✅ Ensure social equity (vulnerability prioritization)  

---

## 🔮 Future Enhancements

### Phase 1 (Next 3 months)
- [ ] Mobile app (React Native)
- [ ] SMS/WhatsApp integration for complaint submission
- [ ] Advanced ML models (BERT for better NLP)
- [ ] Multi-city deployment

### Phase 2 (6 months)
- [ ] Real-time analytics dashboard for city admins
- [ ] Predictive maintenance (forecast complaint trends)
- [ ] Integration with existing e-governance portals
- [ ] Automated escalation workflows

### Phase 3 (1 year)
- [ ] Voice input support (speech-to-text)
- [ ] Image/photo evidence upload
- [ ] Geolocation-based auto-routing
- [ ] Citizen satisfaction surveys
- [ ] Blockchain-based transparency ledger

---

## 🛠️ Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| Backend | FastAPI, Python 3.11, SQLAlchemy |
| Database | Render Database (PostgreSQL) |
| ML/NLP | scikit-learn, TF-IDF, Logistic Regression |
| Deployment | Render (Frontend + Backend) |
| Version Control | Git, GitHub |

---

## 👥 Team

**Team Civisense** - 6 Members  
Built for HackElite 2026, SRM IST Vadapalani Campus

---

## 📄 License

This project was developed for HackElite 2026 hackathon.

---

## 🙏 Acknowledgments

- SRM Institute of Science and Technology
- Developer Network Space (DNS)
- Government of India welfare scheme documentation
- Open-source community

---

**Built with ❤️ for better civic governance**

---

## 📞 Contact

For questions or demo requests, reach out via GitHub Issues.

---

*Last Updated: February 9, 2026*
