// src/components/TreeVisualization.tsx
import React, { useState } from 'react';
import './TreeVisualization.css';

export interface TreeNode {
  id: string;
  label: string;
  probability: string;
  children?: TreeNode[];
  isWin?: boolean;
  strategy?: 'stay' | 'switch';
  x?: number;
  y?: number;
}

interface TreeVisualizationProps {
  title: string;
  description: string;
  treeData: TreeNode;
  initialExpandedNodes?: string[];
  className?: string;
}

export default function TreeVisualization({ 
  title, 
  description, 
  treeData, 
  initialExpandedNodes = ['root'],
  className = ''
}: TreeVisualizationProps) {
  const [selectedPath, setSelectedPath] = useState<string[]>([]);
  const [showProbabilities, setShowProbabilities] = useState(true);
  const [expandedNodes, setExpandedNodes] = useState<string[]>(initialExpandedNodes);

  const getConnectionLines = (node: TreeNode): Array<{from: {x: number, y: number}, to: {x: number, y: number}}> => {
    const lines: Array<{from: {x: number, y: number}, to: {x: number, y: number}}> = [];
    
    if (node.children && expandedNodes.includes(node.id)) {
      node.children.forEach(child => {
        const nodeX = node.x || 0;
        const nodeY = node.y || 0;
        const childX = child.x || 0;
        const childY = child.y || 0;
        
        lines.push({
          from: { x: nodeX, y: nodeY + 20 },
          to: { x: childX, y: childY - 10 }
        });
        
        lines.push(...getConnectionLines(child));
      });
    }
    
    return lines;
  };

  const getAllNodes = (node: TreeNode): TreeNode[] => {
    let nodes = [node];
    if (node.children && expandedNodes.includes(node.id)) {
      node.children.forEach(child => {
        nodes.push(...getAllNodes(child));
      });
    }
    return nodes;
  };

  const toggleNodeExpansion = (nodeId: string) => {
    if (expandedNodes.includes(nodeId)) {
      setExpandedNodes(expandedNodes.filter(id => id !== nodeId));
    } else {
      setExpandedNodes([...expandedNodes, nodeId]);
    }
  };

  const resetTree = () => {
    setExpandedNodes(initialExpandedNodes);
    setSelectedPath([]);
  };

  const getAllNodeIds = (node: TreeNode): string[] => {
    let nodeIds = [node.id];
    if (node.children) {
      node.children.forEach(child => {
        nodeIds.push(...getAllNodeIds(child));
      });
    }
    return nodeIds;
  };

  const expandAll = () => {
    const allNodeIds = getAllNodeIds(treeData);
    setExpandedNodes(allNodeIds);
  };

  const calculateWinRates = () => {
    const getLeafNodes = (node: TreeNode): TreeNode[] => {
      if (!node.children || node.children.length === 0) {
        return [node];
      }
      let leafNodes: TreeNode[] = [];
      node.children.forEach(child => {
        leafNodes.push(...getLeafNodes(child));
      });
      return leafNodes;
    };

    const leafNodes = getLeafNodes(treeData);
    const stayWins = leafNodes.filter(n => n.strategy === 'stay' && n.isWin).length;
    const switchWins = leafNodes.filter(n => n.strategy === 'switch' && n.isWin).length;
    const stayTotal = leafNodes.filter(n => n.strategy === 'stay').length;
    const switchTotal = leafNodes.filter(n => n.strategy === 'switch').length;
    
    return {
      stay: stayTotal > 0 ? (stayWins / stayTotal * 100).toFixed(1) : '0.0',
      switch: switchTotal > 0 ? (switchWins / switchTotal * 100).toFixed(1) : '0.0'
    };
  };

  const winRates = calculateWinRates();
  const allNodes = getAllNodes(treeData);
  const maxY = Math.max(...allNodes.map(n => n.y || 0)) + 60;
  const svgHeight = Math.max(maxY, 320);

  return (
    <div className={`tree-visualization-section ${className}`}>
      <h1>{title}</h1>
      <p>{description}</p>
      
      <div className="tree-controls">
        <button onClick={resetTree} className="control-btn">Reset Tree</button>
        <button onClick={expandAll} className="control-btn">Expand All</button>
        <button 
          onClick={() => setShowProbabilities(!showProbabilities)} 
          className="control-btn"
        >
          {showProbabilities ? 'Hide' : 'Show'} Probabilities
        </button>
      </div>

      <div className="tree-visualization">
        <svg width="100%" height={svgHeight} viewBox={`0 0 600 ${svgHeight}`}>
          {/* Draw connection lines */}
          {getConnectionLines(treeData).map((line, index) => (
            <line
              key={index}
              x1={line.from.x}
              y1={line.from.y}
              x2={line.to.x}
              y2={line.to.y}
              stroke="#FFFFFF"
              strokeWidth="2"
              className="tree-connection"
            />
          ))}
          
          {/* Draw nodes */}
          {allNodes.map(node => {
            const nodeX = node.x || 0;
            const nodeY = node.y || 0;
            
            return (
              <g key={node.id}>
                <circle
                  cx={nodeX}
                  cy={nodeY}
                  r="20"
                  className={`tree-node-circle ${
                    node.isWin === true ? 'win-node' : 
                    node.isWin === false ? 'lose-node' : 
                    'neutral-node'
                  } ${expandedNodes.includes(node.id) ? 'expanded' : ''}`}
                  onClick={() => toggleNodeExpansion(node.id)}
                />
                
                {node.children && (
                  <text
                    x={nodeX}
                    y={nodeY + 5}
                    textAnchor="middle"
                    className="expand-indicator"
                    onClick={() => toggleNodeExpansion(node.id)}
                  >
                    {expandedNodes.includes(node.id) ? '−' : '+'}
                  </text>
                )}
                
                <text
                  x={nodeX}
                  y={nodeY - 30}
                  textAnchor="middle"
                  className="node-label"
                >
                  {node.label}
                </text>
                
                {showProbabilities && node.probability && (
                  <text
                    x={nodeX}
                    y={nodeY + 40}
                    textAnchor="middle"
                    className="node-probability"
                  >
                    ({node.probability})
                  </text>
                )}
                
                {node.isWin !== undefined && (
                  <text
                    x={nodeX}
                    y={nodeY + (showProbabilities && node.probability ? 55 : 40)}
                    textAnchor="middle"
                    className={`outcome-text ${node.isWin ? 'win-text' : 'lose-text'}`}
                  >
                    {node.isWin ? 'WIN!' : 'LOSE'}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      <div className="win-rates">
        <h4>Overall Win Rates:</h4>
        <div className="rate-comparison">
          <div className="rate-item stay-rate">
            <strong>Stay Strategy:</strong> {winRates.stay}% win rate
          </div>
          <div className="rate-item switch-rate">
            <strong>Switch Strategy:</strong> {winRates.switch}% win rate
          </div>
        </div>
      </div>
    </div>
  );
}