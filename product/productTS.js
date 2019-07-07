var count = 0;
var line = 'string';
var ProductTS = /** @class */ (function () {
    function ProductTS(name, price) {
        this.name = name;
        this.price = price;
    }
    return ProductTS;
}());
var Producer = /** @class */ (function () {
    function Producer(name, min, max) {
        if (min === void 0) { min = 50; }
        if (max === void 0) { max = 150; }
        this.name = name;
        this.produced = [];
        this.storage = [];
        this.product = [];
        this.minСapacity = min;
        this.maxCapacity = max;
    }
    Producer.prototype.createProducts = function () {
        return this.produced.push(randomRange(this.minСapacity, this.maxCapacity));
    };
    Producer.prototype.sumLast3days = function (n) {
        if (n === void 0) { n = undefined; }
        return sum(this.produced, n);
    };
    ;
    return Producer;
}());
var User = /** @class */ (function () {
    function User(name, min, max) {
        if (min === void 0) { min = 70; }
        if (max === void 0) { max = 120; }
        this.name = name;
        this.storage = [];
        this.need = [];
        this.minСapacity = min;
        this.maxCapacity = max;
    }
    User.prototype.createNeeds = function () {
        return this.need.push(randomRange(this.minСapacity, this.maxCapacity));
    };
    return User;
}());
var Agent = /** @class */ (function () {
    function Agent(name, capacity) {
        if (capacity === void 0) { capacity = 100; }
        this.name = name;
        this.capacity = capacity;
        this.deliveryForUsers = [];
    }
    Agent.prototype.delivery = function (from, where, arr) {
        var temp = from.produced[arr];
        if (from.storage.length != 0) {
            temp = from.produced[arr] + from.storage[arr - 1];
        }
        if (temp >= this.capacity && this.capacity <= where.need[arr]) {
            this.deliveryForUsers.push(this.capacity);
            where.storage.push(this.deliveryForUsers[arr]);
            from.storage.push(temp - this.deliveryForUsers[arr]);
        }
        if (temp >= this.capacity && this.capacity > where.need[arr]) {
            this.deliveryForUsers.push(where.need[arr]);
            where.storage.push(this.deliveryForUsers[arr]);
            from.storage.push(temp - this.deliveryForUsers[arr]);
        }
        if (temp < this.capacity && temp >= where.need[arr]) {
            this.deliveryForUsers.push(where.need[arr]);
            where.storage.push(this.deliveryForUsers[arr]);
            from.storage.push(temp - this.deliveryForUsers[arr]);
        }
        if (temp < this.capacity && temp < where.need[arr]) {
            this.deliveryForUsers.push(temp);
            where.storage.push(this.deliveryForUsers[arr]);
            from.storage.push(temp - this.deliveryForUsers[arr]);
        }
    };
    Agent.prototype.sumLast3days = function (n) {
        if (n === void 0) { n = undefined; }
        return sum(this.deliveryForUsers, n);
    };
    return Agent;
}());
var factory = new Producer('Bolshivichka');
var user = new User('People');
var agent = new Agent('Smith');
function randomRange(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}
function workingDay(days) {
    if (days === void 0) { days = 1; }
    factory.createProducts();
    user.createNeeds();
    agent.delivery(factory, user, count);
    if (days != 1) {
        count++;
        workingDay(days - 1);
    }
}
function sum(report, n) {
    var arr = report.slice(0, n + 1);
    var result = arr.reverse().slice(0, 3);
    return result.reduce(function (sum, current) {
        return sum + current;
    }, 0);
}
function createTable(arg) {
    var table = document.createElement('table');
    var i = 0;
    table.innerHTML = '<tr><th>Количество товара у производителя</th><th>Количество необходимого потребителю товара</th>' +
        '<th>Количество доставленного товара за день</th><th>Количество произведенного товара за последние 3 дня</th>' +
        '<th>Количество доставленного товара за последние 3 дня</th><th>КПД посредника</th></tr>';
    document.body.appendChild(table);
    workingDay(arg);
    while (i < arg) {
        line = "<tr><td>" + factory.produced[i] + "</td><td>" + user.need[i] + "</td><td>" + agent.deliveryForUsers[i] + "</td><td>" + factory.sumLast3days(i) + "</td>" +
            ("<td>" + agent.sumLast3days(i) + "</td><td>" + (agent.deliveryForUsers[i] / factory.produced[i] * 100).toFixed(2) + "%</td></tr>");
        table.insertAdjacentHTML('beforeend', line);
        i++;
    }
}
;
createTable(50);
