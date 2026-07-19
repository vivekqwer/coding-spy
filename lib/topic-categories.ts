export const TOPIC_CATEGORIES: { name: string; topics: string[] }[] = [
  {
    name: "Web Fundamentals",
    topics: ["HTML", "CSS", "JavaScript", "W3.CSS", "Bootstrap", "Sass", "How To", "JSON", "XML"],
  },
  {
    name: "Frontend Frameworks",
    topics: ["React", "Vue", "Angular", "AngularJS", "jQuery", "TypeScript"],
  },
  {
    name: "Programming Languages",
    topics: ["Python", "Java", "PHP", "C", "C++", "C#", "Go", "Kotlin", "Swift", "Rust", "R", "Bash"],
  },
  {
    name: "Databases",
    topics: ["SQL", "MySQL", "PostgreSQL", "MongoDB"],
  },
  {
    name: "Data Science & AI",
    topics: ["NumPy", "Pandas", "SciPy", "Data Science", "AI", "Generative AI", "Machine Learning"],
  },
  {
    name: "Backend & DevOps",
    topics: ["Node.js", "Django", "ASP.NET", "Git", "AWS", "Cyber Security"],
  },
  {
    name: "Computer Science",
    topics: ["DSA", "Intro to Programming", "Excel"],
  },
];

export function categorize<T extends { title: string }>(topics: T[]): { name: string; topics: T[] }[] {
  const byTitle = new Map(topics.map((t) => [t.title, t]));
  const used = new Set<string>();

  const grouped = TOPIC_CATEGORIES.map((cat) => {
    const items = cat.topics
      .map((title) => byTitle.get(title))
      .filter((t): t is T => {
        if (!t) return false;
        used.add(t.title);
        return true;
      });
    return { name: cat.name, topics: items };
  }).filter((cat) => cat.topics.length > 0);

  const leftovers = topics.filter((t) => !used.has(t.title));
  if (leftovers.length > 0) {
    grouped.push({ name: "More", topics: leftovers });
  }

  return grouped;
}
