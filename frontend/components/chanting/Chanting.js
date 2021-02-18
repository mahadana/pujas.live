import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { createElement, forwardRef } from "react";

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
    "& .chant-verse-active": {
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

const classWithLang = (node, className) =>
  clsx(
    className,
    node?.lang && `chant-lang-${node.lang}`,
    node?.leader && "chant-leader"
  );

const ChantVerse = ({ verse }) => (
  <div
    className={clsx(
      classWithLang(verse, "chant-verse"),
      verse.active && "chant-verse-active"
    )}
    dangerouslySetInnerHTML={{ __html: verse?.html }}
  />
);

const ChantRow = ({ row }) => (
  <div className={classWithLang(row, "chant-row")}>
    {row?.children?.map?.((verse, index) => (
      <ChantVerse key={index} verse={verse} />
    ))}
  </div>
);

const ChantGrid = ({ grid }) => (
  <div className={classWithLang(grid, "chant-grid")}>
    {grid?.children?.map?.((row, index) => (
      <ChantRow key={index} row={row} />
    ))}
  </div>
);

const ChantGroup = ({ group }) => (
  <div className={classWithLang(group, "chant-group")}>
    {group?.children?.map?.((verse, index) => (
      <ChantVerse key={index} verse={verse} />
    ))}
  </div>
);

const Chant = forwardRef(({ chant }, ref) => {
  const classes = useStyles();
  const className = clsx(
    classes.root,
    chant?.lang && `chant-lang-${chant.lang}`
  );
  return (
    <div className={className} ref={ref}>
      <h1>{chant.title}</h1>
      {chant?.children?.map?.((node, index) => {
        if (node?.type === "group") {
          return <ChantGroup key={index} group={node} />;
        } else if (node?.type === "grid") {
          return <ChantGrid key={index} grid={node} />;
        } else {
          return createElement(node?.type || "div", {
            className: node.start ? "chant-start" : undefined,
            key: index,
            dangerouslySetInnerHTML: { __html: node?.html },
          });
        }
      })}
    </div>
  );
});

Chant.displayName = "Chant";

export default Chant;
