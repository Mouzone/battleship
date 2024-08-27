import {Gameboard} from "./gameboard";

const AI_PLAYER = 0
const REAL_PLAYER = 1

export class Player {
    constructor(player_type) {
        this.player_type = player_type
        this.gameboard = new Gameboard()
    }
}