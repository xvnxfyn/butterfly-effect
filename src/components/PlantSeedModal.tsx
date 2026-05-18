import React, { useState, useEffect } from 'react';
import { X, Calendar, Link as LinkIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { CausalityNode, NodeType } from '../types';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface PlantSeedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (node: Omit<CausalityNode, 'id' | 'impact'>) => void;
  existingNodes: CausalityNode[];
  editingNode?: CausalityNode | null;
  templateSeed?: Omit<CausalityNode, 'id' | 'impact'> | null;
}

export function PlantSeedModal({ isOpen, onClose, onAdd, existingNodes, editingNode, templateSeed }: PlantSeedModalProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [type, setType] = useState<NodeType>('positive');

  useEffect(() => {
    if (editingNode) {
      setTitle(editingNode.title);
      setDescription(editingNode.description);
      setDate(editingNode.date);
      setType(editingNode.type);
    } else if (templateSeed) {
      setTitle(templateSeed.title);
      setDescription(templateSeed.description);
      setDate(templateSeed.date);
      setType(templateSeed.type);
    } else {
      setTitle('');
      setDescription('');
      setDate(new Date().toISOString().split('T')[0]);
      setType('positive');
    }
  }, [editingNode, templateSeed, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ title, description, date, type });
    setTitle('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
    setType('positive');
  };

  const types: { id: NodeType; label: string; icon: any; color: string }[] = [
    { id: 'positive', label: 'Positive', icon: TrendingUp, color: 'bg-secondary text-on-secondary' },
    { id: 'neutral', label: 'Neutral', icon: Minus, color: 'bg-tertiary text-on-tertiary' },
    { id: 'negative', label: 'Negative', icon: TrendingDown, color: 'bg-error text-on-error' },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative w-full max-w-[560px] bg-[#141612] rounded-2xl border border-white/10 shadow-2xl p-8 flex flex-col gap-8"
      >
        <div className="flex justify-between items-start">
          <div>
            <h2 className="text-2xl font-bold text-on-surface">
              {editingNode ? 'Edit Event' : 'Plant a New Seed'}
            </h2>
            <p className="text-sm text-on-surface-variant mt-1">
              {editingNode ? 'Update this nodal point in your causality timeline.' : 'Initiate a new nodal point in your causality timeline.'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 text-on-surface-variant hover:text-on-surface transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant block ml-1">Event Title</label>
            <input 
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-surface-container-lowest/50 border border-white/10 rounded-xl p-4 text-on-surface focus:outline-none focus:border-primary/40 transition-all" 
              placeholder="e.g., Morning Meditation Session" 
              type="text"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant block ml-1">Date</label>
              <div className="relative">
                <input 
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-surface-container-lowest/50 border border-white/10 rounded-xl p-4 text-on-surface focus:outline-none focus:border-primary/40 appearance-none" 
                  type="date"
                />
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant block ml-1">Node Type</label>
            <div className="flex bg-surface-container-lowest/80 p-1.5 rounded-xl border border-white/5">
              {types.map((t) => (
                <button 
                  key={t.id}
                  type="button"
                  onClick={() => setType(t.id)}
                  className={cn(
                    "flex-1 py-2 text-sm font-bold rounded-lg transition-all flex items-center justify-center gap-2",
                    type === t.id ? t.color : "text-on-surface-variant hover:text-on-surface hover:bg-white/5"
                  )}
                >
                  <t.icon className="w-4 h-4" />
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant block ml-1">Description</label>
            <textarea 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-surface-container-lowest/50 border border-white/10 rounded-xl p-4 text-on-surface focus:outline-none focus:border-primary/40 transition-all resize-none" 
              placeholder="Describe the immediate impact and intended ripples..." 
              rows={3}
              required
            />
          </div>

          <div className="flex items-center justify-end gap-4 pt-4">
            <button 
              type="button"
              onClick={onClose}
              className="px-6 py-3 text-sm font-bold text-on-surface hover:bg-white/5 rounded-xl transition-all border border-white/10"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="px-10 py-3 text-sm font-bold bg-white text-surface rounded-xl hover:opacity-90 active:scale-95 transition-all shadow-xl"
            >
              {editingNode ? 'Update Event' : 'Plant Seed'}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
