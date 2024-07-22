import { Popover } from "antd";
import { useState } from "react";
import { FaGripLines, FaGripLinesVertical } from "react-icons/fa6";
import { Editor, Node, Path, Transforms } from "slate";
import { useSlate } from "slate-react";

export const TableElement = ({ attributes, children, element }: any) => {
  return (
    <table {...attributes} className="w-full">
      <tbody>{children}</tbody>
    </table>
  );
};

export const TableRowElement = ({ attributes, children, element }: any) => {
  return <tr {...attributes}>{children}</tr>;
};

const insertColumn = (
  editor: Editor,
  tablePath: Path,
  colIndex: number,
  position: any
) => {
  const [tableNode] = Editor.node(editor, tablePath);

  //@ts-ignore
  tableNode.children.forEach((row: any, rowIndex: number) => {
    const cellPath = [
      ...tablePath,
      rowIndex,
      position === "left" ? colIndex : colIndex + 1,
    ];
    Transforms.insertNodes(
      editor,
      {
        type: "table-cell",
        children: [{ text: "" }],
      },
      { at: cellPath }
    );
  });
};

const insertRow = (
  editor: Editor,
  tablePath: Path,
  rowIndex: number,
  position: any
) => {
  const [tableNode] = Editor.node(editor, tablePath);

  const newRow = {
    type: "table-row",
    children: Array.from(
      // @ts-ignore
      { length: tableNode.children[0].children.length },
      () => ({
        type: "table-cell",
        children: [{ text: "" }],
      })
    ),
  };

  const insertPath = [
    ...tablePath,
    position === "above" ? rowIndex : rowIndex + 1,
  ];

  // @ts-ignore
  Transforms.insertNodes(editor, newRow, { at: insertPath });
};

const isFirstCellInRow = (editor: Editor, cellPath: Path) => {
  const colIndex = cellPath[cellPath.length - 1];
  return colIndex === 0;
};

const isFirstCellInColumn = (editor: Editor, cellPath: Path) => {
  const rowIndex = cellPath[cellPath.length - 2];
  return rowIndex === 0;
};

const colOptions = [
  { id: "insert-left", label: "Insert Left" },
  { id: "insert-right", label: "Insert Right" },
  { id: "delete", label: "Delete" },
];

function TableColumnOptions({ onClick }: { onClick: (option: any) => void }) {
  return (
    <div className="max-w-[200px] w-[80vw]  rounded p-2 flex flex-col gap-2 shadow-xl">
      {colOptions.map((option) => (
        <div
          key={option.id}
          onClick={() => onClick(option)}
          className="hover:bg-primary transition-all cursor-pointer text-sm py-1 px-3 rounded"
        >
          <span>{option.label}</span>
        </div>
      ))}
    </div>
  );
}

const rowOptions = [
  { id: "insert-above", label: "Insert Above" },
  { id: "insert-below", label: "Insert Below" },
  { id: "delete", label: "Delete" },
];

function TableRowOptions({ onClick }: { onClick: (option: any) => void }) {
  return (
    <div className="max-w-[200px] w-[80vw]  rounded p-2 flex flex-col gap-2 shadow-xl">
      {rowOptions.map((option) => (
        <div
          key={option.id}
          onClick={() => onClick(option)}
          className="hover:bg-primary transition-all cursor-pointer text-sm py-1 px-3 rounded"
        >
          <span>{option.label}</span>
        </div>
      ))}
    </div>
  );
}

