import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  onSearch?: (query: string) => void;
  showDeploy?: boolean;
  onDeploy?: () => void;
}

export default function Header({ 
  title, 
  subtitle, 
  onSearch, 
  showDeploy = false, 
  onDeploy 
}: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  return (
    <header className="bg-card border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Search */}
          {onSearch && (
            <div className="relative">
              <Input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-64 pl-10"
                data-testid="input-search"
              />
              <svg 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          )}
          
          {/* Notifications */}
          <button 
            className="relative p-2 text-muted-foreground hover:text-foreground"
            data-testid="button-notifications"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5v-5zM11 21h-6a2 2 0 01-2-2V9a2 2 0 012-2h14a2 2 0 012 2v4"/>
            </svg>
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full text-xs text-destructive-foreground flex items-center justify-center">
              3
            </span>
          </button>
          
          {/* Deploy button */}
          {showDeploy && (
            <Button 
              onClick={onDeploy}
              className="font-medium"
              data-testid="button-deploy"
            >
              Deploy Updates
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
