import type { NextPage } from "next";
import { useSession } from "next-auth/react";
import Background from "../components/Background";
import ExchangeRates from "../components/index/ExchangeRates";
import withAuth from "../components/withAuth";
import Carousel from "../components/index/Carousel/Carousel";
import CardsWrapper from "../components/index/CardsWrapper";

const Home: NextPage = () => {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="grid m-auto gap-y-10 mt-10 p-6 justify-center items-center max-w-[80%] glass rounded-xl">
        <Carousel />
        <CardsWrapper />
        <ExchangeRates />
      </div>
    );
  } else {
    return (
      <Background>
        <h1 className="text-white text-3xl text-center">
          Please Log In to see the information
        </h1>
      </Background>
    );
  }
};

export default withAuth(Home);
