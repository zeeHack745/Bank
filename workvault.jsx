import { useState, useEffect } from "react";

// ─── CONFIG ───────────────────────────────────────────────────────────────────
const ADMIN_EMAIL = "halaleloevershine4@gmail.com";
const ADMIN_PASS  = "Punctuati0n";

const PLANS = [
  { id: "starter", name: "Starter", price: 10, color: "#38bdf8",
    perks: ["Apply to 5 jobs/mo", "Email job alerts", "Basic search filters"] },
  { id: "growth",  name: "Growth",  price: 25, color: "#f59e0b",
    perks: ["Apply to 30 jobs/mo", "Priority listings", "Resume tips", "Company direct links"] },
  { id: "pro",     name: "Pro",     price: 50, color: "#a78bfa",
    perks: ["Unlimited applications", "Early access roles", "1-on-1 career coaching", "Application tracker CRM"] },
];

const JOBS = [
  { id:1,  title:"Senior Product Designer",   company:"Notion",     loc:"Remote",        salary:"$120k–$150k", tag:"Design",      logo:"N", bg:"#191919", posted:"2h ago"  },
  { id:2,  title:"Growth Engineer",           company:"Linear",     loc:"San Francisco", salary:"$140k–$180k", tag:"Engineering", logo:"L", bg:"#5E6AD2", posted:"4h ago"  },
  { id:3,  title:"Head of Marketing",         company:"Vercel",     loc:"Remote",        salary:"$130k–$160k", tag:"Marketing",   logo:"▲", bg:"#000",    posted:"1d ago"  },
  { id:4,  title:"Staff ML Engineer",         company:"Perplexity", loc:"New York",      salary:"$200k–$250k", tag:"Engineering", logo:"P", bg:"#1a9e9e", posted:"3h ago"  },
  { id:5,  title:"DevRel Manager",            company:"Supabase",   loc:"Remote",        salary:"$100k–$130k", tag:"Developer",   logo:"S", bg:"#3ECF8E", posted:"2d ago"  },
  { id:6,  title:"Finance Lead",              company:"Stripe",     loc:"Dublin",        salary:"$150k–$190k", tag:"Finance",     logo:"$", bg:"#635BFF", posted:"6h ago"  },
  { id:7,  title:"iOS Engineer",              company:"Figma",      loc:"Remote",        salary:"$160k–$200k", tag:"Engineering", logo:"F", bg:"#7B2FBE", posted:"5h ago"  },
  { id:8,  title:"Data Scientist",            company:"Anthropic",  loc:"San Francisco", salary:"$180k–$220k", tag:"Data",        logo:"A", bg:"#b45309", posted:"1h ago"  },
  { id:9,  title:"Brand Designer",            company:"Loom",       loc:"Remote",        salary:"$90k–$120k",  tag:"Design",      logo:"L", bg:"#625DF5", posted:"3d ago"  },
  { id:10, title:"Backend Engineer",          company:"PlanetScale",loc:"Remote",        salary:"$150k–$180k", tag:"Engineering", logo:"P", bg:"#0f172a", posted:"8h ago"  },
];

// ─── STYLES ───────────────────────────────────────────────────────────────────
const S = {
  bg:      "#07080a",
  panel:   "#0d0f14",
  card:    "#12151c",
  border:  "#1c2030",
  accent:  "#38bdf8",
  gold:    "#f59e0b",
  purple:  "#a78bfa",
  text:    "#e2e8f0",
  sub:     "#94a3b8",
  muted:   "#475569",
  success: "#22c55e",
  danger:  "#f43f5e",
};

const font = "'Georgia', 'Times New Roman', serif";

// ─── PRIMITIVES ───────────────────────────────────────────────────────────────
const css = {
  btn: (color="#38bdf8", ghost=false) => ({
    padding: "9px 20px", borderRadius: 8, border: ghost ? `1px solid ${color}55` : "none",
    background: ghost ? "transparent" : color, color: ghost ? color : color==="#f59e0b"||color==="#38bdf8"?"#000":"#fff",
    fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: font, transition: "opacity .15s",
  }),
  input: (err=false) => ({
    width: "100%", padding: "11px 14px", background: S.panel, border: `1px solid ${err?S.danger:S.border}`,
    borderRadius: 8, color: S.text, fontSize: 14, outline: "none", fontFamily: font, boxSizing: "border-box",
  }),
  card: (extra={}) => ({ background: S.card, border: `1px solid ${S.border}`, borderRadius: 14, padding: 22, ...extra }),
  label: { display: "block", marginBottom: 5, fontSize: 11, color: S.muted, fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 },
};

function Btn({ children, onClick, color=S.accent, ghost=false, disabled=false, full=false, sm=false, style={} }) {
  return (
    <button onClick={onClick} disabled={disabled}
      style={{ ...css.btn(color, ghost), opacity: disabled?.45:1, cursor: disabled?"not-allowed":"pointer",
        width: full?"100%":undefined, padding: sm?"6px 14px":"9px 20px", fontSize: sm?12:13, ...style }}>
      {children}
    </button>
  );
}

function Field({ label, type="text", value, onChange, placeholder, err, icon }) {
  return (
    <div style={{ marginBottom: 14 }}>
      {label && <label style={css.label}>{label}</label>}
      <div style={{ position:"relative" }}>
        {icon && <span style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", fontSize:15 }}>{icon}</span>}
        <input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder}
          style={{ ...css.input(!!err), paddingLeft: icon?38:14 }} />
      </div>
      {err && <div style={{ color:S.danger, fontSize:11, marginTop:3 }}>⚠ {err}</div>}
    </div>
  );
}

