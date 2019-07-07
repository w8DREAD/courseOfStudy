let someProduct =
    {
      name: ['car', 'bike', 'track', 'scooter', 'ship', 'bus', 'helicopter', 'airplane'],
      price: [100, 200, 300, 400, 500]
    }
let randName = randomProduct(someProduct.name)
let randPrice = randomProduct(someProduct.price)
let count = 0
let line

let Product = function (name, price) {
  this.name = name
  this.price = price
}

let Producer = function (name, min = 50, max = 150) {
  this.name = name
  this.produced = []
  this.storage = []
  this.product = []
  this.minСapacity = min
  this.maxCapacity = max
}

Producer.prototype.generateProduct = function (name = randName, price = randPrice, n = 1) {
  randName = randomProduct(someProduct.name)
  randPrice = randomProduct(someProduct.price)
  if (n != 1) {
    return this.product.push(new Product(randName, randPrice)) + this.generateProduct(name, price, (n - 1))
  } else {
    return this.product.push(new Product(name, price))
  }
}

Producer.prototype.createProducts = function () {
  return this.produced.push(randomRange(this.minСapacity, this.maxCapacity))
}

Producer.prototype.sumLast3days = function (n = undefined) {
  return sum(this.produced, n)
}

let User = function (name, min = 70, max = 120) {
  this.name = name
  this.storage = []
  this.need = []
  this.minСapacity = min
  this.maxCapacity = max
}

User.prototype.createNeeds = function () {
  return this.need.push(randomRange(this.minСapacity, this.maxCapacity))
}

let Agent = function (name, capacity = 100) {
  this.name = name
  this.capacity = capacity
  this.deliveryForUsers = []
}

Agent.prototype.delivery = function (from, where, arr) {
  let temp = from.produced[arr]
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

Agent.prototype.sumLast3days = function (n = undefined) {
  return sum(this.deliveryForUsers, n)
}

let factory = new Producer('Bolshivichka')
let user = new User('People')
let agent = new Agent('Smith')

function randomRange (min, max) {
  return Math.round(Math.random() * (max - min) + min)
}

function randomProduct (arg) {
  return arg[Math.round(Math.random() * (arg.length - 1))]
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
  let table = document.createElement('table')
  let i = 0

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
