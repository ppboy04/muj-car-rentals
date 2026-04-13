from fastapi import APIRouter, HTTPException
from .schemas import RecommendRequest, RecommendResponse, CarRecommendation
from model.content_based import ContentBasedRecommender
from model.collaborative import CollaborativeRecommender
from model.hybrid import HybridRecommender
import pandas as pd
import os

router = APIRouter()

# Global variables to store models and data
content_model = None
collab_model = None
hybrid_recommender = None
cars_df = None
bookings_df = None

def load_resources():
    global content_model, collab_model, hybrid_recommender, cars_df, bookings_df
    try:
        # Load Data
        cars_df = pd.read_csv("data/cars.csv")
        bookings_df = pd.read_csv("data/bookings.csv")
        
        # Load Models
        content_model = ContentBasedRecommender.load("saved_models/content_model.pkl")
        collab_model = CollaborativeRecommender.load("saved_models/collab_model.pkl")
        
        # Initialize Hybrid
        hybrid_recommender = HybridRecommender(content_model, collab_model)
        hybrid_recommender.load_weights("saved_models/hybrid_weights.json")
        
        return True
    except Exception as e:
        print(f"Error loading resources: {e}")
        return False

@router.post("/recommend", response_model=RecommendResponse)
async def recommend(request: RecommendRequest):
    if hybrid_recommender is None:
        if not load_resources():
            raise HTTPException(status_code=500, detail="Models not loaded")
    
    recs, strategy = hybrid_recommender.get_hybrid_recommendations(
        request.user_id, 
        request.car_id, 
        request.top_n,
        bookings_df,
        cars_df
    )
    
    return RecommendResponse(recommendations=recs, strategy=strategy)

@router.get("/recommend/similar/{car_id}")
async def get_similar(car_id: str, top_n: int = 5):
    if content_model is None:
        if not load_resources():
            raise HTTPException(status_code=500, detail="Models not loaded")
            
    recs = content_model.get_similar_cars(car_id, top_n)
    if not recs:
        raise HTTPException(status_code=404, detail="Car ID not found")
        
    for r in recs:
        r["reason"] = "Similar features"
        
    return {"recommendations": recs}

@router.get("/health")
async def health():
    return {
        "status": "ok", 
        "models_loaded": hybrid_recommender is not None
    }
