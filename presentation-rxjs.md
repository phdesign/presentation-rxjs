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

However there is rarely ever a need to use such verbose code as RxJS provides extensions to easily create Observables from a number of sources.