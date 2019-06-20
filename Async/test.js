let assert = require('mocha')
let chai = require('chai')
let EventEmitter = require('events')
let emitter = new EventEmitter()

describe('EventEmmitter Hi!', () => {
  it('Выводит ли обработчик нужное нам сообщение', () => {
    chai.assert.isString()
  })
})
