import execute from './execute'

/** Syncs `property` from `attribute` on every `attributeChangedCallback`, passing the raw string value through `filters` in order first. */
const attributeChanged =
  (attribute, ...filters) =>
  (target, property) => {
    execute(property).with(filters).from(target).whenAttributeChanges(attribute)
  }

export default attributeChanged
