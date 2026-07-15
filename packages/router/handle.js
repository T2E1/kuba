import args from './args'
import matching from './matching'
import params from './params'

function handle() {
  const { page, path } = matching()
  args()
  params(path)
  if (page) page()
}

export default handle
