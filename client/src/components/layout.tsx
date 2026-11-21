import Sidebar from "./sidebar";
import { cn } from "@/lib/utils";

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export default function Layout({ children, className }: LayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar />
      <div className={cn("flex-1 flex flex-col overflow-hidden", className)}>
        {children}
      </div>
    </div>
  );
}
