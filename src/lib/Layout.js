import { Flex, Box } from "@chakra-ui/react";

import Header from "./Header";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <Flex flexDirection="column" maxWidth={1420} margin="0 auto">
      <Header />
      <Flex flexDirection={["column", "column", "column", "row"]}>
        <Box as="main" flex="1 1 auto">
          {children}
        </Box>
      </Flex>
      <Footer />
    </Flex>
  );
}
