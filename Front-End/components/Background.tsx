import { ReactNode } from "react";

type BackgroundProps = {
  children: ReactNode;
};
const Background = ({ children }: BackgroundProps) => {
  return (
    <div className="min-h-screen p-10 pt-16 w-full bg-[url('../images/bg.svg')] bg-cover text-black">
      {children}
    </div>
  );
};
export default Background;
