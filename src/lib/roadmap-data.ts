export interface Skill {
  id: string;
  title: string;
  description: string;
  why: string;
  tools: string[];
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedTime: string;
  level: number;
  status: "not-started" | "learning" | "completed";
}

export interface Roadmap {
  id: string;
  goal: string;
  skills: Skill[];
  createdAt: string;
}

export const EXAMPLE_PROMPTS = [
  "Build a social media app like Instagram",
  "Create a multiplayer online game",
  "Launch an AI-powered SaaS startup",
  "Build a personal portfolio website",
  "Create a mobile fitness tracking app",
  "Build an e-commerce marketplace",
];

export const MOCK_ROADMAP: Roadmap = {
  id: "1",
  goal: "Build Instagram",
  createdAt: new Date().toISOString(),
  skills: [
    {
      id: "1",
      title: "Programming Fundamentals",
      description: "Core programming concepts including variables, functions, loops, and data structures. The foundation for everything else.",
      why: "Without programming basics, you can't write any code. This is the absolute foundation of your journey.",
      tools: ["JavaScript", "TypeScript", "Python"],
      difficulty: "beginner",
      estimatedTime: "4-6 weeks",
      level: 1,
      status: "not-started",
    },
    {
      id: "2",
      title: "Web Development Basics",
      description: "HTML, CSS, and JavaScript for building interactive web pages. Understanding the DOM, layouts, and responsive design.",
      why: "Instagram is a web/mobile app. You need to understand how web interfaces are built before you can create one.",
      tools: ["HTML5", "CSS3", "JavaScript", "React"],
      difficulty: "beginner",
      estimatedTime: "3-4 weeks",
      level: 1,
      status: "not-started",
    },
    {
      id: "3",
      title: "Database Systems",
      description: "How to store, query, and manage data. Understanding relational and NoSQL databases, data modeling, and indexing.",
      why: "Instagram stores billions of photos, user profiles, and social connections. You need databases to persist all this data.",
      tools: ["PostgreSQL", "MongoDB", "Redis"],
      difficulty: "intermediate",
      estimatedTime: "3-4 weeks",
      level: 2,
      status: "not-started",
    },
    {
      id: "4",
      title: "Backend Development",
      description: "Server-side programming, REST APIs, middleware, and business logic. Building the engine that powers the app.",
      why: "The backend handles user authentication, data processing, and serves content to the frontend. It's the brain of the app.",
      tools: ["Node.js", "Express", "Next.js API Routes"],
      difficulty: "intermediate",
      estimatedTime: "4-6 weeks",
      level: 2,
      status: "not-started",
    },
    {
      id: "5",
      title: "Authentication Systems",
      description: "User registration, login, sessions, OAuth, and security. Protecting user accounts and data.",
      why: "Every user needs a secure account. Authentication is critical for any social platform.",
      tools: ["JWT", "OAuth 2.0", "Passport.js", "Auth0"],
      difficulty: "intermediate",
      estimatedTime: "2-3 weeks",
      level: 2,
      status: "not-started",
    },
    {
      id: "6",
      title: "Image Storage & CDN",
      description: "Handling file uploads, image processing, compression, and content delivery networks for fast global access.",
      why: "Instagram is fundamentally an image platform. Fast, reliable image storage and delivery is the core product.",
      tools: ["AWS S3", "Cloudinary", "CloudFront", "Sharp"],
      difficulty: "intermediate",
      estimatedTime: "2-3 weeks",
      level: 3,
      status: "not-started",
    },
    {
      id: "7",
      title: "Social Graph & Feeds",
      description: "Algorithms for following, followers, activity feeds, and content ranking. Building the social network layer.",
      why: "The social graph is what makes Instagram a social network. Feeds, follows, and recommendations drive engagement.",
      tools: ["Graph Databases", "Redis", "Algorithm Design"],
      difficulty: "advanced",
      estimatedTime: "3-4 weeks",
      level: 3,
      status: "not-started",
    },
    {
      id: "8",
      title: "Mobile Development",
      description: "Building native or cross-platform mobile applications. Understanding mobile UX patterns and performance.",
      why: "Most Instagram users are on mobile. A great mobile experience is essential for a social media app.",
      tools: ["React Native", "Flutter", "Swift", "Kotlin"],
      difficulty: "advanced",
      estimatedTime: "6-8 weeks",
      level: 3,
      status: "not-started",
    },
    {
      id: "9",
      title: "Scalability & Infrastructure",
      description: "Designing systems that handle millions of users. Load balancing, caching, microservices, and monitoring.",
      why: "Instagram serves billions of requests daily. Understanding scalability is crucial for growth.",
      tools: ["Docker", "Kubernetes", "AWS", "Terraform"],
      difficulty: "advanced",
      estimatedTime: "4-6 weeks",
      level: 4,
      status: "not-started",
    },
    {
      id: "10",
      title: "Cloud Deployment",
      description: "Deploying and managing applications in the cloud. CI/CD pipelines, monitoring, and DevOps practices.",
      why: "Your app needs to be live and accessible. Cloud deployment is the final step to launching your product.",
      tools: ["AWS", "Vercel", "GitHub Actions", "Datadog"],
      difficulty: "advanced",
      estimatedTime: "2-3 weeks",
      level: 4,
      status: "not-started",
    },
  ],
};
