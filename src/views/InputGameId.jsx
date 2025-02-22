import { useContext } from "react";
import { PlayingContext } from "../Context.jsx";
import Swal from "sweetalert2";
import MainLayout from "../layouts/MainLayout.jsx";
import Button from "../components/Button.jsx";

export default function InputGameId() {
  const {
    gameId,
    setGameId,
    player2,
    setPlayer2,
    machineSend,
    fetchGameIdExist,
    updateUrlWithParams,
    socketEmit,
    setColorThisPlayer,
  } = useContext(PlayingContext);

  const handleClick = async () => {
    if (!gameId || !player2) {
      Swal.fire({
        title: "Veuillez entrer un identifiant de partie et votre nom",
        icon: "warning",
        confirmButtonText: "Ok",
      });
      return;
    }

    const { data } = await fetchGameIdExist(gameId);

    if (data) {
      updateUrlWithParams({ gameId, player2 });
      socketEmit("updateGame", { gameId, player2 });
      setColorThisPlayer(data.colorPlayer2);
      machineSend({
        type: "Playing",
        gameId,
        player1: data.player1,
        colorPlayer1: data.colorPlayer1,
        player2,
        colorPlayer2: data.colorPlayer2,
      });
    } else {
      Swal.fire({
        title: "Cet identifiant de partie n'existe pas",
        icon: "warning",
        confirmButtonText: "Ok",
        customClass: { confirmButton: "bg-[var(--accent-color)] text-white" },
      });
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Veuillez entrer un identifiant de partie"
          className="p-2 text-center text-xl bg-white rounded-lg border-2 border-[var(--accent-color)] focus:outline-none focus:border-[var(--accent-color)]"
          value={gameId}
          onChange={(e) => setGameId(e.target.value)}
          data-aos="fade-down"
        />
        <input
          type="text"
          placeholder="Veuillez entrer votre nom"
          className="p-2 text-center text-xl bg-white rounded-lg border-2 border-[var(--accent-color)] focus:outline-none focus:border-[var(--accent-color)]"
          value={player2}
          onChange={(e) => setPlayer2(e.target.value)}
          data-aos="fade-up"
        />
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
