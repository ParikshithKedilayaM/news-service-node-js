const events = require('events');
const fs = require('fs');

function Logger() {
    this.logs = "";

    events.EventEmitter.call(this);

    this.log = (message) => {
        this.logs += message + '\n';
    }
    this.on('userLogin', (message) => {
        this.log(`${new Date()} | ${message.ip} | INFO | User logged in: ${message.username}`);
    });

    this.on('userLogout', (message) => {
        this.log(`${new Date()} | ${message.ip} | INFO | User logged out: ${message.username}`);
    });

    this.on('userLoginFailed', (message) => {
        this.log(`${new Date()} | ${message.ip} | INFO | Failed login attempt: ${message.username}`);
    });

    this.on('errorOccured', (message) => {
        this.log(`${new Date()} | ${message.ip} | ERROR | Request failed for: ${message.username} \n ${message.error}`);
    });

    setInterval(() => {
        this.logs !== "" && this.writeFile(this.logs);
        this.logs = "";
    }, 5000);

    this.writeFile = (data) => {
        var options = {encoding:'utf8', flag:'a'};
        fs.writeFileSync('./activity2.log', data, options);
    }
}

Logger.prototype.__proto__ = events.EventEmitter.prototype;

module.exports = Logger;