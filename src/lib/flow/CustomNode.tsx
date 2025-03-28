import { memo, useState, useCallback, useRef, useEffect, ChangeEvent, KeyboardEvent } from 'react';
import { Handle, Position, NodeResizer, useReactFlow } from '@xyflow/react';

const CustomNode = ({ data, selected, id }: { data: { label: string }, selected: boolean, id: string }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [labelText, setLabelText] = useState(data.label);
    const inputRef = useRef<HTMLInputElement>(null);
    const { setNodes } = useReactFlow();

    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [isEditing]);

    const handleLabelClick = useCallback(() => {
        setIsEditing(true);
    }, []);

    const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
        setLabelText(e.target.value);
    }, []);

    const handleInputBlur = useCallback(() => {
        setIsEditing(false);
        setNodes((nodes) =>
            nodes.map((node) => {
                if (node.id === id) {
                    return {
                        ...node,
                        data: {
                            ...node.data,
                            label: labelText,
                        },
                    };
                }
                return node;
            })
        );
    }, [id, labelText, setNodes]);

    const handleKeyDown = useCallback((e: KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            if (inputRef.current) {
                inputRef.current.blur();
            }
        }

        if (e.key === 'Escape') {
            e.preventDefault();
            setLabelText(data.label);
            setIsEditing(false);
        }
    }, [data.label]);

    return (
        <>
            <NodeResizer
                isVisible={selected}
                minWidth={100}
                minHeight={30}
                color='black'
            />
            <Handle type="target" position={Position.Top} />
            <div
                style={{
                    paddingInline: 10,
                    paddingBlock: 5,
                    backgroundColor: 'white',
                    borderRadius: '10px',
                    border: "gray 1px solid",
                    height: "100%",
                    display: 'flex',
                    justifyContent: "center",
                    alignItems: "center"
                }}>
                {isEditing ? (
                    <input
                        ref={inputRef}
                        value={labelText}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        onKeyDown={handleKeyDown}
                        style={{
                            border: 'none',
                            background: 'transparent',
                            outline: 'none',
                            fontSize: 'inherit',
                            fontFamily: 'inherit',
                            color: 'inherit',
                            textAlign: "center",
                            width: labelText.length * 9.2, display: 'flex', justifyContent: "center", alignItems: "center",
                        }}
                    />
                ) : (
                    <div
                        onClick={handleLabelClick}
                        style={{
                            cursor: 'text',
                            width: labelText.length * 9.2,
                            display: 'flex',
                            justifyContent: "center",
                            alignItems: "center"
                        }}
                    >
                        {data.label}
                    </div>
                )}
            </div>
            <Handle type="source" position={Position.Bottom} />
        </>
    );
};

export default memo(CustomNode);