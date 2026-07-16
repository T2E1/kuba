export type EventFilter = (event: Event) => unknown

type EventBinder = (
  selector: string,
  ...filters: EventFilter[]
) => MethodDecorator

declare const on: Record<string, EventBinder>

export default on

export declare function customEvent(type: string, detail?: unknown): CustomEvent
export declare function dataset(event: Event): DOMStringMap
export declare function detail(event: CustomEvent): unknown
export declare function files(event: Event): FileList | null
export declare function formData(
  event: SubmitEvent,
): Record<string, FormDataEntryValue>
export declare function prevent(event: Event): Event
export declare function stop(event: Event): Event
export declare function value(event: Event): string
