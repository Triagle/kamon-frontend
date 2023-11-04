import { KamonController } from "./controller";
import { KamonGame } from "./game";
import { KamonView } from "./kamonview";
import { randomTileDistrubition } from "./tiles";

let canvas = document.getElementById('kamoncanvas') as HTMLCanvasElement;
let view = new KamonView(canvas);
let model = new KamonGame();
let controller = new KamonController(view, model);
controller.initialiseGame(randomTileDistrubition());
