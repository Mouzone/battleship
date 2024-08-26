import {Ship} from "../src/ship";
import {Gameboard} from "../src/gameboard";

const gameboard = new Gameboard()

test("if gameboard is properly instantiated", () => {
    expect(gameboard.board.length).toBe(10)
    expect(gameboard.board[0].length).toBe(10)
    expect(gameboard.missed.length).toBe(0)
    expect(gameboard.ships).toBe(10)
})

const ship = new Ship(5)

test("if ship is properly placed on gameboard", () => {
    for (let i = 0; i < 5; i++){
        gameboard.placeShip(ship, 0, i)
    }

    for (let i = 0; i < gameboard.board.length; i++){
        for (let j = 0; j < gameboard.board[0].length; j++){
            if (i === 0 && j < 5) {
                expect(gameboard.board[i][j]).toBe(ship)
            } else {
                expect(gameboard.board[i][j]).toBeNull()
            }
        }
    }
})

test("if hit is properly received", () => {
    let hits = 0
    coordinates.forEach(([x, y]) => {
        gameboard.receiveAttack(x, y)
        expect(ship.hits).toBe(hits)
        hits++
    })
})

test("if sink is properly received", () => {
    coordinates.forEach(([x, y]) => {
        expect(gameboard.board[x][y].isSunk()).toBe(true)
    })
})