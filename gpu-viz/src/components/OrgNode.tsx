import React from 'react';
import { Handle, Position } from 'reactflow';

interface OrgNodeProps {
  data: {
    name: string;
    allocatedGPU: number;
    percentage?: string;
    height?: number;
    hasChildren?: boolean;
    onCollapse?: () => void;
  };
}

const OrgNode: React.FC<OrgNodeProps> = ({ data }) => {
  return (
    <div 
      style={{
        backgroundColor: 'white',
        border: '1px solid #d1d5db',
        borderRadius: '2px',
        padding: '12px',
        minWidth: '160px',
        height: data.height || 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        fontSize: '11px'
      }}
    >
      <Handle type="target" position={Position.Top} style={{ background: '#6B7280' }} />
      
      {/* Header with collapse button */}
      <div style={{ 
        display: 'flex', 
        justifyContent: data.hasChildren ? 'space-between' : 'center', 
        alignItems: 'center',
        gap: '4px'
      }}>
        <div style={{ fontWeight: '600', color: '#1e40af', fontSize: '12px', textAlign: 'center', flex: 1 }}>
          {data.name}
        </div>
        {data.hasChildren && data.onCollapse && (
          <button
            onClick={data.onCollapse}
            style={{
              border: '1px solid #3b82f6',
              borderRadius: '2px',
              backgroundColor: 'white',
              padding: '1px 4px',
              fontSize: '10px',
              color: '#1e40af',
              cursor: 'pointer',
              fontWeight: '600',
              minWidth: '16px'
            }}
          >
            -
          </button>
        )}
      </div>
      
      {/* GPU allocation line */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#6b7280' }}>GPU:</span>
        <span style={{ fontWeight: '600', color: '#1e40af' }}>{data.allocatedGPU}</span>
      </div>
      
      {/* Parent percentage - compact */}
      {data.percentage && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          fontSize: '10px',
          color: '#1d4ed8',
          fontWeight: '500'
        }}>
          <span>{data.percentage} of cluster</span>
        </div>
      )}
      
      <Handle type="source" position={Position.Bottom} style={{ background: '#6B7280' }} />
    </div>
  );
};

export default OrgNode;