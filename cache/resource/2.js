console.log('2.js');

function createStudent(...args) {
    let [name, age, sex] = args
    return function () {
        console.log(`${name}, ${age}, ${sex}`)
    }
}


let f = createStudent('cc', 28, '男');

f()