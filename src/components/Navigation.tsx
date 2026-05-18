import { LayoutDashboard, History, Library, Settings, Info, PlusCircle, Share2, Search, Bell, User, BarChart3 } from 'lucide-react';
import { cn } from '../lib/utils';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
}

export function Navbar({ activeTab, setActiveTab, searchQuery, setSearchQuery }: NavbarProps) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'history', label: 'History', icon: History },
    { id: 'library', label: 'Library', icon: Library },
    { id: 'stats', label: 'Analytics', icon: BarChart3 },
  ];

  return (
    <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 h-16 bg-surface-container-lowest/80 backdrop-blur-xl border-b border-white/5">
      <div className="flex items-center gap-8">
        <span className="font-display text-xl font-bold text-on-surface flex items-center gap-2">
          The Butterfly Effect
        </span>
        <nav className="hidden md:flex items-center gap-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "font-medium text-sm transition-all relative pb-1",
                activeTab === tab.id 
                  ? "text-primary border-b-2 border-primary" 
                  : "text-on-surface-variant hover:text-on-surface"
              )}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
      <div className="flex items-center gap-4">
        <div className="hidden md:flex items-center bg-white/5 border border-white/10 rounded-full px-4 py-1.5 gap-2">
          <Search className="w-4 h-4 text-on-surface-variant" />
          <input 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent border-none focus:ring-0 text-sm w-48 text-on-surface placeholder:text-on-surface-variant/50" 
            placeholder="Search causality..." 
            type="text" 
          />
        </div>
        <button className="p-2 text-on-surface-variant hover:text-on-surface transition-all rounded-full hover:bg-white/5">
          <Bell className="w-5 h-5" />
        </button>
        <button className="p-2 text-on-surface-variant hover:text-on-surface transition-all rounded-full hover:bg-white/5">
          <User className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
}

interface SidebarProps {
  onNewSeed: () => void;
}

export function Sidebar({ onNewSeed }: SidebarProps) {
  const menuItems = [
    { id: 'all', label: 'All Paths', icon: Share2, count: 42, active: true },
    { id: 'positive', label: 'Positive Ripples', icon: Settings, count: 18, color: 'text-secondary' },
    { id: 'negative', label: 'Negative Impacts', icon: Info, count: 12, color: 'text-error' },
    { id: 'neutral', label: 'Neutral Nodes', icon: Info, count: 12, color: 'text-tertiary' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full flex flex-col p-4 z-40 bg-surface-container-low/60 backdrop-blur-xl border-r border-white/5 w-[240px] pt-20">
      <div className="mb-6 px-2">
        <h2 className="text-xl font-black text-on-surface leading-tight">Causality Engine</h2>
        <p className="text-xs text-on-surface-variant opacity-70">Project Alpha-01</p>
      </div>
      
      <button 
        onClick={onNewSeed}
        className="w-full bg-white text-surface py-3 rounded-xl font-bold flex items-center justify-center gap-2 mb-8 hover:opacity-90 active:scale-[0.98] transition-all shadow-lg"
      >
        <PlusCircle className="w-5 h-5" />
        <span>New Seed</span>
      </button>

      <nav className="flex flex-col gap-1 flex-grow">
        {menuItems.map((item) => (
          <button
            key={item.id}
            className={cn(
              "flex items-center justify-between px-3 py-2.5 rounded-lg transition-all text-sm",
              item.active 
                ? "bg-white/5 text-primary font-bold" 
                : "text-on-surface-variant hover:text-on-surface hover:bg-white/10"
            )}
          >
            <div className="flex items-center gap-3">
              <item.icon className={cn("w-4 h-4", item.id === 'all' && "text-primary", item.color)} />
              <span>{item.label}</span>
            </div>
            <span className={cn(
              "text-[10px] px-2 py-0.5 rounded-full border",
              item.active ? "bg-primary/20 border-primary/20 text-primary" : "bg-white/5 border-white/10 text-on-surface-variant"
            )}>
              {item.count}
            </span>
          </button>
        ))}
      </nav>

      <div className="pt-4 border-t border-white/5 flex flex-col gap-1">
        <button className="flex items-center gap-3 px-3 py-2 text-sm text-on-surface-variant hover:text-on-surface transition-colors rounded-lg">
          <History className="w-4 h-4" />
          <span>Replay Timeline</span>
        </button>
        <button className="flex items-center gap-3 px-3 py-2 text-sm text-on-surface-variant hover:text-on-surface transition-colors rounded-lg">
          <Settings className="w-4 h-4" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  );
}
