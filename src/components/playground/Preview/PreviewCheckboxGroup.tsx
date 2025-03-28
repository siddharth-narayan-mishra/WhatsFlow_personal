import CheckboxGroupProps from "@/types/flowJSON";
import { useState } from "react";

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  label,
  description,
  required,
  name,
  dataSource,
  onChange,
  initialValues = []
}) => {
  const [selectedItems, setSelectedItems] = useState<string[]>(initialValues);

  const handleCheckboxChange = (id: string) => {
    let newSelectedItems: string[];
    
    if (selectedItems.includes(id)) {
      newSelectedItems = selectedItems.filter(item => item !== id);
    } else {
      newSelectedItems = [...selectedItems, id];
    }
    
    setSelectedItems(newSelectedItems);
    onChange(name, newSelectedItems);
  };

  return (
    <div className="mb-4">
      {label && (
        <label className="block text-md font-medium mb-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}
      {description && (
        <p className="text-sm text-gray-600 mb-2">{description}</p>
      )}
      
      {/* If no items are available, show an error message */}
      {dataSource.length === 0 ? (
        <p className="text-sm text-red-500">No options available</p>
      ) : (
        <div className="space-y-3">
          {dataSource.map((item) => (
            <div key={item.id} className="flex items-center">
              <div className="relative flex items-center">
                <input
                  type="checkbox"
                  id={`${name}-${item.id}`}
                  checked={selectedItems.includes(item.id)}
                  onChange={() => handleCheckboxChange(item.id)}
                  className="h-5 w-5 border border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor={`${name}-${item.id}`} className="ml-3 block text-sm">
                  {item.title}
                </label>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Debug information - remove in production */}
      {process.env.NODE_ENV !== 'production' && (
        <div className="mt-2 text-xs text-gray-500">
          <p>Available options: {dataSource.length}</p>
          <p>Selected items: {selectedItems.join(', ') || 'None'}</p>
        </div>
      )}
    </div>
  );
};

export default CheckboxGroup