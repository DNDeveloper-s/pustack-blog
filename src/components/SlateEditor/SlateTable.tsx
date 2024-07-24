import { Popover } from "antd";
import { useState } from "react";
import { FaGripLines, FaGripLinesVertical } from "react-icons/fa6";
import { Editor, Node, Path, Transforms } from "slate";
import { ReactEditor, useReadOnly, useSlate } from "slate-react";
import {
  Popover as NextPopover,
  PopoverContent,
  PopoverTrigger,
} from "@nextui-org/popover";

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

const duplicateColumn = (editor: Editor, cellPath: Path) => {
  const rowPath = Path.parent(cellPath);
  const tablePath = Path.parent(rowPath);
  const colIndex = cellPath[cellPath.length - 1];

  const [tableNode] = Editor.node(editor, tablePath);

  Editor.withoutNormalizing(editor, () => {
    // @ts-ignore
    tableNode.children.forEach((row, rowIndex) => {
      const cellPathToDuplicate = [...tablePath, rowIndex, colIndex];
      const newCellPath = [...tablePath, rowIndex, colIndex + 1];

      const [cellToDuplicate] = Editor.node(editor, cellPathToDuplicate);

      // Insert a duplicate of the current cell
      Transforms.insertNodes(editor, cellToDuplicate, { at: newCellPath });
    });
  });
};

