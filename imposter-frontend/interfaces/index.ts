//auth
export type {default as loginRequest} from "./authInterfaces/LoginRequest";
export type{ default as loginResponse } from "./authInterfaces/LoginResponse";
export type{default as registerRequest} from "./authInterfaces/registerRequest";

//privateGame
export type{default as createGameRequest} from "./privateGameInterfaces/createGameRequest";
export type{default as participant} from "./privateGameInterfaces/participant";
export type{default as privateGameDetails} from "./privateGameInterfaces/privateGameDetails";

//publicGame
export type{default as gameLobby} from "./publicGameInterfaces/gameLobby";
export type{default as publicGameDetails} from "./publicGameInterfaces/publicGameDetails";
export type{default as publicGameJoinDetails} from "./publicGameInterfaces/publicGameJoinDetails";
export type{default as startGame} from "./publicGameInterfaces/startGame";
export type{default as voteCast} from "./publicGameInterfaces/voteCast";

export type{default as ApiResponse} from "./ApiResponse"
export type{default as ErrorResponse} from "./ErrorResponse"