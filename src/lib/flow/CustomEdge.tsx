import { Button } from '@/components/ui/button';
import {
    BaseEdge,
    EdgeLabelRenderer,
    EdgeProps,
    getStraightPath,
    useReactFlow,
} from '@xyflow/react';
import { useState, useRef, useEffect } from 'react';

export default function CustomEdge({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    label,
    data
}: EdgeProps) {
    const { setEdges } = useReactFlow();
    const [edgePath, labelX, labelY] = getStraightPath({
        sourceX,
        sourceY,
        targetX,
        targetY,
    });

    const [isEditing, setIsEditing] = useState(false);
    const [editedLabel, setEditedLabel] = useState(label);
    const [showDeleteButton, setShowDeleteButton] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const deleteButtonRef = useRef<HTMLDivElement>(null);

    const handleLabelClick = () => {
        setIsEditing(true);
    };

    const handleRightClick = (event: React.MouseEvent) => {
        event.preventDefault();
        setShowDeleteButton(!showDeleteButton);
    };

    const handleDeleteEdge = () => {
        setEdges((edges) => edges.filter((edge) => edge.id !== id));
        setShowDeleteButton(false);
    };

    const handleLabelChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEditedLabel(event.target.value);
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Enter') {
            saveLabel();
        } else if (event.key === 'Escape') {
            setIsEditing(false);
            setEditedLabel(label as string);
        }
    };

    const handleBlur = () => {
        saveLabel();
    };

    const saveLabel = () => {
        setIsEditing(false);
        setEdges((edges) =>
            edges.map((edge) => {
                if (edge.id === id) {
                    return {
                        ...edge,
                        label: editedLabel,
                    };
                }
                return edge;
            })
        );
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                showDeleteButton &&
                deleteButtonRef.current &&
                !deleteButtonRef.current.contains(event.target as Node)
            ) {
                setShowDeleteButton(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [showDeleteButton]);

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isEditing]);

    return (
        <>
            <BaseEdge id={id} path={edgePath} />
            <EdgeLabelRenderer>
                <div
                    ref={deleteButtonRef}
                    style={{
                        position: 'absolute',
                        transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
                        pointerEvents: 'all',
                    }}
                    className="nodrag nopan"
                    onClick={isEditing ? undefined : handleLabelClick}
                    onContextMenu={handleRightClick}
                >
                    {isEditing ? (
                        <input
                            ref={inputRef}
                            value={editedLabel as string}
                            onChange={handleLabelChange}
                            onKeyDown={handleKeyDown}
                            onBlur={handleBlur}
                            className="edge-label-input"
                            style={{
                                fontSize: '12px',
                                padding: '2px 5px',
                                border: 'none',
                                background: 'transparent',
                                outline: 'none',
                            }}
                        />
                    ) : (
                        <div style={{ padding: '3px 5px', fontSize: '12px' }}>
                            {editedLabel}
                        </div>
                    )}

                    {showDeleteButton && (
                        <Button
                            variant="destructive"
                            onClick={handleDeleteEdge}
                            style={{
                                position: 'absolute',
                                top: '50%',
                                left: '100%',
                                transform: "translatey(-50%)",
                                height: 'fit-content',
                                padding: '2px 3px',
                                fontSize: '8px',
                                zIndex: 10
                            }}
                        >
                            Delete
                        </Button>
                    )}
                </div>
            </EdgeLabelRenderer>
        </>
    );
}