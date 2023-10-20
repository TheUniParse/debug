// node --inspect-brk main.js
// chrome://inspect/#devices

const a = 16
console.log({ a })

const arr = [a, 2]
console.table(arr)

const fibonacci = n => n <= 1
  ? 1
  : fibonacci(n - 1) + fibonacci(n - 2)
console.time()
const fib30 = fibonacci(30)
console.timeEnd()
console.log({ fib30 })
