import Dagre from '@dagrejs/dagre';
import { Edge, Node } from '@xyflow/react';

export const getLayoutedElements = (nodes: Node[], edges: Edge[], options: { direction: string }) => {
    if (nodes.length === 0) return { nodes, edges };

    const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
    g.setGraph({ rankdir: options.direction });

    edges.forEach((edge) => g.setEdge(edge.source, edge.target));
    nodes.forEach((node) =>
        g.setNode(node.id, {
            width: 172,
            height: 36,
        }),
    );

    Dagre.layout(g);

    return {
        nodes: nodes.map((node) => {
            const graphNode = g.node(node.id);
            if (!graphNode) return node;

            return {
                ...node,
                position: {
                    x: graphNode.x - 172 / 2,
                    y: graphNode.y - 36 / 2
                }
            };
        }),
        edges,
    };
};