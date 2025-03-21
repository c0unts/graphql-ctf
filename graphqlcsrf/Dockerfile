FROM python:3.9-slim

# Set the working directory to /app
WORKDIR /app

# Install the dependencies
RUN pip install mysql-connector-python ariadne uvicorn

# Copy the application code
COPY . .

ENTRYPOINT ["uvicorn", "main:app", "--host", "0.0.0.0"]
