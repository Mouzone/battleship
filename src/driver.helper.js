import {Ship} from "./ship";

export function cleanBoard(player) {
    const occupied_cells = document.querySelectorAll(".occupied")
    occupied_cells.forEach(cell => {
        cell.classList.remove("occupied")
    })
    player.gameboard.board.forEach(list => list.fill(null))
}

export function generateShips(player) {
    ships_to_generate.forEach(([num_ships, length]) => {
        for (let i = 0; i < num_ships; i++) {
            let direction = Math.floor(Math.random() * 2)
            let row = Math.floor(Math.random() * 10)
            let col = Math.floor(Math.random() * 10)
            let positions = checkValid(player.gameboard.board, direction, row, col, length)
            while (positions.length === 0) {
                direction = Math.floor(Math.random() * 2)
                row = Math.floor(Math.random() * 10)
                col = Math.floor(Math.random() * 10)
                positions = checkValid(player.gameboard.board, direction, row, col, length)
            }

            populateBoardPlacer(length, positions, player.gameboard.board)

        }
    })
}

const HORIZONTAL = 0
function checkValid(board, direction, row, col, length) {
    const positions = []
    let curr_length = length
    while (row < 10 && col < 10 && curr_length > 0) {
        if (board[row][col] instanceof Ship) {
            break
        }
        positions.push([row, col])
        curr_length--
        if (direction === HORIZONTAL) {
            col++
        } else {
            row++
        }
    }

    if (positions.length !== length) {
        return []
    } else {
        return positions
    }
}


function populateBoardPlacer(length, positions, board){
    const ship = new Ship(length)
    positions.forEach(([x, y]) => {
        board[x][y] = ship
    })
}

export function renderGrids() {
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            const cell = document.createElement("div")
            cell.classList.add("cell")
            cell.dataset.row = `${i}`
            cell.dataset.col = `${j}`

            board_element.appendChild(cell)
            guess_board_element.appendChild(cell.cloneNode())
        }
    }
}


export function updateBoard(player) {
    const board = player.gameboard.board
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            const cell = board_element.querySelector(`div[data-row="${i}"][data-col="${j}"]`)
            if (board[i][j] instanceof Ship) {
                cell.classList.add("occupied")
            } else if (board[i][j] === 1) {
                cell.classList.add("hit")
            }
        }
    }
    Object.entries(player.gameboard.miss).forEach(([x, set]) => {
        set.forEach(y => {
            const cell = board_element.querySelector(`div[data-row="${x}"][data-col="${y}"]`)
            cell.classList.add("miss")
        })
    })
}

export function updateGuessBoard(player) {
    const board = player.gameboard.board
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            const cell = guess_board_element.querySelector(`div[data-row="${i}"][data-col="${j}"]`)
            if (board[i][j] === 1) {
                cell.classList.add("hit")
            }
        }
    }

    Object.entries(player.gameboard.miss).forEach(([x, set]) => {
        set.forEach(y => {
            const cell = guess_board_element.querySelector(`div[data-row="${x}"][data-col="${y}"]`)
            cell.classList.add("miss")
        })
    })
}

export function endGame(player_number) {
    const end_game = document.getElementById("game-over")
    end_game.style.display = "block"
    if (player_number === 0) {
        end_game.textContent = "Player 1 has won!"
    } else {
        end_game.textContent = "Player 2 has won!"
    }
}

export function aiAttack(player) {
    let row = Math.floor(Math.random() * 10)
    let col = Math.floor(Math.random() * 10)
    while (player.gameboard.board[row][col] === HIT ||
    (row in player.gameboard.miss && player.gameboard.miss[row].has(col))) {

        row = Math.floor(Math.random() * 10)
        col = Math.floor(Math.random() * 10)
    }
    return [row, col]
}

export function fillShipsElement() {
    const conversion = {
        1: "one",
        2: "two",
        3: "three",
        4: "four"
    }
    const ships_element = document.getElementById("ships")
    ships_element.innerHTML = ""
    ships_to_generate.forEach(([num_ships, length]) => {
        for (let i = 0; i < num_ships; i++) {
            const ship_element = document.createElement("div")
            //todo: add logic here, when inside the "dock" and clicked it will flip into vertical and replace the class "horizontal
            // -- hardcode heights and widths to .one.horizontal and .one.vertical
            ship_element.classList.add(`${conversion[length]}`)
            ship_element.classList.add("horizontal")
            ship_element.classList.add("ship")
            ship_element.dataset.length = `${length}`

            ship_element.draggable = true
            ships_element.appendChild(ship_element)
        }
    })
}
const ships_to_generate = [[4, 1], [3, 2], [2, 3], [1, 4]]
const board_element = document.getElementById("board")
const guess_board_element = document.getElementById("guess-board")

const HIT = 1
const MISS = 0