'use strict'

// Example demonstrating closure and potential memory leak

// over time (each 1s)
// Creating a leaked closure
// who refer to the largeObject from generateLeakedClosure()
const closures = new Set()
let i = 0
const timerId = setInterval(() => {
  const bufferLength = 1e9
  const optimized = false
  const closure = optimized
    ? generateClosure_optimized(bufferLength)
    : generateClosure_memoryLeak(bufferLength)

  // to prevent garbage collector, we store closure
  closures.add(closure)

  console.log(`create leaked closure nth ${++i}:`)
  logMemoryUsage()
}, 1000)

/** monitoring: task manager / performance / memory / committed
 * committed: 4.9/15.9 gb (initial before running the app)
 * on each iteration increase by ~1gb
 * untill terminal log:
    create leaked closure nth 16
    Memory usage: 14.90 GB
 * commited: 19.8/20.2 gb, (initial 4.9 + 14.9 app usage)
 * and the app crash with error:
    RangeError: Array buffer allocation failed
 */


// functions
function generateClosure_memoryLeak(bufferLength) {
  const largeObject = new ArrayBuffer(bufferLength)

  // ⚠️ memory leak
  // Reference to old largeObject
  const closure = () => largeObject.byteLength
  return closure
}

function generateClosure_optimized(bufferLength) {
  const largeObject = new ArrayBuffer(bufferLength)
  const { byteLength } = largeObject

  // 💡 no memory leak
  // no Reference to largeObject
  // refer to just a static primative value (number)!!
  const closure = () => byteLength
  return closure
}

function logMemoryUsage() {
  const usage = process.memoryUsage().external
  console.log(`Memory usage: ${formatBytes(usage)}\n`)
}

function formatBytes(bytes, decimals = 2) {
  if (bytes < 10) return `${bytes} bytes`

  const k = 1024
  const extensions = ['Byte', 'KB', 'MB', 'GB', 'TB']

  const i = Math.floor(Math.log(bytes) / Math.log(k))

  const size = (bytes / k ** i).toFixed(decimals)
  return `${size} ${extensions[i]}`
}

/** terminal logs (optimized: true)
create leaked closure nth i:
Memory usage: 954.13 MB

... (same memory usage, no error, no app crash)
 */

/** terminal logs (optimized: false)
create leaked c1osure nth 1:
Memory usage: 954.13 MB

create leaked closure nth 2:
Memory usage: 1.86 GB

create leaked closure nth 3:
Memory usage: 2.79 GB

create leaked closure nth 4:
Memory usage: 3.73 GB

create leaked closure nth 5:
Memory usage: 4.66 GB

create leaked closure nth 6:
Memory usage: 5.59 GB

create leaked closure nth 7:
Memory usage: 6.52 GB

create leaked closure nth 8:
Memory usage: 7.45 GB

create leaked closure nth 9:
Memory usage: 8.38 GB

create leaked closure nth 10:
Memory usage: 9.31 GB

create leaked closure nth 11:
Memory usage: 10.24 GB

create leaked closure nth 12:
Memory usage: 11.18 GB

create leaked closure nth 13:
Memory usage: 12.11 GB

create leaked closure nth 14:
Memory usage: 13.04 GB

create leaked closure nth 15:
Memory usage: 13.97 GB

create leaked closure nth 16:
Memory usage: 14.90 GB

RangeError: Array buffer allocation failed
app crashed
 */