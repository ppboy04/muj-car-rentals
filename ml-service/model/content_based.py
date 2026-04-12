import pandas as pd
import numpy as np
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import MinMaxScaler

class ContentBasedRecommender:
    """
    Content-based filtering using car features: type, fuel_type, transmission, 
    seats, and price_per_day.
    """
    def __init__(self):
        self.cars_df = None
        self.similarity_matrix = None
        self.indices = None
        self.scaler = MinMaxScaler()

    def fit(self, cars_df):
        """
        Build a car-feature matrix and compute pairwise similarity.
        """
        self.cars_df = cars_df.copy()
        
        # 1. Feature Engineering
        # Combine categorical features for TF-IDF
        self.cars_df['content'] = (
            self.cars_df['type'] + " " + 
            self.cars_df['fuel_type'] + " " + 
            self.cars_df['transmission']
        ).str.lower()

        # 2. Text Representation (TF-IDF)
        tfidf = TfidfVectorizer(stop_words='english')
        tfidf_matrix = tfidf.fit_transform(self.cars_df['content'])

        # 3. Numerical Feature Normalization (Price, Seats)
        numerical_features = self.scaler.fit_transform(self.cars_df[['price_per_day', 'seats']])
        
        # 4. Combine Text and Numerical Features
        # We give some weight to numerical features by concatenating them with TF-IDF matrix
        combined_features = np.hstack([tfidf_matrix.toarray(), numerical_features])

        # 5. Compute Cosine Similarity
        self.similarity_matrix = cosine_similarity(combined_features, combined_features)
        
        # Create a mapping of car_id to index
        self.indices = pd.Series(self.cars_df.index, index=self.cars_df['car_id']).drop_duplicates()

    def get_similar_cars(self, car_id, top_n=5):
        """
        Find top N similar cars to the given car_id.
        """
        if car_id not in self.indices:
            return []

        idx = self.indices[car_id]
        
        # Get pairwise similarity scores
        sim_scores = list(enumerate(self.similarity_matrix[idx]))
        
        # Sort by similarity score
        sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
        
        # Exclude the car itself and pick top N
        sim_scores = sim_scores[1:top_n+1]
        
        # Return car IDs and scores
        recommendations = [
            {"car_id": self.cars_df.iloc[i[0]]['car_id'], "score": float(i[1])}
            for i in sim_scores
        ]
        return recommendations

    def save(self, path):
        joblib.dump(self, path)

    @staticmethod
    def load(path):
        return joblib.load(path)
