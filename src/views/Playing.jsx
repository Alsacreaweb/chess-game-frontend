import { useContext, useEffect, useState } from "react";
import { PlayingContext } from "../Context";
import MainLayout from "../layouts/MainLayout";
import Button from "../components/Button";
import { useBeforeUnload } from "../hooks/useBeforeUnload";

export default function Playing() {
  const {
    gameId,
    setChessBoard,
    chessBoard,
    player1,
    player2,
    colorPlayer1,
    colorPlayer2,
    playerCurrentColor,
    setPlayerCurrentColor,
    machineState,
    machineSend,
    colorThisPlayer,
    socketEmit,
    socketOn,
  } = useContext(PlayingContext);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [selectedPiece, setSelectedPiece] = useState(null);

  useBeforeUnload(
    "Vous avez une partie en cours. Êtes-vous sûr de vouloir quitter ?"
  );

  useEffect(() => {
    socketOn("pieceMoved", (data) => {
      setChessBoard(data.chessBoard);
      if (data.playerCurrentColor === "white") {
        setPlayerCurrentColor("white");
      } else {
        setPlayerCurrentColor("black");
      }
    });
  }, [socketOn, setChessBoard]);

  useEffect(() => {
    const isPlayerTurn =
      (colorPlayer1 === playerCurrentColor &&
        colorThisPlayer === colorPlayer1) ||
      (colorPlayer2 === playerCurrentColor && colorThisPlayer === colorPlayer2);

    if (isPlayerTurn) {
      machineSend("PlayingYourTurn");
    } else {
      machineSend("PlayingNotYourTurn");
    }
  }, [colorPlayer1, playerCurrentColor, colorThisPlayer, machineSend]);

  useEffect(() => {
    if (machineState === "ProposeADrawing") {
      console.log("Proposer un match nul");
    } else if (machineState === "GiveUp") {
      console.log("");
    } else if (machineState === "Victory") {
      console.log("Proposer un match nul");
    } else if (machineState === "Draw") {
    }
  }, [machineState]);

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
    if (
      chessBoard[positionKey] &&
      machineState === "PlayingYourTurn" &&
      chessBoard[positionKey].color === colorThisPlayer.substr(0, 1)
    ) {
      setSelectedPiece(positionKey);
      fetchPossibleMoves(positionKey);
    } else if (possibleMoves.includes(positionKey)) {
      handleMovePiece(positionKey);
      setSelectedPiece(null);
      setPossibleMoves([]);
    } else {
      setSelectedPiece(null);
      setPossibleMoves([]);
    }
  };

  const handleMovePiece = (destination) => {
    if (!selectedPiece || !chessBoard[selectedPiece]) return;

    const updatedBoard = { ...chessBoard };

    const piece = updatedBoard[selectedPiece];
    updatedBoard[destination] = piece;
    delete updatedBoard[selectedPiece];

    setChessBoard(updatedBoard);
    setSelectedPiece(null);
    setPossibleMoves([]);

    if (playerCurrentColor === "white") {
      setPlayerCurrentColor("black");
    } else {
      setPlayerCurrentColor("white");
    }

    socketEmit("movePiece", {
      gameId: gameId,
      chessBoard: updatedBoard,
      playerColor: colorThisPlayer,
      selectedPiece: selectedPiece,
      destination: destination,
      playerCurrentColor: playerCurrentColor,
    });
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

  const handleButtonAction = (action) => {
    console.log(action);
  };

  return (
    <MainLayout className="gap-4">
      <div className="flex gap-2">
        <div className="flex flex-col w-3/4 ">
          <div className="grid grid-cols-8 gap-0">
            {Array.from({ length: 64 }, (_, index) => {
              const row = Math.floor(index / 8);
              const col = index % 8;
              const isWhite = (row + col) % 2 === 0;

              const positionKey = getPositionKey(index);
              const pieceData = chessBoard[positionKey];

              const isPossibleMove = possibleMoves.includes(positionKey);
              const isSelected = positionKey === selectedPiece;

              return (
                <div
                  key={index}
                  className={`aspect-square border border-[#e4a86e] ${
                    isWhite
                      ? "bg-[var(--case-blanche)]"
                      : "bg-[var(--case-noir)]"
                  } flex items-center justify-center ${
                    isPossibleMove ? "opacity-50" : ""
                  } ${isSelected ? "bg-blue-200" : ""}`}
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
          <div className="flex gap-2">
            <Button onClick={() => handleButtonAction("GiveUp")}>
              Abondonner
            </Button>
            <Button onClick={() => handleButtonAction("ProposeADrawing")}>
              Proposer un match nul
            </Button>
          </div>
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
          <p className="mt-2">Ici devront afficher les pièces jouées</p>
        </div>
      </div>
    </MainLayout>
  );
}
