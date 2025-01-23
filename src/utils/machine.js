import { createMachine, guard, reduce, state, transition } from "robot3";

export default createMachine(
  "DefineStartModePlayGame", // Initial state
  {
    DefineStartModePlayGame: state(
      transition("InputPlayerName", "InputPlayerName"),
      transition("InputGameId", "InputGameId"),
      transition(
        "InputGameIdWhenUrl",
        "InputGameId",
        guard(
          (_, event) =>
            event.gameId.length > 0 &&
            event.player1.length > 0 &&
            event.colorPlayer1.length > 0 &&
            event.colorPlayer2.length > 0
        ),
        reduce((ctx, event) => ({
          ...ctx,
          gameId: event.gameId,
          player1: event.player1,
          colorPlayer1: event.colorPlayer1,
          colorPlayer2: event.colorPlayer2,
        }))
      ),
      transition(
        "WaitingEnemy",
        "WaitingEnemy",
        guard(
          (_, event) =>
            event.gameId.length > 0 &&
            event.player1.length > 0 &&
            event.colorPlayer1.length > 0 &&
            event.colorPlayer2.length > 0
        ),
        reduce((ctx, event) => ({
          ...ctx,
          gameId: event.gameId,
          player1: event.player1,
          colorPlayer1: event.colorPlayer1,
          colorPlayer2: event.colorPlayer2,
        }))
      )
    ),
    InputPlayerName: state(
      transition(
        "WaitingEnemy",
        "WaitingEnemy",
        guard(
          (_, event) =>
            event.player1.length > 0 &&
            event.gameId.length > 0 &&
            event.colorPlayer1.length > 0 &&
            event.colorPlayer2.length > 0
        ),
        reduce((ctx, event) => ({
          ...ctx,
          gameId: event.gameId,
          player1: event.player1,
          colorPlayer1: event.colorPlayer1,
          colorPlayer2: event.colorPlayer2,
        }))
      ),
      transition("DefineStartModePlayGame", "DefineStartModePlayGame")
    ),
    WaitingEnemy: state(
      transition(
        "Playing",
        "Playing",
        guard(
          (_, event) =>
            event.player1.length > 0 &&
            event.gameId.length > 0 &&
            event.player2.length > 0 &&
            event.colorPlayer1.length > 0 &&
            event.colorPlayer2.length > 0
        ),
        reduce((ctx, event) => ({
          ...ctx,
          gameId: event.gameId,
          player1: event.player1,
          player2: event.player2,
          colorPlayer1: event.colorPlayer1,
          colorPlayer2: event.colorPlayer2,
        }))
      ),
      transition("DefineStartModePlayGame", "DefineStartModePlayGame")
    ),
    InputGameId: state(
      transition(
        "Playing",
        "Playing",
        guard(
          (ctx, event) =>
            event.gameId.length > 0 &&
            event.player1.length > 0 &&
            event.colorPlayer1.length > 0 &&
            event.player2.length > 0 &&
            event.colorPlayer2.length > 0
        ),
        reduce((ctx, event) => ({
          ...ctx,
          gameId: event.gameId,
          player1: event.player1,
          colorPlayer1: event.colorPlayer1,
          player2: event.player2,
          colorPlayer2: event.colorPlayer2,
        }))
      ),
      transition("DefineStartModePlayGame", "DefineStartModePlayGame")
    ),
    Playing: state(
      transition("PlayingYourTurn", "PlayingYourTurn"),
      transition("PlayingNotYourTurn", "PlayingNotYourTurn")
    ),
    PlayingYourTurn: state(
      transition("PlayingNotYourTurn", "PlayingNotYourTurn"),
      transition("ProposeADrawing", "ProposeADrawing"),
      transition("Draw", "Draw"),
      transition("DrawRefuse", "DrawRefuse"),
      transition("GiveUp", "GiveUp"),
      transition("Victory", "Victory"),
      transition("DefineStartModePlayGame", "DefineStartModePlayGame")
    ),
    PlayingNotYourTurn: state(
      transition("PlayingYourTurn", "PlayingYourTurn"),
      transition("GiveUp", "GiveUp"),
      transition("Victory", "Victory"),
      transition("ProposeADrawing", "ProposeADrawing"),
      transition("Draw", "Draw"),
      transition("DrawRefuse", "DrawRefuse"),
      transition("DefineStartModePlayGame", "DefineStartModePlayGame")
    ),
    ProposeADrawing: state(
      transition("PlayingNotYourTurn", "PlayingNotYourTurn"),
      transition("PlayingYourTurn", "PlayingYourTurn"),
      transition("Draw", "Draw")
    ),
    GiveUp: state(),
    Victory: state(
      transition("DefineStartModePlayGame", "DefineStartModePlayGame")
    ),
    Draw: state(
      transition("DefineStartModePlayGame", "DefineStartModePlayGame")
    ),
  },
  () => ({
    gameId: "",
    player1: "",
    colorPlayer1: "",
    player2: "",
    colorPlayer2: "",
  })
);
