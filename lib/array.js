var lerp = require('lerp-array')
var BaseTween = require('./base')
var inherits = require('inherits')

function ArrayTween(engine, target, end, opt) {
    if (typeof opt === 'number')
        opt = { duration: opt }
    BaseTween.call(this, engine, opt)
    this.target = target
    this.end = end

    this.output = (opt && opt.output) || this.target
    if (this.target === this.output) {
        this.output = this.target
        this.target = this.target.slice()
    }
}

inherits(ArrayTween, BaseTween)

ArrayTween.prototype.lerp = function(alpha) {
    lerp(this.target, this.end, alpha, this.output)
}

module.exports = ArrayTween