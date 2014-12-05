var linear = require('eases/linear')
var createTween = require('tween-objects')

function TweenTicker(opt) {
    if (!(this instanceof TweenTicker))
        return new TweenTicker(opt)
    opt = opt||{}
    this.stack = []
    this.defaultEase = opt.defaultEase || linear
    this.eases = opt.eases || {}
    this._applyEase = this.ease.bind(this)
}

TweenTicker.prototype.clear = function() {
    for (var i=0; i<this.stack.length; i++) {
        var t = this.stack[i]
        t.cancel()
        t.tick(0)
    }
    this.stack.length = 0
}

TweenTicker.prototype.to = function(element, opt) {
    return this.push(createTween(element, opt))
}

TweenTicker.prototype.push = function(tween) {
    this.stack.push(tween)
    return tween
}

TweenTicker.prototype.tick = function(dt) {
    dt = typeof dt === 'number' ? dt : 1/60

    //for all queued tweens, tick them forward
    for (var i=0; i<this.stack.length; i++) {
        var tween = this.stack[i]
        tween.tick(dt, this._applyEase)
    }

    //now kill any inactive tweens
    for (i=this.stack.length-1; i>=0; i--)
        if (!this.stack[i].active)
            this.stack.splice(i, 1)
}

//determines which easing function to use based on user options
TweenTicker.prototype.ease = function(tween, alpha) {
    var ease = tween.ease || this.defaultEase
    if (typeof ease === 'string')
        ease = this.eases[ease]
    if (typeof ease !== 'function')
        ease = linear
    return ease(alpha)
}

module.exports = TweenTicker
