import ChantEditorTimeDialog from "@/components/chanting/editor/ChantEditorTimeDialog";

const ChantEditorTimeControl = ({ dispatch, state }) => {
  const time = state.editTime;
  const open = Boolean(time);

  const onClose = () => dispatch({ type: "CLOSE_TIME_DIALOG" });
  const onSave = ({ start, end }) => {
    dispatch({
      type: "UPDATE_NODE",
      index: time.index,
      start,
      end,
    });
  };

  return (
    <ChantEditorTimeDialog
      onClose={onClose}
      onSave={onSave}
      open={open}
      time={time}
    />
  );
};

export default ChantEditorTimeControl;
