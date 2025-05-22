# GPU Allocation Visualizer

Clean technical visualization of GPU resource allocation across organizational hierarchies.

## Features

- **Hierarchical GPU Management**: Root Cluster → Organizations → Business Units → Projects
- **Real-time Utilization**: Visual progress bars showing current GPU usage vs allocation
- **GPU Borrowing**: Business units can borrow unused GPU from other units with animated flow indicators
- **Smart Grouping**: Collapse/expand any level of hierarchy with "-" and "+" buttons
- **Compact Design**: Minimal space usage with inline borrowed amounts and progress indicators

## Quick Start

```bash
npm install
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view.

## Usage

- Click **"-"** on any card to collapse its children into group cards
- Click **"+"** on group cards to expand back to individual items
- Orange indicators show borrowed GPU resources throughout the hierarchy

Perfect for exploring GPU allocation policies in organizations with 100s or 1000s of projects.