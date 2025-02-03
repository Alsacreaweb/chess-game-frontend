import React, { useContext, useEffect, useState, useRef } from "react";
import { PlayingContext } from "../Context";
import MainLayout from "../layouts/MainLayout";
import Button from "../components/Button";
import { useBeforeUnload } from "../hooks/useBeforeUnload";
import Swal from "sweetalert2";
import { useWindowSize } from "react-use";
import Confetti from "react-confetti";
import ModalWithBackdrop from "../components/ModalWithBackdrop";

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
    toast,
    purgeContext,
  } = useContext(PlayingContext);
  const [possibleMoves, setPossibleMoves] = useState([]);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [isPlayerVictory, setIsPlayerVictory] = useState("");
  const { width, height } = useWindowSize();
  const [playerProposeADrawing, setPlayerProposeADrawing] = useState("");
  const [typeVictory, setTypeVictory] = useState("");
  const [moves, setMoves] = useState([]);
  const scrollRef = useRef(null);
  const [isCheckmate, setIsCheckmate] = useState(false);
  const [isCheck, setIsCheck] = useState(false);
  const [colorKingInCheck, setColorKingInCheck] = useState("");
  const [pieceThatPutsIntoCheck, setPieceThatPutsIntoCheck] = useState("");

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
    fetch(`${import.meta.env.VITE_API_URL}/v1/status`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chessBoard: chessBoard,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        setIsCheckmate(data.isCheckmate);
        setIsPlayerVictory(data.isVictory);
        setIsCheck(data.isCheck);
        setColorKingInCheck(data.colorKingInCheck);
        setPieceThatPutsIntoCheck(data.pieceThatPutsIntoCheck);
      });
  }, [moves]);

  useEffect(() => {
    if (isCheckmate) {
      machineSend("Victory");
    }
  }, [isCheckmate]);

  useBeforeUnload(
    "Vous avez une partie en cours. Êtes-vous sûr de vouloir quitter ?"
  );

  useEffect(() => {
    socketOn("pieceMoved", (data) => {
      setChessBoard(data.chessBoard);
      setMoves(data.moves);
      if (data.playerCurrentColor === "white") {
        setPlayerCurrentColor("white");
      } else {
        setPlayerCurrentColor("black");
      }
    });
    socketOn("action", (data) => {
      if (data.type === "giveUp") {
        setIsPlayerVictory(data.playerVictory);
        setTypeVictory("GiveUp");
        machineSend("Victory");
      }
      if (data.type === "proposeADrawing") {
        machineSend("ProposeADrawing");
      }
      if (data.type === "proposeADrawingAccept") {
        machineSend("Draw");
      }
      if (data.type === "proposeADrawingRefuse") {
        if (data.playerProposeADrawingRefuse !== colorThisPlayer) {
          toast("Votre adversaire a refusé votre proposition de match nul.");
        }
        if (data.playerCurrentColor === colorThisPlayer) {
          machineSend("PlayingYourTurn");
        } else {
          machineSend("PlayingNotYourTurn");
        }
        setPlayerProposeADrawing("");
      }
    });
  }, []);

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

    // Small castling management
    if (
      piece.piece === "k" &&
      Math.abs(destination.charCodeAt(0) - selectedPiece.charCodeAt(0)) === 2
    ) {
      if (destination === "g1") {
        updatedBoard["f1"] = updatedBoard["h1"];
        delete updatedBoard["h1"];
      } else if (destination === "g8") {
        updatedBoard["f8"] = updatedBoard["h8"];
        delete updatedBoard["h8"];
      }
    }

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
      piece: chessBoard[selectedPiece].piece,
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

  const pieceNameFromFirstLetter = (letter) => {
    switch (letter) {
      case "p":
        return "Pion";
      case "n":
        return "Cavalier";
      case "b":
        return "Fou";
      case "q":
        return "Reine";
      case "k":
        return "Roi";
      case "r":
        return "Tour";
      default:
        return "Erreur";
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
    if (action === "GiveUp") {
      Swal.fire({
        title: "Êtes-vous sûr de vouloir abandonner ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui, abandonner",
        cancelButtonText: "Annuler",
        customClass: {
          confirmButton: "bg-[var(--accent-color)] text-white",
          cancelButton: "bg-gray-300 text-black",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          socketEmit("action", {
            action: "giveUp",
            player: colorThisPlayer,
            gameId: gameId,
          });
          machineSend("DefineStartModePlayGame");
        }
      });
    }
    if (action === "ProposeADrawing") {
      Swal.fire({
        title: "Êtes-vous sûr de vouloir proposer un match nul ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui, proposer un match nul",
        cancelButtonText: "Annuler",
        customClass: {
          confirmButton: "bg-[var(--accent-color)] text-white",
          cancelButton: "bg-gray-300 text-black",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          setPlayerProposeADrawing(colorThisPlayer);
          socketEmit("action", {
            action: "proposeADrawing",
            player: colorThisPlayer,
            machineState: machineState,
            gameId: gameId,
          });
        }
      });
    }
    if (action === "ProposeADrawingAccept") {
      Swal.fire({
        title: "Êtes-vous sûr de vouloir accepter le match nul ?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Oui, accepter",
        cancelButtonText: "Annuler",
        customClass: {
          confirmButton: "bg-[var(--accent-color)] text-white",
          cancelButton: "bg-gray-300 text-black",
        },
      }).then((result) => {
        if (result.isConfirmed) {
          socketEmit("action", {
            action: "proposeADrawingAccept",
            player: colorThisPlayer,
            gameId: gameId,
          });
        }
      });
    }
    if (action === "ProposeADrawingRefuse") {
      socketEmit("action", {
        action: "proposeADrawingRefuse",
        playerCurrentColor: playerCurrentColor,
        player: colorThisPlayer,
        gameId: gameId,
      });
    }
  };

  return (
    <MainLayout className="gap-4 flex-col">
      <div className="flex gap-2">
        <div className="grid grid-cols-8 w-3/4 gap-0 h-min">
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
                  isWhite ? "bg-[var(--case-blanche)]" : "bg-[var(--case-noir)]"
                } flex items-center justify-center ${
                  isPossibleMove ? "opacity-50" : ""
                } ${isSelected ? "bg-blue-200" : ""} ${
                  isCheck && positionKey === pieceThatPutsIntoCheck
                    ? "bg-red-400"
                    : ""
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
        <div className="flex flex-col w-1/3 justify-start items-start gap-4">
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
          <div
            ref={scrollRef}
            className="h-[500px] overflow-auto border border-black rounded-lg shadow-md w-full overflow-y"
          >
            {moves && (
              <table className="relative table-auto w-full border-collapse">
                <thead className="bg-gray-100">
                  <tr className="text-center">
                    <th className="px-4 py-2 border-b">Joueur</th>
                    <th className="px-4 py-2 border-b">Pièce</th>
                    <th className="px-4 py-2 border-b">De</th>
                    <th className="px-4 py-2 border-b">À</th>
                  </tr>
                </thead>
                <tbody>
                  {moves.map((move, index) => (
                    <tr
                      key={index}
                      className={`text-center ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      } ${
                        move.check.isCheck
                          ? "bg-red-200 isInCheck relative"
                          : ""
                      }`}
                    >
                      <td className="px-4 py-2 border-t">
                        {playerNameFromHisColor(move.player)}
                      </td>
                      <td className="px-4 py-2 border-t">
                        {pieceNameFromFirstLetter(move.piece)}
                      </td>
                      <td className="px-4 py-2 border-t">{move.from}</td>
                      <td className="px-4 py-2 border-t">{move.to}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
      <div className="flex self-start gap-2">
        <Button onClick={() => handleButtonAction("GiveUp")}>Abondonner</Button>
        <Button onClick={() => handleButtonAction("ProposeADrawing")}>
          Proposer un match nul
        </Button>
      </div>
      {machineState === "ProposeADrawing" && (
        <ModalWithBackdrop
          message={
            playerProposeADrawing !== colorThisPlayer
              ? "Votre adversaire a proposé un match nul."
              : "Vous avez proposé un match nul, veuillez patienter pendant que votre adversaire accepte ou refuse."
          }
          buttons={
            playerProposeADrawing !== colorThisPlayer ? (
              <>
                <Button
                  onClick={() => handleButtonAction("ProposeADrawingAccept")}
                >
                  Accepter
                </Button>
                <Button
                  onClick={() => handleButtonAction("ProposeADrawingRefuse")}
                >
                  Refuser
                </Button>
              </>
            ) : null
          }
        />
      )}

      {machineState === "Draw" && (
        <ModalWithBackdrop
          message={
            playerProposeADrawing === colorThisPlayer
              ? "Votre adversaire a accepté votre proposition de match nul."
              : "Vous avez accepté la proposition de match nul."
          }
          buttons={<Button onClick={() => purgeContext("")}>Quitter</Button>}
        />
      )}

      {machineState === "Victory" && (
        <ModalWithBackdrop
          message={
            typeVictory === "GiveUp"
              ? "Bravo, vous avez gagné. Votre adversaire a abondonné"
              : isPlayerVictory === colorThisPlayer.substring(0, 1)
              ? "Bravo, vous avez gagné en battant votre adversaire"
              : "Vous avez perdu, votre adversaire a gagné"
          }
          buttons={<Button onClick={() => purgeContext("")}>Quitter</Button>}
        >
          {isPlayerVictory === colorThisPlayer.substring(0, 1) && (
            <Confetti width={width} height={height} />
          )}
        </ModalWithBackdrop>
      )}
    </MainLayout>
  );
}
