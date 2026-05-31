const button = document.getElementById("generateBtn");
const canvas = document.getElementById("mapCanvas");
const ctx = canvas.getContext("2d");

const TerrainType = Object.freeze({
    NotSet: 0,
    Land: 1,
    Water: 2,
    Factory: 3,
    Port: 4,
    Airport: 5,
    HeadquartersBlue: 6,
    HeadquartersGreen: 7,
    HeadquartersOrange: 8,
    HeadquartersPurple: 9
});

class Point {
    constructor(x = -1, y = -1, terrain = TerrainType.NotSet) {
        this.X = x;
        this.Y = y;
        this.Terrain = terrain;
    }
}

const GAME_BOARD_WIDTH = 16;
const GAME_BOARD_HEIGHT = 16;
const MAX_NUM_OF_FACTORIES = 5;
const MAX_NUM_OF_PORTS = 5;
const MAX_NUM_OF_AIRPORTS = 5;
const MAX_NUM_OF_WATER = 97;
const MAX_NUM_OF_GROUP_WATER_SHARDS_FUNCTION_CALLS = 20000;
const MAX_NUM_OF_HQ_BLUE = 1;
const MAX_NUM_OF_HQ_GREEN = 1;
const MAX_NUM_OF_HQ_ORANGE = 1;
const MAX_NUM_OF_HQ_PURPLE = 1;

let GameBoard = [];
let ListOfAvailableSpaces = [];
let ListOfGameBoardPoints = [];
let ListOfGameBoardPoints_CurrentIndex = 0;

const CELL_SIZE = 32;
const BOARD_OFFSET_X = 10;
const BOARD_OFFSET_Y = 10;

button.addEventListener("click", generateMap);
window.addEventListener("load", generateMap);

function generateMap() {
    initializeBoard();
    generateBoard();
    drawBoard();
}

function generateBoard() {
    setHeadquarterOnGameBoard(TerrainType.HeadquartersBlue);
    setHeadquarterOnGameBoard(TerrainType.HeadquartersGreen);
    setHeadquarterOnGameBoard(TerrainType.HeadquartersOrange);
    setHeadquarterOnGameBoard(TerrainType.HeadquartersPurple);

    placeWaterShardsOnGameBoard();
    groupWaterShards();
    placePortsNextToWaterOnGameBoard();
    placeFactoriesOnGameBoard();
    placeAirportsOnGameBoard();
    fillEmptySpacesWithLandOnGameBoard();
}

function initializeBoard() {
    GameBoard = new Array(GAME_BOARD_WIDTH);
    ListOfAvailableSpaces = [];
    ListOfGameBoardPoints = [];
    ListOfGameBoardPoints_CurrentIndex = 0;

    for (let x = 0; x < GAME_BOARD_WIDTH; x++) {
        GameBoard[x] = new Array(GAME_BOARD_HEIGHT);
        for (let y = 0; y < GAME_BOARD_HEIGHT; y++) {
            GameBoard[x][y] = TerrainType.NotSet;
            ListOfAvailableSpaces.push(new Point(x, y, TerrainType.NotSet));
        }
    }
}

function drawBoard() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let x = 0; x < GAME_BOARD_WIDTH; x++) {
        for (let y = 0; y < GAME_BOARD_HEIGHT; y++) {
            const terrain = GameBoard[x][y];
            ctx.fillStyle = getTerrainColor(terrain);
            ctx.fillRect(
                BOARD_OFFSET_X + x * CELL_SIZE,
                BOARD_OFFSET_Y + y * CELL_SIZE,
                CELL_SIZE - 1,
                CELL_SIZE - 1
            );
        }
    }

    ctx.strokeStyle = "#444";
    for (let x = 0; x <= GAME_BOARD_WIDTH; x++) {
        ctx.beginPath();
        ctx.moveTo(BOARD_OFFSET_X + x * CELL_SIZE, BOARD_OFFSET_Y);
        ctx.lineTo(BOARD_OFFSET_X + x * CELL_SIZE, BOARD_OFFSET_Y + GAME_BOARD_HEIGHT * CELL_SIZE);
        ctx.stroke();
    }
    for (let y = 0; y <= GAME_BOARD_HEIGHT; y++) {
        ctx.beginPath();
        ctx.moveTo(BOARD_OFFSET_X, BOARD_OFFSET_Y + y * CELL_SIZE);
        ctx.lineTo(BOARD_OFFSET_X + GAME_BOARD_WIDTH * CELL_SIZE, BOARD_OFFSET_Y + y * CELL_SIZE);
        ctx.stroke();
    }
}

function getTerrainColor(terrain) {
    switch (terrain) {
        case TerrainType.Land:
            return "#c2b280";
        case TerrainType.Water:
            return "#39c5bb";
        case TerrainType.Factory:
            return "#888888";
        case TerrainType.Port:
            return "#d96c06";
        case TerrainType.Airport:
            return "#ffffff";
        case TerrainType.HeadquartersBlue:
            return "#2a6df0";
        case TerrainType.HeadquartersGreen:
            return "#2ecc71";
        case TerrainType.HeadquartersOrange:
            return "#e67e22";
        case TerrainType.HeadquartersPurple:
            return "#9b59b6";
        default:
            return "#7f7f7f";
    }
}

