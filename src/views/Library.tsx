import { useState, useMemo, useEffect } from 'react';
import { Search, BookOpen, Users, Folder, Archive, ArrowRight } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';
import { CausalityNode, NodeType } from '../types';

interface LibraryProps {
  searchQuery?: string;
  onSearchQueryChange?: (value: string) => void;
  onUseTemplate?: (template: Omit<CausalityNode, 'id' | 'impact'>) => void;
}

const templates = [
  {
    title: 'The Career Pivot',
    desc: 'A high-impact template for mapping professional transitions, highlighting risk nodes.',
    users: '1.2k',
    nodes: 5,
    category: 'Career',
    type: 'positive' as NodeType,
  },
  {
    title: 'Morning Ritual Chain',
    desc: 'Standardized feedback loops for establishing compounding morning habits.',
    users: '3.4k',
    nodes: 8,
    category: 'Habit',
    type: 'neutral' as NodeType,
  },
  {
    title: 'Social Network Ripple',
    desc: 'Visualize how singular introductions create secondary connection opportunities.',
    users: '850',
    nodes: 12,
    category: 'Life',
    type: 'positive' as NodeType,
  },
];

const archive = [
  { title: 'Project Genesis: 2023 Alpha Test', date: 'Oct 14, 2023', nodes: 24 },
  { title: 'London Relocation Mapping', date: 'Aug 22, 2023', nodes: 15 },
  { title: 'Digital Detox Experiment #1', date: 'Jun 05, 2023', nodes: 7 },
];

export function Library({ searchQuery: initialSearchQuery = '', onSearchQueryChange, onUseTemplate }: LibraryProps) {
  const [query, setQuery] = useState(initialSearchQuery);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    setQuery(initialSearchQuery);
  }, [initialSearchQuery]);

  const categories = ['All', 'Life', 'Career', 'Habit'];

  const filteredTemplates = useMemo(() => {
    return templates.filter((template) => {
      const matchesCategory = activeCategory === 'All' || template.category === activeCategory;
      const matchesQuery = query
        ? `${template.title} ${template.desc}`.toLowerCase().includes(query.toLowerCase())
        : true;
      return matchesCategory && matchesQuery;
    });
  }, [activeCategory, query]);

  const handleTemplateSearch = (value: string) => {
    setQuery(value);
    onSearchQueryChange?.(value);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-12 pb-24">
      <section>
        <h1 className="text-4xl font-black mb-2">Resource Library</h1>
        <p className="text-on-surface-variant mb-10 max-w-2xl">Explore causality templates and archived patterns to blueprint your next sequence of events.</p>

        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-10">
          <div className="relative w-full md:max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-on-surface-variant" />
            <input
              value={query}
              onChange={(e) => handleTemplateSearch(e.target.value)}
              className="w-full bg-surface-container-low/40 backdrop-blur-md border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm focus:outline-none focus:border-primary/40 transition-all"
              placeholder="Filter templates..."
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map((tag) => (
              <button
                key={tag}
                onClick={() => setActiveCategory(tag)}
                className={cn(
                  'px-5 py-2 rounded-full font-bold text-xs transition-all',
                  tag === activeCategory
                    ? 'bg-primary text-on-primary'
                    : 'bg-white/5 border border-white/10 hover:bg-white/10'
                )}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between mb-6 gap-4">
          <p className="text-sm text-on-surface-variant">
            {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} available
          </p>
          <button
            className="text-primary text-xs font-bold flex items-center gap-2 hover:underline"
            onClick={() => setActiveCategory('All')}
          >
            Reset Filters <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredTemplates.map((t, i) => (
            <motion.div
              key={t.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6 rounded-2xl flex flex-col hover:border-primary/30 transition-all group"
            >
              <div className="h-40 bg-surface-container-lowest/50 rounded-xl mb-6 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-x-8 h-1 bg-white/5 rounded-full" />
                <div className="w-12 h-12 bg-primary/20 rounded-full border border-primary/20" />
                <div className="absolute bottom-0 inset-x-0 h-1/2 bg-gradient-to-t from-surface to-transparent" />
              </div>
              <div className="flex-1">
                <span className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-2 block">{t.category}</span>
                <h3 className="text-xl font-bold mb-2">{t.title}</h3>
                <p className="text-sm text-on-surface-variant mb-6 line-clamp-2">{t.desc}</p>
                <div className="flex items-center gap-4 text-xs text-on-surface-variant font-bold">
                  <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {t.users}</span>
                  <span className="flex items-center gap-1"><BookOpen className="w-3 h-3" /> {t.nodes} nodes</span>
                </div>
              </div>
              <div className="flex gap-3 mt-8">
                <button
                  onClick={() => onUseTemplate?.({
                    title: t.title,
                    description: t.desc,
                    date: new Date().toISOString().split('T')[0],
                    type: t.type,
                  })}
                  className="flex-1 bg-white text-surface py-2.5 rounded-lg font-bold text-xs hover:opacity-90 active:scale-95 transition-all"
                >
                  Use Template
                </button>
                <button className="flex-1 border border-white/10 py-2.5 rounded-lg font-bold text-xs hover:bg-white/5 active:scale-95 transition-all">
                  Preview
                </button>
              </div>
            </motion.div>
          ))}
          {filteredTemplates.length === 0 && (
            <div className="md:col-span-3 glass-card p-8 rounded-3xl text-center text-on-surface-variant">
              No templates matched your search or selected category.
            </div>
          )}
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Archived Paths</h2>
          <button className="text-primary text-xs font-bold flex items-center gap-2 hover:underline">
            View All Archive <ArrowRight className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-4">
          {archive.map((a) => (
            <div key={a.title} className="glass-card p-4 rounded-xl flex items-center justify-between group hover:bg-white/5 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-on-surface-variant">
                  <Folder className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm">{a.title}</h4>
                  <p className="text-xs text-on-surface-variant opacity-60">Archived on {a.date} • {a.nodes} Nodes</p>
                </div>
              </div>
              <button className="p-2 ghost-border rounded-lg text-on-surface-variant hover:text-on-surface transition-all">
                <Archive className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
