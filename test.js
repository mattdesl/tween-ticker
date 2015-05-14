var Ticker = require('./')
var test = require('tape')
var array = require('tween-array')

test('operates on obejcts', function(t) {
    var element = { x: 5, value: [1, 0] }

    var ticker = Ticker()
    var tween

    tween = ticker.to(element, { duration: 1, x: 10, delay: 1, value: [2, 4] })

    t.deepEqual(element, { x: 5, value: [1, 0] }, 'does not change until ticking')

    ticker.tick(1)
    t.deepEqual(element, { x: 5, value: [1, 0] }, 'delay is taken into account')

    ticker.tick(1)
    t.deepEqual(element, { x: 10, value: [2, 4] }, 'lerps arrays and numbers')


    //push a tween, animating A to B
    var target = {
        position: [0, 0],
        opacity: 0
    }
    tween = ticker.to(target, { position: [2, 4], opacity: 1, duration: 1 })
    ticker.tick(0.5)
    t.deepEqual(target, { opacity: 0.5, position: [ 1, 2 ] })

    t.end()
})


test('operates on getters/setters', function(t) {
    var element = { value: [1, 0] }
    var x = 5
    Object.defineProperty(element, 'x', {
        get: function() {
            return x
        },
        set: function(val) {
            x = val
        }
    })

    var ticker = Ticker()
    var tween

    tween = ticker.to(element, { duration: 1, x: 10, delay: 1, value: [2, 4] })

    t.equal(element.x, 5, 'does not change until ticking')

    ticker.tick(1)
    t.equal(element.x, 5, 'delay is taken into account')

    ticker.tick(1)
    t.equal(element.x, 10, 'lerps arrays and getter/setter')

    t.end()
})

test('ducktypes tweens', function(t) {
    var start = [10, 10], end = [20, 50]
    var tween = array(start, end, 2.0)
    var ticker = Ticker()

    var obj = { x: 0 }
    ticker.to(obj, { x: 1, duration: 1 })
    ticker.to(array(start, end, 2.0))

    ticker.tick(0.5)
    t.deepEqual(start, [12.5, 20], 'pushes tween object')
    t.deepEqual(obj.x, 0.5, 'creates new tween object')
    t.throws(function() { //catch some programmer error here
        ticker.to(obj)
    }, 'throws')
    t.end()
})

test('eases', function(t) {
    var eases = {
        squared: function (a) {
            return a*a
        },
        sqrt: function (a) {
            return Math.sqrt(a)
        },
        linear: function(a) {
            return a
        }
    }
    
    var ticker = Ticker({ defaultEase: eases.squared, eases: eases })

    var target = { x: 0 }
    ticker.to(target, { x: 2, duration: 1 })
    ticker.tick(0.25)
    ticker.tick(0.50)
    t.equal(target.x, 1.125, 'uses squared by default')

    ticker.cancel()
    target.x = 0
    ticker.to(target, { x: 1, duration: 1, ease: 'linear' })
    ticker.tick(0.50)
    t.equal(target.x, 0.5, 'accepts strings for ease map')

    t.end()
})

test('handles callbacks', function(t) {
    var ticker = Ticker()

    t.plan(4)

    var target = { start: [0, 0], end: [15, 15] }
    var tween = ticker.to(target, { 
        duration: 2,
    }).on('complete', function(tween) { t.equal(tween.target, target, "complete") })
      .on('start', function(tween) { t.equal(tween.target, target, "start") })
      //will be called 2x times
      .on('update', function(tween) { t.equal(tween.target, target, "update") })
    ticker.tick(1)
    ticker.tick(1)
})

test('empty tween', function(t) {
    t.plan(3)
    
    var ticker = Ticker()

    var tween = ticker.to()
    tween.on('update', function(tween) { t.ok(tween, 'got update') })
    tween.on('complete', function(tween) { t.ok(tween, 'got complete') })
    tween.on('start', function(tween) { t.ok(tween, 'got start') })

    ticker.tick(1)
    ticker.tick(1)
})

test('handles multiple', function(t) {
    t.plan(3)

    var ticker = Ticker()

    var elements = [
        { alpha: 0, y: 15 },
        { alpha: 0.5, x: 0 },
        { alpha: 1 }
    ]
    var expected = [ { alpha: 0.5, y: 15 }, { alpha: 0.75, x: 10 }, { alpha: 1 } ]

    var tween = ticker.to(elements, { 
        alpha: 1,
        x: 20, 
        duration: 1,
    }).on('start', function() {
            t.ok(true, 'start once')
    })
    ticker.tick(0.5)
    t.deepEqual(elements, expected, 'tweens multiple')

    tween.cancel()
    ticker.tick(0.5)
    t.deepEqual(elements, expected, 'cancels multiple')
})