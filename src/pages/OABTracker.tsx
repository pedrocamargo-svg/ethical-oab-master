import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CheckCircle2, Circle, Flame, Lock, RefreshCw, Search, Trash2, X } from "lucide-react";



const TOKEN_KEY = "oab_admin_token";
const FP_KEY = "oab_admin_fp";

function getFingerprint() {
  let fp = localStorage.getItem(FP_KEY);
  if (!fp) {
    fp = crypto.randomUUID();
    localStorage.setItem(FP_KEY, fp);
  }
  return fp;
}

async function callAdmin(action: string, body: any = {}) {
  const token = sessionStorage.getItem(TOKEN_KEY);
  const { data, error } = await supabase.functions.invoke("oabtracker-admin", {
    body: { action, ...body },
    headers: token ? { "x-oab-token": token } : {},
  });
  if (error) throw error;
  return data;
}

const FUNNELS = [
  { key: "all", label: "Todos" },
  { key: "quiz1", label: "Quiz WhatsApp" },
  { key: "quiz2", label: "Quiz Longo" },
  { key: "product:50-questoes-etica", label: "50 Questões" },
  { key: "product:mapas-mentais-etica", label: "Mapas Mentais" },
  { key: "product:36-tpps-etica", label: "36 TPPs" },
  { key: "product:mapa-aprovacao", label: "Mapa da Aprovação" },
];

type FunnelStep = {
  step?: number;
  event?: string;
  label: string;
};

const FUNNEL_STEPS: Record<string, FunnelStep[]> = {
  quiz1: [
    { step: 0, label: "Começou o quiz" },
    { step: 1, label: "Situação na OAB" },
    { step: 2, label: "Reprovações / primeira vez" },
    { step: 3, label: "Maior dificuldade" },
    { step: 4, label: "Motivação" },
    { step: 5, label: "Plano sendo criado" },
    { step: 6, label: "Conheceu João Pedro" },
    { step: 7, label: "Orçamento" },
    { step: 8, label: "Recebeu recomendação" },
    { event: "quiz_recommend", label: "Clicou na recomendação" },
    { event: "initiate_checkout", label: "Foi para o checkout" },
  ],
  quiz2: [
    { step: 0, label: "Começou pelo depoimento" },
    { step: 1, label: "Situação atual" },
    { step: 2, label: "Reprovações" },
    { step: 3, label: "O que falta" },
    { step: 4, label: "Apresentação / nome" },
    { step: 5, label: "Pronto para estudar" },
    { step: 6, label: "Concordou com direcionamento" },
    { step: 7, label: "Aceitou aplicar" },
    { step: 8, label: "Viu depoimentos" },
    { step: 9, label: "Objetivo" },
    { step: 10, label: "Visão de 30 dias" },
    { step: 11, label: "Perfil analisado" },
    { step: 12, label: "Sistema EDO" },
    { step: 13, label: "Orçamento" },
    { step: 14, label: "Compromisso" },
    { step: 15, label: "Perfil ideal" },
    { step: 16, label: "Plano pronto" },
    { event: "quiz_recommend", label: "Clicou na recomendação" },
    { event: "initiate_checkout", label: "Foi para o checkout" },
  ],
};

const PRODUCT_STEPS: FunnelStep[] = [
  { event: "initiate_checkout", label: "Clicou no checkout" },
];

function getFunnelLabel(key: string) {
  return FUNNELS.find((f) => f.key === key)?.label ?? key;
}

function getStepsForFunnel(funnel: string) {
  if (FUNNEL_STEPS[funnel]) return FUNNEL_STEPS[funnel];
  if (funnel?.startsWith("product:")) return PRODUCT_STEPS;
  return [];
}

function getReachedMap(events: any[] = []) {
  const reachedSteps = new Set<number>();
  const reachedEvents = new Set<string>();
  let highestStep = -1;
  for (const ev of events) {
    if (ev?.event_type) reachedEvents.add(ev.event_type);
    const step = Number(ev?.payload?.step);
    if (Number.isFinite(step)) {
      reachedSteps.add(step);
      highestStep = Math.max(highestStep, step);
    }
  }
  // If an early event was lost before the session finished registering, show the path reached up to the latest known step.
  for (let i = 0; i <= highestStep; i += 1) {
    reachedSteps.add(i);
  }
  return { reachedSteps, reachedEvents };
}

function getLastReadableStep(session: any) {
  const raw = String(session?.last_step ?? "");
  const steps = getStepsForFunnel(session?.funnel);
  const stepMatch = raw.match(/step\s+(\d+)/i);
  if (stepMatch) {
    const found = steps.find((s) => s.step === Number(stepMatch[1]));
    if (found) return found.label;
  }
  const eventMatch = steps.find((s) => s.event === raw);
  if (eventMatch) return eventMatch.label;
  if (raw === "quiz_recommend") return "Clicou na recomendação";
  if (raw === "initiate_checkout") return "Foi para o checkout";
  return raw || "-";
}

