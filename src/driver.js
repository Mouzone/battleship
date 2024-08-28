import {Player} from "./player";
import {updateBoard, updateGuessBoard, renderGrids, endGame, aiAttack, generateShips, cleanBoard, fillShipsElement, manualSetBoard} from "./driver.helper";
import "./style.css"

const AI_PLAYER = 0
const REAL_PLAYER = 1

let player1 = 0

const players = [new Player(REAL_PLAYER), new Player(AI_PLAYER)]

function initGame() {
    renderGrids()
    generateShips(players[(player1+1) % 2])
    const ships_element = document.getElementById("ships")

    const randomize_button = document.getElementById("generate")
    randomize_button.addEventListener("click", event => {
        ships_element.style.display = "none";
        cleanBoard(players[player1])
        generateShips(players[player1])

        updateBoard(players[ player1 ])
        updateGuessBoard(players[ player1 + 1 % 2])
        play_button.disabled = false
    })

    const manual_gen_button = document.getElementById("manual-generate")

    manual_gen_button.addEventListener("click", event => {
        fillShipsElement()
        cleanBoard(players[player1])
        let dragged = null
        ships_element.style.display = "flex";
        const cells = document.querySelectorAll("#board .cell")
        cells.forEach(cell => {
            cell.addEventListener("dragover", event => {
                // prevent default to allow drop
                event.preventDefault();
            })
            cell.addEventListener("click", event => {
                if (cell.classList.contains("occupied")) {
                    event.preventDefault()
                }
            })
            cell.addEventListener("drop", event => {
                if (!cell.classList.contains("occupied")) {
                    const ship_length = parseInt(dragged.dataset.length)
                    const curr_row = parseInt(cell.dataset.row)
                    const curr_col = parseInt(cell.dataset.col)
                    const positions =[]
                    if (dragged.classList.contains("horizontal")){
                        if (curr_col + ship_length <= 10) {
                            for (let col = curr_col; col < curr_col + ship_length; col++) {
                                positions.push([curr_row, col])
                                const cell_to_color = document.querySelector(`div[data-row="${curr_row}"][data-col="${col}"]`)
                                cell_to_color.classList.add("occupied")
                            }
                            ships_element.removeChild(dragged)
                            manualSetBoard(players[player1], ship_length, positions)
                        }
                    } else if (dragged.classList.contains("vertical")) {
                        if (curr_row + ship_length <= 10) {
                            for (let row = curr_row; row < curr_row + ship_length; row++) {
                                positions.push([row, curr_col])
                                const cell_to_color = document.querySelector(`div[data-row="${row}"][data-col="${curr_col}"]`)
                                cell_to_color.classList.add("occupied")
                            }
                            ships_element.removeChild(dragged)
                            manualSetBoard(players[player1], ship_length, positions)
                        }
                    }

                    positions.length = 0
                    if (!ships_element.children.length) {
                        play_button.disabled = false
                    }
                }
            })
        })

        const ships_elements = document.querySelectorAll(".ship")
        ships_elements.forEach(ship_element => {
            ship_element.addEventListener("drag", event => {
                dragged = ship_element
            })
        })
    })

    const play_button = document.getElementById("play")
    play_button.addEventListener("click", event => {
        const guess_board = document.getElementById("guess-board")
        guess_board.style.opacity = "1"
        randomize_button.disabled = true
        manual_gen_button.disabled = true
        play_button.disabled = true
        ships_element.style.display = "none";
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


