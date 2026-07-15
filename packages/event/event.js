import listen from './listen'

const event = new Proxy(
  {},
  {
    get(_, type) {
      return (selector, ...filters) =>
        (target, method) => {
          listen(type)
            .on(selector)
            .with(...filters)
            .in(target)
            .call(method)
        }
    },
  },
)

export default event
