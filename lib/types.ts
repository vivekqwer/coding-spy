export type LessonPreview = {
  slug: string;
  language: string;
  starterCode: string;
};

export type NavTopic = {
  slug: string;
  title: string;
  color: string;
};

export type TopicCardData = {
  slug: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  lessonCount: number;
  firstLesson: LessonPreview | null;
  isPaid: boolean;
  priceInCents: number;
  currency: string;
};
