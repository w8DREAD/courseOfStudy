let assert = require('mocha')
let chai = require('chai')
let EventEmitter = require('events')
let emitter = new EventEmitter()
let sinon = require('sinon')

let spy = sinon.spy()
let eventHi = 'Hi'
let eventHow = 'How are you'
let eventDo = 'What are you doing'

emitter.on('test', () => {
  spy()
})

describe('EventEmmitter', () => {
  it('Вызывает ли событие', () => {
    emitter.emit('test')
    chai.assert(spy.called)
  })
})

emitter.on('Hi', () => {
  console.log('Hello')
})
emitter.on('How are you', () => {
  console.log('Iam fine, thank you')
})
emitter.on('What are you doing', () => {
  console.log('Iam learning javascript')
})

emitter.emit(eventHi)
emitter.emit(eventHow)
emitter.emit(eventDo)
