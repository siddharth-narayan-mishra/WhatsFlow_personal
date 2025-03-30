import { ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import LayoutFlow, { CustomEdge, CustomNode } from './LayoutFlow';


export default function Flow({ flowData }: { flowData: { nodes: CustomNode[], edges: CustomEdge[] } }) {
    return (
        <ReactFlowProvider>
            <LayoutFlow flowData={flowData}/>
        </ReactFlowProvider>
    );
}