//auth
export type {default as loginRequest} from "./authTypes/LoginRequest";
export type{ default as loginResponse } from "./authTypes/LoginResponse";
export type{default as registerRequest} from "./authTypes/registerRequest";

//privateGame
export type{default as createGameRequest} from "./privateGameTypes/createGameRequest";
export type{default as participant} from "./privateGameTypes/participant";
export type{default as privateGameDetails} from "./privateGameTypes/privateGameDetails";

//publicGame
export type{default as gameLobby} from "./publicGameTypes/gameLobby";
export type{default as publicGameDetails} from "./publicGameTypes/publicGameDetails";
export type{default as publicGameJoinDetails} from "./publicGameTypes/publicGameJoinDetails";
export type{default as startGame} from "./publicGameTypes/startGame";
export type{default as voteCast} from "./publicGameTypes/voteCast";