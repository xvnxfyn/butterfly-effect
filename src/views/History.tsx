import { motion } from 'motion/react';
import { Milestone, TrendingUp, TrendingDown, Minus, ArrowRight, Edit3, Trash2, Search } from 'lucide-react';
import { CausalityNode } from '../types';
import { cn } from '../lib/utils';
import { useState, useMemo, useEffect } from 'react';

interface HistoryProps {
  nodes: CausalityNode[];
  onEditNode: (node: CausalityNode) => void;
  onDeleteNode: (nodeId: string) => void;
  searchQuery?: string;
  onSearchQueryChange?: (value: string) => void;
}

export function History({ nodes, onEditNode, onDeleteNode, searchQuery: initialSearchQuery = '', onSearchQueryChange }: HistoryProps) {
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [selectedYear, setSelectedYear] = useState('All');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  useEffect(() => {
    setSearchQuery(initialSearchQuery);
  }, [initialSearchQuery]);

  const years = ['All', '2024', '2023', '2022'];
  const filters = [
    { label: 'Positive', color: 'bg-secondary', type: 'positive' },
    { label: 'Negative', color: 'bg-error', type: 'negative' },
    { label: 'Neutral', color: 'bg-tertiary', type: 'neutral' },
    { label: 'Catalyst', color: 'bg-primary', type: 'catalyst' },
  ];

  const toggleTypeFilter = (type: string) => {
    setSelectedTypes(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const filteredNodes = useMemo(() => {
    return nodes
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .filter(node => {
        // Year filter
        if (selectedYear !== 'All') {
          const nodeYear = node.date.split('-')[0];
          if (nodeYear !== selectedYear) return false;
        }

        // Type filter
        if (selectedTypes.length > 0 && !selectedTypes.includes(node.type)) {
          return false;
        }

        // Search filter
        if (searchQuery) {
          const query = searchQuery.toLowerCase();
          return (
            node.title.toLowerCase().includes(query) ||
            node.description.toLowerCase().includes(query)
          );
        }

        return true;
      });
  }, [nodes, searchQuery, selectedYear, selectedTypes]);

  return (
    <div className="flex flex-col gap-8 p-6 max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-4xl font-black mb-6">Your Timeline</h1>
        
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => {
                const value = e.target.value;
                setSearchQuery(value);
                onSearchQueryChange?.(value);
              }}
              className="w-full bg-surface-container-lowest/40 backdrop-blur-md border border-white/10 rounded-xl py-3 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/40 transition-all"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          {years.map(year => (
             <button 
               key={year}
               onClick={() => setSelectedYear(year)}
               className={cn(
               "px-6 py-2 rounded-full font-bold text-sm transition-all",
               selectedYear === year ? "bg-primary text-on-primary" : "bg-white/5 border border-white/10 hover:bg-white/10"
             )}>
               {year}
             </button>
          ))}
          <div className="w-[1px] h-8 bg-white/10 mx-2" />
          {filters.map(f => (
            <button 
              key={f.type}
              onClick={() => toggleTypeFilter(f.type)}
              className={cn(
                "px-6 py-2 rounded-full font-bold text-sm transition-all flex items-center gap-2",
                selectedTypes.includes(f.type)
                  ? `${f.color} text-white`
                  : "bg-white/5 border border-white/10 hover:bg-white/10"
              )}
            >
              <span className={cn("w-2 h-2 rounded-full", f.color)} />
              {f.label}
            </button>
          ))}
        </div>

        {searchQuery && (
          <p className="text-sm text-on-surface-variant mt-4">
            Found {filteredNodes.length} event{filteredNodes.length !== 1 ? 's' : ''}
          </p>
        )}
      </header>

      <div className="relative pl-8 border-l border-white/10 space-y-12">
        {filteredNodes.length > 0 ? (
          filteredNodes.map((node, i) => (
            <motion.div 
              key={node.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative"
            >
              <div className={cn(
                "absolute -left-[41px] top-0 w-4 h-4 rounded-full border-4 border-surface shadow-[0_0_15px_rgba(255,255,255,0.2)]",
                node.type === 'catalyst' && "bg-primary shadow-primary/40",
                node.type === 'positive' && "bg-secondary shadow-secondary/40",
                node.type === 'negative' && "bg-error shadow-error/40",
                node.type === 'neutral' && "bg-tertiary shadow-tertiary/40",
              )} />
              
              <div className="glass-card p-6 rounded-2xl max-w-xl hover:-translate-y-1 transition-all cursor-pointer">
                <span className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant block mb-2">{node.date}</span>
                <h3 className="text-xl font-bold mb-2">{node.title}</h3>
                <p className="text-sm text-on-surface-variant mb-6">{node.description}</p>
                
                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                  <span className={cn(
                    "flex items-center gap-2 text-xs font-bold uppercase",
                    node.type === 'positive' && "text-secondary",
                    node.type === 'negative' && "text-error",
                    node.type === 'neutral' && "text-tertiary",
                    node.type === 'catalyst' && "text-primary",
                  )}>
                     {node.type === 'catalyst' && <Milestone className="w-4 h-4" />}
                     {node.type === 'positive' && <TrendingUp className="w-4 h-4" />}
                     {node.type === 'negative' && <TrendingDown className="w-4 h-4" />}
                     {node.type === 'neutral' && <Minus className="w-4 h-4" />}
                     {node.type}
                  </span>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => onEditNode(node)}
                      className="p-2 rounded-lg hover:bg-white/10 transition-all text-on-surface"
                      title="Edit event"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onDeleteNode(node.id)}
                      className="p-2 rounded-lg hover:bg-error/20 transition-all text-error"
                      title="Delete event"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-on-surface-variant font-medium">No events found matching your filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
