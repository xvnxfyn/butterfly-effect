import { CausalityNode } from '../types';
import { TrendingUp, TrendingDown, Zap, BarChart3 } from 'lucide-react';
import { calculateImpactStats } from '../lib/storage';
import { motion } from 'motion/react';

interface StatsProps {
  nodes: CausalityNode[];
}

export function Statistics({ nodes }: StatsProps) {
  const stats = calculateImpactStats(nodes);

  const StatCard = ({ 
    icon: Icon, 
    label, 
    value, 
    color 
  }: { 
    icon: any; 
    label: string; 
    value: string | number; 
    color: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-6 rounded-2xl border border-white/10 flex flex-col gap-3"
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-sm text-on-surface-variant font-bold uppercase tracking-widest">{label}</p>
        <p className="text-3xl font-black text-white mt-1">{value}</p>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-black mb-6">Impact Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            icon={BarChart3} 
            label="Total Events" 
            value={stats.totalNodes} 
            color="bg-primary/20 text-primary" 
          />
          <StatCard 
            icon={Zap} 
            label="Total Impact" 
            value={stats.totalImpact} 
            color="bg-secondary/20 text-secondary" 
          />
          <StatCard 
            icon={TrendingUp} 
            label="Avg Impact" 
            value={stats.avgImpact} 
            color="bg-green-500/20 text-green-400" 
          />
          <StatCard 
            icon={TrendingUp} 
            label="High Impact (≥4)" 
            value={stats.highImpactNodes} 
            color="bg-error/20 text-error" 
          />
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4">Events by Type</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Positive', value: stats.byType.positive, color: 'bg-secondary/20 text-secondary', icon: '✓' },
            { label: 'Negative', value: stats.byType.negative, color: 'bg-error/20 text-error', icon: '✕' },
            { label: 'Neutral', value: stats.byType.neutral, color: 'bg-tertiary/20 text-tertiary', icon: '—' },
            { label: 'Catalyst', value: stats.byType.catalyst, color: 'bg-primary/20 text-primary', icon: '⚡' },
          ].map(({ label, value, color }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`glass-card p-4 rounded-xl text-center border border-white/10 ${color}`}
            >
              <p className="text-2xl font-black">{value}</p>
              <p className="text-xs font-bold uppercase tracking-widest mt-2 opacity-70">{label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
