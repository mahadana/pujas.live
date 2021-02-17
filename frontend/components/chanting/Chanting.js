import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import { createElement } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.text.primary,
    fontFamily: '"Helvetica", sans-serif',
    "& h1, & h2": {
      borderBottom: `1px solid ${theme.palette.text.secondary}`,
      margin: "0.5em 0",
    },
    "& h2, & h3": {
      color: theme.palette.text.secondary,
    },
    "& h2:not(:first-child), & h3:not(:first-child)": {
      marginTop: "1em",
    },
    "& .chanting-group": {
      margin: "1em 0",
    },
    "& .chanting-verse": {
      lineHeight: "1.8em",
      fontFamily: "Gentium Incantation",
      transition: "background-color 1s cubic-bezier(0,1,.7,1)",
    },
    "& .chanting-verse-active": {
      backgroundColor: "rgba(200, 200, 0, 0.3)",
    },
    "&.chanting-mixed": {
      ["& .chanting-group.chanting-en, & .chanting-verse.chanting-en"]: {
        marginLeft: "2em",
        fontStyle: "italic",
      },
      ["& .chanting-verse.chanting-en"]: {
        fontStyle: "italic",
      },
    },
    "& .chanting-grid": {
      display: "table",
      margin: "1em auto",
      "& .chanting-row": {
        display: "table-row",
        "& .chanting-verse": {
          display: "table-cell",
        },
      },
      "& .chanting-row:not(:last-child) .chanting-verse": {
        paddingBottom: "0.5em",
      },
      "& .chanting-row .chanting-verse:not(:last-child)": {
        paddingRight: "1em",
      },
    },
    "& aside": {
      textAlign: "center",
      fontSize: "0.9em",
      fontWeight: "bold",
      color: theme.palette.text.secondary,
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
  clsx(className, node?.lang && `chanting-${node.lang}`);

const ChantingVerse = ({ verse }) => (
  <div
    className={clsx(
      classWithLang(verse, "chanting-verse"),
      verse.active && "chanting-verse-active"
    )}
    dangerouslySetInnerHTML={{ __html: verse?.html }}
  />
);

const ChantingRow = ({ row }) => (
  <div className={classWithLang(row, "chanting-row")}>
    {row?.children?.map?.((verse, index) => (
      <ChantingVerse key={index} verse={verse} />
    ))}
  </div>
);

const ChantingGrid = ({ grid }) => (
  <div className={classWithLang(grid, "chanting-grid")}>
    {grid?.children?.map?.((row, index) => (
      <ChantingRow key={index} row={row} />
    ))}
  </div>
);

const ChantingGroup = ({ group }) => (
  <div className={classWithLang(group, "chanting-group")}>
    {group?.children?.map?.((verse, index) => (
      <ChantingVerse key={index} verse={verse} />
    ))}
  </div>
);

const Chanting = ({ chanting }) => {
  const classes = useStyles();
  const className = clsx(
    classes.root,
    chanting?.lang && `chanting-${chanting.lang}`
  );
  return (
    <div className={className}>
      {chanting?.children?.map?.((node, index) => {
        if (node?.type === "group") {
          return <ChantingGroup key={index} group={node} />;
        } else if (node?.type === "grid") {
          return <ChantingGrid key={index} grid={node} />;
        } else {
          return createElement(node?.type || "div", {
            key: index,
            dangerouslySetInnerHTML: { __html: node?.html },
          });
        }
      })}
    </div>
  );
};

export default Chanting;
