var Ticker = require('./')
var test = require('tape')

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

    ticker.clear()
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
        //will be called 2x times
        onUpdate: function(tween) { t.equal(tween.target, target, "update") }, 
        onComplete: function(tween) { t.equal(tween.target, target, "complete") },
        onStart: function(tween) { t.equal(tween.target, target, "start") },
    })
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
        onStart: function() {
            t.ok(true, 'start once')
        } 
    })
    ticker.tick(0.5)
    t.deepEqual(elements, expected, 'tweens multiple')

    tween.cancel()
    ticker.tick(0.5)
    t.deepEqual(elements, expected, 'cancels multiple')
})