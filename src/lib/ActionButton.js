import { Button } from "@chakra-ui/react";

export default function ActionButton({ children, ...rest }) {
  return (
    <Button color="white" background="var(--gradient)" {...rest}>
      {children}
    </Button>
  );
}
