export interface Project {
  id: string;
  title: string;
  description: string;
  highlights: string[];
  techStack: string[];
  category: string;
  featured: boolean;
  githubUrl?: string;
  liveUrl?: string;
  sortOrder?: number;
}

export interface Skill {
  name: string;
  category: "Languages/Frameworks" | "Database Technologies" | "Cloud/Dev Tools";
}

export interface Experience {
  id: string;
  role: string;
  organization: string;
  location: string;
  startDate: string;
  endDate: string;
  bullets: string[];
  sortOrder?: number;
}

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

export const personalInfo = {
  name: "Hratch Ghanime",
  tagline: "Software Engineer \u2022 UCSB Data Science '26",
  intro: "New-grad software engineer. I build and ship full-stack products, from CoursePick to a pothole-aware router for LA.",
  email: "hratchghanime@gmail.com",
  github: "https://github.com/hratchg",
  linkedin: "https://www.linkedin.com/in/hghanime",
  resumeUrl: "/resume.pdf",
};

export const aboutInfo = {
  bio: "I'm a Data Science graduate from UC Santa Barbara with a deep passion for software engineering and building products that solve real problems. My journey in tech has taken me from developing full-stack applications to designing data pipelines and exploring machine learning.",
  currentFocus: "Currently focused on building scalable web applications and exploring the intersection of data engineering and product development.",
  education: {
    school: "University of California, Santa Barbara (UCSB)",
    degree: "B.S. in Data Science and Statistics",
    period: "2024 - 2026",
    gpa: "3.51/4.0",
    coursework: [
      "Statistical Machine Learning",
      "Data Structures and Algorithms",
      "Programming Languages",
      "Advanced Probability and Statistics",
      "Linear Algebra",
      "Computer Architecture",
      "Stochastic Processes",
      "Bayes Analysis",
      "Machine Learning",
    ],
  },
  interests: [
    "Software Engineering",
    "Data Engineering",
    "Machine Learning",
    "Product Building",
  ],
};

export const projects: Project[] = [
  {
    id: "gaucho-course-optimizer",
    title: "CoursePick",
    description: "Course planning for UCSB students. Search any course and see its professors ranked by a configurable Gaucho Score built from 15+ years of grade distributions and RateMyProfessors sentiment.",
    highlights: [
      "Multi-pass professor matching joins official grade CSVs with scraped RateMyProfessors GraphQL data",
      "VADER + TF-IDF sentiment layer; weight sliders re-rank professors in real time",
      "React + three.js frontend, FastAPI on Render, Neon Postgres, GitHub Actions for CI and nightly syncs",
    ],
    techStack: ["React", "TypeScript", "three.js", "FastAPI", "PostgreSQL"],
    category: "SWE,Data",
    featured: true,
    githubUrl: "https://github.com/Hratchg/coursepick",
    liveUrl: "https://coursepick.app",
    sortOrder: 0,
  },
  {
    id: "road-quality-mvp",
    title: "Road Quality Router",
    description: "Pothole-aware routing for Los Angeles. Pick two points and compare the fastest route with one that avoids rough roads and YOLOv8-detected potholes, within a time budget you set.",
    highlights: [
      "YOLOv8 pothole detection over real Mapillary street imagery from 12 LA zones",
      "PostGIS + pgRouting corridor pre-filter brings cross-LA routes over ~209k segments to ~2.5s",
      "Three-app Fly.io deploy (db, API, frontend) reproducible from main, 200+ backend tests",
    ],
    techStack: ["React", "Leaflet", "FastAPI", "PostGIS", "YOLOv8"],
    category: "SWE,ML,Data",
    featured: true,
    githubUrl: "https://github.com/Hratchg/road-quality-mvp",
    liveUrl: "https://road-quality-frontend.fly.dev/",
    sortOrder: 1,
  },
  {
    id: "skillshock",
    title: "Skillshock",
    description: "Career outcome explorer built on 75,000+ real career histories. Answers questions like how long promotions take and what jobs a given major actually leads to.",
    highlights: [
      "Pipeline ingests 717K job records from compressed JSONL into SQLite",
      "Computes promotion velocity, role and industry transitions, and common paths to a target role",
      "Interactive Gradio + Plotly dashboard over the exported metrics",
    ],
    techStack: ["Python", "SQLite", "pandas", "Gradio", "Plotly"],
    category: "Data,SWE",
    featured: true,
    githubUrl: "https://github.com/Hratchg/SkillShock",
    sortOrder: 2,
  },
  {
    id: "swiftscreen",
    title: "SwiftScreen",
    description: "Resume screener built at UCSB DataOrbit 2025. Embeds resumes with sentence transformers and ranks applicants against a job's required skills.",
    highlights: [
      "MiniLM sentence embeddings of full resume text",
      "PyTorch feed-forward model scores resume to job fit",
      "Interactive notebook UI for recruiters to filter and rank candidates",
    ],
    techStack: ["Python", "PyTorch", "Sentence Transformers", "scikit-learn"],
    category: "ML,Data",
    featured: true,
    githubUrl: "https://github.com/Hratchg/SwiftScreen_DataOrbit2025",
    sortOrder: 3,
  },
  {
    id: "class-bot",
    title: "Class-Bot",
    description: "A Python bot that monitors UCLA's Schedule of Classes and emails students when a class they want opens up.",
    highlights: [
      "Polls the Schedule of Classes on an interval",
      "Sends email alerts when enrollment status changes",
    ],
    techStack: ["Python"],
    category: "Python,Scripts",
    featured: false,
    githubUrl: "https://github.com/Hratchg/class-bot",
    sortOrder: 4,
  },
  {
    id: "league-of-classifications",
    title: "League of Classifications",
    description: "PSTAT 131 final project: predicting League of Legends match outcomes with logistic regression, elastic net, random forest and XGBoost.",
    highlights: [
      "Exploratory data analysis on match records",
      "Compared four classification models with tidymodels",
    ],
    techStack: ["R", "tidymodels", "ggplot2", "XGBoost"],
    category: "ML",
    featured: false,
    githubUrl: "https://github.com/Hratchg/final_project",
    sortOrder: 5,
  },
];

