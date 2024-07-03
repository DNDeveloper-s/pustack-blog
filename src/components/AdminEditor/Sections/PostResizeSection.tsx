import { useRef } from "react";
import { Section } from "./Section";
import { useDrag, useDrop } from "react-dnd";

interface PostResizeSectionProps {
  id: any;
  section: Section;
  index: number;
  moveCard: (dragIndex: number, hoverIndex: number) => void;
  deleteCard: (index: number) => void;
}
export default function PostResizeSection({
  id,
  section,
  index,
  moveCard,
}: PostResizeSectionProps) {
  const ref = useRef(null);
  const [, drop] = useDrop({
    accept: "card",
    hover(item, monitor) {
      if (!ref.current) {
        return;
      }
      // @ts-ignore
      const dragIndex = item.index;
      const hoverIndex = index;
      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }
      // Determine rectangle on screen
      // @ts-ignore
      const hoverBoundingRect = ref.current.getBoundingClientRect();
      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      // Determine mouse position
      const clientOffset = monitor.getClientOffset();
      // Get pixels to the top
      // @ts-ignore
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%
      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }
      // Time to actually perform the action
      moveCard(dragIndex, hoverIndex);
      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      // @ts-ignore
      item.index = hoverIndex;
    },
  });
  const [{ isDragging }, drag] = useDrag({
    item: { type: "card", id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
    type: "card",
  });
  const opacity = isDragging ? 0 : 1;

  drag(drop(ref));

  return (
    <div
      className="relative post-resize-section-card"
      style={{ opacity, cursor: "move", animationDelay: index * 0.25 + "s" }}
      ref={ref}
    >
      <div
        className="blog-post-container pt-3 px-3 pb-2.5 bg-lightPrimary relative my-5"
        style={{ border: "1px dashed #1f1f1f1d" }}
      >
        <div className="styles_title" style={{ margin: 0 }}>
          <h2 style={{ margin: 0 }}>
            <span className="inline-flex mr-2">
              <img
                style={{ height: "16px", width: "auto", display: "inline" }}
                src={section.icon}
                alt="Icon"
              />
            </span>
            {section.title}
          </h2>
        </div>
      </div>
    </div>
  );
}
