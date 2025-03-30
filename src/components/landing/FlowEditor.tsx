'use client';

import { useCallback, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  NodeTypes,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  OnEdgesDelete,
  NodeDragHandler
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Maximize2, Minimize2 } from 'lucide-react';
import { Button } from '../components/ui/button';

import { useFlowStore } from '../hooks/useFlowStore';
import { Flow, FlowNode, FlowEdge } from '../types/flow';

// Custom node components
import TextNode from './nodes/TextNode';
import MultipleChoiceNode from './nodes/MultipleChoiceNode';
import CollectInfoNode from './nodes/CollectInfoNode';
import ConditionalNode from './nodes/ConditionalNode';
import EndNode from './nodes/EndNode';

// Define custom node types
const nodeTypes: NodeTypes = {
  text: TextNode,
  multipleChoice: MultipleChoiceNode,
  collectInfo: CollectInfoNode,
  conditional: ConditionalNode,
  end: EndNode
};

interface FlowEditorProps {
  flow: Flow;
}

export default function FlowEditor({ flow }: FlowEditorProps) {
  const { updateNode, addEdge: addFlowEdge, updateEdge, removeEdge } = useFlowStore();
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Initialize nodes and edges from flow
  const [nodes, setNodes, onNodesChange] = useNodesState(flow.nodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(flow.edges);
  
  // Handle edge connections
  const onConnect = useCallback(
    (connection: Connection) => {
      // Create a new edge
      const newEdge = {
        ...connection,
        id: `edge-${Date.now()}`,
      } as Edge;
      
      setEdges((eds) => addEdge(newEdge, eds));
      
      // Update flow store
      addFlowEdge(newEdge as unknown as FlowEdge);
    },
    [addFlowEdge]
  );
  
  // Handle node movement
  const onNodeDragStop = useCallback<NodeDragHandler>(
    (_, node) => {
      updateNode(node.id, { position: node.position });
    },
    [updateNode]
  );
  
  // Handle edge updates
  const onEdgeUpdate = useCallback(
    (oldEdge: Edge, newConnection: Connection) => {
      // Update edge in state
      setEdges((eds) => {
        const updatedEdges = eds.map((e) => 
          e.id === oldEdge.id ? { ...e, ...newConnection } : e
        ) as Edge[];
        return updatedEdges;
      });
      
      // Update in store
      updateEdge(oldEdge.id, newConnection as unknown as Partial<FlowEdge>);
    },
    [updateEdge]
  );
  
  // Handle edge removal
  const onEdgeDelete = useCallback<OnEdgesDelete>(
    (edgesToDelete) => {
      edgesToDelete.forEach(edge => {
        removeEdge(edge.id);
      });
    },
    [removeEdge]
  );
  
  // Toggle expanded view
  const toggleExpanded = useCallback(() => {
    setIsExpanded(prev => !prev);
  }, []);

  const flowEditorContent = (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      onNodeDragStop={onNodeDragStop}
      onEdgeUpdate={onEdgeUpdate}
      onEdgesDelete={onEdgeDelete}
      nodeTypes={nodeTypes}
      fitView
    >
      <Background />
      <Controls />
      <MiniMap />
    </ReactFlow>
  );
  
  if (isExpanded) {
    return (
      <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900 flex flex-col">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-bold">Edit Flow</h2>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleExpanded}
            className="hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
          >
            <Minimize2 className="h-5 w-5" />
            <span className="sr-only">Minimize</span>
          </Button>
        </div>
        <div className="flex-1">
          {flowEditorContent}
        </div>
      </div>
    );
  }
  
  return (
    <div style={{ width: '100%', height: '80vh' }} className="relative">
      <Button 
        variant="outline" 
        size="icon"
        onClick={toggleExpanded}
        className="absolute top-2 right-2 z-10 bg-white dark:bg-gray-800 shadow-md rounded-full"
      >
        <Maximize2 className="h-5 w-5" />
        <span className="sr-only">Expand</span>
      </Button>
      {flowEditorContent}
    </div>
  );
} 