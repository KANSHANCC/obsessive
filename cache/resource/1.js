console.log('1.js');
function getType (target) {
    if (Array.isArray(target)) return 'Array'
    if (typeof target !== 'object') return target
    return Object.prototype.toString.call(target)

}
