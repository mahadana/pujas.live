const BASE_URL =
  "https://pujas-live.sfo3.cdn.digitaloceanspaces.com/chantest/fonts";

const ChantFontStyle = () => {
  return (
    <style jsx global>{`
      @font-face {
        font-family: "Alegreya X Sans SC";
        src: url("${BASE_URL}/AlegreyaXSansSC-Bold.woff2") format("woff2"),
          url("${BASE_URL}/AlegreyaXSansSC-Bold.woff") format("woff");
        font-weight: bold;
        font-style: normal;
        font-display: swap;
      }

      @font-face {
        font-family: "Gentium Incantation";
        src: url("${BASE_URL}/GentiumIncantation-Regular.woff2") format("woff2"),
          url("${BASE_URL}/GentiumIncantation-Regular.woff") format("woff");
        font-weight: normal;
        font-style: normal;
        font-display: swap;
      }

      @font-face {
        font-family: "Gentium Incantation";
        src: url("${BASE_URL}/GentiumIncantation-Italic.woff2") format("woff2"),
          url("${BASE_URL}/GentiumIncantation-Italic.woff") format("woff");
        font-weight: normal;
        font-style: italic;
        font-display: swap;
      }

      @font-face {
        font-family: "Ubuntu";
        src: url("${BASE_URL}/Ubuntu-X-Medium.woff2") format("woff2"),
          url("${BASE_URL}/Ubuntu-X-Medium.woff") format("woff");
        font-weight: 500;
        font-style: normal;
        font-display: swap;
      }

      @font-face {
        font-family: "Ubuntu";
        src: url("${BASE_URL}/Ubuntu-L.woff2") format("woff2"),
          url("${BASE_URL}/Ubuntu-L.woff") format("woff");
        font-weight: 300;
        font-style: normal;
        font-display: swap;
      }
    `}</style>
  );
};

export default ChantFontStyle;
