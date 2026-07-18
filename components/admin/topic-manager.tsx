"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { ChevronDown, ChevronRight, Plus, Trash2, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { LessonEditor } from "@/components/admin/lesson-editor";
import { QuizBuilder } from "@/components/admin/quiz-builder";
import type { AdminTopic, AdminLesson } from "@/components/admin/types";

export function TopicManager({ initialTopics }: { initialTopics: AdminTopic[] }) {
  const router = useRouter();
  const [topics, setTopics] = useState(initialTopics);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [chapterExpanded, setChapterExpanded] = useState<Record<string, boolean>>({});
  const [editingLesson, setEditingLesson] = useState<AdminLesson | null>(null);
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [newChapterTitle, setNewChapterTitle] = useState<Record<string, string>>({});
  const [newLessonTitle, setNewLessonTitle] = useState<Record<string, string>>({});

  function refresh() {
    router.refresh();
  }

  async function addTopic() {
    if (!newTopicTitle.trim()) return;
    const res = await fetch("/api/admin/topics", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title: newTopicTitle, description: `Learn ${newTopicTitle} from the ground up.` }),
    });
    if (res.ok) {
      const topic = await res.json();
      setTopics((t) => [...t, { ...topic, chapters: [], quizzes: [] }]);
      setNewTopicTitle("");
      toast.success("Topic created.");
      refresh();
    }
  }

  async function deleteTopic(id: string) {
    await fetch(`/api/admin/topics/${id}`, { method: "DELETE" });
    setTopics((t) => t.filter((x) => x.id !== id));
    toast.success("Topic deleted.");
  }

  async function addChapter(topicId: string) {
    const title = newChapterTitle[topicId];
    if (!title?.trim()) return;
    const res = await fetch("/api/admin/chapters", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ topicId, title }),
    });
    if (res.ok) {
      setNewChapterTitle((s) => ({ ...s, [topicId]: "" }));
      toast.success("Chapter added.");
      refresh();
      location.reload();
    }
  }

  async function deleteChapter(id: string) {
    await fetch(`/api/admin/chapters/${id}`, { method: "DELETE" });
    toast.success("Chapter deleted.");
    location.reload();
  }

  async function addLesson(chapterId: string) {
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
    if (res.ok) {
      setNewLessonTitle((s) => ({ ...s, [chapterId]: "" }));
      toast.success("Lesson added.");
      location.reload();
    }
  }

  async function deleteLesson(id: string) {
    await fetch(`/api/admin/lessons/${id}`, { method: "DELETE" });
    toast.success("Lesson deleted.");
    location.reload();
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="flex items-end gap-3 pt-5">
          <div className="flex-1">
            <Label>New Topic Title</Label>
            <Input value={newTopicTitle} onChange={(e) => setNewTopicTitle(e.target.value)} placeholder="e.g. Rust" />
          </div>
          <Button onClick={addTopic}>
            <Plus className="h-4 w-4" /> Add Topic
          </Button>
        </CardContent>
      </Card>

      {topics.map((topic) => (
        <Card key={topic.id}>
          <CardContent className="pt-5">
            <div className="flex items-center justify-between">
              <button
                className="flex items-center gap-2 text-left font-semibold"
                onClick={() => setExpanded((e) => ({ ...e, [topic.id]: !e[topic.id] }))}
              >
                {expanded[topic.id] ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                {topic.title}
                <span className="text-xs font-normal text-muted-foreground">
                  ({topic.chapters.length} chapters)
                </span>
              </button>
              <button onClick={() => deleteTopic(topic.id)} aria-label="Delete topic">
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
                      </button>
                      <button onClick={() => deleteChapter(chapter.id)} aria-label="Delete chapter">
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
                              <button onClick={() => deleteLesson(lesson.id)} aria-label="Delete lesson">
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
                          <Button size="sm" onClick={() => addLesson(chapter.id)}>
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

                <QuizBuilder topicId={topic.id} quiz={topic.quizzes[0]} onRefresh={() => location.reload()} />
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {editingLesson && (
        <LessonEditor
          lesson={editingLesson}
          onClose={() => setEditingLesson(null)}
          onSaved={() => {
            setEditingLesson(null);
            location.reload();
          }}
        />
      )}
    </div>
  );
}
