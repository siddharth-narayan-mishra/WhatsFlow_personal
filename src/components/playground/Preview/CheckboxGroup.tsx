import { Checkbox } from "@/components/ui/checkbox";
import { FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { CheckboxItem } from "@/types/flowJSON";

const CheckboxGroupField = ({
  control,
  name,
  label,
  description,
  items,
  required
}:any) => {
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
        defaultValue={[]}
        render={({ field }:{field:any}) => (
          <div className="space-y-1">
            {items.map((item:CheckboxItem) => (
              <FormItem
                key={item.id}
                className="flex flex-row items-start space-x-3 space-y-0 py-2 border-b border-gray-100 last:border-0"
              >
                <FormControl>
                  <Checkbox
                    checked={(field.value || []).includes(item.id)}
                    onCheckedChange={(checked:any) => {
                      const currentValue = field.value || [];
                      const updatedValue = checked
                        ? [...currentValue, item.id]
                        : currentValue.filter((value:any) => value !== item.id);
                      field.onChange(updatedValue);
                    }}
                    className="text-emerald-600"
                  />
                </FormControl>
                <FormLabel className="font-normal">
                  {item.title}
                </FormLabel>
              </FormItem>
            ))}
          </div>
        )}
      />
    </div>
  );
};

export default CheckboxGroupField
