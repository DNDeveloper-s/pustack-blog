"use client";

import { Drawer } from "antd";
import { IoCloseSharp } from "react-icons/io5";

interface PageDrawerProps {
  children: React.ReactNode;
  open: boolean;
  onClose: () => void;
}
export default function PageDrawer({
  children,
  open,
  onClose,
}: PageDrawerProps) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      classNames={{
        wrapper: "bg-primary h-screen w-screen",
      }}
      placement="bottom"
      styles={{
        header: {
          display: "none",
        },
        body: {
          padding: 0,
        },
        wrapper: {
          height: "100%",
        },
      }}
    >
      <div className="h-full flex flex-col overflow-hidden">
        <div className="overflow-auto flex-1 bg-primary">
          {open ? children : null}
        </div>
        <div
          onClick={onClose}
          className="py-3 w-full flex-shrink-0 flex items-center justify-center bg-black"
        >
          <IoCloseSharp className="text-white text-2xl" />
        </div>
      </div>
    </Drawer>
  );
}
