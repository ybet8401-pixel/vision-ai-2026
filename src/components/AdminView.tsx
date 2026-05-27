import { 
  ShieldCheck, 
  Terminal, 
  Cpu, 
  Database, 
  Activity, 
  Zap, 
  Server,
  Network
} from 'lucide-react';

interface AdminViewProps {
  language: 'en' | 'ar';
}

export default function AdminView({
  language
}: AdminViewProps) {
  const isRtl = language === 'ar';

  const systemMetrics = [
    { label: 'Cluster Ingress Ping', value: '18ms', status: 'Optimal' },
    { label: 'Ingrained LLM Fallbacks', value: '4 nodes safe', status: 'No drops' },
    { label: 'Local Memory Synapses', value: '98.4%', status: 'Sufficient' },
    { label: 'Allocated Cache Vectors', value: '12,840 vectors', status: 'Stable' }
  ];

  const nodeLogs = [
    { id: 'LOG-041', time: '20:22:50', action: 'Initialize core node handshake', status: 'SUCCESS' },
    { id: 'LOG-042', time: '20:22:52', action: 'Calibrated Stable-Diffusion pipeline', status: 'SUCCESS' },
    { id: 'LOG-043', time: '20:22:54', action: 'Ingress routing health sweep', status: 'SUCCESS' },
    { id: 'LOG-044', time: '20:22:55', action: 'Loaded Piper local biometric voices', status: 'SUCCESS' }
  ];

  return (
    <div className="space-y-8">
      
      {/* Cyber Panel heading */}
      <div className="p-6 rounded-2xl bg-neutral-900/10 border border-neutral-900 space-y-6">
        <div className="flex items-center gap-2.5 border-b border-neutral-900 pb-4">
          <Terminal className="w-5 h-5 text-emerald-400 animate-pulse" />
          <h3 className="font-bold text-white text-sm uppercase tracking-wider font-mono">
            {isRtl ? 'لوحة المراقبة المركزية الفنية' : 'System Overseer Core'}
          </h3>
        </div>

        {/* Matrix Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {systemMetrics.map((sm, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-neutral-950 border border-neutral-900 font-mono text-xs">
              <span className="block text-neutral-500 uppercase tracking-wide text-[10px] mb-1">{sm.label}</span>
              <span className="block text-sm font-bold text-white mb-2">{sm.value}</span>
              <span className="px-2 py-0.5 rounded text-[9px] bg-emerald-950/20 border border-emerald-990 text-emerald-400 font-semibold">{sm.status}</span>
            </div>
          ))}
        </div>

        {/* Active Node logs details */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between text-xs font-mono text-neutral-400">
            <span>// PIPELINE TRANSMISSION ACTIVITY LOG</span>
            <span className="text-emerald-400 font-bold uppercase tracking-widest animate-pulse">● central overseer live</span>
          </div>

          <div className="rounded-xl bg-neutral-950 p-4 border border-neutral-900 font-mono text-[11px] text-neutral-400 space-y-3 max-h-[220px] overflow-y-auto">
            {nodeLogs.map((log) => (
              <div key={log.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-1 border-b border-neutral-900 pb-2">
                <span className="text-neutral-500 font-semibold">[{log.time}] {log.id}: {log.action}</span>
                <span className="px-2 py-0.5 rounded text-[9px] bg-emerald-950/20 text-emerald-400 font-bold border border-emerald-950/50">{log.status}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
