import { useContext } from "react";
import { PlayingContext } from "../Context.jsx";
import Swal from "sweetalert2";
import MainLayout from "../layouts/MainLayout.jsx";
import Button from "../components/Button.jsx";

export default function InputGameId() {
  const { gameId, setGameId, player2, setPlayer2, machineSend } =
    useContext(PlayingContext);

  const handleClick = function () {
    if (gameId.length === 0 || player2.length === 0) {
      Swal.fire({
        title: "Veuillez entrer un identifiant de partie et votre nom",
        icon: "warning",
        confirmButtonText: "Ok",
        customClass: {
          confirmButton: "bg-[var(--accent-color)] text-white",
        },
      });
    } else {
      machineSend({ type: "Playing", gameId: gameId, player2: player2 });
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
