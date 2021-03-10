import { makeStyles } from "@material-ui/core/styles";
import { memo } from "react";

import Chant from "@/components/chanting/Chant";

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: "32.5em",
    margin: "0 auto",
    marginTop: "30vh",
    marginBottom: "45vh",
    color: theme.palette.text.primary,
    fontFamily: "Gentium Incantation",
    "& h1, & h2, & h3, & h4, & h5, & h6": {
      fontFamily: "Ubuntu",
      letterSpacing: "0.01em",
    },
    "& h1": {
      fontWeight: 300,
    },
    "& h2": {
      borderBottom: `1px solid ${theme.palette.text.secondary}`,
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
    "& .chant-verse": {
      padding: "0.1em 1em 0.2em",
      lineHeight: "1.6em",
      transition: "background-color 1s cubic-bezier(.04,.9,.8,1)",
    },
    "& .chant-lang-mixed": {
      "& .chant-group.chant-lang-en .chant-verse, & .chant-verse.chant-lang-en": {
        fontStyle: "italic",
      },
    },
    "& aside": {
      marginTop: "0.25em",
      fontFamily: "Alegreya X Sans SC",
      fontWeight: "bold",
      fontSize: "0.9em",
      letterSpacing: "0.03em",
      lineHeight: "1.5em",
      color: theme.palette.text.secondary,
      textIndent: "-0.6em",
      "&.chant-center": {
        textAlign: "center",
      },
      "&.chant-right": {
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
    [theme.breakpoints.down("xs")]: {
      "& h1": {
        margin: "0 0 1em",
        padding: "0 0.7143em",
        fontSize: "1.4em",
      },
      "& h2": {
        margin: "0.75em 0",
        padding: "0 0.87em 0",
        fontSize: "1.15em",
      },
      "& .chant-group": {
        margin: "0.4em 0",
      },
      "& .chant-lang-mixed": {
        "& .chant-group.chant-lang-en .chant-verse, & .chant-verse.chant-lang-en": {
          paddingLeft: "1.75em",
        },
      },
      "& .chant-group.chant-leader .chant-verse, & .chant-group .chant-verse.chant-leader": {
        paddingLeft: "1.75em",
        paddingRight: "1.75em",
      },
      "& .chant-grid": {
        margin: "0.5em 0",
        "& .chant-verse:nth-child(1)": {
          padding: "0 1em 0 1.75em",
        },
        "& .chant-verse:nth-child(2)": {
          padding: "0 1em 0 2.5em",
        },
        "& .chant-verse:nth-child(3)": {
          padding: "0 1em 0 3.25em",
        },
      },
      "& aside": {
        paddingLeft: "1.65em",
        paddingRight: "1.65em",
        "&.chant-center": {
          paddingLeft: "1.65em",
        },
        "&.chant-right": {
          paddingLeft: "1.65em",
          paddingRight: "1em",
        },
      },
    },
    [theme.breakpoints.up("sm")]: {
      "& h1": {
        margin: "0",
        padding: "0.25em 0.55em",
        fontSize: "1.6em",
      },
      "& h2": {
        margin: "1em 0",
        padding: "0 0.65em 0",
        fontSize: "1.4em",
      },
      "& .chant-group": {
        margin: "0.8em 0",
      },
      "& .chant-lang-mixed": {
        "& .chant-group.chant-lang-en .chant-verse, & .chant-verse.chant-lang-en": {
          paddingLeft: "2.95em",
        },
      },
      "& .chant-group.chant-leader .chant-verse, & .chant-group .chant-verse.chant-leader": {
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
        paddingLeft: "3.4em",
        paddingRight: "2em",
        "&.chant-center": {
          paddingLeft: "2em",
        },
        "&.chant-right": {
          paddingLeft: "2em",
          paddingRight: "1em",
        },
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
