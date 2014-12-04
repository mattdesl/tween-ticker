var noop = function(){}
var linear = require('eases/linear')

function BaseTween(opt) {
    this.duration = (opt && opt.duration)||0
    this.delay = (opt && opt.delay)||0
    this.active = true
    this.cancelling = false
    this.time = 0
    this.ease = opt && opt.ease
    this.target = null
    this._started = false
    
    this.onStart = (opt && opt.onStart) || noop
    this.onComplete = (opt && opt.onComplete) || noop
    this.onUpdate = (opt && opt.onUpdate) || noop
}

BaseTween.prototype.lerp = noop
BaseTween.prototype.setup = noop

BaseTween.prototype.cancel = function() {
    this.cancelling = true
}

module.exports = BaseTween