export const skills: Skill[] = [
  { name: "Python", category: "Languages/Frameworks" },
  { name: "Django", category: "Languages/Frameworks" },
  { name: "JavaScript", category: "Languages/Frameworks" },
  { name: "Java", category: "Languages/Frameworks" },
  { name: "Spring Boot", category: "Languages/Frameworks" },
  { name: "Node.js", category: "Languages/Frameworks" },
  { name: "React.js", category: "Languages/Frameworks" },
  { name: "Express.js", category: "Languages/Frameworks" },
  { name: "C++", category: "Languages/Frameworks" },
  { name: "PHP", category: "Languages/Frameworks" },
  { name: "Ruby", category: "Languages/Frameworks" },
  { name: "PostgreSQL", category: "Database Technologies" },
  { name: "MongoDB Atlas", category: "Database Technologies" },
  { name: "Supabase", category: "Database Technologies" },
  { name: "MariaDB/MySQL", category: "Database Technologies" },
  { name: "AWS RDS", category: "Database Technologies" },
  { name: "Git/GitHub", category: "Cloud/Dev Tools" },
  { name: "Docker", category: "Cloud/Dev Tools" },
  { name: "Jira", category: "Cloud/Dev Tools" },
  { name: "AWS", category: "Cloud/Dev Tools" },
  { name: "Postman", category: "Cloud/Dev Tools" },
  { name: "Kubernetes", category: "Cloud/Dev Tools" },
  { name: "Jenkins", category: "Cloud/Dev Tools" },
  { name: "VSCode", category: "Cloud/Dev Tools" },
  { name: "IntelliJ IDEA", category: "Cloud/Dev Tools" },
];

