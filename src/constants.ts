import { CausalityNode, Connection } from './types';

export const INITIAL_NODES: CausalityNode[] = [
  {
    id: '1',
    title: 'Moved to NYC',
    description: 'A pivotal relocation that shifted the trajectory of personal growth and career alignment. Leaving the comfort of the Midwest for the high-density complexity of Brooklyn.',
    type: 'catalyst',
    date: '2023-09-14',
    impact: 3,
  },
  {
    id: '2',
    title: 'First Coffee',
    description: 'Met local community organizers at \'The Hub\'. Initiated urban garden project.',
    type: 'positive',
    date: '2024-05-10',
    impact: 2,
  },
  {
    id: '3',
    title: 'Morning Jog',
    description: 'Started a consistent cardio routine that improved overall energy levels.',
    type: 'neutral',
    date: '2024-03-11',
    impact: 1,
  },
  {
    id: '4',
    title: 'New Career Path',
    description: 'Pivoted from traditional finance to sustainability focus after networking event.',
    type: 'positive',
    date: '2024-10-15',
    impact: 4,
  },
  {
    id: '5',
    title: 'Missed Flight',
    description: 'Stuck in traffic for 3 hours. Missed crucial meeting in San Francisco.',
    type: 'negative',
    date: '2024-07-20',
    impact: 2,
  },
  {
    id: '6',
    title: 'Joined Startup',
    description: 'Accepted the founding engineer role at a clean-tech venture in Brooklyn.',
    type: 'positive',
    date: '2024-12-01',
    impact: 3,
  }
];

export const INITIAL_CONNECTIONS: Connection[] = [
  { source: '1', target: '2', type: 'strong' },
  { source: '1', target: '3', type: 'weak' },
  { source: '2', target: '4', type: 'strong' },
  { source: '3', target: '4', type: 'weak' },
  { source: '4', target: '6', type: 'strong' },
  { source: '1', target: '5', type: 'divergent' },
];
