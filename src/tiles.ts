import {
  defineHex,
  Hex,
  AxialCoordinates,
  Orientation,
  Point
} from 'honeycomb-grid';

export enum Colour {
  RED = '#FF6F59',
  BLUE = '#AEC5EB',
  ORANGE = '#FDCA40',
  YELLOW = '#F2E863',
  GREEN = '#00FF00',
  PINK = '#DC6ACF',
  BLANK = '#000000'
}

export enum Selection {
  PLAYER1,
  PLAYER2,
  NONE
}

export enum Symbol {
  FISH,
  FAN,
  BUTTERFLY,
  MOUNTAIN,
  GATE,
  BIRD,
  BLANK
}

const HEX_RADIUS = 50;
const DummyHex = defineHex({dimensions: HEX_RADIUS, orientation: Orientation.FLAT});
export const DUMMY_HEX = new DummyHex({q: 0, r: 0});


export class Kamon extends defineHex({dimensions: HEX_RADIUS, origin:
                                      {x: -DUMMY_HEX.width / 2, y: -DUMMY_HEX.height / 2}, orientation: Orientation.FLAT}) {
  colour: Colour;
  symbol: Symbol;
  selected: Selection;
  static create(config: AxialCoordinates & {colour: Colour, symbol: Symbol, selected?: Selection, last_selected?: boolean}) {
    const tile = new Kamon(config);
    tile.colour = config.colour;
    tile.symbol = config.symbol;
    tile.selected = config.selected ? config.selected : Selection.NONE;
    return tile
  }
}

export const COLOUR_SYMBOL_PAIRS = [

  {colour: Colour.RED, symbol: Symbol.FISH},
  {colour: Colour.BLUE, symbol: Symbol.FISH},
  {colour: Colour.ORANGE, symbol: Symbol.FISH},
  {colour: Colour.YELLOW, symbol: Symbol.FISH},
  {colour: Colour.PINK, symbol: Symbol.FISH},
  {colour: Colour.GREEN, symbol: Symbol.FISH},
  {colour: Colour.RED, symbol: Symbol.FAN},
  {colour: Colour.BLUE, symbol: Symbol.FAN},
  {colour: Colour.ORANGE, symbol: Symbol.FAN},
  {colour: Colour.YELLOW, symbol: Symbol.FAN},
  {colour: Colour.PINK, symbol: Symbol.FAN},
  {colour: Colour.GREEN, symbol: Symbol.FAN},
  {colour: Colour.RED, symbol: Symbol.BUTTERFLY},
  {colour: Colour.BLUE, symbol: Symbol.BUTTERFLY},
  {colour: Colour.ORANGE, symbol: Symbol.BUTTERFLY},
  {colour: Colour.YELLOW, symbol: Symbol.BUTTERFLY},
  {colour: Colour.PINK, symbol: Symbol.BUTTERFLY},
  {colour: Colour.GREEN, symbol: Symbol.BUTTERFLY},
  {colour: Colour.RED, symbol: Symbol.MOUNTAIN},
  {colour: Colour.BLUE, symbol: Symbol.MOUNTAIN},
  {colour: Colour.ORANGE, symbol: Symbol.MOUNTAIN},
  {colour: Colour.YELLOW, symbol: Symbol.MOUNTAIN},
  {colour: Colour.PINK, symbol: Symbol.MOUNTAIN},
  {colour: Colour.GREEN, symbol: Symbol.MOUNTAIN},
  {colour: Colour.RED, symbol: Symbol.GATE},
  {colour: Colour.BLUE, symbol: Symbol.GATE},
  {colour: Colour.YELLOW, symbol: Symbol.GATE},
  {colour: Colour.PINK, symbol: Symbol.GATE},
  {colour: Colour.GREEN, symbol: Symbol.GATE},
  {colour: Colour.ORANGE, symbol: Symbol.GATE},
  {colour: Colour.RED, symbol: Symbol.BIRD},
  {colour: Colour.BLUE, symbol: Symbol.BIRD},
  {colour: Colour.YELLOW, symbol: Symbol.BIRD},
  {colour: Colour.PINK, symbol: Symbol.BIRD},
  {colour: Colour.GREEN, symbol: Symbol.BIRD},
  {colour: Colour.ORANGE, symbol: Symbol.BIRD},
]

function shuffleArray<T>(array: T[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

export function randomTileDistrubition(): Kamon[] {
  var tileCopy = JSON.parse(JSON.stringify(COLOUR_SYMBOL_PAIRS));
  shuffleArray(tileCopy);
  var tiles: Kamon[] = [];
  var i = 0;
  for (let q = -3; q <= 3; q++) {
    for (let r = -3; r <= 3; r++) {
      if (q == r && r == 0 || Math.abs(q + r) > 3) {
        continue;
      }
      tiles.push(Kamon.create({...tileCopy[i], q: q, r: r}));
      i++;
    }
  }
  tiles.push(Kamon.create({q: 0, r: 0, colour: Colour.BLANK, symbol: Symbol.BLANK}))

  return tiles;
}

