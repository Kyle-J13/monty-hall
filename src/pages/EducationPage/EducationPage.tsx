// src/pages/EducationPage.tsx
import React, { useState } from 'react';
import './EducationPage.css';

interface TreeNode {
  id: string;
  label: string;
  probability: string;
  children?: TreeNode[];
  isWin?: boolean;
  strategy?: 'stay' | 'switch';
  x?: number;
  y?: number;
}

export default function EducationPage() {
  const [selectedPath, setSelectedPath] = useState<string[]>([]);
  const [showProbabilities, setShowProbabilities] = useState(true);
  const [expandedNodes, setExpandedNodes] = useState<string[]>(['root']);

  // Tree structure for Monty Hall problem with positioning
  const montyHallTree: TreeNode = {
    id: 'root',
    label: 'Start Game',
    probability: '',
    x: 300,
    y: 40,
    children: [
      {
        id: 'car-door1',
        label: 'Car behind Door 1',
        probability: '1/3',
        x: 120,
        y: 120,
        children: [
          {
            id: 'pick-door1-car1',
            label: 'You pick Door 1',
            probability: '1/3',
            x: 120,
            y: 200,
            children: [
              {
                id: 'stay-car1',
                label: 'Stay',
                probability: '1/3',
                isWin: true,
                strategy: 'stay',
                x: 80,
                y: 280
              },
              {
                id: 'switch-car1',
                label: 'Switch',
                probability: '0',
                isWin: false,
                strategy: 'switch',
                x: 160,
                y: 280
              }
            ]
          }
        ]
      },
      {
        id: 'car-door2',
        label: 'Car behind Door 2',
        probability: '1/3',
        x: 300,
        y: 120,
        children: [
          {
            id: 'pick-door1-car2',
            label: 'You pick Door 1',
            probability: '1/3',
            x: 300,
            y: 200,
            children: [
              {
                id: 'stay-car2',
                label: 'Stay',
                probability: '0',
                isWin: false,
                strategy: 'stay',
                x: 260,
                y: 280
              },
              {
                id: 'switch-car2',
                label: 'Switch',
                probability: '1/3',
                isWin: true,
                strategy: 'switch',
                x: 340,
                y: 280
              }
            ]
          }
        ]
      },
      {
        id: 'car-door3',
        label: 'Car behind Door 3',
        probability: '1/3',
        x: 480,
        y: 120,
        children: [
          {
            id: 'pick-door1-car3',
            label: 'You pick Door 1',
            probability: '1/3',
            x: 480,
            y: 200,
            children: [
              {
                id: 'stay-car3',
                label: 'Stay',
                probability: '0',
                isWin: false,
                strategy: 'stay',
                x: 440,
                y: 280
              },
              {
                id: 'switch-car3',
                label: 'Switch',
                probability: '1/3',
                isWin: true,
                strategy: 'switch',
                x: 520,
                y: 280
              }
            ]
          }
        ]
      }
    ]
  };

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
    setExpandedNodes(['root']);
    setSelectedPath([]);
  };

  const expandAll = () => {
    const allNodeIds = ['root', 'car-door1', 'car-door2', 'car-door3', 
                       'pick-door1-car1', 'pick-door1-car2', 'pick-door1-car3'];
    setExpandedNodes(allNodeIds);
  };

  const calculateWinRates = () => {
    const stayWins = 1;
    const switchWins = 2;
    const total = 3;
    
    return {
      stay: (stayWins / total * 100).toFixed(1),
      switch: (switchWins / total * 100).toFixed(1)
    };
  };

  const winRates = calculateWinRates();

  // Dynamic SVG height based on tree depth
  const allNodes = getAllNodes(montyHallTree);
  const maxY = Math.max(...allNodes.map(n => n.y || 0)) + 60; // padding
  const svgHeight = Math.max(maxY, 320);

  return (
    <>
      <div className="education-container">
        <div className='educationDiv'>
          <h1 id='educationTitle'>Education</h1>
          <p>This section provides an intuitive and mathematical explanation of the Monty Hall problem, plus interactive visualizations.</p>
          
          <h3>Background</h3>
          <p>The Monty Hall problem is a brain teaser based on the American television game show <i>Let's Make a Deal</i>. The 
          brain teaser goes as so:</p>
          
          <h3>How it Works</h3>
          <p>
            You are on a game show where there are 3 doors in front of you. Behind one door is a prize (say a car), 
            and behind the other doors are non-prizes (say a goat). Now, say you choose door 1. Monty the game show host (who knows what 
            is behind each door) then opens one of the doors that has a goat behind it. You are then are asked if you want to stay with 
            the door you initially picked, or switch your choice. Do you switch or do you stay?
          </p>
            
          <h3>Answer/Explanation</h3>
          <p>You switch!</p>
          <p>
              Switching gives you a 2/3 chance of winning, whereas staying with your initial choice gives 
              you a 1/3 chance. 
          </p>
          <p>
            The reason for this is because Monty actually knows which door has the prize, and therefore makes a strategic 
            choice to avoid opening the door with the prize in it. As a result, if you initially picked a goat (2/3 chance), the 
            prize has to be behind the door that Monty did not open. 
          </p>

          <h3>Mathematical Explanation (Bayes' Theorem)</h3>
          <p>C1 = prize is behind your initial pick</p>
          <p>C2 = prize is behind the other unopened door</p>
          <p>M = Monty opens a door showing a non-prize</p>

          <p>
            P(C1|M) = (P(M|C1)P(C1)) / P(M)
          </p>

          <p>
            P(C2|M) = (P(M|C2)P(C2)) / P(M)
          </p>
          
          <p>
            P(C1|M) = 1/3<br/>
            P(C2|M) = 2/3
          </p>
        </div>

        <div className='resourcesDiv'>
          <h1 id='resourcesTitle'>Technical Resources</h1>
          <p>This section provides links to resources that are helpful for understanding the stack that was used for creating this website.</p>

          <a href='https://reactjs.org/docs/getting-started.html'>
            <h3>React Docs</h3>
          </a>

          <a href='https://supabase.com/docs'>
            <h3>Supabase Documentation</h3>
          </a>
        </div>
      </div>

      <div className="tree-visualization-section">
        <h1>Classic Monty Decision Tree</h1>
        <p>
          Click on the nodes below to explore all possible scenarios. The tree shows what happens in each case when you 
          assume you always pick Door 1 initially.
        </p>
        
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
            {getConnectionLines(montyHallTree).map((line, index) => (
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
              <strong>Stay Strategy:</strong> {winRates.stay}% win rate (1 out of 3 scenarios)
            </div>
            <div className="rate-item switch-rate">
              <strong>Switch Strategy:</strong> {winRates.switch}% win rate (2 out of 3 scenarios)
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
