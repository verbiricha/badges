import { Button } from "@chakra-ui/react";

export default function ActionButton({ children, ...rest }) {
  return (
    <Button type="button" color="white" background="var(--gradient)" {...rest}>
      {children}
    </Button>
  );
}
