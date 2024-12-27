import { useContext } from "react";
import { PlayingContext } from "../Context";

export default function WaitPlayer() {
  const { gameId, player1 } = useContext(PlayingContext);

  return (
    <div className="flex flex-col gap-4 items-center justify-center w-screen h-screen">
      <p className="text-center text-xl">
        Bienvenue <span className="font-600">{player1}</span>
      </p>
      <p className="text-center text-xl">
        Veuillez trouver ci-dessous le lien de connexion ainsi que l'identifiant
        de votre partie à partager à votre adversaire
      </p>
      <div className="space-y-2">
        <a
          href="#"
          className="text-center text-xl text-blue underline hover:opacity-[0.5]"
        >
          Lien de connexion
        </a>
        <p>ID de connexion : {gameId}</p>
      </div>
    </div>
  );
}
