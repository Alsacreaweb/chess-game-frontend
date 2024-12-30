import { useContext, useEffect, useState } from "react";
import { PlayingContext } from "../Context";
import MainLayout from "../layouts/MainLayout";

export default function Playing() {
  const {
    chessBoard,
    player1,
    player2,
    colorPlayer1,
    colorPlayer2,
    playerCurrentColor,
    machineState,
    machineSend,
    colorThisPlayer,
  } = useContext(PlayingContext);
  const [possibleMoves, setPossibleMoves] = useState([]);

  // Effect for handling the turn logic
  useEffect(() => {
    // Vérifier si c'est au tour du joueur de jouer
    const isPlayerTurn =
      (colorPlayer1 === playerCurrentColor &&
        colorThisPlayer === colorPlayer1) ||
      (colorPlayer2 === playerCurrentColor && colorThisPlayer === colorPlayer2);

    if (isPlayerTurn) {
      machineSend("PlayingYourTurn");
    } else {
      machineSend("PlayingNotYourTurn");
    }

    // Fonction de confirmation avant de quitter la page
    const handleBeforeUnload = (event) => {
      const message =
        "Vous avez une partie en cours. Êtes-vous sûr de vouloir quitter ?";
      event.returnValue = message; // Pour les navigateurs modernes
      return message; // Pour les anciens navigateurs
    };

    // Écoute de l'événement "beforeunload" pour alerter l'utilisateur
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Cleanup pour retirer l'écouteur lors du démontage du composant
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [colorPlayer1, playerCurrentColor, colorThisPlayer, machineSend]);

  const getPositionKey = (index) => {
    const columns = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const row = 8 - Math.floor(index / 8);
    const col = columns[index % 8];
    return `${col}${row}`;
  };

  const fetchPossibleMoves = async (selectedPiece) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/v1/mouvements`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chessBoard,
            selectedPiece,
            colorPlay: colorThisPlayer.substr(0, 1), // Utilisation de la première lettre de la couleur pour API
          }),
        }
      );

      if (!response.ok) {
        throw new Error(`Erreur API: ${response.statusText}`);
      }

      const data = await response.json();
      setPossibleMoves(data.possibleMoves || []);
    } catch (error) {
      console.error(
        "Erreur lors de la récupération des mouvements possibles :",
        error
      );
    }
  };

  const handleChessBoardClick = (positionKey) => {
    if (chessBoard[positionKey] && machineState === "PlayingYourTurn") {
      fetchPossibleMoves(positionKey);
    }
  };

  const playerNameFromHisColor = (color) => {
    if (color === "white" && colorPlayer1 === "white") {
      return player1;
    } else {
      return player2;
    }
  };

  const translateColor = (color) => {
    if (color === "white") {
      return "Blanc";
    } else {
      return "Noir";
    }
  };

  useEffect(() => {
    console.log("Color this player :", colorThisPlayer);
  }, []);

  return (
    <MainLayout className="gap-4">
      <div className="flex gap-4">
        <div className="w-3/4 grid grid-cols-8 gap-0">
          {Array.from({ length: 64 }, (_, index) => {
            const row = Math.floor(index / 8);
            const col = index % 8;
            const isWhite = (row + col) % 2 === 0;

            const positionKey = getPositionKey(index);
            const pieceData = chessBoard[positionKey];

            const isPossibleMove = possibleMoves.includes(positionKey);

            return (
              <div
                key={index}
                className={`aspect-square border border-[#e4a86e] ${
                  isWhite ? "bg-[var(--case-blanche)]" : "bg-[var(--case-noir)]"
                } flex items-center justify-center ${
                  isPossibleMove ? "opacity-50" : ""
                }`}
                onClick={() => handleChessBoardClick(positionKey)}
              >
                {pieceData && (
                  <img
                    src={`/assets/${pieceData.color}${pieceData.piece}.png`}
                    alt={`${pieceData.color}${pieceData.piece}`}
                    className="w-3/4 h-3/4"
                  />
                )}
              </div>
            );
          })}
        </div>
        <div className="flex flex-col w-1/3 h-96 justify-start items-start">
          <div className="flex flex-col justify-start items-start gap-1 border border-black p-2 rounded-lg shadow-md w-full flex-grow-0">
            <h1 className="text-xl">Information de la partie</h1>
            <p>Joueur 1 : {player1}</p>
            <p>Couleur joueur 1 : {translateColor(colorPlayer1)}</p>
            <p>Joueur 2 : {player2}</p>
            <p>Couleur joueur 2 : {translateColor(colorPlayer2)}</p>
            <p>
              C'est au tour de {playerNameFromHisColor(playerCurrentColor)} de
              jouer !
            </p>
          </div>
          <p className="mt-2">Ici devront s'afficher les pièces jouées</p>
        </div>
      </div>
    </MainLayout>
  );
}
