import joblib
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline

# 1. Sample Training Data (The "Knowledge Base")
# In a real system, this comes from the database of corrected complaints.
data = [
    # Water
    ("No water supply in my house for 2 days", "Water"),
    ("Dirty water coming from tap", "Water"),
    ("Pipeline burst in main street", "Water"),
    ("Water tanker not arrived", "Water"),
    ("thanni illai", "Water"), # Tamil/Tanglish support
    
    # Roads
    ("Huge pothole on various roads", "Roads"),
    ("Road damaged due to heavy rain", "Roads"),
    ("Street light not working and road is dark", "Roads"),
    ("roadu sari illai", "Roads"),

    # Electricity
    ("Power cut for 5 hours", "Electricity"),
    ("Voltage fluctuation damaging appliances", "Electricity"),
    ("Transformer spark fire", "Electricity"),
    ("current illai", "Electricity"),

    # Health
    ("Garbage causing mosquito breeding and dengue", "Health"),
    ("Primary health center closed", "Health"),
    ("Hospital refused admission", "Health"),
    ("doctor not available", "Health"),

    # Welfare
    ("Rationale shop closed", "Welfare"),
    ("Pension not received for 3 months", "Welfare"),
    ("Scholarship application rejected", "Welfare"),
    
    # Sanitation
    ("Garbage not collected", "Sanitation"),
    ("Drainage blocked and overflowing", "Sanitation"),
    ("saakadai problem", "Sanitation"),
]

def train():
    print("🚀 Starting AI Validation & Training...")
    
    # 2. Prepare Data
    df = pd.DataFrame(data, columns=["text", "category"])
    X = df["text"]
    y = df["category"]
    
    # 3. Create NLP Pipeline
    # CountVectorizer: Converts text to numbers
    # MultinomialNB: Fast, effective for text classification
    model = make_pipeline(CountVectorizer(), MultinomialNB())
    
    # 4. Train
    print(f"📚 Training on {len(df)} examples...")
    model.fit(X, y)
    
    # 5. Save the "Brain"
    model_bundle = {
        "vectorizer": model.named_steps["countvectorizer"],
        "classifier": model.named_steps["multinomialnb"],
        "categories": model.classes_
    }
    
    output_file = "model.joblib"
    joblib.dump(model_bundle, output_file)
    print(f"✅ Model saved to {output_file}")
    print("🧠 AI is now ready to predict!")

if __name__ == "__main__":
    train()
