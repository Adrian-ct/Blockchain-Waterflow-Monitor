import type { NextPage } from "next";
import { useEffect, useState } from "react";
import AlertBox from "../components/AlertBox";
const Alert: NextPage = () => {
  const [show, setShow] = useState(false);
  useEffect(() => {
    let timer = setTimeout(() => setShow(false), 3999);
    return () => clearTimeout(timer);
  }, [show]);
  return (
    <div className="pt-32 ">
      <div onClick={() => setShow((prev) => !prev)} className="btn btn-circle">
        Click me
      </div>
      {show && (
        <div className="fixed w-2/5 left-1/2 -translate-x-1/2 bottom-10">
          <AlertBox message="Hello" />{" "}
        </div>
      )}
    </div>
  );
};
export default Alert;
