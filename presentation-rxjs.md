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

RxJS is the JavaScript implementation of Reactive Extensions, or ReactiveX. Reactive extensions are something that have come out of the Microsoft's lab, but despite that they are powerful and popular and are gaining traction within the Angular and React communities. RxJS provides a way to manage asynchronous and event-based sources through the transformation of streams.

You've all seen code like this

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

If you've worked with iterable functions like map reduce, then you already know the syntax, but there's a hidden but important difference between iterable functions and RxJS, where arrays and iterables are operated on in a pull mode