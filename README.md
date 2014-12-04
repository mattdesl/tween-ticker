# tween-ticker

[![stable](http://badges.github.io/stability-badges/dist/stable.svg)](http://github.com/badges/stability-badges)

A generic low-level ticker for tweening engines. Stacks tweens and then, on each tick, steps through them to update them to their interpolated (and eased) values. 

Does not assume any standard set of eases, and uses linear (i.e. no ease) by default.

```js
var ticker = Ticker()

//push a tween, animating array A to B
var start = [0, 0]
ticker.pushArray(start, [2, 4], { duration: 1 })

//step the ticker by half the tween's duration
ticker.tick(0.5)

//start will now be [1, 2]
console.log(start)
```

## Usage

[![NPM](https://nodei.co/npm/tween-ticker.png)](https://nodei.co/npm/tween-ticker/)

#### `ticker = Ticker([opt])`

Creates a ticker with some options:

- `eases` a map of ease functions that users can pass by string in the tween options, defaults to an empty object
- `defaultEase` a string or function that represents the default easing when the user does not specify one, defaults to linear

#### `tween = ticker.pushObject(element, opt)`

Tweens object properties and arrays. Options:

- `delay` in time units, default 0
- `duration` in time units, default 0
- `ease` is a string (lookup for the `eases` passed at constructor) or an [ease function](https://www.npmjs.org/package/eases)

Any other properties will be tweened if *they are consistent with `element`* and also if they are a `number` or [an array](https://www.npmjs.org/package/an-array).

```js
var element = { x: 25, shape: [10, 5] }

var tween = ticker.pushObject(element, { 
    x: 50,
    shape: [5, 2],
    duration: 3
})
```

#### `tween = ticker.pushArray(start, end[, opt])`

Tweens two arrays. This is more optimized than object tweening and leads to less GC thrashing. Options:

- `output` the output array to modify, defaults to `start` if not provided
- `delay` in time units, default 0
- `duration` in time units, default 0
- `ease` is a string (lookup for the `eases` passed at constructor) or an [ease function](https://www.npmjs.org/package/eases)

If `opt` is a number, it is assumed to be a `duration` and `start` will be the output.

```js
var start = [0, 5], end = [5, 10], tmp = []

//to avoid modifying start
ticker.pushArray(start, end, { output: tmp, duration: 1.5, delay: 0.5 })

//or could modify start directly
ticker.pushArray(start, end, 1.5)
```

#### `ticker.clear()`

Clears all tweens stored in this ticker.

### `tween.cancel()`

Cancels the tween, removing it from the queue on the next tick without applying any further interpolation.

## License

MIT, see [LICENSE.md](http://github.com/mattdesl/tween-ticker/blob/master/LICENSE.md) for details.
