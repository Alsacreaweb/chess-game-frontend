import React, { useContext } from "react";
import { PlayingContext } from "./Context";
import MainLayout from "./layouts/MainLayout";
import DefineStartModePlayGame from "./views/DefineStartModePlayGame";
import InputPlayerName from "./views/InputPlayerName";
import InputGameId from "./views/InputGameId";
import WaitingEnemy from "./views/WaitingEnemy";
import Playing from "./views/Playing";

function App() {
  const { machineState } = useContext(PlayingContext);

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
