import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import { useFormikContext } from "formik";

const FormSubmitButton = ({ children, disabled, onClick, startIcon, ...props }) => {
  const formik = useFormikContext();
  return (
    <Button
      type="submit"
      variant="contained"
      color="primary"
      disabled={disabled || formik.isSubmitting}
      onClick={
        onClick ||
        ((event) => {
          event.preventDefault();
          formik.submitForm();
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