function setHeadquarterOnGameBoard(hq) {
    const count = ListOfAvailableSpaces.length;

    for (let i = 0; i < count; i++) {
        const index = Math.floor(Math.random() * ListOfAvailableSpaces.length);
        const p = ListOfAvailableSpaces[index];
        if (validHQSpace(p.X, p.Y)) {
            GameBoard[p.X][p.Y] = hq;
            ListOfAvailableSpaces.splice(index, 1);
            break;
        }
    }
}

function placeWaterShardsOnGameBoard() {
    for (let i = 0; i < MAX_NUM_OF_WATER; i++) {
        setWaterOnGameBoard();
    }
}

function groupWaterShards() {
    const count = Math.floor(Math.random() * MAX_NUM_OF_GROUP_WATER_SHARDS_FUNCTION_CALLS) + 100;
    for (let i = 0; i < count; i++) {
        groupWaterShard();
    }
}

function groupWaterShard() {
    const x = Math.floor(Math.random() * GAME_BOARD_WIDTH);
    const y = Math.floor(Math.random() * GAME_BOARD_HEIGHT);

    if (!isWaterSpace(x, y)) {
        return;
    }

    const functionNumber = Math.floor(Math.random() * 8);
    switch (functionNumber) {
        case 0:
            groupWaterShard0(x, y);
            break;
        case 1:
            groupWaterShard1(x, y);
            break;
        case 2:
            groupWaterShard2(x, y);
            break;
        case 3:
            groupWaterShard3(x, y);
            break;
        case 4:
            groupWaterShard4(x, y);
            break;
        case 5:
            groupWaterShard5(x, y);
            break;
        case 6:
            groupWaterShard6(x, y);
            break;
        case 7:
            groupWaterShard7(x, y);
            break;
    }
}

function groupWaterShard0(x, y) {
    if (!validWaterSpace(x - 1, y + 1)) {
        return;
    }

    if (isWaterSpace(x - 2, y + 1) || isWaterSpace(x - 2, y + 2) || isWaterSpace(x - 1, y + 2)) {
        moveWaterShard(x, y, x - 1, y + 1);
    }
}

function groupWaterShard1(x, y) {
    if (!validWaterSpace(x, y + 1)) {
        return;
    }

    if (isWaterSpace(x - 1, y + 2) || isWaterSpace(x, y + 2) || isWaterSpace(x + 1, y + 2)) {
        moveWaterShard(x, y, x, y + 1);
    }
}

function groupWaterShard2(x, y) {
    if (!validWaterSpace(x + 1, y + 1)) {
        return;
    }

    if (isWaterSpace(x + 1, y + 2) || isWaterSpace(x + 2, y + 2) || isWaterSpace(x + 2, y + 1)) {
        moveWaterShard(x, y, x + 1, y + 1);
    }
}

function groupWaterShard3(x, y) {
    if (!validWaterSpace(x + 1, y)) {
        return;
    }

    if (isWaterSpace(x + 2, y + 1) || isWaterSpace(x + 2, y) || isWaterSpace(x + 2, y - 1)) {
        moveWaterShard(x, y, x + 1, y);
    }
}

function groupWaterShard4(x, y) {
    if (!validWaterSpace(x + 1, y - 1)) {
        return;
    }

    if (isWaterSpace(x + 2, y - 1) || isWaterSpace(x + 2, y - 2) || isWaterSpace(x + 1, y - 2)) {
        moveWaterShard(x, y, x + 1, y - 1);
    }
}

function groupWaterShard5(x, y) {
    if (!validWaterSpace(x, y - 1)) {
        return;
    }

    if (isWaterSpace(x + 1, y - 2) || isWaterSpace(x, y - 2) || isWaterSpace(x - 1, y - 2)) {
        moveWaterShard(x, y, x, y - 1);
    }
}

function groupWaterShard6(x, y) {
    if (!validWaterSpace(x - 1, y - 1)) {
        return;
    }

    if (isWaterSpace(x - 1, y - 2) || isWaterSpace(x - 2, y - 2) || isWaterSpace(x - 2, y - 1)) {
        moveWaterShard(x, y, x - 1, y - 1);
    }
}

function groupWaterShard7(x, y) {
    if (!validWaterSpace(x - 1, y)) {
        return;
    }

    if (isWaterSpace(x - 2, y - 1) || isWaterSpace(x - 2, y) || isWaterSpace(x - 2, y + 1)) {
        moveWaterShard(x, y, x - 1, y);
    }
}

function moveWaterShard(sourceX, sourceY, destinationX, destinationY) {
    GameBoard[sourceX][sourceY] = TerrainType.NotSet;
    GameBoard[destinationX][destinationY] = TerrainType.Water;
}

