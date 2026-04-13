# MUJ Car Rental Recommendation System 🚗🧠

This is a Hybrid Recommendation System built with Python FastAPI. It combines Content-Based Filtering (Cosine Similarity) and Collaborative Filtering (SVD) to provide personalized car recommendations.

## 📁 Project Structure

- `data/`: Contains CSV datasets for cars and bookings.
- `model/`: Core ML logic and training scripts.
- `saved_models/`: Serialized model files and evaluation reports.
- `api/`: FastAPI routes and schemas.

## 🛠 Setup & Installation

1. **Install Dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

2. **Generate Synthetic Data** (if needed):
   ```bash
   python data/generate_data.py
   ```

3. **Train Models on Real Data**:
   ```bash
   python scripts/train_real_data.py
   ```

4. **Run API**:
   ```bash
   uvicorn api.main:app --reload --port 8000
   ```

## 🔄 ML Strategy

1. **Content-Based Filtering**: Uses TF-IDF on car metadata (type, fuel, transmission) and MinMaxScaler on price/seats.
2. **Collaborative Filtering**: Uses SVD on user ratings from past bookings.
3. **Hybrid Logic**:
   - `Existing Users (>= 2 bookings)`: 60% Collaborative + 40% Content context.
   - `New Users with Car View`: 100% Content-based.
   - `Cold Start`: Popularity-based (highest rated available cars).

## 🔌 API Endpoints

- `POST /recommend`: Get personalized recommendations.
  - Body: `{ "user_id": "...", "car_id": "...", "top_n": 5 }`
- `GET /recommend/similar/{car_id}`: Find similar cars.
- `GET /health`: Check service status.

## 🔗 Next.js Integration

1. Drop `lib/recommendations.ts` into your Next.js project.
2. Place `<RecommendedCars userId={session.user.id} />` in your `app/page.tsx` or Car Details page.
