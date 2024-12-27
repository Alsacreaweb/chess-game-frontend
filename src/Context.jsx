import React, { createContext, useState, useEffect } from "react";
import { useMachine } from "./hooks/useMachine.js";
import machine from "./utils/machine";

export const PlayingContext = createContext();
const PlayingProvider = ({ children }) => {
  const [gameId, setGameId] = useState("");
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [machineState, machineSend, machineContext] = useMachine(machine);

  return (
    <PlayingContext.Provider
      value={{
        gameId,
        setGameId,
        player1,
        setPlayer1,
        player2,
        setPlayer2,
        machineState,
        machineSend,
        machineContext,
      }}
    >
      {children}
    </PlayingContext.Provider>
  );
};

export default PlayingProvider;
