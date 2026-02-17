import { ProjectForm } from "@/features/dashboard/projects/forms/ProjectForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Project | Dashboard",
  description: "Add a new project to your portfolio",
};

export default function CreateProjectPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Create New Project
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Fill out the form below to showcase your new work.
        </p>
      </div>

      <ProjectForm />
    </div>
  );
}
