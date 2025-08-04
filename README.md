# llamaindex-rag-demo
Using OpenInference and OpenTelemetry to send logs and traces from your LlamaIndex app to Signoz

## Getting Started
First, install all the necessary dependencies for the backend:

*Optional*
Create Python virtual env
```bash
python -m venv myenv && \
source myenv/bin/activate
```

```bash
pip install -r requirements.txt
```

Install all the necessary dependencies for the frontend:
```bash
cd rag-frontend && \
npm install
'''

Next create a .env file with the following(in root directory):
```bash
OPENAI_API_KEY=<your-openai-api-key>
SIGNOZ_INGESTION_KEY=<your-signoz-ingestion-key>
```

Run the backend:
```bash
uvicorn main:app --reload
```

Wait for the docs to be fully ingested and for the application startup to complete:
<img width="909" height="428" alt="Screenshot 2025-08-04 at 12 07 45 PM" src="https://github.com/user-attachments/assets/23d865e3-16ef-4eca-b0d3-6aa26f1bcf2e" />


Run the frontend:
```bash
cd rag-frontend && \
npm start
'''

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result and interact with the application.

## After using the application, you should be able to view traces and logs in your SigNoz Cloud platform:



