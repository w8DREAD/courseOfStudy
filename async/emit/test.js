const assert = require('assert')
const sinon = require('sinon')
const events = require('./index')
const EventEmitter = require('events')
const emitter = new EventEmitter()

const spy = sinon.spy(console, "log")

describe('EventEmmitter', () => {
  it('Console.log вызывается с аргументом "Hello"', () => {
    events.hi.answer()
    assert(spy.calledWith('Hello'))
  })
  it('Console.log вызывается с аргументом "Iam fine, thank you"', () => {
    events.how.answer()
    assert(spy.calledWith('Iam fine, thank you'))
  })
  it('Console.log вызывается с аргументом "Hello"', () => {
    events.what.answer()
    assert(spy.calledWith('Iam learning javascript'))
  })
})
