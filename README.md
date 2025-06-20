**🩺 MedBot – AI-Powered Symptom Checker**
MedBot is an AI-powered web application that allows users to input symptoms and receive predictions about possible diseases along with recommended precautions. It leverages a trained machine learning model (Random Forest) and integrates with a React frontend.

**🛠️ Tech Stack**
- Frontend: React.js
- Backend: Flask (Python)
- ML Model: RandomForestClassifier
- Public API: OpenWeatherMap API
- Dataset: Disease & Symptoms (CSV from GitHub)

**🧠 Features**
✅ Symptom-based disease prediction using ML
✅ Precaution recommendations based on predicted disease
✅ Simple username/password check in backend (`admin` / `1234`)
✅ React-based frontend for easy interaction
✅ Logs all predictions in `history.json` for traceability


## 🚀 Setup & Installation

### ⚙️ Backend (Flask)

1. Clone the repo and navigate to backend:

   ```bash
   git clone https://github.com/YourUsername/MedBot.git
   cd MedBot/backend
   ```

2. Create virtual environment:

   ```bash
   python -m venv venv
   venv\Scripts\activate  # Windows
   ```

3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Train the model (only once):

   ```bash
   python train_model.py
   ```

5. Start the backend:

   ```bash
   python app.py
   ```

**🐳 Use Docker:**

```bash
docker build -t medbot-backend .
docker run -p 5000:5000 medbot-backend
```

**🖼️ Frontend (React)**

> This project uses **CodeSandbox** for frontend. You can either:

* Open this link: `https://codesandbox.io/p/sandbox/medbot-7456kf`
* Or manually copy `App.js` and `package.json` to CodeSandbox React template

⚠️ Make sure the backend (localhost:5000) is running when using locally.

You can select two or three symptoms at a time to predict the disease and the prediction

**📁 File Structure (Backend)**

```
backend/
├── app.py
├── train_model.py
├── requirements.txt
├── Dockerfile
├── history.json        
├── model/
│   ├── medbot_model.pkl
│   └── symptom_index.pkl
```
**file structure -Frontend(codesandbox)**
```
src/
├── App.js         
├── index.js       
└── styles.css     

public/
└── index.html     

package.json  
```


