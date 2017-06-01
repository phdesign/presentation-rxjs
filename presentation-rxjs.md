# Everything’s a stream. An introduction to RxJS and avoiding anti-patterns 


##Overview
To reactive extensions, everything's a stream. RxJS simplifies concurrent and async programming in JavaScript by producing and transforming immutable streams, allowing you to easily reason about the events. This talk will give an introduction to using RxJS including common anti-patterns and how to avoid them. 

## Outline

* Observables + Operators + Schedulers.
* Does it replace Promises?
* Hot vs. cold observables
* Marble diagrams
* Pushing vs. Pulling Data
* Useful in JavaScript in UI events or back-end communication



DDD by Night: 10 Min

Web Directions Code: 20 Min

## Content

RxJS is the JavaScript implementation of Reactive Extensions, or ReactiveX. Reactive extensions are something that have come out of the Microsoft's lab, but despite that they are powerful and popular and are gaining traction within the Angular and React communities. RxJS provides a way to manage asynchronous and event-based sources through the transformation of streams (called Observables).

If you've worked with iterable functions like map reduce, then you already know the syntax. Take for example this ES6 code

```
getDataFromNetwork()
  .filter(s => s != null)
  .map(s => s + 'transformed')
  .forEach(s => console.log(`next => ${s}`))
```

Well the same code in RxJS looks like this

```
getDataFromNetwork()
  .filter(s => s != null)
  .map(s => s + 'transformed')
  .subscribe(s => console.log(`next => ${s}`))
```

**Push vs. Pull**

From the cover there seems to be no difference, the important difference comes in how the items are processed. In normal imperative programming our code will execute the forEach callback for every item in source, blocking while it processes the item and calling next when done to get the next item. In the reactive programming style of RxJS we setup Observers to be called every time a new item arrives from the source, it's a push model rather than a pull model. Reactive extensions takes reactive programming and adds a bunch of helper methods to make it easy to work with.

**Observable + Operations + Observer + Scheduler = RxJS**

The basic concepts of RxJS can be summed up as "An Observable is transformed by Operations and subscribed to by an Observer on a Scheduler"

An Observable is an RxJS stream of messages, and a simple Observable looks like this

```
var source = Rx.Observable.create(function (observer) {
  // Yield a single value and complete
  observer.onNext(42);
  observer.onCompleted();

  // Any cleanup logic might go here
  return function () {
    console.log('disposed');
  }
});
```

However there is rarely ever a need to use such verbose code as RxJS provides extensions to easily create Observables from a number of sources. For example, we can create an Observable from a JavaScript event using the fromEvent factory

```
var result = document.getElementById('result');

var source = Rx.Observable.fromEvent(document, 'mousemove');

var subscription = source.subscribe(function (e) {
  result.innerHTML = e.clientX + ', ' + e.clientY;
});
```

RxJS is also aware of common frameworks like jQuery, Zepto.js, AngularJS, Ember.js and Backbone.js and can create Observables from their event handlers, like this jQuery example

```
var $result = $('#result');
var $sources = $('div');

var source = Rx.Observable.fromEvent($sources, 'click');

var subscription = source.subscribe(function (e) {
  $result.html(e.clientX + ', ' + e.clientY);
});
```

**Promises are first class citizens**

The majority of RxJS can used Promises and observables interchangeably, for example 

```
var source = Rx.Observable.range(0, 3)
  .flatMap(function (x) { return Promise.resolve(x * x); });

var subscription = source.subscribe(
  function (x) { console.log('onNext: %s', x); },
  function (e) { console.log('onError: %s', e); },
  function () { console.log('onCompleted'); });
```

Alternatively we can create an Observable from a Promise

```
var source1 = Rx.Observable.fromPromise(promise1);

var subscription1 = source1.subscribe(
  function (x) { console.log('onNext: %s', x); },
  function (e) { console.log('onError: %s', e); },
  function () { console.log('onCompleted'); });
```

Or we can convert the other way from an Observable to a Promise

```
var source1 = Rx.Observable.just(1).toPromise();

source1.then(
  function (value) {
    console.log('Resolved value: %s', value);
  },
  function (reason) {
    console.log('Rejected reason: %s', reason);
  });

```

