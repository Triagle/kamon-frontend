import {
  defineHex,
  Hex,
  AxialCoordinates,
  Orientation,
  Point
} from 'honeycomb-grid';

export enum Colour {
  RED = '#FF0000',
  BLUE = '#0000FF',
  ORANGE = '#FFA500',
  YELLOW = '#FFFF00',
  GREEN = '#00FF00',
  PINK = '#FFC0CB',
  BLANK = '#000000'
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
  static create(config: AxialCoordinates & {colour: Colour, symbol: Symbol}) {
    const tile = new Kamon(config);
    tile.colour = config.colour;
    tile.symbol = config.symbol;
    return tile
  }
}


export const TILES: Kamon[] = [
{q: -3, r: 0, colour: Colour.RED, symbol: Symbol.FISH},
{q: -3, r: 1, colour: Colour.RED, symbol: Symbol.FISH},
{q: -3, r: 2, colour: Colour.RED, symbol: Symbol.FISH},
{q: -3, r: 3, colour: Colour.RED, symbol: Symbol.FISH},
{q: -2, r: -1, colour: Colour.RED, symbol: Symbol.FISH},
{q: -2, r: 0, colour: Colour.RED, symbol: Symbol.FISH},
{q: -2, r: 1, colour: Colour.BLUE, symbol: Symbol.FAN},
{q: -2, r: 2, colour: Colour.BLUE, symbol: Symbol.FAN},
{q: -2, r: 3, colour: Colour.BLUE, symbol: Symbol.FAN},
{q: -1, r: -2, colour: Colour.BLUE, symbol: Symbol.FAN},
{q: -1, r: -1, colour: Colour.BLUE, symbol: Symbol.FAN},
{q: -1, r: 0, colour: Colour.BLUE, symbol: Symbol.FAN},
{q: -1, r: 1, colour: Colour.ORANGE, symbol: Symbol.BUTTERFLY},
{q: -1, r: 2, colour: Colour.ORANGE, symbol: Symbol.BUTTERFLY},
{q: -1, r: 3, colour: Colour.ORANGE, symbol: Symbol.BUTTERFLY},
{q: 0, r: -3, colour: Colour.ORANGE, symbol: Symbol.BUTTERFLY},
{q: 0, r: -2, colour: Colour.ORANGE, symbol: Symbol.BUTTERFLY},
{q: 0, r: -1, colour: Colour.ORANGE, symbol: Symbol.BUTTERFLY},
{q: 0, r: 0, colour: Colour.YELLOW, symbol: Symbol.MOUNTAIN},
{q: 0, r: 1, colour: Colour.YELLOW, symbol: Symbol.MOUNTAIN},
{q: 0, r: 2, colour: Colour.YELLOW, symbol: Symbol.MOUNTAIN},
{q: 0, r: 3, colour: Colour.YELLOW, symbol: Symbol.MOUNTAIN},
{q: 1, r: -3, colour: Colour.YELLOW, symbol: Symbol.MOUNTAIN},
{q: 1, r: -2, colour: Colour.YELLOW, symbol: Symbol.MOUNTAIN},
{q: 1, r: -1, colour: Colour.GREEN, symbol: Symbol.GATE},
{q: 1, r: 0, colour: Colour.GREEN, symbol: Symbol.GATE},
{q: 1, r: 1, colour: Colour.GREEN, symbol: Symbol.GATE},
{q: 1, r: 2, colour: Colour.GREEN, symbol: Symbol.GATE},
{q: 2, r: -3, colour: Colour.GREEN, symbol: Symbol.GATE},
{q: 2, r: -2, colour: Colour.GREEN, symbol: Symbol.GATE},
{q: 2, r: -1, colour: Colour.PINK, symbol: Symbol.BIRD},
{q: 2, r: 0, colour: Colour.PINK, symbol: Symbol.BIRD},
{q: 2, r: 1, colour: Colour.PINK, symbol: Symbol.BIRD},
{q: 3, r: -3, colour: Colour.PINK, symbol: Symbol.BIRD},
{q: 3, r: -2, colour: Colour.PINK, symbol: Symbol.BIRD},
{q: 3, r: -1, colour: Colour.PINK, symbol: Symbol.BIRD},
{q: 3, r: 0, colour: Colour.BLANK, symbol: Symbol.BLANK}
].map(Kamon.create);
