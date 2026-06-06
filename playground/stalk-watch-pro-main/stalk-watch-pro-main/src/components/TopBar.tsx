import { SidebarTrigger } from "@/components/ui/sidebar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Bell, Search, User } from "lucide-react";

export function TopBar({ title }: { title: string }) {
  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-3 border-b border-border bg-background/80 px-3 backdrop-blur">
      <SidebarTrigger className="h-9 w-9 rounded-md border border-border bg-card shadow-sm hover:bg-accent hover:text-accent-foreground" />
      <div className="flex items-center gap-2">
        <h1 className="text-sm font-semibold text-foreground">{title}</h1>
      </div>
      <div className="ml-auto flex items-center gap-2">
        <div className="relative hidden md:block">
          <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search blocks, farms, locations…" className="h-9 w-72 pl-8" />
        </div>
        <Button variant="ghost" size="icon"><Bell className="h-4 w-4" /></Button>
        <Button variant="ghost" size="icon"><User className="h-4 w-4" /></Button>
      </div>
    </header>
  );
}
