export type NodeType = 'positive' | 'neutral' | 'negative' | 'catalyst';

export interface CausalityNode {
  id: string;
  title: string;
  description: string;
  type: NodeType;
  date: string;
  impact: number;
  x?: number;
  y?: number;
}

export interface Connection {
  source: string;
  target: string;
  type: 'strong' | 'weak' | 'divergent';
}

export interface CausalityState {
  nodes: CausalityNode[];
  connections: Connection[];
}
