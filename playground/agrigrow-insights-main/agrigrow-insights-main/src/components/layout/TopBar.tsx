import { Bell, Search, PanelRight } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Props {
  title: string;
  onTogglePanel?: () => void;
}

export function TopBar({ title, onTogglePanel }: Props) {
  return (
    <header className="h-16 shrink-0 bg-card border-b border-border flex items-center px-6 gap-4 z-10">
      <h1 className="text-lg font-semibold text-foreground shrink-0">{title}</h1>
      <div className="flex-1 max-w-md relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <Input
          placeholder="Search farms, plots, batches..."
          className="pl-9 h-9 bg-muted/50 border-transparent focus-visible:bg-card"
        />
      </div>
      <div className="flex items-center gap-2 ml-auto">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-5" />
          <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-destructive" />
        </Button>
        {onTogglePanel && (
          <Button variant="ghost" size="icon" onClick={onTogglePanel}>
            <PanelRight className="size-5" />
          </Button>
        )}
        <Avatar className="size-9">
          <AvatarFallback className="bg-primary text-primary-foreground text-xs">AO</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
