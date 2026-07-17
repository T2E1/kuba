// event.submitter is passed so the resulting FormData also captures the
// name/value of the <button type="submit"> that triggered the event.
const formData = (event) =>
  Object.fromEntries(new FormData(event.target, event.submitter))

export default formData
