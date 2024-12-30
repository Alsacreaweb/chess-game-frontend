import { useContext, useEffect } from "react";
import { PlayingContext } from "../Context";
import Button from "../components/Button";
import ClipLoader from "react-spinners/ClipLoader";

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

  // Fonction pour copier le lien du jeu
  const copyLink = (gameId) => {
    const baseUrl = new URL(window.location.origin);
    baseUrl.searchParams.set("gameId", gameId);
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(baseUrl.toString())
        .then(() => {
          toast("Lien copié dans le presse-papier !");
        })
        .catch((err) => {
          console.error("Failed to copy link:", err);
        });
    }
  };

  // Utilisation de useEffect pour écouter les mises à jour du jeu via WebSocket
  useEffect(() => {
    socketOn("gameUpdated", (data) => {
      console.log("Le jeu a été mis à jour. Voici les informations :", data);
      if (data.player2) {
        setPlayer2(data.player2);
        setColorThisPlayer(colorPlayer1);
        machineSend({
          type: "Playing",
          gameId: gameId,
          player1: player1,
          colorPlayer1: colorPlayer1,
          player2: data.player2,
          colorPlayer2: colorPlayer2,
        });
      }
    });

    // Fonction pour avertir l'utilisateur avant de quitter ou de recharger la page
    const handleBeforeUnload = (event) => {
      const message =
        "Vous avez une partie en cours. Êtes-vous sûr de vouloir quitter ?";
      event.returnValue = message; // Pour les navigateurs modernes
      return message; // Pour les anciens navigateurs
    };

    // Ajout du listener avant le rechargement ou la fermeture de la page
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Clean-up : Retirer l'écouteur lors du démontage du composant
    return () => {
      socketOff("gameUpdated");
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [
    gameId,
    player1,
    colorPlayer1,
    colorPlayer2,
    machineSend,
    socketOn,
    socketOff,
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
        <Button href={`/?gameId=${gameId}`} onClick={() => copyLink(gameId)}>
          Copier le lien de connexion
        </Button>
        <p>ID de connexion : {gameId}</p>
      </div>
      <div className="flex flex-col justify-center items-center gap-4">
        <p>
          Veuillez patienter pendant que votre adversaire se connecte à votre
          partie
        </p>
        <ClipLoader
          color={"#FF9900"}
          loading={true}
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </div>
    </div>
  );
}
