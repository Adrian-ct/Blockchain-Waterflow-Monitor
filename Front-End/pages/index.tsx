import type { NextPage } from "next";
import { useSession, signOut } from "next-auth/react";
import Background from "../components/Background";
import Modal from "../components/AddDeviceModal";
import ExchangeRates from "../components/index/ExchangeRates";
import withAuth from "../components/withAuth";
import Card from "../components/Card";
import Carousel from "../components/index/Carousel/Carousel";

const Home: NextPage = () => {
  const { data: session } = useSession();

  if (session) {
    return (
      <div className="flex justify-center items-center ">
        <div className="grid gap-y-10 mt-10 p-6 justify-center max-w-[80%] glass rounded-xl">
          <Carousel />
          <div className="grid grid-cols-5 divide-x-2 border-double border-8 rounded-xl">
            <Card
              title="Increased water scarcity"
              text="By 2025, it's predicted that approximately two-thirds of the global population could experience water shortages. This is due to the growing demand for water, increased pollution, and climate change, leading to less availability of fresh water sources."
            />
            <Card
              title="Agriculture impacts"
              text="Agriculture accounts for around 70% of global freshwater use. As the global population increases, the demand for food will grow, putting additional pressure on already stressed water resources. This could lead to a decrease in food production, which may result in food shortages and increased food prices."
            />
            <Card
              title="Decline in water quality"
              text="Pollution from industrial and agricultural activities continues to contaminate fresh water sources. If we don't take action to reduce pollution, the quality of available water will decline, leading to increased health risks for humans, as well as negative impacts on ecosystems and biodiversity."
            />
            <Card
              title="Increased conflicts over water resources"
              text="Water scarcity is likely to exacerbate conflicts between countries and regions sharing water resources. As demand for water increases, tensions may rise, leading to political instability and potential conflicts."
            />
            <Card
              title="Economic consequences"
              text="Water scarcity can have significant economic implications, especially in water-intensive industries such as agriculture, energy production, and manufacturing. A lack of access to clean water can hinder economic development, leading to job losses and reduced economic growth."
            />
          </div>
          <ExchangeRates />
        </div>
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
