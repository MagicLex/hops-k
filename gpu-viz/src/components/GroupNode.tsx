import React from 'react';
import { Handle, Position } from 'reactflow';

interface GroupNodeProps {
  data: {
    name: string;
    count: number;
    totalGPU: number;
    currentUsage: number;
    borrowedGPU?: number;
    height?: number;
    type: 'projects' | 'businessUnits' | 'organizations';
    onExpand: () => void;
  };
}

const GroupNode: React.FC<GroupNodeProps> = ({ data }) => {
  const totalGPU = data.totalGPU + (data.borrowedGPU || 0);
  const usagePercent = Math.min((data.currentUsage / totalGPU) * 100, 100);
  
  const getColors = () => {
    switch (data.type) {
      case 'projects':
        return { text: '#059669', bg: '#ecfdf5', border: '#10b981' };
      case 'businessUnits':
        return { text: '#1e40af', bg: '#eff6ff', border: '#3b82f6' };
      case 'organizations':
        return { text: '#1e40af', bg: '#eff6ff', border: '#3b82f6' };
      default:
        return { text: '#6b7280', bg: '#f9fafb', border: '#d1d5db' };
    }
  };
  
  const colors = getColors();
  
  return (
    <div 
      style={{
        backgroundColor: colors.bg,
        border: `2px dashed ${colors.border}`,
        borderRadius: '4px',
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
      <Handle type="source" position={Position.Bottom} style={{ background: '#6B7280' }} />
      
      {/* Header with expand button */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '4px'
      }}>
        <div style={{ fontWeight: '600', color: colors.text, fontSize: '12px' }}>
          {data.count} {data.type}
        </div>
        <button
          onClick={data.onExpand}
          style={{
            border: `1px solid ${colors.border}`,
            borderRadius: '2px',
            backgroundColor: 'white',
            padding: '2px 6px',
            fontSize: '12px',
            color: colors.text,
            cursor: 'pointer',
            fontWeight: '600'
          }}
        >
          +
        </button>
      </div>
      
      <div style={{ color: colors.text, fontSize: '10px', textAlign: 'center', fontStyle: 'italic' }}>
        {data.name}
      </div>
      
      {/* GPU allocation line */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: '#6b7280' }}>Total GPU:</span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <span style={{ fontWeight: '600', color: colors.text }}>{data.totalGPU}</span>
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
    </div>
  );
};

export default GroupNode;