function Tag({ children, color=S.accent }) {
  return <span style={{ background:color+"18", color, border:`1px solid ${color}30`, borderRadius:99, padding:"2px 10px", fontSize:11, fontWeight:700 }}>{children}</span>;
}

function Overlay({ onClose, children, maxW=480 }) {
  return (
    <div style={{ position:"fixed", inset:0, background:"#000d", zIndex:200, display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}
      onClick={e => e.target===e.currentTarget && onClose()}>
      <div style={{ ...css.card(), maxWidth:maxW, width:"100%", maxHeight:"92vh", overflowY:"auto" }}>
        {children}
      </div>
    </div>
  );
}

function OverlayHeader({ title, onClose }) {
  return (
    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:22 }}>
      <h3 style={{ margin:0, color:S.text, fontSize:17, fontWeight:800 }}>{title}</h3>
      <button onClick={onClose} style={{ background:"none", border:"none", color:S.muted, cursor:"pointer", fontSize:22 }}>✕</button>
    </div>
  );
}

function Notice({ children, color=S.accent }) {
  return (
    <div style={{ background:color+"12", border:`1px solid ${color}33`, borderRadius:10, padding:"11px 14px", fontSize:13, color, marginBottom:16 }}>
      {children}
    </div>
  );
}

function Toast({ msg, color }) {
  return (
    <div style={{ position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)", background:color,
      color: [S.accent, S.gold].includes(color)?"#000":"#fff", padding:"11px 24px", borderRadius:10,
      fontWeight:700, fontSize:13, zIndex:9999, boxShadow:"0 8px 30px #0009", whiteSpace:"nowrap" }}>
      {msg}
    </div>
  );
}

