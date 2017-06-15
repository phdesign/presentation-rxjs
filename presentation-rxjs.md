# Everything’s a stream. An introduction to RxJS and avoiding anti-patterns 


##Overview
To reactive extensions, everything's a stream. RxJS simplifies concurrent and async programming in JavaScript by producing and transforming immutable streams, allowing you to easily reason about the events. This talk will give an introduction to using RxJS including common anti-patterns and how to avoid them. 

## Outline

* Introduction
* Push vs. Pull
* Observable
* Subscribe
* Operators
* Multicasting
* Promises
* Schedulers
* Anti-patterns



DDD by Night: 10 Min

## Content

RxJS is the JavaScript implementation of Reactive Extensions which provide a way to manage asynchronous and event-based sources through the transformation of streams (called Observables). 

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

From the cover there seems to be no difference, the important difference comes in how the items are processed. In normal imperative programming our code will execute the forEach callback for every item in source, blocking while it processes the item and calling next when done to get the next item. In the reactive programming style of RxJS we setup Observers to be called every time a new item arrives from the source, it's a push model rather than a pull model. 

**Observable + Operations + Observer + Scheduler = RxJS**

The basic concepts of RxJS can be summed up as "An Observable is transformed by Operations and subscribed to by an Observer on a Scheduler"

An Observable is an RxJS stream of messages, and a simple Observable looks like this

```
var observable = Rx.Observable.create(function (observer) {
  observer.next(1);
  observer.next(2);
});
```

Which produces two values, 1 and 2. To act on this Observable you subscribe to receive it's values

```
var observable = Rx.Observable.create(function (observer) {
  observer.next(1);
  observer.next(2);
});
observable.subscribe(x => console.log(x));

// Output:
// 1
// 2
```

The Observable can also notify the subscriber that it's complete

```
var observable = Rx.Observable.create(function (observer) {
  observer.next(1);
  observer.next(2);
  observer.complete();
});
observable.subscribe(
  x => console.log("next -> " + x),
  x => console.log("complete"));

// Output:
// next -> 1
// next -> 2
// complete
```

And it's good practice to capture any exceptions and deliver an error notification to the subscriber

```
var observable = Rx.Observable.create(function (observer) {
  try {
    observer.next(1);
    observer.next(2);
    throw new Error("bang!")
    observer.complete();
  } catch (err) {
    observer.error(err);
  }
});
observable.subscribe(
  x => console.log("next -> " + x),
  x => console.log("complete"),
  x => console.log("error -> " + x);

// Output:
// next -> 42
// next -> 36
// error -> bang!
```

However there is rarely ever a need to use such verbose code for creating an Observable, as RxJS provides extensions to easily create Observables from a number of sources. For example, we can create an Observable from a JavaScript event using the fromEvent factory

```
var observable = Rx.Observable.fromEvent(document, 'mousemove');

observable.subscribe(e => console.log(e.clientX + ', ' + e.clientY));
```

RxJS is also aware of common frameworks like jQuery, Zepto.js, AngularJS, Ember.js and Backbone.js and can create Observables from their event handlers, like this jQuery example

```
var $sources = $('div');
var observable = Rx.Observable.fromEvent($sources, 'click');

observable.subscribe(e => console.log(e.clientX + ', ' + e.clientY));
```

There's a few more helpful creation extensions, like Interval which generates sequential numbers at a specified interval of time

```
var observable = Rx.Observable.interval(1000); // Every 1000ms

observable.subscribe(x => console.log(new Date().toTimeString() + ': ' + x));

// Output:
// 17:36:24 GMT+1000 (AEST): 1
// 17:36:25 GMT+1000 (AEST): 2
// 17:36:26 GMT+1000 (AEST): 3
// ...
```

Or range which emits a sequence of numbers within a specified range

```
var observable = Rx.Observable.range(1, 3);

observable.subscribe(x => console.log(x));

// Output:
// 1
// 2
// 3
```

Or the Swiss Army knife of Observable creations, from, which can accept an Array, an array-like object, a Promise, an iterable object, or an Observable-like object

```
var observable = Rx.Observable.from(['a', 'b', 'c']);

observable.subscribe(x => console.log(x));

// Output:
// a
// b
// c
```

**Subscribing to an Observable**

Subscribing to an Observable executes its evaluation, its like calling a function. In a typical function call we have a block of code that when we call, will evaluate and return a result.

```
function foo() {
  return Math.floor(Math.random() * 100);
}

var x = foo();
console.log(x);
var y = foo();
console.log(y);

// Output:
// 25
// 98
```

