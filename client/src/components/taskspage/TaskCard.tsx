import React, { useState } from "react";
import { Card } from "@/components/ui-kit/Card";
import { Button } from "@/components/ui-kit/Button";
import { Trash2 } from "lucide-react";
import { AlertCircle } from "lucide-react";
import { formatDateSmart } from "@/utils/dateUtils";
import { TaskStatus } from "@fullstack/common";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui-kit/Dialog";

interface TaskCardProps {
  title: string;
  description: string;
  dueDate?: string;
  projectName?: string;
  status?: TaskStatus;
  onDelete?: () => void;
  onClick?: () => void;
  className?: string;
}

const statusToColor: Record<TaskStatus, string> = {
  [TaskStatus.TODO]: "text-amber-400 dark:text-amber-500",
  [TaskStatus.IN_PROGRESS]: "text-blue-500 dark:text-blue-400",
  [TaskStatus.DONE]: "text-green-500 dark:text-green-600",
  [TaskStatus.CLOSE]: "text-gray-500",
};

const TaskCard: React.FC<TaskCardProps> = ({ title, dueDate, projectName, status, onDelete, onClick, description, className }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  // Show overdue icon only for TODO and IN_PROGRESS
  const isOverdue = dueDate
    ? (new Date(dueDate).setHours(0,0,0,0) < new Date().setHours(0,0,0,0)) &&
      (status === TaskStatus.TODO || status === TaskStatus.IN_PROGRESS)
    : false;
  return (
    <Card
      className={`group bg-muted dark:bg-black p-3 shadow hover:shadow-lg hover:scale-101 cursor-pointer relative ${className || ''}`}
      tabIndex={0}
      aria-label={title}
      onClick={onClick}
    >
      {/* Delete icon, only visible on hover or focus */}
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-1.5 right-1.5 bg-white/80 hover:bg-red-100 text-gray-400 hover:text-red-500 transition-opacity duration-150 p-1.5 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus:opacity-100 focus-visible:opacity-100 pointer-events-none group-hover:pointer-events-auto group-focus-within:pointer-events-auto focus:pointer-events-auto focus-visible:pointer-events-auto dark:bg-black/60 dark:hover:bg-red-900"
        style={{ width: 26, height: 26, minWidth: 0 }}
        tabIndex={0}
        aria-label="Delete task"
        type="button"
        onClick={e => {
          e.stopPropagation();
          setDialogOpen(true);
        }}
      >
        <Trash2 className="w-3 h-3" />
      </Button>
      {dialogOpen && (
        <Dialog
          open={dialogOpen}
          onOpenChange={setDialogOpen}
        >
          <DialogContent showCloseButton={false} className="max-w-xs" onClick={e => e.stopPropagation()}>
            <DialogHeader>
              <DialogTitle>Delete Task?</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this task? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" type="button">Cancel</Button>
              </DialogClose>
              <Button variant="destructive" type="button"
                onClick={e => {
                  e.stopPropagation();
                  setDialogOpen(false);
                  onDelete && onDelete();
                }}
              >
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      {projectName && (
        <div className={`text-xs lg:text-[13px] mb-1 font-medium font-sans ${status ? statusToColor[status] : 'text-blue-500'}`}>{projectName}</div>
      )}
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-xs lg:text-[13px] line-clamp-3">{title}</h3>
        {dueDate && (
          <span className="text-xs lg:text-[13px] text-muted-foreground ml-2 whitespace-nowrap bg-transparent px-2 py-0.5 rounded font-sans flex items-center gap-1">
            {formatDateSmart(dueDate)}
            {isOverdue && (
              <span title="Overdue">
                <AlertCircle className="w-3 h-3 text-red-500" />
              </span>
            )}
          </span>
        )}
      </div>
    </Card>
  );
};

export default TaskCard;
