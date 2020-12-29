import HCaptcha from "@hcaptcha/react-hcaptcha";
import Box from "@material-ui/core/Box";
import { Form, Formik } from "formik";
import { useRef, useState } from "react";

import { useSnackbar } from "@/lib/snackbar";

const sitekey =
  process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY ||
  "10000000-ffff-ffff-ffff-000000000001"; // Dummy key

const CaptchaForm = ({
  children,
  className,
  disableCaptcha,
  onSubmit,
  ...props
}) => {
  const captchaRef = useRef();
  const submitRef = useRef(() => {});
  const { snackError } = useSnackbar();
  const [mounted, setMounted] = useState(false);

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
          await new Promise((resolve) => setTimeout(resolve, 100));
          // Wait up to 10 seconds...
          if (i++ > 100) {
            snackError("Could not load Captcha. Please try again.");
            return;
          }
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
    <Formik {...props} onSubmit={wrappedOnSubmit}>
      <Form
        className={className}
        onMouseDown={closeCaptcha}
        onTouchStart={closeCaptcha}
      >
        {children}
        {mounted && (
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
    </Formik>
  );
};

export default CaptchaForm;
