import { useParams } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import { Card } from "@/components/ui-kit/Card";
import { Input } from "@/components/ui-kit/Input";
import { Label } from "@/components/ui-kit/Label";
import { ProjectOverviewTab } from "@/components/projectspage/ProjectDetailTabs/ProjectOverviewTab";
import { ProjectTasksTab } from "@/components/projectspage/ProjectDetailTabs/ProjectTasksTab";
import { ProjectTeamTab } from "@/components/projectspage/ProjectDetailTabs/ProjectTeamTab";
import { ProjectSettingsTab } from "@/components/projectspage/ProjectDetailTabs/ProjectSettingsTab";
import { Pencil } from "lucide-react";
import { LayoutDashboard, List, Users, Settings } from "lucide-react";
import { toast } from "sonner";
import { useProjects } from "@/hooks/useProjects";
import { useTasks } from "@/hooks/useTasks";
import { Tabs, TabsList, TabsTrigger } from '@/components/ui-kit/Tabs';
import { Button } from "@/components/ui-kit/Button";
import { TaskDialog } from "@/components/taskspage/TaskDialog";
import { TaskResDto } from '@fullstack/common';

export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const { project, updateProject } = useProjects(projectId);
  const { tasks, submitTask, deleteTask } = useTasks(projectId);

  // If projectId is missing, show error
  if (!projectId) {
    return <div className="p-8 text-center text-lg text-red-500">Project not found.</div>;
  }

  const [editingTitle, setEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState("");
  const titleInputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'overview'|'tasks'|'team'|'settings'>('overview');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<TaskResDto | null>(null);
  
  useEffect(() => {
    if (project) {
      setTitleInput(project.name || "");
    }
  }, [project]);

  const handleTitleClick = () => {
    setEditingTitle(true);
    setTimeout(() => titleInputRef.current?.focus(), 0);
  };

  const handleTitleBlur = async () => {
    setEditingTitle(false);
    if (!project) return;
    if (titleInput.trim() && titleInput !== project.name) {
      try {
        await updateProject(projectId, { name: titleInput });
        toast.success('Project name updated');
      } catch {
        toast.error('Failed to update project name');
        setTitleInput(project.name); // Revert on failure
      }
    } else {
      setTitleInput(project.name);
    }
  };
  
  return (
    <div className="h-full w-full flex flex-col gap-2">
      {/* Project Name at the top */}
      <div className="flex items-center p-2">
        {editingTitle ? (
          <Input
            ref={titleInputRef}
            value={titleInput}
            onChange={e => setTitleInput(e.target.value)}
            onBlur={handleTitleBlur}
            onKeyDown={e => { 
              if (e.key === 'Enter') { 
                handleTitleBlur(); 
              } else if (e.key === 'Escape') {
                setEditingTitle(false);
              }
            }}
            className="!text-[22px] font-black flex-1 h-[35px] rounded pl-2"
            maxLength={128}
          />
        ) : (
          <div className="flex items-center gap-2">
            <Label
              className="pl-1 text-[22px] font-black cursor-pointer hover:bg-secondary dark:hover:bg-secondary rounded"
              title={project?.name}
              onClick={handleTitleClick}
            >
              {project?.name ? project.name.charAt(0).toUpperCase() + project.name.slice(1) : ''}
            </Label>
            <span className="cursor-pointer flex items-center" title="Edit project name" onClick={handleTitleClick}>
              <Pencil className="ml-2 h-3 w-3 text-muted-foreground hover:text-primary" />
            </span>
          </div>
        )}
      </div>

      {/* Tabs and Add Task Button in one row */}
      <div className="flex items-center px-2 gap-2">
        <Tabs
          value={activeTab}
          onValueChange={val => setActiveTab(val as typeof activeTab)}
        >
          <TabsList className="bg-white dark:bg-muted">
            <TabsTrigger value="overview" className="px-4 flex items-center gap-2 focus:z-10 data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-black">
              <LayoutDashboard className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="tasks" className="px-4 flex items-center gap-2 focus:z-10 data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-black">
              <List className="w-4 h-4" />
              Tasks
            </TabsTrigger>
            <TabsTrigger value="team" className="px-4 flex items-center gap-2 focus:z-10 data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-black">
              <Users className="w-4 h-4" />
              Team Activities
            </TabsTrigger>
            <TabsTrigger value="settings" className="px-4 flex items-center gap-2 focus:z-10 data-[state=active]:bg-gray-100 dark:data-[state=active]:bg-black">
              <Settings className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {activeTab === 'tasks' && (
          <Button
            variant="default"
            className="px-3 py-2 flex items-center ml-auto gap-2 text-white bg-gradient-to-r from-purple-400 to-purple-500 dark:from-purple-600 dark:to-purple-800 transition-200 duration-200 hover:scale-105"
            onClick={() => {
              setEditingTask(null);
              setIsDialogOpen(true);
            }}
          >
            <span className="sr-only">Add Task</span>
            <span className="flex items-center gap-1">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
              Add Task
            </span>
          </Button>
        )}
      </div>
      {isDialogOpen && (
        <TaskDialog
          open={isDialogOpen}
          onOpenChange={(open: boolean) => {
            setIsDialogOpen(open);
            if (!open) setEditingTask(null);
          }}
          onSubmit={async (task: any) => {
            await submitTask({ ...task, projectId });
            setIsDialogOpen(false);
          }}
          title={editingTask ? "Edit Task" : "Add New Task"}
          projects={project ? [project] : []}
          initialValues={editingTask || { projectId }}
        />
      )}

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <ProjectOverviewTab
          project={project}
          projectId={projectId}
          tasks={tasks}
        />
      )}
      {activeTab === 'tasks' && projectId && (
        <ProjectTasksTab
          projectId={projectId}
          tasks={tasks}
          onTaskDelete={deleteTask}
          onTaskStatusChange={async (taskId, newStatus) => {
            const task = tasks.find(t => String(t.id) === String(taskId));
            if (!task) return;
            await submitTask({ ...task, status: newStatus });
          }}
          onTaskClick={taskId => {
            const fullTask = tasks.find(t => t.id === taskId) || null;
            setEditingTask(fullTask);
            setIsDialogOpen(true);
          }}
        />
      )}
      {activeTab === 'team' && <ProjectTeamTab project={project} />}
      {activeTab === 'settings' && <ProjectSettingsTab />}
    </div>
  );
}
