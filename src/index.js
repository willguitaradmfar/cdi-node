module.exports = class CDI {
  configure (target) {
    this.target = target
    if (!this.target) throw new Error('was missing the variable "target"')
    this.proxy = new Proxy(target, this.handler())
    return this.proxy
  }

  addInterceptor (variable, fn) {
    this.interceptors = this.interceptors || {}
    this.interceptors[variable] = fn
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
            for (let _var in this.interceptors) {
              resolveInterceptor[_var] = await this.interceptors[_var](arg)
            }

            return obj[prop].call(ctx, {
              ...arg,
              ...resolveInterceptor
            })
          }
        }

        throw new Error('Property not found')
      }
    }
  }
}
