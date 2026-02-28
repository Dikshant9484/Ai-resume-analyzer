async function uploadResume() {

    const fileInput = document.getElementById("resumeFile");
    const loading = document.getElementById("loading");

    if (!fileInput.files.length) {
        alert("Please select a PDF file.");
        return;
    }

    const formData = new FormData();
    formData.append("resume", fileInput.files[0]);

    loading.classList.remove("hidden");

    try {
        const response = await fetch("/upload", {
            method: "POST",
            body: formData
        });

        const data = await response.json();
        alert(data.message || data.error);

    } catch (error) {
        alert("Error uploading resume.");
    }

    loading.classList.add("hidden");
}


async function askQuestion() {

    const questionInput = document.getElementById("question");
    const responseBox = document.getElementById("responseBox");
    const loading = document.getElementById("loading");

    const question = questionInput.value.trim();

    if (!question) {
        alert("Please enter a question.");
        return;
    }

    loading.classList.remove("hidden");

    try {
        const response = await fetch("/ask", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ question: question })
        });

        const data = await response.json();

        if (data.answer) {
            responseBox.innerText = data.answer;
        } else {
            responseBox.innerText = data.error;
        }

    } catch (error) {
        responseBox.innerText = "Error getting response.";
    }

    loading.classList.add("hidden");
}