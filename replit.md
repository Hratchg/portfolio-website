# Hratch Ghanime Portfolio

## Overview
A modern, responsive multi-page portfolio website for Hratch Ghanime - Software Engineer and Data Science student at UCSB. Built with React, TypeScript, and Tailwind CSS.

## Current State
MVP complete with three pages:
1. **About Me** - Hero, bio, education, skills, and contact form
2. **Experience** - Work experience timeline, education, and featured projects
3. **Random Facts** - Fun personal facts and interests

Features include:
- Dark/light mode toggle
- Responsive design (mobile → desktop)
- Navigation between pages
- Contact form with validation

## Project Structure
```
client/src/
├── components/
│   ├── ui/              # Shadcn components
│   ├── navbar.tsx       # Navigation with page routing
│   ├── contact-section.tsx # Form with validation
│   └── footer.tsx
├── lib/
│   ├── theme-provider.tsx # Dark mode context
│   └── queryClient.ts
├── pages/
│   ├── about.tsx        # About Me page (home)
│   ├── experience.tsx   # Work + Education page
│   └── random-facts.tsx # Random Facts page
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
- `randomFacts` - Fun facts for the Random Facts page

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
