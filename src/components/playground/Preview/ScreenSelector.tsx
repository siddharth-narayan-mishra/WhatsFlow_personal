import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { ScreenSelectorProps } from "@/types/flowJSON";

const ScreenSelector: React.FC<ScreenSelectorProps> = ({
  screens,
  currentScreenIndex,
  onSelectScreen
}) => {
  return (
    <div className="mb-4 w-full max-w-md mx-auto">
      <Select value={currentScreenIndex.toString()} onValueChange={(value:any) => onSelectScreen(parseInt(value))}>
        <SelectTrigger className="w-full bg-white border-gray-300">
          <SelectValue placeholder="Select a screen">
            {screens[currentScreenIndex].title}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Screens</SelectLabel>
            {screens.map((screen, index) => (
              <SelectItem key={screen.id} value={index.toString()}>
                <div className="flex items-center justify-between w-full">
                  <span>{screen.title}</span>
                  {screen.terminal && (
                    <span className="text-xs bg-gray-200 rounded px-1 ml-1">terminal</span>
                  )}
                </div>
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};

export default ScreenSelector