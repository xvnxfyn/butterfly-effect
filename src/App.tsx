import { useState, useEffect, useReducer } from 'react';
import { Sidebar, Navbar } from './components/Navigation';
import { Dashboard } from './views/Dashboard';
import { History } from './views/History';
import { Library } from './views/Library';
import { StatsView } from './views/Stats';
import { PlantSeedModal } from './components/PlantSeedModal';
import { INITIAL_NODES, INITIAL_CONNECTIONS } from './constants';
import { CausalityNode, Connection } from './types';
import { AnimatePresence, motion } from 'motion/react';
import { useLocalStorage } from './hooks/useLocalStorage';

interface HistoryState {
  nodes: CausalityNode[];
  connections: Connection[];
}

type HistoryAction =
  | { type: 'push'; payload: HistoryState }
  | { type: 'undo' }
  | { type: 'redo' };

function historyReducer(state: { history: HistoryState[]; index: number }, action: HistoryAction) {
  switch (action.type) {
    case 'push': {
      const nextHistory = state.history.slice(0, state.index + 1);
      return {
        history: [...nextHistory, action.payload],
        index: nextHistory.length,
      };
    }
    case 'undo':
      return {
        ...state,
        index: Math.max(state.index - 1, 0),
      };
    case 'redo':
      return {
        ...state,
        index: Math.min(state.index + 1, state.history.length - 1),
      };
    default:
      return state;
  }
}

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNode, setEditingNode] = useState<CausalityNode | null>(null);
  const [templateSeed, setTemplateSeed] = useState<Omit<CausalityNode, 'id' | 'impact'> | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [nodes, setNodes] = useLocalStorage<CausalityNode[]>('butterfly_nodes', INITIAL_NODES);
  const [connections, setConnections] = useLocalStorage<Connection[]>('butterfly_connections', INITIAL_CONNECTIONS);
  const [historyState, dispatchHistory] = useReducer(historyReducer, {
    history: [{ nodes, connections }],
    index: 0,
  });

  const canUndo = historyState.index > 0;
  const canRedo = historyState.index < historyState.history.length - 1;

  useEffect(() => {
    const snapshot = historyState.history[historyState.index];
    if (snapshot) {
      setNodes(snapshot.nodes);
      setConnections(snapshot.connections);
    }
  }, [historyState.index]);

  const pushHistory = (nextNodes: CausalityNode[], nextConnections: Connection[]) => {
    dispatchHistory({
      type: 'push',
      payload: { nodes: nextNodes, connections: nextConnections },
    });
  };

  const handleAddNode = (newNode: Omit<CausalityNode, 'id' | 'impact'>) => {
    if (editingNode) {
      const nextNodes = nodes.map((n) =>
        n.id === editingNode.id ? { ...editingNode, ...newNode } : n
      );
      setNodes(nextNodes);
      pushHistory(nextNodes, connections);
      setEditingNode(null);
    } else {
      const node: CausalityNode = {
        ...newNode,
        id: Math.random().toString(36).substr(2, 9),
        impact: Math.floor(Math.random() * 5) + 1,
      };
      const nextNodes = [...nodes, node];
      setNodes(nextNodes);
      pushHistory(nextNodes, connections);
    }
    setTemplateSeed(null);
    setIsModalOpen(false);
  };

  const handleEditNode = (node: CausalityNode) => {
    setEditingNode(node);
    setTemplateSeed(null);
    setIsModalOpen(true);
  };

  const handleUseTemplate = (template: Omit<CausalityNode, 'id' | 'impact'>) => {
    setTemplateSeed(template);
    setEditingNode(null);
    setIsModalOpen(true);
  };

  const handleDeleteNode = (nodeId: string) => {
    const nextNodes = nodes.filter((n) => n.id !== nodeId);
    const nextConnections = connections.filter((c) => c.source !== nodeId && c.target !== nodeId);
    setNodes(nextNodes);
    setConnections(nextConnections);
    pushHistory(nextNodes, nextConnections);
  };

  const handleAddConnection = (
    source: string,
    target: string,
    type: 'strong' | 'weak' | 'divergent' = 'strong'
  ) => {
    const exists = connections.some((c) => c.source === source && c.target === target);
    if (!exists) {
      const nextConnections = [...connections, { source, target, type }];
      setConnections(nextConnections);
      pushHistory(nodes, nextConnections);
    }
  };

  const handleDeleteConnection = (source: string, target: string) => {
    const nextConnections = connections.filter((c) => !(c.source === source && c.target === target));
    setConnections(nextConnections);
    pushHistory(nodes, nextConnections);
  };

  const handleImport = (data: { nodes: CausalityNode[]; connections: Connection[] }) => {
    setNodes(data.nodes);
    setConnections(data.connections);
    pushHistory(data.nodes, data.connections);
    setActiveTab('dashboard');
    setSearchQuery('');
  };

  const handleUndo = () => {
    if (canUndo) dispatchHistory({ type: 'undo' });
  };

  const handleRedo = () => {
    if (canRedo) dispatchHistory({ type: 'redo' });
  };

  return (
    <div className="min-h-screen bg-surface selection:bg-primary selection:text-on-primary overflow-x-hidden">
      {/* Background Layer */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute inset-0 star-field opacity-10" />
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/5 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-secondary/5 blur-[120px] rounded-full" />
      </div>

      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />
      <Sidebar onNewSeed={() => setIsModalOpen(true)} />

      <main className="md:ml-[240px] pt-16 min-h-screen relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="h-full"
          >
            {activeTab === 'dashboard' && (
              <Dashboard
                nodes={nodes}
                connections={connections}
                onEditNode={handleEditNode}
                onDeleteNode={handleDeleteNode}
                onAddConnection={handleAddConnection}
                onDeleteConnection={handleDeleteConnection}
                canUndo={canUndo}
                canRedo={canRedo}
                onUndo={handleUndo}
                onRedo={handleRedo}
              />
            )}
            {activeTab === 'history' && (
              <History
                nodes={nodes}
                onEditNode={handleEditNode}
                onDeleteNode={handleDeleteNode}
                searchQuery={searchQuery}
                onSearchQueryChange={setSearchQuery}
              />
            )}
            {activeTab === 'library' && (
              <Library
                searchQuery={searchQuery}
                onSearchQueryChange={setSearchQuery}
                onUseTemplate={handleUseTemplate}
              />
            )}
            {activeTab === 'stats' && (
              <StatsView
                nodes={nodes}
                connections={connections}
                onImport={handleImport}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      <PlantSeedModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingNode(null);
          setTemplateSeed(null);
        }}
        onAdd={handleAddNode}
        existingNodes={nodes}
        editingNode={editingNode}
        templateSeed={templateSeed}
      />
    </div>
  );
}
