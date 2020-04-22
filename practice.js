const PENDING ="pending";
const RESOLVED = "resolve";
const REJECT ="reject";

var order = 0;
function doResolves(func, resolve, reject) {

  try{
    func((value)=>{
      console.log("doresolve", value);
      resolve(value)
    }, (error)=>{
      reject(error)
    } );
  }catch(err){
    reject(err);
  }

}

function CustomPromise(func){
  var state = PENDING;
  var data;
  var listeners = [];

  function resolve(result){

    console.log("updating data", result);
    data = result;
    state = RESOLVED;
    listeners.forEach(handle);
    listeners = []
  }
  function reject(error){
    state = REJECT;
    data = error;
    listeners.forEach(handle);
    listeners = [];
  }




  function handle(handler){
debugger
    if(state === PENDING){
      listeners.push(handler);
    }else if(state === RESOLVED){
      handler.onFulfilled(data);
    }else{
      handler.onRejected(data);
    }
  }

  this.done = function(onFulfilled, onRejected){
    setTimeout(() => {
      handle({onFulfilled, onRejected});
    }, 0);
  }

  this.then = function(onFulfilled, onRejected){
    const self = this; //holding previous instance references for accessing data
    return new CustomPromise(function(resolve, reject){
      // this.done(onResolve, onReject)

      console.log("order ===", order++);
      self.done(function(data){

        resolve(onFulfilled(data));
      }, function(error){
        reject(onRejected(error));
      })
    })
  }
  doResolves(func, resolve, reject);
}


var promise = new CustomPromise(function(resolve, reject){
  console.log(1);
  setTimeout(() => {
    reject("got some error");
  }, 3000);
})
.then(function(data){
  console.log(data);
  return data + 1;
}, function(error){
  console.log(error);
})

.then(function(data){
  console.log(data);
  return data + 1;
}, function(error){
  console.log(error);

})

.then(function(data){
  console.log(data);
  return data + 1;
}, function(error){
  console.log(error);

})

.then(function(data){
  console.log(data);
  return data + 1;
}, function(error){
  console.log(error);

})

//considering then will have two function

// 1. simple Promise constructor with simple doPresolve
// 2. maintain chaining
// 3. call next promise in the chain