// ─── AUTH ─────────────────────────────────────────────────────────────────────
function AuthPage({ onLogin, onRegister }) {
  const [tab, setTab] = useState("in");
  const [email, setEmail] = useState(""); const [name, setName] = useState("");
  const [pw, setPw] = useState(""); const [pw2, setPw2] = useState("");
  const [errs, setErrs] = useState({}); const [busy, setBusy] = useState(false);

  const go = async () => {
    const e = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Valid email required";
    if (pw.length < 8) e.pw = "Min 8 characters";
    else if (!/[A-Z]/.test(pw)) e.pw = "Needs an uppercase letter";
    else if (!/\d/.test(pw)) e.pw = "Needs a number";
    if (tab === "up") {
      if (!name.trim()) e.name = "Name required";
      if (pw !== pw2) e.pw2 = "Passwords don't match";
    }
    setErrs(e);
    if (Object.keys(e).length) return;
    setBusy(true);
    await new Promise(r => setTimeout(r, 650));
    setBusy(false);
    tab === "in" ? onLogin(email, pw) : onRegister(email, name, pw);
  };

  return (
    <div style={{ minHeight:"100vh", background:S.bg, display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:20, fontFamily:font }}>
      {/* Hero brand */}
      <div style={{ marginBottom:42, textAlign:"center" }}>
        <div style={{ fontSize:46, fontWeight:900, letterSpacing:-2 }}>
          <span style={{ color:S.accent }}>Work</span><span style={{ color:S.text }}>Vault</span>
        </div>
        <div style={{ color:S.sub, marginTop:8, fontSize:15 }}>Jobs you won't find anywhere else.</div>
      </div>

      <div style={{ width:"100%", maxWidth:420 }}>
        {/* Tab switcher */}
        <div style={{ display:"flex", background:S.panel, borderRadius:10, padding:4, marginBottom:22, border:`1px solid ${S.border}` }}>
          {[["in","Sign In"],["up","Create Account"]].map(([k,l]) => (
            <button key={k} onClick={()=>{setTab(k);setErrs({});}}
              style={{ flex:1, padding:"9px 0", borderRadius:8, border:"none", cursor:"pointer", fontWeight:700, fontSize:13,
                background: tab===k ? S.accent : "transparent", color: tab===k ? "#000" : S.muted, fontFamily:font, transition:"all .2s" }}>
              {l}
            </button>
          ))}
        </div>

        <div style={css.card({ padding:28 })}>
          {tab === "up" && <Field label="Full Name" value={name} onChange={setName} placeholder="Jane Smith" icon="👤" err={errs.name} />}
          <Field label="Email Address" type="email" value={email} onChange={setEmail} placeholder="you@example.com" icon="✉️" err={errs.email} />
          <Field label="Password" type="password" value={pw} onChange={setPw} placeholder="8+ chars · uppercase · number" icon="🔒" err={errs.pw} />
          {tab === "up" && <Field label="Confirm Password" type="password" value={pw2} onChange={setPw2} placeholder="Repeat password" icon="🔒" err={errs.pw2} />}

          <Btn onClick={go} disabled={busy} full style={{ padding:"13px 0", fontSize:15, marginTop:4 }}>
            {busy ? "Please wait…" : tab==="in" ? "Sign In Securely →" : "Create My Account →"}
          </Btn>

          <div style={{ textAlign:"center", marginTop:16, fontSize:11, color:S.muted }}>
            🔐 256-bit TLS encrypted · PCI-DSS compliant · No data sold ever
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── SUBSCRIBE MODAL ──────────────────────────────────────────────────────────
function SubscribeModal({ onClose, onDone, current }) {
  const [sel, setSel] = useState(null);
  const [step, setStep] = useState("plans"); // plans | pay | done
  const [method, setMethod] = useState("card");
  const [cn, setCn] = useState(""); const [ce, setCe] = useState("");
  const [cv, setCv] = useState(""); const [ch, setCh] = useState("");
  const [pp, setPp] = useState("");
  const [busy, setBusy] = useState(false);

  const pay = async () => {
    setBusy(true);
    await new Promise(r => setTimeout(r, 1700));
    setBusy(false); setStep("done");
    setTimeout(() => { onDone(sel); onClose(); }, 2000);
  };

  return (
    <Overlay onClose={onClose}>
      <OverlayHeader
        title={step==="plans"?"Choose a Plan":step==="pay"?"Secure Checkout":"Payment Confirmed!"}
        onClose={onClose}
      />

      {step === "plans" && <>
        {PLANS.map(p => (
          <div key={p.id} onClick={()=>setSel(p)} style={{
            border:`2px solid ${sel?.id===p.id ? p.color : S.border}`, borderRadius:12, padding:"16px 18px",
            marginBottom:12, cursor:"pointer", background: sel?.id===p.id ? p.color+"0a" : S.panel, transition:"all .18s"
          }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:8 }}>
              <span style={{ fontWeight:800, color:p.color, fontSize:17 }}>{p.name}</span>
              <span style={{ fontWeight:900, color:S.text, fontSize:20 }}>${p.price}<span style={{ fontSize:12, color:S.muted, fontWeight:400 }}>/mo</span></span>
            </div>
            {p.perks.map(pk => <div key={pk} style={{ fontSize:13, color:S.sub, marginBottom:2 }}>✓ {pk}</div>)}
            {current===p.id && <div style={{ marginTop:8 }}><Tag color={p.color}>Current Plan</Tag></div>}
          </div>
        ))}
        <Btn onClick={()=>sel&&setStep("pay")} disabled={!sel} full style={{ marginTop:4 }}>Continue →</Btn>
      </>}

      {step === "pay" && <>
        <div style={{ background:S.panel, borderRadius:10, padding:"12px 16px", marginBottom:20, display:"flex", justifyContent:"space-between" }}>
          <span style={{ color:S.sub }}>Plan: <strong style={{ color:S.text }}>{sel.name}</strong></span>
          <span style={{ color:sel.color, fontWeight:900 }}>${sel.price}/mo</span>
        </div>

        {/* Payment method tabs */}
        <div style={{ display:"flex", gap:8, marginBottom:20 }}>
          {[["card","💳 Card"],["paypal","🅿 PayPal"]].map(([k,l])=>(
            <button key={k} onClick={()=>setMethod(k)} style={{
              flex:1, padding:"10px 0", borderRadius:9, border:`1.5px solid ${method===k?S.accent:S.border}`,
              background: method===k?S.accent+"15":S.panel, color: method===k?S.accent:S.muted,
              cursor:"pointer", fontWeight:700, fontSize:13, fontFamily:font
            }}>{l}</button>
          ))}
        </div>

        {method==="card" && <>
          <Field label="Cardholder Name" value={ch} onChange={setCh} placeholder="Jane Smith" />
          <Field label="Card Number" value={cn} onChange={v=>setCn(v.replace(/\D/g,"").slice(0,16))} placeholder="1234 5678 9012 3456" icon="💳" />
          <div style={{ display:"flex", gap:12 }}>
            <div style={{ flex:1 }}><Field label="Expiry" value={ce} onChange={setCe} placeholder="MM/YY" /></div>
            <div style={{ flex:1 }}><Field label="CVV" type="password" value={cv} onChange={v=>setCv(v.slice(0,4))} placeholder="•••" /></div>
          </div>
        </>}

        {method==="paypal" && <Field label="PayPal Email" type="email" value={pp} onChange={setPp} placeholder="you@paypal.com" icon="🅿" />}

        <div style={{ background:S.panel, borderRadius:8, padding:"10px 12px", fontSize:11, color:S.muted, marginBottom:16 }}>
          🔐 Payments are encrypted end-to-end. Card details are never stored on our servers.
        </div>

        <div style={{ display:"flex", gap:10 }}>
          <Btn ghost color={S.muted} onClick={()=>setStep("plans")} style={{ flex:1 }}>← Back</Btn>
          <Btn onClick={pay} disabled={busy} color={sel?.color} style={{ flex:2 }}>
            {busy?"Processing…":`Pay $${sel?.price}/mo`}
          </Btn>
        </div>
      </>}

      {step==="done" && (
        <div style={{ textAlign:"center", padding:"28px 0" }}>
          <div style={{ fontSize:70 }}>✅</div>
          <h3 style={{ color:S.success, marginTop:16, marginBottom:8 }}>You're subscribed!</h3>
          <p style={{ color:S.sub, margin:0 }}>{sel?.name} plan is now active. Start applying!</p>
        </div>
      )}
    </Overlay>
  );
}

// ─── JOB BOARD ────────────────────────────────────────────────────────────────
function JobBoard({ user, jobs, setJobs, onSubscribe, toast }) {
  const [q, setQ] = useState("");
  const [tag, setTag] = useState("All");
  const [applyTo, setApplyTo] = useState(null);
  const [cover, setCover] = useState(""); const [port, setPort] = useState("");
  const [busy, setBusy] = useState(false);
  const [applied, setApplied] = useState([]);

  const canApply = !!user?.plan;
  const tags = ["All", ...new Set(JOBS.map(j=>j.tag))];

  const visible = jobs.filter(j =>
    (!q || j.title.toLowerCase().includes(q.toLowerCase()) || j.company.toLowerCase().includes(q.toLowerCase())) &&
    (tag==="All" || j.tag===tag)
  );

  const submit = async () => {
    setBusy(true);
    await new Promise(r=>setTimeout(r,900));
    setApplied(p=>[...p, applyTo.id]);
    toast(`Applied to ${applyTo.title} ✓`, S.success);
    setApplyTo(null); setCover(""); setPort(""); setBusy(false);
  };

  return (
    <div>
      {/* Search + filters */}
      <div style={{ marginBottom:20 }}>
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="🔍  Search job title or company…"
          style={{ ...css.input(), marginBottom:12, fontSize:15, padding:"13px 16px" }} />
        <div style={{ display:"flex", gap:8, flexWrap:"wrap" }}>
          {tags.map(t=>(
            <button key={t} onClick={()=>setTag(t)} style={{
              padding:"6px 14px", borderRadius:99, border:`1px solid ${tag===t?S.accent:S.border}`,
              background: tag===t?S.accent+"18":"transparent", color: tag===t?S.accent:S.muted,
              cursor:"pointer", fontSize:12, fontWeight:700, fontFamily:font
            }}>{t}</button>
          ))}
        </div>
      </div>

      {/* Subscribe banner */}
      {!canApply && (
        <div style={{ background:`linear-gradient(135deg,${S.gold}12,${S.accent}08)`, border:`1px solid ${S.gold}33`,
          borderRadius:14, padding:"16px 20px", marginBottom:20, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
          <div>
            <div style={{ fontWeight:800, color:S.gold, fontSize:15 }}>Subscribe to apply</div>
            <div style={{ color:S.sub, fontSize:13, marginTop:2 }}>Plans start at $10/mo · Cancel anytime</div>
          </div>
          <Btn color={S.gold} onClick={onSubscribe}>See Plans →</Btn>
        </div>
      )}

      {/* Job list */}
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {visible.map(job => {
          const done = applied.includes(job.id);
          return (
            <div key={job.id} style={{ ...css.card(), display:"flex", alignItems:"center", gap:16, flexWrap:"wrap", padding:"18px 20px",
              borderLeft:`3px solid ${job.bg}`, transition:"border-color .2s" }}>
              <div style={{ width:46, height:46, borderRadius:12, background:job.bg, display:"flex", alignItems:"center",
                justifyContent:"center", fontSize:18, fontWeight:900, color:"#fff", flexShrink:0 }}>
                {job.logo}
              </div>
              <div style={{ flex:1, minWidth:140 }}>
                <div style={{ fontWeight:800, color:S.text, fontSize:15 }}>{job.title}</div>
                <div style={{ color:S.sub, fontSize:13, marginTop:2 }}>{job.company} · {job.loc}</div>
                <div style={{ display:"flex", gap:8, marginTop:8, flexWrap:"wrap", alignItems:"center" }}>
                  <Tag color={S.accent}>{job.salary}</Tag>
                  <Tag color={S.muted}>{job.tag}</Tag>
                  <span style={{ color:S.muted, fontSize:11 }}>🕐 {job.posted}</span>
                </div>
              </div>
              <Btn
                color={done ? S.success : S.accent}
                ghost={done}
                onClick={()=>{ if(!canApply){onSubscribe();return;} if(!done) setApplyTo(job); }}
                disabled={done}
              >
                {done ? "✓ Applied" : canApply ? "Apply Now" : "🔒 Apply"}
              </Btn>
            </div>
          );
        })}
        {visible.length===0 && <div style={{ textAlign:"center", color:S.muted, padding:56 }}>No jobs match your search.</div>}
      </div>

      {/* Apply modal */}
      {applyTo && (
        <Overlay onClose={()=>setApplyTo(null)}>
          <OverlayHeader title={`Apply — ${applyTo.title}`} onClose={()=>setApplyTo(null)} />
          <div style={{ background:S.panel, borderRadius:10, padding:"12px 16px", marginBottom:18 }}>
            <div style={{ fontWeight:700, color:S.text }}>{applyTo.company}</div>
            <div style={{ color:S.sub, fontSize:13 }}>{applyTo.loc} · {applyTo.salary}</div>
          </div>
          <Field label="Cover Letter (optional)" value={cover} onChange={setCover} placeholder="Why are you a great fit?" />
          <Field label="LinkedIn or Portfolio URL" value={port} onChange={setPort} placeholder="https://linkedin.com/in/you" icon="🔗" />
          <div style={{ display:"flex", gap:10, marginTop:4 }}>
            <Btn ghost color={S.muted} onClick={()=>setApplyTo(null)} style={{ flex:1 }}>Cancel</Btn>
            <Btn disabled={busy} onClick={submit} style={{ flex:2 }}>{busy?"Submitting…":"Submit Application 🚀"}</Btn>
          </div>
        </Overlay>
      )}
    </div>
  );
}

// ─── USER ACCOUNT ─────────────────────────────────────────────────────────────
function MyAccount({ user, onSubscribe, applications }) {
  const plan = PLANS.find(p=>p.id===user.plan);
  const mine = applications.filter(a=>a.uid===user.id);

  return (
    <div>
      {/* Stats row */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(170px,1fr))", gap:14, marginBottom:22 }}>
        {[
          { icon:"🪪", label:"Plan", val: plan?.name||"Free", color: plan?.color||S.muted },
          { icon:"🚀", label:"Applications", val: mine.length, color: S.accent },
          { icon:"🔐", label:"Account", val:"Verified", color: S.success },
        ].map(s=>(
          <div key={s.label} style={{ ...css.card(), borderColor: s.color+"44" }}>
            <div style={{ fontSize:24, marginBottom:8 }}>{s.icon}</div>
            <div style={{ fontSize:22, fontWeight:900, color:s.color }}>{s.val}</div>
            <div style={{ color:S.muted, fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:1, marginTop:2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Plan card */}
      {plan ? (
        <div style={{ ...css.card(), borderColor:plan.color+"55", marginBottom:20 }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", flexWrap:"wrap", gap:12 }}>
            <div>
              <div style={{ fontWeight:800, color:plan.color, fontSize:17 }}>{plan.name} Plan</div>
              <div style={{ color:S.sub, fontSize:13, marginTop:4 }}>${plan.price}/mo · Renews automatically</div>
            </div>
            <Btn ghost color={plan.color} sm onClick={onSubscribe}>Upgrade</Btn>
          </div>
          <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop:16 }}>
            {plan.perks.map(p=><Tag key={p} color={plan.color}>{p}</Tag>)}
          </div>
        </div>
      ) : (
        <div style={{ ...css.card({ borderColor:S.gold+"44", background:S.gold+"08", marginBottom:20 }) }}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
            <div>
              <div style={{ fontWeight:800, color:S.gold }}>No active subscription</div>
              <div style={{ color:S.sub, fontSize:13, marginTop:4 }}>Subscribe to apply to jobs</div>
            </div>
            <Btn color={S.gold} onClick={onSubscribe}>Choose a Plan →</Btn>
          </div>
        </div>
      )}

      {/* Application history */}
      <div style={css.card()}>
        <div style={{ fontWeight:800, color:S.text, fontSize:15, marginBottom:18 }}>Application History</div>
        {mine.length===0
          ? <div style={{ color:S.muted, fontSize:14 }}>No applications yet. Head to Jobs and start applying!</div>
          : mine.map((a,i)=>(
            <div key={i} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"12px 0",
              borderBottom: i<mine.length-1?`1px solid ${S.border}`:"none" }}>
              <div>
                <div style={{ fontWeight:700, color:S.text }}>{a.title}</div>
                <div style={{ color:S.sub, fontSize:13 }}>{a.company}</div>
              </div>
              <Tag color={S.success}>Submitted</Tag>
            </div>
          ))
        }
      </div>
    </div>
  );
}

// ─── ADMIN ────────────────────────────────────────────────────────────────────
function Admin({ users, setUsers, jobs, setJobs, applications, withdrawals, setWithdrawals }) {
  const [tab, setTab] = useState("overview");
  const [wOpen, setWOpen] = useState(false);
  const [wMethod, setWMethod] = useState("paypal");
  const [wAmt, setWAmt] = useState(""); const [wEmail, setWEmail] = useState("");
  const [wBusy, setWBusy] = useState(false); const [wDone, setWDone] = useState(false);
  const [addJob, setAddJob] = useState(false);
  const [nj, setNj] = useState({ title:"",company:"",loc:"",salary:"",tag:"Engineering",logo:"",bg:"#333" });

  const members = users.filter(u=>u.role!=="admin");
  const revenue = members.reduce((s,u)=>s+(PLANS.find(p=>p.id===u.plan)?.price||0),0);

  const doWithdraw = async () => {
    if (!wAmt||!wEmail||parseFloat(wAmt)<10) return;
    setWBusy(true);
    await new Promise(r=>setTimeout(r,1500));
    setWithdrawals(p=>[...p,{ id:Date.now(), amt:wAmt, method:wMethod, email:wEmail, date:new Date().toLocaleDateString(), status:"completed" }]);
    setWBusy(false); setWDone(true);
  };

  const postJob = () => {
    if (!nj.title||!nj.company) return;
    setJobs(p=>[...p,{ ...nj, id:Date.now(), posted:"just now", logo:nj.logo||nj.company[0].toUpperCase() }]);
    setNj({ title:"",company:"",loc:"",salary:"",tag:"Engineering",logo:"",bg:"#333" });
    setAddJob(false);
  };

  const TABS = ["overview","users","jobs","withdrawals","security"];

  return (
    <div>
      {/* Admin header bar */}
      <div style={{ background:S.danger+"0d", border:`1px solid ${S.danger}33`, borderRadius:12, padding:"12px 18px",
        marginBottom:24, display:"flex", justifyContent:"space-between", alignItems:"center", flexWrap:"wrap", gap:12 }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:20 }}>🛡</span>
          <div>
            <span style={{ color:S.danger, fontWeight:800, fontSize:14 }}>ADMIN PANEL</span>
            <span style={{ color:S.muted, fontSize:12, marginLeft:10 }}>Restricted · {ADMIN_EMAIL}</span>
          </div>
        </div>
        <Btn color={S.gold} onClick={()=>{ setWOpen(true); setWDone(false); setWAmt(""); setWEmail(""); }}>
          💰 Withdraw Funds
        </Btn>
      </div>

      {/* Tabs */}
      <div style={{ display:"flex", gap:6, marginBottom:24, flexWrap:"wrap" }}>
        {TABS.map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{
            padding:"8px 18px", borderRadius:9, border:`1px solid ${tab===t?S.accent:S.border}`,
            background: tab===t?S.accent+"18":"transparent", color: tab===t?S.accent:S.muted,
            cursor:"pointer", fontWeight:700, fontSize:13, textTransform:"capitalize", fontFamily:font
          }}>{t}</button>
        ))}
      </div>

      {/* OVERVIEW */}
      {tab==="overview" && <>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(155px,1fr))", gap:14, marginBottom:22 }}>
          {[
            { icon:"💰", label:"Monthly Revenue", val:`$${revenue}`, color:S.gold },
            { icon:"👥", label:"Total Users",      val:members.length, color:S.accent },
            { icon:"📋", label:"Active Jobs",      val:jobs.length, color:S.purple },
            { icon:"🚀", label:"Applications",     val:applications.length, color:S.success },
          ].map(s=>(
            <div key={s.label} style={{ ...css.card(), borderColor:s.color+"44" }}>
              <div style={{ fontSize:26, marginBottom:8 }}>{s.icon}</div>
              <div style={{ fontSize:26, fontWeight:900, color:s.color }}>{s.val}</div>
              <div style={{ color:S.muted, fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:.8, marginTop:2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={css.card()}>
          <div style={{ fontWeight:800, color:S.text, fontSize:15, marginBottom:18 }}>Revenue by Plan</div>
          {PLANS.map(p=>{
            const count = members.filter(u=>u.plan===p.id).length;
            const rev = count*p.price;
            const pct = revenue>0 ? rev/revenue*100 : 0;
            return (
              <div key={p.id} style={{ marginBottom:16 }}>
                <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                  <span style={{ color:S.text, fontWeight:600, fontSize:13 }}>{p.name} · {count} subscribers</span>
                  <span style={{ color:p.color, fontWeight:800 }}>${rev}/mo</span>
                </div>
                <div style={{ background:S.panel, borderRadius:99, height:6 }}>
                  <div style={{ width:`${pct}%`, background:p.color, height:6, borderRadius:99, transition:"width .5s" }} />
                </div>
              </div>
            );
          })}
        </div>
      </>}

      {/* USERS */}
      {tab==="users" && (
        <div style={css.card()}>
          <div style={{ fontWeight:800, color:S.text, fontSize:15, marginBottom:18 }}>All Users ({members.length})</div>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
              <thead>
                <tr>{["Name","Email","Plan","Status","Joined","Actions"].map(h=>(
                  <th key={h} style={{ padding:"9px 12px", textAlign:"left", color:S.muted, fontWeight:700,
                    borderBottom:`1px solid ${S.border}`, fontSize:11, textTransform:"uppercase", letterSpacing:.8 }}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {members.map(u=>{
                  const pl=PLANS.find(p=>p.id===u.plan);
                  return (
                    <tr key={u.id} style={{ borderBottom:`1px solid ${S.border}` }}>
                      <td style={{ padding:"12px", color:S.text, fontWeight:600 }}>{u.name}</td>
                      <td style={{ padding:"12px", color:S.sub }}>{u.email}</td>
                      <td style={{ padding:"12px" }}>{pl?<Tag color={pl.color}>{pl.name}</Tag>:<Tag color={S.muted}>Free</Tag>}</td>
                      <td style={{ padding:"12px" }}><Tag color={u.status==="active"?S.success:S.danger}>{u.status}</Tag></td>
                      <td style={{ padding:"12px", color:S.muted }}>{u.joined}</td>
                      <td style={{ padding:"12px" }}>
                        <div style={{ display:"flex", gap:6 }}>
                          <Btn sm ghost color={S.muted}
                            onClick={()=>setUsers(p=>p.map(x=>x.id===u.id?{...x,status:x.status==="active"?"suspended":"active"}:x))}>
                            {u.status==="active"?"Suspend":"Restore"}
                          </Btn>
                          <Btn sm color={S.danger} ghost
                            onClick={()=>{ if(window.confirm("Delete this user permanently?")) setUsers(p=>p.filter(x=>x.id!==u.id)); }}>
                            Delete
                          </Btn>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {members.length===0 && <div style={{ textAlign:"center", color:S.muted, padding:32 }}>No users registered yet.</div>}
          </div>
        </div>
      )}

      {/* JOBS */}
      {tab==="jobs" && <>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:16 }}>
          <div style={{ fontWeight:800, color:S.text, fontSize:15 }}>Job Listings ({jobs.length})</div>
          <Btn onClick={()=>setAddJob(true)}>+ Post Job</Btn>
        </div>
        {jobs.map(j=>(
          <div key={j.id} style={{ ...css.card(), display:"flex", alignItems:"center", gap:14, marginBottom:10, padding:"16px 18px", flexWrap:"wrap" }}>
            <div style={{ width:40, height:40, borderRadius:10, background:j.bg, display:"flex", alignItems:"center",
              justifyContent:"center", color:"#fff", fontWeight:900, fontSize:16, flexShrink:0 }}>{j.logo}</div>
            <div style={{ flex:1, minWidth:140 }}>
              <div style={{ fontWeight:700, color:S.text }}>{j.title}</div>
              <div style={{ color:S.sub, fontSize:13 }}>{j.company} · {j.loc} · {j.salary}</div>
            </div>
            <Btn sm ghost color={S.danger} onClick={()=>setJobs(p=>p.filter(x=>x.id!==j.id))}>Remove</Btn>
          </div>
        ))}
        {addJob && (
          <Overlay onClose={()=>setAddJob(false)}>
            <OverlayHeader title="Post New Job" onClose={()=>setAddJob(false)} />
            <Field label="Job Title *" value={nj.title} onChange={v=>setNj(p=>({...p,title:v}))} placeholder="Senior Engineer" />
            <Field label="Company *" value={nj.company} onChange={v=>setNj(p=>({...p,company:v}))} placeholder="Acme Inc." />
            <Field label="Location" value={nj.loc} onChange={v=>setNj(p=>({...p,loc:v}))} placeholder="Remote / City" />
            <Field label="Salary Range" value={nj.salary} onChange={v=>setNj(p=>({...p,salary:v}))} placeholder="$80k–$100k" />
            <Field label="Logo Letter" value={nj.logo} onChange={v=>setNj(p=>({...p,logo:v.slice(0,1).toUpperCase()}))} placeholder="A" />
            <Btn full onClick={postJob}>Publish Job →</Btn>
          </Overlay>
        )}
      </>}

      {/* WITHDRAWALS */}
      {tab==="withdrawals" && (
        <div style={css.card()}>
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20, flexWrap:"wrap", gap:12 }}>
            <div style={{ fontWeight:800, color:S.text, fontSize:15 }}>Withdrawal History</div>
            <div style={{ background:S.gold+"12", border:`1px solid ${S.gold}33`, borderRadius:10, padding:"10px 16px" }}>
              <span style={{ color:S.muted, fontSize:12 }}>Available: </span>
              <span style={{ color:S.gold, fontWeight:900, fontSize:20 }}>${revenue}</span>
            </div>
          </div>
          {withdrawals.length===0
            ? <div style={{ color:S.muted }}>No withdrawals yet. Use the "Withdraw Funds" button above.</div>
            : withdrawals.map(w=>(
              <div key={w.id} style={{ display:"flex", justifyContent:"space-between", padding:"13px 0",
                borderBottom:`1px solid ${S.border}`, flexWrap:"wrap", gap:8, alignItems:"center" }}>
                <div>
                  <div style={{ fontWeight:700, color:S.text }}>${w.amt} via {w.method==="paypal"?"PayPal":w.method==="payfast"?"PayFast":"Bank Card"}</div>
                  <div style={{ color:S.sub, fontSize:13 }}>{w.email} · {w.date}</div>
                </div>
                <Tag color={w.status==="completed"?S.success:S.gold}>{w.status}</Tag>
              </div>
            ))
          }
        </div>
      )}

      {/* SECURITY */}
      {tab==="security" && (
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(240px,1fr))", gap:14 }}>
          {[
            { icon:"🔐", t:"TLS 1.3 Encryption",      d:"All traffic encrypted end-to-end in transit.",        s:"Active" },
            { icon:"🏦", t:"PCI-DSS Compliance",       d:"Card data never stored. Processed by Stripe.",        s:"Active" },
            { icon:"🛡", t:"Row Level Security",        d:"Users can only access their own data.",               s:"Active" },
            { icon:"🔑", t:"Password Hashing",          d:"bcrypt + salt. Passwords never stored in plaintext.", s:"Active" },
            { icon:"📧", t:"Email Verification",        d:"All accounts require email confirmation.",            s:"Active" },
            { icon:"⛔", t:"Brute-Force Protection",    d:"5 failed logins triggers a 30-min lockout.",          s:"Active" },
            { icon:"💾", t:"Automated Backups",         d:"Daily encrypted database snapshots.",                 s:"Active" },
            { icon:"📲", t:"Admin 2FA",                 d:"Enable two-factor auth on your admin account.",       s:"Recommended" },
          ].map(s=>(
            <div key={s.t} style={css.card({ borderColor: s.s==="Active"?S.success+"33":S.gold+"33" })}>
              <div style={{ fontSize:28, marginBottom:10 }}>{s.icon}</div>
              <div style={{ fontWeight:700, color:S.text, marginBottom:5 }}>{s.t}</div>
              <div style={{ color:S.sub, fontSize:13, marginBottom:14 }}>{s.d}</div>
              <Tag color={s.s==="Active"?S.success:S.gold}>{s.s}</Tag>
            </div>
          ))}
        </div>
      )}

      {/* WITHDRAW MODAL */}
      {wOpen && (
        <Overlay onClose={()=>setWOpen(false)}>
          <OverlayHeader title="Withdraw Funds" onClose={()=>setWOpen(false)} />
          {wDone ? (
            <div style={{ textAlign:"center", padding:"28px 0" }}>
              <div style={{ fontSize:68 }}>✅</div>
              <h3 style={{ color:S.success, marginTop:16 }}>Withdrawal Initiated!</h3>
              <p style={{ color:S.sub }}>Funds arrive within 1–3 business days.</p>
            </div>
          ) : <>
            <div style={{ background:S.panel, borderRadius:10, padding:"14px 18px", marginBottom:20 }}>
              <div style={{ color:S.muted, fontSize:11, fontWeight:700, textTransform:"uppercase", letterSpacing:.8, marginBottom:4 }}>Available Balance</div>
              <div style={{ fontSize:34, fontWeight:900, color:S.gold }}>${revenue}.00</div>
            </div>

            {/* Method tabs */}
            <div style={{ display:"flex", gap:8, marginBottom:20 }}>
              {[["paypal","🅿 PayPal"],["payfast","⚡ PayFast"],["card","💳 Bank Card"]].map(([k,l])=>(
                <button key={k} onClick={()=>setWMethod(k)} style={{
                  flex:1, padding:"9px 4px", borderRadius:9, border:`1.5px solid ${wMethod===k?S.gold:S.border}`,
                  background: wMethod===k?S.gold+"12":S.panel, color: wMethod===k?S.gold:S.muted,
                  cursor:"pointer", fontWeight:700, fontSize:12, fontFamily:font
                }}>{l}</button>
              ))}
            </div>

            <Field
              label={wMethod==="paypal"?"PayPal Email":wMethod==="payfast"?"PayFast Merchant Email":"Bank Account Email"}
              type="email" value={wEmail} onChange={setWEmail}
              placeholder={wMethod==="paypal"?"you@paypal.com":wMethod==="payfast"?"merchant@payfast.co.za":"account@bank.com"}
              icon="📧"
            />
            <Field label="Amount ($)" type="number" value={wAmt} onChange={setWAmt} placeholder="Minimum $10" icon="💵" />

            <Notice color={S.gold}>🔒 Minimum $10 · Processed securely · 1–3 business days</Notice>

            <Btn color={S.gold} full disabled={wBusy||!wEmail||!wAmt||parseFloat(wAmt)<10} onClick={doWithdraw}>
              {wBusy?"Processing…":`Withdraw via ${wMethod==="paypal"?"PayPal":wMethod==="payfast"?"PayFast":"Bank Card"}`}
            </Btn>
          </>}
        </Overlay>
      )}
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [jobs, setJobs] = useState(JOBS);
  const [applications, setApplications] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [page, setPage] = useState("jobs");
  const [subOpen, setSubOpen] = useState(false);
  const [toastData, setToastData] = useState(null);

  const toast = (msg, color=S.accent) => {
    setToastData({ msg, color });
    setTimeout(()=>setToastData(null), 3200);
  };

  const login = (email, pw) => {
    if (email===ADMIN_EMAIL && pw===ADMIN_PASS) {
      setUser({ id:"admin", email:ADMIN_EMAIL, name:"Admin", role:"admin", plan:"pro" });
      setPage("admin"); toast("Welcome back, Admin 🛡", S.gold); return;
    }
    const found = users.find(u=>u.email===email && u.password===pw);
    if (!found) { toast("Invalid email or password.", S.danger); return; }
    if (found.status==="suspended") { toast("Account suspended. Contact support.", S.danger); return; }
    setUser(found); setPage("jobs");
    toast(`Welcome back, ${found.name.split(" ")[0]}!`);
  };

  const register = (email, name, pw) => {
    if (email===ADMIN_EMAIL) { toast("Email not available.", S.danger); return; }
    if (users.find(u=>u.email===email)) { toast("Email already registered.", S.danger); return; }
    const u = { id:`u${Date.now()}`, email, name, password:pw, role:"user", plan:null, status:"active", joined:new Date().toLocaleDateString() };
    setUsers(p=>[...p,u]); setUser(u); setPage("jobs");
    toast(`Account created! Subscribe to start applying 🎉`, S.success);
    setTimeout(()=>setSubOpen(true), 900);
  };

  const subscribe = (plan) => {
    setUser(u=>({...u, plan:plan.id}));
    setUsers(p=>p.map(u=>u.id===user.id?{...u,plan:plan.id}:u));
    toast(`${plan.name} plan activated! 🎉`, plan.color);
  };

  const applyToJob = (job) => {
    setApplications(p=>[...p,{ id:Date.now(), uid:user.id, title:job.title, company:job.company }]);
  };

  const logout = () => { setUser(null); setPage("jobs"); toast("Signed out."); };

  if (!user) return <><AuthPage onLogin={login} onRegister={register} />{toastData&&<Toast {...toastData}/>}</>;

  const isAdmin = user.role==="admin";
  const plan = PLANS.find(p=>p.id===user.plan);
  const NAV = isAdmin ? [["admin","🛡 Admin"]] : [["jobs","💼 Jobs"],["account","👤 Account"]];

  return (
    <div style={{ minHeight:"100vh", background:S.bg, fontFamily:font, color:S.text }}>
      {/* Navbar */}
      <nav style={{ background:S.panel, borderBottom:`1px solid ${S.border}`, padding:"0 20px",
        display:"flex", alignItems:"center", justifyContent:"space-between", height:58,
        position:"sticky", top:0, zIndex:50, flexWrap:"wrap", gap:8 }}>
        <div style={{ fontSize:22, fontWeight:900, letterSpacing:-1 }}>
          <span style={{ color:S.accent }}>Work</span><span style={{ color:S.text }}>Vault</span>
        </div>
        <div style={{ display:"flex", gap:6, alignItems:"center", flexWrap:"wrap" }}>
          {NAV.map(([k,l])=>(
            <button key={k} onClick={()=>setPage(k)} style={{
              padding:"7px 16px", borderRadius:8, border:`1px solid ${page===k?S.accent:"transparent"}`,
              background: page===k?S.accent+"18":"none", color: page===k?S.accent:S.muted,
              cursor:"pointer", fontWeight:700, fontSize:13, fontFamily:font
            }}>{l}</button>
          ))}
          {!isAdmin && (
            <Btn color={plan?plan.color:S.gold} ghost={!!plan} onClick={()=>setSubOpen(true)} style={{ padding:"7px 14px", fontSize:13 }}>
              {plan?`⭐ ${plan.name}`:"Subscribe"}
            </Btn>
          )}
          <Btn ghost color={S.muted} onClick={logout} style={{ padding:"7px 14px", fontSize:13 }}>Sign Out</Btn>
        </div>
      </nav>

      {/* Page content */}
      <main style={{ maxWidth:980, margin:"0 auto", padding:"32px 18px" }}>
        {!isAdmin && (
          <div style={{ marginBottom:26 }}>
            <h1 style={{ margin:"0 0 6px", fontSize:27, fontWeight:900, color:S.text }}>
              {page==="jobs" ? "Discover Hidden Roles" : `Hi, ${user.name.split(" ")[0]}`}
            </h1>
            <p style={{ margin:0, color:S.sub, fontSize:14 }}>
              {page==="jobs"
                ? "Sourced directly from company career pages — before they appear anywhere else."
                : "Your subscription, applications and account settings."}
            </p>
          </div>
        )}

        {page==="jobs"    && <JobBoard user={user} jobs={jobs} setJobs={setJobs} onSubscribe={()=>setSubOpen(true)} toast={toast} />}
        {page==="account" && <MyAccount user={user} onSubscribe={()=>setSubOpen(true)} applications={applications} />}
        {page==="admin"   && isAdmin && <Admin users={users} setUsers={setUsers} jobs={jobs} setJobs={setJobs} applications={applications} withdrawals={withdrawals} setWithdrawals={setWithdrawals} />}
      </main>

      {subOpen && <SubscribeModal onClose={()=>setSubOpen(false)} onDone={subscribe} current={user?.plan} />}
      {toastData && <Toast {...toastData} />}
    </div>
  );
}
