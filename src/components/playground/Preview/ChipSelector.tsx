import React, { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import { ChipsSelectorProps } from "@/types/flowJSON";

const ChipsSelector: React.FC<ChipsSelectorProps> = ({
    name,
    label,
    description,
    "max-selected-items": maxSelectedItems = Infinity,
    "data-source": dataSource = []
}) => {
    const [selectedChips, setSelectedChips] = useState<string[]>([]);

    const handleChipClick = (id: string) => {
        const isSelected = selectedChips.includes(id);

        if (isSelected) {
            // Remove if already selected
            setSelectedChips(selectedChips.filter(chipId => chipId !== id));
        } else if (selectedChips.length < maxSelectedItems) {
            // Add if not at max
            setSelectedChips([...selectedChips, id]);
        }
    };

    return (
        <div className="mb-4">
            {label && <h3 className="font-medium mb-1">{label}</h3>}
            {description && <p className="text-sm text-gray-500 mb-2">{description}</p>}
            {maxSelectedItems && maxSelectedItems < Infinity && (
                <p className="text-xs text-gray-500 mb-2">Choose up to {maxSelectedItems} options.</p>
            )}

            <div className="flex flex-wrap gap-2 mt-2">
                {dataSource.map((chip) => {
                    const isSelected = selectedChips.includes(chip.id);
                    return (
                        <Badge
                            key={chip.id}
                            variant={isSelected ? "outline" : "secondary"}
                            className={`
                cursor-pointer px-3 py-2 text-sm flex items-center gap-1
                ${isSelected ? 'border-2 border-emerald-500 bg-emerald-50 text-emerald-700' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}
              `}
                            onClick={() => handleChipClick(chip.id)}
                        >
                            {isSelected && <Check className="h-3 w-3" />}
                            <span>{chip.title}</span>
                        </Badge>
                    );
                })}
            </div>
        </div>
    );
};

export default ChipsSelector;