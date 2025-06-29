import { Button } from "@/components/ui-kit/Button";
import { Card, CardContent } from "@/components/ui-kit/Card";
import { ListChecks, Folder } from "lucide-react";
import { useOutlet, useNavigate, useLocation } from "react-router-dom";
import { PROJECTS_PATH, TASKS_PATH } from "@/routes/routeConfig";
import { useAuth } from "@/providers/AuthProvider";
import { SidebarNavLink } from "@/components/homepage/SidebarNavLink";

export default function HomePage() {
  const outlet = useOutlet();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // Only show landing content if not authenticated and at root path
  const showLanding = !isAuthenticated && location.pathname === "/";

  return (
    <div className="flex flex-col md:flex-row h-full w-full px-3">
      {/* Sidebar with icon and text */}
      {isAuthenticated && (
        <aside>
          <Card className="w-48 h-[calc(100vh-6rem)] px-3 py-4 flex flex-col items-center gap-2 overflow-y-auto my-3">
            <CardContent className="flex flex-col gap-1 w-full p-0">
              <SidebarNavLink to={TASKS_PATH} icon={<ListChecks className="w-5 h-5" />}>My Tasks</SidebarNavLink>
              <SidebarNavLink to={PROJECTS_PATH} icon={<Folder className="w-5 h-5" />}>Projects</SidebarNavLink>
            </CardContent>
          </Card>
        </aside>
      )}
      {/* Main Landing Content or Outlet */}
      <section className="flex items-start justify-start w-full pl-3">
        <div className="w-full">
          {showLanding ? (
            <div className="flex flex-col items-center justify-center min-h-[60vh] py-12 px-4">
              <span className="mb-4 text-center font-bold text-4xl">Welcome to Task Manager</span>
              <p className="text-lg text-muted-foreground mb-8 text-center max-w-xl">
                Organize your tasks, manage your projects, and boost your productivity with a modern, collaborative task management app.
              </p>
              <div className="flex gap-4">
                <Button onClick={() => navigate('/login')} size="lg">Log In</Button>
                <Button onClick={() => navigate('/signup')} size="lg" variant="outline">Sign Up</Button>
              </div>
            </div>
          ) : (
              outlet
          )}
        </div>
      </section>
    </div>
  );
}
