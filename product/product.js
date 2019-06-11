var someProduct =
    {
  name: ['car', 'bike', 'track', 'scooter', 'ship', 'bus', 'helicopter', 'airplane'],
  price: [100, 200, 300, 400, 500]
    },
    randName = randomProduct(someProduct.name),
    randPrice = randomProduct(someProduct.price),
    count = 0,
    line;

class Product {

    constructor (name, price) {
    this.name = name;
    this.price = price;
    }
}

class  Producer {

    constructor(name) {
        this.name = name;
        this.produced = [];
        this.storage = [];
        this.product = [];
    }

    generateProduct(name = randName, price = randPrice, n = 1) {
        randName = randomProduct(someProduct.name),
            randPrice = randomProduct(someProduct.price);
        if (n != 1) {
            return this.product.push(new Product(randName, randPrice)) + this.generateProduct(name, price, (n - 1))
        } else {
            return this.product.push(new Product(name, price));
        }
    }

    createProducts(min = 50, max = 150) {
        return this.produced.push(randomRange(min, max))

    }

    sumLast3days(n = undefined) {
        let arr = this.produced.slice(0, n);
        let result = arr.reverse().slice(0, 3);
        return  result.reduce(function(sum, current) {
            return sum + current;
        }, 0);
    };
}

class User {

    constructor (name) {
        this.name = name;
        this.storage = [];
        this.need = [];
    }
    createNeeds (min = 70, max = 120) {
        return this.need.push(randomRange(min, max))
    }
}

class Agent {
    constructor(name, capacity = 100) {
        this.name = name;
        this.capacity = capacity;
        this.deliveryForUsers = [];
    }

    delivery(from, where, arr) {

        var temp = from.produced[arr];
        switch (true) {
            case temp >= this.capacity && this.capacity <= where.need[arr]: {
                this.deliveryForUsers.push(this.capacity);
                where.storage.push(this.deliveryForUsers[arr]);
                from.storage.push(temp - this.deliveryForUsers[arr]);
                break;
            }
            case temp >= this.capacity && this.capacity > where.need[arr]: {
                this.deliveryForUsers.push(where.need[arr]);
                where.storage.push(this.deliveryForUsers[arr]);
                from.storage.push(temp - this.deliveryForUsers[arr]);
                break;
            }
            case temp < this.capacity && temp >= where.need[arr]: {
                this.deliveryForUsers.push(where.need[arr]);
                where.storage.push(this.deliveryForUsers[arr]);
                from.storage.push(temp - this.deliveryForUsers[arr]);
                break;
            }
            case temp < this.capacity && temp < where.need[arr]: {
                this.deliveryForUsers.push(temp);
                where.storage.push(this.deliveryForUsers[arr]);
                from.storage.push(temp - this.deliveryForUsers[arr]);
                break;
            }
        }
    }

    sumLast3days(n = undefined) {
        let arr = this.deliveryForUsers.slice(0, n);
        let result = arr.reverse().slice(0, 3);
        return  result.reduce(function(sum, current) {
            return sum + current;
        }, 0);
    };

};

var factory = new Producer('Maksim'),
    user = new User('People'),
    agent = new Agent('Smith');



function randomRange(min, max) {
    return Math.round(Math.random() * (max - min) + min)
}

function randomProduct(arg) {
    return arg[Math.round(Math.random()*(arg.length - 1))]
}

function workingDay(days = 1) {
    if (days != 1) {
        factory.createProducts();
        user.createNeeds();
        agent.delivery(factory, user, count);
        count++;
        workingDay(days - 1)
    } else {
        factory.createProducts();
        user.createNeeds();
        agent.delivery(factory, user, count);
    }
}


function createTable(arg) {

    var table = document.createElement('table'),
        i = 0;

    table.innerHTML = '<tr><th>Количество товара у производителя</th><th>Количество необходимого потребителю товара</th>' +
        '<th>Количество доставленного товара за день</th><th>Количество произведенного товара за последние 3 дня</th>' +
        '<th>Количество доставленного товара за последние 3 дня</th><th>КПД посредника</th></tr>';
    document.body.appendChild(table);

    workingDay(arg);

    while (i < arg) {

        line = `<tr><td>${factory.produced[i]}</td><td>${user.need[i]}</td><td>${agent.deliveryForUsers[i]}</td><td>${factory.sumLast3days(i)}</td>` +
            `<td>${agent.sumLast3days(i)}</td><td>${(agent.deliveryForUsers[i] / factory.produced[i] * 100).toFixed(2)}%</td></tr>`;
        table.insertAdjacentHTML("beforeend", line);
        i++;

    }
};

createTable(10);