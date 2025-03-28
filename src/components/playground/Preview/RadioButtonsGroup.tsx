import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckboxItem } from "@/types/flowJSON";
import { Control, FieldValues, Path } from "react-hook-form";

type RadioButtonsGroupFieldProps<TFieldValues extends FieldValues> = {
    control: Control<TFieldValues>;
    name: Path<TFieldValues>;
    label: string;
    description?: string;
    items: CheckboxItem[];
    required?: boolean;
    onSelectAction?: (value: string) => void;
};

const RadioButtonsGroupField = <TFieldValues extends FieldValues>({
    control,
    name,
    label,
    description,
    items,
    required,
    onSelectAction
}: RadioButtonsGroupFieldProps<TFieldValues>) => {
    return (
        <div className="space-y-3 mb-6">
            <div className="flex flex-col space-y-1">
                <Label className="text-base font-medium">{label}</Label>
                {description && (
                    <p className="text-sm text-gray-500">{description}</p>
                )}
            </div>
            <FormField
                control={control}
                name={name}
                rules={{ required: required }}
                render={({ field }) => (
                    <FormControl>
                        <RadioGroup
                            className="space-y-1"
                            value={field.value}
                            onValueChange={(value: string) => {
                                field.onChange(value);
                                if (onSelectAction) {
                                    onSelectAction(value);
                                }
                            }}
                        >
                            {items.map((item) => (
                                <FormItem
                                    key={item.id}
                                    className="flex items-center space-x-3 space-y-0 py-2 border-b border-gray-100 last:border-0"
                                >
                                    <FormControl>
                                        <RadioGroupItem
                                            value={item.id}
                                            id={`radio-${name}-${item.id}`}
                                            className="text-emerald-600"
                                        />
                                    </FormControl>
                                    <FormLabel
                                        htmlFor={`radio-${name}-${item.id}`}
                                        className="font-normal"
                                    >
                                        {item.title}
                                    </FormLabel>
                                </FormItem>
                            ))}
                        </RadioGroup>
                    </FormControl>
                )}
            />
        </div>
    );
};

export default RadioButtonsGroupField;