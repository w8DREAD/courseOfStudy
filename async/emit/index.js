const EventEmitter = require('events')
const emitter = new EventEmitter()
const sinon = require('sinon')

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
hi.on('Hi', () => {
  console.log('Hello')
})

const how = new Greeting('How are you')
how.on('How are you', () => {
  console.log('Iam fine, thank you')
})

const what = new Greeting('What are you doing')
what.on('What are you doing', () => {
  console.log('Iam learning javascript')
})

module.exports = {hi: hi, how: how, what: what }
