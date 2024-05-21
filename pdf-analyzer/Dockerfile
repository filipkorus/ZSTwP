FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY main.py .
COPY pdf_files/requirements/output.pdf ./pdf_files/requirements/output.pdf

ENTRYPOINT ["python", "main.py"]
