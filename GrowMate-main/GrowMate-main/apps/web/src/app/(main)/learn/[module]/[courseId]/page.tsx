import CourseDetailClient from "@/components/CourseDetailClient";

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ module: string; courseId: string }>;
}) {
  return <CourseDetailClient params={params} />;
}