var PENDING = 0;
var FULFILLED = 1;
var REJECTED = 2;

function doResolve(fn, resolve, reject){

}


function CustomPromise(fn){
  var state = PENDING;
  var value = null;
  var handlers = [];

  function fulfill(result){
    value = result;
    state = FULFILLED;
  }
  function reject(error){
    value = error;
    state = PENDING;
  }

  doResolve(fn, fulfill, reject);
}