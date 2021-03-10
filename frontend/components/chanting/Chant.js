import clsx from "clsx";
import { createElement, memo } from "react";

const typeClassMap = {
  group: "chant-group",
  grid: "chant-grid",
  raw: "chant-raw",
  row: "chant-row",
  verse: "chant-verse",
};

const typeTagMap = {
  raw: "div",
  verse: "div",
};

const classNameWithLang = (node, className) =>
  clsx(
    className,
    node?.lang && `chant-lang-${node.lang}`,
    node?.center && "chant-center",
    node?.right && "chant-right",
    node?.leader && "chant-leader"
  );

const deOrphan = (html) => {
  const match = String(html ?? "").match(/^(.+) +(\S{1,7})$/);
  if (match) {
    return match[1] + "&nbsp;" + match[2];
  } else {
    return html;
  }
};

const createNodeElement = (node, key) => {
  const type = node?.type;
  if (node?.html) {
    const tag = typeTagMap[type] ?? type ?? "div";
    return createElement(tag, {
      className: clsx(classNameWithLang(node), typeClassMap[type]),
      id: node?.domId,
      key,
      dangerouslySetInnerHTML: { __html: deOrphan(node.html) },
    });
  } else if (node?.children) {
    return (
      <div key={key} className={classNameWithLang(node, typeClassMap[type])}>
        {node.children.map?.((node, index) => createNodeElement(node, index))}
      </div>
    );
  } else {
    return null;
  }
};

const Chant = memo(({ chant }) => {
  const form = chant?.form;
  const className = clsx("chant-chant", classNameWithLang(form));
  return (
    <div className={className} id={chant?.domId}>
      {form?.title && <h2>{form.title}</h2>}
      {form?.children?.map?.((node, index) => createNodeElement(node, index))}
    </div>
  );
});

Chant.displayName = "Chant";

export default Chant;
