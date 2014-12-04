var inherits = require('inherits')
var lerp = require('lerp-array')
var isArray = require('an-array')
var BaseTween = require('./base')

var ignores = new BaseTween()

function ObjectTween(engine, element, opt) {
    BaseTween.call(this, engine, opt)
    this.element = element
    this.targets = getTargets(element, opt)
}

inherits(ObjectTween, BaseTween)

ObjectTween.prototype.lerp = function(alpha) {
    for (var i=0; i<this.targets.length; i++) {
        var t = this.targets[i]
        var k = t.key
        this.element[k] = lerp(t.start, t.end, alpha, this.element[k])
    }
}

function getTargets(element, opt) {
    var targets = []
    for (var k in opt) { 
        //copy properties as needed
        if (opt.hasOwnProperty(k) 
                && element.hasOwnProperty(k)
                && !ignores.hasOwnProperty(k)) {
            var startVal = element[k]
            var endVal = opt[k]
            if (typeof startVal === 'number'
                 && typeof endVal === 'number') {
                targets.push({ 
                    key: k, 
                    start: startVal, 
                    end: endVal 
                })
            }
            else if (isArray(startVal) && isArray(endVal)) {
                targets.push({ 
                    key: k, 
                    start: startVal.slice(), 
                    end: endVal.slice() 
                })
            }
        }
    }
    return targets
}

module.exports = ObjectTween