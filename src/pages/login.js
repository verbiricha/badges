import { Helmet } from "react-helmet";

import Layout from "../lib/Layout";
import SignUp from "../lib/SignUp";

export default function Login() {
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
