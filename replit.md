# Hratch Ghanime Portfolio

## Overview
A modern, responsive portfolio website for Hratch Ghanime - Software Engineer and Data Science student at UCSB. Built with React, TypeScript, and Tailwind CSS.

## Current State
MVP complete with all core sections:
- Hero section with name, tagline, and CTA buttons
- About section with bio, education, and interests
- Projects section with filtering by category (All/SWE/Data/ML) and search
- Skills section grouped by category (Languages, Frameworks, Data/ML, Tools)
- Experience timeline with work history
- Contact form with validation
- Dark/light mode toggle
- Scroll progress indicator
- Responsive design (mobile → desktop)

## Project Structure
```
client/src/
├── components/
│   ├── ui/              # Shadcn components
│   ├── navbar.tsx       # Sticky navigation with dark mode toggle
│   ├── hero-section.tsx # Hero with gradient background
│   ├── about-section.tsx
│   ├── projects-section.tsx # With filter + search
│   ├── skills-section.tsx
│   ├── experience-section.tsx # Timeline layout
│   ├── contact-section.tsx # Form with validation
│   ├── footer.tsx
│   └── scroll-progress.tsx
├── lib/
│   ├── theme-provider.tsx # Dark mode context
│   └── queryClient.ts
├── pages/
│   └── home.tsx         # Main portfolio page
└── App.tsx

shared/
├── portfolio.ts         # All portfolio data (edit this to customize)
└── schema.ts            # TypeScript types

server/
├── routes.ts            # Contact form API
└── storage.ts           # In-memory storage
```

## How to Customize
Edit `shared/portfolio.ts` to update:
- `personalInfo` - Name, tagline, intro, social links
- `aboutInfo` - Bio, education, interests
- `projects` - Project cards with tech stacks
- `skills` - Skills grouped by category
- `experiences` - Work experience timeline

## Commands
- `npm run dev` - Start development server
- `npm install` - Install dependencies

## Tech Stack
- React + TypeScript
- Tailwind CSS + Shadcn UI
- React Query for data fetching
- Wouter for routing
- Express backend
- Zod for validation
