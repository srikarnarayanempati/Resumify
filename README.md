# Resumify: AI-Powered Resume Intelligence

Resumify is a high-performance, professional resume analyzer designed to help candidates optimize their professional profiles for Applicant Tracking Systems (ATS). Powered by Groq's lightning-fast Llama-3 inference, it provides instant, actionable feedback on resume content, structure, and keyword optimization.

## 🚀 Features

- **Multi-Format Support**: Seamlessly parse PDF, DOCX, and TXT files.
- **Lightning-Fast Analysis**: Leverages Groq's Llama-3.3-70b-versatile model for sub-second report generation.
- **ATS Scoring**: Get a realistic compatibility score out of 100 based on industry standards.
- **Deep Insights**:
  - **Strengths & Weaknesses**: Identify what's working and what needs repair.
  - **Keyword Analysis**: Visualize present vs. missing industry-specific keywords.
  - **Grammar & Formatting**: Automatic detection of structural and linguistic issues.
  - **Job Recommendations**: AI-driven suggestions for roles that match your profile.
- **Modern Dashboard**: A clean, immersive UI built with accessibility and responsiveness in mind.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15+](https://nextjs.org/) (App Router)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [Shadcn UI](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **AI Integration**: [Groq SDK](https://console.groq.com/) & [Genkit](https://firebase.google.com/docs/genkit)
- **Document Parsing**: 
  - `pdf-parse` for PDF extraction
  - `mammoth` for Word (.docx) extraction
- **Validation**: [Zod](https://zod.dev/) for type-safe AI responses

## 🏁 Getting Started

### Prerequisites

- Node.js 18+
- A [Groq API Key](https://console.groq.com/keys)

### Environment Setup

Create a `.env` file in the root directory and add your API key:

```env
GROQ_API_KEY=your_groq_api_key_here
```

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Run the development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:9002](http://localhost:9002) in your browser.

## 🛡️ Privacy & Security

Resumify processes your data locally on the server to extract text and sends only the extracted content to the AI model for analysis. No documents are permanently stored on our servers, ensuring your professional data remains private.

---

Built with ❤️ using Next.js and Groq AI.