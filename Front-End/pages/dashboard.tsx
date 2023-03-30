import { NextPage } from "next";
import LineChart from "../components/charts/lineChart";
import PieChart from "../components/charts/pieChart";
import Card from "../components/Card";
import { BarChart } from "../components/charts/barChart";
const Profile: NextPage = () => {
  return (
    <div className="w-[85%] lg:p-4 m-auto flex flex-col gap-4 items-center justify-center">
      <div className="flex justify-center items-center gap-5">
        <PieChart />
        <BarChart />
      </div>
      <div className="grid grid-cols-5 border-2 border-blue-500 border-solid divide-x-2">
        <Card
          title="Info!"
          text="In 50 years water will be much more scarse than today"
        />
        <Card
          title="Info!"
          text="In 50 years water will be much more scarse than today"
        />
        <Card
          title="Info!"
          text="In 50 years water will be much more scarse than today"
        />
        <Card
          title="Info!"
          text="In 50 years water will be much more scarse than today"
        />
        <Card
          title="Info!"
          text="In 50 years water will be much more scarse than today"
        />
      </div>
      <div className="grid grid-cols-2 grid-rows-2 gap-2">
        <div className="row-span-2">
          <LineChart room="Bathroom" width={700} height={508} />
        </div>
        <div className="col-start-2  row-span-1">
          <LineChart room="Kitchen" width={50} height={17} />
        </div>
        <div className="col-start-2 row-span-1">
          <LineChart room="Garage" width={50} height={17} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
