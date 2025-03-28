import { XYPosition } from "@xyflow/react";

export const getRandomPosition = (): XYPosition => {
    return {
        x: Math.random() * 100,
        y: Math.random() * 100
    };
};