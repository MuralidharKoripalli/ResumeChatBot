# Resume ChatBot

## Overview
ResumeChatBot is an AI-powered chatbot application that allows users to upload resumes in PDF format, select a resume, and interact with the chatbot for detailed information extracted from the selected resume. The chatbot is built using **FastAPI** for the backend and integrates with Google Cloud services to manage resume uploads. The frontend is developed using React.

## Features
- Upload resumes (PDF files only).
- Store resumes in Google Cloud Storage.
- Select a resume from the dropdown to interact with.
- AI-powered chat functionality using the uploaded or selected resume.

## Tech Stack
- **Frontend**: React (TypeScript)
- **Backend**: FastAPI (Python)
- **Cloud Services**: Google Cloud Storage
- **AI Integration**: Gemini Model

## Prerequisites
Before setting up the project, ensure you have the following installed:

- Python 3.13+
- Node.js 16+
- Google Cloud SDK
- `pip` (Python package manager)
- `npm` or `yarn` (Node package manager)
- Google Cloud credentials with appropriate access

## Installation

### Backend Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/MuralidharKoripalli/ResumeChatBot.git
   cd ResumeChatBot/backend
   ```

2. Set up a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate # On Windows: venv\Scripts\activate
   ```

3. Install the dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure Google Cloud:
   - Ensure your Google Cloud project has a storage bucket.
   - Download the service account key JSON file.
   - Set the environment variable for credentials:
     ```bash
     export GOOGLE_APPLICATION_CREDENTIALS="path/to/your/credentials.json"
     ```

5. Update `.env` file:
   Create a `.env` file in the `backend` folder and add the following:
   ```env
   GCS_BUCKET_NAME=<your-google-cloud-storage-bucket-name>
   ```

6. Run the FastAPI server:
   ```bash
   uvicorn main:app --reload
   ```
   The backend will be available at `http://127.0.0.1:8000`.

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```

2. Install the dependencies:
   ```bash
   npm install
   ```

3. Start the React development server:
   ```bash
   npm start
   ```
   The frontend will be available at `http://localhost:5173`.

## Usage

1. **Upload Resume**:
   - Navigate to the application in your browser.
   - Use the "Upload a Resume" section to upload a PDF file.

2. **Select Resume**:
   - After uploading, the resume will appear in the dropdown.
   - Select a resume to activate it for chat.

3. **Chat**:
   - Enter a message in the chatbox and interact with the AI chatbot.
   - The chatbot will respond based on the selected resume.

## Project Structure

```plaintext
ResumeChatBot
├── backend
│   ├── main.py            # FastAPI application
│   ├── requirements.txt   # Python dependencies
│   ├── .env               # Environment variables
│   └── ...                # Other backend files
├── frontend
│   ├── src
│   │   ├── App.tsx        # Main React component
│   │   └── ...            # Other frontend components
│   ├── package.json       # Node.js dependencies
│   └── ...                # Other frontend files
└── README.md              # Project documentation
```

## Contributing

1. Fork the repository.
2. Create a new branch for your feature/bug fix:
   ```bash
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add feature-name"
   ```
4. Push to the branch:
   ```bash
   git push origin feature-name
   ```
5. Open a pull request.
