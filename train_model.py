import pandas as pd
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
import joblib
import os
import seaborn as sns
import matplotlib.pyplot as plt
from sklearn.model_selection import cross_val_score

# Step 1: Load the dataset
url = 'https://raw.githubusercontent.com/Harismita-k/Medbot/refs/heads/main/disease_and_symptoms.csv'
df = pd.read_csv(url, sep=',', engine='python', on_bad_lines='skip')
df.columns = df.columns.str.strip()

# Step 2: Get all unique symptoms
symptom_cols = df.columns[1:]  # Skip 'Disease' column
symptoms = set()

for col in symptom_cols:
    symptoms.update(df[col].dropna().unique())

symptoms = sorted(symptoms)
symptom_index = {symptom: i for i, symptom in enumerate(symptoms)}

# Step 3: Convert each row into a binary vector
X = []
for _, row in df.iterrows():
    symptom_vector = [0] * len(symptom_index)
    for col in symptom_cols:
        sym = row[col]
        if pd.notna(sym):
            symptom_vector[symptom_index[sym]] = 1
    X.append(symptom_vector)

X = pd.DataFrame(X)
y = df['Disease'].values

# Step 4: Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Step 5: Train the model using Random Forest
model = RandomForestClassifier(n_estimators=200,max_features='sqrt',max_depth=8, min_samples_split=4,
    min_samples_leaf=2, random_state=42)
model.fit(X_train, y_train)

# Step 6: Evaluate the model
y_pred = model.predict(X_test)
cm = confusion_matrix(y_test, y_pred)

# Confusion Matrix Visualization
sns.heatmap(cm, annot=True, fmt='d', cmap='Blues')
plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.title("Confusion Matrix")
plt.show()
print("Training",X_train,y_train)
print("Testing",X_test,y_test)
# Metrics
print("\n📋 Classification Report:\n")
print(classification_report(y_test, y_pred))
accuracy = accuracy_score(y_test, y_pred)
print(f"✅ Model Accuracy: {accuracy:.2f}")
scores=cross_val_score(model,X,y,cv=5)
print("average accuracy: ", scores.mean())
# Step 7: Save the model and symptom index
os.makedirs('model', exist_ok=True)
joblib.dump(model, 'model/medbot_model.pkl')
joblib.dump(symptom_index, 'model/symptom_index.pkl')

print("✅ Model trained and saved successfully.")
