import pandas as pd
import numpy as np
import random
from datetime import datetime, timedelta

# Set seed for reproducibility
random.seed(42)
np.random.seed(42)

def generate_data():
    # 1. Generate Cars Data
    car_types = ["Sedan", "SUV", "Hatchback", "XUV"]
    fuel_types = ["Petrol", "Diesel", "Electric", "Hybrid"]
    transmissions = ["Automatic", "Manual"]
    makes = ["Maruti Suzuki", "Hyundai", "Tata", "Mahindra", "Toyota", "Honda", "Kia"]
    models = {
        "Maruti Suzuki": ["Swift", "Baleno", "Desire", "Ertiga", "Brezza"],
        "Hyundai": ["i20", "Creta", "Verna", "Venue"],
        "Tata": ["Nexon", "Punch", "Harrier", "Safari"],
        "Mahindra": ["Thar", "XUV700", "Scorpio", "Bolero"],
        "Toyota": ["Fortuner", "Innova", "Glanza"],
        "Honda": ["City", "Amaze"],
        "Kia": ["Seltos", "Sonet", "Carens"]
    }

    cars = []
    for i in range(1, 51):
        make = random.choice(makes)
        model = random.choice(models[make])
        car_type = random.choice(car_types)
        fuel = random.choice(fuel_types)
        trans = random.choice(transmissions)
        seats = 5 if car_type in ["Sedan", "Hatchback"] else random.choice([7, 8])
        price = random.randint(1500, 6000)
        
        cars.append({
            "car_id": f"car_{i}",
            "make": make,
            "model": model,
            "year": random.randint(2018, 2024),
            "type": car_type,
            "fuel_type": fuel,
            "transmission": trans,
            "seats": seats,
            "price_per_day": price,
            "rating": round(random.uniform(3.5, 5.0), 1),
            "available": True
        })

    cars_df = pd.DataFrame(cars)
    cars_df.to_csv("ml-service/data/cars.csv", index=False)
    print(f"Generated {len(cars)} cars in ml-service/data/cars.csv")

    # 2. Generate Bookings Data
    users = [f"user_{i}" for i in range(1, 31)]
    bookings = []
    
    start_date = datetime(2023, 1, 1)
    
    for i in range(1, 301):
        user_id = random.choice(users)
        car = random.choice(cars)
        car_id = car["car_id"]
        
        rental_days = random.randint(1, 7)
        total_price = car["price_per_day"] * rental_days
        
        booking_days_ago = random.randint(0, 365)
        b_date = start_date + timedelta(days=booking_days_ago)
        r_date = b_date + timedelta(days=rental_days)
        
        status = random.choices(["completed", "cancelled"], weights=[0.9, 0.1])[0]
        rating = random.randint(3, 5) if status == "completed" else np.nan
        
        bookings.append({
            "booking_id": f"bk_{i}",
            "user_id": user_id,
            "car_id": car_id,
            "rental_days": rental_days,
            "total_price": total_price,
            "booking_date": b_date.strftime("%Y-%m-%d"),
            "return_date": r_date.strftime("%Y-%m-%d"),
            "rating_given": rating,
            "status": status
        })

    bookings_df = pd.DataFrame(bookings)
    bookings_df.to_csv("ml-service/data/bookings.csv", index=False)
    print(f"Generated {len(bookings)} bookings in ml-service/data/bookings.csv")

if __name__ == "__main__":
    generate_data()
