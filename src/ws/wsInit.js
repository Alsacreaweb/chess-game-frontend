import { useEffect, useContext } from "react";
import { PlayingContext } from "../Context";

export const wsInit = (setColorThisPlayer) => {
  setColorThisPlayer("white"); // TODO: get color from ws
};

export default wsInit;
