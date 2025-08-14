import React, { useState } from 'react';
import TreeVisualization from '../TreeVisualization/TreeVisualization';
import type { TreeNode } from '../TreeVisualization/TreeVisualization';
import type {MontyType} from "../../logic/types"
import './MontyTreeTabs.css';

interface MontyTreeData {
  type: MontyType;
  title: string;
  description: string;
  treeData: TreeNode;
}

export default function MontyTreeTabs() {
  const [selectedMonty, setSelectedMonty] = useState<MontyType>('standard');

  // Define all tree variations
  const montyTrees: Record<MontyType, MontyTreeData> = {
    standard: {
      type: 'standard',
      title: 'Standard Monty Decision Tree',
      description: 'Classic Monty Hall - Monty always opens a door with a goat and knows where the prize is.',
      treeData: {
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
      }
    },
    evil: {
      type: 'evil',
      title: 'Evil Monty Decision Tree',
      description: 'Evil Monty - If you didn\'t pick the prize door, Monty opens it to make you lose!',
      treeData: {
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
                    id: 'monty-opens-car2',
                    label: 'Monty opens Door 2 (Car!)',
                    probability: '1/3',
                    isWin: false,
                    strategy: 'stay',
                    x: 300,
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
                    id: 'monty-opens-car3',
                    label: 'Monty opens Door 3 (Car!)',
                    probability: '1/3',
                    isWin: false,
                    strategy: 'stay',
                    x: 480,
                    y: 280
                  }
                ]
              }
            ]
          }
        ]
      }
    },
    secretive: {
      type: 'secretive',
      title: 'Secretive Monty Decision Tree',
      description: 'Secretive Monty - Monty never opens any door, making the switch decision purely psychological.',
      treeData: {
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
                    label: 'Switch (Random)',
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
                    label: 'Switch (50/50)',
                    probability: '1/6',
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
                    label: 'Switch (50/50)',
                    probability: '1/6',
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
      }
    }
  };

  const tabs = [
    { id: 'standard', label: 'Standard', description: 'Classic Monty Hall' },
    { id: 'evil', label: 'Evil', description: 'Opens prize door if possible' },
    { id: 'secretive', label: 'Secretive', description: 'Never opens doors' },
  ];

  const currentTree = montyTrees[selectedMonty];

  return (
    <div className="monty-tree-tabs">
      <div className="tab-controls">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setSelectedMonty(tab.id as MontyType)}
            className={`tab-button ${selectedMonty === tab.id ? 'active' : ''}`}
          >
            <div className="tab-label">{tab.label}</div>
            <div className="tab-description">{tab.description}</div>
          </button>
        ))}
      </div>

      <TreeVisualization
        title={currentTree.title}
        description={currentTree.description}
        treeData={currentTree.treeData}
        initialExpandedNodes={['root']}
        key={selectedMonty}
      />
    </div>
  );
}