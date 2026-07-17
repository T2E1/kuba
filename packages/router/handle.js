import args from './args'
import matching from './matching'
import params from './params'

/**
 * Resolves the route matching the current URL and runs it.
 *
 * Order matters: `args`/`params` are refreshed before `page` is invoked so the
 * page callback sees up-to-date query/path values when it reads `args`/`params`.
 */
function handle() {
  const { page, path } = matching()
  args()
  params(path)
  if (page) page()
}

export default handle
