import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form as FormRoot, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { FormProps } from "@/types/flowJSON";
import RadioButtonsGroupField from "./RadioButtonsGroup";
import CheckboxGroupField from "./CheckboxGroup";
import OptIn from "./OptIn";
import { XCircle } from "lucide-react";
import { useState } from "react";
import { DatePicker } from "@/components/playground/Preview/DatePicker";

// Define the DropdownProps interface
interface DropdownProps {
  name: string;
  label: string;
  required: boolean;
  control: any;
  dataSource: Array<{
    id: string;
    title: string;
    description: string;
    metadata: string;
  }>;
}

// Define the Dropdown component before it's used
const Dropdown: React.FC<DropdownProps> = ({
  name,
  label,
  required,
  control,
  dataSource,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  console.log("data source = ", dataSource);
  console.log("type - ", typeof (dataSource))

  return (
    <FormField
      control={control}
      name={name}
      rules={{ required: required }}
      render={({ field }) => (
        <FormItem className="mb-4">
          <FormLabel className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </FormLabel>
          <div className="relative">
            <FormControl>
              <div className="flex-1 w-full px-4 py-2 border rounded-lg relative" onClick={() => setIsOpen(true)}>
                {field.value ? (
                  <div className="flex items-center justify-between">
                    <span>{field.value.title}</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        field.onChange(null);
                      }}
                      className="p-1 hover:bg-gray-100 rounded-full"
                    >
                      <XCircle className="h-5 w-5 text-gray-400" />
                    </button>
                  </div>
                ) : (
                  <span className="text-gray-500">Select {label}</span>
                )}
              </div>
            </FormControl>
            <FormMessage />
          </div>

          {isOpen && (
            <div className="absolute inset-0 bg-white w-full z-50">
              <div className="p-4">
                {dataSource.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    className="w-full text-left mb-4 last:mb-0"
                    onClick={() => {
                      field.onChange(item);
                      setIsOpen(false);
                    }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium">{item.title}</div>
                        <div className="text-gray-600 text-sm">{item.description}</div>
                      </div>
                      <div className="text-gray-900">{item.metadata}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </FormItem>
      )}
    />
  );
};

const Form: React.FC<FormProps> = ({ formData, screenData, onComplete }) => {
  const initialValues = formData["init-values"] || {};

  const form = useForm({
    defaultValues: initialValues
  });

  const onSubmit = (values: any) => {
    console.log("Form submitted with values:", values);
    onComplete();
  };

  return (
    <FormRoot {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full relative">
        {(formData.children || []).map((child: any, index: number) => {
          if (child.type === "TextInput") {
            return (
              <FormField
                key={index}
                control={form.control}
                name={child.name || `input_${index}`}
                defaultValue=""
                rules={{ required: child.required }}
                render={({ field }) => (
                  <FormItem className="mb-6">
                    <FormLabel className="text-base font-medium">{child.label}</FormLabel>
                    <FormControl>
                      <Input
                        type={child["input-type"] || "text"}
                        placeholder={child.placeholder || ""}
                        className="h-6"
                        pattern={child.pattern}
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    {child["helper-text"] && (
                      <FormDescription>{child["helper-text"]}</FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          }

          if (child.type === "TextArea") {
            return (
              <FormField
                key={index}
                control={form.control}
                name={child.name || `textarea_${index}`}
                defaultValue=""
                rules={{ required: child.required }}
                render={({ field }) => (
                  <FormItem className="mb-6">
                    <FormLabel className="text-base font-medium">{child.label}</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={child.placeholder || ""}
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    {child["helper-text"] && (
                      <FormDescription>{child["helper-text"]}</FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            );
          }

          if (child.type === "RadioButtonsGroup") {
            return (
              <RadioButtonsGroupField
                key={index}
                control={form.control}
                name={child.name || `radio_group_${index}`}
                label={child.label}
                description={child.description}
                // @ts-ignore
                items={Object.entries(screenData!)[0][1].__example__}
                required={child.required}
                onSelectAction={child["on-select-action"]}
              />
            );
          }

          if (child.type === "CheckboxGroup") {
            return (
              <CheckboxGroupField
                key={index}
                control={form.control}
                name={child.name || `checkbox_group_${index}`}
                label={child.label}
                description={child.description}
                items={screenData!.all_extras}
                required={child.required}
              />
            );
          }

          if (child.type === "OptIn") {
            return (
              <OptIn
                key={index}
                control={form.control}
                name={child.name || `optin_${index}`}
                label={child.label}
                required={child.required}
                onClickAction={child["on-click-action"]}
              />
            );
          }

          if (child.type === "Dropdown") {
            return (
              <Dropdown
                key={index}
                control={form.control}
                name={child.name || `dropdown_${index}`}
                label={child.label}
                required={child.required || false}
                dataSource={Object.entries(screenData!)[0][1].__example__}
              />
            );
          }

          if ((child.type === "DatePicker") || (child.type === "CalendarPicker")) {
            return (
              <div key={index} className="my-2">
                <DatePicker />
              </div>
            );
          }

          return null;
        })}
      </form>
    </FormRoot>
  );
};

export default Form;