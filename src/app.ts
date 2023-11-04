import { KamonController } from "./controller";
import { KamonGame } from "./game";
import { KamonView } from "./kamonview";
import { randomTileDistrubition } from "./tiles";
import { KamonWebSocketService } from "./websocketservice";
let room = document.getElementById('room') as HTMLInputElement;
let host = document.getElementById('host');
let join = document.getElementById('join');
var ishosting = false;

function setupGame(room: string, host: boolean) {
  let canvas = document.getElementById('kamoncanvas') as HTMLCanvasElement;
  let service = new KamonWebSocketService(room, host);
  let view = new KamonView(canvas);
  let model = new KamonGame();
  let controller = new KamonController(view, model, service);
  if (host) {
    controller.initialiseGame(randomTileDistrubition());
  }
}

host.addEventListener("click", () => {
  setupGame(room.value, true);
});

join.addEventListener("click", () => {
  setupGame(room.value, false);
})
