import { useCallback, useRef, useState } from "react";
import { Section } from "./Section";
import { useDrag, useDrop } from "react-dnd";
import SectionEditor from "./SectionEditor";
import { MdEdit } from "react-icons/md";
import SectionPreview from "./SectionPreview";

const style = {
  border: "1px dashed #1f1f1f1d",
  //   padding: "0.5rem 1rem",
  marginBottom: ".5rem",
  backgroundColor: "rgb(252 250 228)",
};

interface PostSectionProps {
  section: Section;
  index: number;
  deleteCard: (index: number) => void;
}
export default function PostSection({
  index,
  section,
  deleteCard,
}: PostSectionProps) {
  const [editMode, setEditMode] = useState(!section.content);
  const handleViewMode = (viewMode: boolean) => {
    setEditMode(!viewMode);
  };

  return editMode ? (
    <div style={{ ...style }}>
      <SectionEditor
        handleViewMode={handleViewMode}
        onDelete={() => deleteCard(index)}
        section={section}
      />
    </div>
  ) : (
    <SectionPreview section={section} handleViewMode={handleViewMode} />
  );
}
