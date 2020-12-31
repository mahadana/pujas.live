import HCaptcha from "@hcaptcha/react-hcaptcha";
import Box from "@material-ui/core/Box";
import { useRef, useState } from "react";

import Form from "@/components/Form";
import { useSnackbar } from "@/lib/snackbar";
import { sleep } from "@/lib/util";

const sitekey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY;

const CaptchaForm = ({
  children,
  disableCaptcha,
  formProps,
  onSubmit,
  ...props
}) => {
  const captchaRef = useRef();
  const submitRef = useRef(() => {});
  const { snackError } = useSnackbar();
  const [mounted, setMounted] = useState(false);

  if (!sitekey) disableCaptcha = true;

  const onError = () => {
    submitRef.current(false);
    snackError("Captcha was invalid. Please try again.");
  };
  const onExpire = () => {
    //
  };
  const onVerify = (token) => {
    submitRef.current(token);
  };

  const closeCaptcha = () => {
    submitRef.current(false);
    if (window.hcaptcha) window.hcaptcha.close();
  };

  const wrappedOnSubmit = async (values, formik) => {
    try {
      let token = null;
      if (!disableCaptcha) {
        setMounted(true);
        let i = 0;
        while (!window.hcaptcha) {
          // Wait up to 10 seconds...
          await sleep(100);
          if (i++ > 100) {
            snackError("Could not load Captcha. Please try again.");
            return;
          }
          // Wait a little more to be safe.
          await sleep(500);
        }
        captchaRef.current.execute();
        token = await new Promise((resolve) => {
          submitRef.current = resolve;
        });
      }
      if (disableCaptcha || token) {
        await onSubmit(values, formik, token);
      }
    } finally {
      submitRef.current = () => {};
      if (!disableCaptcha && captchaRef.current) {
        captchaRef.current.resetCaptcha();
      }
    }
  };

  return (
    <Form
      {...props}
      onSubmit={wrappedOnSubmit}
      formProps={{
        ...formProps,
        onMouseDown: closeCaptcha,
        onTouchStart: closeCaptcha,
      }}
    >
      {children}
      {!disableCaptcha && mounted && (
        <Box style={{ display: "none" }}>
          <HCaptcha
            ref={captchaRef}
            sitekey={sitekey}
            size="invisible"
            onError={onError}
            onExpire={onExpire}
            onVerify={onVerify}
          />
        </Box>
      )}
    </Form>
  );
};

export default CaptchaForm;