import json
import os
import pandas as pd

class HybridRecommender:
    """
    Combines Content-Based and Collaborative models with weighted scoring.
    """
    def __init__(self, content_model, collab_model, alpha=0.6):
        self.content_model = content_model
        self.collab_model = collab_model
        self.alpha = alpha # Weight for collaborative filtering

    def get_hybrid_recommendations(self, user_id, car_id=None, top_n=5, bookings_df=None, cars_df=None):
        """
        Logic:
        1. If user has history (>= 2 bookings) -> Hybrid
        2. If user is new but car_id provided -> Content-based
        3. Else -> Fallback to popular cars
        """
        
        # Check user history
        user_history = []
        if bookings_df is not None:
            user_history = bookings_df[bookings_df['user_id'] == user_id]

        # 1. Hybrid Logic (Existing Users)
        if len(user_history) >= 2:
            collab_recs = self.collab_model.get_user_recommendations(user_id, top_n=20)
            
            # If we have a car_id, we can incorporate content similarity for those collab recs
            hybrid_recs = []
            
            # Normalize collab scores to be similar in scale to content scores
            # Collab scores (SVD) are 1-5, Content scores are 0-1
            for rec in collab_recs:
                collab_score = (rec['score'] - 1) / 4.0 # Scale to 0-1
                
                content_score = 0
                if car_id:
                    # Find content score for this specific car relative to current car
                    sim_cars = self.content_model.get_similar_cars(car_id, top_n=50)
                    for sc in sim_cars:
                        if sc['car_id'] == rec['car_id']:
                            content_score = sc['score']
                            break
                
                final_score = (self.alpha * collab_score) + ((1 - self.alpha) * content_score)
                hybrid_recs.append({
                    "car_id": rec["car_id"], 
                    "score": float(final_score),
                    "reason": "Based on your booking history"
                })
            
            hybrid_recs = sorted(hybrid_recs, key=lambda x: x['score'], reverse=True)
            return hybrid_recs[:top_n], "hybrid"

        # 2. Content-Based Logic (New User + Car Context)
        elif car_id:
            recs = self.content_model.get_similar_cars(car_id, top_n=top_n)
            for r in recs:
                r["reason"] = "Similar to cars you viewed"
            return recs, "content_based"

        # 3. Fallback Logic (Cold Start - Popular Cars)
        else:
            if cars_df is not None:
                # Top rated available cars
                popular = cars_df[cars_df['available'] == True].sort_values(by='rating', ascending=False)
                recs = [
                    {"car_id": row['car_id'], "score": float(row['rating'])/5.0, "reason": "Top rated on platform"}
                    for _, row in popular.head(top_n).iterrows()
                ]
                return recs, "popularity"
            
            return [], "none"

    def save_weights(self, path):
        with open(path, 'w') as f:
            json.dump({"alpha": self.alpha}, f)

    def load_weights(self, path):
        if os.path.exists(path):
            with open(path, 'r') as f:
                data = json.load(f)
                self.alpha = data.get("alpha", 0.6)
