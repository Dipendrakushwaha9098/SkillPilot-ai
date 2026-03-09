import { useState, createContext, useContext, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
}

interface Assessment {
  skillLevel: string;
  interest: string;
  goal: string;
  dailyTime: string;
}

interface RoadmapTopic {
  id: string;
  title: string;
  description: string;
  week: number;
  completed: boolean;
  resources: string[];
  exercises: string[];
  project?: string;
}

interface Roadmap {
  title: string;
  duration: string;
  topics: RoadmapTopic[];
}

interface AuthContextType {
  user: User | null;
  assessment: Assessment | null;
  roadmap: Roadmap | null;
  completedTopics: string[];
  login: (email: string, password: string) => void;
  signup: (name: string, email: string, password: string) => void;
  logout: () => void;
  setAssessment: (a: Assessment) => void;
  generateRoadmap: (a: Assessment) => void;
  toggleTopicComplete: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};

const generateMockRoadmap = (assessment: Assessment): Roadmap => {
  const { interest, skillLevel } = assessment;
  
  const topicsByInterest: Record<string, RoadmapTopic[]> = {
    "Web Development": [
      { id: "1", title: "HTML & CSS Foundations", description: "Master semantic HTML5 and modern CSS3 including Flexbox and Grid layouts.", week: 1, completed: false, resources: ["MDN Web Docs", "CSS Tricks"], exercises: ["Build a portfolio page", "Recreate a landing page"], project: "Personal Portfolio Website" },
      { id: "2", title: "JavaScript Essentials", description: "Learn core JavaScript concepts: variables, functions, DOM manipulation, and async programming.", week: 2, completed: false, resources: ["JavaScript.info", "Eloquent JavaScript"], exercises: ["Todo app", "Calculator"], project: "Interactive Quiz App" },
      { id: "3", title: "React Fundamentals", description: "Component-based architecture, hooks, state management, and routing.", week: 3, completed: false, resources: ["React Docs", "React Patterns"], exercises: ["Build a counter", "Create a form"], project: "Task Management App" },
      { id: "4", title: "State Management & APIs", description: "Learn Redux/Context API and RESTful API integration with fetch/axios.", week: 4, completed: false, resources: ["Redux Toolkit Docs", "TanStack Query"], exercises: ["API integration", "Global state"], project: "Weather Dashboard" },
      { id: "5", title: "Backend with Node.js", description: "Build REST APIs with Express.js, middleware, and authentication.", week: 5, completed: false, resources: ["Node.js Docs", "Express Guide"], exercises: ["CRUD API", "Auth system"], project: "Blog API" },
      { id: "6", title: "Database Design", description: "SQL and NoSQL databases, schema design, and ORM usage.", week: 6, completed: false, resources: ["MongoDB University", "PostgreSQL Tutorial"], exercises: ["Design schemas", "Write queries"], project: "E-commerce Database" },
      { id: "7", title: "Authentication & Security", description: "JWT, OAuth, password hashing, CORS, and security best practices.", week: 7, completed: false, resources: ["OWASP Guide", "Auth0 Docs"], exercises: ["Implement JWT", "OAuth flow"], project: "Secure Auth System" },
      { id: "8", title: "Testing & Deployment", description: "Unit testing, integration testing, CI/CD, and cloud deployment.", week: 8, completed: false, resources: ["Vitest Docs", "Vercel Docs"], exercises: ["Write tests", "Set up CI"], project: "Deploy Full Stack App" },
      { id: "9", title: "Advanced Patterns", description: "Performance optimization, SSR, PWA, and architectural patterns.", week: 10, completed: false, resources: ["Web.dev", "Patterns.dev"], exercises: ["Optimize bundle", "Add PWA"], project: "Progressive Web App" },
      { id: "10", title: "Capstone Project", description: "Build a complete full-stack application from scratch.", week: 12, completed: false, resources: ["All previous resources"], exercises: ["Plan architecture", "Implement features"], project: "Full-Stack SaaS Application" },
    ],
    "AI": [
      { id: "1", title: "Python for AI", description: "Python fundamentals, NumPy, Pandas for data manipulation.", week: 1, completed: false, resources: ["Python.org", "NumPy Docs"], exercises: ["Data manipulation", "Statistical analysis"], project: "Data Analysis Script" },
      { id: "2", title: "Mathematics for ML", description: "Linear algebra, calculus, probability, and statistics foundations.", week: 2, completed: false, resources: ["3Blue1Brown", "Khan Academy"], exercises: ["Matrix operations", "Gradient descent"], project: "Math Visualization Tool" },
      { id: "3", title: "Machine Learning Basics", description: "Supervised learning, regression, classification algorithms.", week: 4, completed: false, resources: ["Scikit-learn Docs", "Andrew Ng's Course"], exercises: ["Train a model", "Feature engineering"], project: "House Price Predictor" },
      { id: "4", title: "Deep Learning", description: "Neural networks, CNNs, RNNs with TensorFlow/PyTorch.", week: 6, completed: false, resources: ["PyTorch Tutorials", "Deep Learning Book"], exercises: ["Build a CNN", "Image classifier"], project: "Image Recognition App" },
      { id: "5", title: "NLP & Transformers", description: "Text processing, transformers, LLMs, and prompt engineering.", week: 8, completed: false, resources: ["Hugging Face", "OpenAI Docs"], exercises: ["Sentiment analysis", "Chatbot"], project: "AI Chatbot" },
      { id: "6", title: "AI Capstone", description: "End-to-end AI project with deployment.", week: 12, completed: false, resources: ["MLOps Guide", "FastAPI Docs"], exercises: ["Design pipeline", "Deploy model"], project: "AI-Powered Web App" },
    ],
    "Data Science": [
      { id: "1", title: "Data Fundamentals", description: "Statistics, probability, and data literacy.", week: 1, completed: false, resources: ["Khan Academy", "Statistics How To"], exercises: ["Statistical tests", "Distributions"], project: "Statistical Report" },
      { id: "2", title: "Python & Pandas", description: "Data wrangling, cleaning, and transformation.", week: 2, completed: false, resources: ["Pandas Docs", "Real Python"], exercises: ["Clean datasets", "Merge data"], project: "Data Cleaning Pipeline" },
      { id: "3", title: "Data Visualization", description: "Matplotlib, Seaborn, Plotly for compelling visualizations.", week: 4, completed: false, resources: ["Plotly Docs", "Storytelling with Data"], exercises: ["Create dashboards", "Tell data stories"], project: "Interactive Dashboard" },
      { id: "4", title: "Machine Learning", description: "Predictive modeling and algorithm selection.", week: 6, completed: false, resources: ["Scikit-learn", "Kaggle Learn"], exercises: ["Kaggle competition", "Model comparison"], project: "Prediction Model" },
      { id: "5", title: "Big Data & SQL", description: "SQL mastery, big data tools, and data pipelines.", week: 8, completed: false, resources: ["Mode Analytics", "Spark Docs"], exercises: ["Complex queries", "ETL pipeline"], project: "Data Pipeline" },
      { id: "6", title: "Capstone", description: "Full data science project from problem to presentation.", week: 12, completed: false, resources: ["All previous"], exercises: ["Research question", "Present findings"], project: "End-to-End Data Project" },
    ],
    "App Development": [
      { id: "1", title: "Mobile UI/UX", description: "Mobile design principles, Figma, and prototyping.", week: 1, completed: false, resources: ["Material Design", "Apple HIG"], exercises: ["Design mockups", "Prototype flows"], project: "App Prototype" },
      { id: "2", title: "React Native Basics", description: "Components, navigation, and mobile-specific patterns.", week: 2, completed: false, resources: ["React Native Docs", "Expo Docs"], exercises: ["Build screens", "Navigation setup"], project: "Hello World App" },
      { id: "3", title: "State & Data", description: "State management and local/remote data handling.", week: 4, completed: false, resources: ["AsyncStorage", "React Query"], exercises: ["Persist data", "API calls"], project: "Notes App" },
      { id: "4", title: "Native Features", description: "Camera, location, push notifications, and device APIs.", week: 6, completed: false, resources: ["Expo SDK", "React Native Community"], exercises: ["Camera app", "Location tracker"], project: "Photo Sharing App" },
      { id: "5", title: "Publishing", description: "App store submission, testing, and monetization.", week: 8, completed: false, resources: ["App Store Guide", "Play Console"], exercises: ["Prepare assets", "Test on devices"], project: "Published App" },
      { id: "6", title: "Capstone", description: "Full mobile app with backend and deployment.", week: 12, completed: false, resources: ["All previous"], exercises: ["Plan features", "Ship to store"], project: "Production Mobile App" },
    ],
  };

  const topics = topicsByInterest[interest] || topicsByInterest["Web Development"];
  const startIdx = skillLevel === "Advanced" ? 4 : skillLevel === "Intermediate" ? 2 : 0;

  return {
    title: `${interest} ${skillLevel} to Pro Roadmap`,
    duration: "3 months",
    topics: topics.slice(startIdx),
  };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [assessment, setAssessmentState] = useState<Assessment | null>(null);
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [completedTopics, setCompletedTopics] = useState<string[]>([]);

  const login = (email: string, _password: string) => {
    setUser({ id: "1", name: email.split("@")[0], email });
  };

  const signup = (name: string, email: string, _password: string) => {
    setUser({ id: "1", name, email });
  };

  const logout = () => {
    setUser(null);
    setAssessmentState(null);
    setRoadmap(null);
    setCompletedTopics([]);
  };

  const setAssessment = (a: Assessment) => {
    setAssessmentState(a);
  };

  const generateRoadmap = (a: Assessment) => {
    const r = generateMockRoadmap(a);
    setRoadmap(r);
  };

  const toggleTopicComplete = (id: string) => {
    setCompletedTopics(prev =>
      prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id]
    );
  };

  return (
    <AuthContext.Provider value={{ user, assessment, roadmap, completedTopics, login, signup, logout, setAssessment, generateRoadmap, toggleTopicComplete }}>
      {children}
    </AuthContext.Provider>
  );
};
