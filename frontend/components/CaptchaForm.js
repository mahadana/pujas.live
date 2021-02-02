import HCaptcha from "@hcaptcha/react-hcaptcha";
import Box from "@material-ui/core/Box";
import { useRef, useState } from "react";

import Form from "@/components/Form";
import { useSnackbar } from "@/lib/snackbar";
import { sleep } from "@/lib/util";

const sitekey = process.env.NEXT_PUBLIC_HCAPTCHA_SITE_KEY;

const waitForHCaptcha = async () => {
  let i = 0;
  while (!window.hcaptcha) {
    // Wait up to 10 seconds...
    await sleep(100);
    if (i++ > 100) {
      throw "hCaptcha not available. Please try again.";
    }
    // Wait a little more to be safe.
    await sleep(500);
  }
};

const closeHCaptcha = () => {
  try {
    window.hcaptcha.close();
  } catch {
    //
  }
};

const CaptchaForm = ({
  children,
  disableCaptcha,
  formProps,
  onSubmit,
  ...props
}) => {
  const hcaptchaRef = useRef();
  const { snackError } = useSnackbar();
  const [mounted, setMounted] = useState(false);
  const [withToken, setWithToken] = useState(null);

  if (!sitekey) disableCaptcha = true;

  const onError = () => {
    withToken?.abort?.();
    snackError("Captcha was invalid. Please try again.");
  };

  const onExpire = () => withToken?.abort?.();

  const onVerify = (token) => withToken?.set?.(token);

  const closeCaptcha = () => {
    withToken?.abort?.();
    closeHCaptcha();
  };

  const getCaptchaToken = async () => {
    if (disableCaptcha) {
      return undefined;
    }
    setMounted(true);
    await waitForHCaptcha();
    hcaptchaRef.current.execute();
    return await new Promise((resolve, reject) => {
      setWithToken({
        abort: () => reject(new Error("Abort")),
        set: resolve,
      });
    });
  };

  const resetCaptcha = () => {
    setWithToken(null);
    if (!disableCaptcha) {
      try {
        hcaptchaRef.current.resetCaptcha();
      } catch {
        //
      }
    }
  };

  const wrappedOnSubmit = (values, formik) => {
    (async () => {
      try {
        let token;
        try {
          token = await getCaptchaToken();
        } catch {
          formik.setSubmitting(false);
          return;
        }
        if (onSubmit && (token || disableCaptcha)) {
          if (onSubmit.then) {
            await onSubmit(values, formik, token);
          } else {
            onSubmit(values, formik, token);
          }
        }
      } finally {
        resetCaptcha();
        onSubmit?.then && formik.setSubmitting(false);
      }
    })();
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
            ref={hcaptchaRef}
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
