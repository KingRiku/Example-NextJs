//#region common types
declare type TruthyPrimitive = string | number | true | symbol

declare type FalsyPrimitive = undefined | false | null | 0 | ''

declare type Primitive = TruthyPrimitive | FalsyPrimitive
//#endregion

//#region generic types
declare type Flatten<ExpectedArrayItem> =
  ExpectedArrayItem extends Array<infer ExpectedArrayItemType>
    ? ExpectedArrayItemType
    : ExpectedArrayItem

/**
 * Construct a type from T using keys in the union K as required properties
 */
declare type SelectiveRequired<T, K extends keyof T> = T & Required<Pick<T, K>>

/**
 * Construct a type from T using keys in the union K as required properties and defining the rest as optional
 */
declare type StrictSelectiveRequired<T, K extends keyof T> = Partial<T> &
  Required<Pick<T, K>>

/**
 * Construct a type from T using keys in the union K as optional properties and defining the rest as required
 */
declare type OmittedRequired<T, K extends keyof T> = Required<{
  [P in Exclude<keyof T, K>]: T[P]
}> &
  Partial<{
    [O in K]?: T[O]
  }>

/**
 * Construct a type from T with required properties except whose keys are in the union K
 */
declare type StrictOmittedRequired<T, K extends keyof T> = Required<
  Omit<T, K>
> &
  Partial<Pick<T, K>>

/**
 * Construct a type from T using keys in the union K as usable properties and defining the rest as not usable
 */
declare type Filtered<T, K extends keyof T> = Record<K, T[K]> & {
  [N in Exclude<keyof T, K>]?: never
}

declare type Assumed<
  Original extends object,
  Assumption extends Original,
> = Original & Partial<Omit<Assumption, keyof Original>>

declare type Assume<Base, Expected = Base> = Expected extends Base
  ? Base extends Expected
    ? Base
    : Assumed<Base, Expected>
  : Base

declare type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never }

declare type Override<T, U> = T extends object
  ? (Without<T, U> & U) | (Without<U, T> & T)
  : T | U

declare type OptionalReadonly<T> = T | Readonly<T>

declare type PossiblyUndefined<T> = T | undefined

declare type Nullable<T> = T | null

declare type UndefinedNullable<T> = Nullable<PossiblyUndefined<T>>

declare type Stringified<T extends object | Primitive> = `${T}`
//#endregion

//#region react custom props types
/**
 * Indicates that the component does not have props
 */
declare interface WithoutProps {
  [key: never]: never
}

declare type WithParams<
  Params extends Record<string, string>,
  Props extends object = WithoutProps,
> = {
  params: Params
} & Props

declare type WithSearchParams<
  SearchParams extends Record<string, string>,
  Props extends object = WithoutProps,
> = {
  searchParams: Partial<SearchParams>
} & Props

declare type WithParamsAndSearchParams<
  Params extends Record<string, string>,
  SearchParams extends Record<string, string>,
  Props extends object = WithoutProps,
> = {
  params: Params
  searchParams: Partial<SearchParams>
} & Props
//#endregion
