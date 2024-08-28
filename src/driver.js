import {Player} from "./player";
import {updateBoard, updateGuessBoard, renderGrids, endGame, aiAttack, generateShips, cleanBoard} from "./driver.helper";
import "./style.css"

const AI_PLAYER = 0
const REAL_PLAYER = 1

let player1 = 0

const players = [new Player(REAL_PLAYER), new Player(AI_PLAYER)]

function initGame() {
    renderGrids()
    generateShips(players[(player1+1) % 2])
    const randomize_button = document.getElementById("generate")
    randomize_button.addEventListener("click", event => {
        cleanBoard(players[player1])
        generateShips(players[player1])

        updateBoard(players[ player1 ])
        updateGuessBoard(players[ player1 + 1 % 2])

    })
    const play_button = document.getElementById("play")
    play_button.addEventListener("click", event => {
        //todo: turn guessboard not opaque
        randomize_button.disabled = true
        nextTurn()
    })
}

function nextTurn() {
    if (players[player1].player_type === AI_PLAYER) {
        removeInteractivity()
        aiTurn()
    } else {
        playerTurn()
    }
}

function aiTurn() {
    const player2 = (player1 + 1) % 2
    let row, col;
    [row, col] = aiAttack(players[player2])
    players[player2].gameboard.receiveAttack(row, col)
    updateBoard(players[player2])
    if (!players[player2].gameboard.checkShipsLeft()) {
        endGame(player1)
        removeInteractivity()
    } else {
        player1 = player2
        nextTurn()
    }
}

function playerTurn() {
    const guess_board_element = document.getElementById("guess-board")
    const guess_cells = guess_board_element.querySelectorAll(".cell:not([class*=' '])");
    guess_cells.forEach(cell => {
        cell.addEventListener("click", cell_interactivity)
    })
}

function cell_interactivity(event) {
    const player2 = (player1 + 1) % 2
    players[player2].gameboard.receiveAttack(
        parseInt(event.currentTarget.dataset.row),
        parseInt(event.currentTarget.dataset.col)
    )

    updateGuessBoard(players[player2])

    if (!players[player2].gameboard.checkShipsLeft()) {
        endGame(player1)
        removeInteractivity()
    } else {
        player1 = player2
        nextTurn()
    }
}

function removeInteractivity() {
    const guess_board_element = document.getElementById("guess-board")
    const guess_cells = guess_board_element.querySelectorAll(".cell")
    guess_cells.forEach(cell => {
        cell.removeEventListener("click", cell_interactivity)
    })
}

initGame()


