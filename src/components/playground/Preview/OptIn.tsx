import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { OptInProps } from "@/types/flowJSON";

const OptIn: React.FC<OptInProps> = ({
    control,
    name,
    label,
    required,
    onClickAction
}) => {
    let displayLabel = label;

    return (
        <FormField
            control={control}
            name={name}
            rules={{ required: required }}
            defaultValue={false}
            render={({ field }:{field:any}) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 py-2 mb-3">
                    <FormControl>
                        <Checkbox
                            checked={field.value || false}
                            onCheckedChange={(checked:any) => {
                                field.onChange(checked);
                                if (checked && onClickAction) {
                                    // Handle on-click-action if needed
                                    console.log("OptIn checked, Action:", onClickAction);
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