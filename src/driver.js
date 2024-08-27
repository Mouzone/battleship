import {Player} from "./player";
import {populateBoard, renderBoards} from "./driver.helper";
import "./style.css"

const AI_PLAYER = 0
const REAL_PLAYER = 1
const player1 = new Player(REAL_PLAYER)
const player2 = new Player(REAL_PLAYER)

populateBoard(player1)
populateBoard(player2)

renderBoards(player1, player2)


