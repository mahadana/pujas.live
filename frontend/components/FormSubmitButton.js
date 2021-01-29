import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import { useFormikContext } from "formik";

const FormSubmitButton = ({
  children,
  disabled,
  onClick,
  startIcon,
  ...props
}) => {
  const { isSubmitting, submitForm } = useFormikContext();
  return (
    <Button
      type="submit"
      variant="contained"
      color="primary"
      disabled={isSubmitting || disabled}
      onClick={
        onClick ||
        ((event) => {
          event.preventDefault();
          submitForm();
        })
      }
      startIcon={startIcon || <SaveIcon />}
      {...props}
    >
      {children}
    </Button>
  );
};

export default FormSubmitButton;
