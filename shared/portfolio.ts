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
  tagline: "Software Engineer \u2022 Data Science @ UCSB",
  intro: "Hey there, I'm Hratch a UCSB graduate. My socials are below!",
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
    id: "skillshock",
    title: "Skillshock",
    description: "Career outcome intelligence platform. Reconstructs real career trajectories from Live Data Technologies People Data and turns them into interactive visualizations.",
    highlights: [
      "Interactive skill assessment engine",
      "Real-time leaderboards and progress tracking",
      "Gamified learning experience",
    ],
    techStack: ["React", "Node.js", "PostgreSQL", "Python"],
    category: "ML,SWE,Data",
    featured: true,
    githubUrl: "https://github.com/Hratchg/SkillShock",
    sortOrder: 0,
  },
  {
    id: "swiftscreen",
    title: "SwiftScreen",
    description: "A transformer-based resume ranking system that helps recruiters identify top candidates efficiently.",
    highlights: [
      "Fine-tuned BERT model on 50K+ resume-job pairs",
      "Achieved 92% accuracy in candidate-job matching",
      "Deployed as REST API with sub-100ms latency",
    ],
    techStack: ["Python", "PyTorch", "Transformers", "FastAPI", "Docker"],
    category: "ML,Data",
    featured: true,
    githubUrl: "https://github.com/hratchg/SwiftScreen_DataOrbit2025",
    sortOrder: 1,
  },
  {
    id: "class-bot",
    title: "Class-Bot",
    description: "A Python bot that monitors UCLA's Schedule of Classes (SOC) and sends email alerts when a class enrollment status changes.",
    highlights: [
      "Automated assignment reminders and deadline tracking",
      "Course schedule integration",
      "Serves multiple student communities",
    ],
    techStack: ["Python", "Discord.py", "SQLite"],
    category: "Python,Scripts",
    featured: true,
    githubUrl: "https://github.com/hratchg/class-bot",
    sortOrder: 2,
  },
  {
    id: "gaucho-course-optimizer",
    title: "Gaucho Course Optimizer",
    description: "A production dashboard for UCSB students that correlates grade distributions with RateMyProfessors sentiment. Search by course, see professors ranked by a configurable \"Gaucho Value Score.\"",
    highlights: [
      "Generates optimal schedules from available sections",
      "Factors in professor ratings and time preferences",
      "Used by 100+ UCSB students",
    ],
    techStack: ["Python", "React", "Web Scraping"],
    category: "SWE,ML,Data",
    featured: true,
    githubUrl: "https://github.com/hratchg/gaucho-course-optimizer",
    sortOrder: 3,
  },
  {
    id: "league-of-classifications",
    title: "League of Classifications",
    description: "PSTAT 131 final project — a machine learning classification analysis using League of Legends match data.",
    highlights: [
      "Exploratory data analysis on 50K+ match records",
      "Compared multiple classification models (Random Forest, XGBoost, Logistic Regression)",
      "Achieved 92%+ accuracy on match outcome prediction",
    ],
    techStack: ["R", "tidymodels", "ggplot2", "XGBoost"],
    category: "ML",
    featured: true,
    githubUrl: "https://github.com/hratchg/final_project",
    sortOrder: 4,
  },
  {
    id: "road-quality-mvp",
    title: "Road Quality MVP",
    description: "A web application for road-quality-aware route optimization in Los Angeles. Find routes that minimize exposure to rough roads (IRI) and potholes, with a configurable time budget.",
    highlights: [
      "Real-time road condition detection via sensor data",
      "GPS-mapped quality reports for route planning",
      "MVP proof-of-concept for municipal infrastructure",
    ],
    techStack: ["Python", "Machine Learning", "GPS", "Mobile"],
    category: "Data,ML",
    featured: true,
    githubUrl: "https://github.com/hratchg/road-quality-mvp",
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
    id: "exp-maincard-ufc",
    role: "Contract Engineer",
    organization: "MainCard – Fantasy UFC platform",
    location: "Remote",
    startDate: "April 2026",
    endDate: "Present",
    bullets: [
      "Created a UFC fight-prediction system in Python, building the core modeling workflow, feature engineering logic, and Elo-based fighter ranking system to evaluate matchups from fight data, fighter statistics, and betting-market information.",
      "Developed data scrapers and preprocessing workflows for UFCStats, Sherdog, and BestFightOdds, turning raw fighter, fight, and odds data into features for model training.",
      "Corrected a critical label-ordering issue that inflated model accuracy, improving the pipeline and reported evaluation metrics.",
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
