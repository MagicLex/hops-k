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
    hasChildren?: boolean;
    onCollapse?: () => void;
  };
}

const BusinessUnitNode: React.FC<BusinessUnitNodeProps> = ({ data }) => {
  const totalGPU = data.allocatedGPU + (data.borrowedGPU || 0);
  const usagePercent = Math.min((data.currentUsage / totalGPU) * 100, 100);
  
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
      <Handle id="left" type="source" position={Position.Left} style={{ background: '#f59e0b', top: '50%' }} />
      <Handle id="left-target" type="target" position={Position.Left} style={{ background: '#f59e0b', top: '50%' }} />
      <Handle id="right" type="source" position={Position.Right} style={{ background: '#f59e0b', top: '50%' }} />
      <Handle id="right-target" type="target" position={Position.Right} style={{ background: '#f59e0b', top: '50%' }} />
      
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontWeight: '600', color: '#1e40af' }}>{data.allocatedGPU}</span>
          {data.borrowedGPU && data.borrowedGPU > 0.1 && (
            <span style={{ color: '#f59e0b', fontWeight: '600' }}>+{data.borrowedGPU.toFixed(1)}</span>
          )}
        </div>
      </div>
      
      {/* Usage line with progress bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3px' }}>
          <span style={{ color: '#6b7280' }}>Using:</span>
          <span style={{ fontWeight: '600', color: '#111827' }}>{data.currentUsage.toFixed(1)}</span>
        </div>
        <div style={{
          width: '100%',
          height: '8px',
          backgroundColor: '#e5e7eb',
          borderRadius: '1px',
          border: '1px solid #9ca3af',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${usagePercent}%`,
            height: '100%',
            backgroundColor: '#16a34a',
            borderRadius: '1px',
            position: 'absolute',
            top: '0',
            left: '0'
          }}></div>
        </div>
      </div>
      
      {/* Parent percentage - compact */}
      {data.percentage && (
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center',
          fontSize: '10px',
          color: '#1d4ed8',
          fontWeight: '500',
          gap: '4px'
        }}>
          <span>{data.percentage} of org</span>
          {data.borrowedPercentage && data.borrowedGPU && data.borrowedGPU > 0.1 && (
            <span style={{ color: '#f59e0b' }}>+{data.borrowedPercentage}</span>
          )}
        </div>
      )}
      
      <Handle id="bottom" type="source" position={Position.Bottom} style={{ background: '#6B7280' }} />
    </div>
  );
};

export default BusinessUnitNode;