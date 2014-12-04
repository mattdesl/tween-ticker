var BaseTween = require('./base')
var isArray = require('an-array')

var ignores = new BaseTween()

module.exports = function getTargets(element, opt) {
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