import { useEffect, useRef } from "react";
import { useState } from "react";
import Image from "next/image";
import { tips } from "./Data";

const Carousel = () => {
  const [current, setCurrent] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const timeOut = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (autoPlay)
      timeOut.current = setTimeout(() => {
        slideRight();
      }, 2500);
  });

  const slideRight = () => {
    setCurrent(current === tips.length - 1 ? 0 : current + 1);
  };

  const slideLeft = () => {
    setCurrent(current === 0 ? tips.length - 1 : current - 1);
  };
  return (
    <div
      className="flex h-[400px] w-full"
      onMouseEnter={() => {
        setAutoPlay(false);
        clearTimeout(timeOut.current as NodeJS.Timeout);
      }}
      onMouseLeave={() => {
        setAutoPlay(true);
      }}
    >
      <div className="relative w-full h-full">
        {tips.map((image, index) => {
          return (
            <div
              key={index}
              className={`${
                index === current
                  ? "pointer-events-auto opacity-100 scale-100"
                  : "pointer-events-none opacity-0 scale-75"
              } grid grid-cols-2 absolute w-full h-full overflow-hidden rounded-3xl 
                transition-all duration-500 ease-in-out shadow-md`}
            >
              <div className="col-span-1 relative">
                <Image
                  className="object-cover"
                  src={image.image}
                  fill={true}
                  loading="eager"
                  alt=""
                />
                <div className="absolute inset-0 bg-black bg-opacity-50 w-full h-full"></div>
              </div>
              <div className="w-full h-full glass p-3 overflow-y-auto">
                <ul className="p-2 w-full flex flex-col items-start gap-y-2 justify-center overflow-auto h-full bg-emerald-500 border-white border-2 bg-opacity-30 rounded-2xl">
                  {image.list.map((item, index) => {
                    return (
                      <li
                        key={index}
                        className="font_size-clamp text-white text-[1vw]"
                      >
                        <h2 className="m-0 first-letter:font-bold first-letter:text-blue-700">
                          {item}
                        </h2>
                      </li>
                    );
                  })}
                </ul>
              </div>
              <div className="absolute w-full h-full flex items-end p-10 px-8 ">
                <h2 className="text-white text-2xl">
                  Save water in the {image.title}
                </h2>
              </div>
            </div>
          );
        })}
        <div
          className="p-2 cursor-pointer h-12 w-12 text-center  rounded-full hover:text-white  text-black text-3xl  absolute left-2 glass  top-1/2 -translate-y-1/2"
          onClick={slideLeft}
        >
          ❮
        </div>
        <div
          className="p-2 cursor-pointer h-12 w-12 text-center  rounded-full hover:text-white  text-black text-3xl  absolute right-2 glass  top-1/2 -translate-y-1/2"
          onClick={slideRight}
        >
          ❯
        </div>
        <div className="absolute bottom-1 left-1/2 translate-x-[-50%]">
          {tips.map((_, index) => {
            return (
              <div
                key={index}
                className={`hover:scale-125 h-3 w-3 bg-[#f5f5f5] rounded-[50%] inline-block ml-3 cursor-pointer ${
                  index == current && "bg-[steelblue]"
                }`}
                onClick={() => setCurrent(index)}
              ></div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Carousel;
