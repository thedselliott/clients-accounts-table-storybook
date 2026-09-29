import type { ClientAccountRow } from './types';

export const sampleRows: ClientAccountRow[] = [
  { id: '1', clientName: 'Acme Contracting LLC', secondaryLine: 'billing@acmecontracting.com', avatarLetter: 'A', status: 'active', balance: 12480 },
  { id: '2', clientName: 'Bluepeak Retail Group', secondaryLine: 'billing@bluepeakretail.com', avatarLetter: 'B', status: 'active', balance: 8204.15 },
  { id: '3', clientName: 'Sierra Nova Studios', secondaryLine: 'accounts@sierranova.com', avatarLetter: 'S', status: 'active', balance: 45900 },
  { id: '4', clientName: 'Harbor & Vine Co.', secondaryLine: 'billing@harborvine.com', avatarLetter: 'H', status: 'inactive', balance: 0, disabled: true },
  {
    id: '5',
    clientName: 'Thornton Legal Partners',
    secondaryLine: 'ap@thorntonlegal.com',
    avatarLetter: 'T',
    status: 'overdue',
    balance: -150,
    hasError: true,
    balanceCellState: 'error',
  },
  { id: '6', clientName: 'Meridian Freight Co.', secondaryLine: 'billing@meridianfreight.com', avatarLetter: 'M', status: 'active', balance: 3120.5, pinned: true },
];
