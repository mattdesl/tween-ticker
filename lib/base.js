var noop = function(){}
var linear = require('eases/linear')

function BaseTween(engine, opt) {
    this.duration = (opt && opt.duration)||0
    this.delay = (opt && opt.delay)||0
    this.active = true
    this.cancelling = false
    this.time = 0
    this.ease = opt && opt.ease
    this.target = null
    
    this.onStart = (opt && opt.onStart) || noop
    this.onComplete = (opt && opt.onComplete) || noop
    this.onUpdate = (opt && opt.onUpdate) || noop

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