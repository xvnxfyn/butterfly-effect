import { Milestone, TrendingUp, TrendingDown, Minus, Calendar, Edit3, PlusCircle, Trash2, ZoomIn, ZoomOut, Maximize, ArrowUpRight, Plus, Link as LinkIcon } from 'lucide-react';
import { CausalityNode, Connection } from '../types';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { useMemo, useState } from 'react';

interface NodeDetailPanelProps {
  node: CausalityNode | null;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  allNodes?: CausalityNode[];
  connections?: Connection[];
  onAddConnection?: (source: string, target: string, type: 'strong' | 'weak' | 'divergent') => void;
  onDeleteConnection?: (source: string, target: string) => void;
}

export function NodeDetailPanel({ 
  node, 
  onClose, 
  onEdit, 
  onDelete,
  allNodes = [],
  connections = [],
  onAddConnection,
  onDeleteConnection
}: NodeDetailPanelProps) {
  const [showConnectionUI, setShowConnectionUI] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState<string>('');
  const [connectionType, setConnectionType] = useState<'strong' | 'weak' | 'divergent'>('strong');
  const [showImpactChain, setShowImpactChain] = useState(false);

  if (!node) return null;

  const getStatusColor = () => {
    if (node.type === 'catalyst') return 'text-primary border-primary/20 bg-primary/10';
    if (node.type === 'positive') return 'text-secondary border-secondary/20 bg-secondary/10';
    if (node.type === 'negative') return 'text-error border-error/20 bg-error/10';
    return 'text-tertiary border-tertiary/20 bg-tertiary/10';
  };

  const getStatusIcon = () => {
    if (node.type === 'catalyst') return <Milestone className="w-3 h-3" />;
    if (node.type === 'positive') return <TrendingUp className="w-3 h-3" />;
    if (node.type === 'negative') return <TrendingDown className="w-3 h-3" />;
    return <Minus className="w-3 h-3" />;
  };

  // Get incoming and outgoing connections
  const outgoing = connections.filter(c => c.source === node.id);
  const incoming = connections.filter(c => c.target === node.id);

  // Get connectable nodes (exclude current node)
  const connectableNodes = allNodes.filter(n => n.id !== node.id);

  const relatedNodes = useMemo(() => {
    const matchedIds = Array.from(new Set([
      ...outgoing.map((conn) => conn.target),
      ...incoming.map((conn) => conn.source),
    ]));

    return matchedIds
      .map((id) => allNodes.find((n) => n.id === id))
      .filter(Boolean) as CausalityNode[];
  }, [incoming, outgoing, allNodes]);

  const getNodeTitle = (id: string) => allNodes.find(n => n.id === id)?.title || 'Unknown';

  const handleAddConnection = () => {
    if (selectedTarget && onAddConnection) {
      onAddConnection(node.id, selectedTarget, connectionType);
      setSelectedTarget('');
      setConnectionType('strong');
      setShowConnectionUI(false);
    }
  };

  const connectionTypeColors = {
    strong: 'text-primary border-primary/30 bg-primary/10',
    weak: 'text-tertiary border-tertiary/30 bg-tertiary/10',
    divergent: 'text-error border-error/30 bg-error/10'
  };

  return (
    <aside className="fixed right-0 top-0 h-full w-[320px] bg-surface-container-low/60 backdrop-blur-xl border-l border-white/5 pt-20 px-6 flex flex-col gap-6 z-40">
      <div className="flex items-start gap-4">
        <div className={cn("px-3 py-1 border rounded-full flex items-center gap-2 text-[10px] font-black uppercase tracking-wider", getStatusColor())}>
          {getStatusIcon()}
          {node.type} Node
        </div>
        <div className="text-[10px] italic text-on-surface-variant/60 flex items-center gap-1 mt-1.5">
          <Calendar className="w-3 h-3" />
          {node.date}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-white leading-tight">{node.title}</h2>
      </div>

      <div className="aspect-video bg-surface-container-high rounded-xl border border-white/5 flex items-center justify-center overflow-hidden">
        <div className="flex flex-col items-center opacity-30">
          <Milestone className="w-8 h-8" />
          <span className="text-[10px] font-bold mt-1 uppercase tracking-widest text-center px-4">NODE CAPTURE</span>
        </div>
      </div>

      <p className="text-sm text-on-surface leading-relaxed opacity-80">
        {node.description}
      </p>

      <div className="flex-1 overflow-y-auto space-y-4 pr-1 scrollbar-hide">
        <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Ripple Impacts</p>
        
        <div className="glass-card p-4 rounded-xl space-y-4">
           <div className="flex items-center justify-between text-xs">
              <span className="text-secondary flex items-center gap-2">
                <TrendingUp className="w-3 h-3" /> Positive
              </span>
              <span className="font-bold">2</span>
           </div>
           <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
             <div className="h-full bg-secondary w-2/3" />
           </div>
           
           <div className="flex items-center justify-between text-xs mt-2">
              <span className="text-tertiary flex items-center gap-2">
                <Minus className="w-3 h-3" /> Neutral
              </span>
              <span className="font-bold">1</span>
           </div>
           <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
             <div className="h-full bg-tertiary w-1/3" />
           </div>
        </div>

        <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest pt-2">Connected Threads</p>
        
        {outgoing.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] text-on-surface-variant/70">Outgoing:</p>
            {outgoing.map((conn) => (
              <div key={`out-${conn.target}`} className={cn("glass-card p-3 rounded-lg hover:bg-white/5 transition-all group border", connectionTypeColors[conn.type])}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <ArrowUpRight className="w-3 h-3" />
                    <span className="text-[10px] font-bold uppercase">{getNodeTitle(conn.target)}</span>
                  </div>
                  <button 
                    onClick={() => onDeleteConnection?.(conn.source, conn.target)}
                    className="opacity-0 group-hover:opacity-100 transition-all p-1 hover:bg-red-500/20 rounded"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-[10px] leading-snug font-medium opacity-70">{conn.type} connection</p>
              </div>
            ))}
          </div>
        )}

        {incoming.length > 0 && (
          <div className="space-y-2">
            <p className="text-[10px] text-on-surface-variant/70">Incoming:</p>
            {incoming.map((conn) => (
              <div key={`in-${conn.source}`} className={cn("glass-card p-3 rounded-lg hover:bg-white/5 transition-all group border", connectionTypeColors[conn.type])}>
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <ArrowUpRight className="w-3 h-3 rotate-180" />
                    <span className="text-[10px] font-bold uppercase">{getNodeTitle(conn.source)}</span>
                  </div>
                  <button 
                    onClick={() => onDeleteConnection?.(conn.source, conn.target)}
                    className="opacity-0 group-hover:opacity-100 transition-all p-1 hover:bg-red-500/20 rounded"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-[10px] leading-snug font-medium opacity-70">{conn.type} connection</p>
              </div>
            ))}
          </div>
        )}

        {outgoing.length === 0 && incoming.length === 0 && (
          <div className="glass-card p-3 rounded-lg text-center opacity-60">
            <p className="text-[10px] font-medium">No connections yet</p>
          </div>
        )}

        {showConnectionUI ? (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-3 glass-card p-4 rounded-xl border border-primary/30"
          >
            <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block">Connect To</label>
            <select 
              value={selectedTarget}
              onChange={(e) => setSelectedTarget(e.target.value)}
              className="w-full bg-surface-container-lowest/50 border border-white/10 rounded-lg p-2 text-xs focus:outline-none focus:border-primary/40"
            >
              <option value="">Select a node...</option>
              {connectableNodes.map(n => (
                <option key={n.id} value={n.id}>{n.title}</option>
              ))}
            </select>

            <div className="space-y-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant block">Connection Type</label>
              <div className="flex gap-1">
                {(['strong', 'weak', 'divergent'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setConnectionType(type)}
                    className={cn(
                      "flex-1 px-2 py-1.5 rounded text-[9px] font-bold uppercase transition-all",
                      connectionType === type 
                        ? "bg-primary text-on-primary" 
                        : "bg-white/5 border border-white/10 hover:bg-white/10"
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                onClick={handleAddConnection}
                disabled={!selectedTarget}
                className="flex-1 bg-primary text-on-primary py-2 rounded-lg font-bold text-xs hover:opacity-90 disabled:opacity-50 transition-all"
              >
                Connect
              </button>
              <button
                onClick={() => {
                  setShowConnectionUI(false);
                  setSelectedTarget('');
                }}
                className="flex-1 bg-white/5 border border-white/10 py-2 rounded-lg font-bold text-xs hover:bg-white/10"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        ) : (
          <button
            onClick={() => setShowConnectionUI(true)}
            className="w-full bg-white/5 border border-white/10 py-2.5 rounded-lg font-bold text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Connection
          </button>
        )}
      </div>

      <div className="pb-8 space-y-3">
        <button 
          onClick={onEdit}
          className="w-full bg-white text-surface py-2.5 rounded-xl font-bold text-sm hover:opacity-90 transition-all flex items-center justify-center gap-2"
        >
          <Edit3 className="w-4 h-4" />
          Edit Node
        </button>
        <button className="w-full glass-card py-2.5 rounded-xl font-bold text-sm hover:bg-white/5 transition-all border border-white/10">
          Explore Impact Chain
        </button>
        <button 
          onClick={onDelete}
          className="w-full bg-error/10 border border-error/30 text-error py-2.5 rounded-xl font-bold text-sm hover:bg-error/20 transition-all flex items-center justify-center gap-2"
        >
          <Trash2 className="w-4 h-4" />
          Delete Node
        </button>
      </div>
    </aside>
  );
}
