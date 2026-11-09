import data from "@/app/data/projects.json";
import ProjectCard from "./ProjectCard";

export default function ProjectList() {
  return (
    <section className="container w-full py-16 flex flex-col gap-6">
      <h2 className="text-xs font-bold uppercase">{data.title}</h2>
      <div className="project-grid grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-10">
        {data.projects.map((project) => (
          <ProjectCard key={`project-${project.slug}`} project={project} />
        ))}
      </div>
    </section>
  );
}
