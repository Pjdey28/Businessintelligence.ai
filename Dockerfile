# Use a lightweight Python base image
FROM python:3.12-slim

# Prevent Python from writing .pyc files and force stdout logging
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Set the root working directory inside the container
WORKDIR /app

# Install dependencies first (this caches the layer to save build time)
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy your actual application files into the container
COPY backend/ ./backend/
COPY data/ ./data/

# Change the working directory to backend so your relative paths (../data) work perfectly
WORKDIR /app/backend

# Expose the port FastAPI will run on
EXPOSE 8000

# Start the FastAPI server
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]