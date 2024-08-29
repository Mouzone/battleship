import {Player} from "./player";
import {updateBoard, renderGrids, endGame, aiAttack, generateShips, fillShipsElement, populateBoardPlacer} from "./driver.helper";
import "./style.css"

const AI_PLAYER = 0
const REAL_PLAYER = 1

let player1 = 0

const players = [new Player(REAL_PLAYER), new Player(AI_PLAYER)]
const ships_element = document.getElementById("ships")
const randomize_button = document.getElementById("generate")
const manual_gen_button = document.getElementById("manual-generate")
const play_button = document.getElementById("play")
let dragged = null

function selectGameMode() {
    const start_game = document.getElementById("modal")
    const vs_ai_button = document.getElementById("vs-ai")
    const vs_player_button = document.getElementById("vs-player")
    vs_ai_button.addEventListener("click", event => {
        players.push(new Player(AI_PLAYER))
        start_game.style.display = "none"
    })
    vs_player_button.addEventListener("click", event => {
        players.push(new Player(REAL_PLAYER))
        start_game.style.display = "none"
    })
}

function makeButtonsInteractive() {
    randomize_button.addEventListener("click", makeRandButtonInteractive)
    manual_gen_button.addEventListener("click", makeManGenButtonInteractive)
    play_button.addEventListener("click", makePlayButtonInteractive)
}

function makeRandButtonInteractive(event) {
    ships_element.style.display = "none";
    cleanBoard(players[player1])
    generateShips(players[player1])

    updateBoard(players[ player1 ], BOARD)
    updateBoard(players[ player1 + 1 % 2], GUESS_BOARD)
    play_button.disabled = false
}

function makeManGenButtonInteractive(event){
    fillShipsElement()
    cleanBoard(players[player1])
    const cells = document.querySelectorAll("#board .cell")
    cells.forEach(cell => {
        cell.addEventListener("dragover", allowDrop)
        cell.addEventListener("drop", dropLogic)
    })
    const ships_elements = document.querySelectorAll(".ship")
    ships_elements.forEach(ship_element => {
        ship_element.addEventListener("drag", dragLogic)
    })
}

function makePlayButtonInteractive(event) {
    const guess_board = document.getElementById("guess-board")
    randomize_button.disabled = true
    manual_gen_button.disabled = true
    play_button.disabled = true

    guess_board.style.opacity = "1"
    ships_element.style.display = "none"

    nextTurn()
}

function allowDrop(event) {
    // prevent default to allow drop
    event.preventDefault();
}

function dropLogic(event){
    const cell = event.currentTarget
    if (cell.classList.contains("occupied")) {
        return
    }

    const ship_length = parseInt(dragged.dataset.length)
    const curr_row = parseInt(cell.dataset.row)
    const curr_col = parseInt(cell.dataset.col)
    const positions = []

    const isHorizontal = dragged.classList.contains("horizontal");
    const maxLimit = isHorizontal ? curr_col + ship_length : curr_row + ship_length;

    // Check if the ship can be placed within the grid
    if (maxLimit <= 10) {
        for (let i = 0; i < ship_length; i++) {
            const row = isHorizontal ? curr_row : curr_row + i
            const col = isHorizontal ? curr_col + i : curr_col

            positions.push([row, col])

            const cell_to_color = document.querySelector(`div[data-row="${row}"][data-col="${col}"]`)
            cell_to_color.classList.add("occupied")
        }

        ships_element.removeChild(dragged);
        populateBoardPlacer(ship_length, positions, players[player1].gameboard.board)
    }


    if (!ships_element.children.length) {
        play_button.disabled = false
    }
}

function dragLogic(event) {
    dragged = event.currentTarget
}

function initGame() {
    renderGrids()
    // selectGameMode()

    generateShips(players[(player1+1) % 2])
    makeButtonsInteractive()
}

function nextTurn() {
    if (players[player1].player_type === AI_PLAYER) {
        removeInteractivity()
        aiTurn()
    } else {
        playerTurn()
    }
}

const ai_attack_queue = []
const seen = new Set()
const directions = [ [1, 0], [0, 1], [-1, 0], [0, -1] ]
function aiTurn() {
    const player2 = (player1 + 1) % 2

    let row, col
    if (ai_attack_queue.length) {
        [row, col] = ai_attack_queue.pop()
    } else {
        [row, col] = aiAttack(players[ player2 ])
        seen.add(`${row},${col}`)
    }

    if (players[player2].gameboard.receiveAttack(row, col)) {
        directions.forEach(([dx, dy]) => {
            if ( ( row + dx ) >= 0 && ( row + dx ) < 10 && ( col + dy ) >= 0 && ( col + dy ) < 10 ) {
                const coords = `${ row + dx },${ col + dy }`
                if (( players[ player2 ].gameboard.board[ row + dx ][ col + dy ] !== HIT ) &&
                    !( players[ player2 ].gameboard.miss.has( coords ) ) &&
                    !( seen.has( coords ) )) {
                    ai_attack_queue.push([ row + dx, col + dy ])
                    seen.add( coords )
                }
            }
        })
    }

    updateBoard(players[player2], BOARD)
    endTurn()
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

    updateBoard(players[player2], GUESS_BOARD)
    endTurn()
}

function removeInteractivity() {
    const guess_board_element = document.getElementById("guess-board")
    const guess_cells = guess_board_element.querySelectorAll(".cell")
    guess_cells.forEach(cell => {
        cell.removeEventListener("click", cell_interactivity)
    })
}

function endTurn() {
    const player2 = ( player1 + 1 ) % 2
    if (!players[player2].gameboard.checkShipsLeft()) {
        endGame(player1)
        removeInteractivity()
    } else {
        player1 = player2
        nextTurn()
    }
}

function cleanBoard(player) {
    const cells = document.querySelectorAll("#board .cell")
    cells.forEach(cell => {
        cell.classList.remove("occupied")
        cell.removeEventListener("dragover", allowDrop)
        cell.removeEventListener("drop", dropLogic)
    })

    const ships_elements = document.querySelectorAll(".ship")
    ships_elements.forEach(ship_element => {
        ship_element.removeEventListener("drag", dragLogic)
    })

    player.gameboard.board.forEach(list => list.fill(null))
}

const BOARD = 1
const GUESS_BOARD = 0
const HIT = 1
initGame()


