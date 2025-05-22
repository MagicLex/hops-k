# GPU Allocation Visualizer

## Project Purpose

A clean, technical visualization tool for GPU resource allocation across organizational hierarchies, inspired by Kubernetes Kueue scheduling principles. Built for exploring UX/UI patterns for Hopsworks GPU management.

## Architecture

**Hierarchical Structure:**
- **Root Cluster** → **Organizations** → **Business Units** → **Projects**
- Each level manages resource allocation and borrowing policies
- Projects represent Hopsworks instances requiring GPU resources

**Visual Design:**
- GitHub-style technical UI with 1px borders and minimal styling
- Color-coded background layers with descriptive statistics
- Compact cards with inline data and minimal vertical space usage
- Clean 90-degree connector lines without curves

## Key Features

- **Hierarchical GPU borrowing** - Business units can borrow unused GPU from other units with animated flow visualization
- **Real-time utilization tracking** - Visual progress bars showing current GPU usage vs allocation
- **Smart grouping system** - Collapse/expand any hierarchy level using "-" and "+" buttons based on parent-child relationships
- **Compact card design** - Inline borrowed amounts, single-line layouts, minimal space usage
- **Visual progress indicators** - Clean horizontal bars with technical styling for immediate insight
- **Borrowing transparency** - Orange-colored indicators show borrowed resources throughout hierarchy
- **Background layer statistics** - Each layer shows item count, allocated GPU, current usage, and descriptions
- **Scalable interface** - Designed to handle 100s or 1000s of projects through smart grouping
- **TypeScript** - Full type safety throughout the component hierarchy

## Technical Stack

- React + TypeScript
- ReactFlow for node/edge rendering
- Custom inline styles (no CSS frameworks)
- Local development only (no backend integration)

## Development Commands

```bash
npm start    # Start development server
npm build    # Build for production
```

## Current Implementation

**Data Structure:**
- Root cluster (100 GPU total)
- Organizations with allocated quotas (Development: 20%, Production: 80%)
- Business units within organizations (Analytics, Machine Learning)
- Projects with actual usage tracking and borrowing capabilities

**Visual Elements:**
- Compact cards with 4-line layout: name, GPU allocation, usage bar, parent percentage
- Inline borrowed GPU amounts (e.g., "25 +3.2") in orange
- Group cards with dashed borders for collapsed items
- Utilization progress bars with technical styling
- Animated borrowing edges with directional flow and percentage labels
- Background statistics showing "4 items • 80 GPU allocated • 67.2 GPU used • description"

**Grouping System:**
- Organizations can collapse to show business unit groups and project groups
- Business units can collapse to show project groups
- Group cards aggregate GPU data and show item counts
- Maintains hierarchy connections through collapse states

## Purpose Statement

This is a **UX/UI exploration prototype** for visualizing GPU allocation policies in hierarchical organizations. The goal is to make complex resource sharing policies immediately understandable through clean visual hierarchy, real-time utilization tracking, and scalable grouping for large-scale deployments.