import pandas as pd
import numpy as np
import os
import sys

# Add the project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from model.content_based import ContentBasedRecommender
from model.collaborative import CollaborativeRecommender

def map_vehicle_attributes(desc):
    desc = str(desc).upper()
    
    # Heuristic for Car Type
    if any(x in desc for x in ["HILUX", "SAVEIRO", "STRADA", "OROCH", "S10", "TRITON"]):
        car_type = "Pickup"
    elif any(x in desc for x in ["GOL", "ARGO", "SANDERO", "MOBI", "KA", "POLO", "HB20"]):
        car_type = "Hatchback"
    elif any(x in desc for x in ["CIVIC", "VERSA"]):
        car_type = "Sedan"
    elif any(x in desc for x in ["RENEGADE", "DUSTER"]):
        car_type = "SUV"
    else:
        car_type = "SUV"
        
    # transmission
    if any(x in desc for x in ["GOL", "SAVEIRO", "STRADA", "MOBI", "ARGO", "KA", "POLO", "SANDERO"]):
        transmission = "Manual"
    else:
        transmission = "Automatic"
        
    # Fuel Type
    if "FLEX" in desc:
        fuel = "Flex"
    elif any(x in desc for x in ["DSL", "DIESEL", "D 4X4"]):
        fuel = "Diesel"
    else:
        fuel = "Petrol"
        
    return pd.Series([car_type, fuel, transmission, 5])

def main():
    print("Loading real datasets...")
    ml_service_path = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    
    car_rental_path = os.path.join(ml_service_path, "data", "raw", "car_rental_data.csv")
    transactions_path = os.path.join(ml_service_path, "data", "raw", "Vehicle_Rental_Company_Financial_Transactions.csv")
    
    try:
        rental_data = pd.read_csv(car_rental_path)
        transactions = pd.read_csv(transactions_path)
    except Exception as e:
        print(f"Error loading datasets: {e}")
        return

    print("Preprocessing Car Features...")
    # Unique vehicles from car mapping
    cars_df = rental_data[['id_vehicle', 'desc_vehicle']].drop_duplicates().copy()
    cars_df = cars_df.rename(columns={'id_vehicle': 'car_id'})
    
    # Extract attributes
    cars_df[['type', 'fuel_type', 'transmission', 'seats']] = cars_df['desc_vehicle'].apply(map_vehicle_attributes)
    
    # We will simulate a price per day using a base multiplier of the car_id hash or just flat 2000 to keep it scaling
    cars_df['price_per_day'] = 2500.0  # Default scale for all
    
    # Set defaults expected by fallback logic
    cars_df['rating'] = 5.0
    cars_df['available'] = True
    
    print(f"Generated {len(cars_df)} unique cars for content model.")
    
    # Save cars dataset for API to use
    cars_out_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "cars.csv")
    cars_df.to_csv(cars_out_path, index=False)
    print(f"Saved generated cars to {cars_out_path}")
    
    # Preprocessing Bookings and Ratings
    print("Preprocessing Bookings for Collaborative Filtering...")
    # Filter only rentals
    rentals = transactions[transactions['Transaction Type'] == 'Rental'].copy()
    
    # The 'Description' format is "Rental of [desc_vehicle]". We can extract it:
    rentals['desc_vehicle'] = rentals['Description'].str.replace('Rental of ', '', regex=False)
    
    # Use grouped counts to determine a rating
    user_counts = rentals.groupby(['Customer', 'desc_vehicle']).size().reset_index(name='rental_count')
    
    # Merge with cars_df to get the car_id
    bookings_df = pd.merge(user_counts, cars_df, on='desc_vehicle', how='inner')
    bookings_df = bookings_df.rename(columns={'Customer': 'user_id'})
    
    # Scale rental_counts to a rating 1-5 where frequent rentals == higher rating
    bookings_df['rating_given'] = pd.qcut(bookings_df['rental_count'], q=5, labels=[1, 2, 3, 4, 5], duplicates='drop').astype(float)
    
    print(f"Generated {len(bookings_df)} synthetically rated connections.")
    
    # Save bookings dataset for API to use
    bookings_out_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "bookings.csv")
    bookings_df.to_csv(bookings_out_path, index=False)
    print(f"Saved generated bookings to {bookings_out_path}")
    
    os.makedirs(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "saved_models"), exist_ok=True)
    
    print("\nTraining Content-Based Model...")
    content_recommender = ContentBasedRecommender()
    content_recommender.fit(cars_df)
    model_path_c = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "saved_models", "content_model.pkl")
    content_recommender.save(model_path_c)
    print(f"Saved to {model_path_c}")
    
    print("\nTraining Collaborative (SVD) Model...")
    collab_recommender = CollaborativeRecommender()
    collab_recommender.fit(bookings_df)
    model_path_cf = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "saved_models", "collab_model.pkl")
    collab_recommender.save(model_path_cf)
    print(f"Saved to {model_path_cf}")
    
    print("\nTraining complete! Your real data hybrid model is ready to use.")

if __name__ == "__main__":
    main()
