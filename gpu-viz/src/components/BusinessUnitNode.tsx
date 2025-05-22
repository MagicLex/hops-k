import React from 'react';
import { Handle, Position } from 'reactflow';

interface BusinessUnitNodeProps {
  data: {
    name: string;
    allocatedGPU: number;
    currentUsage: number;
    borrowedGPU?: number;
    percentage?: string;
    borrowedPercentage?: string;
    height?: number;
  };
}

const BusinessUnitNode: React.FC<BusinessUnitNodeProps> = ({ data }) => {
  return (
    <div 
      className="bg-white border border-gray-300 rounded-sm shadow-sm p-3 min-w-40"
      style={{ 
        height: data.height || 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: '#6B7280' }} />
      <Handle id="left" type="source" position={Position.Left} style={{ background: '#f59e0b', top: '50%' }} />
      <Handle id="left-target" type="target" position={Position.Left} style={{ background: '#f59e0b', top: '50%' }} />
      <Handle id="right" type="source" position={Position.Right} style={{ background: '#f59e0b', top: '50%' }} />
      <Handle id="right-target" type="target" position={Position.Right} style={{ background: '#f59e0b', top: '50%' }} />
      <div className="text-center">
        <div className="font-semibold text-sm text-gray-900 mb-2">{data.name}</div>
        <div className="space-y-2">
          <div className="bg-gray-50 px-2 py-1 rounded-sm border">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">GPU</span>
              <span className="text-sm font-semibold text-gray-900">{data.allocatedGPU}</span>
            </div>
            {data.borrowedGPU && data.borrowedGPU > 0.1 && (
              <div className="flex justify-between items-center mt-1">
                <span className="text-xs" style={{ color: '#f59e0b' }}>Borrowed</span>
                <span className="text-sm font-semibold" style={{ color: '#f59e0b' }}>+{data.borrowedGPU.toFixed(1)}</span>
              </div>
            )}
          </div>
          <div className="bg-gray-100 px-2 py-1 rounded-sm border">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-500">Using</span>
              <span className="text-sm font-semibold text-gray-900">{data.currentUsage.toFixed(1)}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                style={{ 
                  width: `${Math.min((data.currentUsage / (data.allocatedGPU + (data.borrowedGPU || 0))) * 100, 100)}%` 
                }}
              ></div>
            </div>
          </div>
          {data.percentage && (
            <div className="bg-blue-50 px-2 py-1 rounded-sm border border-blue-200">
              <div className="flex justify-between items-center">
                <span className="text-xs text-blue-600">% of parent</span>
                <span className="text-xs font-bold text-blue-700">{data.percentage}</span>
              </div>
              {data.borrowedPercentage && data.borrowedGPU && data.borrowedGPU > 0.1 && (
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs" style={{ color: '#f59e0b' }}>+ borrowed</span>
                  <span className="text-xs font-bold" style={{ color: '#f59e0b' }}>+{data.borrowedPercentage}</span>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Handle id="bottom" type="source" position={Position.Bottom} style={{ background: '#6B7280' }} />
    </div>
  );
};

export default BusinessUnitNode;