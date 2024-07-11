import {
  ArgsProps,
  NotificationInstance,
  NotificationPlacement,
} from "antd/es/notification/interface";
import React, {
  FC,
  createContext,
  useContext,
  useReducer,
  useRef,
} from "react";

/**
 * 
 * openNotification = (
    placement: NotificationPlacement,
    props: {
      message: React.ReactNode;
    },
    type: keyof Omit<NotificationInstance, "destroy"> = "success"
  )
 */

type OpenNotificationFn = (
  placement: NotificationPlacement,
  props: ArgsProps,
  type?: keyof Omit<NotificationInstance, "destroy">
) => void;

interface INotificationState {
  openNotification: OpenNotificationFn;
  destroy: (key?: React.Key) => void;
}

const initNotificationState = {
  openNotification: () => {},
  destroy: () => {},
};

export const NotificationContext = createContext<UseNotificationContextType>(
  initNotificationState
);

const NotificationContextProvider: FC<{
  children: React.ReactElement;
  openNotification: OpenNotificationFn;
  destroy: (key?: React.Key) => void;
}> = ({ children, openNotification }) => {
  const context = useNotificationContext({
    openNotification,
    destroy: () => {},
  });

  return (
    <NotificationContext.Provider value={context}>
      {children}
    </NotificationContext.Provider>
  );
};

type UseNotificationContextType = {
  openNotification: OpenNotificationFn;
  destroy: (key?: React.Key) => void;
};

type NotificationAction = {
  type: string;
  payload: any;
};

function NotificationReducer(
  state: INotificationState,
  action: NotificationAction
): INotificationState {
  switch (action.type) {
    default:
      return state;
  }
}

function useNotificationContext(
  initState: INotificationState
): UseNotificationContextType {
  const [state] = useReducer(NotificationReducer, initState);
  return {
    openNotification: state.openNotification,
    destroy: state.destroy,
  };
}

function useNotification(): UseNotificationContextType {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotification must be used within a NotificationContextProvider"
    );
  }

  return context;
}

export { useNotification, NotificationContextProvider };
