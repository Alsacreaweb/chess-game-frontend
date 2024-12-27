import React, { useContext } from "react";
import { PlayingContext } from "./Context";
import MainLayout from "./layouts/MainLayout";

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