const Login = ({ onOk }: { onOk: () => void }) => {
  const [num, setNum] = useState("");
  const [alpha, setAlpha] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async () => {
    setErr(""); setLoading(true);
    try {
      const res = await callAdmin("login", { device_fp: getFingerprint(), pw_numeric: num, pw_alpha: alpha });
      if (res?.token) {
        sessionStorage.setItem(TOKEN_KEY, res.token);
        onOk();
      }
    } catch (e: any) {
      const msg = e?.message ?? String(e);
      if (msg.includes("locked")) setErr("Dispositivo bloqueado por 24h.");
      else setErr("Senha inválida.");
    } finally { setLoading(false); }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white/5 border border-white/10 rounded-2xl p-8">
        <div className="flex justify-center mb-6"><Lock className="w-10 h-10 text-red-500" /></div>
        <h1 className="font-heading font-bold text-2xl text-center mb-6">OAB Tracker</h1>
        <div className="space-y-3 mb-4">
          <input type="password" inputMode="numeric" placeholder="Senha numérica" value={num} onChange={(e) => setNum(e.target.value)} className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 outline-none focus:border-red-500" />
          <input type="password" placeholder="Senha alfanumérica" value={alpha} onChange={(e) => setAlpha(e.target.value)} className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 outline-none focus:border-red-500" />
        </div>
        {err && <p className="text-red-400 text-sm mb-3">{err}</p>}
        <button onClick={submit} disabled={loading} className="w-full bg-red-600 hover:bg-red-700 py-3 rounded-lg font-bold disabled:opacity-50">
          {loading ? "Verificando..." : "Entrar"}
        </button>
      </div>
    </main>
  );
};

const Dashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [funnel, setFunnel] = useState("all");
  const [range, setRange] = useState<"today"|"7d"|"month"|"30d"|"all">("30d");
  const [search, setSearch] = useState("");
  const [data, setData] = useState<any>({ sessions: [], metrics: {} });
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<any>(null);
  const [showDelete, setShowDelete] = useState(false);

  const load = async () => {
    setLoading(true);
    const now = new Date();
    let from: string | undefined;
    if (range === "today") from = new Date(now.setHours(0,0,0,0)).toISOString();
    else if (range === "7d") from = new Date(Date.now() - 7*86400000).toISOString();
    else if (range === "30d") from = new Date(Date.now() - 30*86400000).toISOString();
    else if (range === "month") from = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    try {
      const res = await callAdmin("list", { funnel, from, search });
      setData(res);
    } catch (e: any) {
      if (String(e?.message).includes("unauth")) onLogout();
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [funnel, range]);

  const updateSale = async (id: string, status: string) => {
    await callAdmin("update_sale", { session_id: id, sale_status: status });
    load();
  };

  const m = data.metrics ?? {};

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8">
      <header className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-heading font-bold text-2xl">OAB Tracker</h1>
          <p className="text-white/50 text-sm">Painel de rastreamento · {getFunnelLabel(funnel)}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="p-2 bg-white/10 rounded-lg hover:bg-white/20"><RefreshCw className="w-4 h-4" /></button>
          <button onClick={() => setShowDelete(true)} className="p-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/40"><Trash2 className="w-4 h-4" /></button>
          <select value={funnel} onChange={(e) => setFunnel(e.target.value)} className="bg-white/10 rounded-lg px-3 py-2 text-sm border border-white/10">
            {FUNNELS.map((f) => <option key={f.key} value={f.key}>{f.label}</option>)}
          </select>
        </div>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <Metric label="Acessos" value={m.total ?? 0} />
        <Metric label="Vendas" value={m.sold ?? 0} />
        <Metric label="Conversão" value={`${((m.conversion_rate ?? 0) * 100).toFixed(1)}%`} />
        <Metric label="Conclusão Quiz" value={`${((m.quiz_completion_rate ?? 0) * 100).toFixed(1)}%`} />
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {(["today","7d","month","30d","all"] as const).map((r) => (
          <button key={r} onClick={() => setRange(r)} className={`px-3 py-1.5 rounded-lg text-sm ${range===r?"bg-red-600":"bg-white/10 hover:bg-white/20"}`}>
            {r === "today" ? "Hoje" : r === "7d" ? "7 dias" : r === "month" ? "Este mês" : r === "30d" ? "30 dias" : "Tudo"}
          </button>
        ))}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={(e) => e.key==="Enter" && load()} placeholder="Buscar user, cidade..." className="w-full bg-white/10 rounded-lg pl-9 pr-3 py-2 text-sm outline-none border border-white/10" />
        </div>
      </div>

      <div className="bg-white/5 rounded-xl overflow-hidden border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-white/5 text-white/60">
              <tr>
                <th className="text-left p-3">User</th>
                <th className="text-left p-3">Funil</th>
                <th className="text-left p-3">Cidade</th>
                <th className="text-left p-3">utm_source</th>
                <th className="text-left p-3">utm_medium</th>
                <th className="text-left p-3">utm_campaign</th>
                <th className="text-left p-3">utm_content</th>
                <th className="text-left p-3">utm_term</th>
                <th className="text-left p-3">Acessos</th>
                <th className="text-left p-3">Tempo</th>
                <th className="text-left p-3">Último passo</th>
                <th className="text-left p-3">Venda</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={12} className="p-8 text-center text-white/50">Carregando...</td></tr>}
              {!loading && (data.sessions ?? []).length === 0 && <tr><td colSpan={12} className="p-8 text-center text-white/50">Nenhuma sessão</td></tr>}
              {(data.sessions ?? []).map((s: any) => {
                const utms = s.utm_params ?? {};
                const cell = (v: any) => <td className="p-3 text-white/70 truncate max-w-[140px]" title={v || ""}>{v || "-"}</td>;
                return (
                <tr key={s.id} onClick={() => setSelected(s)} className="border-t border-white/5 hover:bg-white/5 cursor-pointer">
                  <td className="p-3 font-semibold">{s.user_label}</td>
                  <td className="p-3 text-white/70">{getFunnelLabel(s.funnel)}</td>
                  <td className="p-3 text-white/70">{s.city ?? "-"}{s.country ? `, ${s.country}` : ""}</td>
                  {cell(utms.utm_source)}
                  {cell(utms.utm_medium)}
                  {cell(utms.utm_campaign)}
                  {cell(utms.utm_content)}
                  {cell(utms.utm_term)}
                  <td className="p-3">{s.access_count}</td>
                  <td className="p-3">{Math.floor((s.duration_seconds ?? 0) / 60)}m {(s.duration_seconds ?? 0) % 60}s</td>
                  <td className="p-3 text-white/70 truncate max-w-[180px]">{getLastReadableStep(s)}</td>
                  <td className="p-3" onClick={(e) => e.stopPropagation()}>
                    <select value={s.sale_status} onChange={(e) => updateSale(s.id, e.target.value)} className={`bg-white/10 rounded px-2 py-1 text-xs ${s.sale_status==="sold"?"text-green-400":s.sale_status==="not_sold"?"text-red-400":"text-yellow-400"}`}>
                      <option value="pending">Pendente</option>
                      <option value="sold">Vendeu</option>
                      <option value="not_sold">Não vendeu</option>
                    </select>
                  </td>
                </tr>
              );})}
            </tbody>
          </table>
        </div>
      </div>


      {selected && <SessionModal session={selected} onClose={() => setSelected(null)} />}
      {showDelete && <DeleteModal onClose={() => setShowDelete(false)} onDone={() => { setShowDelete(false); load(); }} />}
    </main>
  );
};

const Metric = ({ label, value }: { label: string; value: any }) => (
  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
    <div className="text-xs uppercase text-white/50 mb-1">{label}</div>
    <div className="text-2xl font-bold">{value}</div>
  </div>
);

