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