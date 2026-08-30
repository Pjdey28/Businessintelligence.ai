from pathlib import Path

import faiss
import numpy as np


class VectorStore:
    """
    FAISS-based local vector store for business documents.
    """

    def __init__(self):
        self.index = None
        self.documents: list[dict] = []

    def build(
        self,
        embeddings: np.ndarray,
        documents: list[dict],
    ):

        if len(embeddings) == 0:
            raise ValueError(
                "Cannot build vector store "
                "without embeddings."
            )

        dimension = embeddings.shape[1]

        self.index = faiss.IndexFlatIP(
            dimension
        )

        self.index.add(
            embeddings.astype(
                np.float32
            )
        )

        self.documents = documents

    def search(
        self,
        query_embedding: np.ndarray,
        top_k: int = 3,
    ) -> list[dict]:

        if self.index is None:
            raise RuntimeError(
                "Vector store has not been built."
            )

        query = np.asarray(
            query_embedding,
            dtype=np.float32,
        )

        if query.ndim == 1:
            query = query.reshape(1, -1)

        scores, indices = self.index.search(
            query,
            min(top_k, len(self.documents)),
        )

        results = []

        for score, index in zip(
            scores[0],
            indices[0],
        ):

            if index < 0:
                continue

            document = self.documents[index].copy()

            document["relevance_score"] = round(
                float(score),
                4,
            )

            results.append(document)

        return results