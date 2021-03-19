import { makeStyles } from "@material-ui/core/styles";
import { useState } from "react";

import ChantFontStyle from "@/components/chanting/ChantFontStyle";
import ChantScrollerWrapper from "@/components/chanting/ChantScrollerWrapper";
import ChantTocWrapper from "@/components/chanting/ChantTocWrapper";

const useStyles = makeStyles((theme) => ({
  root: ({ maximize }) => ({
    position: "fixed",
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.text.primary,
    overflow: "hidden",
    fontSize: "1.25rem",
    ...(maximize
      ? {
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          // This is necessary to prevent a bug on iOS that occasionally causes
          // the right side of the window to go blank.
          borderRadius: "0.01px",
        }
      : {
          width: "90vw",
          maxWidth: "48rem",
          height: "90vh",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          borderRadius: "0.25rem",
          boxShadow: "1px 1px 6px rgb(0 0 0 / 80%)",
        }),
  }),
}));

const ChantWindow = ({ onClose, disableReturnToc = false, ...props }) => {
  const [chantSet, setChantSet] = useState(null);
  const [maximize, setMaximize] = useState(true);
  const classes = useStyles({ maximize });

  const onCloseScroller = () => {
    setChantSet(null);
    if (disableReturnToc) {
      onClose?.();
    }
  };

  return (
    <div className={classes.root}>
      <ChantFontStyle />
      <ChantScrollerWrapper
        {...props}
        chantSet={chantSet}
        onClose={onCloseScroller}
        setMaximize={setMaximize}
      />
      <ChantTocWrapper
        chantSet={chantSet}
        onClose={onClose}
        onOpen={setChantSet}
        toc={props.chantData.toc}
      />
    </div>
  );
};

export default ChantWindow;
