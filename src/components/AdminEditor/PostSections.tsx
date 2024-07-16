import {
  MutableRefObject,
  RefObject,
  createRef,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import update from "immutability-helper";
import PostSection from "./Sections/PostSection";
import { Section } from "./Sections/Section";
import PostResizeSection from "./Sections/PostResizeSection";

const CreateSectionButton = ({ onClick }: { onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="border border-dashed border-[#1f1f1f1d] w-full flex items-center py-2 justify-center text-medium text-appBlack bg-[#ece7b8]"
    >
      Add Section
    </button>
  );
};

const RearrangeButton = ({
  onClick,
  label,
}: {
  onClick: () => void;
  label?: string;
}) => {
  return (
    <button
      onClick={onClick}
      className="border border-dashed border-[#1f1f1f1d] w-full flex items-center py-2 justify-center text-medium text-appBlack bg-[#ece7b8]"
    >
      {label ?? "Arrange"}
    </button>
  );
};

export interface PostSectionsRef {
  getSections: () => Section[];
  isResizing: () => boolean;
  getSectionsRef: () => any;
}

function PostSections(props: { sections?: Section[] }, ref: any) {
  const [resizeMode, setResizeMode] = useState(false);
  const [sections, setSections] = useState<Section[]>([
    new Section(
      0,
      "",
      "https://pustack-blog.vercel.app/assets/images/furtherreading.png",
      ""
    ),
  ]);
  const sectionsRef = useRef([createRef()]);

  useEffect(() => {
    // Ensure the refs array has the same length as the elements array
    if (sections.length !== sectionsRef.current.length + 1) {
      sectionsRef.current = Array(sections.length + 1)
        .fill(1)
        .map((_, i) => sectionsRef.current[i] || createRef());
    }
  }, [sections]);

  const moveCard = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      const dragCard = sections[dragIndex];
      setSections(
        update(sections, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragCard],
          ],
        })
      );
    },
    [sections]
  );
  const deleteCard = useCallback(
    (index: number) => {
      setSections(sections.filter((_, i) => i !== index));
    },
    [sections]
  );

  useImperativeHandle<any, PostSectionsRef>(ref, () => ({
    getSections: () => {
      return sections;
    },
    isResizing: () => resizeMode,
    getSectionsRef: () => {
      return sectionsRef;
    },
  }));

  useEffect(() => {
    sections.map((section, i) => {
      section.updateIndex(i);
    });
  }, [sections]);

  useEffect(() => {
    setSections(
      props.sections ?? [
        new Section(
          0,
          "",
          "https://pustack-blog.vercel.app/assets/images/furtherreading.png",
          ""
        ),
      ]
    );
  }, [props.sections]);

  const renderCard = (section: Section, index: number) => {
    if (resizeMode) {
      return (
        <PostResizeSection
          key={section.id}
          index={index}
          id={section.id}
          section={section}
          moveCard={moveCard}
          deleteCard={deleteCard}
        />
      );
    }
    return (
      <PostSection
        key={section.id}
        index={index}
        section={section}
        deleteCard={deleteCard}
        // @ts-ignore
        ref={sectionsRef.current[index]}
      />
    );
  };
  const handleAddSection = () => {
    setSections((c) => [
      ...c,
      new Section(
        c.length,
        "",
        "https://pustack-blog.vercel.app/assets/images/furtherreading.png",
        ""
      ),
    ]);
  };

  return (
    <div className="w-full max-w-[1100px] mx-auto">
      {sections.map((section, i) => renderCard(section, i))}
      <div className="w-full my-5 flex items-center gap-4 md:flex-row flex-col">
        {resizeMode ? (
          <>
            <div className="flex-1">
              <RearrangeButton
                onClick={() => {
                  setResizeMode(false);
                }}
                label="Done"
              />
            </div>
          </>
        ) : (
          <>
            <div className="flex-1">
              <CreateSectionButton onClick={handleAddSection} />
            </div>
            {sections.length > 1 && (
              <div className="flex-1">
                <RearrangeButton
                  onClick={() => {
                    setResizeMode(true);
                  }}
                  label="Arrange Section Order"
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default forwardRef<PostSectionsRef, { sections?: Section[] }>(
  PostSections
);
