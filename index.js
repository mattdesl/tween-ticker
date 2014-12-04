var linear = require('eases/linear')

var ObjectTween = require('./lib/object')
var GroupTween = require('./lib/group')

function TweenTicker(opt) {
    if (!(this instanceof TweenTicker))
        return new TweenTicker(opt)
    opt = opt||{}
    this.stack = []
    this.defaultEase = opt.defaultEase || linear
    this.eases = opt.eases || {}
}

TweenTicker.prototype.clear = function() {
    for (var i=0; i<this.stack.length; i++) {
        var t = this.stack[i]
        if (t.active) {
            t.cancelling = true
            t.onComplete(t)
        }
        t.active = false
    }
    this.stack.length = 0
}

TweenTicker.prototype.to = function(element, opt) {
    var tween = Array.isArray(element) 
            ? new GroupTween(element, opt)
            : new ObjectTween(element, opt)
    this.stack.push(tween)
    return tween
}

TweenTicker.prototype.push = function(tween) {
    this.stack.push(tween)
    return tween
}

TweenTicker.prototype.tick = function(dt) {
    dt = typeof dt === 'number' ? dt : 1/60

    for (var i=0; i<this.stack.length; i++) {
        var tween = this.stack[i]
        if (tween.cancelling && tween.active) {
            tween.active = false
            tween.onComplete(tween)
        }

        if (!tween.active)
            continue
        var last = tween.time
        tween.time += dt
        if (last === 0 && tween.time > 0) 
            tween.onStart(tween)
        
        var alpha = (tween.time-tween.delay) / tween.duration
        if (alpha < 0)
            alpha = 0
        else if (alpha > 1)
            alpha = 1

        alpha = this.ease(tween, alpha)
        tween.lerp(alpha)
        tween.onUpdate(tween)

        if (tween.time >= (tween.duration+tween.delay)) {
            tween.active = false
            tween.onComplete(tween)
        }
    }

    //now kill any inactive tweens
    for (i=this.stack.length-1; i>=0; i--)
        if (!this.stack[i].active)
            this.stack.splice(i, 1)
}

TweenTicker.prototype.ease = function(tween, alpha) {
    var ease = tween.ease || this.defaultEase
    if (typeof ease === 'string')
        ease = this.eases[ease]
    if (typeof ease !== 'function')
        ease = linear
    return ease(alpha)
}

module.exports = TweenTicker
