import router from './router'

/**
 * Re-runs route handling whenever the user navigates via back/forward
 * (browser-triggered `popstate`).
 */
const popState = () => window.addEventListener('popstate', router.handle)

export default popState
