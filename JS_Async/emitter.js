const EventEmitter = require('events')
const util = require("util");
let emitter = new EventEmitter()
let eventName = 'greet'
let eventName2 = 'great'

emitter.on(eventName, function () {
  console.log('Hello all!')
})

emitter.on(eventName2, function () {
  console.log('Привет!')
})


function Log() {

}

util.inherits(Log, EventEmitter)



let log = new Log();

