# backend/load_dataset.py
from datasets import load_dataset

dataset = load_dataset("TheRealOKAI/Anti-Atheistv0.1", split="train")

# Convert to list for fast lookup
qa_pairs = []
for item in dataset:
    qa_pairs.append({
        "question": item["question"].lower(),
        "response": item["response"]
    })