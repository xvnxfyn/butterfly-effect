import { CausalityNode, Connection } from '../types';
import { Download, Upload } from 'lucide-react';
import { exportData, importData } from '../lib/storage';
import { useState, useRef } from 'react';
import { Statistics } from '../components/Statistics';
import { motion } from 'motion/react';

interface StatsViewProps {
  nodes: CausalityNode[];
  connections: Connection[];
  onImport: (data: { nodes: CausalityNode[]; connections: Connection[] }) => void;
}

export function StatsView({ nodes, connections, onImport }: StatsViewProps) {
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    exportData();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const data = await importData(file);
      onImport(data);
    } catch (error) {
      alert('Failed to import data: ' + (error as Error).message);
    } finally {
      setImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div>
          <h1 className="text-4xl font-black mb-2">Analytics & Settings</h1>
          <p className="text-on-surface-variant">View your causality impact and manage your data.</p>
        </div>
        <div className="flex gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExport}
            className="flex items-center gap-2 px-6 py-3 bg-secondary text-on-secondary rounded-xl font-bold hover:opacity-90 transition-all"
          >
            <Download className="w-5 h-5" />
            Export Data
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleImportClick}
            disabled={importing}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-xl font-bold hover:opacity-90 disabled:opacity-50 transition-all"
          >
            <Upload className="w-5 h-5" />
            {importing ? 'Importing...' : 'Import Data'}
          </motion.button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      </div>

      <Statistics nodes={nodes} />

      <div className="glass-card p-6 rounded-2xl border border-white/10">
        <h3 className="text-lg font-bold mb-4">Data Summary</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-on-surface-variant font-bold uppercase text-[10px] tracking-widest mb-1">Total Nodes</p>
            <p className="text-2xl font-black">{nodes.length}</p>
          </div>
          <div>
            <p className="text-on-surface-variant font-bold uppercase text-[10px] tracking-widest mb-1">Total Connections</p>
            <p className="text-2xl font-black">{connections.length}</p>
          </div>
          <div>
            <p className="text-on-surface-variant font-bold uppercase text-[10px] tracking-widest mb-1">Last Updated</p>
            <p className="text-lg font-bold">{new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <div className="glass-card p-6 rounded-2xl border border-white/10">
        <h3 className="text-lg font-bold mb-4">About Export/Import</h3>
        <ul className="space-y-2 text-sm text-on-surface-variant">
          <li>✓ Export your entire causality map as JSON</li>
          <li>✓ Import previously exported data</li>
          <li>✓ Backup your data locally</li>
          <li>✓ Share causality maps with others</li>
        </ul>
      </div>
    </div>
  );
}
