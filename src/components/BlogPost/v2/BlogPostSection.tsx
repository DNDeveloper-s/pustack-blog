import { Section } from "@/components/AdminEditor/Sections/Section";
import useRenderHtml from "@/hooks/useRenderHtml";
import { MathJax, MathJaxContext } from "better-react-mathjax";

interface BlogPostSectionProps {
  section: Section;
  className?: string;
}
export default function BlogPostSection({
  section,
  className,
}: BlogPostSectionProps) {
  const elements = useRenderHtml(section.content, true);

  return (
    <section
      id={section.id}
      className={className ?? "blog-post-container relative mb-6 py-4"}
    >
      {section.index !== 0 && <div className="styles_divider"></div>}
      <div className="styles_title">
        <h2>
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
      <div className="styles_text">
        <MathJaxContext>
          <MathJax>{elements}</MathJax>
        </MathJaxContext>
      </div>
    </section>
  );
}
