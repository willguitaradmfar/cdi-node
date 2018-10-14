module.exports = class CDI {
  configure (target) {
    this.target = target
    if (!this.target) throw new Error('was missing the variable "target"')
    this.proxy = new Proxy(target, this.handler())
    return this.proxy
  }

  addInterceptorVariable (variable, fn) {
    this.interceptorsVariable = this.interceptorsVariable || {}
    this.interceptorsVariable[variable] = fn
  }

  setInterceptorCatch (fn) {
    if (this.interceptorCatch) {
      throw new Error(`already exists a configured Error Interceptor`)
    }
    this.interceptorCatch = fn
  }

  setInterceptorDone (fn) {
    if (this.interceptorDone) {
      throw new Error(`already exists a configured Done Interceptor`)
    }
    this.interceptorDone = fn
  }

  handler () {
    return {
      get: (obj, prop) => {
        const ctx = this.proxy

        if (!obj[prop]) throw new Error('Property not found')

        if (typeof obj[prop] !== 'function') { return obj[prop] }

        if (typeof obj[prop] === 'function') {
          return async (...args) => {
            if (args.length > 1) throw new Error(`only 1 argument of object type is allowed`)

            const [arg] = args

            if (arg && arg.constructor !== {}.constructor) throw new Error(`only 1 argument of object type is allowed`)

            const resolveInterceptor = {}
            for (let _var in this.interceptorsVariable) {
              resolveInterceptor[_var] = await this.interceptorsVariable[_var](prop, arg)
            }

            try {
              const response = await obj[prop].call(ctx, {
                ...arg,
                ...resolveInterceptor
              })

              if (this.interceptorDone) {
                return this.interceptorDone(response, prop, arg)
              }

              return response
            } catch (err) {
              if (this.interceptorCatch) {
                return this.interceptorCatch(err, prop, arg)
              }
              throw err
            }
          }
        }
      }
    }
  }
}
