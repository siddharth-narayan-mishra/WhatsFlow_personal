import { LayoutChild, ScreenPreviewProps } from "@/types/flowJSON";
import React, { useRef, useState } from "react";
import Form from "./PreviewForm";
import ReactMarkdown from 'react-markdown';
import { Button } from "@/components/ui/button";
import ContextMenu from "./PreviewContextMenu";
import { MoreVertical, X } from "lucide-react";
import NavigationList from "./NavList";
import ChipsSelector from "./ChipSelector";

const ScreenPreview: React.FC<ScreenPreviewProps> = ({
  screen,
  onNext,
  onFinish,
  onBack
}) => {
  const [contextMenuOpen, setContextMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const menuButtonRef = useRef(null);

  const handleMenuClick = () => {
    if (menuButtonRef.current) {
      // @ts-ignore
      const rect = menuButtonRef.current.getBoundingClientRect();
      setMenuPosition({
        x: 10,
        y: rect.bottom + window.scrollY
      });
    }
    setContextMenuOpen(!contextMenuOpen);
  };

  const handleCloseMenu = () => {
    setContextMenuOpen(false);
  };

  const processTextContent = (text: string | string[] | undefined, useMarkdown: boolean = false): string => {
    if (!text) return '';
    if (Array.isArray(text)) {
      return text.join('\n');
    }
    return text;
  };

  const renderChild = (child: LayoutChild) => {
    if (child.visible === false) return null;

    switch (child.type) {
      case "Form":
        return (
          <Form
            formData={child}
            screenData={screen.data}
            onComplete={(screen.terminal || false) ? onFinish : onNext}
          />
        );
      case "ChipsSelector":
        return (
          // @ts-ignore
          <ChipsSelector 
            name={child.name!}
            label={child.label}
            description={child.description}
            max-selected-items={child["max-selected-items"]}
            data-source={child["data-source"]}
          />
        );
      case "TextHeading":
        return child.markdown ? (
          <div className="text-xl font-bold mb-4">
            <ReactMarkdown>{processTextContent(child.text, true)}</ReactMarkdown>
          </div>
        ) : (
          <h1 className="text-xl font-bold mb-4">{processTextContent(child.text)}</h1>
        );
      case "TextSubheading":
        return child.markdown ? (
          <div className="text-lg font-semibold mb-3">
            <ReactMarkdown>{processTextContent(child.text, true)}</ReactMarkdown>
          </div>
        ) : (
          <h2 className="text-lg font-semibold mb-3">{processTextContent(child.text)}</h2>
        );
      case "TextBody":
        return child.markdown ? (
          <div className="text-base mb-3">
            <ReactMarkdown>{processTextContent(child.text, true)}</ReactMarkdown>
          </div>
        ) : (
          <p className="text-base mb-3">{processTextContent(child.text)}</p>
        );
      case "TextCaption":
        return child.markdown ? (
          <div className="text-sm text-gray-500 mb-2">
            <ReactMarkdown>{processTextContent(child.text, true)}</ReactMarkdown>
          </div>
        ) : (
          <p className="text-sm text-gray-500 mb-2">{processTextContent(child.text)}</p>
        );
      case "RichText":
        return (
          <div className="mb-4 overflow-x-auto">
            <ReactMarkdown>
              {processTextContent(child.text, true)}
            </ReactMarkdown>
          </div>
        );
      case "EmbeddedLink":
        return (
          <div className="text-emerald-500 hover:bg-emerald-100 p-3 text-center rounded-full">
            {child.text}
          </div>
        )

      case "NavigationList":
        return (
          <NavigationList name={child.name} listItems={child["list-items"]} />
        )
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col bg-white rounded-lg overflow-hidden shadow-md w-full h-[95%] mx-auto absolute bottom-0">
      <div className="p-3 border-b-2 flex items-center justify-between">
        <button
          className="p-1 rounded-full hover:bg-gray-200"
          onClick={onBack}
        >
          <X className="h-6 w-6" />
        </button>
        <div className="font-semibold">{screen.title}</div>
        <button
          className="p-1 rounded-full hover:bg-gray-200"
          onClick={handleMenuClick}
          ref={menuButtonRef}
        >
          <MoreVertical className="h-6 w-6" />
        </button>
      </div>

      <ContextMenu
        isOpen={contextMenuOpen}
        onClose={handleCloseMenu}
        position={menuPosition}
      />

      <div className="flex-1 p-4 flex flex-col overflow-y-auto relative">
        {screen.layout.children.map((child, index) => (
          <React.Fragment key={index}>
            {renderChild(child)}
          </React.Fragment>
        ))}
      </div>

      <div className="mt-auto flex items-center justify-center py-3">
        <Button
          className="w-11/12 rounded-md bg-emerald-500 hover:bg-emerald-600 text-white"
          onClick={(screen.terminal || false) ? onFinish : onNext}
        >
          {(screen.terminal || false) ? "Continue" : "Proceed"}
        </Button>
      </div>

      <div className="text-xs text-center text-gray-400 p-2 border-t">
        Managed by the business. <span className="text-green-500">Learn more</span>
      </div>
    </div>
  );
};

export default ScreenPreview;