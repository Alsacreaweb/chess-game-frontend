import React, { useContext } from "react";
import { PlayingContext } from "./Context";
import MainLayout from "./layouts/MainLayout";

function App() {
  const { machineState } = useContext(PlayingContext);

  return <MainLayout></MainLayout>;
}

export default App;
