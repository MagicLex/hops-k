import React, { useState } from 'react';
import ReactFlow, { Node, Edge, Background, Controls, EdgeProps } from 'reactflow';
import 'reactflow/dist/style.css';

import RootNode from './components/RootNode';
import OrgNode from './components/OrgNode';
import BusinessUnitNode from './components/BusinessUnitNode';
import ProjectNode from './components/ProjectNode';
import GroupNode from './components/GroupNode';
import BackgroundLayer from './components/BackgroundLayer';
import { mockData } from './data';
import { Organization, BusinessUnit, Project, BorrowingRelation } from './types';

// Custom edge component for clean 90-degree connections
const CustomStepEdge: React.FC<EdgeProps> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
}) => {
  // Create a simple L-shaped path
  const midY = sourceY + (targetY - sourceY) / 2;
  const edgePath = `M ${sourceX} ${sourceY} L ${sourceX} ${midY} L ${targetX} ${midY} L ${targetX} ${targetY}`;

  return (
    <path
      id={id}
      d={edgePath}
      stroke="#d1d5db"
      strokeWidth={1}
      fill="none"
    />
  );
};

// Custom borrowing edge component for horizontal connections with animation
const BorrowingEdge: React.FC<EdgeProps & { data?: { borrowedAmount: number } }> = ({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  data,
}) => {
  const edgePath = `M ${sourceX} ${sourceY} L ${targetX} ${targetY}`;
  const midX = (sourceX + targetX) / 2;
  const midY = (sourceY + targetY) / 2;
  
  // Calculate direction for arrow
  const isLeftToRight = targetX > sourceX;
  const arrowSize = 6;
  const arrowX = isLeftToRight ? targetX - 10 : targetX + 10;
  const arrowPath = isLeftToRight 
    ? `M ${arrowX - arrowSize} ${targetY - arrowSize} L ${arrowX} ${targetY} L ${arrowX - arrowSize} ${targetY + arrowSize}`
    : `M ${arrowX + arrowSize} ${targetY - arrowSize} L ${arrowX} ${targetY} L ${arrowX + arrowSize} ${targetY + arrowSize}`;

  return (
    <g>
      <path
        id={id}
        d={edgePath}
        stroke="#f59e0b"
        strokeWidth={2}
        strokeDasharray="8,4"
        fill="none"
        style={{
          animation: `${isLeftToRight ? 'flowRight' : 'flowLeft'} 2s linear infinite`
        }}
      />
      {/* Arrow indicating direction */}
      <path
        d={arrowPath}
        stroke="#f59e0b"
        strokeWidth={2}
        fill="#f59e0b"
      />
      {data && (
        <g>
          <rect
            x={midX - 18}
            y={midY - 10}
            width={36}
            height={20}
            fill="white"
            stroke="#f59e0b"
            strokeWidth={1}
            rx={3}
          />
          <text
            x={midX}
            y={midY - 2}
            textAnchor="middle"
            fontSize={9}
            fill="#92400e"
            fontWeight="bold"
          >
            {data.borrowedAmount}%
          </text>
          <text
            x={midX}
            y={midY + 7}
            textAnchor="middle"
            fontSize={8}
            fill="#92400e"
          >
            GPU
          </text>
        </g>
      )}
      <style>{`
        @keyframes flowRight {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -12; }
        }
        @keyframes flowLeft {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 12; }
        }
      `}</style>
    </g>
  );
};

const nodeTypes = {
  root: RootNode,
  organization: OrgNode,
  businessUnit: BusinessUnitNode,
  project: ProjectNode,
  group: GroupNode,
  background: BackgroundLayer,
};

const edgeTypes = {
  customStep: CustomStepEdge,
  borrowing: BorrowingEdge,
};

