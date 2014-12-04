var Ticker = require('./')
var test = require('tape')

test('operates on arrays', function(t) {
    var start = [0, 0]
    var end = [1, 0.5]

    var ticker = Ticker()
    t.equal(typeof ticker.defaultEase, 'function', 'default ease is a function')
    t.equal(ticker.defaultEase(1), 1, 'default ease is linear')

    var tween

    tween = ticker.pushArray(start, end, 1)
    ticker.tick(0.5)
    t.deepEqual(start, [0.5, 0.25], 'if no output is given, changes start')

    tween.cancel()
    ticker.tick(0.5)
    t.deepEqual(start, [0.5, 0.25], 'start no longer affected after cancel')

    start = [0, 0]
    tween = ticker.pushArray(start, end, { duration: 1.5 })
    ticker.tick(0.5)
    ticker.tick(1.0)
    t.deepEqual(start, end, 'start ticks to end after N units of time')

    ticker.clear()
    ticker.tick(1.0)
    t.deepEqual(start, end, 'clear() stops affecting tweens')

    start = [0, 10]
    end = [2, 0]
    var output = []
    ticker.pushArray(start, end, { duration: 1, output: output })
    ticker.tick(0.5)
    t.deepEqual(output, [1, 5], 'can redirect array output to a shared array')

    t.end()
})

test('operates on obejcts', function(t) {
    var element = { x: 5, value: [1, 0] }

    var ticker = Ticker()
    var tween

    tween = ticker.pushObject(element, { duration: 1, x: 10, delay: 1, value: [2, 4] })

    t.deepEqual(element, { x: 5, value: [1, 0] }, 'does not change until ticking')

    ticker.tick(1)
    t.deepEqual(element, { x: 5, value: [1, 0] }, 'delay is taken into account')

    ticker.tick(1)
    t.deepEqual(element, { x: 10, value: [2, 4] }, 'lerps arrays and numbers')
    t.end()
})

test('handles callbacks', function(t) {
    var ticker = Ticker()

    t.plan(4)

    var start = [0, 0], 
        end = [50, 1]
    var tween = ticker.pushArray(start, end, { 
        duration: 2,
        onUpdate: function(tween) { t.ok(tween, "update") }, //2x times
        onComplete: function(tween) { t.ok(tween, "complete") },
        onStart: function(tween) { t.ok(tween, "start") },
    })
    ticker.tick(1)
    ticker.tick(1)
})