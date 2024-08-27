import {Player} from "./player";
import {populateBoard, updateBoard, updateGuessBoard, renderGrids, endGame} from "./driver.helper";
import "./style.css"

const AI_PLAYER = 0
const REAL_PLAYER = 1

let player1 = 0

const players = [new Player(REAL_PLAYER), new Player(REAL_PLAYER)]

function initGame() {
    renderGrids()
    players.forEach(player => {
        populateBoard(player)
    })
    updateBoard(players[ player1 ])
    updateGuessBoard(players[ player1 + 1 % 2])
    turn()
}

function turn() {

    const guess_board_element = document.getElementById("guess-board")
    const guess_cells = guess_board_element.querySelectorAll(".cell")
    guess_cells.forEach(cell => {
        cell.addEventListener("click", event => {
            const player2 = (player1 + 1) % 2
            players[player2].gameboard.receiveAttack(cell.dataset.row, cell.dataset.col)
            updateBoard(players[ player1 ])
            updateGuessBoard(players[ player2 ])
            if (!players[player1].gameboard.checkShipsLeft()) {
                endGame(player1)
            }
            player1 = player2
            // remove interactivity
            // for ai turn do not switch up boards
            // for ai turn do not need to iterate through its miss array,
            // jsut keep the two baords where they are
            turn()
        })
    })
}

initGame()


