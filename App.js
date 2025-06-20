import React, { useState, useEffect } from "react";
import axios from "axios";

const API_KEY = "bfb75b5bda8dd9143a57360aad95f66b"; // Replace with your API key

function App() {
  const [symptoms, setSymptoms] = useState([]);
  const [selected, setSelected] = useState([]);
  const [result, setResult] = useState(null);
  const [weather, setWeather] = useState(null);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/symptoms")
      .then((res) => setSymptoms(res.data.symptoms))
      .catch((err) => console.error("Error fetching symptoms:", err));

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=Chennai&appid=${API_KEY}&units=metric`
      )
      .then((res) => {
        const { main, weather } = res.data;
        setWeather({
          temp: main.temp,
          condition: weather[0].description,
        });
      })
      .catch((err) => console.error("Error fetching weather:", err));
  }, []);

  const handleSubmit = async () => {
    try {
      const res = await axios.post("http://localhost:5000/predict", {
        username,
        password,
        symptoms: selected,
      });
      setResult(res.data);
    } catch (err) {
      alert("❌ Prediction failed. Check credentials or backend connection.");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <div style={styles.headerRow}>
          <h1 style={styles.header}>🩺 MedBot - AI Symptom Checker</h1>
          {weather && (
            <div style={styles.weatherBox}>
              <div>🌤️ {weather.temp}°C</div>
              <small>{weather.condition}</small>
            </div>
          )}
        </div>

        <div style={styles.auth}>
          <input
            type="text"
            placeholder="👤 Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={styles.input}
          />
          <input
            type="password"
            placeholder="🔒 Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
          />
        </div>

        <label style={styles.label}>Select Symptoms:</label>
        <select
          multiple
          value={selected}
          onChange={(e) =>
            setSelected(
              Array.from(e.target.selectedOptions, (opt) => opt.value)
            )
          }
          style={styles.select}
        >
          {symptoms.map((sym, i) => (
            <option key={i} value={sym}>
              {sym}
            </option>
          ))}
        </select>

        <button style={styles.button} onClick={handleSubmit}>
          🔍 Predict Disease
        </button>

        {result && (
          <div style={styles.resultBox}>
            <h2>
              🧠 <span style={styles.diseaseText}>{result.disease}</span>
            </h2>
            <h3>🩹 Precautions:</h3>
            <ul style={styles.list}>
              {result.precautions.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  page: {
    backgroundColor: "#f0fbff",
    minHeight: "100vh",
    padding: "30px",
  },
  container: {
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
    padding: "40px",
    maxWidth: "750px",
    margin: "auto",
    fontFamily: "Segoe UI, sans-serif",
  },
  headerRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "30px",
  },
  header: {
    color: "#1d3557",
    margin: 0,
    fontSize: "26px",
  },
  weatherBox: {
    backgroundColor: "#e8f8ff",
    padding: "12px",
    borderRadius: "6px",
    fontSize: "14px",
    textAlign: "center",
    minWidth: "110px",
  },
  label: {
    fontWeight: "600",
    fontSize: "16px",
    marginTop: "20px",
    display: "block",
  },
  select: {
    width: "100%",
    height: "150px",
    padding: "12px",
    fontSize: "15px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    marginBottom: "20px",
    backgroundColor: "#f9f9f9",
  },
  button: {
    backgroundColor: "#00b894",
    color: "#fff",
    padding: "12px 28px",
    fontSize: "16px",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    marginTop: "10px",
  },
  resultBox: {
    marginTop: "30px",
    backgroundColor: "#fff5f5",
    border: "1px solid #ffcccc",
    borderRadius: "10px",
    padding: "20px",
  },
  diseaseText: {
    color: "#d63031",
    fontWeight: "bold",
    fontSize: "22px",
  },
  list: {
    paddingLeft: "20px",
    lineHeight: "1.6",
  },
  input: {
    width: "48%",
    padding: "10px",
    marginRight: "4%",
    marginBottom: "15px",
    fontSize: "15px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    backgroundColor: "#f4f4f4",
  },
  auth: {
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
};

export default App;
