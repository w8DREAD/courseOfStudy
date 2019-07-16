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

module.exports = method
