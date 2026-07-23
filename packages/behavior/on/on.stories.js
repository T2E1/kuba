/**
 * `<kb-on>` renders nothing on its own — it exists to attach a second (or
 * third...) arc to a parent Echo host, since an element can only carry one
 * `on="..."` attribute. See Foundations/Dataflow for the arc string syntax.
 */
export default {
  title: 'Behavior/On',
  tags: ['autodocs'],
  parameters: {
    a11y: { test: 'todo' },
  },
}

export const MultipleArcsOnOneHost = {
  render: () => `
    <kb-button name="approve" value="Approved">Approve</kb-button>
    <kb-button name="reject" value="Rejected" variant="outline" color="danger">Reject</kb-button>

    <kb-render layout="list">
      <template>Last action: {}</template>
      <kb-on value="approve/clicked:method/render"></kb-on>
      <kb-on value="reject/clicked:method/render"></kb-on>
    </kb-render>

    <p>
      <code>&lt;kb-render&gt;</code> has no <code>on</code> attribute of its
      own here — both subscriptions are expressed as
      <code>&lt;kb-on&gt;</code> children, each wiring a different button's
      <code>clicked</code> event (whose payload is the button's
      <code>value</code>) to the same <code>render()</code> method. The
      empty <code>{}</code> placeholder interpolates the whole payload
      rather than a named property.
    </p>
  `,
}
