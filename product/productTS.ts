let count: number = 0
let line: string = 'string'

class ProductTS {
    name: string
    price: number
    constructor (name: string, price: number) {
    this.name = name
    this.price = price
  }
}

class Producer {

    name: string
    produced: number[]
    storage: number[]
    product: number[]
    minСapacity: number
    maxCapacity: number
  constructor (name: string, min: number = 50, max: number = 150) {
    this.name = name
    this.produced = []
    this.storage = []
    this.product = []
    this.minСapacity = min
    this.maxCapacity = max
  }

  createProducts () {
    return this.produced.push(randomRange(this.minСapacity, this.maxCapacity))
  }

  sumLast3days (n = undefined) {
    return sum(this.produced, n)
  };
}


class User {
    name: string
    storage: number[]
    need: number[]
    minСapacity: number
    maxCapacity: number
  constructor (name, min = 70, max = 120) {
    this.name = name
    this.storage = []
    this.need = []
    this.minСapacity = min
    this.maxCapacity = max
  }
  createNeeds () {
    return this.need.push(randomRange(this.minСapacity, this.maxCapacity))
  }
}

class Agent {
    name: string
    capacity: number
    deliveryForUsers: number[]
  constructor (name: string, capacity: number = 100) {
    this.name = name
    this.capacity = capacity
    this.deliveryForUsers = []
  }

  delivery (from, where, arr): void {
    let temp: number = from.produced[arr]
    if (from.storage.length != 0) {
      temp = from.produced[arr] + from.storage[arr - 1]
    }
    if (temp >= this.capacity && this.capacity <= where.need[arr]) {
      this.deliveryForUsers.push(this.capacity)
      where.storage.push(this.deliveryForUsers[arr])
      from.storage.push(temp - this.deliveryForUsers[arr])
    }
    if (temp >= this.capacity && this.capacity > where.need[arr]) {
      this.deliveryForUsers.push(where.need[arr])
      where.storage.push(this.deliveryForUsers[arr])
      from.storage.push(temp - this.deliveryForUsers[arr])
    }
    if (temp < this.capacity && temp >= where.need[arr]) {
      this.deliveryForUsers.push(where.need[arr])
      where.storage.push(this.deliveryForUsers[arr])
      from.storage.push(temp - this.deliveryForUsers[arr])
    }
    if (temp < this.capacity && temp < where.need[arr]) {
      this.deliveryForUsers.push(temp)
      where.storage.push(this.deliveryForUsers[arr])
      from.storage.push(temp - this.deliveryForUsers[arr])
    }
  }

  sumLast3days (n = undefined) {
    return sum(this.deliveryForUsers, n)
  }
}

let factory = new Producer('Bolshivichka')
let user = new User('People')
let agent = new Agent('Smith')

function randomRange (min, max) {
    return Math.round(Math.random() * (max - min) + min)
}

function workingDay (days = 1) {
    factory.createProducts()
    user.createNeeds()
    agent.delivery(factory, user, count)
    if (days != 1) {
        count++
        workingDay(days - 1)
    }
}

function sum (report, n) {
    let arr = report.slice(0, n + 1)
    let result = arr.reverse().slice(0, 3)
    return result.reduce(function (sum, current) {
        return sum + current
    }, 0)
}

function createTable (arg) {
    let table: HTMLElement = document.createElement('table')
    let i: number = 0

    table.innerHTML = '<tr><th>Количество товара у производителя</th><th>Количество необходимого потребителю товара</th>' +
        '<th>Количество доставленного товара за день</th><th>Количество произведенного товара за последние 3 дня</th>' +
        '<th>Количество доставленного товара за последние 3 дня</th><th>КПД посредника</th></tr>'
    document.body.appendChild(table)

    workingDay(arg)

    while (i < arg) {
        line = `<tr><td>${factory.produced[i]}</td><td>${user.need[i]}</td><td>${agent.deliveryForUsers[i]}</td><td>${factory.sumLast3days(i)}</td>` +
            `<td>${agent.sumLast3days(i)}</td><td>${(agent.deliveryForUsers[i] / factory.produced[i] * 100).toFixed(2)}%</td></tr>`
        table.insertAdjacentHTML('beforeend', line)
        i++
    }
};

createTable(50)
