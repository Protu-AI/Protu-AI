# Protu: Your Personal AI-Powered Learning Platform

**Protu is a full-stack web application designed to transform the way we learn, turning static content into a dynamic, interactive, and personalized educational experience.**

This repository contains the complete source code for the Protu platform, including the frontend, backend, and the advanced AI services that power its core features.

---

## ✨ High-Level Features

Protu is more than just a chatbot; it's a complete learning ecosystem with a rich set of features:

* **📚 Content-Rich Learning Tracks:** Access a library of static content covering essential programming and software engineering tracks like Frontend, Backend, and Data Science.
* **🤖 Expert Programming Chatbot:** Engage in intelligent conversations with an AI tutor that is strictly focused on programming topics.
* **📄 Chat with Your Documents:** Upload your own learning materials (PDFs, notes) and ask questions directly from the content using a powerful RAG pipeline.
* **🧠 Smart Quiz Generation:** Create custom quizzes based on your learning goals. The AI helps you refine topics and generates high-quality questions tailored to your needs.
* **🚀 Personalized Feedback & Learning Paths:** Receive detailed feedback on your quiz performance, including explanations for incorrect answers and course recommendations to strengthen your areas of weakness.
* **💬 Organized Chat History:** All your conversations are automatically titled and saved, making it easy to find and review past sessions.

---

## 🧠 The AI Engine: A Deeper Look

The heart of Protu is its sophisticated AI engine, which is composed of two primary services built with a modular, scalable architecture.

### 1. The Core Chat Service

This service powers all conversational interactions on the platform.

* **Conversational RAG:** The chatbot uses a **Retrieval-Augmented Generation (RAG)** pipeline to provide fact-based answers. It's powered by **`gemini-2.5-flash`** and uses **Qdrant** as its vector database to search through user-uploaded documents. A key feature is its strict focus: the chatbot is engineered to **politely decline any queries not related to programming**.

* **Intelligent Agents:** To enhance the chat experience, two specialized agents are used:
    * **Memory Summarization Agent:** Uses the highly efficient `gemma2-9b-it` model to summarize the conversation history, providing the main LLM with context while drastically reducing input token usage.
    * **AI Title Generation Agent:** A `CrewAI` agent that analyzes the conversation and automatically generates a concise, relevant title for easy navigation of chat history.

### 2. The Multi-Agent Quiz & Feedback Service

This service uses a team of specialized AI agents, built with **CrewAI** and powered by the high-throughput **`gemini-2.0-flash-lite`**, to create a complete, three-step learning loop.

* **Step 1: Topic Generation & Validation:**
    * The user provides a prompt (e.g., "a quiz on Python basics") and preferences.
    * The **Tag Suggestion Agent** first validates that the topic is programming-related. If it is, the agent generates a list of specific subtopics for the quiz.

* **Step 2: Collaborative Quiz Creation:**
    * The user selects from the generated tags and can add their own preferences.
    * A two-agent crew takes over: the **Tag Filtering Agent** ensures all topics are relevant, and the **Quiz Generation Agent** builds a high-quality, custom quiz based on the final, curated list.

* **Step 3: Personalized Feedback & Learning Path:**
    * After the user solves the quiz, a final two-agent crew provides a detailed report.
    * The **Weakness Analysis Agent** identifies topics from the user's incorrect answers and uses a RAG tool to find relevant courses from our database.
    * The **Recommendation Agent** then synthesizes this information into a full report containing detailed explanations for every wrong answer and a curated list of course recommendations to strengthen the user's areas of weakness.

---
