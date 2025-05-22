import { Root } from './types';

export const mockData: Root = {
  id: 'root-1',
  name: 'GPU Cluster',
  totalGPU: 100,
  organizations: [
    {
      id: 'org-dev',
      name: 'Development',
      allocatedGPU: 20,
      businessUnits: [],
      projects: [
        { id: 'proj-a', name: 'ML-Training-A', allocatedGPU: 8, currentUsage: 3.2 },
        { id: 'proj-b', name: 'ML-Training-B', allocatedGPU: 12, currentUsage: 0.8 }
      ]
    },
    {
      id: 'org-prod',
      name: 'Production',
      allocatedGPU: 80,
      businessUnits: [
        {
          id: 'bu-analytics',
          name: 'Analytics',
          allocatedGPU: 35,
          projects: [
            { id: 'proj-c', name: 'Customer-Analytics', allocatedGPU: 20, currentUsage: 18.5 },
            { id: 'proj-d', name: 'Sales-Forecast', allocatedGPU: 15, currentUsage: 12.1 }
          ]
        },
        {
          id: 'bu-ml',
          name: 'Machine Learning',
          allocatedGPU: 45,
          projects: [
            { id: 'proj-e', name: 'Recommendation-Engine', allocatedGPU: 25, currentUsage: 32.1 },
            { id: 'proj-f', name: 'Image-Recognition', allocatedGPU: 20, currentUsage: 26.3 }
          ]
        }
      ],
      projects: [],
      borrowingRelations: [
        {
          fromId: 'bu-analytics',
          toId: 'bu-ml',
          borrowedAmount: 30 // 30% of Analytics' allocation (10.5 GPU) lent to ML
        }
      ]
    }
  ]
};