import { createFileRoute } from "@tanstack/react-router";
import { HeroBanner } from "@/components/home/HeroBanner";
import { CourseRow } from "@/components/home/CourseRow";
import { useCourseModal } from "@/components/home/useCourseModal";
import { AchievementsWidget } from "@/components/layout/AchievementsWidget";
import {
  featuredCourse,
  continueWatching,
  newReleases,
  top10,
  allCourses,
} from "@/data/courses";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Início — FluxEAD" },
      { name: "description", content: "Continue assistindo, novidades e top 10 dos cursos." },
    ],
  }),
  component: Index,
});

function Index() {
  const { show, Modal } = useCourseModal();

  return (
    <main className="pb-16">
      <AchievementsWidget />
      <HeroBanner course={featuredCourse} onMoreInfo={show} />
      <div className="relative -mt-24 z-10 space-y-8">
        {continueWatching.length > 0 && (
          <CourseRow title="Continue assistindo, Carlos" courses={continueWatching} onSelect={show} />
        )}
        <CourseRow title="Top 10 no FluxEAD" courses={top10.length ? top10 : allCourses.slice(0, 5)} onSelect={show} numbered />
        {newReleases.length > 0 && (
          <CourseRow title="Novidades" courses={newReleases} onSelect={show} />
        )}
        <CourseRow title="Recomendados para você" courses={allCourses} onSelect={show} />
        <CourseRow title="Negócios e Marketing" courses={allCourses.slice(0, 6)} onSelect={show} />
      </div>
      <Modal />
    </main>
  );
}
