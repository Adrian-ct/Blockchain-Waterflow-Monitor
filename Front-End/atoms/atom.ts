import { atom } from "recoil";

export const modalAtom = atom({
  key: "modalAtom", // unique ID (with respect to other atoms/selectors)
  default: false, // default value (aka initial value)
});

//atom for alertbox
export const alertBoxAtom = atom({
  key: "alertBoxAtom", // unique ID (with respect to other atoms/selectors)
  default: {
    show: false,
    message: "",
  }, // default value (aka initial value)
});
