import dynamic from "next/dynamic";
import Head from "next/head";
import React from "react";

const BASE_URL =
  "https://pujas-live.sfo3.cdn.digitaloceanspaces.com/chantest/fonts";

const FONTS = [
  {
    family: "Alegreya X Sans SC",
    file: "AlegreyaXSansSC-Bold",
    style: "normal",
    weight: "bold",
  },
  {
    family: "Gentium Incantation",
    file: "GentiumIncantation-Regular",
    style: "normal",
    weight: "normal",
  },
  {
    family: "Gentium Incantation",
    file: "GentiumIncantation-Italic",
    style: "italic",
    weight: "normal",
  },
  { family: "Ubuntu", file: "Ubuntu-X-Medium", style: "normal", weight: "500" },
  { family: "Ubuntu", file: "Ubuntu-L", style: "normal", weight: "300" },
];

const ChantFontStyle = () =>
  FONTS.map((font, index) => (
    <React.Fragment key={index}>
      <Head>
        <link
          as="font"
          crossOrigin
          href={`${BASE_URL}/${font.file}.woff2`}
          type="font/woff2"
          rel="preload"
        />
      </Head>
      <style jsx global>
        {`
          @font-face {
            font-family: "${font.family}";
            src: url("${BASE_URL}/${font.file}.woff2") format("woff2"),
              url("${BASE_URL}/${font.file}.woff") format("woff");
            font-display: swap;
            font-style: ${font.style};
            font-weight: ${font.weight};
          }
        `}
      </style>
    </React.Fragment>
  ));

const ChantFontStyleNoSsr = dynamic(() => Promise.resolve(ChantFontStyle), {
  ssr: false,
});

export default ChantFontStyleNoSsr;
