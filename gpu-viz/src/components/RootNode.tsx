import React from 'react';
import { Handle, Position } from 'reactflow';

interface RootNodeProps {
  data: {
    name: string;
    totalGPU: number;
    usedGPU: number;
    height?: number;
  };
}

const RootNode: React.FC<RootNodeProps> = ({ data }) => {
  return (
    <div 
      className="bg-white border border-gray-300 rounded-sm shadow-sm p-4 min-w-52"
      style={{ 
        height: data.height || 'auto',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <div className="text-center">
        <div className="font-semibold text-sm text-gray-900 mb-2">{data.name}</div>
        <div className="space-y-2">
          {/* Main GPU stats */}
          <div className="text-xs text-gray-500 space-y-1">
            <div className="flex justify-between">
              <span>Total:</span>
              <span className="font-medium text-gray-900">{data.totalGPU} GPU</span>
            </div>
            <div className="flex justify-between">
              <span>Used:</span>
              <span className="font-medium text-gray-900">{data.usedGPU} GPU</span>
            </div>
            <div className="flex justify-between">
              <span>Available:</span>
              <span className="font-medium text-gray-700">{data.totalGPU - data.usedGPU} GPU</span>
            </div>
          </div>
          
          {/* Divider line */}
          <div style={{ 
            width: '100%', 
            height: '1px', 
            backgroundColor: '#d1d5db', 
            margin: '12px 0 8px 0' 
          }}></div>
          
          {/* Utilization visualization */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-500">Utilization</span>
              <span className="font-semibold text-gray-900">{((data.usedGPU / data.totalGPU) * 100).toFixed(1)}%</span>
            </div>
            <div 
              style={{ 
                width: '100%',
                height: '12px',
                backgroundColor: '#e5e7eb',
                borderRadius: '2px',
                border: '1px solid #9ca3af',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div 
                style={{ 
                  width: `${(data.usedGPU / data.totalGPU) * 100}%`,
                  height: '100%',
                  backgroundColor: '#16a34a',
                  borderRadius: '1px',
                  position: 'absolute',
                  top: '0',
                  left: '0'
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
      <Handle type="source" position={Position.Bottom} style={{ background: '#6B7280' }} />
    </div>
  );
};

export default RootNode;