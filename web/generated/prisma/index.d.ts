
/**
 * Client
**/

import * as runtime from './runtime/library.js';
import $Types = runtime.Types // general types
import $Public = runtime.Types.Public
import $Utils = runtime.Types.Utils
import $Extensions = runtime.Types.Extensions
import $Result = runtime.Types.Result

export type PrismaPromise<T> = $Public.PrismaPromise<T>


/**
 * Model ExposureSnapshot
 * 
 */
export type ExposureSnapshot = $Result.DefaultSelection<Prisma.$ExposureSnapshotPayload>
/**
 * Model ExposureRecord
 * 
 */
export type ExposureRecord = $Result.DefaultSelection<Prisma.$ExposureRecordPayload>
/**
 * Model ExposureDailyAgg
 * 
 */
export type ExposureDailyAgg = $Result.DefaultSelection<Prisma.$ExposureDailyAggPayload>
/**
 * Model ExposureVersionDailyAgg
 * 
 */
export type ExposureVersionDailyAgg = $Result.DefaultSelection<Prisma.$ExposureVersionDailyAggPayload>

/**
 * ##  Prisma Client ʲˢ
 *
 * Type-safe database client for TypeScript & Node.js
 * @example
 * ```
 * const prisma = new PrismaClient()
 * // Fetch zero or more ExposureSnapshots
 * const exposureSnapshots = await prisma.exposureSnapshot.findMany()
 * ```
 *
 *
 * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
 */
export class PrismaClient<
  ClientOptions extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions,
  const U = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never,
  ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs
> {
  [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['other'] }

    /**
   * ##  Prisma Client ʲˢ
   *
   * Type-safe database client for TypeScript & Node.js
   * @example
   * ```
   * const prisma = new PrismaClient()
   * // Fetch zero or more ExposureSnapshots
   * const exposureSnapshots = await prisma.exposureSnapshot.findMany()
   * ```
   *
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client).
   */

  constructor(optionsArg ?: Prisma.Subset<ClientOptions, Prisma.PrismaClientOptions>);
  $on<V extends U>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;

  /**
   * Connect with the database
   */
  $connect(): $Utils.JsPromise<void>;

  /**
   * Disconnect from the database
   */
  $disconnect(): $Utils.JsPromise<void>;

/**
   * Executes a prepared raw query and returns the number of affected rows.
   * @example
   * ```
   * const result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Executes a raw query and returns the number of affected rows.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$executeRawUnsafe('UPDATE User SET cool = $1 WHERE email = $2 ;', true, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;

  /**
   * Performs a prepared raw query and returns the `SELECT` data.
   * @example
   * ```
   * const result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;

  /**
   * Performs a raw query and returns the `SELECT` data.
   * Susceptible to SQL injections, see documentation.
   * @example
   * ```
   * const result = await prisma.$queryRawUnsafe('SELECT * FROM User WHERE id = $1 OR email = $2;', 1, 'user@email.com')
   * ```
   *
   * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/raw-database-access).
   */
  $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;


  /**
   * Allows the running of a sequence of read/write operations that are guaranteed to either succeed or fail as a whole.
   * @example
   * ```
   * const [george, bob, alice] = await prisma.$transaction([
   *   prisma.user.create({ data: { name: 'George' } }),
   *   prisma.user.create({ data: { name: 'Bob' } }),
   *   prisma.user.create({ data: { name: 'Alice' } }),
   * ])
   * ```
   * 
   * Read more in our [docs](https://www.prisma.io/docs/concepts/components/prisma-client/transactions).
   */
  $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: { isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>

  $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => $Utils.JsPromise<R>, options?: { maxWait?: number, timeout?: number, isolationLevel?: Prisma.TransactionIsolationLevel }): $Utils.JsPromise<R>


  $extends: $Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<ClientOptions>, ExtArgs, $Utils.Call<Prisma.TypeMapCb<ClientOptions>, {
    extArgs: ExtArgs
  }>>

      /**
   * `prisma.exposureSnapshot`: Exposes CRUD operations for the **ExposureSnapshot** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ExposureSnapshots
    * const exposureSnapshots = await prisma.exposureSnapshot.findMany()
    * ```
    */
  get exposureSnapshot(): Prisma.ExposureSnapshotDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.exposureRecord`: Exposes CRUD operations for the **ExposureRecord** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ExposureRecords
    * const exposureRecords = await prisma.exposureRecord.findMany()
    * ```
    */
  get exposureRecord(): Prisma.ExposureRecordDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.exposureDailyAgg`: Exposes CRUD operations for the **ExposureDailyAgg** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ExposureDailyAggs
    * const exposureDailyAggs = await prisma.exposureDailyAgg.findMany()
    * ```
    */
  get exposureDailyAgg(): Prisma.ExposureDailyAggDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.exposureVersionDailyAgg`: Exposes CRUD operations for the **ExposureVersionDailyAgg** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more ExposureVersionDailyAggs
    * const exposureVersionDailyAggs = await prisma.exposureVersionDailyAgg.findMany()
    * ```
    */
  get exposureVersionDailyAgg(): Prisma.ExposureVersionDailyAggDelegate<ExtArgs, ClientOptions>;
}

export namespace Prisma {
  export import DMMF = runtime.DMMF

  export type PrismaPromise<T> = $Public.PrismaPromise<T>

  /**
   * Validator
   */
  export import validator = runtime.Public.validator

  /**
   * Prisma Errors
   */
  export import PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError
  export import PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError
  export import PrismaClientRustPanicError = runtime.PrismaClientRustPanicError
  export import PrismaClientInitializationError = runtime.PrismaClientInitializationError
  export import PrismaClientValidationError = runtime.PrismaClientValidationError

  /**
   * Re-export of sql-template-tag
   */
  export import sql = runtime.sqltag
  export import empty = runtime.empty
  export import join = runtime.join
  export import raw = runtime.raw
  export import Sql = runtime.Sql



  /**
   * Decimal.js
   */
  export import Decimal = runtime.Decimal

  export type DecimalJsLike = runtime.DecimalJsLike

  /**
   * Metrics
   */
  export type Metrics = runtime.Metrics
  export type Metric<T> = runtime.Metric<T>
  export type MetricHistogram = runtime.MetricHistogram
  export type MetricHistogramBucket = runtime.MetricHistogramBucket

  /**
  * Extensions
  */
  export import Extension = $Extensions.UserArgs
  export import getExtensionContext = runtime.Extensions.getExtensionContext
  export import Args = $Public.Args
  export import Payload = $Public.Payload
  export import Result = $Public.Result
  export import Exact = $Public.Exact

  /**
   * Prisma Client JS version: 6.16.2
   * Query Engine version: 1c57fdcd7e44b29b9313256c76699e91c3ac3c43
   */
  export type PrismaVersion = {
    client: string
  }

  export const prismaVersion: PrismaVersion

  /**
   * Utility Types
   */


  export import JsonObject = runtime.JsonObject
  export import JsonArray = runtime.JsonArray
  export import JsonValue = runtime.JsonValue
  export import InputJsonObject = runtime.InputJsonObject
  export import InputJsonArray = runtime.InputJsonArray
  export import InputJsonValue = runtime.InputJsonValue

