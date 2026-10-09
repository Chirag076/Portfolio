import React from "react";
import Nav from "./Nav";
import Hero from "./Hero";
import Work from "./Work";
import Principles from "./Principles";
import Stack from "./Stack";
import About from "./About";
import Timeline from "./Timeline";
import Recommendations from "./Recommendations";
import Contact from "./Contact";
import Footer from "./Footer";
import useReveal from "../hooks/useReveal";
import { usePortfolio } from "../context/PortfolioContext";

const Landing = () => {
  const { projects, experience } = usePortfolio();
  /* re-arm the observer when content arrives from the database */
  useReveal([projects, experience]);

  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <Work />
        <Principles />
        <Stack />
        <About />
        <Timeline />
        <Recommendations />
        <Contact />
      </main>
      <Footer />
    </>
  );
};

export default Landing;
