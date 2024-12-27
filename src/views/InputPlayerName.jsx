import { useContext } from "react";
import { PlayingContext } from "../Context";
import Swal from "sweetalert2";
import MainLayout from "../layouts/MainLayout";
import Button from "../components/Button";
import { v4 as uuidv4 } from "uuid";

export default function InputPlayerName() {
  const { player1, setPlayer1, setGameId, machineSend } =
    useContext(PlayingContext);

  const handleClick = function () {
    if (player1.length === 0) {
      Swal.fire({
        title: "Veuillez entrer votre nom",
        icon: "warning",
        confirmButtonText: "Ok",
        customClass: {
          confirmButton: "bg-[var(--accent-color)] text-white",
        },
      });
    } else {
      let gameId = uuidv4();
      setGameId(gameId);
      machineSend({ type: "WaitingEnemy", gameId: gameId, player1: player1 });
    }
  };

  return (
    <MainLayout>
      <div className="flex flex-col gap-4">
        <input
          type="text"
          placeholder="Veuillez entrer votre nom"
          className="p-2 text-center text-xl bg-white rounded-lg border-2 border-[var(--accent-color)] focus:outline-none focus:border-[var(--accent-color)]"
          value={player1}
          onChange={(e) => setPlayer1(e.target.value)}
        />
        <div className="flex justify-between gap-4 w-full">
          <Button onClick={() => machineSend("DefineStartModePlayGame")}>
            Retour
          </Button>
          <Button onClick={handleClick}>Démarrer</Button>
        </div>
      </div>
    </MainLayout>
  );
}
