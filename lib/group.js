var inherits = require('inherits')
var lerp = require('lerp-array')
var BaseTween = require('./base')
var endTarget = require('./end-target')

function GroupTween(engine, target, opt) {
    BaseTween.call(this, engine, opt)
    this.target = target
    this.end = target.map(function(t) {
        return endTarget(t, opt)
    })
}

inherits(GroupTween, BaseTween)

GroupTween.prototype.lerp = function(alpha) {
    for (var j=0; j<this.end.length; j++)  {
        var endings = this.end[j]
        var target = this.target[j]
        for (var i=0; i<endings.length; i++) {
            var t = endings[i]
            var k = t.key
            target[k] = lerp(t.start, t.end, alpha, target[k])    
        }
    }
}

module.exports = GroupTween