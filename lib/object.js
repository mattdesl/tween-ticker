var inherits = require('inherits')
var lerp = require('lerp-array')
var BaseTween = require('./base')
var endTarget = require('./end-target')

function ObjectTween(engine, target, opt) {
    BaseTween.call(this, engine, opt)
    this.target = target
    this.endings = endTarget(target, opt)
}

inherits(ObjectTween, BaseTween)

ObjectTween.prototype.lerp = function(alpha) {
    for (var i=0; i<this.endings.length; i++) {
        var t = this.endings[i]
        var k = t.key
        this.target[k] = lerp(t.start, t.end, alpha, this.target[k])
    }
}

module.exports = ObjectTween