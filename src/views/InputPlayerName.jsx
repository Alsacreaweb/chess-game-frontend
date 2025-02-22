import { useContext, useEffect } from "react";
import { PlayingContext } from "../Context";
import Swal from "sweetalert2";
import MainLayout from "../layouts/MainLayout";
import Button from "../components/Button";
import { nanoid, customAlphabet } from "nanoid";

export default function InputPlayerName() {
  const {
    player1,
    setPlayer1,
    colorPlayer1,
    setColorPlayer1,
    colorPlayer2,
    setColorPlayer2,
    setGameId,
    machineSend,
    socketEmit,
    updateUrlWithParams,
  } = useContext(PlayingContext);

  const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz", 3);

  const handleClick = () => {
    if (!player1 || !colorPlayer1) {
      Swal.fire({
        title: "Veuillez entrer votre nom et choisir une couleur",
        icon: "warning",
        confirmButtonText: "Ok",
      });
      return;
    }

    const newGameId = nanoid();
    setGameId(newGameId);
    machineSend({
      type: "WaitingEnemy",
      gameId: newGameId,
      player1,
      colorPlayer1,
      colorPlayer2,
    });
    socketEmit("createGame", {
      gameId: newGameId,
      player1,
      colorPlayer1,
      colorPlayer2,
    });
    updateUrlWithParams({ gameId: newGameId, player1 });
  };

  useEffect(() => {
    if (colorPlayer1) {
      setColorPlayer2(colorPlayer1 === "white" ? "black" : "white");
    }
  }, [colorPlayer1]);

  return (
    <MainLayout>
      <div className="flex flex-col gap-4">
        <h1 className="text-center text-3xl font-600" data-aos="fade-down">
          Configuration d'une nouvelle partie
        </h1>
        <input
          type="text"
          placeholder="Veuillez entrer votre nom"
          className="p-2 text-center text-xl bg-white rounded-lg border-2 border-[var(--accent-color)] focus:outline-none focus:border-[var(--accent-color)]"
          value={player1}
          onChange={(e) => setPlayer1(e.target.value)}
          data-aos="fade-down"
        />
        <div className="flex flex-col items-center gap-4 w-full">
          <p>Choisissez votre couleur</p>
          <div className="flex gap-4">
            <label htmlFor="white">
              <img
                src={`${import.meta.env.VITE_APP_URL}/assets/wk.png`}
                className={
                  colorPlayer1 === "white" ? "opacity-50" : "opacity-100"
                }
                alt="White"
              />
              <input
                type="radio"
                id="white"
                name="color"
                value="white"
                className="hidden"
                checked={colorPlayer1 === "white"}
                onChange={(e) => setColorPlayer1(e.target.value)}
              />
            </label>
            <label htmlFor="black">
              <img
                src="assets/bk.png"
                className={
                  colorPlayer1 === "black" ? "opacity-50" : "opacity-100"
                }
                alt="Black"
              />
              <input
                type="radio"
                id="black"
                name="color"
                value="black"
                className="hidden"
                checked={colorPlayer1 === "black"}
                onChange={(e) => setColorPlayer1(e.target.value)}
              />
            </label>
          </div>
        </div>
        <div className="flex justify-between gap-4 w-full" data-aos="fade-up">
          <Button onClick={() => machineSend("DefineStartModePlayGame")}>
            Retour
          </Button>
          <Button onClick={handleClick}>Démarrer</Button>
        </div>
      </div>
    </MainLayout>
  );
}
