import { ProjectList } from "@/features/dashboard/projects/components/ProjectList";
import { getAdminProjects } from "@/features/dashboard/projects/services/projects";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects | Dashboard",
  description: "Manage your portfolio projects",
};

export default async function ProjectsPage() {
  const projects = await getAdminProjects();

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Projects Management
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Create, edit, and manage your portfolio projects efficiently.
        </p>
      </div>

      <ProjectList projects={projects} />
    </div>
  );
}
