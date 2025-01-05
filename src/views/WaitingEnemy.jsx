import { useContext, useEffect } from "react";
import { PlayingContext } from "../Context";
import Button from "../components/Button";
import { useBeforeUnload } from "../hooks/useBeforeUnload";
import copyData from "../utils/copyData";

export default function WaitPlayer() {
  const {
    gameId,
    player1,
    setPlayer2,
    colorPlayer1,
    colorPlayer2,
    toast,
    socketOn,
    socketOff,
    machineSend,
    setColorThisPlayer,
  } = useContext(PlayingContext);

  useBeforeUnload(
    "Vous êtes en attente d'un joueur, voulez-vous vraiment quitter la page ?"
  );

  const handleCopyLink = () => {
    const baseUrl = new URL(window.location.origin);
    baseUrl.searchParams.set("gameId", gameId);
    copyData(baseUrl.toString(), toast);
  };

  const handleExit = () => {
    const baseUrl = new URL(window.location.origin);
    baseUrl.search = "";
    window.history.replaceState(null, "", baseUrl.toString());
    fetch(`${import.meta.env.VITE_API_URL}/v1/exitGame`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        gameId: gameId,
      }),
    });
    machineSend("DefineStartModePlayGame");
  };

  useEffect(() => {
    const onGameUpdated = (data) => {
      if (data.player2) {
        setPlayer2(data.player2);
        setColorThisPlayer(colorPlayer1);
        machineSend({
          type: "Playing",
          gameId,
          player1,
          colorPlayer1,
          player2: data.player2,
          colorPlayer2,
        });
      }
    };

    socketOn("gameUpdated", onGameUpdated);
    return () => socketOff("gameUpdated", onGameUpdated);
  }, [
    gameId,
    player1,
    colorPlayer1,
    colorPlayer2,
    machineSend,
    socketOn,
    socketOff,
    setPlayer2,
    setColorThisPlayer,
  ]);

  return (
    <div className="flex flex-col gap-4 items-center justify-center w-screen h-screen">
      <p className="text-center text-xl">
        Bienvenue <span className="font-600">{player1}</span>
      </p>
      <p className="text-center text-xl">
        Veuillez trouver ci-dessous le lien de connexion ainsi que l'identifiant
        de votre partie à partager à votre adversaire
      </p>
      <div className="space-y-2 text-center">
        <Button onClick={handleCopyLink}>Copier le lien de connexion</Button>
        <Button onClick={() => handleExit()}>Quitter</Button>
        <p>ID de connexion : {gameId}</p>
      </div>
      <div className="flex flex-col justify-center items-center gap-4">
        <p>
          Veuillez patienter pendant que votre adversaire se connecte à votre
          partie
        </p>
      </div>
    </div>
  );
}