Well an Observable is very similar, we provide it with a function that will be lazy evaluated every time it is subscribed to

```
var foo = Rx.Observable.create(function (observer) {
  return Math.floor(Math.random() * 100);
});

foo.subscribe(function (x) {
  console.log(x);
});
foo.subscribe(function (y) {
  console.log(y);
});

// Output:
// 77
// 23
```

It's important to realise that an Observable is not an implementation of the Observable pattern, every subscriber causes a new value to be received, the Observable does not maintain a list of attached Observers. However it is possible to multicast an Observable to make it send the same value to all subscribers, we'll cover this a bit later. The difference between a function call and an Observable is that an Observable can emit multiple values, whereas a function can only emit a single value, unless it's a generator function like this

```
function* foo() {
  yield 1;
  yield 2;
}

for (var val of foo()) {
  console.log(val);
}

// Output:
// 1
// 2
```

The difference between a generator function and an Observable is that a generator function has its value pulled by the consumer, whereas an Observable pushes it's value to the consumer by calling the subscribe callback whenever a new value is ready.

**Operators**

Operators are the special sauce on top of Observables, they allow you to manipulate the Observable stream using chainable operators like map reduce functions. Operators never change the Observable instance but create a new Observable with the same behaviour has the last and manipulate that. Some common operators include map and filter (for you C#er's out there think SELECT, WHERE)

```
var observable = Rx.Observable.fromEvent(document, 'mousemove');

observable
  .map(e => e.clientX)
  .filter(x => x % 2 == 0)
  .subscribe(x => console.log(x));
```

one of the most commonly used operators is flatMap (also known as selectMany) which allows you to map values to generate new observables and then flatten those observables (using merge) into a single

```
var observable = Rx.Observable.range(0, 5);

observable
  .flatMap(x => Rx.Observable.range(0, x))
  .subscribe(x => console.log(x));
  
// Output
```



merge

scan

combine

zip

last

do

**Multicasting**







**Promises are first class citizens**

The majority of RxJS can use Promises and observables interchangeably, for example 

```
var source = Rx.Observable.range(0, 3)
  .flatMap(function (x) { return Promise.resolve(x * x); });

var subscription = source.subscribe(
  function (x) { console.log('next: %s', x); },
  function (e) { console.log('error: %s', e); },
  function () { console.log('completed'); });
```

Alternatively we can create an Observable from a Promise

```
var source1 = Rx.Observable.fromPromise(promise1);

var subscription1 = source1.subscribe(
  function (x) { console.log('next: %s', x); },
  function (e) { console.log('error: %s', e); },
  function () { console.log('completed'); });
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

**Schedulers**

**Common anti patterns**

Instead of subscribing multiple times to an iterator and evaluating the iterator multiple times, use publish and connect to evaluate it only once.

Event emitters vs. Reactive Extensions



## Take2

Reactive Extensions provide a way to manage streams of events and are available in almost every modern programming language, as well as spawning an MVVM framework for Xamarin and WPF. In this talk I'll focus on the JavaScript flavour of reactive extensions called RxJS which is gaining popularity especially with the Angular 2+ community. 

Reactive extensions are going to look very familiar to anyone who has used C# LINQ statements, which isn't a surprise as they originated out of Microsoft, but they should also be familiar to anyone whose used underscore / loads style map reduce functions in JavaScript. Here's an example of plain ES6 array manipulators

```
getDataFromNetwork()
  .filter(s => s != null)
  .map(s => s + 'transformed')
  .forEach(s => console.log(`next => ${s}`))
```

And very similar looking reactive extensions code

```
getDataFromNetwork()
  .filter(s => s != null)
  .map(s => s + 'transformed')
  .subscribe(s => console.log(`next => ${s}`))
```

On the surface they look very similar, but under the hood there's quite a difference going on. Typical iterators, arrays and lists work on a pull model, the consumer controls the flow by instantiating the iterator and calling next to receive the next item when it's ready to process it. Reactive extensions use a push model where the consumer subscribes to the Observable which pushes items to the consumer as soon as they are ready, in a way similar to promises where we configure a chain of operators that will manipulate the future result when it's available. Reactive extensions advertise themselves as the missing space in this matrix:

<pull vs push matrix>

The anatomy of a reactive extension looks like this, first we create an Observable from some sort of event emitter or list, we then manipulate the events and finally we subscribe an Observer to receive and do something with the events.