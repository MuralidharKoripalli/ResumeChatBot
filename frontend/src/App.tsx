import React, { useState, useEffect } from "react";
import axios from "axios";

const App: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [chatMessages, setChatMessages] = useState<string[]>([]);
  const [message, setMessage] = useState<string>("");
  const [resumes, setResumes] = useState<string[]>([]);
  const [selectedResume, setSelectedResume] = useState<string>("");

  const fetchResumes = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:8000/list-resumes/");
      setResumes(response.data.resumes || []);
    } catch (error) {
      console.error("Error fetching resumes:", error);
      alert("Error fetching resumes.");
    }
  };

  // Handle file selection
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {

      const selectedFile = event.target.files[0];

      if (selectedFile.type !== "application/pdf") {
        alert("Only PDF files are allowed.");
        setFile(null);
        event.target.value = ""; // Reset the file input
        return;
    }
      setFile(event.target.files[0]);
    }
  };

  // Handle file upload
  const handleFileUpload = async () => {
    if (!file) {
      alert("Please select a file first.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://127.0.0.1:8000/uploadfile/", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert(response.data.message);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file.");
    }
  };
  // resume selection
  const handleResumeSelection = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedResume(event.target.value);
  };

  // Handle chat message submission
  const handleSendMessage = async () => {
    if (!message) {
      alert("Please enter a message.");
      return;
    }
    
    try {
      const response = await axios.post("http://127.0.0.1:8000/chat/", { message, resume:selectedResume, }, {
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
      });

      const { message: reply } = response.data;
      setChatMessages((prev) => [...prev, `You: ${message}`, `Bot: ${reply}`]);
      setMessage("");
      setSelectedResume("");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Error sending message.");
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>Resume Chatbot</h1>

      {/* File Upload Section */}
      <div style={{ marginBottom: "20px" }}>
        <h2>Upload a Resume</h2>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleFileUpload}>Upload File</button>
      </div>

      {/* Dropdown for Stored Resumes */}
      <div style={{ marginBottom: "20px" }}>
        <h2>Select a Resume</h2>
        <select value={selectedResume} onChange={handleResumeSelection}>
          <option value="">-- Select a Resume --</option>
          {resumes.map((resume, index) => (
            <option key={index} value={resume}>
              {resume}
            </option>
          ))}
        </select>
      </div>

      {/* Chat Section */}
      <div style={{ marginBottom: "20px" }}>
        <h2>Chat</h2>
        <div
          style={{
            border: "1px solid #ccc",
            padding: "10px",
            height: "200px",
            overflowY: "scroll",
            marginBottom: "10px",
          }}
        >
          {chatMessages.map((msg, index) => {
      const [sender, content] = msg.split(": ", 2); // Split sender and message
      return (
        <div key={index}>
          <b>{sender}</b>: <p>{content}</p>
        </div>
      );
    })}
        </div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>
    </div>
  );
};

export default App;