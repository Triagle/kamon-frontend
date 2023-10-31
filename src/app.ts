import { defineHex, Grid, Hex, ring} from 'honeycomb-grid'
import { Kamon, TILES, Symbol, Colour, DUMMY_HEX } from './tiles';

class DrawingApp {
  
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  grid: Grid<Kamon>;

  constructor () {
    this.canvas = document.getElementById("kamoncanvas") as HTMLCanvasElement;
    this.context = this.canvas.getContext("2d") as CanvasRenderingContext2D;
    this.createUserEvents();
    this.grid = new Grid(Kamon, TILES);
    this.redraw();
  }


  private pressEventHandler = (event: MouseEvent) => {
    let ex = event.clientX;
    let ey = event.clientY;
    let cx = this.canvas.offsetLeft;
    let cy = this.canvas.offsetTop;
    this.canvasClickHandler(event, [ex - cx, ey - cy]);
  }

  private canvasClickHandler(event: MouseEvent, pt: [number, number]) {
    console.log(`Clicked at ${pt} in canvas coordinates`);

  }

  private createUserEvents() {
    let canvas = this.canvas;
    canvas.addEventListener("mousedown", this.pressEventHandler);
  }

  private redraw() { 
    this.context.fillStyle = "#000000";
    this.context.save();
    var transX = this.canvas.width * 0.5,
        transY = this.canvas.height * 0.5;
    const first = DUMMY_HEX;
    this.context.translate(transX, transY);
    this.grid.forEach((kamon) => {
      // this.context.save();
      // this.context.translate(kamon.center.x, kamon.center.y);
      this.context.strokeStyle = kamon.colour;
      this.context.beginPath();
      this.context.fillStyle = kamon.colour;
      let corners = kamon.corners;
      let first = corners[0];
      this.context.moveTo(first.x, first.y);
      kamon.corners.slice(1).forEach(crnr => {
        this.context.lineTo(crnr.x, crnr.y);
      });
      this.context.closePath();
      this.context.fill();
      // this.context.restore();
      this.render_symbol(kamon);
    });
    this.context.restore();
  }

  private render_symbol(kamon: Kamon) {
    this.context.save();
    this.context.translate(-kamon.center.x - kamon.origin.x, -(kamon.center.y + kamon.origin.y));
    const unit = kamon.dimensions.xRadius; // == yRadius
    this.context.beginPath();
    this.context.lineWidth = 3;
    this.context.lineCap = 'rounded';
    this.context.strokeStyle = '#000000';
    const split = unit/4;
    const eps = -unit/10;
    switch (kamon.symbol) {
        case Symbol.MOUNTAIN:
        this.context.moveTo( - unit/4 + eps,  + unit/4);
        this.context.lineTo( + eps,  - unit/4);
        this.context.lineTo( + unit/4 + eps,  + unit/4);
        this.context.moveTo( - unit/4 + eps + split,  + unit/4);
        this.context.lineTo( + eps + split,  - unit/4);
        this.context.lineTo( + unit/4 + eps + split,  + unit/4);
        this.context.stroke();
        break;
        case Symbol.FAN:
        console.log(kamon.colour);
        this.context.arc(0, unit/4, 0.6 * unit, -5*Math.PI/6, -Math.PI/6);
        this.context.stroke();
        this.context.moveTo(0, unit/4);
        this.context.lineTo(0.6 * unit * Math.cos(-Math.PI/6), 0.6 * unit * Math.sin(-Math.PI/6) + unit/4);
        this.context.stroke();
        this.context.moveTo(0, unit/4);
        this.context.lineTo(0.6 * unit * Math.cos(-5 * Math.PI/6), 0.6 * unit * Math.sin(-Math.PI/6) + unit/4);
        this.context.stroke();
        break;
        case Symbol.BIRD:
        this.context.arc(-unit/4, unit/8, unit/4, -3*Math.PI/4, 0);
        this.context.stroke();
        this.context.arc(unit/4, unit/8, unit/4, -Math.PI, -Math.PI/4);
        this.context.stroke();
        break;
        case Symbol.BUTTERFLY:
        this.context.moveTo(0, 0);
        this.context.lineTo(unit/4, -unit/4);
        this.context.lineTo(unit/4, unit/4);
        this.context.lineTo(0, 0);
        this.context.lineTo(-unit/4, -unit/4);
        this.context.lineTo(-unit/4, unit/4);
        this.context.lineTo(0, 0);
        this.context.stroke();
        break;
        case Symbol.GATE:
        const scale = 1.5;
        const gateShift = unit/8;
        this.context.moveTo(- scale * unit/4, - scale * unit/4 + gateShift);
        this.context.lineTo(scale * unit/4, -scale * unit/4 + gateShift);
        this.context.moveTo(scale * unit/8, -scale * unit/4 + gateShift);
        this.context.lineTo(scale * unit/8, scale * unit/8 + gateShift);
        this.context.moveTo(-scale * unit/8, -scale * unit/4 + gateShift);
        this.context.lineTo(-scale * unit/8, scale * unit/8 + gateShift);
        this.context.stroke();
        break;
        case Symbol.FISH:
        let fishShift = unit/8;
        this.context.ellipse(fishShift, 0, unit/3, unit/5, 0, 0, 2 * Math.PI);
        this.context.moveTo(fishShift-unit/3, 0);
        this.context.lineTo(fishShift-unit/2, unit/5);
        this.context.lineTo(fishShift-unit/2, -unit/5);
        this.context.lineTo(fishShift-unit/3, 0);
        this.context.stroke();
        break;
        default:
    }
    this.context.restore();
  }
}

new DrawingApp();