function setWaterOnGameBoard() {
    const count = ListOfAvailableSpaces.length;
    for (let i = 0; i < count; i++) {
        const index = Math.floor(Math.random() * ListOfAvailableSpaces.length);
        const p = ListOfAvailableSpaces[index];
        if (validWaterSpace(p.X, p.Y)) {
            GameBoard[p.X][p.Y] = TerrainType.Water;
            ListOfAvailableSpaces.splice(index, 1);
            break;
        }
    }
}

function placePortsNextToWaterOnGameBoard() {
    for (let i = 0; i < MAX_NUM_OF_PORTS; i++) {
        placePortOnGameBoard();
    }
}

function placePortOnGameBoard() {
    let placedPort = false;

    while (!placedPort) {
        const x = Math.floor(Math.random() * GAME_BOARD_WIDTH);
        const y = Math.floor(Math.random() * GAME_BOARD_HEIGHT);

        if (validPortSpace(x, y)) {
            GameBoard[x][y] = TerrainType.Port;
            placedPort = true;
        }
    }
}

function placeFactoriesOnGameBoard() {
    for (let i = 0; i < MAX_NUM_OF_FACTORIES; i++) {
        placeFactoryOnGameBoard();
    }
}

function placeFactoryOnGameBoard() {
    let placedFactory = false;

    while (!placedFactory) {
        const x = Math.floor(Math.random() * GAME_BOARD_WIDTH);
        const y = Math.floor(Math.random() * GAME_BOARD_HEIGHT);

        if (isEmptySpace(x, y)) {
            GameBoard[x][y] = TerrainType.Factory;
            placedFactory = true;
        }
    }
}

function placeAirportsOnGameBoard() {
    for (let i = 0; i < MAX_NUM_OF_AIRPORTS; i++) {
        placeAirportOnGameBoard();
    }
}

function placeAirportOnGameBoard() {
    let placedAirport = false;

    while (!placedAirport) {
        const x = Math.floor(Math.random() * GAME_BOARD_WIDTH);
        const y = Math.floor(Math.random() * GAME_BOARD_HEIGHT);

        if (isEmptySpace(x, y)) {
            GameBoard[x][y] = TerrainType.Airport;
            placedAirport = true;
        }
    }
}

function validPortSpace(x, y) {
    if (!isEmptySpace(x, y)) {
        return false;
    }

    if (isWaterSpace(x, y - 1)) return true;
    if (isWaterSpace(x + 1, y)) return true;
    if (isWaterSpace(x, y + 1)) return true;
    if (isWaterSpace(x - 1, y)) return true;

    return false;
}

function fillEmptySpacesWithLandOnGameBoard() {
    for (let x = 0; x < GAME_BOARD_WIDTH; x++) {
        for (let y = 0; y < GAME_BOARD_HEIGHT; y++) {
            if (GameBoard[x][y] === TerrainType.NotSet) {
                GameBoard[x][y] = TerrainType.Land;
            }
        }
    }
}

function validHQSpace(x, y) {
    if (x === 0 || y === 0 || x === GAME_BOARD_WIDTH - 1 || y === GAME_BOARD_HEIGHT - 1) {
        return false;
    }

    if (!isEmptySpace(x, y)) return false;

    for (let offsetX = -1; offsetX <= 1; offsetX++) {
        for (let offsetY = -1; offsetY <= 1; offsetY++) {
            if (offsetX === 0 && offsetY === 0) continue;
            if (!isEmptySpace(x + offsetX, y + offsetY)) {
                return false;
            }
        }
    }

    return true;
}

function validWaterSpace(x, y) {
    if (!isEmptySpace(x, y)) {
        return false;
    }

    const adjacent = [
        [-1, -1], [0, -1], [1, -1],
        [1, 0], [1, 1], [0, 1],
        [-1, 1], [-1, 0]
    ];

    for (const [dx, dy] of adjacent) {
        if (isHQSpace(x + dx, y + dy)) {
            return false;
        }
    }

    return true;
}

function isEmptySpace(x, y) {
    if (x < 0 || y < 0 || x >= GAME_BOARD_WIDTH || y >= GAME_BOARD_HEIGHT) {
        return false;
    }
    return GameBoard[x][y] === TerrainType.NotSet;
}

function isWaterSpace(x, y) {
    if (x < 0 || y < 0 || x >= GAME_BOARD_WIDTH || y >= GAME_BOARD_HEIGHT) {
        return false;
    }
    return GameBoard[x][y] === TerrainType.Water;
}

function isHQSpace(x, y) {
    if (x < 0 || y < 0 || x >= GAME_BOARD_WIDTH || y >= GAME_BOARD_HEIGHT) {
        return false;
    }

    const type = GameBoard[x][y];
    return type === TerrainType.HeadquartersBlue ||
        type === TerrainType.HeadquartersGreen ||
        type === TerrainType.HeadquartersOrange ||
        type === TerrainType.HeadquartersPurple;
}
