export interface Project {
  id: string;
  name: string;
  allocatedGPU: number;
  currentUsage: number; // Actually used GPU (0 to allocatedGPU + borrowed)
}

export interface BusinessUnit {
  id: string;
  name: string;
  allocatedGPU: number;
  projects: Project[];
}

export interface BorrowingRelation {
  fromId: string; // Business unit lending GPU
  toId: string;   // Business unit borrowing GPU
  borrowedAmount: number; // Amount of GPU borrowed (0-100% of lender's allocation)
}

export interface Organization {
  id: string;
  name: string;
  allocatedGPU: number;
  businessUnits: BusinessUnit[];
  projects: Project[]; // Direct projects without business unit
  borrowingRelations?: BorrowingRelation[]; // GPU borrowing between business units
}

export interface Root {
  id: string;
  name: string;
  totalGPU: number;
  organizations: Organization[];
}