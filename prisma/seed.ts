import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const SLUG_OVERRIDES: Record<string, string> = {
  "C": "c-lang",
  "C++": "cpp",
  "C#": "csharp",
  "W3.CSS": "w3-css",
  "ASP.NET": "asp-dot-net",
  "Node.js": "nodejs",
};

function slugify(text: string): string {
  if (SLUG_OVERRIDES[text]) return SLUG_OVERRIDES[text];
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s.-]/g, "")
    .replace(/[\s_.]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

type TopicConfig = {
  title: string;
  description: string;
  icon: string;
  language: string;
  runnable: boolean;
  chapters: string[];
};

const PALETTE = ["#22D3EE", "#8B5CF6", "#F59E0B", "#34D399", "#F472B6", "#60A5FA", "#FB923C", "#A78BFA"];

const TOPICS: TopicConfig[] = [
  { title: "HTML", description: "The markup language that structures every page on the web.", icon: "FileCode", language: "html", runnable: true, chapters: ["Intro", "Elements", "Attributes", "Headings", "Paragraphs", "Links", "Images", "Lists", "Tables", "Forms", "Semantic Elements", "Layout"] },
  { title: "CSS", description: "Style, layout, and visual design for HTML documents.", icon: "Palette", language: "css", runnable: true, chapters: ["Intro", "Selectors", "Colors", "Box Model", "Padding and Margin", "Text and Fonts", "Display", "Position", "Flexbox", "Grid", "Responsive and Media Queries", "Variables"] },
  { title: "JavaScript", description: "The programming language that brings web pages to life.", icon: "Braces", language: "javascript", runnable: true, chapters: ["Intro", "Variables", "Data Types", "Functions", "Objects", "Events", "Arrays", "Strings", "DOM", "JSON", "ES6", "Arrow Functions", "Classes", "Promises and Async"] },
  { title: "SQL", description: "The standard language for querying and managing relational databases.", icon: "Database", language: "sql", runnable: false, chapters: ["Intro", "SELECT", "WHERE", "ORDER BY", "INSERT", "UPDATE", "DELETE", "JOIN", "GROUP BY", "Aggregate Functions", "CREATE TABLE", "Constraints", "Keys", "Views"] },
  { title: "Python", description: "A readable, versatile language for scripting, data, and web apps.", icon: "Terminal", language: "python", runnable: true, chapters: ["Intro", "Syntax", "Variables", "Data Types", "Strings", "Lists", "Tuples", "Sets", "Dicts", "Conditions", "Loops", "Functions", "Lambda", "Classes", "Inheritance", "Modules", "File Handling"] },
  { title: "Java", description: "A robust, object-oriented language for portable, large-scale software.", icon: "Coffee", language: "java", runnable: false, chapters: ["Intro", "Syntax", "Variables", "Data Types", "Operators", "Strings", "Conditions", "Loops", "Arrays", "Methods", "OOP", "Classes", "Inheritance", "Polymorphism", "Encapsulation", "Interfaces"] },
  { title: "PHP", description: "A server-side language powering a huge share of the web.", icon: "Server", language: "php", runnable: false, chapters: ["Intro", "Syntax", "Variables", "Data Types", "Strings", "Operators", "If Else", "Loops", "Arrays", "Functions", "Forms", "Superglobals", "OOP", "Sessions", "Cookies", "File Handling", "MySQL Basics"] },
  { title: "W3.CSS", description: "A lightweight CSS framework for fast, responsive design.", icon: "LayoutGrid", language: "css", runnable: true, chapters: ["Intro", "Colors", "Containers", "Cards", "Buttons", "Grid"] },
  { title: "C", description: "The foundational systems language behind decades of software.", icon: "Cpu", language: "c", runnable: false, chapters: ["Intro", "Syntax", "Variables", "Data Types", "Functions", "Pointers"] },
  { title: "C++", description: "C with classes — performance and object orientation combined.", icon: "Cpu", language: "cpp", runnable: false, chapters: ["Intro", "Syntax", "Functions", "OOP", "Classes", "Pointers"] },
  { title: "C#", description: "A modern, type-safe language for the .NET ecosystem.", icon: "Hash", language: "csharp", runnable: false, chapters: ["Intro", "Syntax", "Data Types", "Methods", "OOP", "Classes"] },
  { title: "How To", description: "Quick recipes for common UI components with CSS and JS.", icon: "Wand2", language: "html", runnable: true, chapters: ["Common Components"] },
  { title: "Bootstrap", description: "The most widely used CSS framework for responsive sites.", icon: "Layout", language: "html", runnable: true, chapters: ["Get Started", "Grid", "Buttons", "Components"] },
  { title: "React", description: "A component-based library for building interactive user interfaces.", icon: "Atom", language: "javascript", runnable: false, chapters: ["Intro", "JSX", "Components", "Props", "State", "useState", "useEffect", "Events", "Conditional Rendering", "Lists", "Forms", "Router"] },
  { title: "jQuery", description: "A JavaScript library that simplified DOM work for a generation of devs.", icon: "MousePointerClick", language: "javascript", runnable: true, chapters: ["Intro", "Syntax", "Selectors", "Events", "Effects", "AJAX"] },
  { title: "Excel", description: "Spreadsheet formulas, functions, and charts for data work.", icon: "Table2", language: "plaintext", runnable: false, chapters: ["Cells and Ranges", "Formulas", "Functions", "Charts"] },
  { title: "XML", description: "A flexible markup format for structured, self-describing data.", icon: "Code2", language: "xml", runnable: false, chapters: ["Intro", "Tree", "Elements", "DTD", "XPath", "XSLT"] },
  { title: "Django", description: "A batteries-included Python web framework.", icon: "Server", language: "python", runnable: false, chapters: ["Intro", "Create Project", "Views", "Models", "Templates", "URLs"] },
  { title: "NumPy", description: "Fast numerical arrays and math for Python.", icon: "Sigma", language: "python", runnable: false, chapters: ["Intro", "Arrays", "Indexing", "Slicing", "Reshape", "Random"] },
  { title: "Pandas", description: "Tabular data analysis and cleaning for Python.", icon: "Table2", language: "python", runnable: false, chapters: ["Intro", "Series", "DataFrames", "Read CSV", "Cleaning Data"] },
  { title: "Node.js", description: "JavaScript on the server, powering scalable network apps.", icon: "Hexagon", language: "javascript", runnable: false, chapters: ["Intro", "Modules", "HTTP Module", "File System", "NPM"] },
  { title: "DSA", description: "Data structures and algorithms — the core toolkit of computer science.", icon: "GitBranch", language: "javascript", runnable: true, chapters: ["Intro", "Sorting", "Linked Lists", "Stacks", "Queues", "Trees", "Graphs", "Big-O"] },
  { title: "TypeScript", description: "JavaScript with static types for safer, larger codebases.", icon: "FileType", language: "typescript", runnable: false, chapters: ["Intro", "Simple Types", "Interfaces", "Classes", "Generics"] },
  { title: "Angular", description: "A full-featured framework for building single-page applications.", icon: "Component", language: "typescript", runnable: false, chapters: ["Intro", "Components", "Directives", "Data Binding", "Services and DI", "Routing"] },
  { title: "AngularJS", description: "The original Angular — directives and two-way binding in the browser.", icon: "Component", language: "javascript", runnable: false, chapters: ["Intro", "Directives", "Expressions", "Controllers", "Services"] },
  { title: "MySQL", description: "The world's most popular open-source relational database.", icon: "Database", language: "sql", runnable: false, chapters: ["Intro", "CREATE TABLE", "SELECT", "WHERE", "JOIN", "Aggregate Functions"] },
  { title: "Git", description: "The distributed version control system every team relies on.", icon: "GitBranch", language: "bash", runnable: false, chapters: ["Intro", "Repository", "Commit", "Branch", "Remote and GitHub"] },
  { title: "PostgreSQL", description: "A powerful, standards-compliant open-source relational database.", icon: "Database", language: "sql", runnable: false, chapters: ["Intro", "Create Table", "Select", "Where", "Join"] },
  { title: "MongoDB", description: "A document-oriented NoSQL database for flexible schemas.", icon: "Leaf", language: "javascript", runnable: false, chapters: ["Intro", "Insert", "Find", "Update", "Delete"] },
  { title: "R", description: "A language built for statistics and data visualization.", icon: "BarChart3", language: "r", runnable: false, chapters: ["Intro", "Variables", "Data Types", "Vectors", "Data Frames"] },
  { title: "Go", description: "A simple, fast, compiled language built for concurrency.", icon: "Zap", language: "go", runnable: false, chapters: ["Intro", "Variables", "Functions", "Structs", "Concurrency Basics"] },
  { title: "Kotlin", description: "A modern, concise language for Android and the JVM.", icon: "Triangle", language: "kotlin", runnable: false, chapters: ["Intro", "Variables", "Functions", "OOP", "Null Safety"] },
  { title: "Swift", description: "Apple's modern language for iOS, macOS, and beyond.", icon: "Feather", language: "swift", runnable: false, chapters: ["Intro", "Variables and Constants", "Arrays", "Functions", "Optionals"] },
  { title: "Sass", description: "A CSS preprocessor with variables, nesting, and mixins.", icon: "Palette", language: "scss", runnable: false, chapters: ["Intro", "Variables", "Nesting", "Import and Partials", "Mixins"] },
  { title: "Vue", description: "An approachable, incrementally adoptable frontend framework.", icon: "Component", language: "javascript", runnable: false, chapters: ["Intro", "Directives", "v-bind", "Components", "Data Binding"] },
  { title: "Bash", description: "The shell scripting language behind Linux and macOS automation.", icon: "TerminalSquare", language: "bash", runnable: false, chapters: ["Intro", "Variables", "Conditionals", "Loops", "Functions"] },
  { title: "Rust", description: "A systems language focused on memory safety without a garbage collector.", icon: "Cog", language: "rust", runnable: false, chapters: ["Intro", "Variables", "Ownership and Borrowing", "Functions"] },
  { title: "ASP.NET", description: "Microsoft's framework for building web apps and services on .NET.", icon: "Server", language: "html", runnable: false, chapters: ["Intro", "Web Pages", "Razor Syntax"] },
  { title: "AI", description: "The fundamentals of how machines learn and make decisions.", icon: "Brain", language: "python", runnable: true, chapters: ["What is AI", "ML vs Traditional Programming", "Neural Nets", "Perceptrons"] },
  { title: "Generative AI", description: "How modern AI models create text, images, and code.", icon: "Sparkles", language: "python", runnable: true, chapters: ["Intro", "Prompt Engineering", "Using Gen-AI Tools"] },
  { title: "SciPy", description: "Scientific computing building on NumPy for optimization and stats.", icon: "Sigma", language: "python", runnable: false, chapters: ["Intro", "Constants", "Optimization", "Stats Modules"] },
  { title: "AWS", description: "Amazon's cloud platform for compute, storage, and more.", icon: "Cloud", language: "plaintext", runnable: false, chapters: ["Cloud Intro", "Core Services", "Security", "Pricing"] },
  { title: "Cyber Security", description: "Core concepts for protecting systems, data, and people.", icon: "Shield", language: "plaintext", runnable: false, chapters: ["Intro", "Threats and Attacks", "Cryptography", "Defense"] },
  { title: "Data Science", description: "Turning raw data into insight using code and statistics.", icon: "BarChart3", language: "python", runnable: false, chapters: ["Intro", "Data Handling with Pandas", "Visualization", "Statistics"] },
  { title: "Intro to Programming", description: "The universal building blocks behind every programming language.", icon: "Code2", language: "python", runnable: true, chapters: ["Variables", "Types", "Conditions", "Loops", "Functions", "Arrays"] },
  { title: "JSON", description: "The lightweight data-interchange format used across the web.", icon: "Braces", language: "json", runnable: false, chapters: ["What is JSON", "Syntax", "Objects and Arrays", "Parse and Stringify"] },
  { title: "Machine Learning", description: "Teaching computers to find patterns and make predictions from data.", icon: "Brain", language: "python", runnable: false, chapters: ["Intro", "Data Types", "Statistics", "Regression", "Train and Test", "Decision Trees"] },
];

function codeSnippet(language: string, topic: string, chapter: string): string {
  const safeTopic = topic.replace(/"/g, "'");
  const safeChapter = chapter.replace(/"/g, "'");
  switch (language) {
    case "html":
      return `<!-- ${safeTopic}: ${safeChapter} -->\n<!doctype html>\n<html>\n  <body>\n    <h1>${safeChapter}</h1>\n    <p>Edit this code and press Run to see it live.</p>\n  </body>\n</html>`;
    case "css":
      return `/* ${safeTopic}: ${safeChapter} */\nbody {\n  font-family: sans-serif;\n  background: #0B0F17;\n  color: #E5E7EB;\n}\n\n.card {\n  padding: 1rem;\n  border-radius: 0.75rem;\n  border: 1px solid #22D3EE55;\n}`;
    case "javascript":
      return `// ${safeTopic}: ${safeChapter}\nfunction demo() {\n  console.log("Exploring ${safeChapter} in ${safeTopic}");\n}\n\ndemo();`;
    case "python":
      return `# ${safeTopic}: ${safeChapter}\ndef demo():\n    print("Exploring ${safeChapter} in ${safeTopic}")\n\ndemo()`;
    case "sql":
      return `-- ${safeTopic}: ${safeChapter}\nSELECT *\nFROM agents\nWHERE clearance_level > 0;`;
    case "java":
      return `// ${safeTopic}: ${safeChapter}\npublic class Demo {\n  public static void main(String[] args) {\n    System.out.println("Exploring ${safeChapter}");\n  }\n}`;
    case "php":
      return `<?php\n// ${safeTopic}: ${safeChapter}\necho "Exploring ${safeChapter} in ${safeTopic}";\n?>`;
    case "c":
      return `// ${safeTopic}: ${safeChapter}\n#include <stdio.h>\n\nint main() {\n  printf("Exploring ${safeChapter}\\n");\n  return 0;\n}`;
    case "cpp":
      return `// ${safeTopic}: ${safeChapter}\n#include <iostream>\n\nint main() {\n  std::cout << "Exploring ${safeChapter}" << std::endl;\n  return 0;\n}`;
    case "csharp":
      return `// ${safeTopic}: ${safeChapter}\nusing System;\n\nclass Demo {\n  static void Main() {\n    Console.WriteLine("Exploring ${safeChapter}");\n  }\n}`;
    case "xml":
      return `<!-- ${safeTopic}: ${safeChapter} -->\n<case-file>\n  <topic>${safeTopic}</topic>\n  <chapter>${safeChapter}</chapter>\n</case-file>`;
    case "bash":
      return `#!/usr/bin/env bash\n# ${safeTopic}: ${safeChapter}\necho "Exploring ${safeChapter} in ${safeTopic}"`;
    case "go":
      return `// ${safeTopic}: ${safeChapter}\npackage main\n\nimport "fmt"\n\nfunc main() {\n  fmt.Println("Exploring ${safeChapter}")\n}`;
    case "kotlin":
      return `// ${safeTopic}: ${safeChapter}\nfun main() {\n  println("Exploring ${safeChapter}")\n}`;
    case "swift":
      return `// ${safeTopic}: ${safeChapter}\nprint("Exploring ${safeChapter} in ${safeTopic}")`;
    case "scss":
      return `// ${safeTopic}: ${safeChapter}\n$accent: #22D3EE;\n\n.card {\n  border: 1px solid $accent;\n}`;
    case "rust":
      return `// ${safeTopic}: ${safeChapter}\nfn main() {\n    println!("Exploring ${safeChapter}");\n}`;
    case "r":
      return `# ${safeTopic}: ${safeChapter}\nmessage <- paste("Exploring", "${safeChapter}")\nprint(message)`;
    case "json":
      return `{\n  "topic": "${safeTopic}",\n  "chapter": "${safeChapter}"\n}`;
    default:
      return `# ${safeTopic}: ${safeChapter}\n# Reference material — read the notes on the left and follow along in your own environment.`;
  }
}

function lessonMarkdown(topic: TopicConfig, chapter: string): string {
  return `## ${chapter}

${chapter} is a core part of ${topic.title}. In this case file you'll learn what it is, why it matters, and how to use it in real code.

Understanding ${chapter.toLowerCase()} well means you can read other people's ${topic.title} code with confidence, and avoid the most common beginner mistakes in this area.

**Key points:**

- What ${chapter.toLowerCase()} means in the context of ${topic.title}
- A minimal example you can run or read in the playground on the right
- A common mistake to avoid when working with ${chapter.toLowerCase()}

\`\`\`${topic.language}
${codeSnippet(topic.language, topic.title, chapter)}
\`\`\`

> **Tip:** Try changing a value in the code on the right and re-running it — small experiments are the fastest way to build real intuition for ${chapter.toLowerCase()}.
`;
}

function quizQuestions(topic: TopicConfig) {
  return [
    {
      question: `What is ${topic.title} primarily used for?`,
      options: [
        topic.description,
        "Formatting physical documents for print only",
        "Managing hardware power settings",
        "Compressing video files",
      ],
      correctIndex: 0,
      explanation: `${topic.title} is best summarized as: ${topic.description}`,
    },
    {
      question: `Which of these is a real chapter covered in the ${topic.title} case file?`,
      options: [
        topic.chapters[Math.floor(topic.chapters.length / 2)],
        "Quantum Encryption Basics",
        "Analog Signal Processing",
        "Medieval History",
      ],
      correctIndex: 0,
      explanation: `${topic.chapters[Math.floor(topic.chapters.length / 2)]} is one of the chapters in this topic's curriculum.`,
    },
    {
      question: `In The Lab playground, what does the "Reset" button do?`,
      options: [
        "Restores the lesson's original starter code",
        "Permanently deletes your account",
        "Submits the quiz automatically",
        "Publishes your code publicly",
      ],
      correctIndex: 0,
      explanation: `Reset discards your edits and reloads the original starter code for the lesson.`,
    },
    {
      question: `What score do you need on this topic's quiz to unlock your Agent Certification?`,
      options: ["70% or higher", "Exactly 50%", "100% only", "There is no minimum score"],
      correctIndex: 0,
      explanation: `Coding Spy requires a 70% or higher pass rate before a certificate can be issued for a topic.`,
    },
  ];
}

async function main() {
  console.log("Seeding Coding Spy…");

  const adminPasswordHash = await bcrypt.hash("ChangeMe123!", 10);
  await prisma.user.upsert({
    where: { email: "admin@codingspy.dev" },
    update: {},
    create: {
      email: "admin@codingspy.dev",
      name: "Agent Zero",
      passwordHash: adminPasswordHash,
      role: "ADMIN",
    },
  });
  console.log("Admin user ready: admin@codingspy.dev / ChangeMe123!");

  for (let i = 0; i < TOPICS.length; i++) {
    const topicConfig = TOPICS[i];
    const slug = slugify(topicConfig.title);
    const color = PALETTE[i % PALETTE.length];

    const topic = await prisma.topic.upsert({
      where: { slug },
      update: {
        title: topicConfig.title,
        description: topicConfig.description,
        icon: topicConfig.icon,
        color,
        order: i,
      },
      create: {
        slug,
        title: topicConfig.title,
        description: topicConfig.description,
        icon: topicConfig.icon,
        color,
        order: i,
      },
    });

    for (let ci = 0; ci < topicConfig.chapters.length; ci++) {
      const chapterTitle = topicConfig.chapters[ci];

      const existingChapter = await prisma.chapter.findFirst({
        where: { topicId: topic.id, title: chapterTitle },
      });
      const chapter =
        existingChapter ??
        (await prisma.chapter.create({
          data: { topicId: topic.id, title: chapterTitle, order: ci },
        }));

      const lessonSlug = slugify(chapterTitle);
      const existingLesson = await prisma.lesson.findFirst({
        where: { chapterId: chapter.id, slug: lessonSlug },
      });

      if (!existingLesson) {
        await prisma.lesson.create({
          data: {
            chapterId: chapter.id,
            title: chapterTitle,
            slug: lessonSlug,
            order: ci,
            contentMarkdown: lessonMarkdown(topicConfig, chapterTitle),
            language: topicConfig.language,
            starterCode: codeSnippet(topicConfig.language, topicConfig.title, chapterTitle),
            runnable: topicConfig.runnable,
          },
        });
      }
    }

    const existingQuiz = await prisma.quiz.findFirst({ where: { topicId: topic.id } });
    if (!existingQuiz) {
      const quiz = await prisma.quiz.create({
        data: { topicId: topic.id, title: `${topicConfig.title} Case File Quiz` },
      });
      const questions = quizQuestions(topicConfig);
      for (let qi = 0; qi < questions.length; qi++) {
        const q = questions[qi];
        await prisma.quizQuestion.create({
          data: {
            quizId: quiz.id,
            question: q.question,
            options: q.options,
            correctIndex: q.correctIndex,
            explanation: q.explanation,
            order: qi,
          },
        });
      }
    }

    console.log(`Seeded topic ${i + 1}/${TOPICS.length}: ${topicConfig.title}`);
  }

  console.log(`Done. Seeded ${TOPICS.length} topics.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
