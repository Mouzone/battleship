import {Ship} from "./ship";

export function populateBoard(player) {
    // one hit ships
    const one_hit_ships = [new Ship(1), new Ship(1), new Ship(1), new Ship(1)]
    const two_hit_ships = [new Ship(2), new Ship(2), new Ship(2)]
    const three_hit_ships = [new Ship(3), new Ship(3)]
    const four_hit_ships = [new Ship(4)]

    const one_hit_pos = [[[1, 1]], [[0, 9]], [[7, 4]], [[5,8]]]
    const two_hit_pos = [[[3, 0], [4, 0]], [[3, 8], [3, 9]], [[7, 6], [7, 7]]]
    const three_hit_pos = [[[1, 5], [2, 5], [3, 5]], [[9, 6], [9, 7], [9, 8]]]
    const four_hit_pos = [[[3, 2], [4, 2], [5, 2], [6, 2]]]

    populateBoardPlacer(one_hit_ships, one_hit_pos, player.gameboard.board)
    populateBoardPlacer(two_hit_ships, two_hit_pos, player.gameboard.board)
    populateBoardPlacer(three_hit_ships, three_hit_pos, player.gameboard.board)
    populateBoardPlacer(four_hit_ships, four_hit_pos, player.gameboard.board)
}

function populateBoardPlacer(ships, positions, board){
    for (let i = 0; i < ships.length; i++) {
        positions[i].forEach(([x, y]) => {
            board[x][y] = ships[i]
        })
    }
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
            } else if (board[i][j] === 0) {
                cell.classList.add("miss")
            }
        }
    }
}

export function updateGuessBoard(player) {
    const board = player.gameboard.board
    for (let i = 0; i < 10; i++) {
        for (let j = 0; j < 10; j++) {
            const cell = guess_board_element.querySelector(`div[data-row="${i}"][data-col="${j}"]`)
            if (board[i][j] === 1) {
                cell.classList.add("hit")
            } else if (board[i][j] === 0) {
                cell.classList.add("miss")
            }
        }
    }
}

export function endGame() {

}

const board_element = document.getElementById("board")
const guess_board_element = document.getElementById("guess-board")