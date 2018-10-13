# cdi-node 

[![Build Status](https://travis-ci.org/willguitaradmfar/cdi-node.svg?branch=master)](https://travis-ci.org/willguitaradmfar/cdi-node)

Library that assists in dependency management.

## Installation

### Requirements
* NodeJS

`$ npm i cdi-node`

## Usage

### Simple

```js
const CDI = require('cdi-node')

const cdi = new CDI()

const _module = cdi.configure({})

_module.fn = async ({ _var1 }) => {
    return new Promise((resolve, reject) => {
        return resolve(_var1)
    })
}

await _module({ _var1: 'test' })
// response: 'test'

```

### Simple with context

```js
const CDI = require('cdi-node')

const cdi = new CDI()

cdi.addInterceptor('_var1', async (args) => {
    return args._var1 + '_interceptor'
})

const _module = cdi.configure({})

_module.context = '_context'

_module.fn = async ({ _var1 }) => {
    return new Promise((resolve, reject) => {
        return resolve(_var1 + this.context)
    })
}

await _module({ _var1: 'test' })
// response: 'test_context'

```

### Simple with interceptor

```js
const CDI = require('cdi-node')

const cdi = new CDI()

cdi.addInterceptor('_var1', async (args) => {
    return args._var1 + '_interceptor'
})

const _module = cdi.configure({})

_module.fn = async ({ _var1 }) => {
    return new Promise((resolve, reject) => {
        return resolve(_var1)
    })
}

await _module({ _var1: 'test' })
// response: 'test_interceptor'

```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)