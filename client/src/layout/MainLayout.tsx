import { ReactNode } from "react";
import { Button } from "@/components/ui-kit/Button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui-kit/Dropdown-menu";
import { useDarkMode } from "@/hooks/useDarkMode";
import { LayoutDashboard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/providers/AuthProvider";

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { toggleDark } = useDarkMode();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black flex flex-col pt-16">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 w-full bg-primary-purple shadow-md z-50 flex justify-between items-center h-15 px-5">
        <div className="flex items-center gap-6">
          <Button
            variant='default'
            className="text-xl font-bold text-white shadow-none cursor-pointer bg-transparent hover:bg-transparent"
            onClick={() => navigate("/")}
            aria-label="Go to home"
            tabIndex={0}
          >
            <LayoutDashboard className="w-6 h-6 text-white" />
            Task manager
          </Button>
        </div>
        <div className="flex items-center gap-4">
          {/* Dark mode toggle button */}
          <Button variant="ghost" size="icon" onClick={toggleDark} aria-label="Toggle dark mode">
            <svg className="w-5 h-5 dark:hidden" fill="none" stroke="#f59e42" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 3v1m0 16v1m8.66-13.66l-.71.71M4.05 19.95l-.71.71M21 12h-1M4 12H3m16.66 5.66l-.71-.71M4.05 4.05l-.71-.71" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="12" r="5"/></svg>
            <svg className="w-5 h-5 hidden dark:inline" fill="none" stroke="#cbd5e1" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1111.21 3a7 7 0 109.79 9.79z" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Button>
          {/* Log out dropdown menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="User menu">
                <span className="sr-only">Open user menu</span>
                <svg className="w-5 h-5" fill="none" stroke="white" strokeWidth="2" viewBox="0 0 24 24"><circle cx="12" cy="7" r="4"/><path d="M5.5 21a7.5 7.5 0 0 1 13 0"/></svg>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {isAuthenticated && (
                <DropdownMenuItem onClick={logout} variant="destructive">
                  Log Out
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </nav>
      {/* Main Content */}
      <main className="flex flex-1">
        {children}
      </main>
    </div>
  );
}
