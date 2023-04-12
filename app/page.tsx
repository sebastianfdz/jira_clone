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
      <main className="min-w-screen flex min-h-screen flex-col items-center justify-center">
        <h1>Jira Clone</h1>
      </main>
    </>
  );
};

export default Home;
