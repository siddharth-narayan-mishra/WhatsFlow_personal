import { ContextMenuProps } from "@/types/flowJSON";
import { Flag, HelpCircle } from "lucide-react";

const ContextMenu: React.FC<ContextMenuProps> = ({ isOpen, onClose, position }) => {
    if (!isOpen) return null;

    return (
        <div
            className="absolute bg-white rounded-md shadow-lg py-1 z-10"
            style={{
                top: 50 + 'px',
                right: 5 + 'px',
                minWidth: '150px'
            }}
        >
            <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center text-sm"
                onClick={onClose}
            >
                <HelpCircle className="h-4 w-4 mr-2" />
                Help
            </button>
            <button
                className="w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center text-sm"
                onClick={onClose}
            >
                <Flag className="h-4 w-4 mr-2" />
                Report
            </button>
        </div>
    );
};

export default ContextMenu