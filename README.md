**swiper**, no swiping!

## recipes/foo.js -- conf

### root
*root* is the endpoint that swiper begins crawling

### next
*next* recursively describes how to crawl one-step closer to the PDP; this object has two common actions
+ `select` is a CSS selector the identifies links that, when followed, will bring you one step closer to landing on a PDP
+ `collect` is a CSS selector that identifies links that, when followed, will reveal more pages similar to the one currently being visited. *pagination* links are a good example of this.
+ `before` lets you specify a callback that enables you to modify the html before it is process by select/collect
```json
"next":{
  "before":"arbitraryCallback",
  "select":".product > h3 + a",
  "collect":".pagination a",
  "next": {...}
}
```

### stash
*stash* has 2 primary keys
+ `namespace` is used for organizing under the recipes namespace
+ `extract` is a collection of keys to scrape off each PDP
  - takes either a CSS-selector string or an Array of CSS-selector strings. Ordered pseudo-selectors such as `:first` cannot be supported. When passing an array, the first selector to return results is used.

**example**
```json
"stash":{
  "namespace":"levi",
  "extract":{
    "price":[".prod_total_price span.now",".prod_total_price"]
  }
}
```
