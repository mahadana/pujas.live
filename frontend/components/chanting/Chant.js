import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { createElement, useMemo } from "react";

const useStyles = makeStyles((theme) => ({
  root: ({ highlight, textZoom }) => ({
    maxWidth: "29.2em",
    margin: "0 auto",
    color: theme.palette.text.primary,
    fontSize: textZoom ? "1.8rem" : "1.25rem",
    fontFamily: '"Helvetica", sans-serif',
    "& h1, & h2": {
      margin: "0.5em 0",
    },
    "& h2, & h3": {
      borderBottom: `1px solid ${theme.palette.text.secondary}`,
      color: theme.palette.text.secondary,
    },
    "& h2:not(:first-child), & h3:not(:first-child)": {
      marginTop: "1em",
    },
    "& .chant-group": {
      margin: "1em 0",
    },
    "& .chant-verse": {
      lineHeight: "1.8em",
      fontFamily: "Gentium Incantation",
      transition: "background-color 1s cubic-bezier(0,1,.7,1)",
      "&.chant-active": {
        backgroundColor: highlight ? "rgba(255, 255, 0, 0.4)" : "inherit",
      },
    },
    "&.chant-lang-mixed": {
      ["& .chant-group.chant-lang-en, & .chant-verse.chant-lang-en"]: {
        paddingLeft: "1.8em",
        fontStyle: "italic",
      },
      ["& .chant-verse.chant-lang-en"]: {
        fontStyle: "italic",
      },
    },
    "& .chant-group .chant-verse.chant-leader": {
      paddingLeft: "1.8em",
    },
    "& .chant-grid": {
      display: "table",
      margin: "1em auto",
      "& .chant-row": {
        display: "table-row",
        "& .chant-verse": {
          display: "table-cell",
          padding: "0.25em 0.5em",
          // paddingTop: "0.25em",
          // paddingBottom: "0.25em",
        },
      },
      "& .chant-row .chant-verse:not(:last-child)": {
        // paddingRight: "1em",
      },
    },
    "& aside": {
      marginTop: "1.5em",
      paddingLeft: "2.9em",
      fontSize: "0.8em",
      lineHeight: "1.5em",
      fontWeight: "bold",
      color: theme.palette.text.secondary,
      textTransform: "uppercase",
      textIndent: "-0.6em",
      "&:before": {
        content: '"[ "',
      },
      "&:after": {
        content: '" ]"',
      },
    },
    "& u": {
      display: "inline-block",
    },
  }),
}));

const classNameWithLang = (node, className) =>
  clsx(
    className,
    node?.lang && `chant-lang-${node.lang}`,
    node?.leader && "chant-leader"
  );

const groupTypeMap = {
  group: "chant-group",
  grid: "chant-grid",
  row: "chant-row",
};

const walkNode = (node, key) => {
  if (node?.html) {
    const tag = node.type !== "verse" ? node.type : "div";
    const className = clsx(
      node.type === "verse" && classNameWithLang(node, "chant-verse"),
      node.start && "chant-start"
    );
    return createElement(tag, {
      className,
      id: `chant-text-index-${node.textIndex}`,
      key,
      dangerouslySetInnerHTML: { __html: node.html },
    });
  } else if (node?.children) {
    return (
      <div
        key={key}
        className={classNameWithLang(node, groupTypeMap[node.type])}
      >
        {node.children.map?.((node, index) => walkNode(node, index))}
      </div>
    );
  } else {
    return null;
  }
};

const Chant = ({ chant, highlight, textZoom }) => {
  const classes = useStyles({ highlight, textZoom });
  const className = classNameWithLang(chant, classes.root);
  const children = useMemo(() => walkNode(chant), [chant]);
  return <div className={className}>{children}</div>;
};

Chant.displayName = "Chant";

export default Chant;
