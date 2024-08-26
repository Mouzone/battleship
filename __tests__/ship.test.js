import {Ship} from "../src/ship"

const ship = new Ship(5)

test("Create ship object", () => {
    expect(ship.length).toBe(5)
    expect(ship.hits).toBe(0)
})

test("Hit function for ship function", () => {
    ship.hit()
    expect(ship.hits).toBe(1)
})

test("Sunk function for ship", () => {
    // only 1 hit with a length of 5 so should be false
    expect(ship.isSunk()).toBe(false)
    for (let i = 0; i < 4; i++) {
        ship.hit()
    }
    expect(ship.isSunk()).toBe(true)
})