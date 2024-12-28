import { createMachine, guard, reduce, state, transition } from "robot3";

export default createMachine(
  "Playing", // Initial state
  {
    DefineStartModePlayGame: state(
      transition("InputPlayerName", "InputPlayerName"),
      transition("InputGameId", "InputGameId")
    ),
    InputPlayerName: state(
      transition(
        "WaitingEnemy",
        "WaitingEnemy",
        guard(
          (ctx, event) =>
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
      transition("Playing", "Playing"),
      transition("DefineStartModePlayGame", "DefineStartModePlayGame")
    ),
    InputGameId: state(
      transition(
        "Playing",
        "Playing",
        guard(
          (ctx, event) => event.gameId.length > 0 && event.player2.length > 0
        ),
        reduce((ctx, event) => ({
          ...ctx,
          gameId: event.gameId,
          player2: event.player2,
        }))
      ),
      transition("DefineStartModePlayGame", "DefineStartModePlayGame")
    ),
    Playing: state(
      transition("PlayingYourTurn", "PlayingYourTurn"),
      transition("PlayingNotYourTurn", "PlayingNotYourTurn")
    ),
    PlayingYourTurn: state(
      transition("ProposeADrawing", "ProposeADrawing"),
      transition("GiveUp", "GiveUp"),
      transition("Victory", "Victory")
    ),
    PlayingNotYourTurn: state(
      transition("Victory", "Victory"),
      transition("ProposeADrawing", "ProposeADrawing")
    ),
    ProposeADrawing: state("Draw", "Draw"),
    GiveUp: state(),
    Victory: state(),
    Draw: state(),
  },
  () => ({
    gameId: "bvcb45-454654",
    player1: "Brice",
    colorPlayer1: "white",
    player2: "Gregoire",
    colorPlayer2: "black",
  })
);
