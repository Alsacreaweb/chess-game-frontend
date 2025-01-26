import React, { createContext, useState, useEffect } from "react";
import { useMachine } from "./hooks/useMachine.js";
import machine from "./utils/machine";
import { useWebSocket } from "./hooks/useWebSocket.js";
import { ToastContainer, toast } from "react-toastify";

export const PlayingContext = createContext();
const PlayingProvider = ({ children }) => {
  const [colorThisPlayer, setColorThisPlayer] = useState("");
  const [gameId, setGameId] = useState("");
  const [player1, setPlayer1] = useState("");
  const [colorPlayer1, setColorPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [colorPlayer2, setColorPlayer2] = useState("");
  const [playerCurrentColor, setPlayerCurrentColor] = useState("white"); // The first player is white
  const [machineState, machineSend, machineContext] = useMachine(machine);
  const chessBoardStartPlaying = {
    a1: {
      piece: "r",
      color: "w",
    },
    b1: {
      piece: "n",
      color: "w",
    },
    c1: {
      piece: "b",
      color: "w",
    },
    d1: {
      piece: "q",
      color: "w",
    },
    e1: {
      piece: "k",
      color: "w",
    },
    f1: {
      piece: "b",
      color: "w",
    },
    g1: {
      piece: "n",
      color: "w",
    },
    h1: {
      piece: "r",
      color: "w",
    },
    a2: {
      piece: "p",
      color: "w",
    },
    b2: {
      piece: "p",
      color: "w",
    },
    c2: {
      piece: "p",
      color: "w",
    },
    d2: {
      piece: "p",
      color: "w",
    },
    e2: {
      piece: "p",
      color: "w",
    },
    f2: {
      piece: "p",
      color: "w",
    },
    g2: {
      piece: "p",
      color: "w",
    },
    h2: {
      piece: "p",
      color: "w",
    },
    a7: {
      piece: "p",
      color: "b",
    },
    b7: {
      piece: "p",
      color: "b",
    },
    c7: {
      piece: "p",
      color: "b",
    },
    d7: {
      piece: "p",
      color: "b",
    },
    e7: {
      piece: "p",
      color: "b",
    },
    f7: {
      piece: "p",
      color: "b",
    },
    g7: {
      piece: "p",
      color: "b",
    },
    h7: {
      piece: "p",
      color: "b",
    },
    a8: {
      piece: "r",
      color: "b",
    },
    b8: {
      piece: "n",
      color: "b",
    },
    c8: {
      piece: "b",
      color: "b",
    },
    d8: {
      piece: "q",
      color: "b",
    },
    e8: {
      piece: "k",
      color: "b",
    },
    f8: {
      piece: "b",
      color: "b",
    },
    g8: {
      piece: "n",
      color: "b",
    },
    h8: {
      piece: "r",
      color: "b",
    },
  };
  const [chessBoard, setChessBoard] = useState(chessBoardStartPlaying);
  const { socketRef, socketConnected, socketEmit, socketOn, socketOff } =
    useWebSocket(import.meta.env.VITE_WS_URL);
  const fetchGameIdExist = async (gameId) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/v1/gameid`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            gameId: gameId,
          }),
        }
      );

      if (response.status === 404) {
        return false;
      }

      const data = await response.json();
      setGameId(gameId);
      setPlayer1(data.player1);
      setColorPlayer1(data.colorPlayer1);
      setColorPlayer2(data.colorPlayer2);
      if (data.player2) {
        setPlayer2(data.player2);
      }
      return { data };
    } catch (error) {
      console.error(error);
      return false;
    }
  };
  const updateUrlWithParams = (params = {}) => {
    const currentUrl = new URL(window.location.href);

    if (Object.keys(params).length === 0) {
      currentUrl.search = "";
    } else {
      Object.keys(params).forEach((key) => {
        const value = params[key];
        if (value !== undefined && value !== null) {
          currentUrl.searchParams.set(key, value);
        } else {
          currentUrl.searchParams.delete(key);
        }
      });
    }
    window.history.pushState({}, "", currentUrl.toString());
  };
  const purgeContext = () => {
    setGameId("");
    setPlayer1("");
    setColorPlayer1("");
    setPlayer2("");
    setColorPlayer2("");
    setChessBoard(chessBoardStartPlaying);
    machineSend("DefineStartModePlayGame");
    updateUrlWithParams({});
  };

  return (
    <PlayingContext.Provider
      value={{
        socketRef,
        socketConnected,
        socketEmit,
        socketOn,
        socketOff,
        colorThisPlayer,
        setColorThisPlayer,
        gameId,
        setGameId,
        colorPlayer1,
        setColorPlayer1,
        colorPlayer2,
        setColorPlayer2,
        player1,
        setPlayer1,
        player2,
        setPlayer2,
        playerCurrentColor,
        setPlayerCurrentColor,
        machineState,
        machineSend,
        machineContext,
        chessBoard,
        setChessBoard,
        fetchGameIdExist,
        updateUrlWithParams,
        toast,
        purgeContext,
      }}
    >
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
      {children}
    </PlayingContext.Provider>
  );
};

export default PlayingProvider;
