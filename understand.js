var person = {
    hello: "Hello",
    sayHello: function() {
        console.log(this);
    }
}

module.exports = person.sayHello;