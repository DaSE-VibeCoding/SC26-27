"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type Lesson = {
  title: string;
  content: string;
  codeExamples: { title: string; code: string; description: string }[];
  exercises: { question: string; hint: string; answer: string }[];
};

export default function CourseDetailClient({
  params,
}: {
  params: Promise<{ module: string; courseId: string }>;
}) {
  const [course, setCourse] = useState<{
    id: string;
    title: string;
    summary: string;
    level: string;
    durationMin: number;
    lessons: Lesson[];
  } | null>(null);
  const [moduleSlug, setModuleSlug] = useState("");
  const [openLessons, setOpenLessons] = useState<Record<number, boolean>>({});
  const [revealedAnswers, setRevealedAnswers] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function load() {
      const { module: slug, courseId } = await params;
      setModuleSlug(slug);
      const res = await fetch("/api/courses");
      if (!res.ok) return;
      const data = await res.json();
      const mod = data.modules.find((m: { slug: string }) => m.slug === slug);
      if (!mod) return;
      const found = mod.courses.find((c: { id: string }) => c.id === courseId);
      if (found) {
        setCourse(found);
        setOpenLessons({ 0: true });
      }
    }
    load();
  }, [params]);

  if (!course) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-stone-500">课程未找到</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6 text-sm text-stone-500">
        <Link href="/learn" className="hover:text-stone-800">学习中心</Link>
        <span>/</span>
        <Link href={`/learn/${moduleSlug}`} className="hover:text-stone-800">技术学习</Link>
        <span>/</span>
        <span className="text-stone-800 font-medium">{course.title}</span>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
        <p className="text-stone-600 mb-3">{course.summary}</p>
        <div className="flex items-center gap-3">
          <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">{course.level}</span>
          <span className="inline-block px-3 py-1 bg-stone-100 text-stone-700 text-sm rounded-full">{course.durationMin} 分钟</span>
          <span className="inline-block px-3 py-1 bg-teal-100 text-teal-700 text-sm rounded-full">{course.lessons.length} 课时</span>
        </div>
      </div>

      <div className="space-y-6">
        {course.lessons.map((lesson, li) => (
          <div key={li} className="border border-stone-200 rounded-xl overflow-hidden">
            <button
              onClick={() => setOpenLessons((prev) => ({ ...prev, [li]: !prev[li] }))}
              className="w-full flex items-center justify-between px-5 py-4 bg-stone-50 hover:bg-stone-100 transition-colors text-left"
            >
              <span className="font-semibold text-stone-800">{lesson.title}</span>
              <span className="text-stone-400 text-lg">{openLessons[li] ? "−" : "+"}</span>
            </button>

            {openLessons[li] && (
              <div className="px-5 py-4 space-y-6">
                <div className="prose prose-stone max-w-none text-sm leading-relaxed whitespace-pre-wrap">
                  {lesson.content}
                </div>

                {lesson.codeExamples.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-stone-700 mb-3">💻 代码示例</h4>
                    <div className="space-y-4">
                      {lesson.codeExamples.map((ex, ci) => (
                        <div key={ci} className="border border-stone-200 rounded-lg overflow-hidden">
                          <div className="px-4 py-2 bg-stone-50 border-b border-stone-100">
                            <div className="font-medium text-sm text-stone-800">{ex.title}</div>
                            <div className="text-xs text-stone-500">{ex.description}</div>
                          </div>
                          <pre className="p-4 text-sm overflow-x-auto bg-stone-900 text-stone-100 leading-relaxed"><code>{ex.code}</code></pre>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {lesson.exercises.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold text-stone-700 mb-3">✏️ 练习题</h4>
                    <div className="space-y-3">
                      {lesson.exercises.map((ex, ei) => {
                        const key = `${li}-${ei}`;
                        return (
                          <div key={ei} className="bg-white border border-stone-200 rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-100 text-teal-700 flex items-center justify-center text-xs font-bold">
                                {ei + 1}
                              </span>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-stone-800 mb-2">{ex.question}</p>
                                <details className="text-xs text-stone-500 mb-2">
                                  <summary className="cursor-pointer hover:text-stone-700">查看提示</summary>
                                  <p className="mt-1 text-stone-600">{ex.hint}</p>
                                </details>
                                <button
                                  onClick={() => setRevealedAnswers((prev) => ({ ...prev, [key]: !prev[key] }))}
                                  className="text-xs text-teal-700 hover:text-teal-800 font-medium"
                                >
                                  {revealedAnswers[key] ? "隐藏答案" : "查看答案"}
                                </button>
                                {revealedAnswers[key] && (
                                  <pre className="mt-2 p-3 bg-stone-50 border border-stone-200 rounded text-xs overflow-x-auto"><code>{ex.answer}</code></pre>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-12 pt-6 border-t border-stone-200 flex items-center justify-between">
        <Link
          href={`/learn/${moduleSlug}`}
          className="text-sm text-stone-500 hover:text-stone-800 inline-flex items-center gap-1"
        >
          ← 返回课程列表
        </Link>
      </div>
    </div>
  );
}