const duplicateRow = (editor: Editor, cellPath: Path) => {
  const rowPath = Path.parent(cellPath);
  const tablePath = Path.parent(rowPath);
  const rowIndex = rowPath[rowPath.length - 1];

  const [tableNode] = Editor.node(editor, tablePath);

  Editor.withoutNormalizing(editor, () => {
    const rowToDuplicatePath = [...tablePath, rowIndex];
    const newRowPath = [...tablePath, rowIndex + 1];

    const [rowToDuplicate] = Editor.node(editor, rowToDuplicatePath);

    // Insert a duplicate of the current row
    Transforms.insertNodes(editor, rowToDuplicate, { at: newRowPath });
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

const moveColumnRight = (editor: Editor, cellPath: Path) => {
  const rowPath = Path.parent(cellPath);
  const tablePath = Path.parent(rowPath);
  const colIndex = cellPath[cellPath.length - 1];

  const [tableNode] = Editor.node(editor, tablePath);
  // @ts-ignore
  const isLastColumn = colIndex === tableNode.children[0].children.length - 1;

  if (!isLastColumn) {
    Editor.withoutNormalizing(editor, () => {
      // @ts-ignore
      tableNode.children.forEach((row, rowIndex) => {
        const currentCellPath = [...tablePath, rowIndex, colIndex];
        const nextCellPath = [...tablePath, rowIndex, colIndex + 1];

        const [currentCell] = Editor.node(editor, currentCellPath);

        Transforms.removeNodes(editor, { at: currentCellPath });
        Transforms.insertNodes(editor, currentCell, { at: nextCellPath });
      });
    });
  }
};

const moveColumnLeft = (editor: Editor, cellPath: Path) => {
  const rowPath = Path.parent(cellPath);
  const tablePath = Path.parent(rowPath);
  const colIndex = cellPath[cellPath.length - 1];

  if (colIndex > 0) {
    const [tableNode] = Editor.node(editor, tablePath);
    Editor.withoutNormalizing(editor, () => {
      // @ts-ignore
      tableNode.children.forEach((row, rowIndex) => {
        const currentCellPath = [...tablePath, rowIndex, colIndex];
        const prevCellPath = [...tablePath, rowIndex, colIndex - 1];

        const [currentCell] = Editor.node(editor, currentCellPath);

        // Now remove the current cell's original position
        Transforms.removeNodes(editor, { at: currentCellPath });
        // Insert the current cell at the previous cell's position
        Transforms.insertNodes(editor, currentCell, { at: prevCellPath });
      });
    });
  }
};

const moveRowUp = (editor: Editor, cellPath: Path) => {
  const rowPath = Path.parent(cellPath);
  const tablePath = Path.parent(rowPath);
  const rowIndex = rowPath[rowPath.length - 1];

  if (rowIndex > 0) {
    const [tableNode] = Editor.node(editor, tablePath);
    Editor.withoutNormalizing(editor, () => {
      const prevRowPath = [...tablePath, rowIndex - 1];
      const [currentRow] = Editor.node(editor, rowPath);

      // Remove the current row from its original position
      Transforms.removeNodes(editor, { at: rowPath });

      // Insert the current row at the previous row's position
      Transforms.insertNodes(editor, currentRow, { at: prevRowPath });
    });
  }
};

const moveRowDown = (editor: Editor, cellPath: Path) => {
  const rowPath = Path.parent(cellPath);
  const tablePath = Path.parent(rowPath);
  const rowIndex = rowPath[rowPath.length - 1];

  const [tableNode] = Editor.node(editor, tablePath);
  // @ts-ignore
  const isLastRow = rowIndex === tableNode.children.length - 1;

  if (!isLastRow) {
    Editor.withoutNormalizing(editor, () => {
      const nextRowPath = [...tablePath, rowIndex + 1];
      const [currentRow] = Editor.node(editor, rowPath);

      // Remove the current row from its original position
      Transforms.removeNodes(editor, { at: rowPath });

      // Insert the current row at the next row's position
      Transforms.insertNodes(editor, currentRow, { at: nextRowPath });
    });
  }
};

const deleteRow = (editor: Editor, cellPath: Path) => {
  const rowPath = Path.parent(cellPath);

  Editor.withoutNormalizing(editor, () => {
    Transforms.removeNodes(editor, { at: rowPath });
  });
};

const deleteColumn = (editor: Editor, cellPath: Path) => {
  const rowPath = Path.parent(cellPath);
  const tablePath = Path.parent(rowPath);
  const colIndex = cellPath[cellPath.length - 1];

  const [tableNode] = Editor.node(editor, tablePath);

  Editor.withoutNormalizing(editor, () => {
    // @ts-ignore
    tableNode.children.forEach((row, rowIndex) => {
      const cellPathToRemove = [...tablePath, rowIndex, colIndex];
      Transforms.removeNodes(editor, { at: cellPathToRemove });
    });
  });
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
  { id: "move-left", label: "Move Left" },
  { id: "move-right", label: "Move Right" },
  { id: "duplicate", label: "Duplicate" },
  { id: "delete", label: "Delete" },
];

function TableColumnOptions({ onClick }: { onClick: (option: any) => void }) {
  return (
    <div className="max-w-[150px] w-[80vw] rounded flex flex-col gap-1 ">
      {colOptions.map((option) => (
        <div
          key={option.id}
          onClick={() => onClick(option)}
          className="hover:bg-primary transition-all cursor-pointer text-sm text-black py-1 px-3 rounded"
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
  { id: "move-up", label: "Move Up" },
  { id: "move-down", label: "Move Down" },
  { id: "duplicate", label: "Duplicate" },
  { id: "delete", label: "Delete" },
];

function TableRowOptions({ onClick }: { onClick: (option: any) => void }) {
  return (
    <div className="max-w-[150px] w-[80vw]  rounded flex flex-col gap-1">
      {rowOptions.map((option) => (
        <div
          key={option.id}
          onClick={() => onClick(option)}
          className="hover:bg-primary transition-all cursor-pointer text-sm py-1 px-3 text-black rounded"
        >
          <span>{option.label}</span>
        </div>
      ))}
    </div>
  );
}

const setHoverState = (editor: Editor, cellPath: Path) => {
  const rowPath = Path.parent(cellPath);
  const tablePath = Path.parent(rowPath);
  const colIndex = cellPath[cellPath.length - 1];
  const rowIndex = rowPath[rowPath.length - 1];

  // Set hover state on the first cell of the column
  const tableNode = Editor.node(editor, tablePath)[0];
  //@ts-ignore
  const columnCellPath = [...tablePath, 0, colIndex];
  const { history } = editor;
  const { undos } = history;

  history.undos = [];

  // @ts-ignore
  Transforms.setNodes(editor, { hoverColumn: true }, { at: columnCellPath });

  history.undos = undos;

  const rowCellPath = [...tablePath, rowIndex, 0];
  //@ts-ignore
  Transforms.setNodes(editor, { hoverRow: true }, { at: rowCellPath });

  // ReactEditor.focus(editor);
};

const clearHoverState = (editor: Editor) => {
  const { history } = editor;
  const { undos } = history;

  history.undos = [];

  Transforms.setNodes(
    editor,
    // @ts-ignore
    { hoverColumn: null, hoverRow: null },
    // @ts-ignore
    { match: (n) => n.type === "table-cell", at: [] }
  );

  history.undos = undos;

  // ReactEditor.focus(editor);
};

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
  const readonly = useReadOnly();
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
    // if (openCol || openRow) {
    //   return;
    // }
    setHoverState(editor, cellPath);
    setOpenCol(false);
    setOpenRow(false);
  };

  const handleMouseLeave = () => {
    // if (openCol || openRow) {
    //   return;
    // }
    clearHoverState(editor);
    setOpenCol(false);
    setOpenRow(false);
  };

  const colIndex = cellPath[cellPath.length - 1];
  const rowIndex = cellPath[cellPath.length - 2];

  // if (rowIndex === 0) {
  //   console.log("First row - ", cellPath);
  // }

  // if (colIndex === 0) {
  //   console.log("First column - ", cellPath);
  // }

  // console.log("hoveredCellPath - ", hoveredCellPath);

  // const isFirstCellInHoveredColumn =
  //   hoveredCellPath &&
  //   hoveredCellPath[hoveredCellPath.length - 1] === colIndex &&
  //   rowIndex === 0;
  // const isFirstCellInHoveredRow =
  //   hoveredCellPath &&
  //   hoveredCellPath[hoveredCellPath.length - 2] === rowIndex &&
  //   colIndex === 0;

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
    } else if (option.id === "move-left") {
      moveColumnLeft(editor, cellPath);
    } else if (option.id === "move-right") {
      moveColumnRight(editor, cellPath);
    } else if (option.id === "delete") {
      deleteColumn(editor, cellPath);
    } else if (option.id === "duplicate") {
      duplicateColumn(editor, cellPath);
    }
    setOpenCol(false);
  };

  const handleRowClick = (option: any) => {
    if (option.id === "insert-above") {
      insertRow(editor, tablePath, rowIndex, "above");
    } else if (option.id === "insert-below") {
      insertRow(editor, tablePath, rowIndex, "below");
    } else if (option.id === "move-up") {
      moveRowUp(editor, cellPath);
    } else if (option.id === "move-down") {
      moveRowDown(editor, cellPath);
    } else if (option.id === "delete") {
      deleteRow(editor, cellPath);
    } else if (option.id === "duplicate") {
      duplicateRow(editor, cellPath);
    }
    setOpenRow(false);
  };

  const isFirstCellInHoveredColumn = element.hoverColumn;
  const isFirstCellInHoveredRow = element.hoverRow;

  return (
    <td
      {...attributes}
      className="border relative border-slate-400 px-3 py-1.5"
      onMouseEnter={readonly ? null : handleMouseEnter}
      onMouseLeave={readonly ? null : handleMouseLeave}
      style={{
        backgroundColor: element.backgroundColor ?? "transparent",
      }}
    >
      {/* {!readonly && isFirstCellInHoveredColumn && ( */}
      <div
        className={
          "absolute left-0 right-0 top-[-0.6rem] mx-auto w-min transition-all " +
          (isFirstCellInHoveredColumn ? "opacity-100" : "opacity-0")
        }
        contentEditable={false}
      >
        <NextPopover
          classNames={{
            content: "!bg-lightPrimary rounded-none",
            base: "!w-[150px]",
          }}
          placement={"bottom"}
          color="secondary"
          offset={-10}
          isOpen={openCol}
          onOpenChange={handleOpenColChange}
        >
          <PopoverTrigger>
            <div className="cursor-pointer">
              <div className="cursor-pointer rounded-lg border bg-gray-100 px-1 hover:bg-gray-300 transition-all">
                <FaGripLines />
              </div>
            </div>
          </PopoverTrigger>
          <PopoverContent>
            <TableColumnOptions onClick={handleColClick} />
          </PopoverContent>
        </NextPopover>
      </div>
      {/* )} */}
      {!readonly && isFirstCellInHoveredRow && (
        <div
          className={
            "absolute bottom-0 left-[-0.9rem] top-0 my-auto h-min w-min space-y-1 " +
            (isFirstCellInHoveredRow
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none")
          }
          contentEditable={false}
        >
          <NextPopover
            classNames={{
              content: "!bg-lightPrimary rounded-none",
              base: "!w-[150px]",
            }}
            placement={"bottom-start"}
            color="secondary"
            offset={-10}
            isOpen={openRow}
            onOpenChange={handleOpenRowChange}
          >
            <PopoverTrigger>
              <div className="cursor-pointer">
                <div className="cursor-pointer rounded-lg border bg-gray-100 px-1 hover:bg-gray-300 transition-all">
                  <FaGripLinesVertical />
                </div>
              </div>
            </PopoverTrigger>
            <PopoverContent>
              <TableRowOptions onClick={handleRowClick} />
            </PopoverContent>
          </NextPopover>
        </div>
      )}
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
