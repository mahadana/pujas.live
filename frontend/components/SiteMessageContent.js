import { useMutation } from "@apollo/client";

import SiteMessageForm from "@/components/SiteMessageForm";
import { MESSAGE_SITE_MUTATION } from "@/lib/schema";
import { useSnackbar } from "@/lib/snackbar";

const SiteMessageContent = () => {
  const [messageSite] = useMutation(MESSAGE_SITE_MUTATION);
  const { snackException, snackSuccess } = useSnackbar();

  const onSubmit = async (values, formik, token) => {
    try {
      await messageSite({
        context: { headers: { "X-Captcha-Token": token } },
        variables: { input: { data: values } },
      });
      snackSuccess("Successfully sent message");
      formik.resetForm();
    } catch (error) {
      snackException(error);
    }
  };

  return <SiteMessageForm onSubmit={onSubmit} />;
};

export default SiteMessageContent;
