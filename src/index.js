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

  addInterceptorsCatch (fnName, fn) {
    this.interceptorsCatch = this.interceptorsCatch || {}
    this.interceptorsCatch[fnName] = fn
  }

  handler () {
    return {
      get: (obj, prop) => {
        const ctx = this.proxy

        if (typeof obj[prop] !== 'function') { return obj[prop] }

        if (typeof obj[prop] === 'function') {
          return async (...args) => {
            if (args.length > 1) throw new Error(`only 1 argument of object type is allowed`)

            const [arg] = args

            if (arg && arg.constructor !== {}.constructor) throw new Error(`only 1 argument of object type is allowed`)

            const resolveInterceptor = {}
            for (let _var in this.interceptorsVariable) {
              resolveInterceptor[_var] = await this.interceptorsVariable[_var](arg)
            }

            try {
              return await obj[prop].call(ctx, {
                ...arg,
                ...resolveInterceptor
              })
            } catch (err) {
              if (this.interceptorsCatch && this.interceptorsCatch[prop]) {
                return this.interceptorsCatch[prop](err, arg)
              }
              throw err
            }
          }
        }

        throw new Error('Property not found')
      }
    }
  }
}
