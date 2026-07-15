import router from './router'

const popState = () => window.addEventListener('popstate', router.handle)

export default popState
