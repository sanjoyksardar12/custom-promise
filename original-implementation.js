var PENDING = "pending";
var FULFILLED = "fulfilled";
var REJECTED = "rejected";


function getThen(value){
  var t = typeof value;
  if(value && (t === "object" || t=== "function")){
    var then = value.then;
    if(typeof then === "function"){
      return then;
    }
  }
  return null;
}

function doResolve(fn, resolve, reject) {
  var done = false;
  try{
    fn(function (value) {
      if(done) return;
      done = true;
      resolve(value)
    }, function (error) {
      if(done) return;
      done = true;
      reject(error);
    })
  }catch(err){
    if(done) return ;
    done = true;
    reject(err);
  }
}

function CustomPromise(fn){
  var state = PENDING;
  var value = null;
  var handlers = [];

  function fulfilled(result){
    state = FULFILLED;
    value = result;
    handlers.forEach(handle);
    handlers = null;
  }

  function reject(error){
    state = REJECTED;
    value = error;
    handlers.forEach(handle);
    handlers = null;
  }
  function resolve (result) {
    try{
      var then = getThen(result);
      if(then){
        doResolve(then.bind(result), resolve, reject);
        return
      }
      fulfilled(result);
    }catch(e){
      reject(e);
    }
  }

  function handle(handler) {
    if(state === PENDING){
      handlers.push(handler)
    }else{
      if(state === FULFILLED && typeof handler.onFulfilled === "function"){
        handler.onFulfilled(value);
      }
      if(state == REJECTED && typeof handlers.onRejected === "function"){
        handler.onRejected(value);
      }
    }
  }

  this.done = function (onFulfilled, onRejected) {
    setTimeout(() => {
      handle({
        onFulfilled: onFulfilled,
        onRejected: onRejected
      })
    }, 0);
  }
  this.then = function (onfulfilled, onRejecrted) {
    var self = this;
    return new CustomPromise(function (resolve, reject) {
      self.done(function (result) {
        resolve(onfulfilled(result))
      }, function (error) {
        reject(onRejecrted(error));
      })
    })
  }
  doResolve(fn, resolve, reject);
}


var p1 = new CustomPromise(function (resolve, reject) {
  setTimeout(function () {
    resolve('foo');
  }, 3000);
})
.then((d) => {
    console.log("then 1", d + 1);
    return d + 1;
  }, (e) => {
    console.log("error 1", e + 1);
  })
  .then((d) => {
    console.log("then 2", d + 2);
    return d + 2;
  }, (e) => {
    console.log("error 2", e + 2);
  })
  .then((d) => {
    console.log("then 3", d + 3);
    return d + 2;
  }, (e) => {
    console.log("error 3", e + 3);
  })
  .then((d) => {
    console.log("then 1", d + 1);
    return d + 1;
  }, (e) => {
    console.log("error 1", e + 1);
  })
  .then((d) => {
    console.log("then 2", d + 2);
    return d + 2;
  }, (e) => {
    console.log("error 2", e + 2);
  })
  .then((d) => {
    console.log("then 3", d + 3);
    return d + 2;
  }, (e) => {
    console.log("error 3", e + 3);
  })

