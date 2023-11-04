import { Point } from 'honeycomb-grid';
import { KamonGame } from "./game";
import { KamonView} from "./kamonview";
import { Selection } from "./tiles";

export class KamonController {
    view: KamonView;
    model: KamonGame;
    player: Selection;

    constructor(view: KamonView, model: KamonGame) {
        this.view = view;
        this.model = model;
        this.player = Selection.PLAYER1;
        this.view.canvasClickCallback = (pt) => { this.handleCanvasClickEvent(pt); };
        this.model.gridUpdateHandler = (grid, coords) => { this.view.redraw(grid, coords) };
    }

    initialiseGame(grid: Grid<Kamon>) {
        this.model.grid = grid;
    }

    private handleCanvasClickEvent(pt: Point) {
        var hex = this.model.grid.pointToHex(pt, {allowOutside: false});
        if (hex === undefined || !this.model.canPlaceSelection(hex)) {
            return;
        }
        this.model.placeSelection(this.player, hex);
        if (this.model.currentPlayerWins(this.model.otherPlayer(this.player))) {
            this.view.handleWinEvent(this.player);
        }

        // Only for local testing
        // TODO: replace with logic to send game state to other clients
        this.player = this.model.otherPlayer(this.player);
    }

}
