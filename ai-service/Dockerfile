# ai-service/Dockerfile

# Base Image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Copy requirements file and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Command to run the application using Uvicorn (FastAPI server)
# Host 0.0.0.0 agar dapat diakses oleh Railway
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

# Ekspos port, meskipun Railway sering mengabaikannya
EXPOSE 8000
