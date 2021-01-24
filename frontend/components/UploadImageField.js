import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";
import { makeStyles } from "@material-ui/core/styles";
import { useField } from "formik";
import { useState } from "react";

import UploadImage from "@/components/UploadImage";
import { apolloClient } from "@/lib/apollo";
import { UPLOAD_MUTATION } from "@/lib/schema";

const useStyles = makeStyles((theme) => ({
  root: {
    alignItems: "center",
    borderColor: "rgba(0, 0, 0, 0.23)",
    borderRadius: theme.shape.borderRadius,
    borderStyle: "solid",
    borderWidth: 1,
    display: "flex",
    justifyContent: "space-evenly",
    maxHeight: "10em",
    overflow: "hidden",
    padding: "1em",
  },
}));

const UploadImageField = ({ label, name }) => {
  const [field, , helpers] = useField(name);
  const classes = useStyles();
  const [uploading, setUploading] = useState(false);

  const uploadImage = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = async ({
      target: {
        validity,
        files: [file],
      },
    }) => {
      if (!validity.valid) {
        return;
      }
      setUploading(true);
      try {
        const result = await apolloClient.mutate({
          mutation: UPLOAD_MUTATION,
          variables: { file },
        });
        if (result?.data?.upload) {
          helpers.setValue(result.data.upload);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setUploading(false);
      }
    };
    fileInput.click();
  };

  return (
    <Box className={classes.root}>
      {field.value && <UploadImage image={field.value} />}
      <Button disabled={uploading} onClick={uploadImage} variant="contained">
        {field.value ? "Replace" : "Select"} {label}
      </Button>
    </Box>
  );
};

export default UploadImageField;
