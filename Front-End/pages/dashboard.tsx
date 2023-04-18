import { NextPage } from "next";
import LineChart from "../components/charts/lineChart";
import PieChart from "../components/charts/pieChart";
import Card from "../components/Card";
import { BarChart } from "../components/charts/barChart";
import { useSession } from "next-auth/react";
const Profile: NextPage = () => {
  const { data: session } = useSession();

  return (
    <div className="w-[85%] mt-5 lg:p-10 m-auto flex flex-col gap-4 items-center justify-center glass">
      <div className="flex justify-center items-center gap-5">
        <PieChart email={session?.user?.email as string} />
        <BarChart email={session?.user?.email as string} />
      </div>
      <div className="grid grid-cols-5  border-blue-500 divide-x-2">
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
