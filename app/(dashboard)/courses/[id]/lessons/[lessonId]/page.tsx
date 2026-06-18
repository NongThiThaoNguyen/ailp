import { redirect } from 'next/navigation'

// Redirect đến standalone lesson page
export default async function CourseLesson({ params }: { params: Promise<{ id:string; lessonId:string }> }) {
  const { lessonId } = await params
  redirect(`/lessons/${lessonId}`)
}