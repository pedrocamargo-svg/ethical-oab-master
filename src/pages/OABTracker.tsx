import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Lock, RefreshCw, Trash2 } from "lucide-react";

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

type FunnelStats = {
  key: string;
  label: string;
  acessos: number;
  fb_acessos: number;
  viewed_first: number;
  advanced: number;
  clicked_checkout: number;
  ctr: number;
};

const Dashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [range, setRange] = useState<"today" | "7d" | "month" | "30d" | "all">("30d");
  const [funnels, setFunnels] = useState<FunnelStats[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const load = async () => {
    setLoading(true);
    const now = new Date();
    let from: string | undefined;
    if (range === "today") from = new Date(now.setHours(0, 0, 0, 0)).toISOString();
    else if (range === "7d") from = new Date(Date.now() - 7 * 86400000).toISOString();
    else if (range === "30d") from = new Date(Date.now() - 30 * 86400000).toISOString();
    else if (range === "month") from = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    try {
      const res = await callAdmin("stats", { from });
      setFunnels(res?.funnels ?? []);
    } catch (e: any) {
      if (String(e?.message).includes("unauth")) onLogout();
    } finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [range]);

  const handleDelete = async () => {
    if (!confirm("Tem certeza que quer apagar TODOS os dados? Essa ação não pode ser desfeita.")) return;
    setDeleting(true);
    try {
      await callAdmin("delete_range", {});
      await load();
    } catch (e) {
      alert("Erro ao apagar dados.");
    } finally { setDeleting(false); }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white p-4 md:p-8">
      <header className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-heading font-bold text-2xl">OAB Tracker</h1>
          <p className="text-white/50 text-sm">Painel de rastreamento por funil</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="p-2 bg-white/10 rounded-lg hover:bg-white/20" title="Recarregar"><RefreshCw className="w-4 h-4" /></button>
          <button onClick={handleDelete} disabled={deleting} className="p-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/40 disabled:opacity-50" title="Apagar tudo"><Trash2 className="w-4 h-4" /></button>
        </div>
      </header>

      <div className="flex flex-wrap gap-2 mb-6">
        {(["today", "7d", "month", "30d", "all"] as const).map((r) => (
          <button key={r} onClick={() => setRange(r)} className={`px-3 py-1.5 rounded-lg text-sm ${range === r ? "bg-red-600" : "bg-white/10 hover:bg-white/20"}`}>
            {r === "today" ? "Hoje" : r === "7d" ? "7 dias" : r === "month" ? "Este mês" : r === "30d" ? "30 dias" : "Tudo"}
          </button>
        ))}
      </div>

      {loading && <p className="text-white/50 text-center py-12">Carregando...</p>}

      {!loading && (
        <div className="grid gap-4 md:grid-cols-2">
          {funnels.map((f) => (
            <FunnelBox key={f.key} f={f} />
          ))}
        </div>
      )}
    </main>
  );
};

const FunnelBox = ({ f }: { f: FunnelStats }) => {
  const rows: { label: string; value: string | number }[] = [
    { label: "Acessos", value: f.acessos },
    { label: "Acessos via Facebook Ads", value: f.fb_acessos },
    { label: "Viram a primeira etapa", value: f.viewed_first },
    { label: "Avançaram após primeira etapa", value: f.advanced },
    { label: "Clicaram para o checkout", value: f.clicked_checkout },
    { label: "CTR (checkout / viram)", value: `${(f.ctr * 100).toFixed(1)}%` },
  ];
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h2 className="font-heading font-bold text-xl mb-4 text-red-400">{f.label}</h2>
      <div className="space-y-2">
        {rows.map((r) => (
          <div key={r.label} className="flex justify-between items-center border-b border-white/5 pb-2 last:border-0">
            <span className="text-white/70 text-sm">{r.label}</span>
            <span className="font-bold text-lg">{r.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

const OABTracker = () => {
  const [authed, setAuthed] = useState(!!sessionStorage.getItem(TOKEN_KEY));
  if (!authed) return <Login onOk={() => setAuthed(true)} />;
  return <Dashboard onLogout={() => { sessionStorage.removeItem(TOKEN_KEY); setAuthed(false); }} />;
};

export default OABTracker;
