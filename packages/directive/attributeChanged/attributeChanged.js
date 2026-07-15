import execute from './execute'

const attributeChanged =
  (attribute, ...filters) =>
  (target, property) => {
    execute(property).with(filters).from(target).whenAttributeChanges(attribute)
  }

export default attributeChanged
