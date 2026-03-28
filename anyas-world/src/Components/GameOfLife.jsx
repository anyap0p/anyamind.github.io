import React, { useEffect, useRef } from 'react';
import './GameOfLife.css';

/** Grid square size in CSS pixels; larger = fewer columns/rows. */
const CELL_SIZE = 40;
/** Time between Conway steps (one generation). */
const GENERATION_MS = 200;

const BOARD_COLOR = 'rgb(0, 0, 0)';

function randomNeonColor() {
    const h = Math.random() * 360;
    const s = 95 + Math.random() * 5;
    const l = 52 + Math.random() * 14;
    return `hsl(${h.toFixed(1)}, ${s.toFixed(0)}%, ${l.toFixed(0)}%)`;
}

const GLYPH_BLOCKS = [
    [0x205A, 0x206F],
    [0x2190, 0x21ff], // Arrow symbols
    [0x2300, 0x2426], // Geometric shapes
    [0x2580, 0x2767], // Miscellaneous symbols
    [0x2b00, 0x2b73],
    [0x2c00, 0x2c5e], // Dingbats
    [0x1f000, 0x1f02b],
    [0x1f300, 0x1f6ec],
    [0x1f90c, 0x1f9ff],
    [0x1fa70, 0x1fa89],
    [0x13000, 0x13438], // Egyptian hieroglyphs (before U+13439)
    [0x14400, 0x14646],
];

const GLYPH_CODES = [];
for (const [from, to] of GLYPH_BLOCKS) {
    if (from > to) continue;
    for (let c = from; c <= to; c++) GLYPH_CODES.push(c);
}
const GLYPH_COUNT = GLYPH_CODES.length;

function charForBirthStep(birthStep, glyphStartIndex) {
    if (GLYPH_COUNT === 0) return '?';
    const off = ((birthStep % GLYPH_COUNT) + GLYPH_COUNT) % GLYPH_COUNT;
    let idx = (glyphStartIndex + off) % GLYPH_COUNT;
    if (idx < 0) idx += GLYPH_COUNT;
    return String.fromCodePoint(GLYPH_CODES[idx]);
}

