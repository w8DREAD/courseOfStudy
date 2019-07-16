const chai = require('chai')
const sinon = require('sinon')
const method = require('./index')
const EventEmitter = require('events')
const emitter = new EventEmitter()

const spy = sinon.spy()

describe('EventEmmitter', () => {
  it('Вызывает ли событие', () => {
    method('What are you doing')
    chai.assert(spy.called)
  })
})
