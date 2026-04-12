from pydantic import BaseModel
from typing import List, Optional

class RecommendRequest(BaseModel):
    user_id: str
    car_id: Optional[str] = None
    top_n: int = 5

class CarRecommendation(BaseModel):
    car_id: str
    score: float
    reason: str

class RecommendResponse(BaseModel):
    recommendations: List[CarRecommendation]
    strategy: str
