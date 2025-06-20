from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import os

app = Flask(__name__)
CORS(app)  # Allow frontend to connect

# Load model and symptom index
model = joblib.load('model/medbot_model.pkl')
symptom_index = joblib.load('model/symptom_index.pkl')

# Load precaution data
precaution_url = 'https://raw.githubusercontent.com/Harismita-k/Medbot/refs/heads/main/disease_precaution.csv'
precautions_df = pd.read_csv(precaution_url)
precautions_df.columns = precautions_df.columns.str.strip()

# Create a dictionary: disease → list of precautions
precaution_dict = {}
for _, row in precautions_df.iterrows():
    disease = row['Disease'].strip()
    precaution_dict[disease] = [
        row.get('Precaution_1', ''),
        row.get('Precaution_2', ''),
        row.get('Precaution_3', ''),
        row.get('Precaution_4', '')
    ]



# API to get all symptom names
@app.route('/symptoms', methods=['GET'])
def get_symptoms():
    return jsonify({'symptoms': list(symptom_index.keys())})

# API to predict disease from symptoms
@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    username = data.get('username')
    password = data.get('password')

    if username != 'admin' or password != '1234':
        return jsonify({'error': 'Unauthorized'}), 401

    symptoms_input = data.get('symptoms', [])
    
    # Convert symptoms to input vector
    input_vector = [0] * len(symptom_index)
    for sym in symptoms_input:
        idx = symptom_index.get(sym)
        if idx is not None:
            input_vector[idx] = 1

    # Predict disease
    predicted_disease = model.predict([input_vector])[0]

    # ✅ Save this prediction to local file
    import json
    try:
        with open("history.json", "a") as f:
            json.dump({"username": username, "symptoms": symptoms_input, "disease": predicted_disease}, f)
            f.write("\n")
    except Exception as e:
        print("Error saving to history.json:", e)

    # Get precautions
    advice = precaution_dict.get(predicted_disease, ["No advice available."])

    return jsonify({
        'disease': predicted_disease,
        'precautions': advice
    })


if __name__ == '__main__':
    app.run(debug=True)
