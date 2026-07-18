"use client";

import { useState } from "react";
import { toast } from "sonner";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Question = {
  id: string;
  question: string;
  options: string[];
  explanation: string;
};

type SubmitResult = {
  score: number;
  passed: boolean;
  results: { questionId: string; correct: boolean; correctIndex: number; explanation: string }[];
};

export function Quiz({ quizId, title, questions }: { quizId: string; title: string; questions: Question[] }) {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    if (Object.keys(answers).length < questions.length) {
      toast.error("Answer every question before submitting, Agent.");
      return;
    }
    setSubmitting(true);
    const res = await fetch(`/api/quiz/${quizId}/submit`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ answers }),
    });
    setSubmitting(false);
    if (!res.ok) {
      toast.error("Sign in to submit this quiz.");
      return;
    }
    const data = (await res.json()) as SubmitResult;
    setResult(data);
    toast[data.passed ? "success" : "error"](
      data.passed ? `Cleared at ${data.score}% — certification unlocked.` : `Scored ${data.score}% — 70% needed to pass.`
    );
  }

  const resultMap = new Map(result?.results.map((r) => [r.questionId, r]));

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <p className="text-sm text-muted-foreground">Score 70% or higher to unlock your Agent Certification.</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {questions.map((q, qi) => {
          const r = resultMap.get(q.id);
          return (
            <div key={q.id}>
              <p className="mb-2 font-medium">
                {qi + 1}. {q.question}
              </p>
              <div className="space-y-2">
                {q.options.map((opt, oi) => {
                  const selected = answers[q.id] === oi;
                  const isCorrectChoice = r && oi === r.correctIndex;
                  const isWrongChoice = r && selected && !r.correct;
                  return (
                    <button
                      key={oi}
                      type="button"
                      disabled={!!result}
                      onClick={() => setAnswers((a) => ({ ...a, [q.id]: oi }))}
                      className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-left text-sm transition ${
                        selected ? "border-spy-cyan bg-spy-cyan/10" : "border-border hover:border-spy-cyan/40"
                      } ${isCorrectChoice ? "border-green-500 bg-green-500/10" : ""} ${
                        isWrongChoice ? "border-red-500 bg-red-500/10" : ""
                      }`}
                    >
                      {r && isCorrectChoice && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                      {r && isWrongChoice && <XCircle className="h-4 w-4 text-red-500" />}
                      {opt}
                    </button>
                  );
                })}
              </div>
              {r && <p className="mt-2 text-xs text-muted-foreground">{r.explanation}</p>}
            </div>
          );
        })}
        {!result && (
          <Button onClick={handleSubmit} disabled={submitting}>
            {submitting ? "Submitting…" : "Submit Quiz"}
          </Button>
        )}
        {result && (
          <p className="text-sm font-semibold">
            Final score: {result.score}% — {result.passed ? "Passed ✅" : "Not passed yet, try again."}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