export const experiences: Experience[] = [
  {
    id: "exp-altheros-capital",
    role: "Full Stack Developer Intern",
    organization: "Altheros Capital",
    location: "Los Angeles, California",
    startDate: "September 2026",
    endDate: "Present",
    bullets: [
      "Developed patient and provider onboarding, profile, scheduling, and appointment features for Midwest Health, a virtual therapy and psychiatry platform, using React, Node.js, Express, and PostgreSQL.",
      "Implemented real-time messaging and secured authentication and document storage with AWS Cognito, S3, and CloudFront.",
      "Delivered work in weekly sprints through GitHub issues and peer-reviewed pull requests, translating approved product requirements and Figma designs into production features.",
    ],
    sortOrder: 0,
  },
  {
    id: "exp-coursepick",
    role: "Founder & Full-Stack Developer",
    organization: "CoursePick",
    location: "Goleta, California",
    startDate: "January 2026",
    endDate: "Present",
    bullets: [
      "Built a PostgreSQL-backed course planning engine that helps UCSB students schedule classes by merging grade distributions, course data, and RateMyProfessors sentiment into a configurable ranking system.",
      "Created a multi-pass professor matching pipeline and a VADER + TF-IDF sentiment layer over scraped RMP GraphQL data and official UCSB grade CSVs, persisted to PostgreSQL.",
      "Deployed a 3-service Docker Compose stack (Postgres, Streamlit, APScheduler) on Neon-managed Postgres with GitHub Actions for CI gating, nightly schedule sync, and weekly DB backups.",
    ],
    sortOrder: 1,
  },
  {
    id: "exp-lastbite",
    role: "Founder and Full-Stack Developer",
    organization: "LastBite",
    location: "Remote",
    startDate: "Jan 2026",
    endDate: "Present",
    bullets: [
      "Engineered a full-stack application using React, Express.js, PostgreSQL, and Node.js to enable real-time discovery and purchase of discounted surplus meals from local restaurants.",
      "Architected a multi-role platform (customer, restaurant owner, admin) with NextAuth authentication, Stripe subscription billing, and a custom analytics dashboard with real-time revenue and category breakdowns via Recharts.",
      "Achieved successful beta rollout with 100+ student users and reduced average daily surplus waste across participating restaurants by an estimated 10-15%",
    ],
    sortOrder: 2,
  },
  {
    id: "92f293f4-f121-47a0-aa56-c0910081214f",
    role: "Frontend Web Developer",
    organization: "MarzipAni",
    location: "Remote",
    startDate: "Feb 2024",
    endDate: "Present",
    bullets: [
      "Built and configured a backend order management system enabling the business to receive, track, and fulfill customer orders entirely online.",
      "Integrated secure payment gateways and streamlined online transaction processes, significantly expanding the business's customer reach and online sales capabilities.",
      "Optimized the site for usability and performance, ensuring a smooth customer experience across desktop and mobile devices.",
    ],
    sortOrder: 3,
  },
  {
    id: "exp-3",
    role: "Student Engineering Intern",
    organization: "Go Baby Go",
    location: "Glendale, California",
    startDate: "Jan 2024",
    endDate: "July 2024",
    bullets: [
      "Led a team in redesigning and modifying rideable children's cars, utilizing CAD software to ensure that children with mobility impairments can move freely",
      "Collaborated with engineers and therapists to collect and analyze user feedback data, applying predictive modeling to improve design and safety features.",
      "Utilized CAD software to prototype designs and integrated real-time data analysis for performance testing.",
    ],
    sortOrder: 4,
  },
  {
    id: "d5cbd62d-3230-4029-9aa9-5d495e9f3bf8",
    role: "Summer SWE Intern",
    organization: "Hopin",
    location: "Remote/Spain",
    startDate: "June 2019",
    endDate: "September 2019",
    bullets: [
      "Gained hands-on experience in Ruby through immersive, production-focused engineering work on a live event platform serving large-scale audiences.",
      "Collaborated with engineers to improve the scalability and performance of live Q&A streaming features, directly enhancing the experience for large concurrent audiences.",
      "Contributed to production codebases through debugging, code optimization, and iterative refinement shipping improvements alongside a cross-functional engineering team.",
    ],
    sortOrder: 5,
  },
];

export const navLinks = [
  { label: "About Me", href: "/", icon: "user" },
  { label: "Experience", href: "/experience", icon: "briefcase" },
  { label: "Personal Projects", href: "/projects", icon: "folder" },
];