export const TableCellElement = ({
  attributes,
  children,
  element,
  cellPath,
  tablePath,
  hoveredCellPath,
  setHoveredCellPath,
}: any) => {
  const editor = useSlate();
  const [openCol, setOpenCol] = useState(false);
  const [openRow, setOpenRow] = useState(false);
  // const handleInsertColumn = (position: string) => {
  //   const colIndex = cellPath[cellPath.length - 1];
  //   insertColumn(editor, tablePath, colIndex, position);
  // };

  // const handleInsertRow = (position: string) => {
  //   const rowIndex = cellPath[cellPath.length - 2];
  //   insertRow(editor, tablePath, rowIndex, position);
  // };
  const handleMouseEnter = () => {
    if (openCol || openRow) {
      return;
    }
    setHoveredCellPath(cellPath);
  };

  const handleMouseLeave = () => {
    if (openCol || openRow) {
      return;
    }
    setHoveredCellPath(null);
  };

  const colIndex = cellPath[cellPath.length - 1];
  const rowIndex = cellPath[cellPath.length - 2];

  if (rowIndex === 0) {
    console.log("First row - ", cellPath);
  }

  if (colIndex === 0) {
    console.log("First column - ", cellPath);
  }

  console.log("hoveredCellPath - ", hoveredCellPath);

  const isFirstCellInHoveredColumn =
    hoveredCellPath &&
    hoveredCellPath[hoveredCellPath.length - 1] === colIndex &&
    rowIndex === 0;
  const isFirstCellInHoveredRow =
    hoveredCellPath &&
    hoveredCellPath[hoveredCellPath.length - 2] === rowIndex &&
    colIndex === 0;

  const handleOpenColChange = (open: boolean) => {
    setOpenCol(open);
  };

  const handleOpenRowChange = (open: boolean) => {
    setOpenRow(open);
  };

  const handleColClick = (option: any) => {
    if (option.id === "insert-left") {
      insertColumn(editor, tablePath, colIndex, "left");
    } else if (option.id === "insert-right") {
      insertColumn(editor, tablePath, colIndex, "right");
    }
    setOpenCol(false);
  };

  const handleRowClick = (option: any) => {
    if (option.id === "insert-above") {
      insertRow(editor, tablePath, rowIndex, "above");
    } else if (option.id === "insert-below") {
      insertRow(editor, tablePath, rowIndex, "below");
    }
    setOpenRow(false);
  };

  return (
    <td
      {...attributes}
      className="border relative border-slate-400 px-3 py-1.5"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={
          "absolute left-0 right-0 top-[-0.6rem] mx-auto w-min transition-all " +
          (isFirstCellInHoveredColumn ? "opacity-100" : "opacity-0")
        }
        contentEditable={false}
      >
        <Popover
          content={<TableColumnOptions onClick={handleColClick} />}
          trigger="click"
          open={openCol}
          onOpenChange={handleOpenColChange}
          placement={"bottomLeft"}
          overlayClassName="overlayClassName_icon_list fontSize_overlayClassName"
          overlayInnerStyle={{
            background: "var(--antd-arrow-background-color)",
          }}
          style={{ padding: 0 }}
        >
          <div className="cursor-pointer">
            <div className="cursor-pointer rounded-lg border bg-gray-100 px-1 hover:bg-gray-300 transition-all">
              <FaGripLines />
            </div>
          </div>
        </Popover>
      </div>
      <div
        className={
          "absolute bottom-0 left-[-0.9rem] top-0 my-auto h-min w-min space-y-1 " +
          (isFirstCellInHoveredRow ? "opacity-100" : "opacity-0")
        }
        contentEditable={false}
      >
        <Popover
          content={<TableRowOptions onClick={handleRowClick} />}
          trigger="click"
          open={openRow}
          onOpenChange={handleOpenRowChange}
          placement={"bottomLeft"}
          overlayClassName="overlayClassName_icon_list fontSize_overlayClassName"
          overlayInnerStyle={{
            background: "var(--antd-arrow-background-color)",
          }}
          style={{ padding: 0 }}
        >
          <div className="cursor-pointer">
            <div className="cursor-pointer rounded-lg border bg-gray-100 px-1 hover:bg-gray-300 transition-all">
              <FaGripLinesVertical />
            </div>
          </div>
        </Popover>
      </div>
      {children}
      {/* <div>
        <button
          onMouseDown={(event) => {
            event.preventDefault();
            handleInsertColumn("left");
          }}
        >
          Insert Left
        </button>
        <button
          onMouseDown={(event) => {
            event.preventDefault();
            handleInsertColumn("right");
          }}
        >
          Insert Right
        </button>
        <button
          onMouseDown={(event) => {
            event.preventDefault();
            handleInsertRow("above");
          }}
        >
          Insert Row Above
        </button>
        <button
          onMouseDown={(event) => {
            event.preventDefault();
            handleInsertRow("below");
          }}
        >
          Insert Row Below
        </button>
      </div> */}
    </td>
  );
};
