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
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Create <span className="text-[hsl(280,100%,70%)]">T3</span> App
          </h1>
        </div>
      </main>
    </>
  );
};

export default Home;
