import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { OptInProps } from "@/types/flowJSON";
import { Control, FieldValues, Path } from "react-hook-form";

// Modify the type to be more generic and support different form value types
const OptIn = <TFieldValues extends FieldValues>({
    control,
    name,
    label,
    required,
    onClickAction
}: {
    control: Control<TFieldValues>;
    name: Path<TFieldValues>;
    label: string;
    required?: boolean;
    onClickAction?: () => void;
}) => {
    const displayLabel = label;
    return (
        <FormField
            control={control}
            name={name}
            rules={{ required: required }}
            render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-2 mb-3">
                    <FormControl>
                        <Checkbox
                            checked={field.value || false}
                            onCheckedChange={(checked: boolean) => {
                                field.onChange(checked);
                                if (checked && onClickAction) {
                                    // Handle on-click-action if needed
                                    onClickAction();
                                }
                            }}
                            className="text-emerald-600 mt-1"
                        />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                        <FormLabel className="font-normal">
                            {displayLabel}
                            <span className="ml-1 text-emerald-600 cursor-pointer hover:underline">
                                Read more
                            </span>
                        </FormLabel>
                        <FormMessage />
                    </div>
                </FormItem>
            )}
        />
    );
};

export default OptIn;