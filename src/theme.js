import "@fontsource/fraunces/400.css";
import "@fontsource/fraunces/700.css";
import "@fontsource/fraunces/900.css";
import "@fontsource/epilogue/400.css";
import "@fontsource/epilogue/500.css";

import { mode } from "@chakra-ui/theme-tools";

import "./App.css";

import { extendTheme } from "@chakra-ui/react";

const config = {
  initialColorMode: "dark",
  useSystemColorMode: true,
};

const colors = {
  purple: {
    500: "#A966FF",
  },
  primary: {
    400: "#141414",
  },
  secondary: {
    500: "#585858",
    300: "#B7B7B7",
  },
  green: {
    500: "#00FF75",
  },
  red: {
    500: "#F72119",
  },
  warning: {
    500: "#FFDD60",
  },
};

const styles = {
  global: (props) => ({
    body: {
      background: mode("#FFFDFF", "#1C1A38")(props),
      color: mode("#1C1A38", "#FFFDFF")(props),
    },
  }),
};

const fonts = {
  heading: `'Fraunces', serif`,
  body: `'Epilogue', sans-serif`,
};

const components = {};

export default extendTheme({ config, styles, colors, fonts, components });
