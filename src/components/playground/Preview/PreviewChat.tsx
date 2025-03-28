import { Button } from "@/components/ui/button";
import { ChatPreviewProps } from "@/types/flowJSON";
import { Store } from "lucide-react";

const ChatPreview: React.FC<ChatPreviewProps> = ({ onStartPreview }) => {
    return (
        <div 
            className="flex flex-col rounded-lg overflow-hidden shadow-md h-full mx-auto"
        >
            {/* Header */}
            <div className="bg-gray-200 p-3 flex items-center">
                <div className="bg-green-500 rounded-full p-2">
                    <Store className="text-white h-5 w-5" />
                </div>
                <div className="flex-1 h-6 bg-gray-300 rounded-full ml-3"></div>
            </div>

            {/* Chat background */}
            <div className="flex-1 bg-[#f0e7dd] p-4 flex flex-col">
                {/* Message bubble */}
                <div className="self-end max-w-xs bg-[#dcf8c6] rounded-lg p-3 my-2">
                    <div className="h-4 bg-[#b7e6a3] rounded-full w-48 mb-2"></div>
                </div>

                {/* Preview flow button */}
                <div className="self-start max-w-xs bg-white rounded-lg p-4 my-2 shadow-sm">
                    <div className="h-4 bg-gray-300 rounded-full w-32 mb-3"></div>
                    <Button
                        className="text-blue-500 bg-transparent hover:bg-transparent p-0 h-6"
                        onClick={onStartPreview}
                    >
                        Preview Flow
                    </Button>
                </div>
            </div>

            {/* Input area */}
            <div className="bg-white p-3">
                <div className="h-10 bg-gray-100 rounded-full"></div>
            </div>
        </div>
    );
};

export default ChatPreview