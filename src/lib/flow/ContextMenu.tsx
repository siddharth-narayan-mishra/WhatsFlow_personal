import React, { useCallback } from 'react';
import { useReactFlow } from '@xyflow/react';
import { Button } from '@/components/ui/button';
 
export default function ContextMenu({
  id,
  top,
  left,
  right,
  bottom,
  ...props
}:{id:any,top:number,left:number,right:number,bottom:number}) {
  const { getNode, setNodes, addNodes, setEdges } = useReactFlow();
  const duplicateNode = useCallback(() => {
    const node = getNode(id);
    const position = {
      x: node!.position.x + 50,
      y: node!.position.y + 50,
    };
 
    //@ts-ignore
    addNodes({
      ...node,
      selected: false,
      dragging: false,
      id: `${node!.id}-copy`,
      position,
    });
  }, [id, getNode, addNodes]);
 
  const deleteNode = useCallback(() => {
    setNodes((nodes) => nodes.filter((node) => node.id !== id));
    setEdges((edges) => edges.filter((edge) => edge.source !== id));
  }, [id, setNodes, setEdges]);
 
  return (
    <div
      style={{ top, left, right, bottom }}
      className="context-menu hover:bg-red-500 relative z-50 flex flex-col gap-2 text-white w-20"
      {...props}
    >
      <Button size="sm" variant="secondary" onClick={duplicateNode}>Duplicate</Button>
      <Button size="sm" variant="secondary" onClick={deleteNode}>Delete</Button>
    </div>
  );
}