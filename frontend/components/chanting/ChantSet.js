import { makeStyles } from "@material-ui/core/styles";
import { memo } from "react";

import Chant from "@/components/chanting/Chant";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "32.5em",
    margin: "0 auto",
    color: theme.palette.text.primary,
    fontFamily: "Gentium Incantation",
    [theme.breakpoints.up("sm")]: {
      marginTop: "30vh",
      marginBottom: "45vh",
    },
    "& h1, & h2, & h3, & h4, & h5, & h6": {
      fontFamily: "Ubuntu",
      letterSpacing: "0.01em",
    },
    "& h1": {
      margin: "0 0",
      padding: "0.25em 0.55em",
      fontSize: "1.6em",
      fontWeight: 300,
    },
    "& h2": {
      margin: "1em 0",
      padding: "0.25em 0.65em 0",
      borderBottom: `1px solid ${theme.palette.text.secondary}`,
      fontSize: "1.4em",
      fontWeight: 500,
    },
    "& h3": {
      margin: "1em 0 0.25em",
      padding: "0.25em 0.92em",
      fontSize: "1.1em",
      fontWeight: 500,
    },
    "& h4": {
      margin: "1em 0 0.25em",
      padding: "0.25em 1em",
      fontSize: "1em",
      fontWeight: 500,
    },
    "& .chant-chant": {
      paddingBottom: "1em",
    },
    "& .chant-group": {
      margin: "0.8em 0",
    },
    "& .chant-verse": {
      padding: "0.1em 1em 0.2em",
      lineHeight: "1.6em",
      transition: "background-color 1s cubic-bezier(.04,.9,.8,1)",
    },
    "& .chant-lang-mixed": {
      ["& .chant-group.chant-lang-en .chant-verse, & .chant-verse.chant-lang-en"]: {
        paddingLeft: "2.95em",
        fontStyle: "italic",
      },
      ["& .chant-verse.chant-lang-en"]: {
        fontStyle: "italic",
      },
    },
    "& .chant-group.chant-leader, & .chant-group .chant-verse.chant-leader": {
      paddingLeft: "2.95em",
      paddingRight: "2.95em",
    },
    "& .chant-grid": {
      padding: "0 0.5em",
      display: "table",
      "&.chant-center": {
        margin: "1em auto",
      },
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
      paddingRight: "2em",
      fontFamily: "Alegreya X Sans SC",
      fontWeight: "bold",
      fontSize: "0.9em",
      letterSpacing: "0.03em",
      lineHeight: "1.5em",
      color: theme.palette.text.secondary,
      textIndent: "-0.6em",
      "&.chant-center": {
        paddingLeft: "2em",
        textAlign: "center",
      },
      "&.chant-right": {
        paddingLeft: "2em",
        paddingRight: "1em",
        textAlign: "right",
      },
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
    "& .chant-raw": {
      "& p, & dl": {
        padding: "0.1em 1em 0.2em",
        margin: ".5em 0",
      },
      "& table": {
        margin: ".5em auto",
        "& td:not(:last-child)": {
          paddingRight: "0.1em",
        },
      },
      "& dt": {
        fontWeight: "bold",
      },
    },
  },
}));

const ChantSet = memo(({ chantSet }) => {
  const classes = useStyles();
  return (
    <div className={classes.root} id={chantSet?.domId}>
      {chantSet?.title && <h1>{chantSet.title}</h1>}
      {chantSet?.chants?.map?.((chant, index) => (
        <Chant chant={chant} key={index} />
      ))}
    </div>
  );
});

ChantSet.displayName = "ChantSet";

export default ChantSet;
