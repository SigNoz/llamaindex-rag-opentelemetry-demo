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
```

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
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result and interact with the application.

## After using the application, you should be able to view traces and logs in your SigNoz Cloud platform:

### Traces
<img width="1106" height="240" alt="Screenshot 2025-08-04 at 12 11 56 PM" src="https://github.com/user-attachments/assets/32521f49-62cd-47a0-9193-e6d50a18075d" />
<img width="1422" height="748" alt="Screenshot 2025-08-04 at 12 15 10 PM" src="https://github.com/user-attachments/assets/d18fa7a8-2d8d-4ab2-9ac7-94af282028c9" />
<img width="1422" height="748" alt="Screenshot 2025-08-04 at 12 15 54 PM" src="https://github.com/user-attachments/assets/4d356941-57f9-491a-9deb-0498abd5f3e7" />
<img width="1422" height="748" alt="Screenshot 2025-08-04 at 12 16 44 PM" src="https://github.com/user-attachments/assets/ffdc67b9-d6e4-4a79-a324-7e72dc2f75dc" />




### Logs
<img width="745" height="304" alt="Screenshot 2025-08-04 at 12 18 09 PM" src="https://github.com/user-attachments/assets/3276a651-9cf9-447c-a8a7-e5d7526febad" />




