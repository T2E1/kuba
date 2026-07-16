export type SparkFilter = (value: unknown, argument?: unknown) => unknown

interface Spark {
  get(name: string): SparkFilter
  set(name: string, fn: SparkFilter): Spark
}

declare const spark: Spark

export default spark

export declare function add(x: unknown, y: unknown): number
export declare function always(_token: unknown, value: unknown): unknown
export declare function dec(x: unknown): number
export declare function different(x: unknown, y: unknown): boolean
export declare function equals(x: unknown, y: unknown): boolean
export declare function gt(x: unknown, y: unknown): boolean
export declare function gte(x: unknown, y: unknown): boolean
export declare function inc(x: unknown): number
export declare function len(x: object | null | undefined): number
export declare function lt(x: unknown, y: unknown): boolean
export declare function lte(x: unknown, y: unknown): boolean
export declare function not(x: unknown): boolean
export declare function prop(target: unknown, path: string): unknown
export declare function subtract(x: unknown, y: unknown): number
export declare function truthy(value: unknown): boolean
