import {Gameboard} from "./gameboard";

export class Player {
    constructor(player_type) {
        this.player_type = player_type
        this.gameboard = new Gameboard()
    }
}