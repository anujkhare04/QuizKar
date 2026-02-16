# Building the AI Mock Test Feature: Step-by-Step Guide

This guide explains how we built the AI-powered Mock Test feature with voice input. It covers the Backend (AI logic), Frontend (UI & State), and the Voice Recognition integration.

## 🏗️ Architecture Overview

1.  **Backend (`quizbackend`)**:
    *   Uses Google Gemini AI (`gemini-2.5-flash`) to generate topics and evaluate answers.
    *   Enforces `application/json` output for reliable parsing.
    *   Exposes 2 endpoints: `/mock-test/topic` and `/mock-test/evaluate`.

2.  **Frontend (`frontendx`)**:
    *   **Setup Phase**: Users choose a topic or get a random one.
    *   **Testing Phase**: A timed interface where users define their answer via **Text** or **Voice**.
    *   **Result Phase**: Displays AI-generated scores and feedback.

---

## 🚀 Step 1: Backend Implementation

We need two main functions in `src/controller/createquiz.js`.

### 1.1 AI Model Setup
We use `gemini-2.5-flash` because it supports consistent JSON output ("structured generation") and is fast.

**Logic:**
```javascript
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    // CRITICAL: specificy JSON mime type so the AI sends strict JSON
    generationConfig: { responseMimeType: "application/json" }
}, { apiVersion: "v1beta" });
```

### 1.2 Topic Generation (`generateMockTestTopic`)
*   **Goal**: Create a unique topic based on user input or a random theme.
*   **Prompt Engineering**: We ask the AI to "Return ONLY a JSON object" with specific keys (`topic`, `description`, `tips`).
*   **Why**: This allows the Frontend to easily display the "Tip" separately from the "Description".

### 1.3 Answer Evaluation (`evaluateMockTest`)
*   **Goal**: Score the user on 5 criteria: Fluency, Grammar, Vocabulary, Confidence, and Content.
*   **Logic**: We send the `topic` + `userAnswer` to the AI.
*   **Prompt**: "You are an English language examiner... Score the answer (0-10)...".

---

## 🎨 Step 2: Frontend Implementation (`MockTest.jsx`)

The component uses a **3-step state machine**:
`const [step, setStep] = useState('setup'); // 'setup' -> 'testing' -> 'results'`

### 2.1 The "Setup" Step
*   **UI**: Simple input field and "Random" button.
*   **Action**: Calls `generateMockTestTopic` API.
*   **State Change**: On success, saves data to `testData` and moves `step` to `'testing'`.

### 2.2 The "Testing" Step (The Core)
This is where the user answers. It includes a Timer and the Voice Input.

**Timer Logic:**
```javascript
useEffect(() => {
    if (step === 'testing' && timeLeft > 0) {
        // Decrease time every second
        const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
        return () => clearInterval(timer); // Cleanup on unmount
    } else if (timeLeft === 0) {
        handleSubmit(); // Auto-submit when time runs out
    }
}, [timeLeft, step]);
```

### 2.3 🎙️ Voice Input Logic
Allowed users to speak instead of type. We use the browser's native **Web Speech API**.

**Key Challenges & Solutions:**
*   **Challenge**: Updating text in real-time while typing + speaking.
*   **Solution**: We **disable the textarea** while recording. This prevents race conditions where typing might overwrite voice text or vice versa.

**Code Logic:**
1.  **Start**: `recognition.start()` keeps the microphone open.
2.  **Listen**: `recognition.onresult` event fires whenever words are detected.
3.  **Update**: We append the new transcript to the existing `userAnswer`.
    ```javascript
    recognition.onresult = (event) => {
        const transcript = ...; // extract text from event
        setUserAnswer(previousText + " " + transcript);
    };
    ```

### 2.4 The "Results" Step
*   **Action**: Calls `evaluateMockTest` API with the user's final answer.
*   **UI**: Renders the `scores` object returned by the AI using Tailwind CSS for progress bars and badges.

---

## 🔗 Step 3: API Integration (`createApi.jsx`)

We added helper functions in the frontend to talk to the backend.
*   `generateMockTestTopic(topic)` -> POST `/quiz/mock-test/topic`
*   `evaluateMockTest(data)` -> POST `/quiz/mock-test/evaluate`

These wrappers handle the Axios calls and error catching, keeping the UI code clean.

## 📝 Summary of "Why it works"
1.  **JSON Mode**: Solving the "Invalid JSON" error was key. By forcing the AI to speak JSON, we guarantee the app doesn't crash.
2.  **State Management**: Breaking the test into clear steps (`setup`, `testing`, `results`) makes the code easy to follow.
3.  **Native APIs**: Using `SpeechRecognition` meant no extra costs for audio processing 🚀.
