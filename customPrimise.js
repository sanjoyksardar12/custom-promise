var PENDING = 0;
var FULFILLED =1;
var REJECTED = 2;

function getThen(value){
    var t = typeof value;
    if(value && (t === "obejct" || t === "fucntion")){
        var then = value.then;
        if(typeof then === "function"){
            return then;
        }
    }
    return null;
}


function CustomPromise(){
    var state = PENDING;
    var value = null;
    var handlers = [];

    function fulfill(result){
        state = FULFILLED;
        value = result;
    }

    function reject(error){
        state = REJECTED;
        value = error
    }

    function resolve(result){
        try{
            var then = getThen(result);
            if(then){
                doResolve(then.bind(result), resolve, reject);
                return;
            }
            fulfill(result);
        }catch(error){
            reject(error);
        }
    }


}