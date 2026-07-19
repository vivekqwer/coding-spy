"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronDown, ChevronRight, Plus, Trash2, Pencil, Search, ChevronsUpDown, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LessonEditor } from "@/components/admin/lesson-editor";
import { QuizBuilder } from "@/components/admin/quiz-builder";
import type { AdminTopic, AdminLesson } from "@/components/admin/types";

export function TopicManager({ initialTopics }: { initialTopics: AdminTopic[] }) {
  const router = useRouter();
  const [topics, setTopics] = useState(initialTopics);
  const [query, setQuery] = useState("");
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [chapterExpanded, setChapterExpanded] = useState<Record<string, boolean>>({});
  const [editingLesson, setEditingLesson] = useState<AdminLesson | null>(null);
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [newChapterTitle, setNewChapterTitle] = useState<Record<string, string>>({});
  const [newLessonTitle, setNewLessonTitle] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return topics;
    return topics.filter((t) => t.title.toLowerCase().includes(q));
  }, [topics, query]);

  function refresh() {
    router.refresh();
  }

  function expandAll() {
    setExpanded(Object.fromEntries(filtered.map((t) => [t.id, true])));
  }
  function collapseAll() {
    setExpanded({});
  }

  async function addTopic() {
    if (!newTopicTitle.trim()) return;
    setBusy(true);
    const res = await fetch("/api/admin/topics", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title: newTopicTitle, description: `Learn ${newTopicTitle} from the ground up.` }),
    });
    setBusy(false);
    if (res.ok) {
      const topic = await res.json();
      setTopics((t) => [...t, { ...topic, chapters: [], quizzes: [] }]);
      setNewTopicTitle("");
      toast.success("Topic created.");
      refresh();
    } else {
      toast.error("Could not create topic.");
    }
  }

  async function deleteTopic(id: string, title: string) {
    if (!confirm(`Delete "${title}" and everything inside it (chapters, lessons, quiz)? This can't be undone.`)) return;
    const res = await fetch(`/api/admin/topics/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Could not delete topic.");
      return;
    }
    setTopics((t) => t.filter((x) => x.id !== id));
    toast.success("Topic deleted.");
    refresh();
  }

  async function addChapter(topicId: string) {
    const title = newChapterTitle[topicId];
    if (!title?.trim()) return;
    const res = await fetch("/api/admin/chapters", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ topicId, title }),
    });
    if (!res.ok) {
      toast.error("Could not add chapter.");
      return;
    }
    const chapter = await res.json();
    setNewChapterTitle((s) => ({ ...s, [topicId]: "" }));
    setTopics((ts) =>
      ts.map((t) => (t.id === topicId ? { ...t, chapters: [...t.chapters, { ...chapter, lessons: [] }] } : t))
    );
    toast.success("Chapter added.");
    refresh();
  }

  async function deleteChapter(topicId: string, chapterId: string, title: string) {
    if (!confirm(`Delete chapter "${title}" and all its lessons?`)) return;
    const res = await fetch(`/api/admin/chapters/${chapterId}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Could not delete chapter.");
      return;
    }
    setTopics((ts) =>
      ts.map((t) => (t.id === topicId ? { ...t, chapters: t.chapters.filter((c) => c.id !== chapterId) } : t))
    );
    toast.success("Chapter deleted.");
    refresh();
  }

  async function addLesson(topicId: string, chapterId: string) {
    const title = newLessonTitle[chapterId];
    if (!title?.trim()) return;
    const res = await fetch("/api/admin/lessons", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chapterId,
        title,
        contentMarkdown: `## ${title}\n\nWrite the lesson content here.`,
        language: "html",
        starterCode: "<!-- starter code -->",
      }),
    });
    if (!res.ok) {
      toast.error("Could not add lesson.");
      return;
    }
    const lesson = await res.json();
    setNewLessonTitle((s) => ({ ...s, [chapterId]: "" }));
    setTopics((ts) =>
      ts.map((t) =>
        t.id === topicId
          ? {
              ...t,
              chapters: t.chapters.map((c) => (c.id === chapterId ? { ...c, lessons: [...c.lessons, lesson] } : c)),
            }
          : t
      )
    );
    toast.success("Lesson added.");
    refresh();
  }

  async function deleteLesson(topicId: string, chapterId: string, lessonId: string, title: string) {
    if (!confirm(`Delete lesson "${title}"?`)) return;
    const res = await fetch(`/api/admin/lessons/${lessonId}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Could not delete lesson.");
      return;
    }
    setTopics((ts) =>
      ts.map((t) =>
        t.id === topicId
          ? {
              ...t,
              chapters: t.chapters.map((c) =>
                c.id === chapterId ? { ...c, lessons: c.lessons.filter((l) => l.id !== lessonId) } : c
              ),
            }
          : t
      )
    );
    toast.success("Lesson deleted.");
    refresh();
  }

  function updateLessonInState(topicId: string, chapterId: string, updated: AdminLesson) {
    setTopics((ts) =>
      ts.map((t) =>
        t.id === topicId
          ? {
              ...t,
              chapters: t.chapters.map((c) =>
                c.id === chapterId ? { ...c, lessons: c.lessons.map((l) => (l.id === updated.id ? updated : l)) } : c
              ),
            }
          : t
      )
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="flex flex-col gap-3 pt-5 sm:flex-row sm:items-end">
          <div className="flex-1">
            <Label>New Topic Title</Label>
            <Input value={newTopicTitle} onChange={(e) => setNewTopicTitle(e.target.value)} placeholder="e.g. Rust" />
          </div>
          <Button onClick={addTopic} disabled={busy}>
            <Plus className="h-4 w-4" /> Add Topic
          </Button>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Find a case file…"
            className="pl-9"
          />
        </div>
        <div className="flex gap-2 text-sm text-muted-foreground">
          <button onClick={expandAll} className="flex items-center gap-1 hover:text-foreground">
            <ChevronsUpDown className="h-3.5 w-3.5" /> Expand all
          </button>
          <span>·</span>
          <button onClick={collapseAll} className="hover:text-foreground">
            Collapse all
          </button>
          <span className="ml-2">
            {filtered.length} of {topics.length} case files
          </span>
        </div>
      </div>

      {filtered.length === 0 && (
        <div className="glass rounded-2xl p-10 text-center text-muted-foreground">No intel yet, Agent.</div>
      )}

      {filtered.map((topic) => (
        <Card key={topic.id}>
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <button
                className="flex items-center gap-2 text-left font-semibold"
                onClick={() => setExpanded((e) => ({ ...e, [topic.id]: !e[topic.id] }))}
              >
                {expanded[topic.id] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: topic.color }} />
                {topic.title}
                <span className="text-xs font-normal text-muted-foreground">
                  ({topic.chapters.length} chapters · {topic.chapters.reduce((n, c) => n + c.lessons.length, 0)} lessons)
                </span>
                {topic.quizzes[0] ? (
                  <Badge className="border-green-500/40 bg-green-500/10 text-green-500">
                    Quiz · {topic.quizzes[0].questions.length}Q
                  </Badge>
                ) : (
                  <Badge className="border-muted-foreground/30 bg-transparent text-muted-foreground">
                    <HelpCircle className="mr-1 h-3 w-3" /> No quiz
                  </Badge>
                )}
              </button>
              <button onClick={() => deleteTopic(topic.id, topic.title)} aria-label="Delete topic">
                <Trash2 className="h-4 w-4 text-destructive" />
              </button>
            </div>

            {expanded[topic.id] && (
              <div className="mt-4 space-y-3 border-t border-border/60 pt-4">
                {topic.chapters.map((chapter) => (
                  <div key={chapter.id} className="rounded-lg border border-border/60 p-3">
                    <div className="flex items-center justify-between">
                      <button
                        className="flex items-center gap-2 text-sm font-medium"
                        onClick={() =>
                          setChapterExpanded((e) => ({ ...e, [chapter.id]: !e[chapter.id] }))
                        }
                      >
                        {chapterExpanded[chapter.id] ? (
                          <ChevronDown className="h-3.5 w-3.5" />
                        ) : (
                          <ChevronRight className="h-3.5 w-3.5" />
                        )}
                        {chapter.title}
                        <span className="text-xs font-normal text-muted-foreground">
                          ({chapter.lessons.length})
                        </span>
                      </button>
                      <button onClick={() => deleteChapter(topic.id, chapter.id, chapter.title)} aria-label="Delete chapter">
                        <Trash2 className="h-3.5 w-3.5 text-destructive" />
                      </button>
                    </div>
                    {chapterExpanded[chapter.id] && (
                      <div className="mt-3 space-y-2 pl-5">
                        {chapter.lessons.map((lesson) => (
                          <div key={lesson.id} className="flex items-center justify-between text-sm">
                            <span>{lesson.title}</span>
                            <div className="flex items-center gap-2">
                              <button onClick={() => setEditingLesson(lesson)} aria-label="Edit lesson">
                                <Pencil className="h-3.5 w-3.5 text-spy-cyan" />
                              </button>
                              <button
                                onClick={() => deleteLesson(topic.id, chapter.id, lesson.id, lesson.title)}
                                aria-label="Delete lesson"
                              >
                                <Trash2 className="h-3.5 w-3.5 text-destructive" />
                              </button>
                            </div>
                          </div>
                        ))}
                        <div className="flex gap-2">
                          <Input
                            placeholder="New lesson title"
                            value={newLessonTitle[chapter.id] ?? ""}
                            onChange={(e) =>
                              setNewLessonTitle((s) => ({ ...s, [chapter.id]: e.target.value }))
                            }
                          />
                          <Button size="sm" onClick={() => addLesson(topic.id, chapter.id)}>
                            Add
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    placeholder="New chapter title"
                    value={newChapterTitle[topic.id] ?? ""}
                    onChange={(e) => setNewChapterTitle((s) => ({ ...s, [topic.id]: e.target.value }))}
                  />
                  <Button size="sm" variant="secondary" onClick={() => addChapter(topic.id)}>
                    Add Chapter
                  </Button>
                </div>

                <QuizBuilder
                  topicId={topic.id}
                  quiz={topic.quizzes[0]}
                  onQuizCreated={(quiz) =>
                    setTopics((ts) => ts.map((t) => (t.id === topic.id ? { ...t, quizzes: [quiz] } : t)))
                  }
                  onQuestionAdded={(question) =>
                    setTopics((ts) =>
                      ts.map((t) =>
                        t.id === topic.id
                          ? { ...t, quizzes: t.quizzes.map((q) => ({ ...q, questions: [...q.questions, question] })) }
                          : t
                      )
                    )
                  }
                  onQuestionDeleted={(questionId) =>
                    setTopics((ts) =>
                      ts.map((t) =>
                        t.id === topic.id
                          ? {
                              ...t,
                              quizzes: t.quizzes.map((q) => ({
                                ...q,
                                questions: q.questions.filter((qq) => qq.id !== questionId),
                              })),
                            }
                          : t
                      )
                    )
                  }
                />
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {editingLesson && (
        <LessonEditor
          lesson={editingLesson}
          onClose={() => setEditingLesson(null)}
          onSaved={(updated) => {
            const topic = topics.find((t) => t.chapters.some((c) => c.lessons.some((l) => l.id === updated.id)));
            const chapter = topic?.chapters.find((c) => c.lessons.some((l) => l.id === updated.id));
            if (topic && chapter) updateLessonInState(topic.id, chapter.id, updated);
            setEditingLesson(null);
            refresh();
          }}
        />
      )}
    </div>
  );
}