const SessionModal = ({ session, onClose }: { session: any; onClose: () => void }) => {
  const [detail, setDetail] = useState<any>(null);

  useEffect(() => {
    setDetail(null);
    callAdmin("detail", { session_id: session.id }).then(setDetail).catch(() => setDetail({ events: [] }));
  }, [session.id]);

  const events = detail?.events ?? [];

  const formatPayload = (p: any) => {
    if (!p || typeof p !== "object") return String(p ?? "");
    const parts: string[] = [];
    for (const [k, v] of Object.entries(p)) {
      if (v === null || v === undefined || v === "") continue;
      const val = typeof v === "object" ? JSON.stringify(v) : String(v);
      parts.push(`${k}: ${val.length > 80 ? val.slice(0, 80) + "…" : val}`);
    }
    return parts.join(" · ");
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-white/10 flex justify-between items-start">
          <div>
            <h2 className="font-bold text-xl">{session.user_label}</h2>
            <p className="text-white/60 text-sm">{getFunnelLabel(session.funnel)} · {session.city ?? "-"} · {session.country ?? "-"}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6">
          {!detail && <p className="text-white/50 text-sm mb-4">Carregando detalhes...</p>}

          <FunnelProgress session={session} events={events} />

          <h3 className="font-bold mb-3">Timeline</h3>
          <div className="space-y-2">
            {events.length === 0 && <p className="text-white/40 text-sm">Nenhum evento registrado.</p>}
            {events.map((ev: any) => (
              <div key={ev.id} className="bg-white/5 rounded-lg p-3 text-sm flex items-start gap-3">
                <div className="text-white/40 text-xs whitespace-nowrap pt-0.5">{new Date(ev.created_at).toLocaleTimeString("pt-BR")}</div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-red-400">{describeEvent(ev, session.funnel)}</div>
                  {ev.payload && <div className="text-white/70 text-xs mt-0.5 break-words">{formatPayload(ev.payload)}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

function describeEvent(ev: any, funnel: string) {
  if (ev?.event_type === "quiz_step") {
    const step = Number(ev?.payload?.step);
    const found = getStepsForFunnel(funnel).find((s) => s.step === step);
    return found ? found.label : `Etapa ${Number.isFinite(step) ? step + 1 : "do quiz"}`;
  }
  if (ev?.event_type === "quiz_recommend") return "Clicou na recomendação";
  if (ev?.event_type === "initiate_checkout") return "Foi para o checkout";
  return ev?.event_type ?? "Evento";
}

const FunnelProgress = ({ session, events }: { session: any; events: any[] }) => {
  const steps = getStepsForFunnel(session.funnel);
  if (steps.length === 0) return null;
  const { reachedSteps, reachedEvents } = getReachedMap(events);
  const completed = steps.filter((s) => (s.step !== undefined && reachedSteps.has(s.step)) || (s.event && reachedEvents.has(s.event))).length;

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between gap-3 mb-3">
        <h3 className="font-bold">Etapas do funil</h3>
        <span className="text-white/50 text-xs">{completed}/{steps.length} concluídas</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {steps.map((s, i) => {
          const done = (s.step !== undefined && reachedSteps.has(s.step)) || Boolean(s.event && reachedEvents.has(s.event));
          const isCheckout = s.event === "initiate_checkout";
          return (
            <div key={`${s.step ?? s.event}-${i}`} className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm ${done ? "bg-green-500/15 border-green-500/40 text-green-100" : "bg-white/5 border-white/10 text-white/45"}`}>
              {done ? <CheckCircle2 className="w-4 h-4 text-green-400 flex-shrink-0" /> : <Circle className="w-4 h-4 flex-shrink-0" />}
              <span className="truncate">{s.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const DeleteModal = ({ onClose, onDone }: { onClose: () => void; onDone: () => void }) => {
  const [range, setRange] = useState<"7d"|"30d"|"all">("30d");
  const [confirm, setConfirm] = useState(false);

  const del = async () => {
    let from: string | undefined;
    if (range === "7d") from = new Date(Date.now() - 7*86400000).toISOString();
    else if (range === "30d") from = new Date(Date.now() - 30*86400000).toISOString();
    await callAdmin("delete_range", { from });
    onDone();
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#111] border border-red-500/30 rounded-2xl w-full max-w-md p-6" onClick={(e) => e.stopPropagation()}>
        <h2 className="font-bold text-xl mb-3 text-red-400">Deletar sessões</h2>
        {!confirm ? (
          <>
            <p className="text-white/70 mb-4 text-sm">Selecione o período:</p>
            <div className="flex gap-2 mb-4">
              {(["7d","30d","all"] as const).map((r) => (
                <button key={r} onClick={() => setRange(r)} className={`flex-1 py-2 rounded ${range===r?"bg-red-600":"bg-white/10"}`}>
                  {r === "7d" ? "7 dias" : r === "30d" ? "30 dias" : "Tudo"}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={onClose} className="flex-1 bg-white/10 py-2 rounded">Cancelar</button>
              <button onClick={() => setConfirm(true)} className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded font-bold">Continuar</button>
            </div>
          </>
        ) : (
          <>
            <p className="text-red-400 mb-4 font-bold uppercase text-sm">Esta ação é IRREVERSÍVEL</p>
            <p className="text-white/70 mb-4 text-sm">Tem certeza que deseja deletar todas as sessões deste período?</p>
            <div className="flex gap-2">
              <button onClick={onClose} className="flex-1 bg-white/10 py-2 rounded">Cancelar</button>
              <button onClick={del} className="flex-1 bg-red-600 hover:bg-red-700 py-2 rounded font-bold">SIM, DELETAR</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const OABTracker = () => {
  const [auth, setAuth] = useState(!!sessionStorage.getItem(TOKEN_KEY));
  const logout = () => { sessionStorage.removeItem(TOKEN_KEY); setAuth(false); };
  return auth ? <Dashboard onLogout={logout} /> : <Login onOk={() => setAuth(true)} />;
};

export default OABTracker;
