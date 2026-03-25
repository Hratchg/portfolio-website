export interface PersonalInfo {
  id: string;
  name: string;
  tagline: string;
  intro: string;
  email: string;
  github: string;
  linkedin: string;
  resumeUrl: string;
}

export interface AboutInfo {
  id: string;
  bio: string;
  currentFocus: string;
  education: {
    school: string;
    degree: string;
    period: string;
    gpa: string;
    coursework: string[];
  };
  interests: string[];
}

export interface Project {
  id: string;
  title: string;
  description: string;
  highlights: string[];
  techStack: string[];
  category: "SWE" | "Data" | "ML";
  featured: boolean;
  githubUrl: string | null;
  liveUrl: string | null;
  sortOrder: number;
}

export interface Experience {
  id: string;
  role: string;
  organization: string;
  location: string;
  startDate: string;
  endDate: string;
  bullets: string[];
  sortOrder: number;
}

export interface Skill {
  id: string;
  name: string;
  category: "Languages/Frameworks" | "Database Technologies" | "Cloud/Dev Tools";
  sortOrder: number;
}

export interface RandomFact {
  id: string;
  emoji: string;
  title: string;
  description: string;
  sortOrder: number;
}

export interface NavLink {
  id: string;
  label: string;
  href: string;
  icon: string;
  sortOrder: number;
}
