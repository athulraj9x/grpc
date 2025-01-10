function sayHello (call,callback){
    const userName = call.request.name
    const message = `hello, ${userName || 'workd'}`
    callback(null,{message})
}

module.exports = {sayHello}