function App() {
  const [collapsedGroups, setCollapsedGroups] = useState<{[key: string]: boolean}>({});
  
  const toggleGroup = (groupId: string) => {
    setCollapsedGroups(prev => ({ ...prev, [groupId]: !prev[groupId] }));
  };
  // Calculate total used GPU
  const totalUsedGPU = mockData.organizations.reduce((total: number, org: Organization) => {
    const orgTotal = org.projects.reduce((sum: number, proj: Project) => sum + proj.allocatedGPU, 0) +
                     org.businessUnits.reduce((sum: number, bu: BusinessUnit) => 
                       sum + bu.projects.reduce((projSum: number, proj: Project) => projSum + proj.allocatedGPU, 0), 0);
    return total + orgTotal;
  }, 0);

  // Static positioned nodes
  const nodes: Node[] = [];
  const edges: Edge[] = [];

  // Layout with edge overlap prevention
  const CARD_WIDTH = 200;
  const SPACING_X = 220; // Card width + gap
  const SPACING_Y = 200; // Vertical spacing
  const viewportWidth = 1200; // Assume reasonable viewport width

  // Calculate total projects for positioning (projects drive the layout)
  const totalProjects = mockData.organizations.reduce((total, org) => 
    total + org.projects.length + org.businessUnits.reduce((buTotal, bu) => buTotal + bu.projects.length, 0), 0);
  const projectsTotalWidth = totalProjects * SPACING_X;
  const projectsStartX = (viewportWidth / 2) - (projectsTotalWidth / 2);

  // Calculate project positions first (they drive everything)
  const projectPositions: { [key: string]: number } = {};
  let projectIndex = 0;
  
  mockData.organizations.forEach((org: Organization) => {
    org.projects.forEach((project: Project) => {
      projectPositions[project.id] = projectsStartX + projectIndex * SPACING_X;
      projectIndex++;
    });
    org.businessUnits.forEach((bu: BusinessUnit) => {
      bu.projects.forEach((project: Project) => {
        projectPositions[project.id] = projectsStartX + projectIndex * SPACING_X;
        projectIndex++;
      });
    });
  });

  // Calculate business unit positions (centered above their projects)
  const buPositions: { [key: string]: number } = {};
  mockData.organizations.forEach((org: Organization) => {
    org.businessUnits.forEach((bu: BusinessUnit) => {
      if (bu.projects.length > 0) {
        const buProjectXs = bu.projects.map(p => projectPositions[p.id]);
        const minX = Math.min(...buProjectXs);
        const maxX = Math.max(...buProjectXs);
        buPositions[bu.id] = (minX + maxX) / 2;
      }
    });
  });

  // Calculate organization positions (centered above their children)
  const orgPositions: number[] = [];
  mockData.organizations.forEach((org: Organization) => {
    const childXs: number[] = [];
    
    // Add direct project positions
    org.projects.forEach(p => childXs.push(projectPositions[p.id]));
    
    // Add business unit positions
    org.businessUnits.forEach(bu => {
      if (buPositions[bu.id] !== undefined) {
        childXs.push(buPositions[bu.id]);
      }
    });
    
    if (childXs.length > 0) {
      const minX = Math.min(...childXs);
      const maxX = Math.max(...childXs);
      orgPositions.push((minX + maxX) / 2);
    } else {
      orgPositions.push(0); // Fallback
    }
  });

  // Calculate root position (centered above all organizations)
  const rootX = orgPositions.length > 0 ? 
    (Math.min(...orgPositions) + Math.max(...orgPositions)) / 2 : 
    (viewportWidth / 2) - (CARD_WIDTH / 2);

  // Calculate background width to cover all content
  const backgroundWidth = Math.max(projectsTotalWidth, Math.max(...orgPositions) - Math.min(...orgPositions) + CARD_WIDTH) + 160;
  const backgroundStartX = (viewportWidth / 2) - (backgroundWidth / 2) - 100; // Offset backgrounds to the left
  
  // Calculate stats for each layer
  const orgCount = mockData.organizations.length;
  const orgTotalGPU = mockData.organizations.reduce((sum, org) => sum + org.allocatedGPU, 0);
  const orgUsedGPU = mockData.organizations.reduce((sum, org) => {
    const orgUsed = org.projects.reduce((projSum, proj) => projSum + proj.currentUsage, 0) +
                   org.businessUnits.reduce((buSum, bu) => 
                     buSum + bu.projects.reduce((projSum, proj) => projSum + proj.currentUsage, 0), 0);
    return sum + orgUsed;
  }, 0);
  
  const buCount = mockData.organizations.reduce((sum, org) => sum + org.businessUnits.length, 0);
  const buTotalGPU = mockData.organizations.reduce((sum, org) => 
    sum + org.businessUnits.reduce((buSum, bu) => buSum + bu.allocatedGPU, 0), 0);
  const buUsedGPU = mockData.organizations.reduce((sum, org) => 
    sum + org.businessUnits.reduce((buSum, bu) => 
      buSum + bu.projects.reduce((projSum, proj) => projSum + proj.currentUsage, 0), 0), 0);
  
  const projectCount = totalProjects;
  const projectTotalGPU = mockData.organizations.reduce((sum, org) => {
    const orgProjects = org.projects.reduce((projSum, proj) => projSum + proj.allocatedGPU, 0) +
                       org.businessUnits.reduce((buSum, bu) => 
                         buSum + bu.projects.reduce((projSum, proj) => projSum + proj.allocatedGPU, 0), 0);
    return sum + orgProjects;
  }, 0);
  const projectUsedGPU = mockData.organizations.reduce((sum, org) => {
    const orgUsed = org.projects.reduce((projSum, proj) => projSum + proj.currentUsage, 0) +
                   org.businessUnits.reduce((buSum, bu) => 
                     buSum + bu.projects.reduce((projSum, proj) => projSum + proj.currentUsage, 0), 0);
    return sum + orgUsed;
  }, 0);

  // Add background layers for each row with consistent spacing
  const LAYER_SPACING = SPACING_Y + 20; // Add extra spacing between layers
  const BACKGROUND_GAP = 10; // Gap between background layers
  const backgroundLayers = [
    {
      id: 'bg-root',
      type: 'background',
      position: { x: backgroundStartX, y: 30 },
      data: { 
        label: 'Root Cluster',
        width: backgroundWidth,
        height: 180,
        color: '#f8fafc',
        stats: {
          count: 1,
          totalGPU: mockData.totalGPU,
          usedGPU: totalUsedGPU,
          description: 'Physical GPU cluster providing compute resources'
        }
      },
      zIndex: -4
    },
    {
      id: 'bg-orgs',
      type: 'background', 
      position: { x: backgroundStartX, y: 30 + LAYER_SPACING + BACKGROUND_GAP },
      data: {
        label: 'Organizations',
        width: backgroundWidth,
        height: 180,
        color: '#f1f5f9',
        stats: {
          count: orgCount,
          totalGPU: orgTotalGPU,
          usedGPU: orgUsedGPU,
          description: 'Organizational divisions with quota allocations'
        }
      },
      zIndex: -3
    },
    {
      id: 'bg-business-units',
      type: 'background',
      position: { x: backgroundStartX, y: 30 + (LAYER_SPACING + BACKGROUND_GAP) * 2 },
      data: {
        label: 'Business Units',
        width: backgroundWidth,
        height: 180,
        color: '#f1f5f9',
        stats: {
          count: buCount,
          totalGPU: buTotalGPU,
          usedGPU: buUsedGPU,
          description: 'Functional teams managing project resources'
        }
      },
      zIndex: -2
    },
    {
      id: 'bg-projects',
      type: 'background',
      position: { x: backgroundStartX, y: 30 + (LAYER_SPACING + BACKGROUND_GAP) * 3 },
      data: {
        label: 'Projects',
        width: backgroundWidth,
        height: 180,
        color: '#ecfdf5',
        stats: {
          count: projectCount,
          totalGPU: projectTotalGPU,
          usedGPU: projectUsedGPU,
          description: 'Individual workloads consuming GPU resources'
        }
      },
      zIndex: -1
    }
  ];

  // Add background layers to nodes (they render behind other nodes)
  nodes.push(...backgroundLayers);

  // Root node - spans full height of background
  nodes.push({
    id: mockData.id,
    type: 'root',
    position: { x: rootX, y: 50 },
    data: {
      name: mockData.name,
      totalGPU: mockData.totalGPU,
      usedGPU: totalUsedGPU,
      height: 150 // Fit within background height
    }
  });

  // Organizations row
  mockData.organizations.forEach((org: Organization, orgIndex: number) => {
    const orgX = orgPositions[orgIndex];
    const orgY = 50 + LAYER_SPACING + BACKGROUND_GAP;
    const orgPercentage = ((org.allocatedGPU / mockData.totalGPU) * 100).toFixed(1);
    const hasChildren = org.businessUnits.length > 0 || org.projects.length > 0;

    nodes.push({
      id: org.id,
      type: 'organization',
      position: { x: orgX, y: orgY },
      data: {
        name: org.name,
        allocatedGPU: org.allocatedGPU,
        percentage: `${orgPercentage}%`,
        height: 150,
        hasChildren,
        onCollapse: hasChildren ? () => toggleGroup(org.id) : undefined
      }
    });

    edges.push({
      id: `${mockData.id}-${org.id}`,
      source: mockData.id,
      target: org.id,
      type: 'customStep'
    });
  });

  // Business Units row (positioned above their projects) - only if org not collapsed
  mockData.organizations.forEach((org: Organization, orgIndex: number) => {
    if (collapsedGroups[org.id]) {
      // Show collapsed group instead of individual business units (only if org has business units)
      if (org.businessUnits.length > 0) {
        const orgX = orgPositions[orgIndex];
        const groupY = 50 + (LAYER_SPACING + BACKGROUND_GAP) * 2;
        
        const totalBUGPU = org.businessUnits.reduce((sum, bu) => sum + bu.allocatedGPU, 0);
        const totalBUUsage = org.businessUnits.reduce((sum, bu) => 
          sum + bu.projects.reduce((projSum, proj) => projSum + proj.currentUsage, 0), 0);
        
        nodes.push({
          id: `${org.id}-collapsed`,
          type: 'group',
          position: { x: orgX, y: groupY },
          data: {
            name: `${org.name} Business Units`,
            count: org.businessUnits.length,
            totalGPU: totalBUGPU,
            currentUsage: totalBUUsage,
            height: 150,
            type: 'businessUnits' as const,
            onExpand: () => toggleGroup(org.id)
          }
        });
        
        edges.push({
          id: `${org.id}-${org.id}-collapsed`,
          source: org.id,
          target: `${org.id}-collapsed`,
          type: 'customStep'
        });
      }
      
      return; // Skip individual business units
    }
    
    org.businessUnits.forEach((bu: BusinessUnit) => {
      if (buPositions[bu.id] !== undefined) {
        const buX = buPositions[bu.id];
        const buY = 50 + (LAYER_SPACING + BACKGROUND_GAP) * 2;
        const buPercentage = ((bu.allocatedGPU / org.allocatedGPU) * 100).toFixed(1);
        const hasChildren = bu.projects.length > 0;
        
        // Calculate borrowed GPU amount (only for borrowers, not lenders)
        let borrowedGPU = 0;
        let borrowedPercentageNum = 0;
        
        if (org.borrowingRelations) {
          org.borrowingRelations.forEach((borrowing) => {
            if (borrowing.toId === bu.id) {
              // This business unit is borrowing GPU
              const lenderBU = org.businessUnits.find(lender => lender.id === borrowing.fromId);
              if (lenderBU) {
                borrowedGPU = (borrowing.borrowedAmount / 100) * lenderBU.allocatedGPU;
                borrowedPercentageNum = (borrowedGPU / org.allocatedGPU) * 100;
              }
            }
            // Don't show anything for the lending side (fromId === bu.id)
          });
        }

        // Calculate current usage from projects
        const buCurrentUsage = bu.projects.reduce((sum, project) => sum + project.currentUsage, 0);

        const nodeData: any = {
          name: bu.name,
          allocatedGPU: bu.allocatedGPU,
          currentUsage: buCurrentUsage,
          percentage: `${buPercentage}%`,
          height: 150,
          hasChildren,
          onCollapse: hasChildren ? () => toggleGroup(bu.id) : undefined
        };

        // Only add borrowed data if there's actual borrowing
        if (borrowedGPU > 0.1) {
          nodeData.borrowedGPU = borrowedGPU;
          nodeData.borrowedPercentage = `${borrowedPercentageNum.toFixed(1)}%`;
        }

        nodes.push({
          id: bu.id,
          type: 'businessUnit',
          position: { x: buX, y: buY },
          data: nodeData
        });

        edges.push({
          id: `${org.id}-${bu.id}`,
          source: org.id,
          target: bu.id,
          type: 'customStep'
        });
      }
    });
  });

  // Add borrowing edges between business units
  mockData.organizations.forEach((org: Organization) => {
    if (org.borrowingRelations) {
      org.borrowingRelations.forEach((borrowing: BorrowingRelation) => {
        const fromPos = buPositions[borrowing.fromId];
        const toPos = buPositions[borrowing.toId];
        
        if (fromPos !== undefined && toPos !== undefined) {
          // Determine which handle to use based on position
          const sourceHandle = fromPos < toPos ? 'right' : 'left';
          const targetHandle = fromPos < toPos ? 'left-target' : 'right-target';
          
          edges.push({
            id: `borrowing-${borrowing.fromId}-${borrowing.toId}`,
            source: borrowing.fromId,
            target: borrowing.toId,
            sourceHandle: sourceHandle,
            targetHandle: targetHandle,
            type: 'borrowing',
            data: { borrowedAmount: borrowing.borrowedAmount },
            style: { zIndex: 10 } // Ensure borrowing edges appear above other elements
          });
        }
      });
    }
  });

  // Projects row - use pre-calculated positions
  const projectY = 50 + (LAYER_SPACING + BACKGROUND_GAP) * 3;
  
  mockData.organizations.forEach((org: Organization, orgIndex: number) => {
    // Direct projects under organization - only if org is not collapsed
    if (!collapsedGroups[org.id]) {
      org.projects.forEach((project: Project) => {
        const projX = projectPositions[project.id];
        const projectPercentage = ((project.allocatedGPU / org.allocatedGPU) * 100).toFixed(1);

        nodes.push({
          id: project.id,
          type: 'project',
          position: { x: projX, y: projectY },
          data: {
            name: project.name,
            allocatedGPU: project.allocatedGPU,
            currentUsage: project.currentUsage,
            percentage: `${projectPercentage}%`,
            height: 150
          }
        });

        edges.push({
          id: `${org.id}-${project.id}`,
          source: org.id,
          target: project.id,
          type: 'customStep'
        });
      });
    }

    // Projects from business units - handle collapsed states
    if (collapsedGroups[org.id]) {
      // If org is collapsed, show projects grouped under the collapsed org node
      const allOrgProjects = [...org.projects, ...org.businessUnits.flatMap(bu => bu.projects)];
      if (allOrgProjects.length > 0) {
        const firstProjectX = projectPositions[allOrgProjects[0].id];
        const totalProjectGPU = allOrgProjects.reduce((sum, proj) => sum + proj.allocatedGPU, 0);
        const totalProjectUsage = allOrgProjects.reduce((sum, proj) => sum + proj.currentUsage, 0);
        
        nodes.push({
          id: `${org.id}-projects-collapsed`,
          type: 'group',
          position: { x: firstProjectX, y: projectY },
          data: {
            name: `${org.name} Projects`,
            count: allOrgProjects.length,
            totalGPU: totalProjectGPU,
            currentUsage: totalProjectUsage,
            height: 150,
            type: 'projects' as const,
            onExpand: () => toggleGroup(org.id)
          }
        });
        
        // Connect to the right parent - either collapsed BU group or directly to org
        const sourceId = org.businessUnits.length > 0 ? `${org.id}-collapsed` : org.id;
        edges.push({
          id: `${sourceId}-${org.id}-projects-collapsed`,
          source: sourceId,
          target: `${org.id}-projects-collapsed`,
          type: 'customStep'
        });
      }
    } else {
      // Show individual business unit projects
      org.businessUnits.forEach((bu: BusinessUnit) => {
        if (collapsedGroups[bu.id] && bu.projects.length > 0) {
          // Show collapsed projects for this business unit
          const firstProjectX = projectPositions[bu.projects[0].id];
          const totalProjectGPU = bu.projects.reduce((sum, proj) => sum + proj.allocatedGPU, 0);
          const totalProjectUsage = bu.projects.reduce((sum, proj) => sum + proj.currentUsage, 0);
          
          nodes.push({
            id: `${bu.id}-projects-collapsed`,
            type: 'group',
            position: { x: firstProjectX, y: projectY },
            data: {
              name: `${bu.name} Projects`,
              count: bu.projects.length,
              totalGPU: totalProjectGPU,
              currentUsage: totalProjectUsage,
              height: 150,
              type: 'projects' as const,
              onExpand: () => toggleGroup(bu.id)
            }
          });
          
          edges.push({
            id: `${bu.id}-${bu.id}-projects-collapsed`,
            source: bu.id,
            target: `${bu.id}-projects-collapsed`,
            type: 'customStep'
          });
        } else {
          // Show individual projects
          // Check if this business unit is borrowing GPU (not lending)
          let buBorrowedGPU = 0;
          if (org.borrowingRelations) {
            org.borrowingRelations.forEach((borrowing) => {
              if (borrowing.toId === bu.id) {
                const lenderBU = org.businessUnits.find(lender => lender.id === borrowing.fromId);
                if (lenderBU) {
                  buBorrowedGPU = (borrowing.borrowedAmount / 100) * lenderBU.allocatedGPU;
                }
              }
              // Don't calculate for lending business units (fromId === bu.id)
            });
          }

          const buTotalGPU = bu.allocatedGPU + buBorrowedGPU;

          bu.projects.forEach((project: Project) => {
            const projX = projectPositions[project.id];
            const projectPercentage = ((project.allocatedGPU / bu.allocatedGPU) * 100).toFixed(1);
            
            // Calculate borrowed GPU usage for this project (proportional to its allocation)
            let projectBorrowedGPU = 0;
            let projectBorrowedPercentage = '';
            if (buBorrowedGPU > 0) {
              projectBorrowedGPU = (project.allocatedGPU / bu.allocatedGPU) * buBorrowedGPU;
              const borrowedPercentageNum = ((projectBorrowedGPU / buTotalGPU) * 100);
              projectBorrowedPercentage = `${borrowedPercentageNum.toFixed(1)}%`;
            }

            const projectData: any = {
              name: project.name,
              allocatedGPU: project.allocatedGPU,
              currentUsage: project.currentUsage,
              percentage: `${projectPercentage}%`,
              height: 150
            };

            // Only add borrowed data if there's actual borrowing
            if (projectBorrowedGPU > 0.1) {
              projectData.borrowedGPU = projectBorrowedGPU;
              projectData.borrowedPercentage = projectBorrowedPercentage;
            }

            nodes.push({
              id: project.id,
              type: 'project',
              position: { x: projX, y: projectY },
              data: projectData
            });

            edges.push({
              id: `${bu.id}-${project.id}`,
              source: bu.id,
              target: project.id,
              sourceHandle: 'bottom', // Use bottom handle for hierarchical connections
              type: 'customStep'
            });
          });
        }
      });
    }
  });

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        attributionPosition="bottom-left"
      >
        <Background color="#f3f4f6" />
        <Controls />
      </ReactFlow>
    </div>
  );
}

export default App;