FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY check_inquiry_api.py .

ENTRYPOINT ["python", "check_inquiry_api.py"]
