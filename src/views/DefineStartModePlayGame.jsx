import { useContext, useEffect } from "react";
import Button from "../components/Button.jsx";
import MainLayout from "../layouts/MainLayout.jsx";
import { PlayingContext } from "../Context.jsx";

export default function DefineStartModePlayGame() {
  const {
    machineSend,
    fetchGameIdExist,
    player1,
    player2,
    colorPlayer1,
    colorPlayer2,
    updateUrlWithParams,
  } = useContext(PlayingContext);

  // Extraction des paramètres de l'URL
  const queryParameters = new URLSearchParams(window.location.search);
  const gameId = queryParameters.get("gameId");
  const player1GetUrl = queryParameters.get("player1");
  const player2GetUrl = queryParameters.get("player2");

  useEffect(() => {
    if (!gameId && !player1GetUrl && !player2GetUrl) {
      return;
    }
    if (gameId && !player1GetUrl && !player2GetUrl) {
      fetchGameIdExist(gameId).then((exists) => {
        if (exists) {
          machineSend({
            type: "InputGameIdWhenUrl",
            gameId: gameId,
            player1: player1,
            colorPlayer1: colorPlayer1,
            colorPlayer2: colorPlayer2,
          });
        } else {
          updateUrlWithParams();
        }
      });
    } else if (gameId && player1GetUrl && !player2GetUrl) {
      fetchGameIdExist(gameId).then((exists) => {
        if (exists) {
          machineSend({
            type: "WaitingEnemy",
            gameId: gameId,
            player1: player1,
            colorPlayer1: colorPlayer1,
            colorPlayer2: colorPlayer2,
          });
        } else {
          updateUrlWithParams();
        }
      });
    }
  }, [
    gameId,
    player1GetUrl,
    player2GetUrl,
    player1,
    player2,
    colorPlayer1,
    colorPlayer2,
    machineSend,
    fetchGameIdExist,
    updateUrlWithParams,
  ]);

  return (
    <MainLayout className="flex-col gap-4">
      <h1 className="text-center text-3xl font-600" data-aos="zoom-in">
        Bonjour et Bienvenue sur Chess Game !
      </h1>
      <p
        className="text-center text-xl"
        data-aos="fade-up"
        data-aos-delay="300"
      >
        Cette application, développée par{" "}
        <a
          href="http://www.alsacreaweb.fr"
          className="text-blue underline hover:opacity-[0.5]"
          target="_blank"
        >
          Alsacreaweb
        </a>
        , vous permet de jouer aux échecs en ligne et en multijoueur.
      </p>
      <p
        className="text-center text-xl"
        data-aos="fade-up"
        data-aos-delay="400"
      >
        Veuillez choisir une option pour démarrer votre partie.
      </p>
      <div className="flex gap-4" data-aos="fade-up" data-aos-delay="500">
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
