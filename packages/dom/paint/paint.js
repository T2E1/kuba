import render from './render'

const paint =
  (component, ...styles) =>
  (target) =>
    render(component).with(styles).on(target).whenConnected()

export default paint
