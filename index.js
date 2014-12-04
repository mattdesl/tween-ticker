var linear = require('eases/linear')

var ObjectTween = require('./lib/object')
var ArrayTween = require('./lib/array')

function Queue(opt) {
    if (!(this instanceof Queue))
        return new Queue(opt)
    opt = opt||{}
    this.stack = []
    this.defaultEase = opt.defaultEase || linear
    this.eases = opt.eases || {}
}

Queue.prototype.clear = function() {
    for (var i=0; i<this.stack.length; i++) {
        var t = this.stack[i]
        if (t.active) {
            t.cancelling = true
            t.reject(t)
        }
        t.active = false
    }
    this.stack.length = 0
}

Queue.prototype.pushObject = function(element, opt) {
    var tween = new ObjectTween(this, element, opt)
    this.stack.push(tween)
    return tween
}

Queue.prototype.pushArray = function(start, end, opt) {
    var tween = new ArrayTween(this, start, end, opt)
    this.stack.push(tween)
    return tween   
}

Queue.prototype.tick = function(dt) {
    dt = typeof dt === 'number' ? dt : 1/60

    for (var i=0; i<this.stack.length; i++) {
        var tween = this.stack[i]
        if (tween.cancelling) {
            tween.active = false
            tween.reject(tween)
            continue
        }
        if (!tween.active)
            continue

        tween.time += dt
        var alpha = (tween.time-tween.delay) / tween.duration
        if (alpha < 0)
            alpha = 0
        else if (alpha > 1)
            alpha = 1

        alpha = tween.ease(alpha)
        tween.lerp(alpha)

        if (tween.time >= (tween.duration+tween.delay)) {
            tween.active = false
            tween.resolve(tween)
        }
    }

    //now kill any inactive tweens
    for (i=this.stack.length-1; i>=0; i--)
        if (!this.stack[i].active)
            this.stack.splice(i, 1)
}

module.exports = Queue
