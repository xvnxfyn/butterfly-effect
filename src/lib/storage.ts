import { CausalityNode, Connection, CausalityState } from '../types';

export const exportData = () => {
  const nodes = localStorage.getItem('butterfly_nodes');
  const connections = localStorage.getItem('butterfly_connections');
  
  const state: CausalityState = {
    nodes: nodes ? JSON.parse(nodes) : [],
    connections: connections ? JSON.parse(connections) : [],
  };

  const dataStr = JSON.stringify(state, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `butterfly-effect-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const importData = (file: File): Promise<CausalityState> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string) as CausalityState;
        
        // Validate data structure
        if (Array.isArray(data.nodes) && Array.isArray(data.connections)) {
          localStorage.setItem('butterfly_nodes', JSON.stringify(data.nodes));
          localStorage.setItem('butterfly_connections', JSON.stringify(data.connections));
          resolve(data);
        } else {
          reject(new Error('Invalid data format'));
        }
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
};

export const calculateImpactStats = (nodes: CausalityNode[]) => {
  return {
    totalNodes: nodes.length,
    totalImpact: nodes.reduce((sum, n) => sum + n.impact, 0),
    avgImpact: nodes.length > 0 ? (nodes.reduce((sum, n) => sum + n.impact, 0) / nodes.length).toFixed(1) : 0,
    highImpactNodes: nodes.filter(n => n.impact >= 4).length,
    byType: {
      positive: nodes.filter(n => n.type === 'positive').length,
      negative: nodes.filter(n => n.type === 'negative').length,
      neutral: nodes.filter(n => n.type === 'neutral').length,
      catalyst: nodes.filter(n => n.type === 'catalyst').length,
    },
  };
};
