from pathlib import Path

from app.core.config import settings
from app.rag.embeddings import EmbeddingService
from app.rag.vector_store import VectorStore


class RetrievalService:
    """
    Loads business documents, creates their embeddings,
    and retrieves the most relevant evidence for an
    investigation.
    """

    def __init__(self):

        self.embedding_service = (
            EmbeddingService()
        )

        self.vector_store = VectorStore()

        self.documents = self._load_documents()

        self._build_index()

    def _load_documents(self) -> list[dict]:

        document_path = Path(
            settings.document_path
        )

        if not document_path.exists():
            raise FileNotFoundError(
                f"Document directory not found: "
                f"{document_path}"
            )

        documents = []

        for file_path in sorted(
            document_path.glob("*.txt")
        ):

            content = file_path.read_text(
                encoding="utf-8"
            ).strip()

            if not content:
                continue

            documents.append(
                {
                    "source": file_path.name,
                    "content": content,
                    "evidence_type": "business_document",
                }
            )

        if not documents:
            raise ValueError(
                "No business documents found."
            )

        return documents

    def _build_index(self):

        texts = [
            document["content"]
            for document in self.documents
        ]

        embeddings = (
            self.embedding_service.encode(
                texts
            )
        )

        self.vector_store.build(
            embeddings=embeddings,
            documents=self.documents,
        )

    def retrieve(
        self,
        query: str,
        top_k: int = 3,
    ) -> list[dict]:

        query_embedding = (
            self.embedding_service.encode(
                [query]
            )
        )

        return self.vector_store.search(
            query_embedding=query_embedding,
            top_k=top_k,
        )