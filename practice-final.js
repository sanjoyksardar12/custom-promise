var PENDING = "pending";
var RESOLVED = "resolved";
var REJECTED = "reject";

function doResolve(func, onFulfill, onReject) { //not more than once
  func(onFulfill, onReject);
}
function getThen(value) {
  const valueType = typeof value;
  if(value && (valueType === "function" || valueType === "object")){
    const then = value.then;
    if(typeof then === "function"){
      return then;
    }
  }
  return null;
}

function CustomPromise(func) {
  let result;
  let state = PENDING;
  let listeners = [];

  function onFulfilled(value){
    state = RESOLVED;
    result = value;

    listeners.forEach(handle);
    listeners = [];
  }

  function onFulfill(value) {
    const then = getThen(value);
    if(then){
      doResolve(then.bind(value), onFulfill, onReject);
      return;
    }
    onFulfilled(value);

  }

  function onReject(error){
    state = REJECTED;
    result = error;
    listeners.forEach(handle);
    listeners = [];
  }

  function handle(handler) {
    if(state === PENDING){
      listeners.push(handler);
    }else if(state === RESOLVED){
      handler.onSuccess(result); //accessing previous resolved/rejected data;
    }else{
      handler.onFailure(result);
    }
  }

  this.done = function (onSuccess, onFailure) {
    setTimeout(function () {
      handle({onSuccess, onFailure})
    }, 0)
  }
  this.then = function(onSuccess, onFailure){
    const self = this;
    return new CustomPromise(function(resolve, reject){
      self.done(function(){
        resolve(onSuccess(result))
      }, function (error) {
        reject(onFailure(error))
      });
    })
  }

  this.catch = function (onFailure) {
    this.then(undefined, onFailure )
  }

  doResolve(func, onFulfill, onReject);

}

const nestedChaining = function getInstance(data) {
  return new CustomPromise(function (resolve, reject) {
    console.log(data);
    setTimeout(() => {
      // resolve(data + 1);
          reject("something went wrong");
    }, 1000);
  })
}



var a = new CustomPromise(function (resolve, reject) {
  setTimeout(() => {
    resolve(1);
    // reject("something went wrong");
  }, 1000);
})
.then(function (data) {
  console.log(data);
  return nestedChaining(data + 1);
},function (err) {
  console.log(err);
  return err;
})
.then(function (data) {
  console.log(data);
  return data + 1;
},function (err) {
  console.log(err);
  return err;
})
.then(function (data) {
  console.log(data);
  return data + 1;
},function (err) {
  console.log(err);
  return err;
})
.then(function (data) {
  console.log(data);
  return data + 1;
},function (err) {
  console.log(err);
  return err;
})
.catch(function (err) {
  console.log("final error");
  return err;
})
;
