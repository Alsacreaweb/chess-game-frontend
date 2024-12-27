import React, { useContext } from "react";
import { PlayingContext } from "./Context";
import MainLayout from "./layouts/MainLayout";
import DefineStartModePlayGame from "./views/DefineStartModePlayGame";
import InputPlayerName from "./views/InputPlayerName";
import InputGameId from "./views/InputGameId";
import WaitingEnemy from "./views/WaitingEnemy";

function App() {
  const { machineState } = useContext(PlayingContext);

  return (
    <MainLayout>
      {machineState === "DefineStartModePlayGame" && (
        <DefineStartModePlayGame />
      )}
      {machineState === "InputPlayerName" && <InputPlayerName />}
      {machineState === "WaitingEnemy" && <WaitingEnemy />}
      {machineState === "InputGameId" && <InputGameId />}
    </MainLayout>
  );
}

export default App;
