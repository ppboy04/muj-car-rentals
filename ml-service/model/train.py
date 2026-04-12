import pandas as pd
import os
import sys

# Add the project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from model.content_based import ContentBasedRecommender
from model.collaborative import CollaborativeRecommender

def main():
    print("Initializing training pipeline...")
    
    # 1. Load Data
    try:
        cars_df = pd.read_csv("ml-service/data/cars.csv")
        bookings_df = pd.read_csv("ml-service/data/bookings.csv")
    except Exception as e:
        print(f"Error loading CSVs: {e}")
        return

    print(f"Dataset Summary:")
    print(f"   - Cars: {cars_df.shape[0]} unique vehicles")
    print(f"   - Bookings: {bookings_df.shape[0]} total records")
    print(f"   - Unique Users: {bookings_df['user_id'].nunique()}")

    # Ensure output directory exists
    os.makedirs("ml-service/saved_models", exist_ok=True)

    # 2. Train Content-Based Model
    print("Training Content-Based Model...")
    content_recommender = ContentBasedRecommender()
    content_recommender.fit(cars_df)
    content_recommender.save("ml-service/saved_models/content_model.pkl")
    print("Content-Based Model saved.")

    # 3. Train Collaborative Model
    print("Training Collaborative (SVD) Model...")
    collab_recommender = CollaborativeRecommender()
    collab_recommender.fit(bookings_df)
    collab_recommender.save("ml-service/saved_models/collab_model.pkl")
    print("Collaborative Model saved.")

    print("\nTraining complete! Models are ready.")

if __name__ == "__main__":
    main()
