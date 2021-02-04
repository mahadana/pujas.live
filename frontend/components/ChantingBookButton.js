import ButtonBase from "@material-ui/core/ButtonBase";
import { fade, makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";
import capitalize from "lodash/capitalize";

import { useChantingBooksModal } from "@/components/ChantingBooksModal";
import plausible from "@/lib/plausible";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "inline-flex",
    alignItems: "center",
    color: "inherit",
    padding: ".5em",
    borderRadius: ".25em",
    fontSize: "inherit",
    fontWeight: "inherit",
    transition: "background-color 0.5s ease",
    "&:hover": {
      backgroundColor: fade(theme.palette.primary.main, 0.1),
    },
  },
  rootLeft: {
    flexDirection: "row",
    height: "5em",
  },
  rootRight: {
    flexDirection: "row-reverse",
    height: "5em",
  },
  rootTop: {
    flexDirection: "column",
  },
  rootBottom: {
    flexDirection: "column-reverse",
  },
  title: {
    display: "block",
    width: "4em",
    textAlign: "center",
  },
  titleLeft: {
    marginRight: ".5em",
  },
  titleRight: {
    marginLeft: ".5em",
  },
  titleTop: {
    marginBottom: ".25em",
  },
  titleBottom: {
    marginTop: ".25em",
  },
  image: {
    display: "block",
    boxShadow: "1px 1px 3px 2px rgba(0, 0, 0, .2)",
  },
  imageLeft: {
    height: "100%",
  },
  imageRight: {
    height: "100%",
  },
  imageTop: {
    height: "7em",
  },
  imageBottom: {
    height: "7em",
  },
}));

const ChantingBookButton = ({
  book = 1,
  direction = "left",
  onClose: propsOnClose,
  onOpen: propsOnOpen,
  ...props
}) => {
  const { setState } = useChantingBooksModal();
  const classes = useStyles(props);

  const getClass = (key) =>
    clsx(classes[key], classes[key + capitalize(direction)]);

  const onClick = () => {
    setState({ book, onClose });
    propsOnOpen && propsOnOpen();
    plausible("chantingBook", { props: { book: `${book}` } });
  };
  const onClose = () => {
    propsOnClose && propsOnClose();
  };

  return (
    <>
      <ButtonBase
        focusRipple
        classes={{ root: getClass("root") }}
        onClick={onClick}
        {...props}
      >
        <span className={getClass("title")}>Chanting Book {book}</span>
        <img
          alt={`Chanting Book ${book}`}
          className={getClass("image")}
          src={`/chanting${book}.jpg`}
        />
      </ButtonBase>
    </>
  );
};

export default ChantingBookButton;
