import listen from './listen'

// Property access (e.g. event.click) returns a decorator factory:
// event.click(selector, ...filters) produces a method decorator that binds
// a delegated 'click' listener to the decorated method via listen().
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
