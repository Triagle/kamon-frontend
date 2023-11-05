import { AxialCoordinates, Grid, Point } from 'honeycomb-grid';
import { KamonGame } from "./game";
import { KamonView } from "./kamonview";
import { Selection, Kamon } from "./tiles";
import { KamonWebSocketService } from './websocketservice';

export class KamonController {
    view: KamonView;
    model: KamonGame;
    player: Selection;
    socketservice: KamonWebSocketService;

    constructor(view: KamonView, model: KamonGame, service: KamonWebSocketService) {
        this.view = view;
        this.model = model;
        this.player = service.host ? Selection.PLAYER1 : Selection.PLAYER2;
        this.socketservice = service;
        this.view.canvasClickCallback = (pt: Point) => { this.handleCanvasClickEvent(pt); };
        this.model.addGridUpdateHandler((grid, coords) => { this.view.redraw(grid, coords) });
        this.model.addGridUpdateHandler((grid, coords) => { this.testWinConditions(); })
        this.socketservice.stateUpdateCallback = (game: KamonGame) => {
            this.model.gridFromJson(game.lastCoords, game._grid);
        };
        this.socketservice.playerJoinsCallback = () => {
            this.socketservice.sendState(this.model);
        };
        this.setupPlayerHint();
    }

    setupPlayerHint() {
        let colourIndicator = document.getElementById('colour-indicator');
        let playerColour = document.getElementById('player-colour');
        playerColour.textContent = this.player === Selection.PLAYER1 ? 'White' : 'Black';
        playerColour.style.color = this.player === Selection.PLAYER1 ? '#ffffff' : '#000000';
        colourIndicator.style.display = 'block';
    }

    initialiseGame(grid: Grid<Kamon>) {
        this.model.grid = grid;
    }

    private handleCanvasClickEvent(pt: Point) {
        var hex = this.model.grid.pointToHex(pt, {allowOutside: false});
        if (hex === undefined || this.model.curSelection == this.player || !this.model.canPlaceSelection(hex)) {
            return;
        }
        this.model.placeSelection(this.player, hex);
        this.socketservice.sendState(this.model);
        if (this.model.currentPlayerWins(this.model.otherPlayer(this.player))) {
            this.view.handleWinEvent(this.player);
        }
    }

    private testWinConditions() {
        if (this.model.currentPlayerWins(this.player)) {
            this.view.handleWinEvent(true);
        } else if (this.model.currentPlayerWins(this.model.otherPlayer(this.player))) {
            this.view.handleWinEvent(false);
        }
    }

}
