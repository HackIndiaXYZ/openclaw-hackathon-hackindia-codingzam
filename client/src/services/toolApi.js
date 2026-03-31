import apiClient from "./apiClient";

const postJson = (path, payload) => apiClient.post(`/api/tools/${path}`, payload);

export const toolApi = {
  generateEmail: (payload) => postJson("email-generator", payload),
  assignmentHelper: (payload) => postJson("assignment-helper", payload),
  resumePolisher: (payload) => postJson("resume-polisher", payload),
  coverLetterBuilder: (payload) => postJson("cover-letter-builder", payload),
  linkedinHeadline: (payload) => postJson("linkedin-headline", payload),
  interviewQuestionBank: (payload) => postJson("interview-question-bank", payload),
  studyPlan: (payload) => postJson("study-plan", payload),
  codeGenerator: (payload) => postJson("code-generator", payload),
  grammarChecker: (payload) => postJson("grammar-checker", payload),
  notesSummarizer: (payload) => postJson("notes-summarizer", payload),
  chatAssistant: (payload) => postJson("chat-assistant", payload),
  smartGoalPlan: (payload) => postJson("smart-goal-plan", payload),
  projectIdeas: (payload) => postJson("project-ideas", payload),
  imageGenerator: (payload) => postJson("image-generator", payload),
};

const toBlobDownload = (response, filename) => {
  const blob = new Blob([response.data], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const pdfApi = {
  merge: async (files) => {
    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    const response = await apiClient.post("/api/tools/pdf/merge", formData, { responseType: "blob" });
    toBlobDownload(response, "merged.pdf");
  },
  split: async (file, page) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("page", String(page));
    const response = await apiClient.post("/api/tools/pdf/split", formData, { responseType: "blob" });
    toBlobDownload(response, "split-page.pdf");
  },
  compress: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    const response = await apiClient.post("/api/tools/pdf/compress", formData, { responseType: "blob" });
    toBlobDownload(response, "compressed.pdf");
  },
  overlay: async (file, text, page = 1, x = 50, y = 50) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("text", text);
    formData.append("page", String(page));
    formData.append("x", String(x));
    formData.append("y", String(y));
    const response = await apiClient.post("/api/tools/pdf/overlay", formData, { responseType: "blob" });
    toBlobDownload(response, "edited.pdf");
  },
  frontPage: async (file, payload, logoFile = null) => {
    const formData = new FormData();
    formData.append("file", file);
    if (logoFile) {
      formData.append("logo", logoFile);
    }
    Object.entries(payload || {}).forEach(([key, value]) => {
      if (key === "customElements") {
        formData.append(key, JSON.stringify(value || []));
        return;
      }
      formData.append(key, String(value || ""));
    });
    const response = await apiClient.post("/api/tools/pdf/front-page", formData, { responseType: "blob" });
    toBlobDownload(response, "front-page-edited.pdf");
  },
};

