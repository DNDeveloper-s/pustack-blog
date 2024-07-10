export class Section {
  private _id: string;
  title: string;
  icon: string;
  content: string;
  index: number;

  get id() {
    return this._id;
  }

  constructor(index: number, title: string, icon: string, content: string) {
    this._id = Math.random().toString(36).substr(2, 9) + "-" + Date.now();
    this.index = index;
    this.title = title;
    this.icon = icon
      ? icon
      : "https://pustack-blog.vercel.app/assets/images/furtherreading.png";
    this.content = content;
  }

  updateIndex(index: number) {
    this.index = index;
  }

  updateContent(content: string) {
    this.content = content;
  }

  updateTitle(title: string) {
    this.title = title;
  }

  updateIcon(icon: string) {
    this.icon = icon;
  }

  trimContent(content: string) {
    return HTMLParser.trimHTML(content);
  }

  static createFactory(sections: any[]) {
    return sections.map((section, index) => {
      return new Section(index, section.title, section.icon, section.content);
    });
  }

  static toPlainObject(sections: Section | Section[]) {
    if (sections instanceof Section) {
      return {
        id: sections.id,
        title: sections.title,
        icon: sections.icon,
        content: sections.content,
        index: sections.index,
      };
    } else {
      return sections.map((section) => {
        return {
          id: section.id,
          title: section.title,
          icon: section.icon,
          content: section.content,
          index: section.index,
        };
      });
    }
  }

  static mergedContent(sections: Section[], shouldTrim = false) {
    // Sections content is an html string
    return sections.reduce((acc, section) => {
      const content = shouldTrim
        ? HTMLParser.trimHTML(section.content)
        : section.content;
      return acc + content;
    }, "");
  }
}

class HTMLParser {
  static trimHTML(html: string) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const body = doc.body;
    function trimArray(arr: ChildNode[]) {
      let index = 0;
      while (true) {
        const el = arr[index];
        if (
          el?.nodeName === "IFRAME" ||
          el?.textContent?.trim() !== "" ||
          !Array.from(el.childNodes).every((c) => c.nodeName === "BR")
        ) {
          break;
        }
        index++;
      }
      return arr.slice(index);
    }
    function nodesToInnerHTMLString(nodes: any[]) {
      const container = document.createElement("div");
      nodes.forEach((node) => container.appendChild(node.cloneNode(true)));
      return container.innerHTML;
    }
    function trimEmptyElements(parentNode: HTMLElement) {
      const children = Array.from(parentNode.childNodes);

      const arr = trimArray(children);
      const finalArray = trimArray(arr.reverse());

      finalArray.reverse();

      return nodesToInnerHTMLString(finalArray);
    }
    return trimEmptyElements(body);
  }
}
