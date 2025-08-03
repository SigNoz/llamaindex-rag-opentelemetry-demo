import dotenv
from llama_index.core import SimpleDirectoryReader, VectorStoreIndex
from llama_index.llms.openai import OpenAI
from llama_index.embeddings.openai import OpenAIEmbedding
from opentelemetry.exporter.otlp.proto.http.trace_exporter import (
    OTLPSpanExporter,
)
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor, SimpleSpanProcessor
from opentelemetry.sdk.trace.export import ConsoleSpanExporter
from opentelemetry import trace
import os
import asyncio
from opentelemetry.sdk.resources import Resource
from openinference.instrumentation.llama_index import LlamaIndexInstrumentor
from fastapi import FastAPI, Request
from pydantic import BaseModel
from telemetry import configure_logging
import logging



dotenv.load_dotenv()

##OPEN INFERENCE
resource = Resource.create({"service.name": "llamaindex-rag-app-openinference"})
provider = TracerProvider(resource=resource)
span_exporter = OTLPSpanExporter(
    endpoint="https://ingest.in.signoz.cloud:443/v1/traces",
    headers={"signoz-ingestion-key": os.getenv("SIGNOZ_INGESTION_KEY")},
)
provider.add_span_processor(BatchSpanProcessor(span_exporter))
# console_exporter = ConsoleSpanExporter()
# provider.add_span_processor(BatchSpanProcessor(console_exporter))

LlamaIndexInstrumentor().instrument(tracer_provider=provider)


logger = logging.getLogger(__name__)

app = FastAPI()
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

query_engine = None

class QueryRequest(BaseModel):
    prompt: str

configure_logging()

@app.on_event("startup")
async def startup_event():
    global query_engine
    print("📄 Loading documents and building RAG index...")
    embed_model = OpenAIEmbedding(model_name="text-embedding-3-small")
    llm = OpenAI(model="gpt-4.1-mini")
    documents = SimpleDirectoryReader(input_dir="./docs/", recursive=True).load_data()
    index = VectorStoreIndex.from_documents(documents, embed_model=embed_model)

    # Access the internal docstore
    docstore = index.docstore 

    # Get all nodes (documents with embeddings or raw text)
    all_nodes = list(docstore.docs.values()) 
    print(f"Total nodes: {len(all_nodes)}")
    logger.info(
        "docs/ embedded and index built.",
        extra={
            "number_of_chunks": len(all_nodes),
        }
    )

    SIMILARITY_TOP_K = 2
    query_engine = index.as_query_engine(llm=llm, similarity_top_k=SIMILARITY_TOP_K)

    logger.info(
            "Querying user request against docs/",
            extra={
                "similarity_top_k": SIMILARITY_TOP_K,
            }
        )

    print("✅ Index ready.")

@app.post("/query")
async def query(request: QueryRequest):
    if query_engine is None:
        return {"error": "Query engine is not initialized."}

    result = query_engine.query(request.prompt)
    return {
        "response": result.response,
        "type": str(type(result))
    }

@app.post("/feedback")
async def feedback(request: Request):
    try:
        body = await request.json()
        user_feedback = body.get("feedback")
        if user_feedback not in ["up", "down"]:
            return {"error": "Invalid feedback. Must be 'up' or 'down'."}


        logger.info(
            "Feedback received from user.",
            extra={
                "response.user.feedback": user_feedback,
            }
        )

        return {"message": f"Feedback received: {user_feedback}"}
    except Exception as e:
        return {"error": str(e)} # Handle unexpected errors
