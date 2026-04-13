FROM python:3.10-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the code
COPY . .

# Train models during build
RUN python scripts/train_real_data.py

# Expose port and start app
# Render uses the PORT environment variable
ENV PORT=8000
EXPOSE $PORT
CMD ["sh", "-c", "uvicorn api.main:app --host 0.0.0.0 --port ${PORT}"]
