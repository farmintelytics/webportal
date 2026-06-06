import { useState } from "react";
import { Card } from "@monitoring-shared/ui/card";
import { Slider } from "@monitoring-shared/ui/slider";

const dates = [
  "2023-10", "2023-11", "2023-12", "2024-01", "2024-02", "2024-03",
  "2024-04", "2024-05", "2024-06", "2024-07",
];
const seasons: Record<number, string> = {
  0: "Planting", 3: "Growing", 6: "Tuber Bulking", 9: "Harvest",
};

export function TimeSlider() {
  const [idx, setIdx] = useState(dates.length - 1);
  return (
    <Card className="px-4 py-3 shadow-card bg-white">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted-foreground">Acquisition Date</span>
        <span className="font-mono text-sm font-semibold">{dates[idx]}</span>
        {seasons[idx] && (
          <span className="text-xs px-2 py-0.5 rounded-full bg-accent text-accent-foreground font-medium">
            {seasons[idx]} Season
          </span>
        )}
      </div>
      <Slider value={[idx]} max={dates.length - 1} step={1} onValueChange={v => setIdx(v[0])} />
      <div className="flex justify-between text-[10px] text-muted-foreground mt-1 font-mono">
        <span>{dates[0]}</span>
        <span>{dates[dates.length - 1]}</span>
      </div>
    </Card>
  );
}
