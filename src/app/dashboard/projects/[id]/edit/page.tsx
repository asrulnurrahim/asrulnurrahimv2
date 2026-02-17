import { ProjectForm } from "@/features/dashboard/projects/forms/ProjectForm";
import { getAdminProjectById } from "@/features/dashboard/projects/services/projects";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Edit Project | Dashboard",
  description: "Update your project details",
};

interface EditProjectPageProps {
  params: {
    id: string;
  };
}

export default async function EditProjectPage({
  params,
}: EditProjectPageProps) {
  const { id } = await params;
  const project = await getAdminProjectById(id);

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Edit Project: {project.title}
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Update the details of your project to keep your portfolio current.
        </p>
      </div>

      <ProjectForm project={project} isEditing />
    </div>
  );
}
