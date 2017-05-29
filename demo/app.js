var contentEl = document.querySelector('.content');
var println = (val) => {
    contentEl.innerHTML += `${val}<br/>`; 
}; 

//------------------------------------------------

//Rx.Observable.of(1,2,3)
    //.subscribe((x) => println(x));

//------------------------------------------------

var source = Rx.Observable.create(function (observer) {
  // Yield a single value and complete
  observer.onNext(42);
  observer.onCompleted();

  // Any cleanup logic might go here
  return function () {
    println('disposed');
  }
});

var subscription = source.subscribe(
  function (x) { println(`onNext: ${x}`); },
  function (e) { println(`onError: ${e}`); },
  function () { println('onCompleted'); });

// => onNext: 42
// => onCompleted

subscription.dispose();
// => disposed


