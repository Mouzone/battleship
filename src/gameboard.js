export class Gameboard {
    // no rotation for now
    constructor() {
        this.board = Array.from({ length: 10 }, () =>
                        Array(10)
                            .fill(null))
        this.missed = []
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
        } else {
            this.missed.push([x, y])
        }
    }
}