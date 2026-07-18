import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Lock, Trash2, Play, X, Search, RefreshCw } from "lucide-react";

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
          <p className="text-white/50 text-sm">Painel de rastreamento</p>
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
                <th className="text-left p-3">Acessos</th>
                <th className="text-left p-3">Tempo</th>
                <th className="text-left p-3">Último passo</th>
                <th className="text-left p-3">Venda</th>
              </tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan={7} className="p-8 text-center text-white/50">Carregando...</td></tr>}
              {!loading && (data.sessions ?? []).length === 0 && <tr><td colSpan={7} className="p-8 text-center text-white/50">Nenhuma sessão</td></tr>}
              {(data.sessions ?? []).map((s: any) => (
                <tr key={s.id} onClick={() => setSelected(s)} className="border-t border-white/5 hover:bg-white/5 cursor-pointer">
                  <td className="p-3 font-semibold">{s.user_label}</td>
                  <td className="p-3 text-white/70">{s.funnel}</td>
                  <td className="p-3 text-white/70">{s.city ?? "-"}{s.country ? `, ${s.country}` : ""}</td>
                  <td className="p-3">{s.access_count}</td>
                  <td className="p-3">{Math.floor((s.duration_seconds ?? 0) / 60)}m {(s.duration_seconds ?? 0) % 60}s</td>
                  <td className="p-3 text-white/70 truncate max-w-[160px]">{s.last_step ?? "-"}</td>
                  <td className="p-3" onClick={(e) => e.stopPropagation()}>
                    <select value={s.sale_status} onChange={(e) => updateSale(s.id, e.target.value)} className={`bg-white/10 rounded px-2 py-1 text-xs ${s.sale_status==="sold"?"text-green-400":s.sale_status==="not_sold"?"text-red-400":"text-yellow-400"}`}>
                      <option value="pending">Pendente</option>
                      <option value="sold">Vendeu</option>
                      <option value="not_sold">Não vendeu</option>
                    </select>
                  </td>
                </tr>
              ))}
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
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    callAdmin("detail", { session_id: session.id }).then(setDetail);
  }, [session.id]);

  useEffect(() => {
    if (!playing || !detail?.recording?.length) return;
    let player: any;
    (async () => {
      const rrwebPlayer = (await import("rrweb-player" as any)).default;
      const target = document.getElementById("rrweb-target");
      if (target) target.innerHTML = "";
      player = new rrwebPlayer({ target: target!, props: { events: detail.recording, autoPlay: true } });
    })().catch(() => {
      // fallback: use rrweb basic Replayer
      import("rrweb").then((rrweb) => {
        const target = document.getElementById("rrweb-target");
        if (target) target.innerHTML = "";
        // @ts-ignore
        new rrweb.Replayer(detail.recording, { root: target });
      });
    });
    return () => { try { player?.$destroy?.(); } catch {} };
  }, [playing, detail]);

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-[#111] border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-white/10 flex justify-between items-start">
          <div>
            <h2 className="font-bold text-xl">{session.user_label}</h2>
            <p className="text-white/60 text-sm">{session.funnel} · {session.city ?? "-"} · {session.country ?? "-"}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded"><X className="w-5 h-5" /></button>
        </div>
        <div className="p-6">
          <h3 className="font-bold mb-3">Timeline</h3>
          <div className="space-y-2 mb-6">
            {(detail?.events ?? []).map((ev: any) => (
              <div key={ev.id} className="bg-white/5 rounded p-3 text-sm">
                <div className="flex justify-between text-white/50 text-xs mb-1">
                  <span>{ev.event_type}</span>
                  <span>{new Date(ev.created_at).toLocaleTimeString("pt-BR")}</span>
                </div>
                <pre className="text-xs overflow-x-auto">{JSON.stringify(ev.payload, null, 2)}</pre>
              </div>
            ))}
          </div>
          {detail?.recording?.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <h3 className="font-bold">Gravação da sessão</h3>
                <button onClick={() => setPlaying(true)} className="bg-red-600 hover:bg-red-700 rounded px-3 py-1 text-sm flex items-center gap-1">
                  <Play className="w-3 h-3" /> Reproduzir
                </button>
              </div>
              <div id="rrweb-target" className="bg-black rounded overflow-hidden min-h-[300px]" />
            </div>
          )}
        </div>
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
