import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Flex, Box } from "@chakra-ui/react";
import { Helmet } from "react-helmet";
import { useSelector } from "react-redux";

import SignUp from "../lib/SignUp";
import Layout from "../lib/Layout";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useSelector((s) => s.relay);

  useEffect(() => {
    if (user) {
      navigate(`/p/${user}`);
    }
  }, [user]);

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Badge</title>
      </Helmet>
      <Layout>
        <SignUp />
      </Layout>
    </>
  );
}
