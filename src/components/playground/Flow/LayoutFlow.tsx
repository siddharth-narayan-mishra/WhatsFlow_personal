'use client'
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ContextMenu from '@/lib/flow/ContextMenu';
import { nodeTypes, edgeTypes, ReactFlowContextMenuProps as MenuProps } from '@/types/react-flow';
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
    Edge,
} from '@xyflow/react';

type CustomNode = Node & {
    data: {
        label: string;
        placeholder?: string;
        style?: React.CSSProperties;
    };
};

type CustomEdge = Edge & {
    label?: string;
};

export default function LayoutFlow() {
    const { fitView } = useReactFlow();
    const [nodes, setNodes, onNodesChange] = useNodesState<CustomNode>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<CustomEdge>([]);
    const [layoutDirection, setLayoutDirection] = useState<'TB' | 'LR'>('TB');
    const [menu, setMenu] = useState<MenuProps | null>(null);
    const [jsonInput, setJsonInput] = useState<string>('');
    const ref = useRef<HTMLDivElement | null>(null);
    const isInitialRender = useRef(true);

    useEffect(() => {
        try {
            const savedData = localStorage.getItem('flowData');
            if (savedData) {
                const { nodes: savedNodes, edges: savedEdges } = JSON.parse(savedData);
                if (savedNodes && Array.isArray(savedNodes)) {
                    setNodes(savedNodes as CustomNode[]);
                }
                if (savedEdges && Array.isArray(savedEdges)) {
                    setEdges(savedEdges as CustomEdge[]);
                }

                if (savedNodes && savedNodes.length > 0) {
                    setTimeout(() => {
                        const layouted = getLayoutedElements(savedNodes, savedEdges, { direction: layoutDirection });
                        setNodes([...layouted.nodes] as CustomNode[]);
                        setEdges([...layouted.edges] as CustomEdge[]);

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

    useEffect(() => {
        if (!isInitialRender.current) {
            localStorage.setItem('flowData', JSON.stringify({ nodes, edges }));
        }
    }, [nodes, edges]);

    const onConnect: OnConnect = useCallback(
        (connection) => {
            const newEdge: CustomEdge = {
                ...connection,
                id: `edge_${connection.source}_${connection.target}`,
                label: `Connection ${edges.length + 1}`
            };

            setEdges((eds) => addEdge(newEdge, eds));
        },
        [edges, setEdges],
    );

    const onLayout = useCallback((direction: 'TB' | 'LR') => {
        setLayoutDirection(direction);

        const layouted = getLayoutedElements(nodes, edges, { direction });
        setNodes([...layouted.nodes] as CustomNode[]);
        setEdges([...layouted.edges] as CustomEdge[]);

        setTimeout(() => {
            fitView({ padding: 0.2 });
        }, 50);
    }, [nodes, edges, fitView, setNodes, setEdges]);

    const addNewNode = useCallback(() => {
        const newNodeId = `node_${Date.now()}`;
        const position = getRandomPosition();

        const newNode: CustomNode = {
            id: newNodeId,
            type: 'custom',
            position: position,
            data: {
                label: `Node ${nodes.length + 1}`
            }
        };

        const updatedNodes = [...nodes, newNode];
        setNodes(updatedNodes);

        localStorage.setItem('flowData', JSON.stringify({
            nodes: updatedNodes,
            edges: edges
        }));

        setTimeout(() => {
            fitView({ padding: 0.2 });
        }, 50);
    }, [nodes, edges, fitView, setNodes]);

    const clearFlow = useCallback(() => {
        setNodes([]);
        setEdges([]);
        localStorage.removeItem('flowData');
        setJsonInput('');
    }, [setNodes, setEdges]);

    const toggleLayout = useCallback(() => {
        const newDirection = layoutDirection === 'TB' ? 'LR' : 'TB';
        onLayout(newDirection);
    }, [layoutDirection, onLayout]);

    const onNodeContextMenu: NodeMouseHandler = useCallback(
        (event, node) => {
            event.preventDefault();

            if (ref.current) {
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

    const renderJsonFlow = useCallback(() => {
        try {
            const parsedData = JSON.parse(jsonInput);
            const nodesData = parsedData.nodes || [];
            const edgesData = parsedData.edges || [];

            const transformedNodes = nodesData.map((node: any, index: number) => ({
                id: node.id || `node_${index}`,
                type: 'custom',
                position: node.position || getRandomPosition(),
                data: {
                    label: node.data?.label || `Node ${index + 1}`,
                    placeholder: node.data?.placeholder,
                    style: node.data?.style || {}
                }
            }));

            const transformedEdges = edgesData.map((edge: any, index: number) => ({
                ...edge,
                id: edge.id || `edge_${index}`,
                label: edge.label || `Connection ${index + 1}`
            }));

            setNodes(transformedNodes);
            setEdges(transformedEdges);

            const layouted = getLayoutedElements(transformedNodes, transformedEdges, { direction: layoutDirection });
            setNodes([...layouted.nodes] as CustomNode[]);
            setEdges([...layouted.edges] as CustomEdge[]);

            setTimeout(() => {
                fitView({ padding: 0.2 });
            }, 50);

        } catch (error) {
            alert('Invalid JSON');
        }
    }, [jsonInput, layoutDirection, setNodes, setEdges, fitView]);

    return (
        <div className="flex flex-col h-screen">
            <Card className="m-4">
                <CardHeader>
                    <CardTitle>Flow JSON Input</CardTitle>
                </CardHeader>
                <CardContent className="flex gap-2">
                    <Textarea
                        placeholder="Paste your JSON here"
                        value={jsonInput}
                        onChange={(e) => setJsonInput(e.target.value)}
                        className="flex-grow"
                    />
                    <Button onClick={renderJsonFlow}>Render Flow</Button>
                </CardContent>
            </Card>
            <div className="flex-grow">
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
                    {/* @ts-expect-error */}
                    {menu && <ContextMenu onClick={onPaneClick} {...menu} />}
                </ReactFlow>
            </div>
        </div>
    );
}