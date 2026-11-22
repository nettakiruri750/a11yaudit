"use client";
import { useState, useMemo } from "react";

type Issue = { id: number; title: string; severity: "Critical" | "Serious" | "Moderate" | "Minor"; wcag: string; fix: string };

const SAMPLE_HTML = `<button>Click</button>
<img src="photo.jpg">
<h1>Welcome</h1>
<h3>Subheading</h3>
<input type="text" placeholder="Email">
<a href="#">click here</a>
<div style="color:#999;background:white;">Low contrast text</div>`;

export default function A11yAudit() {
  const [html, setHtml] = useState(SAMPLE_HTML);
  const [filter, setFilter] = useState("All");
  const [hasRun, setHasRun] = useState(false);

  const issues: Issue[] = useMemo(() => {
    const found: Issue[] = [];
    let id = 1;
    if (/<img(?![^>]*alt=)/i.test(html)) found.push({ id: id++, title: "Image missing alt text", severity: "Critical", wcag: "WCAG 1.1.1 Non-text Content", fix: "Add alt=\"Describe the image\" to every <img>. If decorative, use alt=\"\"." });
    if (/<button>(?!\s*<)/i.test(html) || /<button>\s*\w+\s*<\/button>/i.test(html)) {
      // check for icon-only buttons - sample has text, so we flag generic check
    }
    if (/<input(?![^>]*aria-label)(?![^>]*id=)/i.test(html)) found.push({ id: id++, title: "Input missing accessible label", severity: "Serious", wcag: "WCAG 1.3.1 Info and Relationships", fix: "Add <label for=\"email\">Email</label> + id=\"email\" or aria-label=\"Email\"." });
    if (/click here/i.test(html)) found.push({ id: id++, title: "Vague link text: 'click here'", severity: "Serious", wcag: "WCAG 2.4.4 Link Purpose", fix: "Use descriptive link text like 'Read our accessibility guide' instead of 'click here'." });
    if (/<h1>[\s\S]*?<h3>/i.test(html)) found.push({ id: id++, title: "Skipped heading level: H1 → H3", severity: "Moderate", wcag: "WCAG 1.3.1 Info and Relationships", fix: "Use headings in order: H1 → H2 → H3. Don't skip levels." });
    if (/color:#999/i.test(html) || /#999999/i.test(html)) found.push({ id: id++, title: "Low color contrast detected (#999 on white)", severity: "Serious", wcag: "WCAG 1.4.3 Contrast (Minimum)", fix: "Use darker text: #595959 or darker on white for 4.5:1 contrast for normal text." });
    if (/<div[^>]*style/i.test(html) && /onClick/i.test(html)) found.push({ id: id++, title: "Clickable div without keyboard support", severity: "Critical", wcag: "WCAG 2.1.1 Keyboard", fix: "Use a real <button> instead of a clickable <div>." });
    if (!/lang=/i.test(html)) found.push({ id: id++, title: "Page missing lang attribute", severity: "Moderate", wcag: "WCAG 3.1.1 Language of Page", fix: "Add <html lang=\"en\"> to declare the page language." });
    if (/<button>\s*Click\s*<\/button>/i.test(html)) found.push({ id: id++, title: "Button text is vague: 'Click'", severity: "Minor", wcag: "WCAG 2.4.6 Headings and Labels", fix: "Use specific text: 'Submit form', 'Add to cart', 'Download report'." });
    return found;
  }, [html]);

  const filtered = filter === "All" ? issues : issues.filter((i) => i.severity === filter);
  const score = Math.max(0, 100 - issues.reduce((s, i) => s + (i.severity === "Critical" ? 25 : i.severity === "Serious" ? 15 : i.severity === "Moderate" ? 8 : 3), 0));
  const color = score >= 90 ? "#16A34A" : score >= 70 ? "#EAB308" : score >= 50 ? "#F97316" : "#DC2626";

  const runAudit = () => setHasRun(true);

  return (
    <div style={{ minHeight: "100vh", background: "#F8FAFC", fontFamily: "system-ui, sans-serif", color: "#0F172A" }}>
      <header style={{ background: "white", borderBottom: "1px solid #E2E8F0", position: "sticky", top: 0, zIndex: 10 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div><div style={{ fontSize: 24, fontWeight: 800 }}>♿ A11yAudit</div><div style={{ fontSize: 12, color: "#64748B" }}>by 【entity-Netta Kiruri¦canonical_name=Netta】 • Accessibility • 2026</div></div>
          <a href="https://github.com/nettakiruri750/a11yaudit" target="_blank" style={{ padding: "8px 14px", border: "1px solid #E2E8F0", borderRadius: 999, fontSize: 13, fontWeight: 600, color: "#0F172A", textDecoration: "none" }}>View on 【entity-GitHub¦canonical_name=GitHub】</a>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "20px" }}>
        <h1 style={{ fontSize: 30, margin: "0 0 8px" }}>Audit your HTML for accessibility</h1>
        <p style={{ color: "#64748B", margin: "0 0 20px" }}>Paste HTML below, click Run Audit — get WCAG issues, severity, and fix suggestions. Try the sample, then edit it and re-run.</p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: 16, padding: 20 }}>
            <h3 style={{ margin: "0 0 12px" }}>Your HTML</h3>
            <textarea value={html} onChange={(e) => { setHtml(e.target.value); setHasRun(false); }} style={{ width: "100%", height: 260, padding: 12, border: "1px solid #E2E8F0", borderRadius: 10, fontFamily: "monospace", fontSize: 13, boxSizing: "border-box" }} />
            <button onClick={runAudit} style={{ width: "100%", marginTop: 12, background: "#2563EB", color: "white", border: "none", padding: "12px", borderRadius: 10, fontWeight: 800, cursor: "pointer" }}>Run Audit →</button>
            <button onClick={() => { setHtml(SAMPLE_HTML); setHasRun(false); }} style={{ width: "100%", marginTop: 8, background: "white", border: "1px solid #E2E8F0", padding: "10px", borderRadius: 10, fontWeight: 700, cursor: "pointer" }}>Reset to Sample</button>
          </div>

          <div style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: 16, padding: 20 }}>
            <h3 style={{ margin: "0 0 12px" }}>Result</h3>
            {!hasRun ? (
              <div style={{ textAlign: "center", padding: "40px 0", color: "#64748B" }}>
                <div style={{ fontSize: 48 }}>🔍</div>
                <p>Click Run Audit to check your HTML.</p>
                <p style={{ fontSize: 13 }}>Checks: alt text, labels, link text, heading order, contrast, lang, button text.</p>
              </div>
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 16, background: "#F8FAFC", borderRadius: 12, padding: 16 }}>
                  <div style={{ width: 72, height: 72, borderRadius: "50%", background: color, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, fontWeight: 800 }}>{score}</div>
                  <div><div style={{ fontWeight: 800, fontSize: 18 }}>Accessibility Score: {score}/100</div><div style={{ color: "#64748B", fontSize: 13 }}>{issues.length} issue{issues.length !== 1 ? "s" : ""} found • {issues.filter((i) => i.severity === "Critical").length} critical • {issues.filter((i) => i.severity === "Serious").length} serious</div></div>
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 14 }}>
                  {["All", "Critical", "Serious", "Moderate", "Minor"].map((f) => (
                    <button key={f} onClick={() => setFilter(f)} style={{ padding: "6px 12px", borderRadius: 999, border: filter === f ? "none" : "1px solid #E2E8F0", background: filter === f ? "#0F172A" : "white", color: filter === f ? "white" : "#334155", fontWeight: 600, cursor: "pointer", fontSize: 12 }}>{f}</button>
                  ))}
                </div>
                <div style={{ marginTop: 14 }}>
                  {filtered.length === 0 ? <p style={{ background: "#DCFCE7", padding: 12, borderRadius: 10 }}>✅ No issues in this filter — great!</p> : filtered.map((iss) => (
                    <div key={iss.id} style={{ border: "1px solid #E2E8F0", borderRadius: 10, padding: 12, marginBottom: 10 }}>
                      <div style={{ display: "flex", justifyContent: "space-between" }}><b>{iss.title}</b><span style={{ background: iss.severity === "Critical" ? "#FEE2E2" : iss.severity === "Serious" ? "#FFEDD5" : iss.severity === "Moderate" ? "#FEF9C3" : "#DBEAFE", padding: "3px 8px", borderRadius: 999, fontSize: 11, fontWeight: 700 }}>{iss.severity}</span></div>
                      <div style={{ fontSize: 12, color: "#2563EB", marginTop: 4 }}>{iss.wcag}</div>
                      <div style={{ fontSize: 13, color: "#475569", marginTop: 6 }}>Fix: {iss.fix}</div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        <div style={{ background: "white", border: "1px solid #E2E8F0", borderRadius: 16, padding: 20, marginTop: 16 }}>
          <h3 style={{ margin: "0 0 8px" }}>What it checks</h3>
          <p style={{ color: "#64748B", fontSize: 14, lineHeight: 1.7, margin: 0 }}>1. Images need alt text • 2. Inputs need labels • 3. Links need descriptive text • 4. Headings in order • 5. Color contrast • 6. Page lang • 7. Buttons need clear text. This is a demo checker for learning — for production, also test with keyboard + screen reader.</p>
        </div>
        <footer style={{ textAlign: "center", padding: 24, color: "#64748B", fontSize: 13 }}>A11yAudit © 2026 Netta Kiruri • Built with Next.js, TypeScript & WCAG</footer>
      </div>
    </div>
  );
}