const EventEmitter = require('events')
const emitter = new EventEmitter()
const sinon = require('sinon')
const spy = sinon.spy()

let method = eventName => {
  emitter.emit(eventName)
}

emitter.on('Hi', () => {
  spy(console.log('Hello'))
})
emitter.on('How are you', () => {
  spy(console.log('Iam fine, thank you'))
})
emitter.on('What are you doing', () => {
  spy(console.log('Iam learning javascript'))
})

class Greeting extends EventEmitter {
  constructor (eventName) {
    super()
    this.eventName = eventName
  }
  answer () {
    this.emit(this.eventName)
  }
}

const hi = new Greeting('Hi')
hi.on(this.eventName, () => {
  console.log('Hello')
})

const how = new Greeting('How are you')
how.on(this.eventName, () => {
  console.log('Iam fine, thank you')
})

const what = new Greeting('What are you doing')
what.on(this.eventName, () => {
  spy(console.log('Iam learning javascript'))
})

module.exports = { method: method, hi: hi, how: how, what: what }
