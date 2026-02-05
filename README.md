**Civisense – Civic Intelligence System**

AI-powered platform for prioritising citizen grievances and linking them to relevant welfare schemes.

**Live Prototype**

Frontend App:
https://civisenseapp.onrender.com/

Backend API:
https://civisense-2-api.onrender.com/docs

GitHub Repository:
https://github.com/Nafeeza-25/Civisense-2

**Problem**

Citizen grievances are currently:

manually processed

not prioritised

not linked to welfare schemes

slow to resolve

Authorities lack a system to analyse urgency, population impact, and vulnerable groups.

**Solution**

Civisense is an AI-driven civic intelligence system that:

Accepts citizen complaints

Classifies them using NLP

Calculates urgency and priority score

Detects population impact & vulnerability

Maps complaints to government welfare schemes

Displays data in an officer dashboard

**How to Use the Prototype**
**Citizen Flow**

Open the frontend link

Enter complaint description

Select area/service type

Submit complaint

System automatically:

classifies category

calculates priority score

suggests welfare scheme

**Officer Flow**

Open dashboard

View submitted complaints

See priority ranking

Update complaint status

**Core Features**

NLP complaint classification

Priority scoring engine

Population impact detection

Vulnerability identification

Welfare scheme mapping

Officer dashboard

Status lifecycle tracking

**Technical Stack**

Frontend:

React

Vite

TypeScript

Backend:

FastAPI

Python

AI/NLP:

TF-IDF

Logistic Regression

Rule-based scoring

Database:

SQLite (prototype)

Deployment:

Render (backend)

Render/Vercel (frontend)

**Technical Workflow**

Citizen → Frontend → FastAPI → NLP Engine → Priority Engine → Scheme Mapping → Database → Dashboard

**Innovation**

Hybrid ML + rule engine

Explainable priority scoring

Vulnerability detection

Population impact estimation

Welfare scheme intelligence

Feedback-ready architecture

**Originality**

This solution is built specifically for the hackathon and not reused from any existing system.

**External Libraries & Tools**

FastAPI

scikit-learn

SQLAlchemy

React

Vite

**Demo**

The prototype demonstrates:

working complaint submission

real-time classification

priority calculation

scheme suggestion

dashboard analytics
