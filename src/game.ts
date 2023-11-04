import { Selection, Kamon, randomTileDistrubition } from './tiles';
import { Grid, Direction, AxialCoordinates } from 'honeycomb-grid';

const NW_BOUNDS: AxialCoordinates[] = [{ q: -3, r: 0 }, { q: -2, r: -1 }, { q: -1, r: -2 }, { q: 0, r: -3 }];
const NE_BOUNDS: AxialCoordinates[] = [{ q: 0, r: -3 }, { q: 1, r: -3 }, { q: 2, r: -3 }, { q: 3, r: -3 }];
const SW_BOUNDS: AxialCoordinates[] = [{ q: -3, r: 3 }, { q: -2, r: 3 }, { q: -1, r: 3 }, { q: 0, r: 3 }];
const SE_BOUNDS: AxialCoordinates[] = [{ q: 0, r: 3 }, { q: 1, r: 2 }, { q: 2, r: 1 }, { q: 3, r: 0 }];
const E_BOUNDS: AxialCoordinates[] = [{ q: -3, r: 0 }, { q: -3, r: 1 }, { q: -3, r: 2 }, { q: -3, r: 3 }];
const W_BOUNDS: AxialCoordinates[] = [{ q: 3, r: -3 }, { q: 3, r: -2 }, { q: 3, r: -1 }, { q: 3, r: 0 }];

export class KamonGame {
    lastCoords: AxialCoordinates;
    _grid: Grid<Kamon>;
    gridUpdateHandler: (grid: Grid<Kamon>, coords: AxialCoordinates) => void;

    constructor(grid: Grid<Kamon>) {
        this._grid = grid;
        this.lastCoords = null;
    }

    get curSelection() {
        if (this.lastCoords === null) {
            return Selection.PLAYER1;
        }
        return this.lastSelection.selected;
    }

    get lastSelection(): Kamon {
        if (this.lastCoords === null) {
            return null;
        }
        return this._grid.getHex(this.lastCoords);
    }

    set lastSelection(kamon: Kamon) {
        this.lastCoords = {q: kamon.q, r: kamon.r};
    }

    get grid() {
        return this._grid;
    }

    set grid(grid: Grid<Kamon>) {
        this._grid = grid;
        this.gridUpdateHandler(this._grid, this.lastCoords);
    }

    // place a kamon with the current selection (if possible) and advance the current selection
    // returns true if the game state updated
    placeSelection(player: Selection, kamon: Kamon) {
        kamon.selected = player;
        this.lastSelection = kamon;
        this.gridUpdateHandler(this._grid, this.lastCoords);
    }

    canPlaceSelection(kamon: Kamon) {
        if (this.lastSelection === null) {
            return true;
        }
        return kamon.selected == Selection.NONE && (this.lastSelection.colour == kamon.colour || this.lastSelection.symbol == kamon.symbol);
    }

    traverseReachable(start: Kamon[], allowedOccupations: Set<Selection>, termination?: ((k: Kamon) => boolean)) {
        var stack = start;
        var discovered = new Set<Kamon>([]);
        while (stack.length > 0) {
            let cur = stack.pop();
            if (!allowedOccupations.has(cur.selected)) {
                continue;
            }
            if (termination !== undefined && termination !== null && termination(cur)) {
                return;
            }
            discovered.add(cur);
            for (var direction = Direction.N; direction <= Direction.NW; direction++) {
                let neighbour: Kamon = this._grid.neighborOf(cur, direction, { allowOutside: false });
                if (neighbour !== undefined && !discovered.has(neighbour) && allowedOccupations.has(neighbour.selected)) {
                    stack.push(neighbour);
                }
            }
        }
    }

    otherPlayer(player: Selection): Selection {
        return player == Selection.PLAYER1 ? Selection.PLAYER2 : Selection.PLAYER1;
    }

    getBoundary(direction: Direction): Set<Kamon> {
        switch (direction) {
            case Direction.NE:
                return new Set(NE_BOUNDS.map(coord => this._grid.getHex(coord)));
            case Direction.NW:
                return new Set(NW_BOUNDS.map(coord => this._grid.getHex(coord)));
            case Direction.W:
                return new Set(W_BOUNDS.map(coord => this._grid.getHex(coord)));
            case Direction.E:
                return new Set(E_BOUNDS.map(coord => this._grid.getHex(coord)));
            case Direction.SW:
                return new Set(SW_BOUNDS.map(coord => this._grid.getHex(coord)));
            case Direction.SE:
                return new Set(SE_BOUNDS.map(coord => this._grid.getHex(coord)));
            default:
                return new Set([]);
        }
    }

    canReach(start: Kamon[], goal: Set<Kamon>, player: Selection): boolean {
        var found = false;
        this.traverseReachable(start, new Set([player]), (kamon) => {
            found = goal.has(kamon);
            return found;
        });
        return found;
    }

    playerWinsOnBoundaries(): boolean {
        let other = this.otherPlayer();
        return this.canReach(Array.from(this.getBoundary(Direction.NW)), this.getBoundary(Direction.SE), other)
            || this.canReach(Array.from(this.getBoundary(Direction.NE)), this.getBoundary(Direction.SW), other)
            || this.canReach(Array.from(this.getBoundary(Direction.E)), this.getBoundary(Direction.W), other);
    }

    playerWinsOnSurround(): boolean {
        const allowedOccupation = new Set([Selection.NONE,
                                           this.curSelection]);
        const boundary = new Set([...this.getBoundary(Direction.NW),
                                 ...this.getBoundary(Direction.NE),
                                 ...this.getBoundary(Direction.E),
                                 ...this.getBoundary(Direction.SE),
                                 ...this.getBoundary(Direction.SW),
                                 ...this.getBoundary(Direction.W)]);
        for (const kamon of this._grid) {
            var foundBoundary = false;
            if (!allowedOccupation.has(kamon.selected) || boundary.has(kamon)) {
                continue;
            }
            this.traverseReachable([kamon], allowedOccupation, (kamon) => {
                foundBoundary = boundary.has(kamon);
                let terminate = foundBoundary;
                return terminate;
            });
            if (!foundBoundary) {
                return true;
            }
        }
        return false;
    }

    currentPlayerWins(): boolean {
        return this.playerWinsOnSurround() || this.playerWinsOnBoundaries();

    }
}
