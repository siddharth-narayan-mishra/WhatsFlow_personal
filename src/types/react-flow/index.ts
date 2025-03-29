import CustomEdge from "@/lib/flow/CustomEdge";
import CustomNode from "@/lib/flow/CustomNode";
import { CSSProperties } from 'react';

export interface CustomNodeData {
    label: string;
    placeholder?: string;
    style?: CSSProperties;
}

export const nodeTypes = {
    custom: CustomNode
};

export const edgeTypes = {
    default: CustomEdge
};

export interface ReactFlowContextMenuProps {
    id: string;
    top?: number;
    left?: number;
    right?: number;
    bottom?: number;
}