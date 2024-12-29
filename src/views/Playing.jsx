import { useContext, useEffect, useState } from "react";
import { PlayingContext } from "../Context";
import MainLayout from "../layouts/MainLayout";

export default function Playing() {
  const {
    chessBoard,
    colorPlayer1,
    playerCurrentColor,
    machineState,
    machineSend,
    colorThisPlayer,
  } = useContext(PlayingContext);
  const [possibleMoves, setPossibleMoves] = useState([]);

  useEffect(() => {
    if (
      colorPlayer1 === playerCurrentColor &&
      colorPlayer1 === colorThisPlayer
    ) {
      machineSend("PlayingYourTurn");
    } else {
      machineSend("PlayingYourTurn");
    }
  }, []);

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
            colorPlay: colorThisPlayer.substr(0, 1),
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

  return (
    <MainLayout className="gap-4">
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
      <div className="flex flex-col gap-1 overflow-auto w-1/3">
        <p>Ici devront s'afficher les pièces jouées</p>
      </div>
    </MainLayout>
  );
}
