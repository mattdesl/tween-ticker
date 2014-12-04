var lerp = require('lerp-array')
var BaseTween = require('./base')
var inherits = require('inherits')

function ArrayTween(engine, start, end, opt) {
    if (typeof opt === 'number')
        opt = { duration: opt }
    BaseTween.call(this, engine, opt)
    this.start = start
    this.end = end

    this.output = (opt && opt.output) || this.start
    if (this.start === this.output) {
    this.output = this.start
        this.start = this.start.slice()
    }
}

inherits(ArrayTween, BaseTween)

ArrayTween.prototype.lerp = function(alpha) {
    lerp(this.start, this.end, alpha, this.output)
}

module.exports = ArrayTween