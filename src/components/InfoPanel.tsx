import { TrendingUp, ExternalLink, PanelRightClose, PanelRightOpen } from "lucide-react";
import { useState } from "react";

const schemes = [
  {
    id: 1,
    title: "PM-KISAN",
    desc: "Direct income support of ₹6,000/year to farmer families in three equal instalments.",
    tag: "Agriculture",
    url: "https://pmkisan.gov.in/",
  },
  {
    id: 2,
    title: "Rythu Bharosa (Rythu Bandhu)",
    desc: "Telangana's investment support scheme providing ₹10,000/acre per year to farmers.",
    tag: "Agriculture",
    url: "https://prajapalana.telangana.gov.in/",
  },
  {
    id: 3,
    title: "Ayushman Bharat",
    desc: "Health insurance of ₹5 lakh/family/year for secondary and tertiary care hospitalisation.",
    tag: "Healthcare",
    url: "https://pmjay.gov.in/",
  },
  {
    id: 4,
    title: "PM Awas Yojana",
    desc: "Affordable housing for urban and rural poor with financial assistance up to ₹2.67 lakh.",
    tag: "Housing",
    url: "https://pmaymis.gov.in/",
  },
];

export function InfoPanel() {
  const [open, setOpen] = useState(true);

  return (
    <>
      {/* Toggle button when collapsed */}
      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="absolute top-4 right-4 p-2 rounded-lg bg-card border border-border text-muted-foreground hover:text-foreground shadow-sm transition-colors z-10"
        >
          <PanelRightOpen className="w-5 h-5" />
        </button>
      )}

      {open && (
        <aside className="w-80 shrink-0 border-l border-border bg-card flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              <h3 className="font-display font-bold text-sm text-foreground">Trending Schemes</h3>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
            >
              <PanelRightClose className="w-4 h-4" />
            </button>
          </div>

          {/* Cards */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
            {schemes.map((s) => (
              <div
                key={s.id}
                className="rounded-xl border border-border bg-background p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-display font-bold text-sm text-foreground">{s.title}</h4>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    {s.tag}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mb-3">{s.desc}</p>
                <a
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Apply Now
                </a>
              </div>
            ))}
          </div>
        </aside>
      )}
    </>
  );
}
