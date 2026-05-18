import { useState, useRef } from 'react';
import { CausalityGraph } from '../components/CausalityGraph';
import { NodeDetailPanel } from '../components/NodeDetailPanel';
import { CausalityNode, Connection } from '../types';
import { ZoomIn, ZoomOut, Maximize, RotateCcw, RotateCw } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface DashboardProps {
  nodes: CausalityNode[];
  connections: Connection[];
  onEditNode: (node: CausalityNode) => void;
  onDeleteNode: (nodeId: string) => void;
  onAddConnection: (source: string, target: string, type: 'strong' | 'weak' | 'divergent') => void;
  onDeleteConnection: (source: string, target: string) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}

export function Dashboard({ 
  nodes, 
  connections, 
  onEditNode,
  onDeleteNode,
  onAddConnection,
  onDeleteConnection,
  canUndo,
  canRedo,
  onUndo,
  onRedo
}: DashboardProps) {
  const [selectedNode, setSelectedNode] = useState<CausalityNode | null>(nodes[0] || null);
  const [zoom, setZoom] = useState(1);
  const graphRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.2, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.2, 0.5));
  const handleResetZoom = () => setZoom(1);

  return (
    <div className="flex h-full w-full relative">
      <motion.div 
        layout
        className={cn(
          "flex-1 p-6 transition-all duration-500",
          selectedNode ? "pr-[340px]" : ""
        )}
      >
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black">Causality Overview</h1>
            <p className="text-on-surface-variant">Real-time interaction with your life's decision graph.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              title="Undo"
              className={cn(
                "p-2 glass-card rounded-lg transition-all",
                canUndo ? 'text-on-surface hover:bg-white/5' : 'text-on-surface-variant opacity-50 cursor-not-allowed'
              )}
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              title="Redo"
              className={cn(
                "p-2 glass-card rounded-lg transition-all",
                canRedo ? 'text-on-surface hover:bg-white/5' : 'text-on-surface-variant opacity-50 cursor-not-allowed'
              )}
            >
              <RotateCw className="w-5 h-5" />
            </button>
            <button 
              onClick={handleZoomIn}
              title="Zoom In"
              className="p-2 glass-card rounded-lg text-on-surface hover:bg-white/5 transition-all"
            >
              <ZoomIn className="w-5 h-5" />
            </button>
            <button 
              onClick={handleZoomOut}
              title="Zoom Out"
              className="p-2 glass-card rounded-lg text-on-surface hover:bg-white/5 transition-all"
            >
              <ZoomOut className="w-5 h-5" />
            </button>
            <button 
              onClick={handleResetZoom}
              title="Reset View"
              className="p-2 glass-card rounded-lg text-on-surface hover:bg-white/5 transition-all"
            >
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="h-[calc(100vh-200px)]" ref={graphRef}>
          <CausalityGraph 
            nodes={nodes} 
            connections={connections} 
            onNodeClick={setSelectedNode}
            selectedNodeId={selectedNode?.id || null}
            zoom={zoom}
          />
        </div>
      </motion.div>

      {selectedNode && (
        <NodeDetailPanel 
          node={selectedNode} 
          onClose={() => setSelectedNode(null)}
          onEdit={() => onEditNode(selectedNode)}
          onDelete={() => {
            onDeleteNode(selectedNode.id);
            setSelectedNode(null);
          }}
          allNodes={nodes}
          connections={connections}
          onAddConnection={onAddConnection}
          onDeleteConnection={onDeleteConnection}
        />
      )}
    </div>
  );
}
