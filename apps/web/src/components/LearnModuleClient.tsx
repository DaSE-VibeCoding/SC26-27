"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { MODULE_META } from "@/lib/utils";
import { StudyTimer } from "@/components/StudyTimer";
import { CourseActions } from "@/components/CourseActions";
import { ExpandableContent } from "@/components/ExpandableContent";

type CourseProgress = {
  status: string;
  notes: string;
  studyTime: number;
};

interface Course {
  id: string;
  title: string;
  summary: string;
  level: string;
  durationMin: number;
  order: number;
  progress: CourseProgress;
}

interface CourseModule {
  id: string;
  name: string;
  description: string;
  slug: string;
  courses: Course[];
}

export default function LearnModuleClient({
  params,
}: {
  params: Promise<{ module: string }>;
}) {
  const [courseModule, setCourseModule] = useState<CourseModule | null>(null);
  const [currentCourse, setCurrentCourse] = useState<Course | null>(null);
  const [noteInputs, setNoteInputs] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadData() {
      const { module: moduleSlug } = await params;
      const res = await fetch("/api/courses");
      if (!res.ok) return;
      const data = await res.json();
      const found = data.modules.find((m: { slug: string }) => m.slug === moduleSlug);
      if (found) setCourseModule(found);
    }
    loadData();
  }, [params]);

  if (!courseModule) {
    return <div className="container py-8">加载中...</div>;
  }

  const meta = MODULE_META[courseModule.slug] || {
    name: courseModule.name,
    description: courseModule.description,
    color: "from-stone-400 to-stone-600",
  };

  const totalCourses = courseModule.courses.length;
  const completedCourses = courseModule.courses.filter((c) => c.progress.status === "completed").length;
  const progressPercentage = totalCourses > 0 ? Math.round((completedCourses / totalCourses) * 100) : 0;
  const totalStudyTime = courseModule.courses.reduce((sum, c) => sum + (c.progress.studyTime || 0), 0);

  // 获取下一个推荐课程
  const getNextRecommendedCourse = () => {
    const incompleteCourses = courseModule.courses.filter(
      course => course.progress.status !== "completed"
    );
    
    if (incompleteCourses.length > 0) {
      const nextCourse = incompleteCourses[0];
      return {
        id: nextCourse.id,
        title: nextCourse.title,
        reason: `这是你的下一个课程，建议完成后再继续学习其他内容。`
      };
    }
    return null;
  };

  const nextRecommendedCourse = getNextRecommendedCourse();

  // 更新课程进度
  const updateCourseProgress = async (courseId: string, status: string) => {
    const res = await fetch("/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId, status }),
    });
    if (!res.ok) return;
    const data = await res.json();
    setCourseModule((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        courses: prev.courses.map((c) =>
          c.id === courseId
            ? { ...c, progress: { ...c.progress, status: data.progress.status } }
            : c
        ),
      };
    });
  };

  // 添加笔记
  const addNote = async (courseId: string) => {
    const text = noteInputs[courseId]?.trim();
    if (!text) return;
    const course = courseModule.courses.find((c) => c.id === courseId);
    const existingNotes = course?.progress.notes || "";
    const newNotes = existingNotes + (existingNotes ? "\n---\n" : "") + `[${new Date().toLocaleString("zh-CN")}] ${text}`;
    const res = await fetch("/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId, notes: newNotes }),
    });
    if (!res.ok) return;
    const data = await res.json();
    setCourseModule((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        courses: prev.courses.map((c) =>
          c.id === courseId
            ? { ...c, progress: { ...c.progress, notes: data.progress.notes } }
            : c
        ),
      };
    });
    setNoteInputs({ ...noteInputs, [courseId]: "" });
  };

  // 学习计时结束
  const handleStudySessionEnd = async (courseId: string, seconds: number, currentStudyTime: number) => {
    const newStudyTime = currentStudyTime + seconds;
    const res = await fetch("/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId, studyTime: newStudyTime }),
    });
    if (!res.ok) return;
    const data = await res.json();
    setCourseModule((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        courses: prev.courses.map((c) =>
          c.id === courseId
            ? { ...c, progress: { ...c.progress, studyTime: data.progress.studyTime } }
            : c
        ),
      };
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <Link href="/learn" className="text-sm text-teal-700">
          ← 返回课程模块
        </Link>
        <div className={`mt-3 h-2 w-24 rounded-full bg-gradient-to-r ${meta.color}`} />
        <h1 className="section-title mt-3">{meta.name}</h1>
        <p className="muted mt-1 text-sm">{meta.description}</p>
        
        {/* 进度统计 */}
        <div className="mt-4 rounded-xl bg-white/80 backdrop-blur-sm border border-stone-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-stone-700">学习进度</span>
            <span className="text-sm font-bold text-teal-700">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-stone-200 rounded-full h-3">
            <div 
              className={`h-3 rounded-full bg-gradient-to-r ${meta.color} transition-all duration-500`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="mt-3 flex items-center justify-between text-xs text-stone-500">
            <span>已完成 {completedCourses} / {totalCourses} 课</span>
            {completedCourses === totalCourses && totalCourses > 0 && (
              <span className="text-teal-600 font-medium">🎉 全部完成！</span>
            )}
          </div>
          {/* 每课进度点 */}
          <div className="mt-3 flex items-center gap-2">
            {courseModule.courses.map((course, i) => {
              const done = course.progress.status === "completed";
              return (
                <a
                  key={course.id}
                  href={`#course-${course.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(`course-${course.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
                  }}
                  className="flex items-center gap-1.5 group"
                  title={course.title}
                >
                  <span
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      done
                        ? "bg-teal-500 shadow-sm shadow-teal-200"
                        : "bg-stone-300 group-hover:bg-stone-400"
                    }`}
                  />
                  <span className={`text-xs ${done ? "text-teal-600" : "text-stone-400"} hidden sm:inline`}>
                    {i + 1}
                  </span>
                </a>
              );
            })}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {courseModule.courses.map((c, idx) => {
          const status = c.progress.status;
          const isCompleted = status === "completed";
          
          return (
            <article key={c.id} id={`course-${c.id}`} className="card p-5 hover:shadow-lg transition-shadow scroll-mt-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="text-xs text-stone-400 font-medium">第 {idx + 1} 课</div>
                      <span className="badge">{c.level}</span>
                      <span className="badge">{c.durationMin} 分钟</span>
                      <span
                        className={`badge ${
                          isCompleted ? "badge-brand" : ""
                        }`}
                      >
                        {isCompleted ? "已完成" : "未开始"}
                      </span>
                    </div>
                    
                    <CourseActions courseId={c.id} isCompleted={isCompleted} />
                  </div>
                  
                  <h2 className="text-lg font-bold mb-1">{c.title}</h2>
                  <p className="text-sm text-stone-600 mb-3">{c.summary}</p>
                  
                  {/* 课程内容预览 */}
                  <Link
                    href={`/learn/${courseModule.slug}/${c.id}`}
                    className="text-sm text-teal-700 hover:text-teal-800 font-medium inline-flex items-center gap-1"
                  >
                    查看课程详情 →
                  </Link>
                  
                  {/* 学习计时器 */}
                  {currentCourse?.id === c.id ? (
                    <div className="relative mb-3">
                      <button
                        onClick={() => setCurrentCourse(null)}
                        className="absolute top-2 right-2 text-stone-400 hover:text-stone-600 z-10 text-sm"
                      >
                        ✕
                      </button>
                      <StudyTimer
                        courseId={c.id}
                        courseTitle={c.title}
                        onSessionEnd={(seconds) => handleStudySessionEnd(c.id, seconds, c.progress.studyTime)}
                      />
                    </div>
                  ) : (
                    <div className="mt-3 flex gap-2">
                      <button
                        className="btn btn-sm"
                        onClick={() => setCurrentCourse(c)}
                      >
                        开始学习计时
                      </button>
                    </div>
                  )}
                  
                  {/* 学习笔记 */}
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-200 mt-3">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-lg">📝</span>
                      <div className="text-sm font-medium text-amber-800">学习笔记</div>
                    </div>
                    {c.progress.notes && (
                      <div className="mb-2 p-2 bg-white rounded text-xs text-stone-700 whitespace-pre-wrap max-h-32 overflow-y-auto">
                        {c.progress.notes}
                      </div>
                    )}
                    <textarea
                      placeholder="记录你的学习心得、疑问或重要知识点..."
                      className="textarea w-full text-sm"
                      rows={2}
                      value={noteInputs[c.id] || ""}
                      onChange={(e) => setNoteInputs({ ...noteInputs, [c.id]: e.target.value })}
                    />
                    <button
                      className="btn btn-primary text-xs mt-2"
                      onClick={() => addNote(c.id)}
                    >
                      添加笔记
                    </button>
                  </div>
                </div>
                
                <button
                  className={`btn ${isCompleted ? "btn-secondary" : "btn-primary"}`}
                  onClick={() => updateCourseProgress(c.id, isCompleted ? "not_started" : "completed")}
                >
                  {isCompleted ? "已完成" : "标记完成"}
                </button>
              </div>
            </article>
          );
        })}
      </div>
      
      {/* 学习建议 */}
      <div className="card p-5">
        <div className="flex items-start gap-3 mb-4">
          <span className="text-lg">💡</span>
          <div>
            <h3 className="text-lg font-bold mb-1">学习建议</h3>
            <p className="text-sm text-stone-600 mb-2">
              {progressPercentage === 0 ? "开始你的学习之旅！" : 
               progressPercentage < 50 ? "进展不错，保持动力！" :
               progressPercentage < 100 ? "即将完成，最后冲刺！" : "恭喜完成所有课程！"}
            </p>
          </div>
        </div>
        
        {nextRecommendedCourse && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-sm font-medium text-blue-800 mb-1">推荐下一课程</div>
            <a
              href={`#course-${nextRecommendedCourse.id}`}
              className="text-sm text-blue-700 font-medium hover:text-blue-900 underline"
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(`course-${nextRecommendedCourse.id}`)?.scrollIntoView({ behavior: "smooth", block: "start" });
              }}
            >
              {nextRecommendedCourse.title}
            </a>
            <div className="text-xs text-blue-600 mt-1">{nextRecommendedCourse.reason}</div>
          </div>
        )}

        <div className="space-y-2 text-sm text-stone-600">
          <p>• 建议按照课程顺序学习，循序渐进</p>
          <p>• 每完成一课后及时标记，保持学习动力</p>
          <p>• 遇到问题可以在社区中提问交流</p>
          <p>• 结合实际项目练习，加深理解</p>
        </div>
      </div>

      {/* 学习成就 */}
      <div className="card p-5">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-lg">🏆</span>
          <div>
            <h3 className="text-lg font-bold">学习成就</h3>
            <p className="text-sm text-stone-600">
              已获得 {completedCourses} / {totalCourses} 个成就
            </p>
          </div>
        </div>

        <div className="w-full bg-stone-200 rounded-full h-2 mb-4">
          <div 
            className="h-2 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500"
            style={{ width: `${(completedCourses / totalCourses) * 100}%` }}
          />
        </div>

        <div className="grid gap-3">
          {[
            { id: "1", title: "初学者", description: "完成第一门课程", earned: completedCourses >= 1 },
            { id: "2", title: "坚持学习者", description: "累计学习30分钟", earned: totalStudyTime >= 1800 },
            { id: "3", title: "课程完成者", description: "完成50%的课程", earned: completedCourses >= Math.ceil(totalCourses * 0.5) },
          ].map((achievement) => (
            <div
              key={achievement.id}
              className={`flex items-center gap-3 p-3 rounded-lg border ${
                achievement.earned 
                  ? "bg-yellow-50 border-yellow-200" 
                  : "bg-stone-50 border-stone-200 opacity-60"
              }`}
            >
              <div className={`p-2 rounded-lg ${
                achievement.earned 
                  ? "bg-yellow-100 text-yellow-600" 
                  : "bg-stone-100 text-stone-400"
              }`}>
                <span className="text-lg">🎯</span>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h4 className={`text-sm font-medium ${
                    achievement.earned ? "text-yellow-800" : "text-stone-600"
                  }`}>
                    {achievement.title}
                  </h4>
                  {achievement.earned && (
                    <span className="text-yellow-600">✓</span>
                  )}
                </div>
                <p className="text-xs text-stone-600">{achievement.description}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-stone-200">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-blue-600">{completedCourses}</div>
              <div className="text-xs text-stone-600">已完成课程</div>
            </div>
            <div>
              <div className="text-lg font-bold text-green-600">{Math.round(totalStudyTime / 60)}m</div>
              <div className="text-xs text-stone-600">学习时长</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}