from flask import Flask, render_template, request, jsonify
from helper import (
    get_pdf_text,
    get_text_chunks,
    get_vector_store,
    get_conversational_chain
)

app = Flask(__name__)

# This will store the RAG chain after resume upload
conversation_chain = None


@app.route("/")
def home():
    return render_template("index.html")


# ---------------- Upload Resume ---------------- #

@app.route("/upload", methods=["POST"])
def upload_resume():
    global conversation_chain

    if "resume" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["resume"]

    # Process Resume using helper.py
    text = get_pdf_text(file)
    chunks = get_text_chunks(text)
    vector_store = get_vector_store(chunks)
    conversation_chain = get_conversational_chain(vector_store)

    return jsonify({"message": "Resume processed successfully"})


# ---------------- Ask Question ---------------- #

@app.route("/ask", methods=["POST"])
def ask_question():
    global conversation_chain

    if conversation_chain is None:
        return jsonify({"error": "Please upload resume first"}), 400

    data = request.json
    question = data.get("question")

    if not question:
        return jsonify({"error": "No question provided"}), 400

    response = conversation_chain.invoke({"question": question})

    return jsonify({"answer": response["answer"]})


if __name__ == "__main__":
    app.run()