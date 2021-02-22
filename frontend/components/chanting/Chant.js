import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { createElement, useMemo } from "react";

const useStyles = makeStyles((theme) => ({
  root: ({ highlight, textZoom }) => ({
    maxWidth: "32.5em",
    margin: "0 auto",
    color: theme.palette.text.primary,
    fontSize: textZoom ? "1.8rem" : "1.25rem",
    fontFamily: '"Helvetica", sans-serif',
    [theme.breakpoints.up("sm")]: {
      marginTop: "4em",
      marginBottom: "10em",
    },
    "& h1": {
      margin: "0 0",
      padding: "0.25em 0.625em",
      fontSize: "1.6em",
    },
    "& h2": {
      margin: "0.25em 0",
      padding: "0.25em 0.7143em",
      fontSize: "1.4em",
    },
    "& h3": {
      margin: "0.25em 0",
      padding: "0.25em 0.7692em",
      fontSize: "1.3em",
    },
    "& h2, & h3": {
      paddingBottom: 0,
      borderBottom: `1px solid ${theme.palette.text.secondary}`,
      marginBottom: "1em",
    },
    "& h2:not(:first-child), & h3:not(:first-child)": {
      marginTop: "1em",
    },
    "& .chant-group": {
      margin: "0.8em 0",
    },
    "& .chant-verse": {
      padding: "0.1em 1em 0.2em",
      lineHeight: "1.6em",
      fontFamily: "Gentium Incantation",
      transition: "background-color 1s ease-out",
      "&.chant-active": {
        backgroundColor: highlight ? "rgba(255, 255, 0, 0.4)" : "inherit",
      },
    },
    "&.chant-lang-mixed": {
      ["& .chant-group.chant-lang-en .chant-verse, & .chant-verse.chant-lang-en"]: {
        paddingLeft: "2.95em",
        fontStyle: "italic",
      },
      ["& .chant-verse.chant-lang-en"]: {
        fontStyle: "italic",
      },
    },
    "& .chant-group .chant-verse.chant-leader": {
      paddingLeft: "2.95em",
    },
    "& .chant-grid": {
      display: "table",
      margin: "1em auto",
      "& .chant-row": {
        display: "table-row",
        "& .chant-verse": {
          display: "table-cell",
          paddingLeft: "0.5em",
          paddingRight: "0.5em",
        },
      },
    },
    "& aside": {
      marginTop: "0.25em",
      paddingLeft: "4.3em",
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
