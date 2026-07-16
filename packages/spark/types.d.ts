declare module '@t2e1/kuba/spark' {
  export type SparkFilter = (value: unknown, argument?: unknown) => unknown

  interface Spark {
    get(name: string): SparkFilter
    set(name: string, fn: SparkFilter): Spark
  }

  const spark: Spark

  export default spark

  export function add(x: unknown, y: unknown): number
  export function always(_token: unknown, value: unknown): unknown
  export function dec(x: unknown): number
  export function different(x: unknown, y: unknown): boolean
  export function equals(x: unknown, y: unknown): boolean
  export function gt(x: unknown, y: unknown): boolean
  export function gte(x: unknown, y: unknown): boolean
  export function inc(x: unknown): number
  export function len(x: object | null | undefined): number
  export function lt(x: unknown, y: unknown): boolean
  export function lte(x: unknown, y: unknown): boolean
  export function not(x: unknown): boolean
  export function prop(target: unknown, path: string): unknown
  export function subtract(x: unknown, y: unknown): number
  export function truthy(value: unknown): boolean
}