  /**
   * Types of the values used to represent different kinds of `null` values when working with JSON fields.
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  namespace NullTypes {
    /**
    * Type of `Prisma.DbNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.DbNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class DbNull {
      private DbNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.JsonNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.JsonNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class JsonNull {
      private JsonNull: never
      private constructor()
    }

    /**
    * Type of `Prisma.AnyNull`.
    *
    * You cannot use other instances of this class. Please use the `Prisma.AnyNull` value.
    *
    * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
    */
    class AnyNull {
      private AnyNull: never
      private constructor()
    }
  }

  /**
   * Helper for filtering JSON entries that have `null` on the database (empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const DbNull: NullTypes.DbNull

  /**
   * Helper for filtering JSON entries that have JSON `null` values (not empty on the db)
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const JsonNull: NullTypes.JsonNull

  /**
   * Helper for filtering JSON entries that are `Prisma.DbNull` or `Prisma.JsonNull`
   *
   * @see https://www.prisma.io/docs/concepts/components/prisma-client/working-with-fields/working-with-json-fields#filtering-on-a-json-field
   */
  export const AnyNull: NullTypes.AnyNull

  type SelectAndInclude = {
    select: any
    include: any
  }

  type SelectAndOmit = {
    select: any
    omit: any
  }

  /**
   * Get the type of the value, that the Promise holds.
   */
  export type PromiseType<T extends PromiseLike<any>> = T extends PromiseLike<infer U> ? U : T;

  /**
   * Get the return type of a function which returns a Promise.
   */
  export type PromiseReturnType<T extends (...args: any) => $Utils.JsPromise<any>> = PromiseType<ReturnType<T>>

  /**
   * From T, pick a set of properties whose keys are in the union K
   */
  type Prisma__Pick<T, K extends keyof T> = {
      [P in K]: T[P];
  };


  export type Enumerable<T> = T | Array<T>;

  export type RequiredKeys<T> = {
    [K in keyof T]-?: {} extends Prisma__Pick<T, K> ? never : K
  }[keyof T]

  export type TruthyKeys<T> = keyof {
    [K in keyof T as T[K] extends false | undefined | null ? never : K]: K
  }

  export type TrueKeys<T> = TruthyKeys<Prisma__Pick<T, RequiredKeys<T>>>

  /**
   * Subset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection
   */
  export type Subset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never;
  };

  /**
   * SelectSubset
   * @desc From `T` pick properties that exist in `U`. Simple version of Intersection.
   * Additionally, it validates, if both select and include are present. If the case, it errors.
   */
  export type SelectSubset<T, U> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    (T extends SelectAndInclude
      ? 'Please either choose `select` or `include`.'
      : T extends SelectAndOmit
        ? 'Please either choose `select` or `omit`.'
        : {})

  /**
   * Subset + Intersection
   * @desc From `T` pick properties that exist in `U` and intersect `K`
   */
  export type SubsetIntersection<T, U, K> = {
    [key in keyof T]: key extends keyof U ? T[key] : never
  } &
    K

  type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never };

  /**
   * XOR is needed to have a real mutually exclusive union type
   * https://stackoverflow.com/questions/42123407/does-typescript-support-mutually-exclusive-types
   */
  type XOR<T, U> =
    T extends object ?
    U extends object ?
      (Without<T, U> & U) | (Without<U, T> & T)
    : U : T


  /**
   * Is T a Record?
   */
  type IsObject<T extends any> = T extends Array<any>
  ? False
  : T extends Date
  ? False
  : T extends Uint8Array
  ? False
  : T extends BigInt
  ? False
  : T extends object
  ? True
  : False


  /**
   * If it's T[], return T
   */
  export type UnEnumerate<T extends unknown> = T extends Array<infer U> ? U : T

  /**
   * From ts-toolbelt
   */

  type __Either<O extends object, K extends Key> = Omit<O, K> &
    {
      // Merge all but K
      [P in K]: Prisma__Pick<O, P & keyof O> // With K possibilities
    }[K]

  type EitherStrict<O extends object, K extends Key> = Strict<__Either<O, K>>

  type EitherLoose<O extends object, K extends Key> = ComputeRaw<__Either<O, K>>

  type _Either<
    O extends object,
    K extends Key,
    strict extends Boolean
  > = {
    1: EitherStrict<O, K>
    0: EitherLoose<O, K>
  }[strict]

  type Either<
    O extends object,
    K extends Key,
    strict extends Boolean = 1
  > = O extends unknown ? _Either<O, K, strict> : never

  export type Union = any

  type PatchUndefined<O extends object, O1 extends object> = {
    [K in keyof O]: O[K] extends undefined ? At<O1, K> : O[K]
  } & {}

  /** Helper Types for "Merge" **/
  export type IntersectOf<U extends Union> = (
    U extends unknown ? (k: U) => void : never
  ) extends (k: infer I) => void
    ? I
    : never

  export type Overwrite<O extends object, O1 extends object> = {
      [K in keyof O]: K extends keyof O1 ? O1[K] : O[K];
  } & {};

  type _Merge<U extends object> = IntersectOf<Overwrite<U, {
      [K in keyof U]-?: At<U, K>;
  }>>;

  type Key = string | number | symbol;
  type AtBasic<O extends object, K extends Key> = K extends keyof O ? O[K] : never;
  type AtStrict<O extends object, K extends Key> = O[K & keyof O];
  type AtLoose<O extends object, K extends Key> = O extends unknown ? AtStrict<O, K> : never;
  export type At<O extends object, K extends Key, strict extends Boolean = 1> = {
      1: AtStrict<O, K>;
      0: AtLoose<O, K>;
  }[strict];

  export type ComputeRaw<A extends any> = A extends Function ? A : {
    [K in keyof A]: A[K];
  } & {};

  export type OptionalFlat<O> = {
    [K in keyof O]?: O[K];
  } & {};

  type _Record<K extends keyof any, T> = {
    [P in K]: T;
  };

  // cause typescript not to expand types and preserve names
  type NoExpand<T> = T extends unknown ? T : never;

  // this type assumes the passed object is entirely optional
  type AtLeast<O extends object, K extends string> = NoExpand<
    O extends unknown
    ? | (K extends keyof O ? { [P in K]: O[P] } & O : O)
      | {[P in keyof O as P extends K ? P : never]-?: O[P]} & O
    : never>;

  type _Strict<U, _U = U> = U extends unknown ? U & OptionalFlat<_Record<Exclude<Keys<_U>, keyof U>, never>> : never;

  export type Strict<U extends object> = ComputeRaw<_Strict<U>>;
  /** End Helper Types for "Merge" **/

  export type Merge<U extends object> = ComputeRaw<_Merge<Strict<U>>>;

  /**
  A [[Boolean]]
  */
  export type Boolean = True | False

  // /**
  // 1
  // */
  export type True = 1

  /**
  0
  */
  export type False = 0

  export type Not<B extends Boolean> = {
    0: 1
    1: 0
  }[B]

  export type Extends<A1 extends any, A2 extends any> = [A1] extends [never]
    ? 0 // anything `never` is false
    : A1 extends A2
    ? 1
    : 0

  export type Has<U extends Union, U1 extends Union> = Not<
    Extends<Exclude<U1, U>, U1>
  >

  export type Or<B1 extends Boolean, B2 extends Boolean> = {
    0: {
      0: 0
      1: 1
    }
    1: {
      0: 1
      1: 1
    }
  }[B1][B2]

  export type Keys<U extends Union> = U extends unknown ? keyof U : never

  type Cast<A, B> = A extends B ? A : B;

  export const type: unique symbol;



  /**
   * Used by group by
   */

  export type GetScalarType<T, O> = O extends object ? {
    [P in keyof T]: P extends keyof O
      ? O[P]
      : never
  } : never

  type FieldPaths<
    T,
    U = Omit<T, '_avg' | '_sum' | '_count' | '_min' | '_max'>
  > = IsObject<T> extends True ? U : T

  type GetHavingFields<T> = {
    [K in keyof T]: Or<
      Or<Extends<'OR', K>, Extends<'AND', K>>,
      Extends<'NOT', K>
    > extends True
      ? // infer is only needed to not hit TS limit
        // based on the brilliant idea of Pierre-Antoine Mills
        // https://github.com/microsoft/TypeScript/issues/30188#issuecomment-478938437
        T[K] extends infer TK
        ? GetHavingFields<UnEnumerate<TK> extends object ? Merge<UnEnumerate<TK>> : never>
        : never
      : {} extends FieldPaths<T[K]>
      ? never
      : K
  }[keyof T]

  /**
   * Convert tuple to union
   */
  type _TupleToUnion<T> = T extends (infer E)[] ? E : never
  type TupleToUnion<K extends readonly any[]> = _TupleToUnion<K>
  type MaybeTupleToUnion<T> = T extends any[] ? TupleToUnion<T> : T

  /**
   * Like `Pick`, but additionally can also accept an array of keys
   */
  type PickEnumerable<T, K extends Enumerable<keyof T> | keyof T> = Prisma__Pick<T, MaybeTupleToUnion<K>>

  /**
   * Exclude all keys with underscores
   */
  type ExcludeUnderscoreKeys<T extends string> = T extends `_${string}` ? never : T


  export type FieldRef<Model, FieldType> = runtime.FieldRef<Model, FieldType>

  type FieldRefInputType<Model, FieldType> = Model extends never ? never : FieldRef<Model, FieldType>


  export const ModelName: {
    ExposureSnapshot: 'ExposureSnapshot',
    ExposureRecord: 'ExposureRecord',
    ExposureDailyAgg: 'ExposureDailyAgg',
    ExposureVersionDailyAgg: 'ExposureVersionDailyAgg'
  };

  export type ModelName = (typeof ModelName)[keyof typeof ModelName]


  export type Datasources = {
    db?: Datasource
  }

  interface TypeMapCb<ClientOptions = {}> extends $Utils.Fn<{extArgs: $Extensions.InternalArgs }, $Utils.Record<string, any>> {
    returns: Prisma.TypeMap<this['params']['extArgs'], ClientOptions extends { omit: infer OmitOptions } ? OmitOptions : {}>
  }

  export type TypeMap<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> = {
    globalOmitOptions: {
      omit: GlobalOmitOptions
    }
    meta: {
      modelProps: "exposureSnapshot" | "exposureRecord" | "exposureDailyAgg" | "exposureVersionDailyAgg"
      txIsolationLevel: Prisma.TransactionIsolationLevel
    }
    model: {
      ExposureSnapshot: {
        payload: Prisma.$ExposureSnapshotPayload<ExtArgs>
        fields: Prisma.ExposureSnapshotFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ExposureSnapshotFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExposureSnapshotPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ExposureSnapshotFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExposureSnapshotPayload>
          }
          findFirst: {
            args: Prisma.ExposureSnapshotFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExposureSnapshotPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ExposureSnapshotFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExposureSnapshotPayload>
          }
          findMany: {
            args: Prisma.ExposureSnapshotFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExposureSnapshotPayload>[]
          }
          create: {
            args: Prisma.ExposureSnapshotCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExposureSnapshotPayload>
          }
          createMany: {
            args: Prisma.ExposureSnapshotCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ExposureSnapshotDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExposureSnapshotPayload>
          }
          update: {
            args: Prisma.ExposureSnapshotUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExposureSnapshotPayload>
          }
          deleteMany: {
            args: Prisma.ExposureSnapshotDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ExposureSnapshotUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ExposureSnapshotUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExposureSnapshotPayload>
          }
          aggregate: {
            args: Prisma.ExposureSnapshotAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateExposureSnapshot>
          }
          groupBy: {
            args: Prisma.ExposureSnapshotGroupByArgs<ExtArgs>
            result: $Utils.Optional<ExposureSnapshotGroupByOutputType>[]
          }
          count: {
            args: Prisma.ExposureSnapshotCountArgs<ExtArgs>
            result: $Utils.Optional<ExposureSnapshotCountAggregateOutputType> | number
          }
        }
      }
      ExposureRecord: {
        payload: Prisma.$ExposureRecordPayload<ExtArgs>
        fields: Prisma.ExposureRecordFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ExposureRecordFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExposureRecordPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ExposureRecordFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExposureRecordPayload>
          }
          findFirst: {
            args: Prisma.ExposureRecordFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExposureRecordPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ExposureRecordFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExposureRecordPayload>
          }
          findMany: {
            args: Prisma.ExposureRecordFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExposureRecordPayload>[]
          }
          create: {
            args: Prisma.ExposureRecordCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExposureRecordPayload>
          }
          createMany: {
            args: Prisma.ExposureRecordCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ExposureRecordDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExposureRecordPayload>
          }
          update: {
            args: Prisma.ExposureRecordUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExposureRecordPayload>
          }
          deleteMany: {
            args: Prisma.ExposureRecordDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ExposureRecordUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ExposureRecordUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExposureRecordPayload>
          }
          aggregate: {
            args: Prisma.ExposureRecordAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateExposureRecord>
          }
          groupBy: {
            args: Prisma.ExposureRecordGroupByArgs<ExtArgs>
            result: $Utils.Optional<ExposureRecordGroupByOutputType>[]
          }
          count: {
            args: Prisma.ExposureRecordCountArgs<ExtArgs>
            result: $Utils.Optional<ExposureRecordCountAggregateOutputType> | number
          }
        }
      }
      ExposureDailyAgg: {
        payload: Prisma.$ExposureDailyAggPayload<ExtArgs>
        fields: Prisma.ExposureDailyAggFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ExposureDailyAggFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExposureDailyAggPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ExposureDailyAggFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExposureDailyAggPayload>
          }
          findFirst: {
            args: Prisma.ExposureDailyAggFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExposureDailyAggPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ExposureDailyAggFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExposureDailyAggPayload>
          }
          findMany: {
            args: Prisma.ExposureDailyAggFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExposureDailyAggPayload>[]
          }
          create: {
            args: Prisma.ExposureDailyAggCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExposureDailyAggPayload>
          }
          createMany: {
            args: Prisma.ExposureDailyAggCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ExposureDailyAggDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExposureDailyAggPayload>
          }
          update: {
            args: Prisma.ExposureDailyAggUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExposureDailyAggPayload>
          }
          deleteMany: {
            args: Prisma.ExposureDailyAggDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ExposureDailyAggUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ExposureDailyAggUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExposureDailyAggPayload>
          }
          aggregate: {
            args: Prisma.ExposureDailyAggAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateExposureDailyAgg>
          }
          groupBy: {
            args: Prisma.ExposureDailyAggGroupByArgs<ExtArgs>
            result: $Utils.Optional<ExposureDailyAggGroupByOutputType>[]
          }
          count: {
            args: Prisma.ExposureDailyAggCountArgs<ExtArgs>
            result: $Utils.Optional<ExposureDailyAggCountAggregateOutputType> | number
          }
        }
      }
      ExposureVersionDailyAgg: {
        payload: Prisma.$ExposureVersionDailyAggPayload<ExtArgs>
        fields: Prisma.ExposureVersionDailyAggFieldRefs
        operations: {
          findUnique: {
            args: Prisma.ExposureVersionDailyAggFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExposureVersionDailyAggPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.ExposureVersionDailyAggFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExposureVersionDailyAggPayload>
          }
          findFirst: {
            args: Prisma.ExposureVersionDailyAggFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExposureVersionDailyAggPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.ExposureVersionDailyAggFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExposureVersionDailyAggPayload>
          }
          findMany: {
            args: Prisma.ExposureVersionDailyAggFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExposureVersionDailyAggPayload>[]
          }
          create: {
            args: Prisma.ExposureVersionDailyAggCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExposureVersionDailyAggPayload>
          }
          createMany: {
            args: Prisma.ExposureVersionDailyAggCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.ExposureVersionDailyAggDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExposureVersionDailyAggPayload>
          }
          update: {
            args: Prisma.ExposureVersionDailyAggUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExposureVersionDailyAggPayload>
          }
          deleteMany: {
            args: Prisma.ExposureVersionDailyAggDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.ExposureVersionDailyAggUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.ExposureVersionDailyAggUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$ExposureVersionDailyAggPayload>
          }
          aggregate: {
            args: Prisma.ExposureVersionDailyAggAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateExposureVersionDailyAgg>
          }
          groupBy: {
            args: Prisma.ExposureVersionDailyAggGroupByArgs<ExtArgs>
            result: $Utils.Optional<ExposureVersionDailyAggGroupByOutputType>[]
          }
          count: {
            args: Prisma.ExposureVersionDailyAggCountArgs<ExtArgs>
            result: $Utils.Optional<ExposureVersionDailyAggCountAggregateOutputType> | number
          }
        }
      }
    }
  } & {
    other: {
      payload: any
      operations: {
        $executeRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $executeRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
        $queryRaw: {
          args: [query: TemplateStringsArray | Prisma.Sql, ...values: any[]],
          result: any
        }
        $queryRawUnsafe: {
          args: [query: string, ...values: any[]],
          result: any
        }
      }
    }
  }
  export const defineExtension: $Extensions.ExtendsHook<"define", Prisma.TypeMapCb, $Extensions.DefaultArgs>
  export type DefaultPrismaClient = PrismaClient
  export type ErrorFormat = 'pretty' | 'colorless' | 'minimal'
  export interface PrismaClientOptions {
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasources?: Datasources
    /**
     * Overwrites the datasource url from your schema.prisma file
     */
    datasourceUrl?: string
    /**
     * @default "colorless"
     */
    errorFormat?: ErrorFormat
    /**
     * @example
     * ```
     * // Shorthand for `emit: 'stdout'`
     * log: ['query', 'info', 'warn', 'error']
     * 
     * // Emit as events only
     * log: [
     *   { emit: 'event', level: 'query' },
     *   { emit: 'event', level: 'info' },
     *   { emit: 'event', level: 'warn' }
     *   { emit: 'event', level: 'error' }
     * ]
     * 
     * / Emit as events and log to stdout
     * og: [
     *  { emit: 'stdout', level: 'query' },
     *  { emit: 'stdout', level: 'info' },
     *  { emit: 'stdout', level: 'warn' }
     *  { emit: 'stdout', level: 'error' }
     * 
     * ```
     * Read more in our [docs](https://www.prisma.io/docs/reference/tools-and-interfaces/prisma-client/logging#the-log-option).
     */
    log?: (LogLevel | LogDefinition)[]
    /**
     * The default values for transactionOptions
     * maxWait ?= 2000
     * timeout ?= 5000
     */
    transactionOptions?: {
      maxWait?: number
      timeout?: number
      isolationLevel?: Prisma.TransactionIsolationLevel
    }
    /**
     * Instance of a Driver Adapter, e.g., like one provided by `@prisma/adapter-planetscale`
     */
    adapter?: runtime.SqlDriverAdapterFactory | null
    /**
     * Global configuration for omitting model fields by default.
     * 
     * @example
     * ```
     * const prisma = new PrismaClient({
     *   omit: {
     *     user: {
     *       password: true
     *     }
     *   }
     * })
     * ```
     */
    omit?: Prisma.GlobalOmitConfig
  }
  export type GlobalOmitConfig = {
    exposureSnapshot?: ExposureSnapshotOmit
    exposureRecord?: ExposureRecordOmit
    exposureDailyAgg?: ExposureDailyAggOmit
    exposureVersionDailyAgg?: ExposureVersionDailyAggOmit
  }

  /* Types for Logging */
  export type LogLevel = 'info' | 'query' | 'warn' | 'error'
  export type LogDefinition = {
    level: LogLevel
    emit: 'stdout' | 'event'
  }

  export type CheckIsLogLevel<T> = T extends LogLevel ? T : never;

  export type GetLogType<T> = CheckIsLogLevel<
    T extends LogDefinition ? T['level'] : T
  >;

  export type GetEvents<T extends any[]> = T extends Array<LogLevel | LogDefinition>
    ? GetLogType<T[number]>
    : never;

  export type QueryEvent = {
    timestamp: Date
    query: string
    params: string
    duration: number
    target: string
  }

  export type LogEvent = {
    timestamp: Date
    message: string
    target: string
  }
  /* End Types for Logging */


  export type PrismaAction =
    | 'findUnique'
    | 'findUniqueOrThrow'
    | 'findMany'
    | 'findFirst'
    | 'findFirstOrThrow'
    | 'create'
    | 'createMany'
    | 'createManyAndReturn'
    | 'update'
    | 'updateMany'
    | 'updateManyAndReturn'
    | 'upsert'
    | 'delete'
    | 'deleteMany'
    | 'executeRaw'
    | 'queryRaw'
    | 'aggregate'
    | 'count'
    | 'runCommandRaw'
    | 'findRaw'
    | 'groupBy'

  // tested in getLogLevel.test.ts
  export function getLogLevel(log: Array<LogLevel | LogDefinition>): LogLevel | undefined;

  /**
   * `PrismaClient` proxy available in interactive transactions.
   */
  export type TransactionClient = Omit<Prisma.DefaultPrismaClient, runtime.ITXClientDenyList>

  export type Datasource = {
    url?: string
  }

  /**
   * Count Types
   */


  /**
   * Count Type ExposureSnapshotCountOutputType
   */

  export type ExposureSnapshotCountOutputType = {
    records: number
  }

  export type ExposureSnapshotCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    records?: boolean | ExposureSnapshotCountOutputTypeCountRecordsArgs
  }

  // Custom InputTypes
  /**
   * ExposureSnapshotCountOutputType without action
   */
  export type ExposureSnapshotCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExposureSnapshotCountOutputType
     */
    select?: ExposureSnapshotCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * ExposureSnapshotCountOutputType without action
   */
  export type ExposureSnapshotCountOutputTypeCountRecordsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExposureRecordWhereInput
  }


  /**
   * Models
   */

  /**
   * Model ExposureSnapshot
   */

  export type AggregateExposureSnapshot = {
    _count: ExposureSnapshotCountAggregateOutputType | null
    _avg: ExposureSnapshotAvgAggregateOutputType | null
    _sum: ExposureSnapshotSumAggregateOutputType | null
    _min: ExposureSnapshotMinAggregateOutputType | null
    _max: ExposureSnapshotMaxAggregateOutputType | null
  }

  export type ExposureSnapshotAvgAggregateOutputType = {
    id: number | null
  }

  export type ExposureSnapshotSumAggregateOutputType = {
    id: number | null
  }

  export type ExposureSnapshotMinAggregateOutputType = {
    id: number | null
    dateKey: string | null
    snapshotDate: Date | null
    sourceFile: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ExposureSnapshotMaxAggregateOutputType = {
    id: number | null
    dateKey: string | null
    snapshotDate: Date | null
    sourceFile: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ExposureSnapshotCountAggregateOutputType = {
    id: number
    dateKey: number
    snapshotDate: number
    sourceFile: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ExposureSnapshotAvgAggregateInputType = {
    id?: true
  }

  export type ExposureSnapshotSumAggregateInputType = {
    id?: true
  }

  export type ExposureSnapshotMinAggregateInputType = {
    id?: true
    dateKey?: true
    snapshotDate?: true
    sourceFile?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ExposureSnapshotMaxAggregateInputType = {
    id?: true
    dateKey?: true
    snapshotDate?: true
    sourceFile?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ExposureSnapshotCountAggregateInputType = {
    id?: true
    dateKey?: true
    snapshotDate?: true
    sourceFile?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ExposureSnapshotAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ExposureSnapshot to aggregate.
     */
    where?: ExposureSnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExposureSnapshots to fetch.
     */
    orderBy?: ExposureSnapshotOrderByWithRelationInput | ExposureSnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ExposureSnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExposureSnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExposureSnapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ExposureSnapshots
    **/
    _count?: true | ExposureSnapshotCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ExposureSnapshotAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ExposureSnapshotSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ExposureSnapshotMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ExposureSnapshotMaxAggregateInputType
  }

  export type GetExposureSnapshotAggregateType<T extends ExposureSnapshotAggregateArgs> = {
        [P in keyof T & keyof AggregateExposureSnapshot]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateExposureSnapshot[P]>
      : GetScalarType<T[P], AggregateExposureSnapshot[P]>
  }




  export type ExposureSnapshotGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExposureSnapshotWhereInput
    orderBy?: ExposureSnapshotOrderByWithAggregationInput | ExposureSnapshotOrderByWithAggregationInput[]
    by: ExposureSnapshotScalarFieldEnum[] | ExposureSnapshotScalarFieldEnum
    having?: ExposureSnapshotScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ExposureSnapshotCountAggregateInputType | true
    _avg?: ExposureSnapshotAvgAggregateInputType
    _sum?: ExposureSnapshotSumAggregateInputType
    _min?: ExposureSnapshotMinAggregateInputType
    _max?: ExposureSnapshotMaxAggregateInputType
  }

  export type ExposureSnapshotGroupByOutputType = {
    id: number
    dateKey: string
    snapshotDate: Date
    sourceFile: string
    createdAt: Date
    updatedAt: Date
    _count: ExposureSnapshotCountAggregateOutputType | null
    _avg: ExposureSnapshotAvgAggregateOutputType | null
    _sum: ExposureSnapshotSumAggregateOutputType | null
    _min: ExposureSnapshotMinAggregateOutputType | null
    _max: ExposureSnapshotMaxAggregateOutputType | null
  }

  type GetExposureSnapshotGroupByPayload<T extends ExposureSnapshotGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ExposureSnapshotGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ExposureSnapshotGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ExposureSnapshotGroupByOutputType[P]>
            : GetScalarType<T[P], ExposureSnapshotGroupByOutputType[P]>
        }
      >
    >


  export type ExposureSnapshotSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    dateKey?: boolean
    snapshotDate?: boolean
    sourceFile?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    records?: boolean | ExposureSnapshot$recordsArgs<ExtArgs>
    dailyAgg?: boolean | ExposureSnapshot$dailyAggArgs<ExtArgs>
    _count?: boolean | ExposureSnapshotCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["exposureSnapshot"]>



  export type ExposureSnapshotSelectScalar = {
    id?: boolean
    dateKey?: boolean
    snapshotDate?: boolean
    sourceFile?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ExposureSnapshotOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "dateKey" | "snapshotDate" | "sourceFile" | "createdAt" | "updatedAt", ExtArgs["result"]["exposureSnapshot"]>
  export type ExposureSnapshotInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    records?: boolean | ExposureSnapshot$recordsArgs<ExtArgs>
    dailyAgg?: boolean | ExposureSnapshot$dailyAggArgs<ExtArgs>
    _count?: boolean | ExposureSnapshotCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $ExposureSnapshotPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ExposureSnapshot"
    objects: {
      records: Prisma.$ExposureRecordPayload<ExtArgs>[]
      dailyAgg: Prisma.$ExposureDailyAggPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      dateKey: string
      snapshotDate: Date
      sourceFile: string
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["exposureSnapshot"]>
    composites: {}
  }

  type ExposureSnapshotGetPayload<S extends boolean | null | undefined | ExposureSnapshotDefaultArgs> = $Result.GetResult<Prisma.$ExposureSnapshotPayload, S>

  type ExposureSnapshotCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ExposureSnapshotFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ExposureSnapshotCountAggregateInputType | true
    }

  export interface ExposureSnapshotDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ExposureSnapshot'], meta: { name: 'ExposureSnapshot' } }
    /**
     * Find zero or one ExposureSnapshot that matches the filter.
     * @param {ExposureSnapshotFindUniqueArgs} args - Arguments to find a ExposureSnapshot
     * @example
     * // Get one ExposureSnapshot
     * const exposureSnapshot = await prisma.exposureSnapshot.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ExposureSnapshotFindUniqueArgs>(args: SelectSubset<T, ExposureSnapshotFindUniqueArgs<ExtArgs>>): Prisma__ExposureSnapshotClient<$Result.GetResult<Prisma.$ExposureSnapshotPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ExposureSnapshot that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ExposureSnapshotFindUniqueOrThrowArgs} args - Arguments to find a ExposureSnapshot
     * @example
     * // Get one ExposureSnapshot
     * const exposureSnapshot = await prisma.exposureSnapshot.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ExposureSnapshotFindUniqueOrThrowArgs>(args: SelectSubset<T, ExposureSnapshotFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ExposureSnapshotClient<$Result.GetResult<Prisma.$ExposureSnapshotPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ExposureSnapshot that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExposureSnapshotFindFirstArgs} args - Arguments to find a ExposureSnapshot
     * @example
     * // Get one ExposureSnapshot
     * const exposureSnapshot = await prisma.exposureSnapshot.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ExposureSnapshotFindFirstArgs>(args?: SelectSubset<T, ExposureSnapshotFindFirstArgs<ExtArgs>>): Prisma__ExposureSnapshotClient<$Result.GetResult<Prisma.$ExposureSnapshotPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ExposureSnapshot that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExposureSnapshotFindFirstOrThrowArgs} args - Arguments to find a ExposureSnapshot
     * @example
     * // Get one ExposureSnapshot
     * const exposureSnapshot = await prisma.exposureSnapshot.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ExposureSnapshotFindFirstOrThrowArgs>(args?: SelectSubset<T, ExposureSnapshotFindFirstOrThrowArgs<ExtArgs>>): Prisma__ExposureSnapshotClient<$Result.GetResult<Prisma.$ExposureSnapshotPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ExposureSnapshots that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExposureSnapshotFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ExposureSnapshots
     * const exposureSnapshots = await prisma.exposureSnapshot.findMany()
     * 
     * // Get first 10 ExposureSnapshots
     * const exposureSnapshots = await prisma.exposureSnapshot.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const exposureSnapshotWithIdOnly = await prisma.exposureSnapshot.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ExposureSnapshotFindManyArgs>(args?: SelectSubset<T, ExposureSnapshotFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExposureSnapshotPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ExposureSnapshot.
     * @param {ExposureSnapshotCreateArgs} args - Arguments to create a ExposureSnapshot.
     * @example
     * // Create one ExposureSnapshot
     * const ExposureSnapshot = await prisma.exposureSnapshot.create({
     *   data: {
     *     // ... data to create a ExposureSnapshot
     *   }
     * })
     * 
     */
    create<T extends ExposureSnapshotCreateArgs>(args: SelectSubset<T, ExposureSnapshotCreateArgs<ExtArgs>>): Prisma__ExposureSnapshotClient<$Result.GetResult<Prisma.$ExposureSnapshotPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ExposureSnapshots.
     * @param {ExposureSnapshotCreateManyArgs} args - Arguments to create many ExposureSnapshots.
     * @example
     * // Create many ExposureSnapshots
     * const exposureSnapshot = await prisma.exposureSnapshot.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ExposureSnapshotCreateManyArgs>(args?: SelectSubset<T, ExposureSnapshotCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a ExposureSnapshot.
     * @param {ExposureSnapshotDeleteArgs} args - Arguments to delete one ExposureSnapshot.
     * @example
     * // Delete one ExposureSnapshot
     * const ExposureSnapshot = await prisma.exposureSnapshot.delete({
     *   where: {
     *     // ... filter to delete one ExposureSnapshot
     *   }
     * })
     * 
     */
    delete<T extends ExposureSnapshotDeleteArgs>(args: SelectSubset<T, ExposureSnapshotDeleteArgs<ExtArgs>>): Prisma__ExposureSnapshotClient<$Result.GetResult<Prisma.$ExposureSnapshotPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ExposureSnapshot.
     * @param {ExposureSnapshotUpdateArgs} args - Arguments to update one ExposureSnapshot.
     * @example
     * // Update one ExposureSnapshot
     * const exposureSnapshot = await prisma.exposureSnapshot.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ExposureSnapshotUpdateArgs>(args: SelectSubset<T, ExposureSnapshotUpdateArgs<ExtArgs>>): Prisma__ExposureSnapshotClient<$Result.GetResult<Prisma.$ExposureSnapshotPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ExposureSnapshots.
     * @param {ExposureSnapshotDeleteManyArgs} args - Arguments to filter ExposureSnapshots to delete.
     * @example
     * // Delete a few ExposureSnapshots
     * const { count } = await prisma.exposureSnapshot.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ExposureSnapshotDeleteManyArgs>(args?: SelectSubset<T, ExposureSnapshotDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ExposureSnapshots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExposureSnapshotUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ExposureSnapshots
     * const exposureSnapshot = await prisma.exposureSnapshot.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ExposureSnapshotUpdateManyArgs>(args: SelectSubset<T, ExposureSnapshotUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ExposureSnapshot.
     * @param {ExposureSnapshotUpsertArgs} args - Arguments to update or create a ExposureSnapshot.
     * @example
     * // Update or create a ExposureSnapshot
     * const exposureSnapshot = await prisma.exposureSnapshot.upsert({
     *   create: {
     *     // ... data to create a ExposureSnapshot
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ExposureSnapshot we want to update
     *   }
     * })
     */
    upsert<T extends ExposureSnapshotUpsertArgs>(args: SelectSubset<T, ExposureSnapshotUpsertArgs<ExtArgs>>): Prisma__ExposureSnapshotClient<$Result.GetResult<Prisma.$ExposureSnapshotPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ExposureSnapshots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExposureSnapshotCountArgs} args - Arguments to filter ExposureSnapshots to count.
     * @example
     * // Count the number of ExposureSnapshots
     * const count = await prisma.exposureSnapshot.count({
     *   where: {
     *     // ... the filter for the ExposureSnapshots we want to count
     *   }
     * })
    **/
    count<T extends ExposureSnapshotCountArgs>(
      args?: Subset<T, ExposureSnapshotCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ExposureSnapshotCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ExposureSnapshot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExposureSnapshotAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ExposureSnapshotAggregateArgs>(args: Subset<T, ExposureSnapshotAggregateArgs>): Prisma.PrismaPromise<GetExposureSnapshotAggregateType<T>>

    /**
     * Group by ExposureSnapshot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExposureSnapshotGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ExposureSnapshotGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ExposureSnapshotGroupByArgs['orderBy'] }
        : { orderBy?: ExposureSnapshotGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ExposureSnapshotGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetExposureSnapshotGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ExposureSnapshot model
   */
  readonly fields: ExposureSnapshotFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ExposureSnapshot.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ExposureSnapshotClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    records<T extends ExposureSnapshot$recordsArgs<ExtArgs> = {}>(args?: Subset<T, ExposureSnapshot$recordsArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExposureRecordPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
    dailyAgg<T extends ExposureSnapshot$dailyAggArgs<ExtArgs> = {}>(args?: Subset<T, ExposureSnapshot$dailyAggArgs<ExtArgs>>): Prisma__ExposureDailyAggClient<$Result.GetResult<Prisma.$ExposureDailyAggPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ExposureSnapshot model
   */
  interface ExposureSnapshotFieldRefs {
    readonly id: FieldRef<"ExposureSnapshot", 'Int'>
    readonly dateKey: FieldRef<"ExposureSnapshot", 'String'>
    readonly snapshotDate: FieldRef<"ExposureSnapshot", 'DateTime'>
    readonly sourceFile: FieldRef<"ExposureSnapshot", 'String'>
    readonly createdAt: FieldRef<"ExposureSnapshot", 'DateTime'>
    readonly updatedAt: FieldRef<"ExposureSnapshot", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ExposureSnapshot findUnique
   */
  export type ExposureSnapshotFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExposureSnapshot
     */
    select?: ExposureSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExposureSnapshot
     */
    omit?: ExposureSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExposureSnapshotInclude<ExtArgs> | null
    /**
     * Filter, which ExposureSnapshot to fetch.
     */
    where: ExposureSnapshotWhereUniqueInput
  }

  /**
   * ExposureSnapshot findUniqueOrThrow
   */
  export type ExposureSnapshotFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExposureSnapshot
     */
    select?: ExposureSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExposureSnapshot
     */
    omit?: ExposureSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExposureSnapshotInclude<ExtArgs> | null
    /**
     * Filter, which ExposureSnapshot to fetch.
     */
    where: ExposureSnapshotWhereUniqueInput
  }

  /**
   * ExposureSnapshot findFirst
   */
  export type ExposureSnapshotFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExposureSnapshot
     */
    select?: ExposureSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExposureSnapshot
     */
    omit?: ExposureSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExposureSnapshotInclude<ExtArgs> | null
    /**
     * Filter, which ExposureSnapshot to fetch.
     */
    where?: ExposureSnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExposureSnapshots to fetch.
     */
    orderBy?: ExposureSnapshotOrderByWithRelationInput | ExposureSnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ExposureSnapshots.
     */
    cursor?: ExposureSnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExposureSnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExposureSnapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExposureSnapshots.
     */
    distinct?: ExposureSnapshotScalarFieldEnum | ExposureSnapshotScalarFieldEnum[]
  }

  /**
   * ExposureSnapshot findFirstOrThrow
   */
  export type ExposureSnapshotFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExposureSnapshot
     */
    select?: ExposureSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExposureSnapshot
     */
    omit?: ExposureSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExposureSnapshotInclude<ExtArgs> | null
    /**
     * Filter, which ExposureSnapshot to fetch.
     */
    where?: ExposureSnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExposureSnapshots to fetch.
     */
    orderBy?: ExposureSnapshotOrderByWithRelationInput | ExposureSnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ExposureSnapshots.
     */
    cursor?: ExposureSnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExposureSnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExposureSnapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExposureSnapshots.
     */
    distinct?: ExposureSnapshotScalarFieldEnum | ExposureSnapshotScalarFieldEnum[]
  }

  /**
   * ExposureSnapshot findMany
   */
  export type ExposureSnapshotFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExposureSnapshot
     */
    select?: ExposureSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExposureSnapshot
     */
    omit?: ExposureSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExposureSnapshotInclude<ExtArgs> | null
    /**
     * Filter, which ExposureSnapshots to fetch.
     */
    where?: ExposureSnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExposureSnapshots to fetch.
     */
    orderBy?: ExposureSnapshotOrderByWithRelationInput | ExposureSnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ExposureSnapshots.
     */
    cursor?: ExposureSnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExposureSnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExposureSnapshots.
     */
    skip?: number
    distinct?: ExposureSnapshotScalarFieldEnum | ExposureSnapshotScalarFieldEnum[]
  }

  /**
   * ExposureSnapshot create
   */
  export type ExposureSnapshotCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExposureSnapshot
     */
    select?: ExposureSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExposureSnapshot
     */
    omit?: ExposureSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExposureSnapshotInclude<ExtArgs> | null
    /**
     * The data needed to create a ExposureSnapshot.
     */
    data: XOR<ExposureSnapshotCreateInput, ExposureSnapshotUncheckedCreateInput>
  }

  /**
   * ExposureSnapshot createMany
   */
  export type ExposureSnapshotCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ExposureSnapshots.
     */
    data: ExposureSnapshotCreateManyInput | ExposureSnapshotCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ExposureSnapshot update
   */
  export type ExposureSnapshotUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExposureSnapshot
     */
    select?: ExposureSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExposureSnapshot
     */
    omit?: ExposureSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExposureSnapshotInclude<ExtArgs> | null
    /**
     * The data needed to update a ExposureSnapshot.
     */
    data: XOR<ExposureSnapshotUpdateInput, ExposureSnapshotUncheckedUpdateInput>
    /**
     * Choose, which ExposureSnapshot to update.
     */
    where: ExposureSnapshotWhereUniqueInput
  }

  /**
   * ExposureSnapshot updateMany
   */
  export type ExposureSnapshotUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ExposureSnapshots.
     */
    data: XOR<ExposureSnapshotUpdateManyMutationInput, ExposureSnapshotUncheckedUpdateManyInput>
    /**
     * Filter which ExposureSnapshots to update
     */
    where?: ExposureSnapshotWhereInput
    /**
     * Limit how many ExposureSnapshots to update.
     */
    limit?: number
  }

  /**
   * ExposureSnapshot upsert
   */
  export type ExposureSnapshotUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExposureSnapshot
     */
    select?: ExposureSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExposureSnapshot
     */
    omit?: ExposureSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExposureSnapshotInclude<ExtArgs> | null
    /**
     * The filter to search for the ExposureSnapshot to update in case it exists.
     */
    where: ExposureSnapshotWhereUniqueInput
    /**
     * In case the ExposureSnapshot found by the `where` argument doesn't exist, create a new ExposureSnapshot with this data.
     */
    create: XOR<ExposureSnapshotCreateInput, ExposureSnapshotUncheckedCreateInput>
    /**
     * In case the ExposureSnapshot was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ExposureSnapshotUpdateInput, ExposureSnapshotUncheckedUpdateInput>
  }

  /**
   * ExposureSnapshot delete
   */
  export type ExposureSnapshotDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExposureSnapshot
     */
    select?: ExposureSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExposureSnapshot
     */
    omit?: ExposureSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExposureSnapshotInclude<ExtArgs> | null
    /**
     * Filter which ExposureSnapshot to delete.
     */
    where: ExposureSnapshotWhereUniqueInput
  }

  /**
   * ExposureSnapshot deleteMany
   */
  export type ExposureSnapshotDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ExposureSnapshots to delete
     */
    where?: ExposureSnapshotWhereInput
    /**
     * Limit how many ExposureSnapshots to delete.
     */
    limit?: number
  }

  /**
   * ExposureSnapshot.records
   */
  export type ExposureSnapshot$recordsArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExposureRecord
     */
    select?: ExposureRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExposureRecord
     */
    omit?: ExposureRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExposureRecordInclude<ExtArgs> | null
    where?: ExposureRecordWhereInput
    orderBy?: ExposureRecordOrderByWithRelationInput | ExposureRecordOrderByWithRelationInput[]
    cursor?: ExposureRecordWhereUniqueInput
    take?: number
    skip?: number
    distinct?: ExposureRecordScalarFieldEnum | ExposureRecordScalarFieldEnum[]
  }

  /**
   * ExposureSnapshot.dailyAgg
   */
  export type ExposureSnapshot$dailyAggArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExposureDailyAgg
     */
    select?: ExposureDailyAggSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExposureDailyAgg
     */
    omit?: ExposureDailyAggOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExposureDailyAggInclude<ExtArgs> | null
    where?: ExposureDailyAggWhereInput
  }

  /**
   * ExposureSnapshot without action
   */
  export type ExposureSnapshotDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExposureSnapshot
     */
    select?: ExposureSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExposureSnapshot
     */
    omit?: ExposureSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExposureSnapshotInclude<ExtArgs> | null
  }


  /**
   * Model ExposureRecord
   */

  export type AggregateExposureRecord = {
    _count: ExposureRecordCountAggregateOutputType | null
    _avg: ExposureRecordAvgAggregateOutputType | null
    _sum: ExposureRecordSumAggregateOutputType | null
    _min: ExposureRecordMinAggregateOutputType | null
    _max: ExposureRecordMaxAggregateOutputType | null
  }

  export type ExposureRecordAvgAggregateOutputType = {
    id: number | null
    snapshotId: number | null
  }

  export type ExposureRecordSumAggregateOutputType = {
    id: bigint | null
    snapshotId: number | null
  }

  export type ExposureRecordMinAggregateOutputType = {
    id: bigint | null
    snapshotId: number | null
    snapshotDate: Date | null
    ip: string | null
    country: string | null
    countryZh: string | null
    province: string | null
    region: string | null
    city: string | null
    asn: string | null
    isp: string | null
    host: string | null
    service: string | null
    serviceDesc: string | null
    operator: string | null
    status: string | null
    scope: string | null
    version: string | null
    risk: string | null
    lastSeen: Date | null
    createdAt: Date | null
  }

  export type ExposureRecordMaxAggregateOutputType = {
    id: bigint | null
    snapshotId: number | null
    snapshotDate: Date | null
    ip: string | null
    country: string | null
    countryZh: string | null
    province: string | null
    region: string | null
    city: string | null
    asn: string | null
    isp: string | null
    host: string | null
    service: string | null
    serviceDesc: string | null
    operator: string | null
    status: string | null
    scope: string | null
    version: string | null
    risk: string | null
    lastSeen: Date | null
    createdAt: Date | null
  }

  export type ExposureRecordCountAggregateOutputType = {
    id: number
    snapshotId: number
    snapshotDate: number
    ip: number
    country: number
    countryZh: number
    province: number
    region: number
    city: number
    asn: number
    isp: number
    host: number
    service: number
    serviceDesc: number
    operator: number
    status: number
    scope: number
    version: number
    risk: number
    lastSeen: number
    createdAt: number
    _all: number
  }


  export type ExposureRecordAvgAggregateInputType = {
    id?: true
    snapshotId?: true
  }

  export type ExposureRecordSumAggregateInputType = {
    id?: true
    snapshotId?: true
  }

  export type ExposureRecordMinAggregateInputType = {
    id?: true
    snapshotId?: true
    snapshotDate?: true
    ip?: true
    country?: true
    countryZh?: true
    province?: true
    region?: true
    city?: true
    asn?: true
    isp?: true
    host?: true
    service?: true
    serviceDesc?: true
    operator?: true
    status?: true
    scope?: true
    version?: true
    risk?: true
    lastSeen?: true
    createdAt?: true
  }

  export type ExposureRecordMaxAggregateInputType = {
    id?: true
    snapshotId?: true
    snapshotDate?: true
    ip?: true
    country?: true
    countryZh?: true
    province?: true
    region?: true
    city?: true
    asn?: true
    isp?: true
    host?: true
    service?: true
    serviceDesc?: true
    operator?: true
    status?: true
    scope?: true
    version?: true
    risk?: true
    lastSeen?: true
    createdAt?: true
  }

  export type ExposureRecordCountAggregateInputType = {
    id?: true
    snapshotId?: true
    snapshotDate?: true
    ip?: true
    country?: true
    countryZh?: true
    province?: true
    region?: true
    city?: true
    asn?: true
    isp?: true
    host?: true
    service?: true
    serviceDesc?: true
    operator?: true
    status?: true
    scope?: true
    version?: true
    risk?: true
    lastSeen?: true
    createdAt?: true
    _all?: true
  }

  export type ExposureRecordAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ExposureRecord to aggregate.
     */
    where?: ExposureRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExposureRecords to fetch.
     */
    orderBy?: ExposureRecordOrderByWithRelationInput | ExposureRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ExposureRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExposureRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExposureRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ExposureRecords
    **/
    _count?: true | ExposureRecordCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ExposureRecordAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ExposureRecordSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ExposureRecordMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ExposureRecordMaxAggregateInputType
  }

  export type GetExposureRecordAggregateType<T extends ExposureRecordAggregateArgs> = {
        [P in keyof T & keyof AggregateExposureRecord]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateExposureRecord[P]>
      : GetScalarType<T[P], AggregateExposureRecord[P]>
  }




  export type ExposureRecordGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExposureRecordWhereInput
    orderBy?: ExposureRecordOrderByWithAggregationInput | ExposureRecordOrderByWithAggregationInput[]
    by: ExposureRecordScalarFieldEnum[] | ExposureRecordScalarFieldEnum
    having?: ExposureRecordScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ExposureRecordCountAggregateInputType | true
    _avg?: ExposureRecordAvgAggregateInputType
    _sum?: ExposureRecordSumAggregateInputType
    _min?: ExposureRecordMinAggregateInputType
    _max?: ExposureRecordMaxAggregateInputType
  }

  export type ExposureRecordGroupByOutputType = {
    id: bigint
    snapshotId: number
    snapshotDate: Date
    ip: string
    country: string
    countryZh: string
    province: string
    region: string
    city: string
    asn: string
    isp: string
    host: string
    service: string
    serviceDesc: string
    operator: string
    status: string
    scope: string
    version: string
    risk: string
    lastSeen: Date
    createdAt: Date
    _count: ExposureRecordCountAggregateOutputType | null
    _avg: ExposureRecordAvgAggregateOutputType | null
    _sum: ExposureRecordSumAggregateOutputType | null
    _min: ExposureRecordMinAggregateOutputType | null
    _max: ExposureRecordMaxAggregateOutputType | null
  }

  type GetExposureRecordGroupByPayload<T extends ExposureRecordGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ExposureRecordGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ExposureRecordGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ExposureRecordGroupByOutputType[P]>
            : GetScalarType<T[P], ExposureRecordGroupByOutputType[P]>
        }
      >
    >


  export type ExposureRecordSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    snapshotId?: boolean
    snapshotDate?: boolean
    ip?: boolean
    country?: boolean
    countryZh?: boolean
    province?: boolean
    region?: boolean
    city?: boolean
    asn?: boolean
    isp?: boolean
    host?: boolean
    service?: boolean
    serviceDesc?: boolean
    operator?: boolean
    status?: boolean
    scope?: boolean
    version?: boolean
    risk?: boolean
    lastSeen?: boolean
    createdAt?: boolean
    snapshot?: boolean | ExposureSnapshotDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["exposureRecord"]>



  export type ExposureRecordSelectScalar = {
    id?: boolean
    snapshotId?: boolean
    snapshotDate?: boolean
    ip?: boolean
    country?: boolean
    countryZh?: boolean
    province?: boolean
    region?: boolean
    city?: boolean
    asn?: boolean
    isp?: boolean
    host?: boolean
    service?: boolean
    serviceDesc?: boolean
    operator?: boolean
    status?: boolean
    scope?: boolean
    version?: boolean
    risk?: boolean
    lastSeen?: boolean
    createdAt?: boolean
  }

  export type ExposureRecordOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "snapshotId" | "snapshotDate" | "ip" | "country" | "countryZh" | "province" | "region" | "city" | "asn" | "isp" | "host" | "service" | "serviceDesc" | "operator" | "status" | "scope" | "version" | "risk" | "lastSeen" | "createdAt", ExtArgs["result"]["exposureRecord"]>
  export type ExposureRecordInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    snapshot?: boolean | ExposureSnapshotDefaultArgs<ExtArgs>
  }

  export type $ExposureRecordPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ExposureRecord"
    objects: {
      snapshot: Prisma.$ExposureSnapshotPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      snapshotId: number
      snapshotDate: Date
      ip: string
      country: string
      countryZh: string
      province: string
      region: string
      city: string
      asn: string
      isp: string
      host: string
      service: string
      serviceDesc: string
      operator: string
      status: string
      scope: string
      version: string
      risk: string
      lastSeen: Date
      createdAt: Date
    }, ExtArgs["result"]["exposureRecord"]>
    composites: {}
  }

  type ExposureRecordGetPayload<S extends boolean | null | undefined | ExposureRecordDefaultArgs> = $Result.GetResult<Prisma.$ExposureRecordPayload, S>

  type ExposureRecordCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ExposureRecordFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ExposureRecordCountAggregateInputType | true
    }

  export interface ExposureRecordDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ExposureRecord'], meta: { name: 'ExposureRecord' } }
    /**
     * Find zero or one ExposureRecord that matches the filter.
     * @param {ExposureRecordFindUniqueArgs} args - Arguments to find a ExposureRecord
     * @example
     * // Get one ExposureRecord
     * const exposureRecord = await prisma.exposureRecord.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ExposureRecordFindUniqueArgs>(args: SelectSubset<T, ExposureRecordFindUniqueArgs<ExtArgs>>): Prisma__ExposureRecordClient<$Result.GetResult<Prisma.$ExposureRecordPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ExposureRecord that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ExposureRecordFindUniqueOrThrowArgs} args - Arguments to find a ExposureRecord
     * @example
     * // Get one ExposureRecord
     * const exposureRecord = await prisma.exposureRecord.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ExposureRecordFindUniqueOrThrowArgs>(args: SelectSubset<T, ExposureRecordFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ExposureRecordClient<$Result.GetResult<Prisma.$ExposureRecordPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ExposureRecord that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExposureRecordFindFirstArgs} args - Arguments to find a ExposureRecord
     * @example
     * // Get one ExposureRecord
     * const exposureRecord = await prisma.exposureRecord.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ExposureRecordFindFirstArgs>(args?: SelectSubset<T, ExposureRecordFindFirstArgs<ExtArgs>>): Prisma__ExposureRecordClient<$Result.GetResult<Prisma.$ExposureRecordPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ExposureRecord that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExposureRecordFindFirstOrThrowArgs} args - Arguments to find a ExposureRecord
     * @example
     * // Get one ExposureRecord
     * const exposureRecord = await prisma.exposureRecord.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ExposureRecordFindFirstOrThrowArgs>(args?: SelectSubset<T, ExposureRecordFindFirstOrThrowArgs<ExtArgs>>): Prisma__ExposureRecordClient<$Result.GetResult<Prisma.$ExposureRecordPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ExposureRecords that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExposureRecordFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ExposureRecords
     * const exposureRecords = await prisma.exposureRecord.findMany()
     * 
     * // Get first 10 ExposureRecords
     * const exposureRecords = await prisma.exposureRecord.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const exposureRecordWithIdOnly = await prisma.exposureRecord.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ExposureRecordFindManyArgs>(args?: SelectSubset<T, ExposureRecordFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExposureRecordPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ExposureRecord.
     * @param {ExposureRecordCreateArgs} args - Arguments to create a ExposureRecord.
     * @example
     * // Create one ExposureRecord
     * const ExposureRecord = await prisma.exposureRecord.create({
     *   data: {
     *     // ... data to create a ExposureRecord
     *   }
     * })
     * 
     */
    create<T extends ExposureRecordCreateArgs>(args: SelectSubset<T, ExposureRecordCreateArgs<ExtArgs>>): Prisma__ExposureRecordClient<$Result.GetResult<Prisma.$ExposureRecordPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ExposureRecords.
     * @param {ExposureRecordCreateManyArgs} args - Arguments to create many ExposureRecords.
     * @example
     * // Create many ExposureRecords
     * const exposureRecord = await prisma.exposureRecord.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ExposureRecordCreateManyArgs>(args?: SelectSubset<T, ExposureRecordCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a ExposureRecord.
     * @param {ExposureRecordDeleteArgs} args - Arguments to delete one ExposureRecord.
     * @example
     * // Delete one ExposureRecord
     * const ExposureRecord = await prisma.exposureRecord.delete({
     *   where: {
     *     // ... filter to delete one ExposureRecord
     *   }
     * })
     * 
     */
    delete<T extends ExposureRecordDeleteArgs>(args: SelectSubset<T, ExposureRecordDeleteArgs<ExtArgs>>): Prisma__ExposureRecordClient<$Result.GetResult<Prisma.$ExposureRecordPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ExposureRecord.
     * @param {ExposureRecordUpdateArgs} args - Arguments to update one ExposureRecord.
     * @example
     * // Update one ExposureRecord
     * const exposureRecord = await prisma.exposureRecord.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ExposureRecordUpdateArgs>(args: SelectSubset<T, ExposureRecordUpdateArgs<ExtArgs>>): Prisma__ExposureRecordClient<$Result.GetResult<Prisma.$ExposureRecordPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ExposureRecords.
     * @param {ExposureRecordDeleteManyArgs} args - Arguments to filter ExposureRecords to delete.
     * @example
     * // Delete a few ExposureRecords
     * const { count } = await prisma.exposureRecord.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ExposureRecordDeleteManyArgs>(args?: SelectSubset<T, ExposureRecordDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ExposureRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExposureRecordUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ExposureRecords
     * const exposureRecord = await prisma.exposureRecord.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ExposureRecordUpdateManyArgs>(args: SelectSubset<T, ExposureRecordUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ExposureRecord.
     * @param {ExposureRecordUpsertArgs} args - Arguments to update or create a ExposureRecord.
     * @example
     * // Update or create a ExposureRecord
     * const exposureRecord = await prisma.exposureRecord.upsert({
     *   create: {
     *     // ... data to create a ExposureRecord
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ExposureRecord we want to update
     *   }
     * })
     */
    upsert<T extends ExposureRecordUpsertArgs>(args: SelectSubset<T, ExposureRecordUpsertArgs<ExtArgs>>): Prisma__ExposureRecordClient<$Result.GetResult<Prisma.$ExposureRecordPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ExposureRecords.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExposureRecordCountArgs} args - Arguments to filter ExposureRecords to count.
     * @example
     * // Count the number of ExposureRecords
     * const count = await prisma.exposureRecord.count({
     *   where: {
     *     // ... the filter for the ExposureRecords we want to count
     *   }
     * })
    **/
    count<T extends ExposureRecordCountArgs>(
      args?: Subset<T, ExposureRecordCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ExposureRecordCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ExposureRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExposureRecordAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ExposureRecordAggregateArgs>(args: Subset<T, ExposureRecordAggregateArgs>): Prisma.PrismaPromise<GetExposureRecordAggregateType<T>>

    /**
     * Group by ExposureRecord.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExposureRecordGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ExposureRecordGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ExposureRecordGroupByArgs['orderBy'] }
        : { orderBy?: ExposureRecordGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ExposureRecordGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetExposureRecordGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ExposureRecord model
   */
  readonly fields: ExposureRecordFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ExposureRecord.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ExposureRecordClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    snapshot<T extends ExposureSnapshotDefaultArgs<ExtArgs> = {}>(args?: Subset<T, ExposureSnapshotDefaultArgs<ExtArgs>>): Prisma__ExposureSnapshotClient<$Result.GetResult<Prisma.$ExposureSnapshotPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ExposureRecord model
   */
  interface ExposureRecordFieldRefs {
    readonly id: FieldRef<"ExposureRecord", 'BigInt'>
    readonly snapshotId: FieldRef<"ExposureRecord", 'Int'>
    readonly snapshotDate: FieldRef<"ExposureRecord", 'DateTime'>
    readonly ip: FieldRef<"ExposureRecord", 'String'>
    readonly country: FieldRef<"ExposureRecord", 'String'>
    readonly countryZh: FieldRef<"ExposureRecord", 'String'>
    readonly province: FieldRef<"ExposureRecord", 'String'>
    readonly region: FieldRef<"ExposureRecord", 'String'>
    readonly city: FieldRef<"ExposureRecord", 'String'>
    readonly asn: FieldRef<"ExposureRecord", 'String'>
    readonly isp: FieldRef<"ExposureRecord", 'String'>
    readonly host: FieldRef<"ExposureRecord", 'String'>
    readonly service: FieldRef<"ExposureRecord", 'String'>
    readonly serviceDesc: FieldRef<"ExposureRecord", 'String'>
    readonly operator: FieldRef<"ExposureRecord", 'String'>
    readonly status: FieldRef<"ExposureRecord", 'String'>
    readonly scope: FieldRef<"ExposureRecord", 'String'>
    readonly version: FieldRef<"ExposureRecord", 'String'>
    readonly risk: FieldRef<"ExposureRecord", 'String'>
    readonly lastSeen: FieldRef<"ExposureRecord", 'DateTime'>
    readonly createdAt: FieldRef<"ExposureRecord", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ExposureRecord findUnique
   */
  export type ExposureRecordFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExposureRecord
     */
    select?: ExposureRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExposureRecord
     */
    omit?: ExposureRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExposureRecordInclude<ExtArgs> | null
    /**
     * Filter, which ExposureRecord to fetch.
     */
    where: ExposureRecordWhereUniqueInput
  }

  /**
   * ExposureRecord findUniqueOrThrow
   */
  export type ExposureRecordFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExposureRecord
     */
    select?: ExposureRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExposureRecord
     */
    omit?: ExposureRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExposureRecordInclude<ExtArgs> | null
    /**
     * Filter, which ExposureRecord to fetch.
     */
    where: ExposureRecordWhereUniqueInput
  }

  /**
   * ExposureRecord findFirst
   */
  export type ExposureRecordFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExposureRecord
     */
    select?: ExposureRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExposureRecord
     */
    omit?: ExposureRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExposureRecordInclude<ExtArgs> | null
    /**
     * Filter, which ExposureRecord to fetch.
     */
    where?: ExposureRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExposureRecords to fetch.
     */
    orderBy?: ExposureRecordOrderByWithRelationInput | ExposureRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ExposureRecords.
     */
    cursor?: ExposureRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExposureRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExposureRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExposureRecords.
     */
    distinct?: ExposureRecordScalarFieldEnum | ExposureRecordScalarFieldEnum[]
  }

  /**
   * ExposureRecord findFirstOrThrow
   */
  export type ExposureRecordFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExposureRecord
     */
    select?: ExposureRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExposureRecord
     */
    omit?: ExposureRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExposureRecordInclude<ExtArgs> | null
    /**
     * Filter, which ExposureRecord to fetch.
     */
    where?: ExposureRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExposureRecords to fetch.
     */
    orderBy?: ExposureRecordOrderByWithRelationInput | ExposureRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ExposureRecords.
     */
    cursor?: ExposureRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExposureRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExposureRecords.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExposureRecords.
     */
    distinct?: ExposureRecordScalarFieldEnum | ExposureRecordScalarFieldEnum[]
  }

  /**
   * ExposureRecord findMany
   */
  export type ExposureRecordFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExposureRecord
     */
    select?: ExposureRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExposureRecord
     */
    omit?: ExposureRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExposureRecordInclude<ExtArgs> | null
    /**
     * Filter, which ExposureRecords to fetch.
     */
    where?: ExposureRecordWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExposureRecords to fetch.
     */
    orderBy?: ExposureRecordOrderByWithRelationInput | ExposureRecordOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ExposureRecords.
     */
    cursor?: ExposureRecordWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExposureRecords from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExposureRecords.
     */
    skip?: number
    distinct?: ExposureRecordScalarFieldEnum | ExposureRecordScalarFieldEnum[]
  }

  /**
   * ExposureRecord create
   */
  export type ExposureRecordCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExposureRecord
     */
    select?: ExposureRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExposureRecord
     */
    omit?: ExposureRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExposureRecordInclude<ExtArgs> | null
    /**
     * The data needed to create a ExposureRecord.
     */
    data: XOR<ExposureRecordCreateInput, ExposureRecordUncheckedCreateInput>
  }

  /**
   * ExposureRecord createMany
   */
  export type ExposureRecordCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ExposureRecords.
     */
    data: ExposureRecordCreateManyInput | ExposureRecordCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ExposureRecord update
   */
  export type ExposureRecordUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExposureRecord
     */
    select?: ExposureRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExposureRecord
     */
    omit?: ExposureRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExposureRecordInclude<ExtArgs> | null
    /**
     * The data needed to update a ExposureRecord.
     */
    data: XOR<ExposureRecordUpdateInput, ExposureRecordUncheckedUpdateInput>
    /**
     * Choose, which ExposureRecord to update.
     */
    where: ExposureRecordWhereUniqueInput
  }

  /**
   * ExposureRecord updateMany
   */
  export type ExposureRecordUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ExposureRecords.
     */
    data: XOR<ExposureRecordUpdateManyMutationInput, ExposureRecordUncheckedUpdateManyInput>
    /**
     * Filter which ExposureRecords to update
     */
    where?: ExposureRecordWhereInput
    /**
     * Limit how many ExposureRecords to update.
     */
    limit?: number
  }

  /**
   * ExposureRecord upsert
   */
  export type ExposureRecordUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExposureRecord
     */
    select?: ExposureRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExposureRecord
     */
    omit?: ExposureRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExposureRecordInclude<ExtArgs> | null
    /**
     * The filter to search for the ExposureRecord to update in case it exists.
     */
    where: ExposureRecordWhereUniqueInput
    /**
     * In case the ExposureRecord found by the `where` argument doesn't exist, create a new ExposureRecord with this data.
     */
    create: XOR<ExposureRecordCreateInput, ExposureRecordUncheckedCreateInput>
    /**
     * In case the ExposureRecord was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ExposureRecordUpdateInput, ExposureRecordUncheckedUpdateInput>
  }

  /**
   * ExposureRecord delete
   */
  export type ExposureRecordDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExposureRecord
     */
    select?: ExposureRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExposureRecord
     */
    omit?: ExposureRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExposureRecordInclude<ExtArgs> | null
    /**
     * Filter which ExposureRecord to delete.
     */
    where: ExposureRecordWhereUniqueInput
  }

  /**
   * ExposureRecord deleteMany
   */
  export type ExposureRecordDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ExposureRecords to delete
     */
    where?: ExposureRecordWhereInput
    /**
     * Limit how many ExposureRecords to delete.
     */
    limit?: number
  }

  /**
   * ExposureRecord without action
   */
  export type ExposureRecordDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExposureRecord
     */
    select?: ExposureRecordSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExposureRecord
     */
    omit?: ExposureRecordOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExposureRecordInclude<ExtArgs> | null
  }


  /**
   * Model ExposureDailyAgg
   */

  export type AggregateExposureDailyAgg = {
    _count: ExposureDailyAggCountAggregateOutputType | null
    _avg: ExposureDailyAggAvgAggregateOutputType | null
    _sum: ExposureDailyAggSumAggregateOutputType | null
    _min: ExposureDailyAggMinAggregateOutputType | null
    _max: ExposureDailyAggMaxAggregateOutputType | null
  }

  export type ExposureDailyAggAvgAggregateOutputType = {
    snapshotId: number | null
    exposedCount: number | null
    domesticCount: number | null
    overseasCount: number | null
    newDistinctIpCount: number | null
    cumulativeDistinctIpCount: number | null
  }

  export type ExposureDailyAggSumAggregateOutputType = {
    snapshotId: number | null
    exposedCount: number | null
    domesticCount: number | null
    overseasCount: number | null
    newDistinctIpCount: number | null
    cumulativeDistinctIpCount: number | null
  }

  export type ExposureDailyAggMinAggregateOutputType = {
    snapshotDate: Date | null
    snapshotId: number | null
    exposedCount: number | null
    domesticCount: number | null
    overseasCount: number | null
    newDistinctIpCount: number | null
    cumulativeDistinctIpCount: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ExposureDailyAggMaxAggregateOutputType = {
    snapshotDate: Date | null
    snapshotId: number | null
    exposedCount: number | null
    domesticCount: number | null
    overseasCount: number | null
    newDistinctIpCount: number | null
    cumulativeDistinctIpCount: number | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type ExposureDailyAggCountAggregateOutputType = {
    snapshotDate: number
    snapshotId: number
    exposedCount: number
    domesticCount: number
    overseasCount: number
    newDistinctIpCount: number
    cumulativeDistinctIpCount: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type ExposureDailyAggAvgAggregateInputType = {
    snapshotId?: true
    exposedCount?: true
    domesticCount?: true
    overseasCount?: true
    newDistinctIpCount?: true
    cumulativeDistinctIpCount?: true
  }

  export type ExposureDailyAggSumAggregateInputType = {
    snapshotId?: true
    exposedCount?: true
    domesticCount?: true
    overseasCount?: true
    newDistinctIpCount?: true
    cumulativeDistinctIpCount?: true
  }

  export type ExposureDailyAggMinAggregateInputType = {
    snapshotDate?: true
    snapshotId?: true
    exposedCount?: true
    domesticCount?: true
    overseasCount?: true
    newDistinctIpCount?: true
    cumulativeDistinctIpCount?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ExposureDailyAggMaxAggregateInputType = {
    snapshotDate?: true
    snapshotId?: true
    exposedCount?: true
    domesticCount?: true
    overseasCount?: true
    newDistinctIpCount?: true
    cumulativeDistinctIpCount?: true
    createdAt?: true
    updatedAt?: true
  }

  export type ExposureDailyAggCountAggregateInputType = {
    snapshotDate?: true
    snapshotId?: true
    exposedCount?: true
    domesticCount?: true
    overseasCount?: true
    newDistinctIpCount?: true
    cumulativeDistinctIpCount?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type ExposureDailyAggAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ExposureDailyAgg to aggregate.
     */
    where?: ExposureDailyAggWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExposureDailyAggs to fetch.
     */
    orderBy?: ExposureDailyAggOrderByWithRelationInput | ExposureDailyAggOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ExposureDailyAggWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExposureDailyAggs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExposureDailyAggs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ExposureDailyAggs
    **/
    _count?: true | ExposureDailyAggCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ExposureDailyAggAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ExposureDailyAggSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ExposureDailyAggMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ExposureDailyAggMaxAggregateInputType
  }

  export type GetExposureDailyAggAggregateType<T extends ExposureDailyAggAggregateArgs> = {
        [P in keyof T & keyof AggregateExposureDailyAgg]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateExposureDailyAgg[P]>
      : GetScalarType<T[P], AggregateExposureDailyAgg[P]>
  }




  export type ExposureDailyAggGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExposureDailyAggWhereInput
    orderBy?: ExposureDailyAggOrderByWithAggregationInput | ExposureDailyAggOrderByWithAggregationInput[]
    by: ExposureDailyAggScalarFieldEnum[] | ExposureDailyAggScalarFieldEnum
    having?: ExposureDailyAggScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ExposureDailyAggCountAggregateInputType | true
    _avg?: ExposureDailyAggAvgAggregateInputType
    _sum?: ExposureDailyAggSumAggregateInputType
    _min?: ExposureDailyAggMinAggregateInputType
    _max?: ExposureDailyAggMaxAggregateInputType
  }

  export type ExposureDailyAggGroupByOutputType = {
    snapshotDate: Date
    snapshotId: number | null
    exposedCount: number
    domesticCount: number
    overseasCount: number
    newDistinctIpCount: number
    cumulativeDistinctIpCount: number
    createdAt: Date
    updatedAt: Date
    _count: ExposureDailyAggCountAggregateOutputType | null
    _avg: ExposureDailyAggAvgAggregateOutputType | null
    _sum: ExposureDailyAggSumAggregateOutputType | null
    _min: ExposureDailyAggMinAggregateOutputType | null
    _max: ExposureDailyAggMaxAggregateOutputType | null
  }

  type GetExposureDailyAggGroupByPayload<T extends ExposureDailyAggGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ExposureDailyAggGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ExposureDailyAggGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ExposureDailyAggGroupByOutputType[P]>
            : GetScalarType<T[P], ExposureDailyAggGroupByOutputType[P]>
        }
      >
    >


  export type ExposureDailyAggSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    snapshotDate?: boolean
    snapshotId?: boolean
    exposedCount?: boolean
    domesticCount?: boolean
    overseasCount?: boolean
    newDistinctIpCount?: boolean
    cumulativeDistinctIpCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    snapshot?: boolean | ExposureDailyAgg$snapshotArgs<ExtArgs>
  }, ExtArgs["result"]["exposureDailyAgg"]>



  export type ExposureDailyAggSelectScalar = {
    snapshotDate?: boolean
    snapshotId?: boolean
    exposedCount?: boolean
    domesticCount?: boolean
    overseasCount?: boolean
    newDistinctIpCount?: boolean
    cumulativeDistinctIpCount?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type ExposureDailyAggOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"snapshotDate" | "snapshotId" | "exposedCount" | "domesticCount" | "overseasCount" | "newDistinctIpCount" | "cumulativeDistinctIpCount" | "createdAt" | "updatedAt", ExtArgs["result"]["exposureDailyAgg"]>
  export type ExposureDailyAggInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    snapshot?: boolean | ExposureDailyAgg$snapshotArgs<ExtArgs>
  }

  export type $ExposureDailyAggPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ExposureDailyAgg"
    objects: {
      snapshot: Prisma.$ExposureSnapshotPayload<ExtArgs> | null
    }
    scalars: $Extensions.GetPayloadResult<{
      snapshotDate: Date
      snapshotId: number | null
      exposedCount: number
      domesticCount: number
      overseasCount: number
      newDistinctIpCount: number
      cumulativeDistinctIpCount: number
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["exposureDailyAgg"]>
    composites: {}
  }

  type ExposureDailyAggGetPayload<S extends boolean | null | undefined | ExposureDailyAggDefaultArgs> = $Result.GetResult<Prisma.$ExposureDailyAggPayload, S>

  type ExposureDailyAggCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ExposureDailyAggFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ExposureDailyAggCountAggregateInputType | true
    }

  export interface ExposureDailyAggDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ExposureDailyAgg'], meta: { name: 'ExposureDailyAgg' } }
    /**
     * Find zero or one ExposureDailyAgg that matches the filter.
     * @param {ExposureDailyAggFindUniqueArgs} args - Arguments to find a ExposureDailyAgg
     * @example
     * // Get one ExposureDailyAgg
     * const exposureDailyAgg = await prisma.exposureDailyAgg.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ExposureDailyAggFindUniqueArgs>(args: SelectSubset<T, ExposureDailyAggFindUniqueArgs<ExtArgs>>): Prisma__ExposureDailyAggClient<$Result.GetResult<Prisma.$ExposureDailyAggPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ExposureDailyAgg that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ExposureDailyAggFindUniqueOrThrowArgs} args - Arguments to find a ExposureDailyAgg
     * @example
     * // Get one ExposureDailyAgg
     * const exposureDailyAgg = await prisma.exposureDailyAgg.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ExposureDailyAggFindUniqueOrThrowArgs>(args: SelectSubset<T, ExposureDailyAggFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ExposureDailyAggClient<$Result.GetResult<Prisma.$ExposureDailyAggPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ExposureDailyAgg that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExposureDailyAggFindFirstArgs} args - Arguments to find a ExposureDailyAgg
     * @example
     * // Get one ExposureDailyAgg
     * const exposureDailyAgg = await prisma.exposureDailyAgg.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ExposureDailyAggFindFirstArgs>(args?: SelectSubset<T, ExposureDailyAggFindFirstArgs<ExtArgs>>): Prisma__ExposureDailyAggClient<$Result.GetResult<Prisma.$ExposureDailyAggPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ExposureDailyAgg that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExposureDailyAggFindFirstOrThrowArgs} args - Arguments to find a ExposureDailyAgg
     * @example
     * // Get one ExposureDailyAgg
     * const exposureDailyAgg = await prisma.exposureDailyAgg.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ExposureDailyAggFindFirstOrThrowArgs>(args?: SelectSubset<T, ExposureDailyAggFindFirstOrThrowArgs<ExtArgs>>): Prisma__ExposureDailyAggClient<$Result.GetResult<Prisma.$ExposureDailyAggPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ExposureDailyAggs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExposureDailyAggFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ExposureDailyAggs
     * const exposureDailyAggs = await prisma.exposureDailyAgg.findMany()
     * 
     * // Get first 10 ExposureDailyAggs
     * const exposureDailyAggs = await prisma.exposureDailyAgg.findMany({ take: 10 })
     * 
     * // Only select the `snapshotDate`
     * const exposureDailyAggWithSnapshotDateOnly = await prisma.exposureDailyAgg.findMany({ select: { snapshotDate: true } })
     * 
     */
    findMany<T extends ExposureDailyAggFindManyArgs>(args?: SelectSubset<T, ExposureDailyAggFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExposureDailyAggPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ExposureDailyAgg.
     * @param {ExposureDailyAggCreateArgs} args - Arguments to create a ExposureDailyAgg.
     * @example
     * // Create one ExposureDailyAgg
     * const ExposureDailyAgg = await prisma.exposureDailyAgg.create({
     *   data: {
     *     // ... data to create a ExposureDailyAgg
     *   }
     * })
     * 
     */
    create<T extends ExposureDailyAggCreateArgs>(args: SelectSubset<T, ExposureDailyAggCreateArgs<ExtArgs>>): Prisma__ExposureDailyAggClient<$Result.GetResult<Prisma.$ExposureDailyAggPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ExposureDailyAggs.
     * @param {ExposureDailyAggCreateManyArgs} args - Arguments to create many ExposureDailyAggs.
     * @example
     * // Create many ExposureDailyAggs
     * const exposureDailyAgg = await prisma.exposureDailyAgg.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ExposureDailyAggCreateManyArgs>(args?: SelectSubset<T, ExposureDailyAggCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a ExposureDailyAgg.
     * @param {ExposureDailyAggDeleteArgs} args - Arguments to delete one ExposureDailyAgg.
     * @example
     * // Delete one ExposureDailyAgg
     * const ExposureDailyAgg = await prisma.exposureDailyAgg.delete({
     *   where: {
     *     // ... filter to delete one ExposureDailyAgg
     *   }
     * })
     * 
     */
    delete<T extends ExposureDailyAggDeleteArgs>(args: SelectSubset<T, ExposureDailyAggDeleteArgs<ExtArgs>>): Prisma__ExposureDailyAggClient<$Result.GetResult<Prisma.$ExposureDailyAggPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ExposureDailyAgg.
     * @param {ExposureDailyAggUpdateArgs} args - Arguments to update one ExposureDailyAgg.
     * @example
     * // Update one ExposureDailyAgg
     * const exposureDailyAgg = await prisma.exposureDailyAgg.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ExposureDailyAggUpdateArgs>(args: SelectSubset<T, ExposureDailyAggUpdateArgs<ExtArgs>>): Prisma__ExposureDailyAggClient<$Result.GetResult<Prisma.$ExposureDailyAggPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ExposureDailyAggs.
     * @param {ExposureDailyAggDeleteManyArgs} args - Arguments to filter ExposureDailyAggs to delete.
     * @example
     * // Delete a few ExposureDailyAggs
     * const { count } = await prisma.exposureDailyAgg.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ExposureDailyAggDeleteManyArgs>(args?: SelectSubset<T, ExposureDailyAggDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ExposureDailyAggs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExposureDailyAggUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ExposureDailyAggs
     * const exposureDailyAgg = await prisma.exposureDailyAgg.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ExposureDailyAggUpdateManyArgs>(args: SelectSubset<T, ExposureDailyAggUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ExposureDailyAgg.
     * @param {ExposureDailyAggUpsertArgs} args - Arguments to update or create a ExposureDailyAgg.
     * @example
     * // Update or create a ExposureDailyAgg
     * const exposureDailyAgg = await prisma.exposureDailyAgg.upsert({
     *   create: {
     *     // ... data to create a ExposureDailyAgg
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ExposureDailyAgg we want to update
     *   }
     * })
     */
    upsert<T extends ExposureDailyAggUpsertArgs>(args: SelectSubset<T, ExposureDailyAggUpsertArgs<ExtArgs>>): Prisma__ExposureDailyAggClient<$Result.GetResult<Prisma.$ExposureDailyAggPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ExposureDailyAggs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExposureDailyAggCountArgs} args - Arguments to filter ExposureDailyAggs to count.
     * @example
     * // Count the number of ExposureDailyAggs
     * const count = await prisma.exposureDailyAgg.count({
     *   where: {
     *     // ... the filter for the ExposureDailyAggs we want to count
     *   }
     * })
    **/
    count<T extends ExposureDailyAggCountArgs>(
      args?: Subset<T, ExposureDailyAggCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ExposureDailyAggCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ExposureDailyAgg.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExposureDailyAggAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ExposureDailyAggAggregateArgs>(args: Subset<T, ExposureDailyAggAggregateArgs>): Prisma.PrismaPromise<GetExposureDailyAggAggregateType<T>>

    /**
     * Group by ExposureDailyAgg.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExposureDailyAggGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ExposureDailyAggGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ExposureDailyAggGroupByArgs['orderBy'] }
        : { orderBy?: ExposureDailyAggGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ExposureDailyAggGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetExposureDailyAggGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ExposureDailyAgg model
   */
  readonly fields: ExposureDailyAggFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ExposureDailyAgg.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ExposureDailyAggClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    snapshot<T extends ExposureDailyAgg$snapshotArgs<ExtArgs> = {}>(args?: Subset<T, ExposureDailyAgg$snapshotArgs<ExtArgs>>): Prisma__ExposureSnapshotClient<$Result.GetResult<Prisma.$ExposureSnapshotPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ExposureDailyAgg model
   */
  interface ExposureDailyAggFieldRefs {
    readonly snapshotDate: FieldRef<"ExposureDailyAgg", 'DateTime'>
    readonly snapshotId: FieldRef<"ExposureDailyAgg", 'Int'>
    readonly exposedCount: FieldRef<"ExposureDailyAgg", 'Int'>
    readonly domesticCount: FieldRef<"ExposureDailyAgg", 'Int'>
    readonly overseasCount: FieldRef<"ExposureDailyAgg", 'Int'>
    readonly newDistinctIpCount: FieldRef<"ExposureDailyAgg", 'Int'>
    readonly cumulativeDistinctIpCount: FieldRef<"ExposureDailyAgg", 'Int'>
    readonly createdAt: FieldRef<"ExposureDailyAgg", 'DateTime'>
    readonly updatedAt: FieldRef<"ExposureDailyAgg", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ExposureDailyAgg findUnique
   */
  export type ExposureDailyAggFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExposureDailyAgg
     */
    select?: ExposureDailyAggSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExposureDailyAgg
     */
    omit?: ExposureDailyAggOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExposureDailyAggInclude<ExtArgs> | null
    /**
     * Filter, which ExposureDailyAgg to fetch.
     */
    where: ExposureDailyAggWhereUniqueInput
  }

  /**
   * ExposureDailyAgg findUniqueOrThrow
   */
  export type ExposureDailyAggFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExposureDailyAgg
     */
    select?: ExposureDailyAggSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExposureDailyAgg
     */
    omit?: ExposureDailyAggOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExposureDailyAggInclude<ExtArgs> | null
    /**
     * Filter, which ExposureDailyAgg to fetch.
     */
    where: ExposureDailyAggWhereUniqueInput
  }

  /**
   * ExposureDailyAgg findFirst
   */
  export type ExposureDailyAggFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExposureDailyAgg
     */
    select?: ExposureDailyAggSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExposureDailyAgg
     */
    omit?: ExposureDailyAggOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExposureDailyAggInclude<ExtArgs> | null
    /**
     * Filter, which ExposureDailyAgg to fetch.
     */
    where?: ExposureDailyAggWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExposureDailyAggs to fetch.
     */
    orderBy?: ExposureDailyAggOrderByWithRelationInput | ExposureDailyAggOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ExposureDailyAggs.
     */
    cursor?: ExposureDailyAggWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExposureDailyAggs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExposureDailyAggs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExposureDailyAggs.
     */
    distinct?: ExposureDailyAggScalarFieldEnum | ExposureDailyAggScalarFieldEnum[]
  }

  /**
   * ExposureDailyAgg findFirstOrThrow
   */
  export type ExposureDailyAggFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExposureDailyAgg
     */
    select?: ExposureDailyAggSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExposureDailyAgg
     */
    omit?: ExposureDailyAggOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExposureDailyAggInclude<ExtArgs> | null
    /**
     * Filter, which ExposureDailyAgg to fetch.
     */
    where?: ExposureDailyAggWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExposureDailyAggs to fetch.
     */
    orderBy?: ExposureDailyAggOrderByWithRelationInput | ExposureDailyAggOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ExposureDailyAggs.
     */
    cursor?: ExposureDailyAggWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExposureDailyAggs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExposureDailyAggs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExposureDailyAggs.
     */
    distinct?: ExposureDailyAggScalarFieldEnum | ExposureDailyAggScalarFieldEnum[]
  }

  /**
   * ExposureDailyAgg findMany
   */
  export type ExposureDailyAggFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExposureDailyAgg
     */
    select?: ExposureDailyAggSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExposureDailyAgg
     */
    omit?: ExposureDailyAggOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExposureDailyAggInclude<ExtArgs> | null
    /**
     * Filter, which ExposureDailyAggs to fetch.
     */
    where?: ExposureDailyAggWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExposureDailyAggs to fetch.
     */
    orderBy?: ExposureDailyAggOrderByWithRelationInput | ExposureDailyAggOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ExposureDailyAggs.
     */
    cursor?: ExposureDailyAggWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExposureDailyAggs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExposureDailyAggs.
     */
    skip?: number
    distinct?: ExposureDailyAggScalarFieldEnum | ExposureDailyAggScalarFieldEnum[]
  }

  /**
   * ExposureDailyAgg create
   */
  export type ExposureDailyAggCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExposureDailyAgg
     */
    select?: ExposureDailyAggSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExposureDailyAgg
     */
    omit?: ExposureDailyAggOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExposureDailyAggInclude<ExtArgs> | null
    /**
     * The data needed to create a ExposureDailyAgg.
     */
    data: XOR<ExposureDailyAggCreateInput, ExposureDailyAggUncheckedCreateInput>
  }

  /**
   * ExposureDailyAgg createMany
   */
  export type ExposureDailyAggCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ExposureDailyAggs.
     */
    data: ExposureDailyAggCreateManyInput | ExposureDailyAggCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ExposureDailyAgg update
   */
  export type ExposureDailyAggUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExposureDailyAgg
     */
    select?: ExposureDailyAggSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExposureDailyAgg
     */
    omit?: ExposureDailyAggOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExposureDailyAggInclude<ExtArgs> | null
    /**
     * The data needed to update a ExposureDailyAgg.
     */
    data: XOR<ExposureDailyAggUpdateInput, ExposureDailyAggUncheckedUpdateInput>
    /**
     * Choose, which ExposureDailyAgg to update.
     */
    where: ExposureDailyAggWhereUniqueInput
  }

  /**
   * ExposureDailyAgg updateMany
   */
  export type ExposureDailyAggUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ExposureDailyAggs.
     */
    data: XOR<ExposureDailyAggUpdateManyMutationInput, ExposureDailyAggUncheckedUpdateManyInput>
    /**
     * Filter which ExposureDailyAggs to update
     */
    where?: ExposureDailyAggWhereInput
    /**
     * Limit how many ExposureDailyAggs to update.
     */
    limit?: number
  }

  /**
   * ExposureDailyAgg upsert
   */
  export type ExposureDailyAggUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExposureDailyAgg
     */
    select?: ExposureDailyAggSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExposureDailyAgg
     */
    omit?: ExposureDailyAggOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExposureDailyAggInclude<ExtArgs> | null
    /**
     * The filter to search for the ExposureDailyAgg to update in case it exists.
     */
    where: ExposureDailyAggWhereUniqueInput
    /**
     * In case the ExposureDailyAgg found by the `where` argument doesn't exist, create a new ExposureDailyAgg with this data.
     */
    create: XOR<ExposureDailyAggCreateInput, ExposureDailyAggUncheckedCreateInput>
    /**
     * In case the ExposureDailyAgg was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ExposureDailyAggUpdateInput, ExposureDailyAggUncheckedUpdateInput>
  }

  /**
   * ExposureDailyAgg delete
   */
  export type ExposureDailyAggDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExposureDailyAgg
     */
    select?: ExposureDailyAggSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExposureDailyAgg
     */
    omit?: ExposureDailyAggOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExposureDailyAggInclude<ExtArgs> | null
    /**
     * Filter which ExposureDailyAgg to delete.
     */
    where: ExposureDailyAggWhereUniqueInput
  }

  /**
   * ExposureDailyAgg deleteMany
   */
  export type ExposureDailyAggDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ExposureDailyAggs to delete
     */
    where?: ExposureDailyAggWhereInput
    /**
     * Limit how many ExposureDailyAggs to delete.
     */
    limit?: number
  }

  /**
   * ExposureDailyAgg.snapshot
   */
  export type ExposureDailyAgg$snapshotArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExposureSnapshot
     */
    select?: ExposureSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExposureSnapshot
     */
    omit?: ExposureSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExposureSnapshotInclude<ExtArgs> | null
    where?: ExposureSnapshotWhereInput
  }

  /**
   * ExposureDailyAgg without action
   */
  export type ExposureDailyAggDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExposureDailyAgg
     */
    select?: ExposureDailyAggSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExposureDailyAgg
     */
    omit?: ExposureDailyAggOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: ExposureDailyAggInclude<ExtArgs> | null
  }


  /**
   * Model ExposureVersionDailyAgg
   */

  export type AggregateExposureVersionDailyAgg = {
    _count: ExposureVersionDailyAggCountAggregateOutputType | null
    _avg: ExposureVersionDailyAggAvgAggregateOutputType | null
    _sum: ExposureVersionDailyAggSumAggregateOutputType | null
    _min: ExposureVersionDailyAggMinAggregateOutputType | null
    _max: ExposureVersionDailyAggMaxAggregateOutputType | null
  }

  export type ExposureVersionDailyAggAvgAggregateOutputType = {
    id: number | null
    count: number | null
  }

  export type ExposureVersionDailyAggSumAggregateOutputType = {
    id: bigint | null
    count: number | null
  }

  export type ExposureVersionDailyAggMinAggregateOutputType = {
    id: bigint | null
    snapshotDate: Date | null
    version: string | null
    count: number | null
    createdAt: Date | null
  }

  export type ExposureVersionDailyAggMaxAggregateOutputType = {
    id: bigint | null
    snapshotDate: Date | null
    version: string | null
    count: number | null
    createdAt: Date | null
  }

  export type ExposureVersionDailyAggCountAggregateOutputType = {
    id: number
    snapshotDate: number
    version: number
    count: number
    createdAt: number
    _all: number
  }


  export type ExposureVersionDailyAggAvgAggregateInputType = {
    id?: true
    count?: true
  }

  export type ExposureVersionDailyAggSumAggregateInputType = {
    id?: true
    count?: true
  }

  export type ExposureVersionDailyAggMinAggregateInputType = {
    id?: true
    snapshotDate?: true
    version?: true
    count?: true
    createdAt?: true
  }

  export type ExposureVersionDailyAggMaxAggregateInputType = {
    id?: true
    snapshotDate?: true
    version?: true
    count?: true
    createdAt?: true
  }

  export type ExposureVersionDailyAggCountAggregateInputType = {
    id?: true
    snapshotDate?: true
    version?: true
    count?: true
    createdAt?: true
    _all?: true
  }

  export type ExposureVersionDailyAggAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ExposureVersionDailyAgg to aggregate.
     */
    where?: ExposureVersionDailyAggWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExposureVersionDailyAggs to fetch.
     */
    orderBy?: ExposureVersionDailyAggOrderByWithRelationInput | ExposureVersionDailyAggOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: ExposureVersionDailyAggWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExposureVersionDailyAggs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExposureVersionDailyAggs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned ExposureVersionDailyAggs
    **/
    _count?: true | ExposureVersionDailyAggCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: ExposureVersionDailyAggAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: ExposureVersionDailyAggSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: ExposureVersionDailyAggMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: ExposureVersionDailyAggMaxAggregateInputType
  }

  export type GetExposureVersionDailyAggAggregateType<T extends ExposureVersionDailyAggAggregateArgs> = {
        [P in keyof T & keyof AggregateExposureVersionDailyAgg]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateExposureVersionDailyAgg[P]>
      : GetScalarType<T[P], AggregateExposureVersionDailyAgg[P]>
  }




  export type ExposureVersionDailyAggGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: ExposureVersionDailyAggWhereInput
    orderBy?: ExposureVersionDailyAggOrderByWithAggregationInput | ExposureVersionDailyAggOrderByWithAggregationInput[]
    by: ExposureVersionDailyAggScalarFieldEnum[] | ExposureVersionDailyAggScalarFieldEnum
    having?: ExposureVersionDailyAggScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: ExposureVersionDailyAggCountAggregateInputType | true
    _avg?: ExposureVersionDailyAggAvgAggregateInputType
    _sum?: ExposureVersionDailyAggSumAggregateInputType
    _min?: ExposureVersionDailyAggMinAggregateInputType
    _max?: ExposureVersionDailyAggMaxAggregateInputType
  }

  export type ExposureVersionDailyAggGroupByOutputType = {
    id: bigint
    snapshotDate: Date
    version: string
    count: number
    createdAt: Date
    _count: ExposureVersionDailyAggCountAggregateOutputType | null
    _avg: ExposureVersionDailyAggAvgAggregateOutputType | null
    _sum: ExposureVersionDailyAggSumAggregateOutputType | null
    _min: ExposureVersionDailyAggMinAggregateOutputType | null
    _max: ExposureVersionDailyAggMaxAggregateOutputType | null
  }

  type GetExposureVersionDailyAggGroupByPayload<T extends ExposureVersionDailyAggGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<ExposureVersionDailyAggGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof ExposureVersionDailyAggGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], ExposureVersionDailyAggGroupByOutputType[P]>
            : GetScalarType<T[P], ExposureVersionDailyAggGroupByOutputType[P]>
        }
      >
    >


  export type ExposureVersionDailyAggSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    snapshotDate?: boolean
    version?: boolean
    count?: boolean
    createdAt?: boolean
  }, ExtArgs["result"]["exposureVersionDailyAgg"]>



  export type ExposureVersionDailyAggSelectScalar = {
    id?: boolean
    snapshotDate?: boolean
    version?: boolean
    count?: boolean
    createdAt?: boolean
  }

  export type ExposureVersionDailyAggOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "snapshotDate" | "version" | "count" | "createdAt", ExtArgs["result"]["exposureVersionDailyAgg"]>

  export type $ExposureVersionDailyAggPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "ExposureVersionDailyAgg"
    objects: {}
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      snapshotDate: Date
      version: string
      count: number
      createdAt: Date
    }, ExtArgs["result"]["exposureVersionDailyAgg"]>
    composites: {}
  }

  type ExposureVersionDailyAggGetPayload<S extends boolean | null | undefined | ExposureVersionDailyAggDefaultArgs> = $Result.GetResult<Prisma.$ExposureVersionDailyAggPayload, S>

  type ExposureVersionDailyAggCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<ExposureVersionDailyAggFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: ExposureVersionDailyAggCountAggregateInputType | true
    }

  export interface ExposureVersionDailyAggDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['ExposureVersionDailyAgg'], meta: { name: 'ExposureVersionDailyAgg' } }
    /**
     * Find zero or one ExposureVersionDailyAgg that matches the filter.
     * @param {ExposureVersionDailyAggFindUniqueArgs} args - Arguments to find a ExposureVersionDailyAgg
     * @example
     * // Get one ExposureVersionDailyAgg
     * const exposureVersionDailyAgg = await prisma.exposureVersionDailyAgg.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends ExposureVersionDailyAggFindUniqueArgs>(args: SelectSubset<T, ExposureVersionDailyAggFindUniqueArgs<ExtArgs>>): Prisma__ExposureVersionDailyAggClient<$Result.GetResult<Prisma.$ExposureVersionDailyAggPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one ExposureVersionDailyAgg that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {ExposureVersionDailyAggFindUniqueOrThrowArgs} args - Arguments to find a ExposureVersionDailyAgg
     * @example
     * // Get one ExposureVersionDailyAgg
     * const exposureVersionDailyAgg = await prisma.exposureVersionDailyAgg.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends ExposureVersionDailyAggFindUniqueOrThrowArgs>(args: SelectSubset<T, ExposureVersionDailyAggFindUniqueOrThrowArgs<ExtArgs>>): Prisma__ExposureVersionDailyAggClient<$Result.GetResult<Prisma.$ExposureVersionDailyAggPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ExposureVersionDailyAgg that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExposureVersionDailyAggFindFirstArgs} args - Arguments to find a ExposureVersionDailyAgg
     * @example
     * // Get one ExposureVersionDailyAgg
     * const exposureVersionDailyAgg = await prisma.exposureVersionDailyAgg.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends ExposureVersionDailyAggFindFirstArgs>(args?: SelectSubset<T, ExposureVersionDailyAggFindFirstArgs<ExtArgs>>): Prisma__ExposureVersionDailyAggClient<$Result.GetResult<Prisma.$ExposureVersionDailyAggPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first ExposureVersionDailyAgg that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExposureVersionDailyAggFindFirstOrThrowArgs} args - Arguments to find a ExposureVersionDailyAgg
     * @example
     * // Get one ExposureVersionDailyAgg
     * const exposureVersionDailyAgg = await prisma.exposureVersionDailyAgg.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends ExposureVersionDailyAggFindFirstOrThrowArgs>(args?: SelectSubset<T, ExposureVersionDailyAggFindFirstOrThrowArgs<ExtArgs>>): Prisma__ExposureVersionDailyAggClient<$Result.GetResult<Prisma.$ExposureVersionDailyAggPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more ExposureVersionDailyAggs that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExposureVersionDailyAggFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all ExposureVersionDailyAggs
     * const exposureVersionDailyAggs = await prisma.exposureVersionDailyAgg.findMany()
     * 
     * // Get first 10 ExposureVersionDailyAggs
     * const exposureVersionDailyAggs = await prisma.exposureVersionDailyAgg.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const exposureVersionDailyAggWithIdOnly = await prisma.exposureVersionDailyAgg.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends ExposureVersionDailyAggFindManyArgs>(args?: SelectSubset<T, ExposureVersionDailyAggFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$ExposureVersionDailyAggPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a ExposureVersionDailyAgg.
     * @param {ExposureVersionDailyAggCreateArgs} args - Arguments to create a ExposureVersionDailyAgg.
     * @example
     * // Create one ExposureVersionDailyAgg
     * const ExposureVersionDailyAgg = await prisma.exposureVersionDailyAgg.create({
     *   data: {
     *     // ... data to create a ExposureVersionDailyAgg
     *   }
     * })
     * 
     */
    create<T extends ExposureVersionDailyAggCreateArgs>(args: SelectSubset<T, ExposureVersionDailyAggCreateArgs<ExtArgs>>): Prisma__ExposureVersionDailyAggClient<$Result.GetResult<Prisma.$ExposureVersionDailyAggPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many ExposureVersionDailyAggs.
     * @param {ExposureVersionDailyAggCreateManyArgs} args - Arguments to create many ExposureVersionDailyAggs.
     * @example
     * // Create many ExposureVersionDailyAggs
     * const exposureVersionDailyAgg = await prisma.exposureVersionDailyAgg.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends ExposureVersionDailyAggCreateManyArgs>(args?: SelectSubset<T, ExposureVersionDailyAggCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a ExposureVersionDailyAgg.
     * @param {ExposureVersionDailyAggDeleteArgs} args - Arguments to delete one ExposureVersionDailyAgg.
     * @example
     * // Delete one ExposureVersionDailyAgg
     * const ExposureVersionDailyAgg = await prisma.exposureVersionDailyAgg.delete({
     *   where: {
     *     // ... filter to delete one ExposureVersionDailyAgg
     *   }
     * })
     * 
     */
    delete<T extends ExposureVersionDailyAggDeleteArgs>(args: SelectSubset<T, ExposureVersionDailyAggDeleteArgs<ExtArgs>>): Prisma__ExposureVersionDailyAggClient<$Result.GetResult<Prisma.$ExposureVersionDailyAggPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one ExposureVersionDailyAgg.
     * @param {ExposureVersionDailyAggUpdateArgs} args - Arguments to update one ExposureVersionDailyAgg.
     * @example
     * // Update one ExposureVersionDailyAgg
     * const exposureVersionDailyAgg = await prisma.exposureVersionDailyAgg.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends ExposureVersionDailyAggUpdateArgs>(args: SelectSubset<T, ExposureVersionDailyAggUpdateArgs<ExtArgs>>): Prisma__ExposureVersionDailyAggClient<$Result.GetResult<Prisma.$ExposureVersionDailyAggPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more ExposureVersionDailyAggs.
     * @param {ExposureVersionDailyAggDeleteManyArgs} args - Arguments to filter ExposureVersionDailyAggs to delete.
     * @example
     * // Delete a few ExposureVersionDailyAggs
     * const { count } = await prisma.exposureVersionDailyAgg.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends ExposureVersionDailyAggDeleteManyArgs>(args?: SelectSubset<T, ExposureVersionDailyAggDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more ExposureVersionDailyAggs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExposureVersionDailyAggUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many ExposureVersionDailyAggs
     * const exposureVersionDailyAgg = await prisma.exposureVersionDailyAgg.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends ExposureVersionDailyAggUpdateManyArgs>(args: SelectSubset<T, ExposureVersionDailyAggUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one ExposureVersionDailyAgg.
     * @param {ExposureVersionDailyAggUpsertArgs} args - Arguments to update or create a ExposureVersionDailyAgg.
     * @example
     * // Update or create a ExposureVersionDailyAgg
     * const exposureVersionDailyAgg = await prisma.exposureVersionDailyAgg.upsert({
     *   create: {
     *     // ... data to create a ExposureVersionDailyAgg
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the ExposureVersionDailyAgg we want to update
     *   }
     * })
     */
    upsert<T extends ExposureVersionDailyAggUpsertArgs>(args: SelectSubset<T, ExposureVersionDailyAggUpsertArgs<ExtArgs>>): Prisma__ExposureVersionDailyAggClient<$Result.GetResult<Prisma.$ExposureVersionDailyAggPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of ExposureVersionDailyAggs.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExposureVersionDailyAggCountArgs} args - Arguments to filter ExposureVersionDailyAggs to count.
     * @example
     * // Count the number of ExposureVersionDailyAggs
     * const count = await prisma.exposureVersionDailyAgg.count({
     *   where: {
     *     // ... the filter for the ExposureVersionDailyAggs we want to count
     *   }
     * })
    **/
    count<T extends ExposureVersionDailyAggCountArgs>(
      args?: Subset<T, ExposureVersionDailyAggCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], ExposureVersionDailyAggCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a ExposureVersionDailyAgg.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExposureVersionDailyAggAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
     * @example
     * // Ordered by age ascending
     * // Where email contains prisma.io
     * // Limited to the 10 users
     * const aggregations = await prisma.user.aggregate({
     *   _avg: {
     *     age: true,
     *   },
     *   where: {
     *     email: {
     *       contains: "prisma.io",
     *     },
     *   },
     *   orderBy: {
     *     age: "asc",
     *   },
     *   take: 10,
     * })
    **/
    aggregate<T extends ExposureVersionDailyAggAggregateArgs>(args: Subset<T, ExposureVersionDailyAggAggregateArgs>): Prisma.PrismaPromise<GetExposureVersionDailyAggAggregateType<T>>

    /**
     * Group by ExposureVersionDailyAgg.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {ExposureVersionDailyAggGroupByArgs} args - Group by arguments.
     * @example
     * // Group by city, order by createdAt, get count
     * const result = await prisma.user.groupBy({
     *   by: ['city', 'createdAt'],
     *   orderBy: {
     *     createdAt: true
     *   },
     *   _count: {
     *     _all: true
     *   },
     * })
     * 
    **/
    groupBy<
      T extends ExposureVersionDailyAggGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: ExposureVersionDailyAggGroupByArgs['orderBy'] }
        : { orderBy?: ExposureVersionDailyAggGroupByArgs['orderBy'] },
      OrderFields extends ExcludeUnderscoreKeys<Keys<MaybeTupleToUnion<T['orderBy']>>>,
      ByFields extends MaybeTupleToUnion<T['by']>,
      ByValid extends Has<ByFields, OrderFields>,
      HavingFields extends GetHavingFields<T['having']>,
      HavingValid extends Has<ByFields, HavingFields>,
      ByEmpty extends T['by'] extends never[] ? True : False,
      InputErrors extends ByEmpty extends True
      ? `Error: "by" must not be empty.`
      : HavingValid extends False
      ? {
          [P in HavingFields]: P extends ByFields
            ? never
            : P extends string
            ? `Error: Field "${P}" used in "having" needs to be provided in "by".`
            : [
                Error,
                'Field ',
                P,
                ` in "having" needs to be provided in "by"`,
              ]
        }[HavingFields]
      : 'take' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "take", you also need to provide "orderBy"'
      : 'skip' extends Keys<T>
      ? 'orderBy' extends Keys<T>
        ? ByValid extends True
          ? {}
          : {
              [P in OrderFields]: P extends ByFields
                ? never
                : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
            }[OrderFields]
        : 'Error: If you provide "skip", you also need to provide "orderBy"'
      : ByValid extends True
      ? {}
      : {
          [P in OrderFields]: P extends ByFields
            ? never
            : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`
        }[OrderFields]
    >(args: SubsetIntersection<T, ExposureVersionDailyAggGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetExposureVersionDailyAggGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the ExposureVersionDailyAgg model
   */
  readonly fields: ExposureVersionDailyAggFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for ExposureVersionDailyAgg.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__ExposureVersionDailyAggClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    /**
     * Attaches callbacks for the resolution and/or rejection of the Promise.
     * @param onfulfilled The callback to execute when the Promise is resolved.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of which ever callback is executed.
     */
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): $Utils.JsPromise<TResult1 | TResult2>
    /**
     * Attaches a callback for only the rejection of the Promise.
     * @param onrejected The callback to execute when the Promise is rejected.
     * @returns A Promise for the completion of the callback.
     */
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): $Utils.JsPromise<T | TResult>
    /**
     * Attaches a callback that is invoked when the Promise is settled (fulfilled or rejected). The
     * resolved value cannot be modified from the callback.
     * @param onfinally The callback to execute when the Promise is settled (fulfilled or rejected).
     * @returns A Promise for the completion of the callback.
     */
    finally(onfinally?: (() => void) | undefined | null): $Utils.JsPromise<T>
  }




  /**
   * Fields of the ExposureVersionDailyAgg model
   */
  interface ExposureVersionDailyAggFieldRefs {
    readonly id: FieldRef<"ExposureVersionDailyAgg", 'BigInt'>
    readonly snapshotDate: FieldRef<"ExposureVersionDailyAgg", 'DateTime'>
    readonly version: FieldRef<"ExposureVersionDailyAgg", 'String'>
    readonly count: FieldRef<"ExposureVersionDailyAgg", 'Int'>
    readonly createdAt: FieldRef<"ExposureVersionDailyAgg", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * ExposureVersionDailyAgg findUnique
   */
  export type ExposureVersionDailyAggFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExposureVersionDailyAgg
     */
    select?: ExposureVersionDailyAggSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExposureVersionDailyAgg
     */
    omit?: ExposureVersionDailyAggOmit<ExtArgs> | null
    /**
     * Filter, which ExposureVersionDailyAgg to fetch.
     */
    where: ExposureVersionDailyAggWhereUniqueInput
  }

  /**
   * ExposureVersionDailyAgg findUniqueOrThrow
   */
  export type ExposureVersionDailyAggFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExposureVersionDailyAgg
     */
    select?: ExposureVersionDailyAggSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExposureVersionDailyAgg
     */
    omit?: ExposureVersionDailyAggOmit<ExtArgs> | null
    /**
     * Filter, which ExposureVersionDailyAgg to fetch.
     */
    where: ExposureVersionDailyAggWhereUniqueInput
  }

  /**
   * ExposureVersionDailyAgg findFirst
   */
  export type ExposureVersionDailyAggFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExposureVersionDailyAgg
     */
    select?: ExposureVersionDailyAggSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExposureVersionDailyAgg
     */
    omit?: ExposureVersionDailyAggOmit<ExtArgs> | null
    /**
     * Filter, which ExposureVersionDailyAgg to fetch.
     */
    where?: ExposureVersionDailyAggWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExposureVersionDailyAggs to fetch.
     */
    orderBy?: ExposureVersionDailyAggOrderByWithRelationInput | ExposureVersionDailyAggOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ExposureVersionDailyAggs.
     */
    cursor?: ExposureVersionDailyAggWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExposureVersionDailyAggs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExposureVersionDailyAggs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExposureVersionDailyAggs.
     */
    distinct?: ExposureVersionDailyAggScalarFieldEnum | ExposureVersionDailyAggScalarFieldEnum[]
  }

  /**
   * ExposureVersionDailyAgg findFirstOrThrow
   */
  export type ExposureVersionDailyAggFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExposureVersionDailyAgg
     */
    select?: ExposureVersionDailyAggSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExposureVersionDailyAgg
     */
    omit?: ExposureVersionDailyAggOmit<ExtArgs> | null
    /**
     * Filter, which ExposureVersionDailyAgg to fetch.
     */
    where?: ExposureVersionDailyAggWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExposureVersionDailyAggs to fetch.
     */
    orderBy?: ExposureVersionDailyAggOrderByWithRelationInput | ExposureVersionDailyAggOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for ExposureVersionDailyAggs.
     */
    cursor?: ExposureVersionDailyAggWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExposureVersionDailyAggs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExposureVersionDailyAggs.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of ExposureVersionDailyAggs.
     */
    distinct?: ExposureVersionDailyAggScalarFieldEnum | ExposureVersionDailyAggScalarFieldEnum[]
  }

  /**
   * ExposureVersionDailyAgg findMany
   */
  export type ExposureVersionDailyAggFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExposureVersionDailyAgg
     */
    select?: ExposureVersionDailyAggSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExposureVersionDailyAgg
     */
    omit?: ExposureVersionDailyAggOmit<ExtArgs> | null
    /**
     * Filter, which ExposureVersionDailyAggs to fetch.
     */
    where?: ExposureVersionDailyAggWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of ExposureVersionDailyAggs to fetch.
     */
    orderBy?: ExposureVersionDailyAggOrderByWithRelationInput | ExposureVersionDailyAggOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing ExposureVersionDailyAggs.
     */
    cursor?: ExposureVersionDailyAggWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` ExposureVersionDailyAggs from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` ExposureVersionDailyAggs.
     */
    skip?: number
    distinct?: ExposureVersionDailyAggScalarFieldEnum | ExposureVersionDailyAggScalarFieldEnum[]
  }

  /**
   * ExposureVersionDailyAgg create
   */
  export type ExposureVersionDailyAggCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExposureVersionDailyAgg
     */
    select?: ExposureVersionDailyAggSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExposureVersionDailyAgg
     */
    omit?: ExposureVersionDailyAggOmit<ExtArgs> | null
    /**
     * The data needed to create a ExposureVersionDailyAgg.
     */
    data: XOR<ExposureVersionDailyAggCreateInput, ExposureVersionDailyAggUncheckedCreateInput>
  }

  /**
   * ExposureVersionDailyAgg createMany
   */
  export type ExposureVersionDailyAggCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many ExposureVersionDailyAggs.
     */
    data: ExposureVersionDailyAggCreateManyInput | ExposureVersionDailyAggCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * ExposureVersionDailyAgg update
   */
  export type ExposureVersionDailyAggUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExposureVersionDailyAgg
     */
    select?: ExposureVersionDailyAggSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExposureVersionDailyAgg
     */
    omit?: ExposureVersionDailyAggOmit<ExtArgs> | null
    /**
     * The data needed to update a ExposureVersionDailyAgg.
     */
    data: XOR<ExposureVersionDailyAggUpdateInput, ExposureVersionDailyAggUncheckedUpdateInput>
    /**
     * Choose, which ExposureVersionDailyAgg to update.
     */
    where: ExposureVersionDailyAggWhereUniqueInput
  }

  /**
   * ExposureVersionDailyAgg updateMany
   */
  export type ExposureVersionDailyAggUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update ExposureVersionDailyAggs.
     */
    data: XOR<ExposureVersionDailyAggUpdateManyMutationInput, ExposureVersionDailyAggUncheckedUpdateManyInput>
    /**
     * Filter which ExposureVersionDailyAggs to update
     */
    where?: ExposureVersionDailyAggWhereInput
    /**
     * Limit how many ExposureVersionDailyAggs to update.
     */
    limit?: number
  }

  /**
   * ExposureVersionDailyAgg upsert
   */
  export type ExposureVersionDailyAggUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExposureVersionDailyAgg
     */
    select?: ExposureVersionDailyAggSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExposureVersionDailyAgg
     */
    omit?: ExposureVersionDailyAggOmit<ExtArgs> | null
    /**
     * The filter to search for the ExposureVersionDailyAgg to update in case it exists.
     */
    where: ExposureVersionDailyAggWhereUniqueInput
    /**
     * In case the ExposureVersionDailyAgg found by the `where` argument doesn't exist, create a new ExposureVersionDailyAgg with this data.
     */
    create: XOR<ExposureVersionDailyAggCreateInput, ExposureVersionDailyAggUncheckedCreateInput>
    /**
     * In case the ExposureVersionDailyAgg was found with the provided `where` argument, update it with this data.
     */
    update: XOR<ExposureVersionDailyAggUpdateInput, ExposureVersionDailyAggUncheckedUpdateInput>
  }

  /**
   * ExposureVersionDailyAgg delete
   */
  export type ExposureVersionDailyAggDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExposureVersionDailyAgg
     */
    select?: ExposureVersionDailyAggSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExposureVersionDailyAgg
     */
    omit?: ExposureVersionDailyAggOmit<ExtArgs> | null
    /**
     * Filter which ExposureVersionDailyAgg to delete.
     */
    where: ExposureVersionDailyAggWhereUniqueInput
  }

  /**
   * ExposureVersionDailyAgg deleteMany
   */
  export type ExposureVersionDailyAggDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which ExposureVersionDailyAggs to delete
     */
    where?: ExposureVersionDailyAggWhereInput
    /**
     * Limit how many ExposureVersionDailyAggs to delete.
     */
    limit?: number
  }

  /**
   * ExposureVersionDailyAgg without action
   */
  export type ExposureVersionDailyAggDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the ExposureVersionDailyAgg
     */
    select?: ExposureVersionDailyAggSelect<ExtArgs> | null
    /**
     * Omit specific fields from the ExposureVersionDailyAgg
     */
    omit?: ExposureVersionDailyAggOmit<ExtArgs> | null
  }


  /**
   * Enums
   */

  export const TransactionIsolationLevel: {
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
  };

  export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel]


  export const ExposureSnapshotScalarFieldEnum: {
    id: 'id',
    dateKey: 'dateKey',
    snapshotDate: 'snapshotDate',
    sourceFile: 'sourceFile',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ExposureSnapshotScalarFieldEnum = (typeof ExposureSnapshotScalarFieldEnum)[keyof typeof ExposureSnapshotScalarFieldEnum]


  export const ExposureRecordScalarFieldEnum: {
    id: 'id',
    snapshotId: 'snapshotId',
    snapshotDate: 'snapshotDate',
    ip: 'ip',
    country: 'country',
    countryZh: 'countryZh',
    province: 'province',
    region: 'region',
    city: 'city',
    asn: 'asn',
    isp: 'isp',
    host: 'host',
    service: 'service',
    serviceDesc: 'serviceDesc',
    operator: 'operator',
    status: 'status',
    scope: 'scope',
    version: 'version',
    risk: 'risk',
    lastSeen: 'lastSeen',
    createdAt: 'createdAt'
  };

  export type ExposureRecordScalarFieldEnum = (typeof ExposureRecordScalarFieldEnum)[keyof typeof ExposureRecordScalarFieldEnum]


  export const ExposureDailyAggScalarFieldEnum: {
    snapshotDate: 'snapshotDate',
    snapshotId: 'snapshotId',
    exposedCount: 'exposedCount',
    domesticCount: 'domesticCount',
    overseasCount: 'overseasCount',
    newDistinctIpCount: 'newDistinctIpCount',
    cumulativeDistinctIpCount: 'cumulativeDistinctIpCount',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type ExposureDailyAggScalarFieldEnum = (typeof ExposureDailyAggScalarFieldEnum)[keyof typeof ExposureDailyAggScalarFieldEnum]


  export const ExposureVersionDailyAggScalarFieldEnum: {
    id: 'id',
    snapshotDate: 'snapshotDate',
    version: 'version',
    count: 'count',
    createdAt: 'createdAt'
  };

  export type ExposureVersionDailyAggScalarFieldEnum = (typeof ExposureVersionDailyAggScalarFieldEnum)[keyof typeof ExposureVersionDailyAggScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const ExposureSnapshotOrderByRelevanceFieldEnum: {
    dateKey: 'dateKey',
    sourceFile: 'sourceFile'
  };

  export type ExposureSnapshotOrderByRelevanceFieldEnum = (typeof ExposureSnapshotOrderByRelevanceFieldEnum)[keyof typeof ExposureSnapshotOrderByRelevanceFieldEnum]


  export const ExposureRecordOrderByRelevanceFieldEnum: {
    ip: 'ip',
    country: 'country',
    countryZh: 'countryZh',
    province: 'province',
    region: 'region',
    city: 'city',
    asn: 'asn',
    isp: 'isp',
    host: 'host',
    service: 'service',
    serviceDesc: 'serviceDesc',
    operator: 'operator',
    status: 'status',
    scope: 'scope',
    version: 'version',
    risk: 'risk'
  };

  export type ExposureRecordOrderByRelevanceFieldEnum = (typeof ExposureRecordOrderByRelevanceFieldEnum)[keyof typeof ExposureRecordOrderByRelevanceFieldEnum]


  export const NullsOrder: {
    first: 'first',
    last: 'last'
  };

  export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder]


  export const ExposureVersionDailyAggOrderByRelevanceFieldEnum: {
    version: 'version'
  };

  export type ExposureVersionDailyAggOrderByRelevanceFieldEnum = (typeof ExposureVersionDailyAggOrderByRelevanceFieldEnum)[keyof typeof ExposureVersionDailyAggOrderByRelevanceFieldEnum]


  /**
   * Field references
   */


  /**
   * Reference to a field of type 'Int'
   */
  export type IntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Int'>
    


  /**
   * Reference to a field of type 'String'
   */
  export type StringFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'String'>
    


  /**
   * Reference to a field of type 'DateTime'
   */
  export type DateTimeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'DateTime'>
    


  /**
   * Reference to a field of type 'BigInt'
   */
  export type BigIntFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'BigInt'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    
  /**
   * Deep Input Types
   */


  export type ExposureSnapshotWhereInput = {
    AND?: ExposureSnapshotWhereInput | ExposureSnapshotWhereInput[]
    OR?: ExposureSnapshotWhereInput[]
    NOT?: ExposureSnapshotWhereInput | ExposureSnapshotWhereInput[]
    id?: IntFilter<"ExposureSnapshot"> | number
    dateKey?: StringFilter<"ExposureSnapshot"> | string
    snapshotDate?: DateTimeFilter<"ExposureSnapshot"> | Date | string
    sourceFile?: StringFilter<"ExposureSnapshot"> | string
    createdAt?: DateTimeFilter<"ExposureSnapshot"> | Date | string
    updatedAt?: DateTimeFilter<"ExposureSnapshot"> | Date | string
    records?: ExposureRecordListRelationFilter
    dailyAgg?: XOR<ExposureDailyAggNullableScalarRelationFilter, ExposureDailyAggWhereInput> | null
  }

  export type ExposureSnapshotOrderByWithRelationInput = {
    id?: SortOrder
    dateKey?: SortOrder
    snapshotDate?: SortOrder
    sourceFile?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    records?: ExposureRecordOrderByRelationAggregateInput
    dailyAgg?: ExposureDailyAggOrderByWithRelationInput
    _relevance?: ExposureSnapshotOrderByRelevanceInput
  }

  export type ExposureSnapshotWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    dateKey?: string
    snapshotDate?: Date | string
    AND?: ExposureSnapshotWhereInput | ExposureSnapshotWhereInput[]
    OR?: ExposureSnapshotWhereInput[]
    NOT?: ExposureSnapshotWhereInput | ExposureSnapshotWhereInput[]
    sourceFile?: StringFilter<"ExposureSnapshot"> | string
    createdAt?: DateTimeFilter<"ExposureSnapshot"> | Date | string
    updatedAt?: DateTimeFilter<"ExposureSnapshot"> | Date | string
    records?: ExposureRecordListRelationFilter
    dailyAgg?: XOR<ExposureDailyAggNullableScalarRelationFilter, ExposureDailyAggWhereInput> | null
  }, "id" | "dateKey" | "snapshotDate">

  export type ExposureSnapshotOrderByWithAggregationInput = {
    id?: SortOrder
    dateKey?: SortOrder
    snapshotDate?: SortOrder
    sourceFile?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ExposureSnapshotCountOrderByAggregateInput
    _avg?: ExposureSnapshotAvgOrderByAggregateInput
    _max?: ExposureSnapshotMaxOrderByAggregateInput
    _min?: ExposureSnapshotMinOrderByAggregateInput
    _sum?: ExposureSnapshotSumOrderByAggregateInput
  }

  export type ExposureSnapshotScalarWhereWithAggregatesInput = {
    AND?: ExposureSnapshotScalarWhereWithAggregatesInput | ExposureSnapshotScalarWhereWithAggregatesInput[]
    OR?: ExposureSnapshotScalarWhereWithAggregatesInput[]
    NOT?: ExposureSnapshotScalarWhereWithAggregatesInput | ExposureSnapshotScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"ExposureSnapshot"> | number
    dateKey?: StringWithAggregatesFilter<"ExposureSnapshot"> | string
    snapshotDate?: DateTimeWithAggregatesFilter<"ExposureSnapshot"> | Date | string
    sourceFile?: StringWithAggregatesFilter<"ExposureSnapshot"> | string
    createdAt?: DateTimeWithAggregatesFilter<"ExposureSnapshot"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ExposureSnapshot"> | Date | string
  }

  export type ExposureRecordWhereInput = {
    AND?: ExposureRecordWhereInput | ExposureRecordWhereInput[]
    OR?: ExposureRecordWhereInput[]
    NOT?: ExposureRecordWhereInput | ExposureRecordWhereInput[]
    id?: BigIntFilter<"ExposureRecord"> | bigint | number
    snapshotId?: IntFilter<"ExposureRecord"> | number
    snapshotDate?: DateTimeFilter<"ExposureRecord"> | Date | string
    ip?: StringFilter<"ExposureRecord"> | string
    country?: StringFilter<"ExposureRecord"> | string
    countryZh?: StringFilter<"ExposureRecord"> | string
    province?: StringFilter<"ExposureRecord"> | string
    region?: StringFilter<"ExposureRecord"> | string
    city?: StringFilter<"ExposureRecord"> | string
    asn?: StringFilter<"ExposureRecord"> | string
    isp?: StringFilter<"ExposureRecord"> | string
    host?: StringFilter<"ExposureRecord"> | string
    service?: StringFilter<"ExposureRecord"> | string
    serviceDesc?: StringFilter<"ExposureRecord"> | string
    operator?: StringFilter<"ExposureRecord"> | string
    status?: StringFilter<"ExposureRecord"> | string
    scope?: StringFilter<"ExposureRecord"> | string
    version?: StringFilter<"ExposureRecord"> | string
    risk?: StringFilter<"ExposureRecord"> | string
    lastSeen?: DateTimeFilter<"ExposureRecord"> | Date | string
    createdAt?: DateTimeFilter<"ExposureRecord"> | Date | string
    snapshot?: XOR<ExposureSnapshotScalarRelationFilter, ExposureSnapshotWhereInput>
  }

  export type ExposureRecordOrderByWithRelationInput = {
    id?: SortOrder
    snapshotId?: SortOrder
    snapshotDate?: SortOrder
    ip?: SortOrder
    country?: SortOrder
    countryZh?: SortOrder
    province?: SortOrder
    region?: SortOrder
    city?: SortOrder
    asn?: SortOrder
    isp?: SortOrder
    host?: SortOrder
    service?: SortOrder
    serviceDesc?: SortOrder
    operator?: SortOrder
    status?: SortOrder
    scope?: SortOrder
    version?: SortOrder
    risk?: SortOrder
    lastSeen?: SortOrder
    createdAt?: SortOrder
    snapshot?: ExposureSnapshotOrderByWithRelationInput
    _relevance?: ExposureRecordOrderByRelevanceInput
  }

  export type ExposureRecordWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    snapshotId_ip?: ExposureRecordSnapshotIdIpCompoundUniqueInput
    AND?: ExposureRecordWhereInput | ExposureRecordWhereInput[]
    OR?: ExposureRecordWhereInput[]
    NOT?: ExposureRecordWhereInput | ExposureRecordWhereInput[]
    snapshotId?: IntFilter<"ExposureRecord"> | number
    snapshotDate?: DateTimeFilter<"ExposureRecord"> | Date | string
    ip?: StringFilter<"ExposureRecord"> | string
    country?: StringFilter<"ExposureRecord"> | string
    countryZh?: StringFilter<"ExposureRecord"> | string
    province?: StringFilter<"ExposureRecord"> | string
    region?: StringFilter<"ExposureRecord"> | string
    city?: StringFilter<"ExposureRecord"> | string
    asn?: StringFilter<"ExposureRecord"> | string
    isp?: StringFilter<"ExposureRecord"> | string
    host?: StringFilter<"ExposureRecord"> | string
    service?: StringFilter<"ExposureRecord"> | string
    serviceDesc?: StringFilter<"ExposureRecord"> | string
    operator?: StringFilter<"ExposureRecord"> | string
    status?: StringFilter<"ExposureRecord"> | string
    scope?: StringFilter<"ExposureRecord"> | string
    version?: StringFilter<"ExposureRecord"> | string
    risk?: StringFilter<"ExposureRecord"> | string
    lastSeen?: DateTimeFilter<"ExposureRecord"> | Date | string
    createdAt?: DateTimeFilter<"ExposureRecord"> | Date | string
    snapshot?: XOR<ExposureSnapshotScalarRelationFilter, ExposureSnapshotWhereInput>
  }, "id" | "snapshotId_ip">

  export type ExposureRecordOrderByWithAggregationInput = {
    id?: SortOrder
    snapshotId?: SortOrder
    snapshotDate?: SortOrder
    ip?: SortOrder
    country?: SortOrder
    countryZh?: SortOrder
    province?: SortOrder
    region?: SortOrder
    city?: SortOrder
    asn?: SortOrder
    isp?: SortOrder
    host?: SortOrder
    service?: SortOrder
    serviceDesc?: SortOrder
    operator?: SortOrder
    status?: SortOrder
    scope?: SortOrder
    version?: SortOrder
    risk?: SortOrder
    lastSeen?: SortOrder
    createdAt?: SortOrder
    _count?: ExposureRecordCountOrderByAggregateInput
    _avg?: ExposureRecordAvgOrderByAggregateInput
    _max?: ExposureRecordMaxOrderByAggregateInput
    _min?: ExposureRecordMinOrderByAggregateInput
    _sum?: ExposureRecordSumOrderByAggregateInput
  }

  export type ExposureRecordScalarWhereWithAggregatesInput = {
    AND?: ExposureRecordScalarWhereWithAggregatesInput | ExposureRecordScalarWhereWithAggregatesInput[]
    OR?: ExposureRecordScalarWhereWithAggregatesInput[]
    NOT?: ExposureRecordScalarWhereWithAggregatesInput | ExposureRecordScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"ExposureRecord"> | bigint | number
    snapshotId?: IntWithAggregatesFilter<"ExposureRecord"> | number
    snapshotDate?: DateTimeWithAggregatesFilter<"ExposureRecord"> | Date | string
    ip?: StringWithAggregatesFilter<"ExposureRecord"> | string
    country?: StringWithAggregatesFilter<"ExposureRecord"> | string
    countryZh?: StringWithAggregatesFilter<"ExposureRecord"> | string
    province?: StringWithAggregatesFilter<"ExposureRecord"> | string
    region?: StringWithAggregatesFilter<"ExposureRecord"> | string
    city?: StringWithAggregatesFilter<"ExposureRecord"> | string
    asn?: StringWithAggregatesFilter<"ExposureRecord"> | string
    isp?: StringWithAggregatesFilter<"ExposureRecord"> | string
    host?: StringWithAggregatesFilter<"ExposureRecord"> | string
    service?: StringWithAggregatesFilter<"ExposureRecord"> | string
    serviceDesc?: StringWithAggregatesFilter<"ExposureRecord"> | string
    operator?: StringWithAggregatesFilter<"ExposureRecord"> | string
    status?: StringWithAggregatesFilter<"ExposureRecord"> | string
    scope?: StringWithAggregatesFilter<"ExposureRecord"> | string
    version?: StringWithAggregatesFilter<"ExposureRecord"> | string
    risk?: StringWithAggregatesFilter<"ExposureRecord"> | string
    lastSeen?: DateTimeWithAggregatesFilter<"ExposureRecord"> | Date | string
    createdAt?: DateTimeWithAggregatesFilter<"ExposureRecord"> | Date | string
  }

  export type ExposureDailyAggWhereInput = {
    AND?: ExposureDailyAggWhereInput | ExposureDailyAggWhereInput[]
    OR?: ExposureDailyAggWhereInput[]
    NOT?: ExposureDailyAggWhereInput | ExposureDailyAggWhereInput[]
    snapshotDate?: DateTimeFilter<"ExposureDailyAgg"> | Date | string
    snapshotId?: IntNullableFilter<"ExposureDailyAgg"> | number | null
    exposedCount?: IntFilter<"ExposureDailyAgg"> | number
    domesticCount?: IntFilter<"ExposureDailyAgg"> | number
    overseasCount?: IntFilter<"ExposureDailyAgg"> | number
    newDistinctIpCount?: IntFilter<"ExposureDailyAgg"> | number
    cumulativeDistinctIpCount?: IntFilter<"ExposureDailyAgg"> | number
    createdAt?: DateTimeFilter<"ExposureDailyAgg"> | Date | string
    updatedAt?: DateTimeFilter<"ExposureDailyAgg"> | Date | string
    snapshot?: XOR<ExposureSnapshotNullableScalarRelationFilter, ExposureSnapshotWhereInput> | null
  }

  export type ExposureDailyAggOrderByWithRelationInput = {
    snapshotDate?: SortOrder
    snapshotId?: SortOrderInput | SortOrder
    exposedCount?: SortOrder
    domesticCount?: SortOrder
    overseasCount?: SortOrder
    newDistinctIpCount?: SortOrder
    cumulativeDistinctIpCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    snapshot?: ExposureSnapshotOrderByWithRelationInput
  }

  export type ExposureDailyAggWhereUniqueInput = Prisma.AtLeast<{
    snapshotDate?: Date | string
    snapshotId?: number
    AND?: ExposureDailyAggWhereInput | ExposureDailyAggWhereInput[]
    OR?: ExposureDailyAggWhereInput[]
    NOT?: ExposureDailyAggWhereInput | ExposureDailyAggWhereInput[]
    exposedCount?: IntFilter<"ExposureDailyAgg"> | number
    domesticCount?: IntFilter<"ExposureDailyAgg"> | number
    overseasCount?: IntFilter<"ExposureDailyAgg"> | number
    newDistinctIpCount?: IntFilter<"ExposureDailyAgg"> | number
    cumulativeDistinctIpCount?: IntFilter<"ExposureDailyAgg"> | number
    createdAt?: DateTimeFilter<"ExposureDailyAgg"> | Date | string
    updatedAt?: DateTimeFilter<"ExposureDailyAgg"> | Date | string
    snapshot?: XOR<ExposureSnapshotNullableScalarRelationFilter, ExposureSnapshotWhereInput> | null
  }, "snapshotDate" | "snapshotId">

  export type ExposureDailyAggOrderByWithAggregationInput = {
    snapshotDate?: SortOrder
    snapshotId?: SortOrderInput | SortOrder
    exposedCount?: SortOrder
    domesticCount?: SortOrder
    overseasCount?: SortOrder
    newDistinctIpCount?: SortOrder
    cumulativeDistinctIpCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: ExposureDailyAggCountOrderByAggregateInput
    _avg?: ExposureDailyAggAvgOrderByAggregateInput
    _max?: ExposureDailyAggMaxOrderByAggregateInput
    _min?: ExposureDailyAggMinOrderByAggregateInput
    _sum?: ExposureDailyAggSumOrderByAggregateInput
  }

  export type ExposureDailyAggScalarWhereWithAggregatesInput = {
    AND?: ExposureDailyAggScalarWhereWithAggregatesInput | ExposureDailyAggScalarWhereWithAggregatesInput[]
    OR?: ExposureDailyAggScalarWhereWithAggregatesInput[]
    NOT?: ExposureDailyAggScalarWhereWithAggregatesInput | ExposureDailyAggScalarWhereWithAggregatesInput[]
    snapshotDate?: DateTimeWithAggregatesFilter<"ExposureDailyAgg"> | Date | string
    snapshotId?: IntNullableWithAggregatesFilter<"ExposureDailyAgg"> | number | null
    exposedCount?: IntWithAggregatesFilter<"ExposureDailyAgg"> | number
    domesticCount?: IntWithAggregatesFilter<"ExposureDailyAgg"> | number
    overseasCount?: IntWithAggregatesFilter<"ExposureDailyAgg"> | number
    newDistinctIpCount?: IntWithAggregatesFilter<"ExposureDailyAgg"> | number
    cumulativeDistinctIpCount?: IntWithAggregatesFilter<"ExposureDailyAgg"> | number
    createdAt?: DateTimeWithAggregatesFilter<"ExposureDailyAgg"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"ExposureDailyAgg"> | Date | string
  }

  export type ExposureVersionDailyAggWhereInput = {
    AND?: ExposureVersionDailyAggWhereInput | ExposureVersionDailyAggWhereInput[]
    OR?: ExposureVersionDailyAggWhereInput[]
    NOT?: ExposureVersionDailyAggWhereInput | ExposureVersionDailyAggWhereInput[]
    id?: BigIntFilter<"ExposureVersionDailyAgg"> | bigint | number
    snapshotDate?: DateTimeFilter<"ExposureVersionDailyAgg"> | Date | string
    version?: StringFilter<"ExposureVersionDailyAgg"> | string
    count?: IntFilter<"ExposureVersionDailyAgg"> | number
    createdAt?: DateTimeFilter<"ExposureVersionDailyAgg"> | Date | string
  }

  export type ExposureVersionDailyAggOrderByWithRelationInput = {
    id?: SortOrder
    snapshotDate?: SortOrder
    version?: SortOrder
    count?: SortOrder
    createdAt?: SortOrder
    _relevance?: ExposureVersionDailyAggOrderByRelevanceInput
  }

  export type ExposureVersionDailyAggWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    snapshotDate_version?: ExposureVersionDailyAggSnapshotDateVersionCompoundUniqueInput
    AND?: ExposureVersionDailyAggWhereInput | ExposureVersionDailyAggWhereInput[]
    OR?: ExposureVersionDailyAggWhereInput[]
    NOT?: ExposureVersionDailyAggWhereInput | ExposureVersionDailyAggWhereInput[]
    snapshotDate?: DateTimeFilter<"ExposureVersionDailyAgg"> | Date | string
    version?: StringFilter<"ExposureVersionDailyAgg"> | string
    count?: IntFilter<"ExposureVersionDailyAgg"> | number
    createdAt?: DateTimeFilter<"ExposureVersionDailyAgg"> | Date | string
  }, "id" | "snapshotDate_version">

  export type ExposureVersionDailyAggOrderByWithAggregationInput = {
    id?: SortOrder
    snapshotDate?: SortOrder
    version?: SortOrder
    count?: SortOrder
    createdAt?: SortOrder
    _count?: ExposureVersionDailyAggCountOrderByAggregateInput
    _avg?: ExposureVersionDailyAggAvgOrderByAggregateInput
    _max?: ExposureVersionDailyAggMaxOrderByAggregateInput
    _min?: ExposureVersionDailyAggMinOrderByAggregateInput
    _sum?: ExposureVersionDailyAggSumOrderByAggregateInput
  }

  export type ExposureVersionDailyAggScalarWhereWithAggregatesInput = {
    AND?: ExposureVersionDailyAggScalarWhereWithAggregatesInput | ExposureVersionDailyAggScalarWhereWithAggregatesInput[]
    OR?: ExposureVersionDailyAggScalarWhereWithAggregatesInput[]
    NOT?: ExposureVersionDailyAggScalarWhereWithAggregatesInput | ExposureVersionDailyAggScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"ExposureVersionDailyAgg"> | bigint | number
    snapshotDate?: DateTimeWithAggregatesFilter<"ExposureVersionDailyAgg"> | Date | string
    version?: StringWithAggregatesFilter<"ExposureVersionDailyAgg"> | string
    count?: IntWithAggregatesFilter<"ExposureVersionDailyAgg"> | number
    createdAt?: DateTimeWithAggregatesFilter<"ExposureVersionDailyAgg"> | Date | string
  }

  export type ExposureSnapshotCreateInput = {
    dateKey: string
    snapshotDate: Date | string
    sourceFile: string
    createdAt?: Date | string
    updatedAt?: Date | string
    records?: ExposureRecordCreateNestedManyWithoutSnapshotInput
    dailyAgg?: ExposureDailyAggCreateNestedOneWithoutSnapshotInput
  }

  export type ExposureSnapshotUncheckedCreateInput = {
    id?: number
    dateKey: string
    snapshotDate: Date | string
    sourceFile: string
    createdAt?: Date | string
    updatedAt?: Date | string
    records?: ExposureRecordUncheckedCreateNestedManyWithoutSnapshotInput
    dailyAgg?: ExposureDailyAggUncheckedCreateNestedOneWithoutSnapshotInput
  }

  export type ExposureSnapshotUpdateInput = {
    dateKey?: StringFieldUpdateOperationsInput | string
    snapshotDate?: DateTimeFieldUpdateOperationsInput | Date | string
    sourceFile?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    records?: ExposureRecordUpdateManyWithoutSnapshotNestedInput
    dailyAgg?: ExposureDailyAggUpdateOneWithoutSnapshotNestedInput
  }

  export type ExposureSnapshotUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    dateKey?: StringFieldUpdateOperationsInput | string
    snapshotDate?: DateTimeFieldUpdateOperationsInput | Date | string
    sourceFile?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    records?: ExposureRecordUncheckedUpdateManyWithoutSnapshotNestedInput
    dailyAgg?: ExposureDailyAggUncheckedUpdateOneWithoutSnapshotNestedInput
  }

  export type ExposureSnapshotCreateManyInput = {
    id?: number
    dateKey: string
    snapshotDate: Date | string
    sourceFile: string
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ExposureSnapshotUpdateManyMutationInput = {
    dateKey?: StringFieldUpdateOperationsInput | string
    snapshotDate?: DateTimeFieldUpdateOperationsInput | Date | string
    sourceFile?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExposureSnapshotUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    dateKey?: StringFieldUpdateOperationsInput | string
    snapshotDate?: DateTimeFieldUpdateOperationsInput | Date | string
    sourceFile?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExposureRecordCreateInput = {
    id?: bigint | number
    snapshotDate: Date | string
    ip: string
    country?: string
    countryZh?: string
    province?: string
    region?: string
    city?: string
    asn?: string
    isp?: string
    host?: string
    service?: string
    serviceDesc?: string
    operator?: string
    status?: string
    scope?: string
    version?: string
    risk?: string
    lastSeen: Date | string
    createdAt?: Date | string
    snapshot: ExposureSnapshotCreateNestedOneWithoutRecordsInput
  }

  export type ExposureRecordUncheckedCreateInput = {
    id?: bigint | number
    snapshotId: number
    snapshotDate: Date | string
    ip: string
    country?: string
    countryZh?: string
    province?: string
    region?: string
    city?: string
    asn?: string
    isp?: string
    host?: string
    service?: string
    serviceDesc?: string
    operator?: string
    status?: string
    scope?: string
    version?: string
    risk?: string
    lastSeen: Date | string
    createdAt?: Date | string
  }

  export type ExposureRecordUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    snapshotDate?: DateTimeFieldUpdateOperationsInput | Date | string
    ip?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    countryZh?: StringFieldUpdateOperationsInput | string
    province?: StringFieldUpdateOperationsInput | string
    region?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    asn?: StringFieldUpdateOperationsInput | string
    isp?: StringFieldUpdateOperationsInput | string
    host?: StringFieldUpdateOperationsInput | string
    service?: StringFieldUpdateOperationsInput | string
    serviceDesc?: StringFieldUpdateOperationsInput | string
    operator?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    scope?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    risk?: StringFieldUpdateOperationsInput | string
    lastSeen?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    snapshot?: ExposureSnapshotUpdateOneRequiredWithoutRecordsNestedInput
  }

  export type ExposureRecordUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    snapshotId?: IntFieldUpdateOperationsInput | number
    snapshotDate?: DateTimeFieldUpdateOperationsInput | Date | string
    ip?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    countryZh?: StringFieldUpdateOperationsInput | string
    province?: StringFieldUpdateOperationsInput | string
    region?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    asn?: StringFieldUpdateOperationsInput | string
    isp?: StringFieldUpdateOperationsInput | string
    host?: StringFieldUpdateOperationsInput | string
    service?: StringFieldUpdateOperationsInput | string
    serviceDesc?: StringFieldUpdateOperationsInput | string
    operator?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    scope?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    risk?: StringFieldUpdateOperationsInput | string
    lastSeen?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExposureRecordCreateManyInput = {
    id?: bigint | number
    snapshotId: number
    snapshotDate: Date | string
    ip: string
    country?: string
    countryZh?: string
    province?: string
    region?: string
    city?: string
    asn?: string
    isp?: string
    host?: string
    service?: string
    serviceDesc?: string
    operator?: string
    status?: string
    scope?: string
    version?: string
    risk?: string
    lastSeen: Date | string
    createdAt?: Date | string
  }

  export type ExposureRecordUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    snapshotDate?: DateTimeFieldUpdateOperationsInput | Date | string
    ip?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    countryZh?: StringFieldUpdateOperationsInput | string
    province?: StringFieldUpdateOperationsInput | string
    region?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    asn?: StringFieldUpdateOperationsInput | string
    isp?: StringFieldUpdateOperationsInput | string
    host?: StringFieldUpdateOperationsInput | string
    service?: StringFieldUpdateOperationsInput | string
    serviceDesc?: StringFieldUpdateOperationsInput | string
    operator?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    scope?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    risk?: StringFieldUpdateOperationsInput | string
    lastSeen?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExposureRecordUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    snapshotId?: IntFieldUpdateOperationsInput | number
    snapshotDate?: DateTimeFieldUpdateOperationsInput | Date | string
    ip?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    countryZh?: StringFieldUpdateOperationsInput | string
    province?: StringFieldUpdateOperationsInput | string
    region?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    asn?: StringFieldUpdateOperationsInput | string
    isp?: StringFieldUpdateOperationsInput | string
    host?: StringFieldUpdateOperationsInput | string
    service?: StringFieldUpdateOperationsInput | string
    serviceDesc?: StringFieldUpdateOperationsInput | string
    operator?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    scope?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    risk?: StringFieldUpdateOperationsInput | string
    lastSeen?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExposureDailyAggCreateInput = {
    snapshotDate: Date | string
    exposedCount: number
    domesticCount?: number
    overseasCount?: number
    newDistinctIpCount?: number
    cumulativeDistinctIpCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
    snapshot?: ExposureSnapshotCreateNestedOneWithoutDailyAggInput
  }

  export type ExposureDailyAggUncheckedCreateInput = {
    snapshotDate: Date | string
    snapshotId?: number | null
    exposedCount: number
    domesticCount?: number
    overseasCount?: number
    newDistinctIpCount?: number
    cumulativeDistinctIpCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ExposureDailyAggUpdateInput = {
    snapshotDate?: DateTimeFieldUpdateOperationsInput | Date | string
    exposedCount?: IntFieldUpdateOperationsInput | number
    domesticCount?: IntFieldUpdateOperationsInput | number
    overseasCount?: IntFieldUpdateOperationsInput | number
    newDistinctIpCount?: IntFieldUpdateOperationsInput | number
    cumulativeDistinctIpCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    snapshot?: ExposureSnapshotUpdateOneWithoutDailyAggNestedInput
  }

  export type ExposureDailyAggUncheckedUpdateInput = {
    snapshotDate?: DateTimeFieldUpdateOperationsInput | Date | string
    snapshotId?: NullableIntFieldUpdateOperationsInput | number | null
    exposedCount?: IntFieldUpdateOperationsInput | number
    domesticCount?: IntFieldUpdateOperationsInput | number
    overseasCount?: IntFieldUpdateOperationsInput | number
    newDistinctIpCount?: IntFieldUpdateOperationsInput | number
    cumulativeDistinctIpCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExposureDailyAggCreateManyInput = {
    snapshotDate: Date | string
    snapshotId?: number | null
    exposedCount: number
    domesticCount?: number
    overseasCount?: number
    newDistinctIpCount?: number
    cumulativeDistinctIpCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ExposureDailyAggUpdateManyMutationInput = {
    snapshotDate?: DateTimeFieldUpdateOperationsInput | Date | string
    exposedCount?: IntFieldUpdateOperationsInput | number
    domesticCount?: IntFieldUpdateOperationsInput | number
    overseasCount?: IntFieldUpdateOperationsInput | number
    newDistinctIpCount?: IntFieldUpdateOperationsInput | number
    cumulativeDistinctIpCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExposureDailyAggUncheckedUpdateManyInput = {
    snapshotDate?: DateTimeFieldUpdateOperationsInput | Date | string
    snapshotId?: NullableIntFieldUpdateOperationsInput | number | null
    exposedCount?: IntFieldUpdateOperationsInput | number
    domesticCount?: IntFieldUpdateOperationsInput | number
    overseasCount?: IntFieldUpdateOperationsInput | number
    newDistinctIpCount?: IntFieldUpdateOperationsInput | number
    cumulativeDistinctIpCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExposureVersionDailyAggCreateInput = {
    id?: bigint | number
    snapshotDate: Date | string
    version: string
    count: number
    createdAt?: Date | string
  }

  export type ExposureVersionDailyAggUncheckedCreateInput = {
    id?: bigint | number
    snapshotDate: Date | string
    version: string
    count: number
    createdAt?: Date | string
  }

  export type ExposureVersionDailyAggUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    snapshotDate?: DateTimeFieldUpdateOperationsInput | Date | string
    version?: StringFieldUpdateOperationsInput | string
    count?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExposureVersionDailyAggUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    snapshotDate?: DateTimeFieldUpdateOperationsInput | Date | string
    version?: StringFieldUpdateOperationsInput | string
    count?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExposureVersionDailyAggCreateManyInput = {
    id?: bigint | number
    snapshotDate: Date | string
    version: string
    count: number
    createdAt?: Date | string
  }

  export type ExposureVersionDailyAggUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    snapshotDate?: DateTimeFieldUpdateOperationsInput | Date | string
    version?: StringFieldUpdateOperationsInput | string
    count?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExposureVersionDailyAggUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    snapshotDate?: DateTimeFieldUpdateOperationsInput | Date | string
    version?: StringFieldUpdateOperationsInput | string
    count?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type IntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type StringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type DateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type ExposureRecordListRelationFilter = {
    every?: ExposureRecordWhereInput
    some?: ExposureRecordWhereInput
    none?: ExposureRecordWhereInput
  }

  export type ExposureDailyAggNullableScalarRelationFilter = {
    is?: ExposureDailyAggWhereInput | null
    isNot?: ExposureDailyAggWhereInput | null
  }

  export type ExposureRecordOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type ExposureSnapshotOrderByRelevanceInput = {
    fields: ExposureSnapshotOrderByRelevanceFieldEnum | ExposureSnapshotOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type ExposureSnapshotCountOrderByAggregateInput = {
    id?: SortOrder
    dateKey?: SortOrder
    snapshotDate?: SortOrder
    sourceFile?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ExposureSnapshotAvgOrderByAggregateInput = {
    id?: SortOrder
  }

  export type ExposureSnapshotMaxOrderByAggregateInput = {
    id?: SortOrder
    dateKey?: SortOrder
    snapshotDate?: SortOrder
    sourceFile?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ExposureSnapshotMinOrderByAggregateInput = {
    id?: SortOrder
    dateKey?: SortOrder
    snapshotDate?: SortOrder
    sourceFile?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ExposureSnapshotSumOrderByAggregateInput = {
    id?: SortOrder
  }

  export type IntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type StringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type DateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type BigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type ExposureSnapshotScalarRelationFilter = {
    is?: ExposureSnapshotWhereInput
    isNot?: ExposureSnapshotWhereInput
  }

  export type ExposureRecordOrderByRelevanceInput = {
    fields: ExposureRecordOrderByRelevanceFieldEnum | ExposureRecordOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type ExposureRecordSnapshotIdIpCompoundUniqueInput = {
    snapshotId: number
    ip: string
  }

  export type ExposureRecordCountOrderByAggregateInput = {
    id?: SortOrder
    snapshotId?: SortOrder
    snapshotDate?: SortOrder
    ip?: SortOrder
    country?: SortOrder
    countryZh?: SortOrder
    province?: SortOrder
    region?: SortOrder
    city?: SortOrder
    asn?: SortOrder
    isp?: SortOrder
    host?: SortOrder
    service?: SortOrder
    serviceDesc?: SortOrder
    operator?: SortOrder
    status?: SortOrder
    scope?: SortOrder
    version?: SortOrder
    risk?: SortOrder
    lastSeen?: SortOrder
    createdAt?: SortOrder
  }

  export type ExposureRecordAvgOrderByAggregateInput = {
    id?: SortOrder
    snapshotId?: SortOrder
  }

  export type ExposureRecordMaxOrderByAggregateInput = {
    id?: SortOrder
    snapshotId?: SortOrder
    snapshotDate?: SortOrder
    ip?: SortOrder
    country?: SortOrder
    countryZh?: SortOrder
    province?: SortOrder
    region?: SortOrder
    city?: SortOrder
    asn?: SortOrder
    isp?: SortOrder
    host?: SortOrder
    service?: SortOrder
    serviceDesc?: SortOrder
    operator?: SortOrder
    status?: SortOrder
    scope?: SortOrder
    version?: SortOrder
    risk?: SortOrder
    lastSeen?: SortOrder
    createdAt?: SortOrder
  }

  export type ExposureRecordMinOrderByAggregateInput = {
    id?: SortOrder
    snapshotId?: SortOrder
    snapshotDate?: SortOrder
    ip?: SortOrder
    country?: SortOrder
    countryZh?: SortOrder
    province?: SortOrder
    region?: SortOrder
    city?: SortOrder
    asn?: SortOrder
    isp?: SortOrder
    host?: SortOrder
    service?: SortOrder
    serviceDesc?: SortOrder
    operator?: SortOrder
    status?: SortOrder
    scope?: SortOrder
    version?: SortOrder
    risk?: SortOrder
    lastSeen?: SortOrder
    createdAt?: SortOrder
  }

  export type ExposureRecordSumOrderByAggregateInput = {
    id?: SortOrder
    snapshotId?: SortOrder
  }

  export type BigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type IntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type ExposureSnapshotNullableScalarRelationFilter = {
    is?: ExposureSnapshotWhereInput | null
    isNot?: ExposureSnapshotWhereInput | null
  }

  export type SortOrderInput = {
    sort: SortOrder
    nulls?: NullsOrder
  }

  export type ExposureDailyAggCountOrderByAggregateInput = {
    snapshotDate?: SortOrder
    snapshotId?: SortOrder
    exposedCount?: SortOrder
    domesticCount?: SortOrder
    overseasCount?: SortOrder
    newDistinctIpCount?: SortOrder
    cumulativeDistinctIpCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ExposureDailyAggAvgOrderByAggregateInput = {
    snapshotId?: SortOrder
    exposedCount?: SortOrder
    domesticCount?: SortOrder
    overseasCount?: SortOrder
    newDistinctIpCount?: SortOrder
    cumulativeDistinctIpCount?: SortOrder
  }

  export type ExposureDailyAggMaxOrderByAggregateInput = {
    snapshotDate?: SortOrder
    snapshotId?: SortOrder
    exposedCount?: SortOrder
    domesticCount?: SortOrder
    overseasCount?: SortOrder
    newDistinctIpCount?: SortOrder
    cumulativeDistinctIpCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ExposureDailyAggMinOrderByAggregateInput = {
    snapshotDate?: SortOrder
    snapshotId?: SortOrder
    exposedCount?: SortOrder
    domesticCount?: SortOrder
    overseasCount?: SortOrder
    newDistinctIpCount?: SortOrder
    cumulativeDistinctIpCount?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type ExposureDailyAggSumOrderByAggregateInput = {
    snapshotId?: SortOrder
    exposedCount?: SortOrder
    domesticCount?: SortOrder
    overseasCount?: SortOrder
    newDistinctIpCount?: SortOrder
    cumulativeDistinctIpCount?: SortOrder
  }

  export type IntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type ExposureVersionDailyAggOrderByRelevanceInput = {
    fields: ExposureVersionDailyAggOrderByRelevanceFieldEnum | ExposureVersionDailyAggOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type ExposureVersionDailyAggSnapshotDateVersionCompoundUniqueInput = {
    snapshotDate: Date | string
    version: string
  }

  export type ExposureVersionDailyAggCountOrderByAggregateInput = {
    id?: SortOrder
    snapshotDate?: SortOrder
    version?: SortOrder
    count?: SortOrder
    createdAt?: SortOrder
  }

  export type ExposureVersionDailyAggAvgOrderByAggregateInput = {
    id?: SortOrder
    count?: SortOrder
  }

  export type ExposureVersionDailyAggMaxOrderByAggregateInput = {
    id?: SortOrder
    snapshotDate?: SortOrder
    version?: SortOrder
    count?: SortOrder
    createdAt?: SortOrder
  }

  export type ExposureVersionDailyAggMinOrderByAggregateInput = {
    id?: SortOrder
    snapshotDate?: SortOrder
    version?: SortOrder
    count?: SortOrder
    createdAt?: SortOrder
  }

  export type ExposureVersionDailyAggSumOrderByAggregateInput = {
    id?: SortOrder
    count?: SortOrder
  }

  export type ExposureRecordCreateNestedManyWithoutSnapshotInput = {
    create?: XOR<ExposureRecordCreateWithoutSnapshotInput, ExposureRecordUncheckedCreateWithoutSnapshotInput> | ExposureRecordCreateWithoutSnapshotInput[] | ExposureRecordUncheckedCreateWithoutSnapshotInput[]
    connectOrCreate?: ExposureRecordCreateOrConnectWithoutSnapshotInput | ExposureRecordCreateOrConnectWithoutSnapshotInput[]
    createMany?: ExposureRecordCreateManySnapshotInputEnvelope
    connect?: ExposureRecordWhereUniqueInput | ExposureRecordWhereUniqueInput[]
  }

  export type ExposureDailyAggCreateNestedOneWithoutSnapshotInput = {
    create?: XOR<ExposureDailyAggCreateWithoutSnapshotInput, ExposureDailyAggUncheckedCreateWithoutSnapshotInput>
    connectOrCreate?: ExposureDailyAggCreateOrConnectWithoutSnapshotInput
    connect?: ExposureDailyAggWhereUniqueInput
  }

  export type ExposureRecordUncheckedCreateNestedManyWithoutSnapshotInput = {
    create?: XOR<ExposureRecordCreateWithoutSnapshotInput, ExposureRecordUncheckedCreateWithoutSnapshotInput> | ExposureRecordCreateWithoutSnapshotInput[] | ExposureRecordUncheckedCreateWithoutSnapshotInput[]
    connectOrCreate?: ExposureRecordCreateOrConnectWithoutSnapshotInput | ExposureRecordCreateOrConnectWithoutSnapshotInput[]
    createMany?: ExposureRecordCreateManySnapshotInputEnvelope
    connect?: ExposureRecordWhereUniqueInput | ExposureRecordWhereUniqueInput[]
  }

  export type ExposureDailyAggUncheckedCreateNestedOneWithoutSnapshotInput = {
    create?: XOR<ExposureDailyAggCreateWithoutSnapshotInput, ExposureDailyAggUncheckedCreateWithoutSnapshotInput>
    connectOrCreate?: ExposureDailyAggCreateOrConnectWithoutSnapshotInput
    connect?: ExposureDailyAggWhereUniqueInput
  }

  export type StringFieldUpdateOperationsInput = {
    set?: string
  }

  export type DateTimeFieldUpdateOperationsInput = {
    set?: Date | string
  }

  export type ExposureRecordUpdateManyWithoutSnapshotNestedInput = {
    create?: XOR<ExposureRecordCreateWithoutSnapshotInput, ExposureRecordUncheckedCreateWithoutSnapshotInput> | ExposureRecordCreateWithoutSnapshotInput[] | ExposureRecordUncheckedCreateWithoutSnapshotInput[]
    connectOrCreate?: ExposureRecordCreateOrConnectWithoutSnapshotInput | ExposureRecordCreateOrConnectWithoutSnapshotInput[]
    upsert?: ExposureRecordUpsertWithWhereUniqueWithoutSnapshotInput | ExposureRecordUpsertWithWhereUniqueWithoutSnapshotInput[]
    createMany?: ExposureRecordCreateManySnapshotInputEnvelope
    set?: ExposureRecordWhereUniqueInput | ExposureRecordWhereUniqueInput[]
    disconnect?: ExposureRecordWhereUniqueInput | ExposureRecordWhereUniqueInput[]
    delete?: ExposureRecordWhereUniqueInput | ExposureRecordWhereUniqueInput[]
    connect?: ExposureRecordWhereUniqueInput | ExposureRecordWhereUniqueInput[]
    update?: ExposureRecordUpdateWithWhereUniqueWithoutSnapshotInput | ExposureRecordUpdateWithWhereUniqueWithoutSnapshotInput[]
    updateMany?: ExposureRecordUpdateManyWithWhereWithoutSnapshotInput | ExposureRecordUpdateManyWithWhereWithoutSnapshotInput[]
    deleteMany?: ExposureRecordScalarWhereInput | ExposureRecordScalarWhereInput[]
  }

  export type ExposureDailyAggUpdateOneWithoutSnapshotNestedInput = {
    create?: XOR<ExposureDailyAggCreateWithoutSnapshotInput, ExposureDailyAggUncheckedCreateWithoutSnapshotInput>
    connectOrCreate?: ExposureDailyAggCreateOrConnectWithoutSnapshotInput
    upsert?: ExposureDailyAggUpsertWithoutSnapshotInput
    disconnect?: ExposureDailyAggWhereInput | boolean
    delete?: ExposureDailyAggWhereInput | boolean
    connect?: ExposureDailyAggWhereUniqueInput
    update?: XOR<XOR<ExposureDailyAggUpdateToOneWithWhereWithoutSnapshotInput, ExposureDailyAggUpdateWithoutSnapshotInput>, ExposureDailyAggUncheckedUpdateWithoutSnapshotInput>
  }

  export type IntFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type ExposureRecordUncheckedUpdateManyWithoutSnapshotNestedInput = {
    create?: XOR<ExposureRecordCreateWithoutSnapshotInput, ExposureRecordUncheckedCreateWithoutSnapshotInput> | ExposureRecordCreateWithoutSnapshotInput[] | ExposureRecordUncheckedCreateWithoutSnapshotInput[]
    connectOrCreate?: ExposureRecordCreateOrConnectWithoutSnapshotInput | ExposureRecordCreateOrConnectWithoutSnapshotInput[]
    upsert?: ExposureRecordUpsertWithWhereUniqueWithoutSnapshotInput | ExposureRecordUpsertWithWhereUniqueWithoutSnapshotInput[]
    createMany?: ExposureRecordCreateManySnapshotInputEnvelope
    set?: ExposureRecordWhereUniqueInput | ExposureRecordWhereUniqueInput[]
    disconnect?: ExposureRecordWhereUniqueInput | ExposureRecordWhereUniqueInput[]
    delete?: ExposureRecordWhereUniqueInput | ExposureRecordWhereUniqueInput[]
    connect?: ExposureRecordWhereUniqueInput | ExposureRecordWhereUniqueInput[]
    update?: ExposureRecordUpdateWithWhereUniqueWithoutSnapshotInput | ExposureRecordUpdateWithWhereUniqueWithoutSnapshotInput[]
    updateMany?: ExposureRecordUpdateManyWithWhereWithoutSnapshotInput | ExposureRecordUpdateManyWithWhereWithoutSnapshotInput[]
    deleteMany?: ExposureRecordScalarWhereInput | ExposureRecordScalarWhereInput[]
  }

  export type ExposureDailyAggUncheckedUpdateOneWithoutSnapshotNestedInput = {
    create?: XOR<ExposureDailyAggCreateWithoutSnapshotInput, ExposureDailyAggUncheckedCreateWithoutSnapshotInput>
    connectOrCreate?: ExposureDailyAggCreateOrConnectWithoutSnapshotInput
    upsert?: ExposureDailyAggUpsertWithoutSnapshotInput
    disconnect?: ExposureDailyAggWhereInput | boolean
    delete?: ExposureDailyAggWhereInput | boolean
    connect?: ExposureDailyAggWhereUniqueInput
    update?: XOR<XOR<ExposureDailyAggUpdateToOneWithWhereWithoutSnapshotInput, ExposureDailyAggUpdateWithoutSnapshotInput>, ExposureDailyAggUncheckedUpdateWithoutSnapshotInput>
  }

  export type ExposureSnapshotCreateNestedOneWithoutRecordsInput = {
    create?: XOR<ExposureSnapshotCreateWithoutRecordsInput, ExposureSnapshotUncheckedCreateWithoutRecordsInput>
    connectOrCreate?: ExposureSnapshotCreateOrConnectWithoutRecordsInput
    connect?: ExposureSnapshotWhereUniqueInput
  }

  export type BigIntFieldUpdateOperationsInput = {
    set?: bigint | number
    increment?: bigint | number
    decrement?: bigint | number
    multiply?: bigint | number
    divide?: bigint | number
  }

  export type ExposureSnapshotUpdateOneRequiredWithoutRecordsNestedInput = {
    create?: XOR<ExposureSnapshotCreateWithoutRecordsInput, ExposureSnapshotUncheckedCreateWithoutRecordsInput>
    connectOrCreate?: ExposureSnapshotCreateOrConnectWithoutRecordsInput
    upsert?: ExposureSnapshotUpsertWithoutRecordsInput
    connect?: ExposureSnapshotWhereUniqueInput
    update?: XOR<XOR<ExposureSnapshotUpdateToOneWithWhereWithoutRecordsInput, ExposureSnapshotUpdateWithoutRecordsInput>, ExposureSnapshotUncheckedUpdateWithoutRecordsInput>
  }

  export type ExposureSnapshotCreateNestedOneWithoutDailyAggInput = {
    create?: XOR<ExposureSnapshotCreateWithoutDailyAggInput, ExposureSnapshotUncheckedCreateWithoutDailyAggInput>
    connectOrCreate?: ExposureSnapshotCreateOrConnectWithoutDailyAggInput
    connect?: ExposureSnapshotWhereUniqueInput
  }

  export type ExposureSnapshotUpdateOneWithoutDailyAggNestedInput = {
    create?: XOR<ExposureSnapshotCreateWithoutDailyAggInput, ExposureSnapshotUncheckedCreateWithoutDailyAggInput>
    connectOrCreate?: ExposureSnapshotCreateOrConnectWithoutDailyAggInput
    upsert?: ExposureSnapshotUpsertWithoutDailyAggInput
    disconnect?: ExposureSnapshotWhereInput | boolean
    delete?: ExposureSnapshotWhereInput | boolean
    connect?: ExposureSnapshotWhereUniqueInput
    update?: XOR<XOR<ExposureSnapshotUpdateToOneWithWhereWithoutDailyAggInput, ExposureSnapshotUpdateWithoutDailyAggInput>, ExposureSnapshotUncheckedUpdateWithoutDailyAggInput>
  }

  export type NullableIntFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type NestedIntFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntFilter<$PrismaModel> | number
  }

  export type NestedStringFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringFilter<$PrismaModel> | string
  }

  export type NestedDateTimeFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeFilter<$PrismaModel> | Date | string
  }

  export type NestedIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedIntFilter<$PrismaModel>
    _min?: NestedIntFilter<$PrismaModel>
    _max?: NestedIntFilter<$PrismaModel>
  }

  export type NestedFloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type NestedStringWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel>
    in?: string[]
    notIn?: string[]
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringWithAggregatesFilter<$PrismaModel> | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedStringFilter<$PrismaModel>
    _max?: NestedStringFilter<$PrismaModel>
  }

  export type NestedDateTimeWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    in?: Date[] | string[]
    notIn?: Date[] | string[]
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeWithAggregatesFilter<$PrismaModel> | Date | string
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedDateTimeFilter<$PrismaModel>
    _max?: NestedDateTimeFilter<$PrismaModel>
  }

  export type NestedBigIntFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntFilter<$PrismaModel> | bigint | number
  }

  export type NestedBigIntWithAggregatesFilter<$PrismaModel = never> = {
    equals?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    in?: bigint[] | number[]
    notIn?: bigint[] | number[]
    lt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    lte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gt?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    gte?: bigint | number | BigIntFieldRefInput<$PrismaModel>
    not?: NestedBigIntWithAggregatesFilter<$PrismaModel> | bigint | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedBigIntFilter<$PrismaModel>
    _min?: NestedBigIntFilter<$PrismaModel>
    _max?: NestedBigIntFilter<$PrismaModel>
  }

  export type NestedIntNullableFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableFilter<$PrismaModel> | number | null
  }

  export type NestedIntNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | IntFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | IntFieldRefInput<$PrismaModel>
    lte?: number | IntFieldRefInput<$PrismaModel>
    gt?: number | IntFieldRefInput<$PrismaModel>
    gte?: number | IntFieldRefInput<$PrismaModel>
    not?: NestedIntNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedIntNullableFilter<$PrismaModel>
    _max?: NestedIntNullableFilter<$PrismaModel>
  }

  export type NestedFloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type ExposureRecordCreateWithoutSnapshotInput = {
    id?: bigint | number
    snapshotDate: Date | string
    ip: string
    country?: string
    countryZh?: string
    province?: string
    region?: string
    city?: string
    asn?: string
    isp?: string
    host?: string
    service?: string
    serviceDesc?: string
    operator?: string
    status?: string
    scope?: string
    version?: string
    risk?: string
    lastSeen: Date | string
    createdAt?: Date | string
  }

  export type ExposureRecordUncheckedCreateWithoutSnapshotInput = {
    id?: bigint | number
    snapshotDate: Date | string
    ip: string
    country?: string
    countryZh?: string
    province?: string
    region?: string
    city?: string
    asn?: string
    isp?: string
    host?: string
    service?: string
    serviceDesc?: string
    operator?: string
    status?: string
    scope?: string
    version?: string
    risk?: string
    lastSeen: Date | string
    createdAt?: Date | string
  }

  export type ExposureRecordCreateOrConnectWithoutSnapshotInput = {
    where: ExposureRecordWhereUniqueInput
    create: XOR<ExposureRecordCreateWithoutSnapshotInput, ExposureRecordUncheckedCreateWithoutSnapshotInput>
  }

  export type ExposureRecordCreateManySnapshotInputEnvelope = {
    data: ExposureRecordCreateManySnapshotInput | ExposureRecordCreateManySnapshotInput[]
    skipDuplicates?: boolean
  }

  export type ExposureDailyAggCreateWithoutSnapshotInput = {
    snapshotDate: Date | string
    exposedCount: number
    domesticCount?: number
    overseasCount?: number
    newDistinctIpCount?: number
    cumulativeDistinctIpCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ExposureDailyAggUncheckedCreateWithoutSnapshotInput = {
    snapshotDate: Date | string
    exposedCount: number
    domesticCount?: number
    overseasCount?: number
    newDistinctIpCount?: number
    cumulativeDistinctIpCount?: number
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type ExposureDailyAggCreateOrConnectWithoutSnapshotInput = {
    where: ExposureDailyAggWhereUniqueInput
    create: XOR<ExposureDailyAggCreateWithoutSnapshotInput, ExposureDailyAggUncheckedCreateWithoutSnapshotInput>
  }

  export type ExposureRecordUpsertWithWhereUniqueWithoutSnapshotInput = {
    where: ExposureRecordWhereUniqueInput
    update: XOR<ExposureRecordUpdateWithoutSnapshotInput, ExposureRecordUncheckedUpdateWithoutSnapshotInput>
    create: XOR<ExposureRecordCreateWithoutSnapshotInput, ExposureRecordUncheckedCreateWithoutSnapshotInput>
  }

  export type ExposureRecordUpdateWithWhereUniqueWithoutSnapshotInput = {
    where: ExposureRecordWhereUniqueInput
    data: XOR<ExposureRecordUpdateWithoutSnapshotInput, ExposureRecordUncheckedUpdateWithoutSnapshotInput>
  }

  export type ExposureRecordUpdateManyWithWhereWithoutSnapshotInput = {
    where: ExposureRecordScalarWhereInput
    data: XOR<ExposureRecordUpdateManyMutationInput, ExposureRecordUncheckedUpdateManyWithoutSnapshotInput>
  }

  export type ExposureRecordScalarWhereInput = {
    AND?: ExposureRecordScalarWhereInput | ExposureRecordScalarWhereInput[]
    OR?: ExposureRecordScalarWhereInput[]
    NOT?: ExposureRecordScalarWhereInput | ExposureRecordScalarWhereInput[]
    id?: BigIntFilter<"ExposureRecord"> | bigint | number
    snapshotId?: IntFilter<"ExposureRecord"> | number
    snapshotDate?: DateTimeFilter<"ExposureRecord"> | Date | string
    ip?: StringFilter<"ExposureRecord"> | string
    country?: StringFilter<"ExposureRecord"> | string
    countryZh?: StringFilter<"ExposureRecord"> | string
    province?: StringFilter<"ExposureRecord"> | string
    region?: StringFilter<"ExposureRecord"> | string
    city?: StringFilter<"ExposureRecord"> | string
    asn?: StringFilter<"ExposureRecord"> | string
    isp?: StringFilter<"ExposureRecord"> | string
    host?: StringFilter<"ExposureRecord"> | string
    service?: StringFilter<"ExposureRecord"> | string
    serviceDesc?: StringFilter<"ExposureRecord"> | string
    operator?: StringFilter<"ExposureRecord"> | string
    status?: StringFilter<"ExposureRecord"> | string
    scope?: StringFilter<"ExposureRecord"> | string
    version?: StringFilter<"ExposureRecord"> | string
    risk?: StringFilter<"ExposureRecord"> | string
    lastSeen?: DateTimeFilter<"ExposureRecord"> | Date | string
    createdAt?: DateTimeFilter<"ExposureRecord"> | Date | string
  }

  export type ExposureDailyAggUpsertWithoutSnapshotInput = {
    update: XOR<ExposureDailyAggUpdateWithoutSnapshotInput, ExposureDailyAggUncheckedUpdateWithoutSnapshotInput>
    create: XOR<ExposureDailyAggCreateWithoutSnapshotInput, ExposureDailyAggUncheckedCreateWithoutSnapshotInput>
    where?: ExposureDailyAggWhereInput
  }

  export type ExposureDailyAggUpdateToOneWithWhereWithoutSnapshotInput = {
    where?: ExposureDailyAggWhereInput
    data: XOR<ExposureDailyAggUpdateWithoutSnapshotInput, ExposureDailyAggUncheckedUpdateWithoutSnapshotInput>
  }

  export type ExposureDailyAggUpdateWithoutSnapshotInput = {
    snapshotDate?: DateTimeFieldUpdateOperationsInput | Date | string
    exposedCount?: IntFieldUpdateOperationsInput | number
    domesticCount?: IntFieldUpdateOperationsInput | number
    overseasCount?: IntFieldUpdateOperationsInput | number
    newDistinctIpCount?: IntFieldUpdateOperationsInput | number
    cumulativeDistinctIpCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExposureDailyAggUncheckedUpdateWithoutSnapshotInput = {
    snapshotDate?: DateTimeFieldUpdateOperationsInput | Date | string
    exposedCount?: IntFieldUpdateOperationsInput | number
    domesticCount?: IntFieldUpdateOperationsInput | number
    overseasCount?: IntFieldUpdateOperationsInput | number
    newDistinctIpCount?: IntFieldUpdateOperationsInput | number
    cumulativeDistinctIpCount?: IntFieldUpdateOperationsInput | number
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExposureSnapshotCreateWithoutRecordsInput = {
    dateKey: string
    snapshotDate: Date | string
    sourceFile: string
    createdAt?: Date | string
    updatedAt?: Date | string
    dailyAgg?: ExposureDailyAggCreateNestedOneWithoutSnapshotInput
  }

  export type ExposureSnapshotUncheckedCreateWithoutRecordsInput = {
    id?: number
    dateKey: string
    snapshotDate: Date | string
    sourceFile: string
    createdAt?: Date | string
    updatedAt?: Date | string
    dailyAgg?: ExposureDailyAggUncheckedCreateNestedOneWithoutSnapshotInput
  }

  export type ExposureSnapshotCreateOrConnectWithoutRecordsInput = {
    where: ExposureSnapshotWhereUniqueInput
    create: XOR<ExposureSnapshotCreateWithoutRecordsInput, ExposureSnapshotUncheckedCreateWithoutRecordsInput>
  }

  export type ExposureSnapshotUpsertWithoutRecordsInput = {
    update: XOR<ExposureSnapshotUpdateWithoutRecordsInput, ExposureSnapshotUncheckedUpdateWithoutRecordsInput>
    create: XOR<ExposureSnapshotCreateWithoutRecordsInput, ExposureSnapshotUncheckedCreateWithoutRecordsInput>
    where?: ExposureSnapshotWhereInput
  }

  export type ExposureSnapshotUpdateToOneWithWhereWithoutRecordsInput = {
    where?: ExposureSnapshotWhereInput
    data: XOR<ExposureSnapshotUpdateWithoutRecordsInput, ExposureSnapshotUncheckedUpdateWithoutRecordsInput>
  }

  export type ExposureSnapshotUpdateWithoutRecordsInput = {
    dateKey?: StringFieldUpdateOperationsInput | string
    snapshotDate?: DateTimeFieldUpdateOperationsInput | Date | string
    sourceFile?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dailyAgg?: ExposureDailyAggUpdateOneWithoutSnapshotNestedInput
  }

  export type ExposureSnapshotUncheckedUpdateWithoutRecordsInput = {
    id?: IntFieldUpdateOperationsInput | number
    dateKey?: StringFieldUpdateOperationsInput | string
    snapshotDate?: DateTimeFieldUpdateOperationsInput | Date | string
    sourceFile?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    dailyAgg?: ExposureDailyAggUncheckedUpdateOneWithoutSnapshotNestedInput
  }

  export type ExposureSnapshotCreateWithoutDailyAggInput = {
    dateKey: string
    snapshotDate: Date | string
    sourceFile: string
    createdAt?: Date | string
    updatedAt?: Date | string
    records?: ExposureRecordCreateNestedManyWithoutSnapshotInput
  }

  export type ExposureSnapshotUncheckedCreateWithoutDailyAggInput = {
    id?: number
    dateKey: string
    snapshotDate: Date | string
    sourceFile: string
    createdAt?: Date | string
    updatedAt?: Date | string
    records?: ExposureRecordUncheckedCreateNestedManyWithoutSnapshotInput
  }

  export type ExposureSnapshotCreateOrConnectWithoutDailyAggInput = {
    where: ExposureSnapshotWhereUniqueInput
    create: XOR<ExposureSnapshotCreateWithoutDailyAggInput, ExposureSnapshotUncheckedCreateWithoutDailyAggInput>
  }

  export type ExposureSnapshotUpsertWithoutDailyAggInput = {
    update: XOR<ExposureSnapshotUpdateWithoutDailyAggInput, ExposureSnapshotUncheckedUpdateWithoutDailyAggInput>
    create: XOR<ExposureSnapshotCreateWithoutDailyAggInput, ExposureSnapshotUncheckedCreateWithoutDailyAggInput>
    where?: ExposureSnapshotWhereInput
  }

  export type ExposureSnapshotUpdateToOneWithWhereWithoutDailyAggInput = {
    where?: ExposureSnapshotWhereInput
    data: XOR<ExposureSnapshotUpdateWithoutDailyAggInput, ExposureSnapshotUncheckedUpdateWithoutDailyAggInput>
  }

  export type ExposureSnapshotUpdateWithoutDailyAggInput = {
    dateKey?: StringFieldUpdateOperationsInput | string
    snapshotDate?: DateTimeFieldUpdateOperationsInput | Date | string
    sourceFile?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    records?: ExposureRecordUpdateManyWithoutSnapshotNestedInput
  }

  export type ExposureSnapshotUncheckedUpdateWithoutDailyAggInput = {
    id?: IntFieldUpdateOperationsInput | number
    dateKey?: StringFieldUpdateOperationsInput | string
    snapshotDate?: DateTimeFieldUpdateOperationsInput | Date | string
    sourceFile?: StringFieldUpdateOperationsInput | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    records?: ExposureRecordUncheckedUpdateManyWithoutSnapshotNestedInput
  }

  export type ExposureRecordCreateManySnapshotInput = {
    id?: bigint | number
    snapshotDate: Date | string
    ip: string
    country?: string
    countryZh?: string
    province?: string
    region?: string
    city?: string
    asn?: string
    isp?: string
    host?: string
    service?: string
    serviceDesc?: string
    operator?: string
    status?: string
    scope?: string
    version?: string
    risk?: string
    lastSeen: Date | string
    createdAt?: Date | string
  }

  export type ExposureRecordUpdateWithoutSnapshotInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    snapshotDate?: DateTimeFieldUpdateOperationsInput | Date | string
    ip?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    countryZh?: StringFieldUpdateOperationsInput | string
    province?: StringFieldUpdateOperationsInput | string
    region?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    asn?: StringFieldUpdateOperationsInput | string
    isp?: StringFieldUpdateOperationsInput | string
    host?: StringFieldUpdateOperationsInput | string
    service?: StringFieldUpdateOperationsInput | string
    serviceDesc?: StringFieldUpdateOperationsInput | string
    operator?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    scope?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    risk?: StringFieldUpdateOperationsInput | string
    lastSeen?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExposureRecordUncheckedUpdateWithoutSnapshotInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    snapshotDate?: DateTimeFieldUpdateOperationsInput | Date | string
    ip?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    countryZh?: StringFieldUpdateOperationsInput | string
    province?: StringFieldUpdateOperationsInput | string
    region?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    asn?: StringFieldUpdateOperationsInput | string
    isp?: StringFieldUpdateOperationsInput | string
    host?: StringFieldUpdateOperationsInput | string
    service?: StringFieldUpdateOperationsInput | string
    serviceDesc?: StringFieldUpdateOperationsInput | string
    operator?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    scope?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    risk?: StringFieldUpdateOperationsInput | string
    lastSeen?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type ExposureRecordUncheckedUpdateManyWithoutSnapshotInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    snapshotDate?: DateTimeFieldUpdateOperationsInput | Date | string
    ip?: StringFieldUpdateOperationsInput | string
    country?: StringFieldUpdateOperationsInput | string
    countryZh?: StringFieldUpdateOperationsInput | string
    province?: StringFieldUpdateOperationsInput | string
    region?: StringFieldUpdateOperationsInput | string
    city?: StringFieldUpdateOperationsInput | string
    asn?: StringFieldUpdateOperationsInput | string
    isp?: StringFieldUpdateOperationsInput | string
    host?: StringFieldUpdateOperationsInput | string
    service?: StringFieldUpdateOperationsInput | string
    serviceDesc?: StringFieldUpdateOperationsInput | string
    operator?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    scope?: StringFieldUpdateOperationsInput | string
    version?: StringFieldUpdateOperationsInput | string
    risk?: StringFieldUpdateOperationsInput | string
    lastSeen?: DateTimeFieldUpdateOperationsInput | Date | string
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }



  /**
   * Batch Payload for updateMany & deleteMany & createMany
   */

  export type BatchPayload = {
    count: number
  }

  /**
   * DMMF
   */
  export const dmmf: runtime.BaseDMMF
}