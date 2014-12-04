var noop = function(){}
var linear = require('eases/linear')

function BaseTween(engine, opt) {
    this.duration = (opt && opt.duration)||0
    this.delay = (opt && opt.delay)||0
    this.resolve = noop
    this.reject = noop
    this.active = true
    this.cancelling = false
    this.time = 0
    this.ease = opt && opt.ease
    if (engine) {
        this.ease = this.ease || engine.defaultEase
        if (typeof this.ease === 'string')
            this.ease = engine.eases[this.ease]
    }
    if (typeof this.ease !== 'function')
        this.ease = linear
}

BaseTween.prototype.lerp = noop

BaseTween.prototype.cancel = function() {
    this.cancelling = true
}

module.exports = BaseTween