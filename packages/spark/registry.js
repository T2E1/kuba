import { add } from './add'
import { always } from './always'
import { dec } from './dec'
import { different } from './different'
import { equals } from './equals'
import { gt } from './gt'
import { gte } from './gte'
import { inc } from './inc'
import { len } from './len'
import { lt } from './lt'
import { lte } from './lte'
import { not } from './not'
import { prop } from './prop'
import { subtract } from './subtract'
import { truthy } from './truthy'

// Maps operator names (as used in declarative expressions, e.g. filter/condition
// strings) to their implementation. Looked up by name in `spark.js`; entries can be
// overridden or extended at runtime via `spark.set(name, fn)`.
export const registry = {
  always,
  add,
  dec,
  different,
  equals,
  gt,
  gte,
  inc,
  len,
  lt,
  lte,
  not,
  prop,
  subtract,
  truthy,
}
