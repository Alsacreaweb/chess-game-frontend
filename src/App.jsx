import React, { useContext, useEffect } from "react";
import { PlayingContext } from "./Context";
import { useWebSocket } from "./hooks/useWebSocket.js";
import DefineStartModePlayGame from "./views/DefineStartModePlayGame";
import InputPlayerName from "./views/InputPlayerName";
import InputGameId from "./views/InputGameId";
import WaitingEnemy from "./views/WaitingEnemy";
import Playing from "./views/Playing";

function App() {
  const { machineState } = useContext(PlayingContext);
  const { socketConnected } = useWebSocket();

  return (
    <>
      {machineState === "DefineStartModePlayGame" && (
        <DefineStartModePlayGame />
      )}
      {machineState === "InputPlayerName" && <InputPlayerName />}
      {machineState === "WaitingEnemy" && <WaitingEnemy />}
      {machineState === "InputGameId" && <InputGameId />}
      {(machineState === "Playing" ||
        machineState === "PlayingYourTurn" ||
        machineState === "PlayingNotYourTurn") && <Playing />}
    </>
  );
}

export default App;
