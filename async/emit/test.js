const assert = require('assert')
const sinon = require('sinon')
const event = require('./index')
const EventEmitter = require('events')
const emitter = new EventEmitter()

const spy = sinon.spy()

emitter.on('Hi', () => {
  spy(console.log('Hello'))
})

describe('EventEmmitter', () => {
  it('Вызывает ли событие', () => {
    event.hi.answer()
    assert(spy.called)
  })
})
