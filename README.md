# cdi-node 

[![Build Status](https://travis-ci.org/willguitaradmfar/cdi-node.svg?branch=master)](https://travis-ci.org/willguitaradmfar/cdi-node)

[![Coverage Status](https://coveralls.io/repos/github/willguitaradmfar/cdi-node/badge.svg?branch=master)](https://coveralls.io/github/willguitaradmfar/cdi-node?branch=master)

Library that assists in dependency management.

## Installation

### Requirements
* NodeJS 8+

`$ npm i cdi-node`

## Usage

### Simple

```js
const CDI = require('cdi-node')

const cdi = new CDI()

const _module = cdi.configure({})

_module.fn = ({ _var1 }) => {
    return new Promise((resolve, reject) => {
        return resolve(_var1)
    })
}

const response = await _module.fn({ _var1: 'test' })
// response: 'test'

```

### Simple with context

```js
const CDI = require('cdi-node')

const cdi = new CDI()

const _module = cdi.configure({})

_module.context = '_context'

_module.fn = ({ _var1 }) => {
    return new Promise((resolve, reject) => {
        return resolve(_var1 + this.context)
    })
}

const response = await _module.fn({ _var1: 'test' })
// response: 'test_context'

```

### Simple with interceptor variable

```js
const CDI = require('cdi-node')

const cdi = new CDI()

cdi.addInterceptorVariable('_var1', async (fnName, args) => {
    return args._var1 + '_interceptor'
})

const _module = cdi.configure({})

_module.fn = ({ _var1 }) => {
    return new Promise((resolve, reject) => {
        return resolve(_var1)
    })
}

const response = await _module.fn({ _var1: 'test' })
// response: 'test_interceptor'

```

### Simple with interceptor catch error

```js
const CDI = require('cdi-node')

const cdi = new CDI()

cdi.setInterceptorCatch(async (err, fnName, args) => {
    if (args && args._var1) {
        return err.message + ' + effect + ' + fnName
    }

    throw err
})

const _module = cdi.configure({})

_module.fn = ({ _var1 }) => {
    throw new Error('error test')
}

const response = await _module.fn({ _var1: 'test' })
// response: 'error test + effect + fn'
try{
    await _module.fn()
}catch(err){
    // err.messge: 'error test'
}


```


### Simple with interceptor Done

```js
const CDI = require('cdi-node')

const cdi = new CDI()

cdi.setInterceptorDone(async (response, fnName, args) => {
    if (response === 'done') {
        return response + ' + ' + fnName
    }

    throw new Error(response)
})

const _module = cdi.configure({})

_module.fn = ({ _var1 }) => {
    return 'done'
}

_module._fn = ({ _var1 }) => {
    return 'error'
}

const response = await _module.fn({ _var1: 'test' })
// response: 'done + fn'
try{
    await _module._fn()
}catch(err){
    // err.messge: 'error'
}


```

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)