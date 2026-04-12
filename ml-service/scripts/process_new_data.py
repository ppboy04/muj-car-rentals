import pandas as pd
import os
import sqlite3
import re

# Paths are absolute for Windows
WORKSPACE_ROOT = r"c:\Users\hites\OneDrive\Desktop\muj car renting\muj-car-rentals"
CAR_DATA_CSV = os.path.join(WORKSPACE_ROOT, "car_rental_data.csv")
TRANSACTIONS_CSV = os.path.join(WORKSPACE_ROOT, "Vehicle_Rental_Company_Financial_Transactions.csv")
DB_PATH = os.path.join(WORKSPACE_ROOT, "prisma", "dev.db")
ML_DATA_DIR = os.path.join(WORKSPACE_ROOT, "ml-service", "data")

def clean_name(desc):
    if not isinstance(desc, str):
        return "Generic", "Vehicle"
    if '-' in desc:
        parts = desc.split('-', 1)
        brand = parts[0].strip()
        model = parts[1].strip()
    elif ' ' in desc:
        parts = desc.split(' ', 1)
        brand = parts[0].strip()
        model = parts[1].strip()
    else:
        brand = "Generic"
        model = desc
    return brand, model

def process():
    print("Reading datasets...")
    df_cars = pd.read_csv(CAR_DATA_CSV)
    df_trans = pd.read_csv(TRANSACTIONS_CSV)

    # 1. Extract Unique Cars from car_rental_data.csv
    car_details = df_cars.groupby('id_vehicle').agg({
        'desc_vehicle': 'first',
        'selling_value': 'mean',
        'segment': 'first'
    }).reset_index()

    print(f"Found {len(car_details)} unique vehicles.")

    # 2. Update the Prisma Database
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()

    # Get an admin ID (from our seeded user)
    cursor.execute("SELECT id FROM users WHERE role='admin' LIMIT 1")
    res = cursor.fetchone()
    if not res:
        print("Error: No admin user found in DB. Run seed first.")
        return
    admin_id = res[0]

    print(f"Using Admin ID: {admin_id}")

    # Insert cars into DB (ignore if exists)
    for _, car in car_details.iterrows():
        id = car['id_vehicle']
        brand, model = clean_name(car['desc_vehicle'])
        name = brand
        price = car['selling_value'] / 100 
        ctype = "SUV" if "SUV" in str(car['desc_vehicle']).upper() else "Sedan"
        if "HATCH" in str(car['desc_vehicle']).upper() or "ARGO" in str(car['desc_vehicle']).upper():
            ctype = "Hatchback"
        
        cursor.execute("SELECT id FROM cars WHERE id=?", (id,))
        if not cursor.fetchone():
            cursor.execute("""
                INSERT INTO cars (id, name, model, type, hourlyRate, dailyRate, image, description, adminId, updatedAt)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            """, (
                id, name, model, ctype, price/10, price, 
                "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400",
                f"Premium vehicle from the {car['segment']} segment.",
                admin_id
            ))
    
    conn.commit()
    print("Database updated with new cars.")

    # 3. Prepare training data
    ml_cars = []
    for _, car in car_details.iterrows():
        id = car['id_vehicle']
        brand, model = clean_name(car['desc_vehicle'])
        ctype = "SUV" if "SUV" in str(car['desc_vehicle']).upper() else "Sedan"
        if "HATCH" in str(car['desc_vehicle']).upper() or "ARGO" in str(car['desc_vehicle']).upper():
            ctype = "Hatchback"
        
        ml_cars.append({
            'id': id,
            'name': brand,
            'brand': brand,
            'model': model,
            'type': ctype,
            'price': car['selling_value'] / 100,
            'image': "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400"
        })
    
    pd.DataFrame(ml_cars).to_csv(os.path.join(ML_DATA_DIR, "cars.csv"), index=False)
    print("Created ml-service/data/cars.csv")

    # Bookings from car_rental_data.csv
    ml_bookings = df_cars[['id_customer', 'id_vehicle']].rename(columns={
        'id_customer': 'user_id',
        'id_vehicle': 'car_id'
    })
    
    # Interactions from transactions
    desc_to_id = dict(zip(car_details['desc_vehicle'], car_details['id_vehicle']))
    def find_car_id(desc):
        if not isinstance(desc, str): return None
        for d, i in desc_to_id.items():
            if str(d).lower() in desc.lower():
                return i
        return None

    df_trans['car_id'] = df_trans['Description'].apply(find_car_id)
    trans_bookings = df_trans[df_trans['car_id'].notnull()][['Customer', 'car_id']].rename(columns={'Customer': 'user_id'})
    
    final_bookings = pd.concat([ml_bookings, trans_bookings]).drop_duplicates()
    final_bookings.to_csv(os.path.join(ML_DATA_DIR, "bookings.csv"), index=False)
    print(f"Created ml-service/data/bookings.csv with {len(final_bookings)} interactions.")

if __name__ == "__main__":
    process()
