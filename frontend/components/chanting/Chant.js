import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { createElement } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "29.2em",
    margin: "0 auto",
    color: theme.palette.text.primary,
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
    },
    "& .chant-active": {
      backgroundColor: "rgba(200, 200, 0, 0.3)",
    },
    "&.chant-lang-mixed": {
      ["& .chant-group.chant-lang-en, & .chant-verse.chant-lang-en"]: {
        marginLeft: "1.8em",
        fontStyle: "italic",
      },
      ["& .chant-verse.chant-lang-en"]: {
        fontStyle: "italic",
      },
    },
    "& .chant-group .chant-verse.chant-leader": {
      marginLeft: "1.8em",
    },
    "& .chant-grid": {
      display: "table",
      margin: "1em auto",
      "& .chant-row": {
        display: "table-row",
        "& .chant-verse": {
          display: "table-cell",
        },
      },
      "& .chant-row:not(:last-child) .chant-verse": {
        paddingBottom: "0.5em",
      },
      "& .chant-row .chant-verse:not(:last-child)": {
        paddingRight: "1em",
      },
    },
    "& aside": {
      marginTop: "1.5em",
      marginLeft: "2.9em",
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
  },
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

const Chant = ({ chant, activeIndex }) => {
  const classes = useStyles();

  const className = classNameWithLang(chant, classes.root);
  let walkIndex = 0;

  const walkNode = (node, key) => {
    if (node?.html) {
      const tag = node.type !== "verse" ? node.type : "div";
      const className = clsx(
        node.type === "verse" && classNameWithLang(node, "chant-verse"),
        node.start && "chant-start",
        walkIndex === activeIndex && "chant-active"
      );
      walkIndex += 1;
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

  return <div className={className}>{walkNode(chant)}</div>;
};

Chant.displayName = "Chant";

export default Chant;
