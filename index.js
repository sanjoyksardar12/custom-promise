var PENDING = 0;
var FULFILLED = 1;
var REJECTED = 2;


function getThen(value) {
  console.log("in get then", value);
  var t = typeof value;
  if (value && (t === "object" || t === "function")) {
    var then = value.then;
    if (typeof then === "function") {
      return then;
    }
  }
  return null;
}

function doResolve(fn, onFulfilled, onRejected) {
  var done = false;
  try {
    fn(function (value) {
      if (done) return;
      done = true;
      onFulfilled(value);
    }, function (reason) {
      if (done) return;
      done = true;
      onRejected(reason)
    })
  } catch (ex) {
    if (done) return;
    done = true;
    onRejected(ex);
  }
}


function CustomPromise(fn) {
  var state = PENDING;
  var value = null;
  var handlers = []; //success or failure handlers attached by calling .then or .done


  function fulfill(result) {

    console.log('fulfilling...');
    state = FULFILLED;
    value = result;
    //
    handlers.forEach(handle);
    handlers = null;
  }

  function reject(error) {
    state = REJECTED;
    value = error;
    //
    handlers.forEach(handle);
    handlers = null;
  }

  function resolve(result) {
    try {

      var then = getThen(result);
      if (then) {
        doResolve(then.bind(result), resolve, reject);
        return;
      }
      fulfill(result);
    } catch (e) {
      reject(e);
    }
  }
  function handle(handler) {
    if (state === PENDING) {
      handlers.push(handler);
      console.log("pushing into handlers", handlers);
    } else {
      if (state === FULFILLED && typeof handler.onFulfilled === "function") {
        handler.onFulfilled(value);
      }
      if (state === REJECTED && typeof handler.onRejected === "function") {
        handler.onRejected(value);
      }
    }
  }

  this.done = function (onFulfilled, onRejected) {

    setTimeout(function () {

      handle({
        onFulfilled: onFulfilled,
        onRejected: onRejected
      })
    }, 0);
  }

  // this.then = function(onFulfilled, onRejected){
  //   var self = this;
  //   return new CustomPromise(function(resolve, reject){
  //     return self.done(function(result){
  //       if(typeof onFulfilled === "function"){
  //         try{
  //           return resolve(onFulfilled(result));
  //         }catch(ex){
  //           return reject(ex);
  //         }
  //       }else{
  //         return resolve(result);
  //       }
  //     }, function(error){
  //       if(typeof onRejected === "function"){
  //         try{
  //           resolve(onRejected(error))
  //         }catch(ex){
  //           return reject(ex);
  //         }
  //       }else{
  //         reject(error);
  //       }
  //     })
  //   })
  // }

  this.then = function (onFulfilled, onRejected) {
    var self = this;

    return new CustomPromise(function (resolve, reject) {

      self.done(function (result) {
        resolve(onFulfilled(result));
      }, function (error) {
        reject(onRejected(error));
      });

    });
  }

  doResolve(fn, resolve, reject);
}

var p1 = new CustomPromise(function (resolve, reject) {
  setTimeout(function () {
    resolve('foo');
  }, 3000);
});
p1
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

 //# sourceURL=snippet:///promise-implementation.js
