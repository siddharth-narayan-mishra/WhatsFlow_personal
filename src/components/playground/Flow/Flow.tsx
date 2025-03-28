import { ReactFlowProvider } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import LayoutFlow from './LayoutFlow';


export default function Flow() {
    return (
        <ReactFlowProvider>
            <LayoutFlow />
        </ReactFlowProvider>
    );
}