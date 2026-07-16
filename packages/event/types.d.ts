declare module '@t2e1/kuba/event' {
  export type EventFilter = (event: Event) => unknown

  type EventBinder = (
    selector: string,
    ...filters: EventFilter[]
  ) => MethodDecorator

  const on: Record<string, EventBinder>

  export default on

  export function customEvent(type: string, detail?: unknown): CustomEvent
  export function dataset(event: Event): DOMStringMap
  export function detail(event: CustomEvent): unknown
  export function files(event: Event): FileList | null
  export function formData(
    event: SubmitEvent,
  ): Record<string, FormDataEntryValue>
  export function prevent(event: Event): Event
  export function stop(event: Event): Event
  export function value(event: Event): string
}
