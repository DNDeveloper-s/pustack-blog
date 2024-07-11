import {
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
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
  const moveCard = useCallback(
    (dragIndex: number, hoverIndex: number) => {
      console.log("dragIndex - ", dragIndex);
      console.log("hoverIndex - ", hoverIndex);
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
  }));

  useEffect(() => {
    sections.map((section, i) => {
      section.updateIndex(i);
    });
  }, [sections]);

  useEffect(() => {
    console.log("Props.sections | sections - ", props.sections);
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

  useEffect(() => {
    console.log("initial sections - ");
  }, []);

  console.log("sections - ", sections);

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
