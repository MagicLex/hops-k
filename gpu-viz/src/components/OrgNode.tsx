import React from 'react';
import { Handle, Position } from 'reactflow';

interface OrgNodeProps {
  data: {
    name: string;
    allocatedGPU: number;
    percentage?: string;
    height?: number;
  };
}

const OrgNode: React.FC<OrgNodeProps> = ({ data }) => {
  return (
    <div 
      className="bg-white border border-gray-300 rounded-sm shadow-sm p-3 min-w-44"
      style={{ 
        height: data.height || 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: '#6B7280' }} />
      <div className="text-center">
        <div className="font-semibold text-sm text-gray-900 mb-2">{data.name}</div>
        <div className="space-y-2">
          <div className="bg-gray-50 px-2 py-1 rounded-sm border">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">GPU</span>
              <span className="text-sm font-semibold text-gray-900">{data.allocatedGPU}</span>
            </div>
          </div>
          {data.percentage && (
            <div className="bg-blue-50 px-2 py-1 rounded-sm border border-blue-200">
              <div className="flex justify-between items-center">
                <span className="text-xs text-blue-600">% of parent</span>
                <span className="text-xs font-bold text-blue-700">{data.percentage}</span>
              </div>
            </div>
          )}
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} style={{ background: '#6B7280' }} />
    </div>
  );
};

export default OrgNode;