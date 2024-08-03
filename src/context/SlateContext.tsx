import { DropdownItemType } from "@/components/SlateEditor/DropdownMenu";
import { ToolType, ToolWithIconType } from "@/components/SlateEditor/Toolbar";
import { FC, createContext, useContext, useReducer, useRef } from "react";

type ISlateState = ISlateConfig;

const initSlateState = {};

interface ToolConfig {
  disabled: boolean;
}

interface DropdownConfig {
  disabled: boolean;
}

interface FontSizeConfig {
  disabled?: boolean;
  disabledSizes?: number[] | { min: number; max: number };
  shouldHideDisabled?: boolean;
  defaultFontSize?: `${number}px`;
}

export interface ISlateConfig {
  toolbars?: Partial<Record<ToolWithIconType, ToolConfig>>;
  dropdowns?: Partial<Record<DropdownItemType, DropdownConfig>>;
  fontSize?: FontSizeConfig;
}

export const SlateContext = createContext<UseSlateContextType>({});

const SlateContextProvider: FC<{
  children: React.ReactElement;
  value?: ISlateState;
}> = ({ children, value }) => {
  const context = useSlateContext(value ?? {});

  return (
    <SlateContext.Provider value={context}>{children}</SlateContext.Provider>
  );
};

type UseSlateContextType = ISlateState;

type SlateAction = {
  type: string;
  payload: any;
};

function SlateReducer(state: ISlateState, action: SlateAction): ISlateState {
  switch (action.type) {
    default:
      return state;
  }
}

function useSlateContext(initState: ISlateState): UseSlateContextType {
  const [state] = useReducer(SlateReducer, initState);

  return initState;
}

function useSlateConfig(): UseSlateContextType {
  const context = useContext(SlateContext);
  if (context === undefined) {
    throw new Error("useSlate must be used within a SlateContextProvider");
  }

  return context;
}

export { useSlateConfig, SlateContextProvider };
