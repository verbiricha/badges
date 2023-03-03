import { Button } from "@chakra-ui/react";

import useColors from "./useColors";

export default function ActionButton({ children, ...rest }) {
  const { gradient } = useColors();
  return (
    <Button type="button" color="white" background={gradient} {...rest}>
      {children}
    </Button>
  );
}
