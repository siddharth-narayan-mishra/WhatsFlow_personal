import React from "react";
import { ChevronRight } from "lucide-react";

const NavigationList = ({ name, listItems }:any) => {
    if (!listItems || listItems.length === 0) {
        return null;
    }

    return (
        <div className="w-full" data-testid={`navigation-list-${name}`}>
            {listItems.map((item:any) => (
                <div
                    key={item.id}
                    className="flex justify-between items-start p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50"
                    data-testid={`list-item-${item.id}`}
                >
                    <div className="flex-1 pr-4">
                        <h3 className="text-base font-medium text-gray-900">
                            {item["main-content"]?.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1">
                            {item["main-content"]?.metadata}
                        </p>
                    </div>

                    <div className="flex flex-col items-end">
                        <span className="text-base font-medium text-gray-900">
                            {item.end?.title}
                        </span>
                        <span className="text-sm text-gray-500">
                            {item.end?.description}
                        </span>
                    </div>

                    <ChevronRight className="w-5 h-5 text-gray-400 ml-2 self-center" />
                </div>
            ))}
        </div>
    );
};

export default NavigationList;