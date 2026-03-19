import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // Clean existing data
  await prisma.calendarEvent.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.lesson.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  const hash = await bcrypt.hash("password123", 12);

  // Create tutors
  const tutor1 = await prisma.user.create({
    data: {
      name: "Sarah Chen",
      email: "sarah@example.com",
      passwordHash: hash,
      role: "tutor",
      bio: "Full-stack developer with 10+ years of experience. Passionate about teaching web technologies.",
      expertise: "React,TypeScript,Node.js,Python",
    },
  });

  const tutor2 = await prisma.user.create({
    data: {
      name: "Marcus Johnson",
      email: "marcus@example.com",
      passwordHash: hash,
      role: "tutor",
      bio: "Data scientist and ML engineer. Making complex topics accessible to everyone.",
      expertise: "Python,Machine Learning,Data Science,SQL",
    },
  });

  const tutor3 = await prisma.user.create({
    data: {
      name: "Elena Rodriguez",
      email: "elena@example.com",
      passwordHash: hash,
      role: "tutor",
      bio: "UX designer turned educator. Teaching the intersection of design and development.",
      expertise: "UI/UX Design,Figma,CSS,Design Systems",
    },
  });

  // Create students
  const student1 = await prisma.user.create({
    data: {
      name: "Alex Kim",
      email: "alex@example.com",
      passwordHash: hash,
      role: "student",
      bio: "Aspiring software developer transitioning from finance.",
    },
  });

  const student2 = await prisma.user.create({
    data: {
      name: "Jordan Taylor",
      email: "jordan@example.com",
      passwordHash: hash,
      role: "student",
      bio: "CS student looking to level up my skills.",
    },
  });

  // Create courses
  const course1 = await prisma.course.create({
    data: {
      title: "Modern React with TypeScript",
      slug: "modern-react-typescript",
      description:
        "Master React 19 and TypeScript from the ground up. Build production-ready applications with modern patterns, hooks, server components, and best practices.",
      category: "Web Development",
      level: "intermediate",
      published: true,
      featured: true,
      tutorId: tutor1.id,
    },
  });

  const course2 = await prisma.course.create({
    data: {
      title: "Python for Data Science",
      slug: "python-data-science",
      description:
        "Learn Python programming with a focus on data analysis, visualization, and machine learning fundamentals using pandas, matplotlib, and scikit-learn.",
      category: "Data Science",
      level: "beginner",
      published: true,
      featured: true,
      tutorId: tutor2.id,
    },
  });

  const course3 = await prisma.course.create({
    data: {
      title: "Design Systems from Scratch",
      slug: "design-systems-scratch",
      description:
        "Build a complete design system with tokens, components, and documentation. Learn Figma, CSS custom properties, and component-driven development.",
      category: "Design",
      level: "intermediate",
      published: true,
      tutorId: tutor3.id,
    },
  });

  // Create courses (course4-6 stored in DB but not referenced further)
  await prisma.course.create({
    data: {
      title: "Node.js Backend Masterclass",
      slug: "nodejs-backend-masterclass",
      description:
        "Build scalable, secure backend APIs with Node.js, Express, and PostgreSQL. Covers authentication, testing, deployment, and performance optimization.",
      category: "Web Development",
      level: "advanced",
      published: true,
      tutorId: tutor1.id,
    },
  });

  await prisma.course.create({
    data: {
      title: "Machine Learning Fundamentals",
      slug: "ml-fundamentals",
      description:
        "Understand core ML algorithms, model evaluation, and deployment. Hands-on projects with real-world datasets.",
      category: "Data Science",
      level: "intermediate",
      published: true,
      featured: true,
      tutorId: tutor2.id,
    },
  });

  await prisma.course.create({
    data: {
      title: "CSS Mastery & Modern Layouts",
      slug: "css-mastery-modern-layouts",
      description:
        "Deep dive into modern CSS — Grid, Flexbox, Container Queries, and animations. Build beautiful, responsive interfaces without a framework.",
      category: "Design",
      level: "beginner",
      published: true,
      tutorId: tutor3.id,
    },
  });

  // Create lessons for course1
  const lessonsData = [
    { title: "Introduction to React & TypeScript", content: "Welcome to this course! In this lesson, we'll set up our development environment and create our first React + TypeScript project using Vite. We'll explore why TypeScript is essential for modern React development and how it catches bugs before they reach production.\n\n## Topics Covered\n- Setting up a React + TypeScript project\n- Understanding TSX vs JSX\n- Basic type annotations\n- The React.FC type and why you might not need it", order: 1, duration: 45 },
    { title: "Components and Props with Types", content: "Learn how to build type-safe components with proper prop definitions. We'll explore interface vs type, optional props, children typing, and generic components.\n\n## Topics Covered\n- Defining component props with interfaces\n- Optional and default props\n- The children prop\n- Generic components\n- Event handler typing", order: 2, duration: 60 },
    { title: "State Management with Hooks", content: "Master useState, useReducer, and useContext with TypeScript. Learn how to type complex state objects and create type-safe context providers.\n\n## Topics Covered\n- useState with TypeScript\n- useReducer with discriminated unions\n- Creating typed context\n- Custom hooks with generics", order: 3, duration: 55 },
    { title: "Server Components & Data Fetching", content: "Explore React Server Components and modern data fetching patterns. Learn how to use async components, Suspense boundaries, and streaming.\n\n## Topics Covered\n- Server vs Client Components\n- Async components\n- Suspense and loading states\n- Error boundaries with TypeScript", order: 4, duration: 50 },
  ];

  for (const lesson of lessonsData) {
    await prisma.lesson.create({
      data: { ...lesson, courseId: course1.id },
    });
  }

  // Create lessons for course2
  const course2Lessons = [
    { title: "Python Basics & Setup", content: "Set up your Python environment and learn the fundamentals — variables, data types, control flow, and functions.", order: 1, duration: 40 },
    { title: "NumPy for Numerical Computing", content: "Master NumPy arrays, operations, and broadcasting for efficient numerical computation.", order: 2, duration: 50 },
    { title: "Data Analysis with Pandas", content: "Learn DataFrames, Series, indexing, grouping, and data cleaning with pandas.", order: 3, duration: 60 },
  ];

  for (const lesson of course2Lessons) {
    await prisma.lesson.create({
      data: { ...lesson, courseId: course2.id },
    });
  }

  // Create enrollments
  await prisma.enrollment.create({
    data: { studentId: student1.id, courseId: course1.id, progress: 50 },
  });
  await prisma.enrollment.create({
    data: { studentId: student1.id, courseId: course2.id, progress: 25 },
  });
  await prisma.enrollment.create({
    data: { studentId: student2.id, courseId: course1.id, progress: 75 },
  });
  await prisma.enrollment.create({
    data: { studentId: student2.id, courseId: course3.id, progress: 10 },
  });

  // Create blog posts
  await prisma.blogPost.create({
    data: {
      title: "Why TypeScript is Essential for Modern Web Development",
      slug: "why-typescript-essential-modern-web-development",
      content: `TypeScript has transformed how we build web applications. In this post, I'll share why I believe every web developer should learn TypeScript in 2026.\n\n## Type Safety Catches Bugs Early\n\nThe most obvious benefit of TypeScript is catching type errors at compile time rather than runtime. This means fewer bugs in production and a more confident development experience.\n\n## Better Developer Experience\n\nWith TypeScript, your editor becomes significantly more powerful. Autocomplete, inline documentation, and refactoring tools all work better when types are available.\n\n## Scalable Codebases\n\nAs your project grows, TypeScript helps maintain code quality. Interfaces serve as contracts between modules, making it easier for teams to collaborate without breaking each other's code.\n\n## The Ecosystem Has Caught Up\n\nAlmost every major library now ships with TypeScript definitions. The days of fighting with \`@types\` packages are largely behind us.\n\n## Getting Started\n\nIf you're new to TypeScript, start by adding it to an existing JavaScript project. Rename your files from \`.js\` to \`.ts\` and fix the errors one at a time. You'll be surprised how quickly you become productive.`,
      excerpt: "Exploring why TypeScript has become the standard for professional web development and how to get started.",
      tags: "typescript,web-development,programming",
      published: true,
      authorId: tutor1.id,
    },
  });

  await prisma.blogPost.create({
    data: {
      title: "Getting Started with Machine Learning: A Practical Guide",
      slug: "getting-started-machine-learning-practical-guide",
      content: `Machine learning doesn't have to be intimidating. In this guide, I'll walk you through the essential concepts and show you how to build your first ML model.\n\n## What is Machine Learning?\n\nAt its core, machine learning is about teaching computers to learn patterns from data. Instead of writing explicit rules, we let algorithms discover patterns automatically.\n\n## Types of Machine Learning\n\n### Supervised Learning\nYou provide labeled data — inputs paired with correct outputs. The algorithm learns to predict outputs for new inputs.\n\n### Unsupervised Learning\nYou provide unlabeled data and let the algorithm find structure on its own, like clustering similar items together.\n\n### Reinforcement Learning\nAn agent learns by interacting with an environment and receiving rewards or penalties.\n\n## Your First Model\n\nLet's build a simple classification model using scikit-learn:\n\n\`\`\`python\nfrom sklearn.datasets import load_iris\nfrom sklearn.model_selection import train_test_split\nfrom sklearn.ensemble import RandomForestClassifier\n\n# Load data\niris = load_iris()\nX_train, X_test, y_train, y_test = train_test_split(\n    iris.data, iris.target, test_size=0.2\n)\n\n# Train model\nmodel = RandomForestClassifier(n_estimators=100)\nmodel.fit(X_train, y_train)\n\n# Evaluate\naccuracy = model.score(X_test, y_test)\nprint(f"Accuracy: {accuracy:.2%}")\n\`\`\`\n\nThis simple example demonstrates the core ML workflow: load data, split into train/test, train a model, and evaluate its performance.`,
      excerpt: "A beginner-friendly introduction to machine learning concepts with practical code examples.",
      tags: "machine-learning,python,data-science,beginner",
      published: true,
      authorId: tutor2.id,
    },
  });

  await prisma.blogPost.create({
    data: {
      title: "Building a Design System: Lessons Learned",
      slug: "building-design-system-lessons-learned",
      content: `After building design systems for three companies, here are the key lessons I've learned about creating sustainable, scalable component libraries.\n\n## Start with Design Tokens\n\nDesign tokens are the foundation of any good design system. They're the smallest units of design — colors, spacing, typography, shadows — expressed as variables.\n\n## Component API Design Matters\n\nThe API of your components determines how developers use your system. A well-designed API is intuitive, consistent, and hard to misuse.\n\n## Documentation is Not Optional\n\nIf your design system isn't well-documented, it won't be adopted. Every component needs examples, props documentation, and usage guidelines.\n\n## Build What You Need\n\nDon't try to build every component upfront. Start with the most commonly used components and add new ones as needed. A small, well-maintained system beats a large, neglected one.\n\n## Accessibility from Day One\n\nAccessibility should be baked into your components from the start. It's much harder to retrofit than to build in from the beginning.`,
      excerpt: "Key insights from building design systems at scale — from tokens to components to documentation.",
      tags: "design-systems,ui-ux,css,frontend",
      published: true,
      authorId: tutor3.id,
    },
  });

  // Create calendar events for students
  const now = new Date();
  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date(now);
  nextWeek.setDate(nextWeek.getDate() + 7);

  await prisma.calendarEvent.create({
    data: {
      title: "React Study Session",
      description: "Review Server Components chapter",
      startTime: new Date(tomorrow.setHours(10, 0, 0, 0)),
      endTime: new Date(tomorrow.setHours(12, 0, 0, 0)),
      color: "#6366f1",
      userId: student1.id,
    },
  });

  await prisma.calendarEvent.create({
    data: {
      title: "Python Practice",
      description: "Complete pandas exercises",
      startTime: new Date(nextWeek.setHours(14, 0, 0, 0)),
      endTime: new Date(nextWeek.setHours(16, 0, 0, 0)),
      color: "#10b981",
      userId: student1.id,
    },
  });

  console.log("Seed data created successfully!");
  console.log("\nTest accounts (password: password123):");
  console.log("  Tutors: sarah@example.com, marcus@example.com, elena@example.com");
  console.log("  Students: alex@example.com, jordan@example.com");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
