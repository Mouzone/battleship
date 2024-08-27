import {Player} from "./player";
import {populateBoard, updateBoard, updateGuessBoard, renderGrids, endGame, aiAttack} from "./driver.helper";
import "./style.css"

const AI_PLAYER = 0
const REAL_PLAYER = 1

let player1 = 0

const players = [new Player(REAL_PLAYER), new Player(AI_PLAYER)]

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
    console.log(player1)
    const player2 = (player1 + 1) % 2
    if (players[player1].player_type === AI_PLAYER) {
        let row, col;
        [row, col] = aiAttack(players[ player2 ])
        players[player2].gameboard.receiveAttack(row, col)
        updateBoard(players[ player2 ])
        if (!players[player1].gameboard.checkShipsLeft()) {
            endGame(player1)
        }
        player1 = player2
        turn()

    } else {
        const guess_board_element = document.getElementById("guess-board")
        const guess_cells = guess_board_element.querySelectorAll(".cell")
        guess_cells.forEach(cell => {
            cell.addEventListener("click", event => {
                players[player2].gameboard.receiveAttack(
                    parseInt(cell.dataset.row), parseInt(cell.dataset.col))
                updateGuessBoard(players[player2])
                if (!players[player1].gameboard.checkShipsLeft()) {
                    endGame(player1)
                }
                player1 = player2
                turn()
            })
        })
    }
}

initGame()


