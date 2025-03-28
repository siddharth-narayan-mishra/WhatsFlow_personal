'use client'
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from '@/components/ui/button';
import ContextMenu from '@/lib/flow/ContextMenu';
import { nodeTypes,edgeTypes, ReactFlowContextMenuProps as MenuProps } from '@/types/react-flow';
import { getLayoutedElements } from '@/lib/dagre';
import { getRandomPosition } from '@/utils/randomPosition';
import {
    ReactFlow,
    Panel,
    useNodesState,
    useEdgesState,
    useReactFlow,
    MiniMap,
    Controls,
    Background,
    addEdge,
    Node,
    NodeMouseHandler,
    OnConnect,
    BackgroundVariant,
} from '@xyflow/react';

export default function LayoutFlow  ()  {
    const { fitView } = useReactFlow();
    const [nodes, setNodes, onNodesChange] = useNodesState<any>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<any>([]);
    const [layoutDirection, setLayoutDirection] = useState('TB');
    const [menu, setMenu] = useState<MenuProps | null>(null);
    const ref = useRef<HTMLDivElement | null>(null);
    const isInitialRender = useRef(true);

    // load data from localStorage on first render
    useEffect(() => {
        try {
            const savedData = localStorage.getItem('flowData');
            if (savedData) {
                const { nodes: savedNodes, edges: savedEdges } = JSON.parse(savedData);
                if (savedNodes && Array.isArray(savedNodes)) {
                    setNodes(savedNodes);
                }
                if (savedEdges && Array.isArray(savedEdges)) {
                    setEdges(savedEdges);
                }

                // Only apply layout on initial render if we have nodes
                if (savedNodes && savedNodes.length > 0) {
                    setTimeout(() => {
                        const layouted = getLayoutedElements(savedNodes, savedEdges, { direction: layoutDirection });
                        setNodes([...layouted.nodes]);
                        setEdges([...layouted.edges]);

                        setTimeout(() => {
                            fitView({ padding: 0.2 });
                        }, 50);
                    }, 300);
                }
            }
        } catch (error) {
            console.error("Failed to load from localStorage:", error);
        }

        isInitialRender.current = false;
    }, []);

    // save to localStorage when nodes or edges change
    useEffect(() => {
        if (!isInitialRender.current) {
            localStorage.setItem('flowData', JSON.stringify({ nodes, edges }));
        }
    }, [nodes, edges]);

    // Handler for when users manually connect nodes
    const onConnect: OnConnect = useCallback(
        (connection) => {
            // Create a new edge with a label
            const newEdge = {
                ...connection,
                id: `edge_${connection.source}_${connection.target}`,
                label: `Connection ${edges.length + 1}`
            };

            setEdges((eds) => addEdge(newEdge, eds));
        },
        [edges, setEdges],
    );

    const onLayout = useCallback((direction: string) => {
        setLayoutDirection(direction);

        const layouted = getLayoutedElements(nodes, edges, { direction });
        setNodes([...layouted.nodes]);
        setEdges([...layouted.edges]);

        setTimeout(() => {
            fitView({ padding: 0.2 });
        }, 50);
    }, [nodes, edges, fitView, setNodes, setEdges]);

    const addNewNode = useCallback(() => {
        const newNodeId = `node_${Date.now()}`;
        const position = getRandomPosition();

        const newNode = {
            id: newNodeId,
            type: 'custom', // Use the custom node type
            position: position,
            data: {
                label: `Node ${nodes.length + 1}`
            }
        };

        // update state with the new node without creating any edges
        const updatedNodes = [...nodes, newNode];
        setNodes(updatedNodes);

        // save to localStorage
        localStorage.setItem('flowData', JSON.stringify({
            nodes: updatedNodes,
            edges: edges
        }));

        //fit view to show the new node
        setTimeout(() => {
            fitView({ padding: 0.2 });
        }, 50);
    }, [nodes, edges, fitView, setNodes]);

    const clearFlow = useCallback(() => {
        setNodes([]);
        setEdges([]);
        localStorage.removeItem('flowData');
    }, [setNodes, setEdges]);

    const toggleLayout = useCallback(() => {
        const newDirection = layoutDirection === 'TB' ? 'LR' : 'TB';
        onLayout(newDirection);
    }, [layoutDirection, onLayout]);

    const onNodeContextMenu: NodeMouseHandler = useCallback(
        (event, node) => {
            // Prevent native context menu from showing
            event.preventDefault();

            if (ref.current) {
                // Calculate position of the context menu. We want to make sure it
                // doesn't get positioned off-screen.
                const pane = ref.current.getBoundingClientRect();
                setMenu({
                    id: node.id,
                    top: event.clientY < pane.height ? event.clientY : undefined,
                    left: event.clientX < pane.width ? event.clientX : undefined,
                    right: event.clientX >= pane.width ? pane.width - event.clientX : undefined,
                    bottom: event.clientY >= pane.height ? pane.height - event.clientY : undefined,
                });
            }
        },
        [setMenu],
    );

    const onPaneClick = useCallback(() => setMenu(null), [setMenu]);

    // Update existing nodes to use the custom type if they don't already have it
    useEffect(() => {
        if (!isInitialRender.current && nodes.length > 0) {
            setNodes(nodes.map((node: Node) => ({
                ...node,
                type: node.type || 'custom'
            })));
        }
    }, []);

    return (
        <ReactFlow
            ref={ref}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeContextMenu={onNodeContextMenu}
            onConnect={onConnect}
            onPaneClick={onPaneClick}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            panOnScroll
            selectionOnDrag
            proOptions={{ hideAttribution: true }}
            defaultViewport={{ x: 0, y: 0, zoom: 1.5 }}
        >
            <Panel position="top-right" className='flex gap-3'>
                <Button onClick={toggleLayout}>
                    {layoutDirection === 'TB' ? 'Horizontal' : 'Vertical'}
                </Button>
                <Button onClick={addNewNode}>New Node</Button>
                <Button onClick={clearFlow} variant="destructive">Clear</Button>
            </Panel>
            <MiniMap />
            <Controls />
            <Background variant={BackgroundVariant.Dots} />
            {/* @ts-ignore */}
            {menu && <ContextMenu onClick={onPaneClick} {...menu} />}
        </ReactFlow>
    );
};