module.exports = (...fns) => (...args) => fns.reduceRight((y, f) => f(y), ...args)
