
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [symptoms, setSymptoms] = useState([]);
  const [selected, setSelected] = useState([]);
  const [result, setResult] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:5000/symptoms')
      .then(res => setSymptoms(res.data.symptoms))
      .catch(err => console.log("Error fetching symptoms:", err));
  }, []);

  const handleSubmit = async () => {
    try {
      const res = await axios.post('http://localhost:5000/predict', {
        symptoms: selected
      });
      setResult(res.data);
    } catch (err) {
      alert("Prediction failed. Is your backend running?");
    }
  };

  return (
    <div style={{ padding: 40, fontFamily: 'Arial' }}>
      <h2>🩺 MedBot: AI Symptom Checker</h2>

      <label><b>Select Symptoms:</b></label><br />
      <select multiple value={selected} onChange={e => {
        const opts = Array.from(e.target.selectedOptions, o => o.value);
        setSelected(opts);
      }} style={{ width: '300px', height: '150px' }}>
        {symptoms.map(sym => (
          <option key={sym} value={sym}>{sym}</option>
        ))}
      </select>

      <br /><br />
      <button onClick={handleSubmit}>Predict Disease</button>

      {result && (
        <div style={{ marginTop: 30 }}>
          <h3>🧠 Predicted Disease: {result.disease}</h3>
          <h4>🩹 Precautions:</h4>
          <ul>
            {result.precautions.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;
