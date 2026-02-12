import { AlertTriangle, ArrowLeft } from "lucide-react";

interface GrievanceFormProps {
  onBack: () => void;
}

export function GrievanceForm({ onBack }: GrievanceFormProps) {
  return (
    <div className="flex flex-col flex-1 min-w-0">
      <header className="flex items-center gap-3 px-6 py-4 border-b border-border bg-card">
        <button onClick={onBack} className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <AlertTriangle className="w-5 h-5 text-gov-gold" />
        <h2 className="font-display font-bold text-foreground">Grievance Redressal</h2>
      </header>

      <div className="flex-1 flex items-start justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-lg space-y-6">
          <p className="text-sm text-muted-foreground">
            Submit your complaint or grievance. We'll ensure it reaches the concerned department.
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Subject</label>
              <input
                type="text"
                placeholder="Brief subject of your complaint"
                className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Description</label>
              <textarea
                rows={6}
                placeholder="Describe your grievance in detail..."
                className="w-full px-4 py-2.5 rounded-lg border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground outline-none focus:ring-2 focus:ring-ring transition resize-none"
              />
            </div>
          </div>

          <button className="w-full py-3 rounded-lg bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors">
            Submit Grievance
          </button>
        </div>
      </div>
    </div>
  );
}
