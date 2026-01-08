export interface Project {
  id: string;
  title: string;
  description: string;
  highlights: string[];
  techStack: string[];
  category: "SWE" | "Data" | "ML";
  featured: boolean;
  githubUrl?: string;
  liveUrl?: string;
}

export interface Skill {
  name: string;
  category: "Languages" | "Frameworks" | "Data/ML" | "Tools";
}

export interface Experience {
  id: string;
  role: string;
  organization: string;
  startDate: string;
  endDate: string;
  bullets: string[];
}

export interface ContactMessage {
  name: string;
  email: string;
  message: string;
}

export const personalInfo = {
  name: "Hratch Ghanime",
  tagline: "Software Engineer \u2022 Data Science @ UCSB",
  intro: "I build elegant software solutions that blend engineering excellence with data-driven insights. Passionate about creating products that make a real impact.",
  email: "hratch@example.com",
  github: "https://github.com/hratchg",
  linkedin: "https://linkedin.com/in/hratchg",
  resumeUrl: "/resume.pdf",
};

export const aboutInfo = {
  bio: "I'm a Data Science student at UC Santa Barbara with a deep passion for software engineering and building products that solve real problems. My journey in tech has taken me from developing full-stack applications to designing data pipelines and exploring machine learning.",
  currentFocus: "Currently focused on building scalable web applications and exploring the intersection of data engineering and product development.",
  education: {
    school: "University of California, Santa Barbara",
    degree: "B.S. Data Science",
    period: "2021 - 2025",
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
    id: "lastbite",
    title: "LastBite",
    description: "A food-waste reduction platform connecting consumers with local restaurants offering surplus meals at discounted prices.",
    highlights: [
      "Built real-time inventory tracking for 50+ partner restaurants",
      "Integrated Stripe payments with location-based discovery",
      "Reduced food waste by 2,000+ meals in first quarter",
    ],
    techStack: ["React", "Express", "PostgreSQL", "Stripe", "Google Maps API"],
    category: "SWE",
    featured: true,
    githubUrl: "https://github.com/hratchg/lastbite",
    liveUrl: "https://lastbite.app",
  },
  {
    id: "equity-drivers",
    title: "Equity Drivers",
    description: "An automated data pipeline analyzing SEC filings and market data to identify key drivers of equity performance.",
    highlights: [
      "Processed 10,000+ SEC filings using NLP extraction",
      "Built ETL pipeline with 99.9% uptime",
      "Reduced analyst research time by 40%",
    ],
    techStack: ["Python", "SQL", "Airflow", "AWS", "Pandas"],
    category: "Data",
    featured: true,
    githubUrl: "https://github.com/hratchg/equity-drivers",
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
    category: "ML",
    featured: true,
    githubUrl: "https://github.com/hratchg/swiftscreen",
  },
  {
    id: "course-notifier",
    title: "Course Notifier Bot",
    description: "An automated enrollment monitoring system that alerts students when course spots open up.",
    highlights: [
      "Monitors 500+ courses in real-time",
      "Instant notifications via SMS and email",
      "Helped 200+ students secure classes",
    ],
    techStack: ["Python", "Selenium", "Twilio", "SQLite"],
    category: "SWE",
    featured: false,
    githubUrl: "https://github.com/hratchg/course-notifier",
  },
];

export const skills: Skill[] = [
  { name: "Python", category: "Languages" },
  { name: "TypeScript", category: "Languages" },
  { name: "JavaScript", category: "Languages" },
  { name: "SQL", category: "Languages" },
  { name: "Java", category: "Languages" },
  { name: "C++", category: "Languages" },
  { name: "React", category: "Frameworks" },
  { name: "Node.js", category: "Frameworks" },
  { name: "Express", category: "Frameworks" },
  { name: "FastAPI", category: "Frameworks" },
  { name: "Next.js", category: "Frameworks" },
  { name: "TailwindCSS", category: "Frameworks" },
  { name: "PyTorch", category: "Data/ML" },
  { name: "TensorFlow", category: "Data/ML" },
  { name: "Pandas", category: "Data/ML" },
  { name: "Scikit-learn", category: "Data/ML" },
  { name: "Spark", category: "Data/ML" },
  { name: "Airflow", category: "Data/ML" },
  { name: "Git", category: "Tools" },
  { name: "Docker", category: "Tools" },
  { name: "AWS", category: "Tools" },
  { name: "PostgreSQL", category: "Tools" },
  { name: "MongoDB", category: "Tools" },
  { name: "Linux", category: "Tools" },
];

export const experiences: Experience[] = [
  {
    id: "exp-1",
    role: "Software Engineering Intern",
    organization: "Tech Startup Inc.",
    startDate: "Jun 2024",
    endDate: "Sep 2024",
    bullets: [
      "Developed a customer-facing dashboard using React and TypeScript, improving user engagement by 35%",
      "Built RESTful APIs handling 10K+ daily requests with Node.js and Express",
      "Implemented CI/CD pipelines reducing deployment time by 60%",
    ],
  },
  {
    id: "exp-2",
    role: "Data Science Research Assistant",
    organization: "UCSB Data Lab",
    startDate: "Jan 2023",
    endDate: "Present",
    bullets: [
      "Analyzed large-scale datasets using Python and SQL to support faculty research",
      "Built machine learning models for text classification with 89% accuracy",
      "Published findings in undergraduate research symposium",
    ],
  },
  {
    id: "exp-3",
    role: "Teaching Assistant",
    organization: "UCSB Computer Science",
    startDate: "Sep 2022",
    endDate: "Dec 2022",
    bullets: [
      "Assisted 150+ students in introductory programming courses",
      "Held weekly office hours and created supplementary learning materials",
      "Received 4.8/5.0 average rating from student feedback",
    ],
  },
];

export const navLinks = [
  { label: "About Me", href: "/" },
  { label: "Experience", href: "/experience" },
  { label: "Random Facts", href: "/random-facts" },
];

export interface RandomFact {
  id: string;
  emoji: string;
  title: string;
  description: string;
}

export const randomFacts: RandomFact[] = [
  {
    id: "fact-1",
    emoji: "coffee",
    title: "Coffee Enthusiast",
    description: "I've tried over 50 different coffee beans from around the world. My current favorite is an Ethiopian Yirgacheffe.",
  },
  {
    id: "fact-2",
    emoji: "hiking",
    title: "Hiking Lover",
    description: "I've hiked every major trail in Santa Barbara County. The Inspiration Point sunrise hike is my go-to for clearing my mind.",
  },
  {
    id: "fact-3",
    emoji: "chess",
    title: "Chess Player",
    description: "I play chess online daily and participate in local tournaments. My peak rating is 1650 on Chess.com.",
  },
  {
    id: "fact-4",
    emoji: "languages",
    title: "Multilingual",
    description: "Besides English, I speak Armenian fluently and I'm currently learning Japanese through anime and Duolingo.",
  },
  {
    id: "fact-5",
    emoji: "music",
    title: "Guitar Player",
    description: "I've been playing guitar for 8 years. I especially love playing classic rock and blues.",
  },
  {
    id: "fact-6",
    emoji: "cooking",
    title: "Home Cook",
    description: "I love experimenting with Armenian and Mediterranean recipes. My specialty is homemade hummus and lahmajun.",
  },
];
