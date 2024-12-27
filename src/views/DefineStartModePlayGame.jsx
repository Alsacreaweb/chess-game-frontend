import Button from "../components/Button.jsx";
import MainLayout from "../layouts/MainLayout.jsx";
import { useContext } from "react";
import { PlayingContext } from "../Context.jsx";

export default function DefineStartModePlayGame() {
  const { machineSend } = useContext(PlayingContext);

  return (
    <MainLayout className="flex-col gap-4">
      <h1 className="text-center text-3xl font-600">
        Bonjour et Bienvenue sur Chess Game !
      </h1>
      <p className="text-center text-xl">
        Cette application, développé par{" "}
        <a
          href="http://www.alsacreaweb.fr"
          className="text-blue underline hover:opacity-[0.5]"
        >
          Alsacreaweb
        </a>
        , vous permet de jouer au échec en ligne et en multijoueur.
      </p>
      <p className="text-center text-xl">
        Veuillez choisir une option pour démarrer votre partie.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => machineSend("InputGameId")}>
          J'ai un id de partie
        </Button>
        <Button onClick={() => machineSend("InputPlayerName")}>
          Je n'ai pas d'id de partie
        </Button>
      </div>
    </MainLayout>
  );
}
