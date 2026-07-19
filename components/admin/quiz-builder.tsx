"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { AdminQuiz } from "@/components/admin/types";

export function QuizBuilder({
  topicId,
  quiz,
  onQuizCreated,
  onQuestionAdded,
  onQuestionDeleted,
}: {
  topicId: string;
  quiz: AdminQuiz | undefined;
  onQuizCreated: (quiz: AdminQuiz) => void;
  onQuestionAdded: (question: AdminQuiz["questions"][number]) => void;
  onQuestionDeleted: (questionId: string) => void;
}) {
  const [creatingQuiz, setCreatingQuiz] = useState(false);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const [explanation, setExplanation] = useState("");

  async function createQuiz() {
    setCreatingQuiz(true);
    const res = await fetch("/api/admin/quizzes", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ title: "Topic Quiz", topicId }),
    });
    setCreatingQuiz(false);
    if (!res.ok) {
      toast.error("Could not create quiz.");
      return;
    }
    const created = await res.json();
    toast.success("Quiz created — add some questions below.");
    onQuizCreated({ ...created, questions: [] });
  }

  async function addQuestion() {
    if (!quiz) return;
    if (!question.trim() || options.some((o) => !o.trim())) {
      toast.error("Fill in the question and all options.");
      return;
    }
    const res = await fetch("/api/admin/questions", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ quizId: quiz.id, question, options, correctIndex, explanation }),
    });
    if (!res.ok) {
      toast.error("Could not add question.");
      return;
    }
    const created = await res.json();
    setQuestion("");
    setOptions(["", "", "", ""]);
    setCorrectIndex(0);
    setExplanation("");
    toast.success("Question added.");
    onQuestionAdded(created);
  }

  async function deleteQuestion(id: string) {
    if (!confirm("Delete this question?")) return;
    const res = await fetch(`/api/admin/questions/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Could not delete question.");
      return;
    }
    toast.success("Question deleted.");
    onQuestionDeleted(id);
  }

  if (!quiz) {
    return (
      <Button size="sm" variant="secondary" onClick={createQuiz} disabled={creatingQuiz}>
        <Plus className="h-4 w-4" /> Create Topic Quiz
      </Button>
    );
  }

  return (
    <div className="space-y-4 rounded-lg border border-border/60 p-4">
      <p className="text-sm font-semibold">{quiz.title}</p>
      <ul className="space-y-2">
        {quiz.questions.map((q, i) => (
          <li key={q.id} className="flex items-start justify-between gap-2 rounded-md bg-card/60 p-2 text-sm">
            <span>
              {i + 1}. {q.question}
            </span>
            <button onClick={() => deleteQuestion(q.id)} aria-label="Delete question">
              <Trash2 className="h-4 w-4 text-destructive" />
            </button>
          </li>
        ))}
      </ul>
      <div className="space-y-2 border-t border-border/60 pt-3">
        <Input placeholder="Question" value={question} onChange={(e) => setQuestion(e.target.value)} />
        {options.map((opt, i) => (
          <div key={i} className="flex items-center gap-2">
            <input type="radio" checked={correctIndex === i} onChange={() => setCorrectIndex(i)} />
            <Input
              placeholder={`Option ${i + 1}`}
              value={opt}
              onChange={(e) => setOptions((os) => os.map((o, oi) => (oi === i ? e.target.value : o)))}
            />
          </div>
        ))}
        <Input placeholder="Explanation" value={explanation} onChange={(e) => setExplanation(e.target.value)} />
        <Button size="sm" onClick={addQuestion}>
          <Plus className="h-4 w-4" /> Add Question
        </Button>
      </div>
    </div>
  );
}
