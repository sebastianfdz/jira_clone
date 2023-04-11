import { type NextPage } from "next";
import Head from "next/head";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Jira Clone</title>
        <meta name="description" content="Jira Clone by Sebastian Fernandez" />
        <link
          rel="icon"
          href="https://www.vectorlogo.zone/logos/atlassian_jira/atlassian_jira-icon.svg"
        />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]"></main>
    </>
  );
};

export default Home;
