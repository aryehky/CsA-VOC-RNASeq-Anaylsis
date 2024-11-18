"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { VolcanoPlot } from "@/components/visualizations/VolcanoPlot";
import { PathwayDiagram } from "@/components/visualizations/PathwayDiagram";
import { DegRankings } from "@/components/visualizations/DegRankings";
import { LineChart, Network, BarChart, PieChart } from "lucide-react";
import { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChordDiagram } from "@/components/visualizations/ChordDiagram";

// Define the type for visualization items
type Visualization = {
  id: string;
  label: string;
  component: React.ComponentType<any>;
  icon: LucideIcon;
  description: string;
};

const visualizations: Visualization[] = [
  { 
    id: "volcano", 
    label: "Volcano Plots", 
    component: VolcanoPlot,
    icon: LineChart,
    description: "Interactive volcano plots showing differential expression",
  },
  { 
    id: "chord", 
    label: "Chord Diagram", 
    component: () => <ChordDiagram data={{
      nodes: [
        { id: "A", group: "group1", color: "#ff0000" },
        { id: "B", group: "group1", color: "#00ff00" },
        { id: "C", group: "group2", color: "#0000ff" },
      ],
      links: [
        { source: "A", target: "B", value: 5 },
        { source: "B", target: "C", value: 8 },
        { source: "C", target: "A", value: 3 },
      ]
    }} />,
    icon: PieChart,
    description: "Visualize relationships between data points using chord diagrams",
  },
  { 
    id: "pathway", 
    label: "Pathway Diagrams", 
    component: PathwayDiagram,
    icon: Network,
    description: "Pathway analysis visualization and interactions",
  },
  { 
    id: "deg", 
    label: "DEG Rankings", 
    component: DegRankings,
    icon: BarChart,
    description: "Differential expression gene ranking analysis",
  },
];

export default function VisualizationsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const activeViz = searchParams.get("view") || "volcano";

  const activeVisualization = visualizations.find(viz => viz.id === activeViz) ?? visualizations[0];
  
  if (!activeVisualization?.component) {
    return <div>Visualization not found</div>;
  }

  const ActiveComponent = activeVisualization.component;

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-[80vh]">
      <aside className="lg:w-72 xl:w-80">
        <div className="sticky top-6 space-y-6">
          <div>
            <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text mb-2">
              Visualizations
            </h2>
            <p className="text-sm text-muted-foreground">
              Select a visualization type to explore the data
            </p>
          </div>

          <nav className="space-y-2">
            {visualizations.map((viz) => {
              const isActive = activeViz === viz.id;
              return (
                <Button
                  key={viz.id}
                  onClick={() => router.push(`/visualizations?view=${viz.id}`)}
                  variant="ghost"
                  className={cn(
                    "w-full flex items-start gap-4 p-4 h-auto rounded-xl transition-all duration-200",
                    "hover:shadow-md hover:shadow-blue-500/5 hover:scale-[1.02]",
                    isActive
                      ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10 shadow-sm"
                      : "hover:bg-slate-50 dark:hover:bg-slate-900"
                  )}
                >
                  <div className={cn(
                    "p-2 rounded-lg transition-colors",
                    isActive 
                      ? "bg-blue-500 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-500"
                  )}>
                    <viz.icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className={cn(
                      "font-medium mb-1",
                      isActive && "text-blue-600 dark:text-blue-400"
                    )}>
                      {viz.label}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {viz.description}
                    </p>
                  </div>
                </Button>
              );
            })}
          </nav>
        </div>
      </aside>

      <main className="flex-1 rounded-xl bg-white dark:bg-slate-900 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 p-6">
        <div className="mb-6"> 
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 text-transparent bg-clip-text mb-2">
            {activeVisualization.label}
          </h1>
          <p className="text-muted-foreground">
            {activeVisualization.description}
          </p>
        </div>
        <div className="aspect-[4/3] w-full bg-slate-50 dark:bg-slate-800/50 rounded-lg p-4">
          <ActiveComponent />
        </div>
      </main>
    </div>
  );
}
