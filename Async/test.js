let assert = require('mocha')
let chai = require('chai')
let EventEmitter = require('events')
let emitter = new EventEmitter()
let sinon = require('sinon')

let spy = sinon.spy()
let event = 'Hi'

emitter.on('test', () => {
  spy()
})

describe('EventEmmitter', () => {
  it('Вызывает ли событие', () => {
    emitter.emit('test')
    chai.assert(spy.called)
  })
})

