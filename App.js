import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [symptoms, setSymptoms] = useState([]);
  const [selected, setSelected] = useState([]);
  const [result, setResult] = useState(null);
  const [weather, setWeather] = useState("");
  const [username, setUsername] = useState(""); // 🔐
  const [password, setPassword] = useState(""); // 🔐

  // Fetch symptoms from backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/symptoms")
      .then((res) => setSymptoms(res.data.symptoms))
      .catch((err) => console.log("Error fetching symptoms:", err));
  }, []);

  // Fetch weather data
  useEffect(() => {
    const API_KEY = "YOUR_API_KEY_HERE"; // 🔑 Replace with your OpenWeatherMap API key
    const city = "Chennai";

    axios
      .get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      )
      .then((res) => {
        const temp = res.data.main.temp;
        const condition = res.data.weather[0].main;
        setWeather(`🌤️ Weather in ${city}: ${temp}°C | ${condition}`);
      })
      .catch((err) => console.log("Weather API Error:", err));
  }, []);

  // Handle Predict button click
  const handleSubmit = async () => {
    try {
      const res = await axios.post("http://localhost:5000/predict", {
        username: username,
        password: password,
        symptoms: selected,
      });

      if (res.data.error) {
        alert("Login failed: " + res.data.error);
        return;
      }

      setResult(res.data);
    } catch (err) {
      alert("Prediction failed. Check backend or credentials.");
    }
  };

  return (
    <div style={{ padding: 40, fontFamily: "Arial" }}>
      <h2>🩺 MedBot: AI Symptom Checker</h2>

      {/* 🌦️ Display Weather */}
      {weather && <p style={{ color: "gray" }}>{weather}</p>}

      {/* 🔐 Login Section */}
      <div style={{ marginBottom: 20 }}>
        <label>
          <b>Username:</b>
        </label>
        <br />
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ width: "200px", marginBottom: "10px" }}
        />
        <br />

        <label>
          <b>Password:</b>
        </label>
        <br />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ width: "200px", marginBottom: "20px" }}
        />
      </div>

      {/* 🔽 Symptom Selection */}
      <label>
        <b>Select Symptoms:</b>
      </label>
      <br />
      <select
        multiple
        value={selected}
        onChange={(e) => {
          const opts = Array.from(e.target.selectedOptions, (o) => o.value);
          setSelected(opts);
        }}
        style={{ width: "300px", height: "150px" }}
      >
        {symptoms.map((sym) => (
          <option key={sym} value={sym}>
            {sym}
          </option>
        ))}
      </select>

      <br />
      <br />
      <button onClick={handleSubmit}>Predict Disease</button>

      {/* 🧠 Prediction Result */}
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
