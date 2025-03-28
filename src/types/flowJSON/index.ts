import { Control } from "react-hook-form";

export interface WapJSON {
  version: string;
  screens: Screen[];
  data_api_version?: string;
  routing_model?: Record<string, any>;
}

export interface LayoutChild {
  type: string;
  text?: string | string[];
  visible?: boolean;
  label?: string;
  markdown?: boolean;
  name?: string;
  required?: boolean;
  "input-type"?: string;
  "min-date"?: string;
  "max-date"?: string;
  "unavailable-dates"?:string[]
  pattern?: string;
  "helper-text"?: string;
  children?: LayoutChild[];
  "init-values"?: Record<string, any>;
  "on-click-action"?: {
    name: string;
    payload: Record<string, any>;
    next?: {
      type?: string;
      name?: string;
    }
  };
  "on-select-action"?: {
    name: string;
    payload: Record<string, any>;
  };
  description?: string;
  "data-source"?: string | CheckboxItem[];
  "list-items"?: {
    id: string;
    "main-content": {
      title: string;
      metadata: string;
    },
    end: {
      title: string;
      description: string;
    },
    "on-click-action": {
      name: string;
      next: {
        name: string;
        type: string;
      },
      payload: object
    }
  }[];
  "max-selected-items"?:number
}

export interface CheckboxItem {
  id: string;
  title: string;
}

export interface Layout {
  type: string;
  children: LayoutChild[];
}

export interface Screen {
  id: string;
  title: string;
  terminal?: boolean;
  layout: Layout;
  data?: {
    [key: string]: any;
  };
}

// Context Menu component
export interface ContextMenuProps {
  isOpen: boolean;
  onClose: () => void;
  position: { x: number; y: number };
}

export interface ChatPreviewProps {
  onStartPreview: () => void;
}

export interface ScreenSelectorProps {
  screens: Screen[];
  currentScreenIndex: number;
  onSelectScreen: (index: number) => void;
}

export default interface CheckboxGroupProps {
  label?: string;
  description?: string;
  required?: boolean;
  name: string;
  dataSource: CheckboxItem[];
  onChange: (name: string, values: string[]) => void;
  initialValues?: string[];
}

export interface FormInputProps {
  type: string;
  label?: string;
  required?: boolean;
  inputType?: string;
  pattern?: string;
  helperText?: string;
  initialValue?: string;
  name: string;
  onChange: (name: string, value: string) => void;
}

export interface FormProps {
  formData: LayoutChild;
  screenData?: Record<string, any>;
  onComplete: () => void;
}

export interface ScreenPreviewProps {
  screen: Screen;
  onNext: () => void;
  onFinish: () => void;
  onBack: () => void;
}

export interface OptInProps {
  control: Control<any>;
  name: string;
  label: string;
  required?: boolean;
  onClickAction?: any;
}

export interface ChipItem {
    id: string;
    title: string;
}

export interface ChipsSelectorProps {
    name: string;
    label?: string;
    description?: string;
    "max-selected-items"?: number;
    "data-source"?: ChipItem[];
}