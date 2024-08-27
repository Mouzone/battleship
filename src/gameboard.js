export class Gameboard {
    // no rotation for now
    constructor() {
        this.board = Array.from({ length: 10 }, () =>
                        Array(10)
                            .fill(null))
        // store hit and ships on board
        // store misses in this.miss array
        this.miss = []
        this.ships = 10
    }

    placeShip(ship, x, y) {
        this.board[x][y] = ship
    }

    receiveAttack(x, y) {
        if (this.board[x][y]) {
            this.board[x][y].hit()
            if (this.board[x][y].isSunk()) {
                this.ships--
            }
            this.board[x][y] = HIT
            return true
        } else {
            this.board[x][y] = MISS
            return false
        }
    }

    checkShipsLeft() {
        return this.ships
    }
}

const HIT = 1
const MISS = 0