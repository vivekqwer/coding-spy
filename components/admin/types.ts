export type AdminQuestion = {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
};

export type AdminQuiz = {
  id: string;
  title: string;
  questions: AdminQuestion[];
};

export type AdminLesson = {
  id: string;
  title: string;
  slug: string;
  order: number;
  contentMarkdown: string;
  language: string;
  starterCode: string;
  runnable: boolean;
};

export type AdminChapter = {
  id: string;
  title: string;
  order: number;
  lessons: AdminLesson[];
};

export type AdminTopic = {
  id: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  order: number;
  isPublished: boolean;
  chapters: AdminChapter[];
  quizzes: AdminQuiz[];
};
