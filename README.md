# Python OOP Learning Platform

An interactive learning platform for mastering Object-Oriented Programming in Python. Features include live chat assistance, code execution, progress tracking, and personalized learning paths.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18.0.0 or higher)
- npm (v9.0.0 or higher)
- Git

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

## Installation Steps

1. Clone the repository
```bash
git clone https://github.com/kushank1207/ai-teacher-app.git
cd ai-teacher-app
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env.local
```

4. Run the development server
```bash
npm run dev
```

5. Open your browser and navigate to
```
http://localhost:3000
```