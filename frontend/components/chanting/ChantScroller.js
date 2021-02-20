import { makeStyles } from "@material-ui/core/styles";
import { useEffect, useRef } from "react";

const useStyles = makeStyles((theme) => ({
  root: {
    position: "absolute",
    top: 0,
    right: 0,
    width: "100%",
    height: "100%",
    padding: "1rem 2rem",
    overflow: "hidden",
    overflowY: "scroll",
  },
}));

const scrollToActiveIndex = (el, activeIndex) => {
  let top;
  if (activeIndex === "START") {
    top = 0;
  } else if (activeIndex === "END") {
    top = el.firstElementChild?.clientHeight || 10000;
  } else {
    const activeEl = el.querySelector(".chant-active");
    const activeTop = activeEl?.offsetTop || 0;
    const activeHeight = activeEl?.clientHeight || 0;
    const halfActiveHeight = parseInt(activeHeight / 2);
    const viewWindow = parseInt(el.clientHeight * 0.9); // 90%
    const targetTop = activeTop + halfActiveHeight - el.scrollTop;
    const targetBottom = targetTop + activeHeight;
    const viewTop = parseInt((el.clientHeight - viewWindow) / 2);
    const viewBottom = parseInt((el.clientHeight + viewWindow) / 2);

    // console.log({
    //   viewWindow,
    //   targetTop,
    //   targetBottom,
    //   viewTop,
    //   viewBottom,
    // });

    if (targetTop < viewTop || targetBottom > viewBottom) {
      top = activeTop + halfActiveHeight - parseInt(el.clientHeight / 2);
      top = Math.max(0, top);
    } else {
      top = null;
    }
  }
  if (top !== null) {
    el.scrollTo({ top, left: 0, behavior: "smooth" });
  }
};

const ChantScroll = ({ activeIndex, children }) => {
  const ref = useRef();
  const classes = useStyles();

  useEffect(() => {
    if (ref.current) scrollToActiveIndex(ref.current, activeIndex);
  }, [activeIndex]);

  // const monitorScroll = useCallback((event) => {
  //   console.log("monitorScroll", event);
  // }, []);

  // useEffect(() => {
  //   console.log("useEffect");
  //   const { current: el } = ref;
  //   if (el) {
  //     console.log("add event listener");
  //     el.addEventListener("scroll", monitorScroll);
  //   }

  //   return () => {
  //     console.log("useEffect destruct");
  //     if (el) {
  //       console.log("remove event listener");
  //       el.removeEventListener("scroll", monitorScroll);
  //     }
  //   };
  // }, []);

  return (
    <div className={classes.root} ref={ref}>
      {children}
    </div>
  );
};

export default ChantScroll;
