import Papa from 'papaparse';
import { College } from '../types';

export const parseCSV = (csvData: string): College[] => {
  const { data } = Papa.parse(csvData, {
    header: true,
    skipEmptyLines: true
  });

  return data.map((row: any) => ({
    id: row.id || String(Math.random()),
    name: row.name,
    latitude: parseFloat(row.latitude),
    longitude: parseFloat(row.longitude),
    techLeadInterns: parseInt(row.techLeadInterns) || 0,
    aiDeveloperInterns: parseInt(row.aiDeveloperInterns) || 0
  }));
}; 