class Board {
    #cellSize = CELL_SIZE;
    #backgroundColor = BOARD_COLOR;

    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
    }

    drawBackground() {
        const { width, height } = this.canvas;
        this.ctx.fillStyle = this.#backgroundColor;
        this.ctx.fillRect(0, 0, width, height);
    }

    get size() {
        const { width, height } = this.canvas;
        return {
            cellNumberX: Math.ceil(width / this.#cellSize),
            cellNumberY: Math.ceil(height / this.#cellSize),
            cellSize: this.#cellSize,
        };
    }

    get context() {
        return this.ctx;
    }
}

class Cell {
    #alive = true;
    #neighbors = 0;
    /** Simulation step when this cell became alive (seed = 0). */
    #birthStep = 0;

    constructor(ctx, x, y, cellSize) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.cellSize = cellSize;
    }

    nextGeneration() {
        if (!this.#alive && this.#neighbors === 3) {
            this.#alive = true;
        } else {
            this.#alive =
                this.#alive && (this.#neighbors === 2 || this.#neighbors === 3);
        }
    }

    draw(fgColor, glyphStartIndex) {
        if (!this.#alive) return;
        const glyph = charForBirthStep(this.#birthStep, glyphStartIndex);
        const s = this.cellSize;
        const cx = this.x * s + s / 2;
        const cy = this.y * s + s / 2;
        const fontPx = Math.max(8, Math.floor(s * 0.85));
        this.ctx.fillStyle = fgColor;
        this.ctx.font = `${fontPx}px "Segoe UI Symbol", "Apple Symbols", "Noto Sans Symbols", sans-serif`;
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillText(glyph, cx, cy);
    }

    set alive(alive) {
        this.#alive = alive;
    }

    get alive() {
        return this.#alive;
    }

    set birthStep(step) {
        this.#birthStep = step;
    }

    get birthStep() {
        return this.#birthStep;
    }

    set neighbors(neighbors) {
        this.#neighbors = neighbors;
    }
}

class Game {
    #cells = [];
    #intervalId = null;
    #running = false;
    /** Number of interval ticks completed after the initial seed. */
    #generation = 0;
    /** One random neon color per birth-step index. */
    #neonByBirthStep = new Map();
    /** Random starting index into `GLYPH_CODES` (cycles through all blocks in order). */
    #glyphStartIndex;

    constructor(canvas) {
        this.canvas = canvas;
        this.board = new Board(this.canvas);
        this.#glyphStartIndex =
            GLYPH_COUNT > 0
                ? Math.floor(Math.random() * GLYPH_COUNT)
                : 0;
    }

    #neonForBirthStep(step) {
        if (!this.#neonByBirthStep.has(step)) {
            this.#neonByBirthStep.set(step, randomNeonColor());
        }
        return this.#neonByBirthStep.get(step);
    }

    initialize = () => {
        this.#running = true;
        this.initializeCells();
        this.#intervalId = window.setInterval(() => {
            if (!this.#running) return;
            this.board.drawBackground();
            this.updateCells();
        }, GENERATION_MS);
    };

    stop = () => {
        this.#running = false;
        if (this.#intervalId != null) {
            window.clearInterval(this.#intervalId);
            this.#intervalId = null;
        }
    };

    initializeCells = () => {
        this.#generation = 0;
        const { cellNumberX, cellNumberY, cellSize } = this.board.size;
        for (let i = 0; i < cellNumberX; i++) {
            this.#cells[i] = [];
            for (let j = 0; j < cellNumberY; j++) {
                const cell = new Cell(this.board.context, i, j, cellSize);
                cell.alive = Math.random() > 0.8;
                if (cell.alive) cell.birthStep = 0;
                cell.draw(this.#neonForBirthStep(cell.birthStep), this.#glyphStartIndex);
                this.#cells[i][j] = cell;
            }
        }
    };

    updateCells = () => {
        const { cellNumberX, cellNumberY } = this.board.size;
        for (let i = 0; i < cellNumberX; i++) {
            for (let j = 0; j < cellNumberY; j++) {
                this.updateCellNeighbors(i, j);
            }
        }
        const birthStepForNewborns = this.#generation + 1;
        for (let i = 0; i < cellNumberX; i++) {
            for (let j = 0; j < cellNumberY; j++) {
                const cell = this.#cells[i][j];
                const wasAlive = cell.alive;
                cell.nextGeneration();
                if (cell.alive && !wasAlive) {
                    cell.birthStep = birthStepForNewborns;
                }
                cell.draw(this.#neonForBirthStep(cell.birthStep), this.#glyphStartIndex);
            }
        }
        this.#generation += 1;
    };

    updateCellNeighbors = (x, y) => {
        const neighborCoords = [
            [x, y + 1],
            [x, y - 1],
            [x + 1, y],
            [x - 1, y],
            [x + 1, y + 1],
            [x - 1, y - 1],
            [x + 1, y - 1],
            [x - 1, y + 1],
        ];
        let aliveNeighborsCount = 0;
        const { cellNumberX, cellNumberY } = this.board.size;
        for (const coords of neighborCoords) {
            const [xCord, yCord] = coords;
            const xOutOfBounds = xCord < 0 || xCord >= cellNumberX;
            const yOutOfBounds = yCord < 0 || yCord >= cellNumberY;
            const wrappedX = xOutOfBounds
                ? (xCord + cellNumberX) % cellNumberX
                : xCord;
            const wrappedY = yOutOfBounds
                ? (yCord + cellNumberY) % cellNumberY
                : yCord;
            if (this.#cells[wrappedX]?.[wrappedY]?.alive) {
                aliveNeighborsCount++;
            }
        }
        this.#cells[x][y].neighbors = aliveNeighborsCount;
    };
}

function GameOfLife() {
    const wrapRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const wrap = wrapRef.current;
        if (!canvas || !wrap) return undefined;

        let game = null;

        const start = () => {
            if (game) game.stop();
            const w = wrap.clientWidth;
            const h = wrap.clientHeight;
            if (w < 1 || h < 1) return;
            canvas.width = w;
            canvas.height = h;
            game = new Game(canvas);
            game.initialize();
        };

        start();
        const ro = new ResizeObserver(start);
        ro.observe(wrap);

        return () => {
            ro.disconnect();
            if (game) game.stop();
        };
    }, []);

    return (
        <div ref={wrapRef} className="game-of-life">
            <canvas
                ref={canvasRef}
                className="game-of-life__canvas"
                id="game-board"
            />
        </div>
    );
}

export default GameOfLife;
