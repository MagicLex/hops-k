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
- Color-coded background layers to distinguish hierarchy levels
- Cards span full height of their respective background rows
- Clean 90-degree connector lines without curves

## Key Features

- **Hierarchical GPU borrowing** - Business units can borrow unused GPU from other units with animated flow visualization
- **Real-time utilization tracking** - Visual progress bars showing current GPU usage vs allocation
- **Smart positioning** - Projects drive layout positioning, parents auto-center above children
- **Visual progress indicators** - Clean horizontal bars with minimal styling for immediate insight
- **Borrowing transparency** - Orange-colored indicators show borrowed resources throughout hierarchy
- **Professional typography** - Clear information hierarchy with proper font weights and spacing
- **Equidistant layer spacing** - Consistent 220px spacing between all hierarchy levels
- **TypeScript** - Full type safety throughout the component hierarchy

## Technical Stack

- React + TypeScript
- ReactFlow for node/edge rendering
- Custom CSS utility classes (no frameworks)
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
- Utilization progress bars with technical styling (minimal border radius, clean borders)
- Animated borrowing edges with directional flow and percentage labels
- Color-coded hierarchy: blue for orgs/business units, green for projects, orange for borrowing
- Professional typography with proper visual weight distribution

## Purpose Statement

This is a **UX/UI exploration prototype** for visualizing GPU allocation policies in hierarchical organizations. The goal is to make complex resource sharing policies immediately understandable through clean visual hierarchy and real-time utilization tracking.