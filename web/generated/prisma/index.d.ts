
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
 * Model OpenclawRiskSnapshot
 * 
 */
export type OpenclawRiskSnapshot = $Result.DefaultSelection<Prisma.$OpenclawRiskSnapshotPayload>
/**
 * Model OpenclawRiskIssue
 * 
 */
export type OpenclawRiskIssue = $Result.DefaultSelection<Prisma.$OpenclawRiskIssuePayload>
/**
 * Model SecurityResearchSnapshot
 * 
 */
export type SecurityResearchSnapshot = $Result.DefaultSelection<Prisma.$SecurityResearchSnapshotPayload>
/**
 * Model SecurityResearchPaper
 * 
 */
export type SecurityResearchPaper = $Result.DefaultSelection<Prisma.$SecurityResearchPaperPayload>

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

  /**
   * `prisma.openclawRiskSnapshot`: Exposes CRUD operations for the **OpenclawRiskSnapshot** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more OpenclawRiskSnapshots
    * const openclawRiskSnapshots = await prisma.openclawRiskSnapshot.findMany()
    * ```
    */
  get openclawRiskSnapshot(): Prisma.OpenclawRiskSnapshotDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.openclawRiskIssue`: Exposes CRUD operations for the **OpenclawRiskIssue** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more OpenclawRiskIssues
    * const openclawRiskIssues = await prisma.openclawRiskIssue.findMany()
    * ```
    */
  get openclawRiskIssue(): Prisma.OpenclawRiskIssueDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.securityResearchSnapshot`: Exposes CRUD operations for the **SecurityResearchSnapshot** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SecurityResearchSnapshots
    * const securityResearchSnapshots = await prisma.securityResearchSnapshot.findMany()
    * ```
    */
  get securityResearchSnapshot(): Prisma.SecurityResearchSnapshotDelegate<ExtArgs, ClientOptions>;

  /**
   * `prisma.securityResearchPaper`: Exposes CRUD operations for the **SecurityResearchPaper** model.
    * Example usage:
    * ```ts
    * // Fetch zero or more SecurityResearchPapers
    * const securityResearchPapers = await prisma.securityResearchPaper.findMany()
    * ```
    */
  get securityResearchPaper(): Prisma.SecurityResearchPaperDelegate<ExtArgs, ClientOptions>;
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
    ExposureVersionDailyAgg: 'ExposureVersionDailyAgg',
    OpenclawRiskSnapshot: 'OpenclawRiskSnapshot',
    OpenclawRiskIssue: 'OpenclawRiskIssue',
    SecurityResearchSnapshot: 'SecurityResearchSnapshot',
    SecurityResearchPaper: 'SecurityResearchPaper'
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
      modelProps: "exposureSnapshot" | "exposureRecord" | "exposureDailyAgg" | "exposureVersionDailyAgg" | "openclawRiskSnapshot" | "openclawRiskIssue" | "securityResearchSnapshot" | "securityResearchPaper"
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
      OpenclawRiskSnapshot: {
        payload: Prisma.$OpenclawRiskSnapshotPayload<ExtArgs>
        fields: Prisma.OpenclawRiskSnapshotFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OpenclawRiskSnapshotFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OpenclawRiskSnapshotPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OpenclawRiskSnapshotFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OpenclawRiskSnapshotPayload>
          }
          findFirst: {
            args: Prisma.OpenclawRiskSnapshotFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OpenclawRiskSnapshotPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OpenclawRiskSnapshotFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OpenclawRiskSnapshotPayload>
          }
          findMany: {
            args: Prisma.OpenclawRiskSnapshotFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OpenclawRiskSnapshotPayload>[]
          }
          create: {
            args: Prisma.OpenclawRiskSnapshotCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OpenclawRiskSnapshotPayload>
          }
          createMany: {
            args: Prisma.OpenclawRiskSnapshotCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.OpenclawRiskSnapshotDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OpenclawRiskSnapshotPayload>
          }
          update: {
            args: Prisma.OpenclawRiskSnapshotUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OpenclawRiskSnapshotPayload>
          }
          deleteMany: {
            args: Prisma.OpenclawRiskSnapshotDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OpenclawRiskSnapshotUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.OpenclawRiskSnapshotUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OpenclawRiskSnapshotPayload>
          }
          aggregate: {
            args: Prisma.OpenclawRiskSnapshotAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOpenclawRiskSnapshot>
          }
          groupBy: {
            args: Prisma.OpenclawRiskSnapshotGroupByArgs<ExtArgs>
            result: $Utils.Optional<OpenclawRiskSnapshotGroupByOutputType>[]
          }
          count: {
            args: Prisma.OpenclawRiskSnapshotCountArgs<ExtArgs>
            result: $Utils.Optional<OpenclawRiskSnapshotCountAggregateOutputType> | number
          }
        }
      }
      OpenclawRiskIssue: {
        payload: Prisma.$OpenclawRiskIssuePayload<ExtArgs>
        fields: Prisma.OpenclawRiskIssueFieldRefs
        operations: {
          findUnique: {
            args: Prisma.OpenclawRiskIssueFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OpenclawRiskIssuePayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.OpenclawRiskIssueFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OpenclawRiskIssuePayload>
          }
          findFirst: {
            args: Prisma.OpenclawRiskIssueFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OpenclawRiskIssuePayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.OpenclawRiskIssueFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OpenclawRiskIssuePayload>
          }
          findMany: {
            args: Prisma.OpenclawRiskIssueFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OpenclawRiskIssuePayload>[]
          }
          create: {
            args: Prisma.OpenclawRiskIssueCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OpenclawRiskIssuePayload>
          }
          createMany: {
            args: Prisma.OpenclawRiskIssueCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.OpenclawRiskIssueDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OpenclawRiskIssuePayload>
          }
          update: {
            args: Prisma.OpenclawRiskIssueUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OpenclawRiskIssuePayload>
          }
          deleteMany: {
            args: Prisma.OpenclawRiskIssueDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.OpenclawRiskIssueUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.OpenclawRiskIssueUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$OpenclawRiskIssuePayload>
          }
          aggregate: {
            args: Prisma.OpenclawRiskIssueAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateOpenclawRiskIssue>
          }
          groupBy: {
            args: Prisma.OpenclawRiskIssueGroupByArgs<ExtArgs>
            result: $Utils.Optional<OpenclawRiskIssueGroupByOutputType>[]
          }
          count: {
            args: Prisma.OpenclawRiskIssueCountArgs<ExtArgs>
            result: $Utils.Optional<OpenclawRiskIssueCountAggregateOutputType> | number
          }
        }
      }
      SecurityResearchSnapshot: {
        payload: Prisma.$SecurityResearchSnapshotPayload<ExtArgs>
        fields: Prisma.SecurityResearchSnapshotFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SecurityResearchSnapshotFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecurityResearchSnapshotPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SecurityResearchSnapshotFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecurityResearchSnapshotPayload>
          }
          findFirst: {
            args: Prisma.SecurityResearchSnapshotFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecurityResearchSnapshotPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SecurityResearchSnapshotFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecurityResearchSnapshotPayload>
          }
          findMany: {
            args: Prisma.SecurityResearchSnapshotFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecurityResearchSnapshotPayload>[]
          }
          create: {
            args: Prisma.SecurityResearchSnapshotCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecurityResearchSnapshotPayload>
          }
          createMany: {
            args: Prisma.SecurityResearchSnapshotCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.SecurityResearchSnapshotDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecurityResearchSnapshotPayload>
          }
          update: {
            args: Prisma.SecurityResearchSnapshotUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecurityResearchSnapshotPayload>
          }
          deleteMany: {
            args: Prisma.SecurityResearchSnapshotDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SecurityResearchSnapshotUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SecurityResearchSnapshotUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecurityResearchSnapshotPayload>
          }
          aggregate: {
            args: Prisma.SecurityResearchSnapshotAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSecurityResearchSnapshot>
          }
          groupBy: {
            args: Prisma.SecurityResearchSnapshotGroupByArgs<ExtArgs>
            result: $Utils.Optional<SecurityResearchSnapshotGroupByOutputType>[]
          }
          count: {
            args: Prisma.SecurityResearchSnapshotCountArgs<ExtArgs>
            result: $Utils.Optional<SecurityResearchSnapshotCountAggregateOutputType> | number
          }
        }
      }
      SecurityResearchPaper: {
        payload: Prisma.$SecurityResearchPaperPayload<ExtArgs>
        fields: Prisma.SecurityResearchPaperFieldRefs
        operations: {
          findUnique: {
            args: Prisma.SecurityResearchPaperFindUniqueArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecurityResearchPaperPayload> | null
          }
          findUniqueOrThrow: {
            args: Prisma.SecurityResearchPaperFindUniqueOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecurityResearchPaperPayload>
          }
          findFirst: {
            args: Prisma.SecurityResearchPaperFindFirstArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecurityResearchPaperPayload> | null
          }
          findFirstOrThrow: {
            args: Prisma.SecurityResearchPaperFindFirstOrThrowArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecurityResearchPaperPayload>
          }
          findMany: {
            args: Prisma.SecurityResearchPaperFindManyArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecurityResearchPaperPayload>[]
          }
          create: {
            args: Prisma.SecurityResearchPaperCreateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecurityResearchPaperPayload>
          }
          createMany: {
            args: Prisma.SecurityResearchPaperCreateManyArgs<ExtArgs>
            result: BatchPayload
          }
          delete: {
            args: Prisma.SecurityResearchPaperDeleteArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecurityResearchPaperPayload>
          }
          update: {
            args: Prisma.SecurityResearchPaperUpdateArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecurityResearchPaperPayload>
          }
          deleteMany: {
            args: Prisma.SecurityResearchPaperDeleteManyArgs<ExtArgs>
            result: BatchPayload
          }
          updateMany: {
            args: Prisma.SecurityResearchPaperUpdateManyArgs<ExtArgs>
            result: BatchPayload
          }
          upsert: {
            args: Prisma.SecurityResearchPaperUpsertArgs<ExtArgs>
            result: $Utils.PayloadToResult<Prisma.$SecurityResearchPaperPayload>
          }
          aggregate: {
            args: Prisma.SecurityResearchPaperAggregateArgs<ExtArgs>
            result: $Utils.Optional<AggregateSecurityResearchPaper>
          }
          groupBy: {
            args: Prisma.SecurityResearchPaperGroupByArgs<ExtArgs>
            result: $Utils.Optional<SecurityResearchPaperGroupByOutputType>[]
          }
          count: {
            args: Prisma.SecurityResearchPaperCountArgs<ExtArgs>
            result: $Utils.Optional<SecurityResearchPaperCountAggregateOutputType> | number
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
    openclawRiskSnapshot?: OpenclawRiskSnapshotOmit
    openclawRiskIssue?: OpenclawRiskIssueOmit
    securityResearchSnapshot?: SecurityResearchSnapshotOmit
    securityResearchPaper?: SecurityResearchPaperOmit
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
   * Count Type OpenclawRiskSnapshotCountOutputType
   */

  export type OpenclawRiskSnapshotCountOutputType = {
    issues: number
  }

  export type OpenclawRiskSnapshotCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    issues?: boolean | OpenclawRiskSnapshotCountOutputTypeCountIssuesArgs
  }

  // Custom InputTypes
  /**
   * OpenclawRiskSnapshotCountOutputType without action
   */
  export type OpenclawRiskSnapshotCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OpenclawRiskSnapshotCountOutputType
     */
    select?: OpenclawRiskSnapshotCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * OpenclawRiskSnapshotCountOutputType without action
   */
  export type OpenclawRiskSnapshotCountOutputTypeCountIssuesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OpenclawRiskIssueWhereInput
  }


  /**
   * Count Type SecurityResearchSnapshotCountOutputType
   */

  export type SecurityResearchSnapshotCountOutputType = {
    papers: number
  }

  export type SecurityResearchSnapshotCountOutputTypeSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    papers?: boolean | SecurityResearchSnapshotCountOutputTypeCountPapersArgs
  }

  // Custom InputTypes
  /**
   * SecurityResearchSnapshotCountOutputType without action
   */
  export type SecurityResearchSnapshotCountOutputTypeDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecurityResearchSnapshotCountOutputType
     */
    select?: SecurityResearchSnapshotCountOutputTypeSelect<ExtArgs> | null
  }

  /**
   * SecurityResearchSnapshotCountOutputType without action
   */
  export type SecurityResearchSnapshotCountOutputTypeCountPapersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SecurityResearchPaperWhereInput
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
   * Model OpenclawRiskSnapshot
   */

  export type AggregateOpenclawRiskSnapshot = {
    _count: OpenclawRiskSnapshotCountAggregateOutputType | null
    _avg: OpenclawRiskSnapshotAvgAggregateOutputType | null
    _sum: OpenclawRiskSnapshotSumAggregateOutputType | null
    _min: OpenclawRiskSnapshotMinAggregateOutputType | null
    _max: OpenclawRiskSnapshotMaxAggregateOutputType | null
  }

  export type OpenclawRiskSnapshotAvgAggregateOutputType = {
    id: number | null
    totalIssues: number | null
    githubAdvisories: number | null
    nvdCves: number | null
    officialAdvisoryCount: number | null
    cveRecordCount: number | null
    conferencePaperCount: number | null
    preprintCount: number | null
    researchCount: number | null
    newsCount: number | null
    criticalCount: number | null
    highRiskCount: number | null
    fixedCount: number | null
    unfixedCount: number | null
    unknownCount: number | null
    fixProgressPercent: number | null
  }

  export type OpenclawRiskSnapshotSumAggregateOutputType = {
    id: number | null
    totalIssues: number | null
    githubAdvisories: number | null
    nvdCves: number | null
    officialAdvisoryCount: number | null
    cveRecordCount: number | null
    conferencePaperCount: number | null
    preprintCount: number | null
    researchCount: number | null
    newsCount: number | null
    criticalCount: number | null
    highRiskCount: number | null
    fixedCount: number | null
    unfixedCount: number | null
    unknownCount: number | null
    fixProgressPercent: number | null
  }

  export type OpenclawRiskSnapshotMinAggregateOutputType = {
    id: number | null
    snapshotKey: string | null
    triggerSource: string | null
    status: string | null
    latestStableTag: string | null
    latestStableVersion: string | null
    latestStableUrl: string | null
    latestStablePublishedAt: Date | null
    totalIssues: number | null
    githubAdvisories: number | null
    nvdCves: number | null
    officialAdvisoryCount: number | null
    cveRecordCount: number | null
    conferencePaperCount: number | null
    preprintCount: number | null
    researchCount: number | null
    newsCount: number | null
    criticalCount: number | null
    highRiskCount: number | null
    fixedCount: number | null
    unfixedCount: number | null
    unknownCount: number | null
    fixProgressPercent: number | null
    cacheDir: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OpenclawRiskSnapshotMaxAggregateOutputType = {
    id: number | null
    snapshotKey: string | null
    triggerSource: string | null
    status: string | null
    latestStableTag: string | null
    latestStableVersion: string | null
    latestStableUrl: string | null
    latestStablePublishedAt: Date | null
    totalIssues: number | null
    githubAdvisories: number | null
    nvdCves: number | null
    officialAdvisoryCount: number | null
    cveRecordCount: number | null
    conferencePaperCount: number | null
    preprintCount: number | null
    researchCount: number | null
    newsCount: number | null
    criticalCount: number | null
    highRiskCount: number | null
    fixedCount: number | null
    unfixedCount: number | null
    unknownCount: number | null
    fixProgressPercent: number | null
    cacheDir: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type OpenclawRiskSnapshotCountAggregateOutputType = {
    id: number
    snapshotKey: number
    triggerSource: number
    status: number
    latestStableTag: number
    latestStableVersion: number
    latestStableUrl: number
    latestStablePublishedAt: number
    totalIssues: number
    githubAdvisories: number
    nvdCves: number
    officialAdvisoryCount: number
    cveRecordCount: number
    conferencePaperCount: number
    preprintCount: number
    researchCount: number
    newsCount: number
    criticalCount: number
    highRiskCount: number
    fixedCount: number
    unfixedCount: number
    unknownCount: number
    fixProgressPercent: number
    sourceMeta: number
    cacheDir: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type OpenclawRiskSnapshotAvgAggregateInputType = {
    id?: true
    totalIssues?: true
    githubAdvisories?: true
    nvdCves?: true
    officialAdvisoryCount?: true
    cveRecordCount?: true
    conferencePaperCount?: true
    preprintCount?: true
    researchCount?: true
    newsCount?: true
    criticalCount?: true
    highRiskCount?: true
    fixedCount?: true
    unfixedCount?: true
    unknownCount?: true
    fixProgressPercent?: true
  }

  export type OpenclawRiskSnapshotSumAggregateInputType = {
    id?: true
    totalIssues?: true
    githubAdvisories?: true
    nvdCves?: true
    officialAdvisoryCount?: true
    cveRecordCount?: true
    conferencePaperCount?: true
    preprintCount?: true
    researchCount?: true
    newsCount?: true
    criticalCount?: true
    highRiskCount?: true
    fixedCount?: true
    unfixedCount?: true
    unknownCount?: true
    fixProgressPercent?: true
  }

  export type OpenclawRiskSnapshotMinAggregateInputType = {
    id?: true
    snapshotKey?: true
    triggerSource?: true
    status?: true
    latestStableTag?: true
    latestStableVersion?: true
    latestStableUrl?: true
    latestStablePublishedAt?: true
    totalIssues?: true
    githubAdvisories?: true
    nvdCves?: true
    officialAdvisoryCount?: true
    cveRecordCount?: true
    conferencePaperCount?: true
    preprintCount?: true
    researchCount?: true
    newsCount?: true
    criticalCount?: true
    highRiskCount?: true
    fixedCount?: true
    unfixedCount?: true
    unknownCount?: true
    fixProgressPercent?: true
    cacheDir?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OpenclawRiskSnapshotMaxAggregateInputType = {
    id?: true
    snapshotKey?: true
    triggerSource?: true
    status?: true
    latestStableTag?: true
    latestStableVersion?: true
    latestStableUrl?: true
    latestStablePublishedAt?: true
    totalIssues?: true
    githubAdvisories?: true
    nvdCves?: true
    officialAdvisoryCount?: true
    cveRecordCount?: true
    conferencePaperCount?: true
    preprintCount?: true
    researchCount?: true
    newsCount?: true
    criticalCount?: true
    highRiskCount?: true
    fixedCount?: true
    unfixedCount?: true
    unknownCount?: true
    fixProgressPercent?: true
    cacheDir?: true
    createdAt?: true
    updatedAt?: true
  }

  export type OpenclawRiskSnapshotCountAggregateInputType = {
    id?: true
    snapshotKey?: true
    triggerSource?: true
    status?: true
    latestStableTag?: true
    latestStableVersion?: true
    latestStableUrl?: true
    latestStablePublishedAt?: true
    totalIssues?: true
    githubAdvisories?: true
    nvdCves?: true
    officialAdvisoryCount?: true
    cveRecordCount?: true
    conferencePaperCount?: true
    preprintCount?: true
    researchCount?: true
    newsCount?: true
    criticalCount?: true
    highRiskCount?: true
    fixedCount?: true
    unfixedCount?: true
    unknownCount?: true
    fixProgressPercent?: true
    sourceMeta?: true
    cacheDir?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type OpenclawRiskSnapshotAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OpenclawRiskSnapshot to aggregate.
     */
    where?: OpenclawRiskSnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OpenclawRiskSnapshots to fetch.
     */
    orderBy?: OpenclawRiskSnapshotOrderByWithRelationInput | OpenclawRiskSnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OpenclawRiskSnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OpenclawRiskSnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OpenclawRiskSnapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned OpenclawRiskSnapshots
    **/
    _count?: true | OpenclawRiskSnapshotCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: OpenclawRiskSnapshotAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: OpenclawRiskSnapshotSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OpenclawRiskSnapshotMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OpenclawRiskSnapshotMaxAggregateInputType
  }

  export type GetOpenclawRiskSnapshotAggregateType<T extends OpenclawRiskSnapshotAggregateArgs> = {
        [P in keyof T & keyof AggregateOpenclawRiskSnapshot]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOpenclawRiskSnapshot[P]>
      : GetScalarType<T[P], AggregateOpenclawRiskSnapshot[P]>
  }




  export type OpenclawRiskSnapshotGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OpenclawRiskSnapshotWhereInput
    orderBy?: OpenclawRiskSnapshotOrderByWithAggregationInput | OpenclawRiskSnapshotOrderByWithAggregationInput[]
    by: OpenclawRiskSnapshotScalarFieldEnum[] | OpenclawRiskSnapshotScalarFieldEnum
    having?: OpenclawRiskSnapshotScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OpenclawRiskSnapshotCountAggregateInputType | true
    _avg?: OpenclawRiskSnapshotAvgAggregateInputType
    _sum?: OpenclawRiskSnapshotSumAggregateInputType
    _min?: OpenclawRiskSnapshotMinAggregateInputType
    _max?: OpenclawRiskSnapshotMaxAggregateInputType
  }

  export type OpenclawRiskSnapshotGroupByOutputType = {
    id: number
    snapshotKey: string
    triggerSource: string
    status: string
    latestStableTag: string | null
    latestStableVersion: string | null
    latestStableUrl: string | null
    latestStablePublishedAt: Date | null
    totalIssues: number
    githubAdvisories: number
    nvdCves: number
    officialAdvisoryCount: number
    cveRecordCount: number
    conferencePaperCount: number
    preprintCount: number
    researchCount: number
    newsCount: number
    criticalCount: number
    highRiskCount: number
    fixedCount: number
    unfixedCount: number
    unknownCount: number
    fixProgressPercent: number
    sourceMeta: JsonValue
    cacheDir: string | null
    createdAt: Date
    updatedAt: Date
    _count: OpenclawRiskSnapshotCountAggregateOutputType | null
    _avg: OpenclawRiskSnapshotAvgAggregateOutputType | null
    _sum: OpenclawRiskSnapshotSumAggregateOutputType | null
    _min: OpenclawRiskSnapshotMinAggregateOutputType | null
    _max: OpenclawRiskSnapshotMaxAggregateOutputType | null
  }

  type GetOpenclawRiskSnapshotGroupByPayload<T extends OpenclawRiskSnapshotGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OpenclawRiskSnapshotGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OpenclawRiskSnapshotGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OpenclawRiskSnapshotGroupByOutputType[P]>
            : GetScalarType<T[P], OpenclawRiskSnapshotGroupByOutputType[P]>
        }
      >
    >


  export type OpenclawRiskSnapshotSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    snapshotKey?: boolean
    triggerSource?: boolean
    status?: boolean
    latestStableTag?: boolean
    latestStableVersion?: boolean
    latestStableUrl?: boolean
    latestStablePublishedAt?: boolean
    totalIssues?: boolean
    githubAdvisories?: boolean
    nvdCves?: boolean
    officialAdvisoryCount?: boolean
    cveRecordCount?: boolean
    conferencePaperCount?: boolean
    preprintCount?: boolean
    researchCount?: boolean
    newsCount?: boolean
    criticalCount?: boolean
    highRiskCount?: boolean
    fixedCount?: boolean
    unfixedCount?: boolean
    unknownCount?: boolean
    fixProgressPercent?: boolean
    sourceMeta?: boolean
    cacheDir?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    issues?: boolean | OpenclawRiskSnapshot$issuesArgs<ExtArgs>
    _count?: boolean | OpenclawRiskSnapshotCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["openclawRiskSnapshot"]>



  export type OpenclawRiskSnapshotSelectScalar = {
    id?: boolean
    snapshotKey?: boolean
    triggerSource?: boolean
    status?: boolean
    latestStableTag?: boolean
    latestStableVersion?: boolean
    latestStableUrl?: boolean
    latestStablePublishedAt?: boolean
    totalIssues?: boolean
    githubAdvisories?: boolean
    nvdCves?: boolean
    officialAdvisoryCount?: boolean
    cveRecordCount?: boolean
    conferencePaperCount?: boolean
    preprintCount?: boolean
    researchCount?: boolean
    newsCount?: boolean
    criticalCount?: boolean
    highRiskCount?: boolean
    fixedCount?: boolean
    unfixedCount?: boolean
    unknownCount?: boolean
    fixProgressPercent?: boolean
    sourceMeta?: boolean
    cacheDir?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type OpenclawRiskSnapshotOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "snapshotKey" | "triggerSource" | "status" | "latestStableTag" | "latestStableVersion" | "latestStableUrl" | "latestStablePublishedAt" | "totalIssues" | "githubAdvisories" | "nvdCves" | "officialAdvisoryCount" | "cveRecordCount" | "conferencePaperCount" | "preprintCount" | "researchCount" | "newsCount" | "criticalCount" | "highRiskCount" | "fixedCount" | "unfixedCount" | "unknownCount" | "fixProgressPercent" | "sourceMeta" | "cacheDir" | "createdAt" | "updatedAt", ExtArgs["result"]["openclawRiskSnapshot"]>
  export type OpenclawRiskSnapshotInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    issues?: boolean | OpenclawRiskSnapshot$issuesArgs<ExtArgs>
    _count?: boolean | OpenclawRiskSnapshotCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $OpenclawRiskSnapshotPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "OpenclawRiskSnapshot"
    objects: {
      issues: Prisma.$OpenclawRiskIssuePayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      snapshotKey: string
      triggerSource: string
      status: string
      latestStableTag: string | null
      latestStableVersion: string | null
      latestStableUrl: string | null
      latestStablePublishedAt: Date | null
      totalIssues: number
      githubAdvisories: number
      nvdCves: number
      officialAdvisoryCount: number
      cveRecordCount: number
      conferencePaperCount: number
      preprintCount: number
      researchCount: number
      newsCount: number
      criticalCount: number
      highRiskCount: number
      fixedCount: number
      unfixedCount: number
      unknownCount: number
      fixProgressPercent: number
      sourceMeta: Prisma.JsonValue
      cacheDir: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["openclawRiskSnapshot"]>
    composites: {}
  }

  type OpenclawRiskSnapshotGetPayload<S extends boolean | null | undefined | OpenclawRiskSnapshotDefaultArgs> = $Result.GetResult<Prisma.$OpenclawRiskSnapshotPayload, S>

  type OpenclawRiskSnapshotCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OpenclawRiskSnapshotFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OpenclawRiskSnapshotCountAggregateInputType | true
    }

  export interface OpenclawRiskSnapshotDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['OpenclawRiskSnapshot'], meta: { name: 'OpenclawRiskSnapshot' } }
    /**
     * Find zero or one OpenclawRiskSnapshot that matches the filter.
     * @param {OpenclawRiskSnapshotFindUniqueArgs} args - Arguments to find a OpenclawRiskSnapshot
     * @example
     * // Get one OpenclawRiskSnapshot
     * const openclawRiskSnapshot = await prisma.openclawRiskSnapshot.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OpenclawRiskSnapshotFindUniqueArgs>(args: SelectSubset<T, OpenclawRiskSnapshotFindUniqueArgs<ExtArgs>>): Prisma__OpenclawRiskSnapshotClient<$Result.GetResult<Prisma.$OpenclawRiskSnapshotPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one OpenclawRiskSnapshot that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OpenclawRiskSnapshotFindUniqueOrThrowArgs} args - Arguments to find a OpenclawRiskSnapshot
     * @example
     * // Get one OpenclawRiskSnapshot
     * const openclawRiskSnapshot = await prisma.openclawRiskSnapshot.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OpenclawRiskSnapshotFindUniqueOrThrowArgs>(args: SelectSubset<T, OpenclawRiskSnapshotFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OpenclawRiskSnapshotClient<$Result.GetResult<Prisma.$OpenclawRiskSnapshotPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OpenclawRiskSnapshot that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OpenclawRiskSnapshotFindFirstArgs} args - Arguments to find a OpenclawRiskSnapshot
     * @example
     * // Get one OpenclawRiskSnapshot
     * const openclawRiskSnapshot = await prisma.openclawRiskSnapshot.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OpenclawRiskSnapshotFindFirstArgs>(args?: SelectSubset<T, OpenclawRiskSnapshotFindFirstArgs<ExtArgs>>): Prisma__OpenclawRiskSnapshotClient<$Result.GetResult<Prisma.$OpenclawRiskSnapshotPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OpenclawRiskSnapshot that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OpenclawRiskSnapshotFindFirstOrThrowArgs} args - Arguments to find a OpenclawRiskSnapshot
     * @example
     * // Get one OpenclawRiskSnapshot
     * const openclawRiskSnapshot = await prisma.openclawRiskSnapshot.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OpenclawRiskSnapshotFindFirstOrThrowArgs>(args?: SelectSubset<T, OpenclawRiskSnapshotFindFirstOrThrowArgs<ExtArgs>>): Prisma__OpenclawRiskSnapshotClient<$Result.GetResult<Prisma.$OpenclawRiskSnapshotPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more OpenclawRiskSnapshots that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OpenclawRiskSnapshotFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OpenclawRiskSnapshots
     * const openclawRiskSnapshots = await prisma.openclawRiskSnapshot.findMany()
     * 
     * // Get first 10 OpenclawRiskSnapshots
     * const openclawRiskSnapshots = await prisma.openclawRiskSnapshot.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const openclawRiskSnapshotWithIdOnly = await prisma.openclawRiskSnapshot.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OpenclawRiskSnapshotFindManyArgs>(args?: SelectSubset<T, OpenclawRiskSnapshotFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OpenclawRiskSnapshotPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a OpenclawRiskSnapshot.
     * @param {OpenclawRiskSnapshotCreateArgs} args - Arguments to create a OpenclawRiskSnapshot.
     * @example
     * // Create one OpenclawRiskSnapshot
     * const OpenclawRiskSnapshot = await prisma.openclawRiskSnapshot.create({
     *   data: {
     *     // ... data to create a OpenclawRiskSnapshot
     *   }
     * })
     * 
     */
    create<T extends OpenclawRiskSnapshotCreateArgs>(args: SelectSubset<T, OpenclawRiskSnapshotCreateArgs<ExtArgs>>): Prisma__OpenclawRiskSnapshotClient<$Result.GetResult<Prisma.$OpenclawRiskSnapshotPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many OpenclawRiskSnapshots.
     * @param {OpenclawRiskSnapshotCreateManyArgs} args - Arguments to create many OpenclawRiskSnapshots.
     * @example
     * // Create many OpenclawRiskSnapshots
     * const openclawRiskSnapshot = await prisma.openclawRiskSnapshot.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OpenclawRiskSnapshotCreateManyArgs>(args?: SelectSubset<T, OpenclawRiskSnapshotCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a OpenclawRiskSnapshot.
     * @param {OpenclawRiskSnapshotDeleteArgs} args - Arguments to delete one OpenclawRiskSnapshot.
     * @example
     * // Delete one OpenclawRiskSnapshot
     * const OpenclawRiskSnapshot = await prisma.openclawRiskSnapshot.delete({
     *   where: {
     *     // ... filter to delete one OpenclawRiskSnapshot
     *   }
     * })
     * 
     */
    delete<T extends OpenclawRiskSnapshotDeleteArgs>(args: SelectSubset<T, OpenclawRiskSnapshotDeleteArgs<ExtArgs>>): Prisma__OpenclawRiskSnapshotClient<$Result.GetResult<Prisma.$OpenclawRiskSnapshotPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one OpenclawRiskSnapshot.
     * @param {OpenclawRiskSnapshotUpdateArgs} args - Arguments to update one OpenclawRiskSnapshot.
     * @example
     * // Update one OpenclawRiskSnapshot
     * const openclawRiskSnapshot = await prisma.openclawRiskSnapshot.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OpenclawRiskSnapshotUpdateArgs>(args: SelectSubset<T, OpenclawRiskSnapshotUpdateArgs<ExtArgs>>): Prisma__OpenclawRiskSnapshotClient<$Result.GetResult<Prisma.$OpenclawRiskSnapshotPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more OpenclawRiskSnapshots.
     * @param {OpenclawRiskSnapshotDeleteManyArgs} args - Arguments to filter OpenclawRiskSnapshots to delete.
     * @example
     * // Delete a few OpenclawRiskSnapshots
     * const { count } = await prisma.openclawRiskSnapshot.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OpenclawRiskSnapshotDeleteManyArgs>(args?: SelectSubset<T, OpenclawRiskSnapshotDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OpenclawRiskSnapshots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OpenclawRiskSnapshotUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OpenclawRiskSnapshots
     * const openclawRiskSnapshot = await prisma.openclawRiskSnapshot.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OpenclawRiskSnapshotUpdateManyArgs>(args: SelectSubset<T, OpenclawRiskSnapshotUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one OpenclawRiskSnapshot.
     * @param {OpenclawRiskSnapshotUpsertArgs} args - Arguments to update or create a OpenclawRiskSnapshot.
     * @example
     * // Update or create a OpenclawRiskSnapshot
     * const openclawRiskSnapshot = await prisma.openclawRiskSnapshot.upsert({
     *   create: {
     *     // ... data to create a OpenclawRiskSnapshot
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OpenclawRiskSnapshot we want to update
     *   }
     * })
     */
    upsert<T extends OpenclawRiskSnapshotUpsertArgs>(args: SelectSubset<T, OpenclawRiskSnapshotUpsertArgs<ExtArgs>>): Prisma__OpenclawRiskSnapshotClient<$Result.GetResult<Prisma.$OpenclawRiskSnapshotPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of OpenclawRiskSnapshots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OpenclawRiskSnapshotCountArgs} args - Arguments to filter OpenclawRiskSnapshots to count.
     * @example
     * // Count the number of OpenclawRiskSnapshots
     * const count = await prisma.openclawRiskSnapshot.count({
     *   where: {
     *     // ... the filter for the OpenclawRiskSnapshots we want to count
     *   }
     * })
    **/
    count<T extends OpenclawRiskSnapshotCountArgs>(
      args?: Subset<T, OpenclawRiskSnapshotCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OpenclawRiskSnapshotCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a OpenclawRiskSnapshot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OpenclawRiskSnapshotAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends OpenclawRiskSnapshotAggregateArgs>(args: Subset<T, OpenclawRiskSnapshotAggregateArgs>): Prisma.PrismaPromise<GetOpenclawRiskSnapshotAggregateType<T>>

    /**
     * Group by OpenclawRiskSnapshot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OpenclawRiskSnapshotGroupByArgs} args - Group by arguments.
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
      T extends OpenclawRiskSnapshotGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OpenclawRiskSnapshotGroupByArgs['orderBy'] }
        : { orderBy?: OpenclawRiskSnapshotGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, OpenclawRiskSnapshotGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOpenclawRiskSnapshotGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the OpenclawRiskSnapshot model
   */
  readonly fields: OpenclawRiskSnapshotFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for OpenclawRiskSnapshot.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OpenclawRiskSnapshotClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    issues<T extends OpenclawRiskSnapshot$issuesArgs<ExtArgs> = {}>(args?: Subset<T, OpenclawRiskSnapshot$issuesArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OpenclawRiskIssuePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the OpenclawRiskSnapshot model
   */
  interface OpenclawRiskSnapshotFieldRefs {
    readonly id: FieldRef<"OpenclawRiskSnapshot", 'Int'>
    readonly snapshotKey: FieldRef<"OpenclawRiskSnapshot", 'String'>
    readonly triggerSource: FieldRef<"OpenclawRiskSnapshot", 'String'>
    readonly status: FieldRef<"OpenclawRiskSnapshot", 'String'>
    readonly latestStableTag: FieldRef<"OpenclawRiskSnapshot", 'String'>
    readonly latestStableVersion: FieldRef<"OpenclawRiskSnapshot", 'String'>
    readonly latestStableUrl: FieldRef<"OpenclawRiskSnapshot", 'String'>
    readonly latestStablePublishedAt: FieldRef<"OpenclawRiskSnapshot", 'DateTime'>
    readonly totalIssues: FieldRef<"OpenclawRiskSnapshot", 'Int'>
    readonly githubAdvisories: FieldRef<"OpenclawRiskSnapshot", 'Int'>
    readonly nvdCves: FieldRef<"OpenclawRiskSnapshot", 'Int'>
    readonly officialAdvisoryCount: FieldRef<"OpenclawRiskSnapshot", 'Int'>
    readonly cveRecordCount: FieldRef<"OpenclawRiskSnapshot", 'Int'>
    readonly conferencePaperCount: FieldRef<"OpenclawRiskSnapshot", 'Int'>
    readonly preprintCount: FieldRef<"OpenclawRiskSnapshot", 'Int'>
    readonly researchCount: FieldRef<"OpenclawRiskSnapshot", 'Int'>
    readonly newsCount: FieldRef<"OpenclawRiskSnapshot", 'Int'>
    readonly criticalCount: FieldRef<"OpenclawRiskSnapshot", 'Int'>
    readonly highRiskCount: FieldRef<"OpenclawRiskSnapshot", 'Int'>
    readonly fixedCount: FieldRef<"OpenclawRiskSnapshot", 'Int'>
    readonly unfixedCount: FieldRef<"OpenclawRiskSnapshot", 'Int'>
    readonly unknownCount: FieldRef<"OpenclawRiskSnapshot", 'Int'>
    readonly fixProgressPercent: FieldRef<"OpenclawRiskSnapshot", 'Int'>
    readonly sourceMeta: FieldRef<"OpenclawRiskSnapshot", 'Json'>
    readonly cacheDir: FieldRef<"OpenclawRiskSnapshot", 'String'>
    readonly createdAt: FieldRef<"OpenclawRiskSnapshot", 'DateTime'>
    readonly updatedAt: FieldRef<"OpenclawRiskSnapshot", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * OpenclawRiskSnapshot findUnique
   */
  export type OpenclawRiskSnapshotFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OpenclawRiskSnapshot
     */
    select?: OpenclawRiskSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OpenclawRiskSnapshot
     */
    omit?: OpenclawRiskSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OpenclawRiskSnapshotInclude<ExtArgs> | null
    /**
     * Filter, which OpenclawRiskSnapshot to fetch.
     */
    where: OpenclawRiskSnapshotWhereUniqueInput
  }

  /**
   * OpenclawRiskSnapshot findUniqueOrThrow
   */
  export type OpenclawRiskSnapshotFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OpenclawRiskSnapshot
     */
    select?: OpenclawRiskSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OpenclawRiskSnapshot
     */
    omit?: OpenclawRiskSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OpenclawRiskSnapshotInclude<ExtArgs> | null
    /**
     * Filter, which OpenclawRiskSnapshot to fetch.
     */
    where: OpenclawRiskSnapshotWhereUniqueInput
  }

  /**
   * OpenclawRiskSnapshot findFirst
   */
  export type OpenclawRiskSnapshotFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OpenclawRiskSnapshot
     */
    select?: OpenclawRiskSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OpenclawRiskSnapshot
     */
    omit?: OpenclawRiskSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OpenclawRiskSnapshotInclude<ExtArgs> | null
    /**
     * Filter, which OpenclawRiskSnapshot to fetch.
     */
    where?: OpenclawRiskSnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OpenclawRiskSnapshots to fetch.
     */
    orderBy?: OpenclawRiskSnapshotOrderByWithRelationInput | OpenclawRiskSnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OpenclawRiskSnapshots.
     */
    cursor?: OpenclawRiskSnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OpenclawRiskSnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OpenclawRiskSnapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OpenclawRiskSnapshots.
     */
    distinct?: OpenclawRiskSnapshotScalarFieldEnum | OpenclawRiskSnapshotScalarFieldEnum[]
  }

  /**
   * OpenclawRiskSnapshot findFirstOrThrow
   */
  export type OpenclawRiskSnapshotFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OpenclawRiskSnapshot
     */
    select?: OpenclawRiskSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OpenclawRiskSnapshot
     */
    omit?: OpenclawRiskSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OpenclawRiskSnapshotInclude<ExtArgs> | null
    /**
     * Filter, which OpenclawRiskSnapshot to fetch.
     */
    where?: OpenclawRiskSnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OpenclawRiskSnapshots to fetch.
     */
    orderBy?: OpenclawRiskSnapshotOrderByWithRelationInput | OpenclawRiskSnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OpenclawRiskSnapshots.
     */
    cursor?: OpenclawRiskSnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OpenclawRiskSnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OpenclawRiskSnapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OpenclawRiskSnapshots.
     */
    distinct?: OpenclawRiskSnapshotScalarFieldEnum | OpenclawRiskSnapshotScalarFieldEnum[]
  }

  /**
   * OpenclawRiskSnapshot findMany
   */
  export type OpenclawRiskSnapshotFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OpenclawRiskSnapshot
     */
    select?: OpenclawRiskSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OpenclawRiskSnapshot
     */
    omit?: OpenclawRiskSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OpenclawRiskSnapshotInclude<ExtArgs> | null
    /**
     * Filter, which OpenclawRiskSnapshots to fetch.
     */
    where?: OpenclawRiskSnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OpenclawRiskSnapshots to fetch.
     */
    orderBy?: OpenclawRiskSnapshotOrderByWithRelationInput | OpenclawRiskSnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing OpenclawRiskSnapshots.
     */
    cursor?: OpenclawRiskSnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OpenclawRiskSnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OpenclawRiskSnapshots.
     */
    skip?: number
    distinct?: OpenclawRiskSnapshotScalarFieldEnum | OpenclawRiskSnapshotScalarFieldEnum[]
  }

  /**
   * OpenclawRiskSnapshot create
   */
  export type OpenclawRiskSnapshotCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OpenclawRiskSnapshot
     */
    select?: OpenclawRiskSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OpenclawRiskSnapshot
     */
    omit?: OpenclawRiskSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OpenclawRiskSnapshotInclude<ExtArgs> | null
    /**
     * The data needed to create a OpenclawRiskSnapshot.
     */
    data: XOR<OpenclawRiskSnapshotCreateInput, OpenclawRiskSnapshotUncheckedCreateInput>
  }

  /**
   * OpenclawRiskSnapshot createMany
   */
  export type OpenclawRiskSnapshotCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many OpenclawRiskSnapshots.
     */
    data: OpenclawRiskSnapshotCreateManyInput | OpenclawRiskSnapshotCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OpenclawRiskSnapshot update
   */
  export type OpenclawRiskSnapshotUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OpenclawRiskSnapshot
     */
    select?: OpenclawRiskSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OpenclawRiskSnapshot
     */
    omit?: OpenclawRiskSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OpenclawRiskSnapshotInclude<ExtArgs> | null
    /**
     * The data needed to update a OpenclawRiskSnapshot.
     */
    data: XOR<OpenclawRiskSnapshotUpdateInput, OpenclawRiskSnapshotUncheckedUpdateInput>
    /**
     * Choose, which OpenclawRiskSnapshot to update.
     */
    where: OpenclawRiskSnapshotWhereUniqueInput
  }

  /**
   * OpenclawRiskSnapshot updateMany
   */
  export type OpenclawRiskSnapshotUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update OpenclawRiskSnapshots.
     */
    data: XOR<OpenclawRiskSnapshotUpdateManyMutationInput, OpenclawRiskSnapshotUncheckedUpdateManyInput>
    /**
     * Filter which OpenclawRiskSnapshots to update
     */
    where?: OpenclawRiskSnapshotWhereInput
    /**
     * Limit how many OpenclawRiskSnapshots to update.
     */
    limit?: number
  }

  /**
   * OpenclawRiskSnapshot upsert
   */
  export type OpenclawRiskSnapshotUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OpenclawRiskSnapshot
     */
    select?: OpenclawRiskSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OpenclawRiskSnapshot
     */
    omit?: OpenclawRiskSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OpenclawRiskSnapshotInclude<ExtArgs> | null
    /**
     * The filter to search for the OpenclawRiskSnapshot to update in case it exists.
     */
    where: OpenclawRiskSnapshotWhereUniqueInput
    /**
     * In case the OpenclawRiskSnapshot found by the `where` argument doesn't exist, create a new OpenclawRiskSnapshot with this data.
     */
    create: XOR<OpenclawRiskSnapshotCreateInput, OpenclawRiskSnapshotUncheckedCreateInput>
    /**
     * In case the OpenclawRiskSnapshot was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OpenclawRiskSnapshotUpdateInput, OpenclawRiskSnapshotUncheckedUpdateInput>
  }

  /**
   * OpenclawRiskSnapshot delete
   */
  export type OpenclawRiskSnapshotDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OpenclawRiskSnapshot
     */
    select?: OpenclawRiskSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OpenclawRiskSnapshot
     */
    omit?: OpenclawRiskSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OpenclawRiskSnapshotInclude<ExtArgs> | null
    /**
     * Filter which OpenclawRiskSnapshot to delete.
     */
    where: OpenclawRiskSnapshotWhereUniqueInput
  }

  /**
   * OpenclawRiskSnapshot deleteMany
   */
  export type OpenclawRiskSnapshotDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OpenclawRiskSnapshots to delete
     */
    where?: OpenclawRiskSnapshotWhereInput
    /**
     * Limit how many OpenclawRiskSnapshots to delete.
     */
    limit?: number
  }

  /**
   * OpenclawRiskSnapshot.issues
   */
  export type OpenclawRiskSnapshot$issuesArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OpenclawRiskIssue
     */
    select?: OpenclawRiskIssueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OpenclawRiskIssue
     */
    omit?: OpenclawRiskIssueOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OpenclawRiskIssueInclude<ExtArgs> | null
    where?: OpenclawRiskIssueWhereInput
    orderBy?: OpenclawRiskIssueOrderByWithRelationInput | OpenclawRiskIssueOrderByWithRelationInput[]
    cursor?: OpenclawRiskIssueWhereUniqueInput
    take?: number
    skip?: number
    distinct?: OpenclawRiskIssueScalarFieldEnum | OpenclawRiskIssueScalarFieldEnum[]
  }

  /**
   * OpenclawRiskSnapshot without action
   */
  export type OpenclawRiskSnapshotDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OpenclawRiskSnapshot
     */
    select?: OpenclawRiskSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OpenclawRiskSnapshot
     */
    omit?: OpenclawRiskSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OpenclawRiskSnapshotInclude<ExtArgs> | null
  }


  /**
   * Model OpenclawRiskIssue
   */

  export type AggregateOpenclawRiskIssue = {
    _count: OpenclawRiskIssueCountAggregateOutputType | null
    _avg: OpenclawRiskIssueAvgAggregateOutputType | null
    _sum: OpenclawRiskIssueSumAggregateOutputType | null
    _min: OpenclawRiskIssueMinAggregateOutputType | null
    _max: OpenclawRiskIssueMaxAggregateOutputType | null
  }

  export type OpenclawRiskIssueAvgAggregateOutputType = {
    id: number | null
    snapshotId: number | null
    score: number | null
    relevanceScore: number | null
  }

  export type OpenclawRiskIssueSumAggregateOutputType = {
    id: bigint | null
    snapshotId: number | null
    score: number | null
    relevanceScore: number | null
  }

  export type OpenclawRiskIssueMinAggregateOutputType = {
    id: bigint | null
    snapshotId: number | null
    canonicalId: string | null
    issueId: string | null
    title: string | null
    summary: string | null
    description: string | null
    sourcePrimary: string | null
    sourceType: string | null
    sourceSearch: string | null
    projectScope: string | null
    venue: string | null
    severity: string | null
    score: number | null
    cvssVector: string | null
    affectedRange: string | null
    fixedVersion: string | null
    latestStableVersion: string | null
    fixStatus: string | null
    fixLabel: string | null
    fixReason: string | null
    issueUrl: string | null
    repoUrl: string | null
    status: string | null
    relevanceScore: number | null
    publishedAt: Date | null
    sourceUpdatedAt: Date | null
    createdAt: Date | null
  }

  export type OpenclawRiskIssueMaxAggregateOutputType = {
    id: bigint | null
    snapshotId: number | null
    canonicalId: string | null
    issueId: string | null
    title: string | null
    summary: string | null
    description: string | null
    sourcePrimary: string | null
    sourceType: string | null
    sourceSearch: string | null
    projectScope: string | null
    venue: string | null
    severity: string | null
    score: number | null
    cvssVector: string | null
    affectedRange: string | null
    fixedVersion: string | null
    latestStableVersion: string | null
    fixStatus: string | null
    fixLabel: string | null
    fixReason: string | null
    issueUrl: string | null
    repoUrl: string | null
    status: string | null
    relevanceScore: number | null
    publishedAt: Date | null
    sourceUpdatedAt: Date | null
    createdAt: Date | null
  }

  export type OpenclawRiskIssueCountAggregateOutputType = {
    id: number
    snapshotId: number
    canonicalId: number
    issueId: number
    title: number
    summary: number
    description: number
    sourcePrimary: number
    sourceType: number
    sourceSearch: number
    sourceLabels: number
    sources: number
    githubIds: number
    cveIds: number
    projectScope: number
    venue: number
    authors: number
    severity: number
    score: number
    cvssVector: number
    cwes: number
    affectedRange: number
    fixedVersion: number
    latestStableVersion: number
    fixStatus: number
    fixLabel: number
    fixReason: number
    issueUrl: number
    repoUrl: number
    referenceUrls: number
    tags: number
    status: number
    relevanceScore: number
    publishedAt: number
    sourceUpdatedAt: number
    rawData: number
    createdAt: number
    _all: number
  }


  export type OpenclawRiskIssueAvgAggregateInputType = {
    id?: true
    snapshotId?: true
    score?: true
    relevanceScore?: true
  }

  export type OpenclawRiskIssueSumAggregateInputType = {
    id?: true
    snapshotId?: true
    score?: true
    relevanceScore?: true
  }

  export type OpenclawRiskIssueMinAggregateInputType = {
    id?: true
    snapshotId?: true
    canonicalId?: true
    issueId?: true
    title?: true
    summary?: true
    description?: true
    sourcePrimary?: true
    sourceType?: true
    sourceSearch?: true
    projectScope?: true
    venue?: true
    severity?: true
    score?: true
    cvssVector?: true
    affectedRange?: true
    fixedVersion?: true
    latestStableVersion?: true
    fixStatus?: true
    fixLabel?: true
    fixReason?: true
    issueUrl?: true
    repoUrl?: true
    status?: true
    relevanceScore?: true
    publishedAt?: true
    sourceUpdatedAt?: true
    createdAt?: true
  }

  export type OpenclawRiskIssueMaxAggregateInputType = {
    id?: true
    snapshotId?: true
    canonicalId?: true
    issueId?: true
    title?: true
    summary?: true
    description?: true
    sourcePrimary?: true
    sourceType?: true
    sourceSearch?: true
    projectScope?: true
    venue?: true
    severity?: true
    score?: true
    cvssVector?: true
    affectedRange?: true
    fixedVersion?: true
    latestStableVersion?: true
    fixStatus?: true
    fixLabel?: true
    fixReason?: true
    issueUrl?: true
    repoUrl?: true
    status?: true
    relevanceScore?: true
    publishedAt?: true
    sourceUpdatedAt?: true
    createdAt?: true
  }

  export type OpenclawRiskIssueCountAggregateInputType = {
    id?: true
    snapshotId?: true
    canonicalId?: true
    issueId?: true
    title?: true
    summary?: true
    description?: true
    sourcePrimary?: true
    sourceType?: true
    sourceSearch?: true
    sourceLabels?: true
    sources?: true
    githubIds?: true
    cveIds?: true
    projectScope?: true
    venue?: true
    authors?: true
    severity?: true
    score?: true
    cvssVector?: true
    cwes?: true
    affectedRange?: true
    fixedVersion?: true
    latestStableVersion?: true
    fixStatus?: true
    fixLabel?: true
    fixReason?: true
    issueUrl?: true
    repoUrl?: true
    referenceUrls?: true
    tags?: true
    status?: true
    relevanceScore?: true
    publishedAt?: true
    sourceUpdatedAt?: true
    rawData?: true
    createdAt?: true
    _all?: true
  }

  export type OpenclawRiskIssueAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OpenclawRiskIssue to aggregate.
     */
    where?: OpenclawRiskIssueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OpenclawRiskIssues to fetch.
     */
    orderBy?: OpenclawRiskIssueOrderByWithRelationInput | OpenclawRiskIssueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: OpenclawRiskIssueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OpenclawRiskIssues from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OpenclawRiskIssues.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned OpenclawRiskIssues
    **/
    _count?: true | OpenclawRiskIssueCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: OpenclawRiskIssueAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: OpenclawRiskIssueSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: OpenclawRiskIssueMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: OpenclawRiskIssueMaxAggregateInputType
  }

  export type GetOpenclawRiskIssueAggregateType<T extends OpenclawRiskIssueAggregateArgs> = {
        [P in keyof T & keyof AggregateOpenclawRiskIssue]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateOpenclawRiskIssue[P]>
      : GetScalarType<T[P], AggregateOpenclawRiskIssue[P]>
  }




  export type OpenclawRiskIssueGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: OpenclawRiskIssueWhereInput
    orderBy?: OpenclawRiskIssueOrderByWithAggregationInput | OpenclawRiskIssueOrderByWithAggregationInput[]
    by: OpenclawRiskIssueScalarFieldEnum[] | OpenclawRiskIssueScalarFieldEnum
    having?: OpenclawRiskIssueScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: OpenclawRiskIssueCountAggregateInputType | true
    _avg?: OpenclawRiskIssueAvgAggregateInputType
    _sum?: OpenclawRiskIssueSumAggregateInputType
    _min?: OpenclawRiskIssueMinAggregateInputType
    _max?: OpenclawRiskIssueMaxAggregateInputType
  }

  export type OpenclawRiskIssueGroupByOutputType = {
    id: bigint
    snapshotId: number
    canonicalId: string
    issueId: string
    title: string
    summary: string
    description: string
    sourcePrimary: string
    sourceType: string
    sourceSearch: string
    sourceLabels: JsonValue
    sources: JsonValue
    githubIds: JsonValue
    cveIds: JsonValue
    projectScope: string
    venue: string | null
    authors: JsonValue
    severity: string
    score: number | null
    cvssVector: string | null
    cwes: JsonValue
    affectedRange: string | null
    fixedVersion: string | null
    latestStableVersion: string | null
    fixStatus: string
    fixLabel: string
    fixReason: string
    issueUrl: string | null
    repoUrl: string | null
    referenceUrls: JsonValue
    tags: JsonValue
    status: string
    relevanceScore: number | null
    publishedAt: Date | null
    sourceUpdatedAt: Date | null
    rawData: JsonValue
    createdAt: Date
    _count: OpenclawRiskIssueCountAggregateOutputType | null
    _avg: OpenclawRiskIssueAvgAggregateOutputType | null
    _sum: OpenclawRiskIssueSumAggregateOutputType | null
    _min: OpenclawRiskIssueMinAggregateOutputType | null
    _max: OpenclawRiskIssueMaxAggregateOutputType | null
  }

  type GetOpenclawRiskIssueGroupByPayload<T extends OpenclawRiskIssueGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<OpenclawRiskIssueGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof OpenclawRiskIssueGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], OpenclawRiskIssueGroupByOutputType[P]>
            : GetScalarType<T[P], OpenclawRiskIssueGroupByOutputType[P]>
        }
      >
    >


  export type OpenclawRiskIssueSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    snapshotId?: boolean
    canonicalId?: boolean
    issueId?: boolean
    title?: boolean
    summary?: boolean
    description?: boolean
    sourcePrimary?: boolean
    sourceType?: boolean
    sourceSearch?: boolean
    sourceLabels?: boolean
    sources?: boolean
    githubIds?: boolean
    cveIds?: boolean
    projectScope?: boolean
    venue?: boolean
    authors?: boolean
    severity?: boolean
    score?: boolean
    cvssVector?: boolean
    cwes?: boolean
    affectedRange?: boolean
    fixedVersion?: boolean
    latestStableVersion?: boolean
    fixStatus?: boolean
    fixLabel?: boolean
    fixReason?: boolean
    issueUrl?: boolean
    repoUrl?: boolean
    referenceUrls?: boolean
    tags?: boolean
    status?: boolean
    relevanceScore?: boolean
    publishedAt?: boolean
    sourceUpdatedAt?: boolean
    rawData?: boolean
    createdAt?: boolean
    snapshot?: boolean | OpenclawRiskSnapshotDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["openclawRiskIssue"]>



  export type OpenclawRiskIssueSelectScalar = {
    id?: boolean
    snapshotId?: boolean
    canonicalId?: boolean
    issueId?: boolean
    title?: boolean
    summary?: boolean
    description?: boolean
    sourcePrimary?: boolean
    sourceType?: boolean
    sourceSearch?: boolean
    sourceLabels?: boolean
    sources?: boolean
    githubIds?: boolean
    cveIds?: boolean
    projectScope?: boolean
    venue?: boolean
    authors?: boolean
    severity?: boolean
    score?: boolean
    cvssVector?: boolean
    cwes?: boolean
    affectedRange?: boolean
    fixedVersion?: boolean
    latestStableVersion?: boolean
    fixStatus?: boolean
    fixLabel?: boolean
    fixReason?: boolean
    issueUrl?: boolean
    repoUrl?: boolean
    referenceUrls?: boolean
    tags?: boolean
    status?: boolean
    relevanceScore?: boolean
    publishedAt?: boolean
    sourceUpdatedAt?: boolean
    rawData?: boolean
    createdAt?: boolean
  }

  export type OpenclawRiskIssueOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "snapshotId" | "canonicalId" | "issueId" | "title" | "summary" | "description" | "sourcePrimary" | "sourceType" | "sourceSearch" | "sourceLabels" | "sources" | "githubIds" | "cveIds" | "projectScope" | "venue" | "authors" | "severity" | "score" | "cvssVector" | "cwes" | "affectedRange" | "fixedVersion" | "latestStableVersion" | "fixStatus" | "fixLabel" | "fixReason" | "issueUrl" | "repoUrl" | "referenceUrls" | "tags" | "status" | "relevanceScore" | "publishedAt" | "sourceUpdatedAt" | "rawData" | "createdAt", ExtArgs["result"]["openclawRiskIssue"]>
  export type OpenclawRiskIssueInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    snapshot?: boolean | OpenclawRiskSnapshotDefaultArgs<ExtArgs>
  }

  export type $OpenclawRiskIssuePayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "OpenclawRiskIssue"
    objects: {
      snapshot: Prisma.$OpenclawRiskSnapshotPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      snapshotId: number
      canonicalId: string
      issueId: string
      title: string
      summary: string
      description: string
      sourcePrimary: string
      sourceType: string
      sourceSearch: string
      sourceLabels: Prisma.JsonValue
      sources: Prisma.JsonValue
      githubIds: Prisma.JsonValue
      cveIds: Prisma.JsonValue
      projectScope: string
      venue: string | null
      authors: Prisma.JsonValue
      severity: string
      score: number | null
      cvssVector: string | null
      cwes: Prisma.JsonValue
      affectedRange: string | null
      fixedVersion: string | null
      latestStableVersion: string | null
      fixStatus: string
      fixLabel: string
      fixReason: string
      issueUrl: string | null
      repoUrl: string | null
      referenceUrls: Prisma.JsonValue
      tags: Prisma.JsonValue
      status: string
      relevanceScore: number | null
      publishedAt: Date | null
      sourceUpdatedAt: Date | null
      rawData: Prisma.JsonValue
      createdAt: Date
    }, ExtArgs["result"]["openclawRiskIssue"]>
    composites: {}
  }

  type OpenclawRiskIssueGetPayload<S extends boolean | null | undefined | OpenclawRiskIssueDefaultArgs> = $Result.GetResult<Prisma.$OpenclawRiskIssuePayload, S>

  type OpenclawRiskIssueCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<OpenclawRiskIssueFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: OpenclawRiskIssueCountAggregateInputType | true
    }

  export interface OpenclawRiskIssueDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['OpenclawRiskIssue'], meta: { name: 'OpenclawRiskIssue' } }
    /**
     * Find zero or one OpenclawRiskIssue that matches the filter.
     * @param {OpenclawRiskIssueFindUniqueArgs} args - Arguments to find a OpenclawRiskIssue
     * @example
     * // Get one OpenclawRiskIssue
     * const openclawRiskIssue = await prisma.openclawRiskIssue.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends OpenclawRiskIssueFindUniqueArgs>(args: SelectSubset<T, OpenclawRiskIssueFindUniqueArgs<ExtArgs>>): Prisma__OpenclawRiskIssueClient<$Result.GetResult<Prisma.$OpenclawRiskIssuePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one OpenclawRiskIssue that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {OpenclawRiskIssueFindUniqueOrThrowArgs} args - Arguments to find a OpenclawRiskIssue
     * @example
     * // Get one OpenclawRiskIssue
     * const openclawRiskIssue = await prisma.openclawRiskIssue.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends OpenclawRiskIssueFindUniqueOrThrowArgs>(args: SelectSubset<T, OpenclawRiskIssueFindUniqueOrThrowArgs<ExtArgs>>): Prisma__OpenclawRiskIssueClient<$Result.GetResult<Prisma.$OpenclawRiskIssuePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OpenclawRiskIssue that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OpenclawRiskIssueFindFirstArgs} args - Arguments to find a OpenclawRiskIssue
     * @example
     * // Get one OpenclawRiskIssue
     * const openclawRiskIssue = await prisma.openclawRiskIssue.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends OpenclawRiskIssueFindFirstArgs>(args?: SelectSubset<T, OpenclawRiskIssueFindFirstArgs<ExtArgs>>): Prisma__OpenclawRiskIssueClient<$Result.GetResult<Prisma.$OpenclawRiskIssuePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first OpenclawRiskIssue that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OpenclawRiskIssueFindFirstOrThrowArgs} args - Arguments to find a OpenclawRiskIssue
     * @example
     * // Get one OpenclawRiskIssue
     * const openclawRiskIssue = await prisma.openclawRiskIssue.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends OpenclawRiskIssueFindFirstOrThrowArgs>(args?: SelectSubset<T, OpenclawRiskIssueFindFirstOrThrowArgs<ExtArgs>>): Prisma__OpenclawRiskIssueClient<$Result.GetResult<Prisma.$OpenclawRiskIssuePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more OpenclawRiskIssues that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OpenclawRiskIssueFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all OpenclawRiskIssues
     * const openclawRiskIssues = await prisma.openclawRiskIssue.findMany()
     * 
     * // Get first 10 OpenclawRiskIssues
     * const openclawRiskIssues = await prisma.openclawRiskIssue.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const openclawRiskIssueWithIdOnly = await prisma.openclawRiskIssue.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends OpenclawRiskIssueFindManyArgs>(args?: SelectSubset<T, OpenclawRiskIssueFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$OpenclawRiskIssuePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a OpenclawRiskIssue.
     * @param {OpenclawRiskIssueCreateArgs} args - Arguments to create a OpenclawRiskIssue.
     * @example
     * // Create one OpenclawRiskIssue
     * const OpenclawRiskIssue = await prisma.openclawRiskIssue.create({
     *   data: {
     *     // ... data to create a OpenclawRiskIssue
     *   }
     * })
     * 
     */
    create<T extends OpenclawRiskIssueCreateArgs>(args: SelectSubset<T, OpenclawRiskIssueCreateArgs<ExtArgs>>): Prisma__OpenclawRiskIssueClient<$Result.GetResult<Prisma.$OpenclawRiskIssuePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many OpenclawRiskIssues.
     * @param {OpenclawRiskIssueCreateManyArgs} args - Arguments to create many OpenclawRiskIssues.
     * @example
     * // Create many OpenclawRiskIssues
     * const openclawRiskIssue = await prisma.openclawRiskIssue.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends OpenclawRiskIssueCreateManyArgs>(args?: SelectSubset<T, OpenclawRiskIssueCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a OpenclawRiskIssue.
     * @param {OpenclawRiskIssueDeleteArgs} args - Arguments to delete one OpenclawRiskIssue.
     * @example
     * // Delete one OpenclawRiskIssue
     * const OpenclawRiskIssue = await prisma.openclawRiskIssue.delete({
     *   where: {
     *     // ... filter to delete one OpenclawRiskIssue
     *   }
     * })
     * 
     */
    delete<T extends OpenclawRiskIssueDeleteArgs>(args: SelectSubset<T, OpenclawRiskIssueDeleteArgs<ExtArgs>>): Prisma__OpenclawRiskIssueClient<$Result.GetResult<Prisma.$OpenclawRiskIssuePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one OpenclawRiskIssue.
     * @param {OpenclawRiskIssueUpdateArgs} args - Arguments to update one OpenclawRiskIssue.
     * @example
     * // Update one OpenclawRiskIssue
     * const openclawRiskIssue = await prisma.openclawRiskIssue.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends OpenclawRiskIssueUpdateArgs>(args: SelectSubset<T, OpenclawRiskIssueUpdateArgs<ExtArgs>>): Prisma__OpenclawRiskIssueClient<$Result.GetResult<Prisma.$OpenclawRiskIssuePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more OpenclawRiskIssues.
     * @param {OpenclawRiskIssueDeleteManyArgs} args - Arguments to filter OpenclawRiskIssues to delete.
     * @example
     * // Delete a few OpenclawRiskIssues
     * const { count } = await prisma.openclawRiskIssue.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends OpenclawRiskIssueDeleteManyArgs>(args?: SelectSubset<T, OpenclawRiskIssueDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more OpenclawRiskIssues.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OpenclawRiskIssueUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many OpenclawRiskIssues
     * const openclawRiskIssue = await prisma.openclawRiskIssue.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends OpenclawRiskIssueUpdateManyArgs>(args: SelectSubset<T, OpenclawRiskIssueUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one OpenclawRiskIssue.
     * @param {OpenclawRiskIssueUpsertArgs} args - Arguments to update or create a OpenclawRiskIssue.
     * @example
     * // Update or create a OpenclawRiskIssue
     * const openclawRiskIssue = await prisma.openclawRiskIssue.upsert({
     *   create: {
     *     // ... data to create a OpenclawRiskIssue
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the OpenclawRiskIssue we want to update
     *   }
     * })
     */
    upsert<T extends OpenclawRiskIssueUpsertArgs>(args: SelectSubset<T, OpenclawRiskIssueUpsertArgs<ExtArgs>>): Prisma__OpenclawRiskIssueClient<$Result.GetResult<Prisma.$OpenclawRiskIssuePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of OpenclawRiskIssues.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OpenclawRiskIssueCountArgs} args - Arguments to filter OpenclawRiskIssues to count.
     * @example
     * // Count the number of OpenclawRiskIssues
     * const count = await prisma.openclawRiskIssue.count({
     *   where: {
     *     // ... the filter for the OpenclawRiskIssues we want to count
     *   }
     * })
    **/
    count<T extends OpenclawRiskIssueCountArgs>(
      args?: Subset<T, OpenclawRiskIssueCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], OpenclawRiskIssueCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a OpenclawRiskIssue.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OpenclawRiskIssueAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends OpenclawRiskIssueAggregateArgs>(args: Subset<T, OpenclawRiskIssueAggregateArgs>): Prisma.PrismaPromise<GetOpenclawRiskIssueAggregateType<T>>

    /**
     * Group by OpenclawRiskIssue.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {OpenclawRiskIssueGroupByArgs} args - Group by arguments.
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
      T extends OpenclawRiskIssueGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: OpenclawRiskIssueGroupByArgs['orderBy'] }
        : { orderBy?: OpenclawRiskIssueGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, OpenclawRiskIssueGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetOpenclawRiskIssueGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the OpenclawRiskIssue model
   */
  readonly fields: OpenclawRiskIssueFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for OpenclawRiskIssue.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__OpenclawRiskIssueClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    snapshot<T extends OpenclawRiskSnapshotDefaultArgs<ExtArgs> = {}>(args?: Subset<T, OpenclawRiskSnapshotDefaultArgs<ExtArgs>>): Prisma__OpenclawRiskSnapshotClient<$Result.GetResult<Prisma.$OpenclawRiskSnapshotPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the OpenclawRiskIssue model
   */
  interface OpenclawRiskIssueFieldRefs {
    readonly id: FieldRef<"OpenclawRiskIssue", 'BigInt'>
    readonly snapshotId: FieldRef<"OpenclawRiskIssue", 'Int'>
    readonly canonicalId: FieldRef<"OpenclawRiskIssue", 'String'>
    readonly issueId: FieldRef<"OpenclawRiskIssue", 'String'>
    readonly title: FieldRef<"OpenclawRiskIssue", 'String'>
    readonly summary: FieldRef<"OpenclawRiskIssue", 'String'>
    readonly description: FieldRef<"OpenclawRiskIssue", 'String'>
    readonly sourcePrimary: FieldRef<"OpenclawRiskIssue", 'String'>
    readonly sourceType: FieldRef<"OpenclawRiskIssue", 'String'>
    readonly sourceSearch: FieldRef<"OpenclawRiskIssue", 'String'>
    readonly sourceLabels: FieldRef<"OpenclawRiskIssue", 'Json'>
    readonly sources: FieldRef<"OpenclawRiskIssue", 'Json'>
    readonly githubIds: FieldRef<"OpenclawRiskIssue", 'Json'>
    readonly cveIds: FieldRef<"OpenclawRiskIssue", 'Json'>
    readonly projectScope: FieldRef<"OpenclawRiskIssue", 'String'>
    readonly venue: FieldRef<"OpenclawRiskIssue", 'String'>
    readonly authors: FieldRef<"OpenclawRiskIssue", 'Json'>
    readonly severity: FieldRef<"OpenclawRiskIssue", 'String'>
    readonly score: FieldRef<"OpenclawRiskIssue", 'Float'>
    readonly cvssVector: FieldRef<"OpenclawRiskIssue", 'String'>
    readonly cwes: FieldRef<"OpenclawRiskIssue", 'Json'>
    readonly affectedRange: FieldRef<"OpenclawRiskIssue", 'String'>
    readonly fixedVersion: FieldRef<"OpenclawRiskIssue", 'String'>
    readonly latestStableVersion: FieldRef<"OpenclawRiskIssue", 'String'>
    readonly fixStatus: FieldRef<"OpenclawRiskIssue", 'String'>
    readonly fixLabel: FieldRef<"OpenclawRiskIssue", 'String'>
    readonly fixReason: FieldRef<"OpenclawRiskIssue", 'String'>
    readonly issueUrl: FieldRef<"OpenclawRiskIssue", 'String'>
    readonly repoUrl: FieldRef<"OpenclawRiskIssue", 'String'>
    readonly referenceUrls: FieldRef<"OpenclawRiskIssue", 'Json'>
    readonly tags: FieldRef<"OpenclawRiskIssue", 'Json'>
    readonly status: FieldRef<"OpenclawRiskIssue", 'String'>
    readonly relevanceScore: FieldRef<"OpenclawRiskIssue", 'Float'>
    readonly publishedAt: FieldRef<"OpenclawRiskIssue", 'DateTime'>
    readonly sourceUpdatedAt: FieldRef<"OpenclawRiskIssue", 'DateTime'>
    readonly rawData: FieldRef<"OpenclawRiskIssue", 'Json'>
    readonly createdAt: FieldRef<"OpenclawRiskIssue", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * OpenclawRiskIssue findUnique
   */
  export type OpenclawRiskIssueFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OpenclawRiskIssue
     */
    select?: OpenclawRiskIssueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OpenclawRiskIssue
     */
    omit?: OpenclawRiskIssueOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OpenclawRiskIssueInclude<ExtArgs> | null
    /**
     * Filter, which OpenclawRiskIssue to fetch.
     */
    where: OpenclawRiskIssueWhereUniqueInput
  }

  /**
   * OpenclawRiskIssue findUniqueOrThrow
   */
  export type OpenclawRiskIssueFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OpenclawRiskIssue
     */
    select?: OpenclawRiskIssueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OpenclawRiskIssue
     */
    omit?: OpenclawRiskIssueOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OpenclawRiskIssueInclude<ExtArgs> | null
    /**
     * Filter, which OpenclawRiskIssue to fetch.
     */
    where: OpenclawRiskIssueWhereUniqueInput
  }

  /**
   * OpenclawRiskIssue findFirst
   */
  export type OpenclawRiskIssueFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OpenclawRiskIssue
     */
    select?: OpenclawRiskIssueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OpenclawRiskIssue
     */
    omit?: OpenclawRiskIssueOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OpenclawRiskIssueInclude<ExtArgs> | null
    /**
     * Filter, which OpenclawRiskIssue to fetch.
     */
    where?: OpenclawRiskIssueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OpenclawRiskIssues to fetch.
     */
    orderBy?: OpenclawRiskIssueOrderByWithRelationInput | OpenclawRiskIssueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OpenclawRiskIssues.
     */
    cursor?: OpenclawRiskIssueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OpenclawRiskIssues from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OpenclawRiskIssues.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OpenclawRiskIssues.
     */
    distinct?: OpenclawRiskIssueScalarFieldEnum | OpenclawRiskIssueScalarFieldEnum[]
  }

  /**
   * OpenclawRiskIssue findFirstOrThrow
   */
  export type OpenclawRiskIssueFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OpenclawRiskIssue
     */
    select?: OpenclawRiskIssueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OpenclawRiskIssue
     */
    omit?: OpenclawRiskIssueOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OpenclawRiskIssueInclude<ExtArgs> | null
    /**
     * Filter, which OpenclawRiskIssue to fetch.
     */
    where?: OpenclawRiskIssueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OpenclawRiskIssues to fetch.
     */
    orderBy?: OpenclawRiskIssueOrderByWithRelationInput | OpenclawRiskIssueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for OpenclawRiskIssues.
     */
    cursor?: OpenclawRiskIssueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OpenclawRiskIssues from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OpenclawRiskIssues.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of OpenclawRiskIssues.
     */
    distinct?: OpenclawRiskIssueScalarFieldEnum | OpenclawRiskIssueScalarFieldEnum[]
  }

  /**
   * OpenclawRiskIssue findMany
   */
  export type OpenclawRiskIssueFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OpenclawRiskIssue
     */
    select?: OpenclawRiskIssueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OpenclawRiskIssue
     */
    omit?: OpenclawRiskIssueOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OpenclawRiskIssueInclude<ExtArgs> | null
    /**
     * Filter, which OpenclawRiskIssues to fetch.
     */
    where?: OpenclawRiskIssueWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of OpenclawRiskIssues to fetch.
     */
    orderBy?: OpenclawRiskIssueOrderByWithRelationInput | OpenclawRiskIssueOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing OpenclawRiskIssues.
     */
    cursor?: OpenclawRiskIssueWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` OpenclawRiskIssues from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` OpenclawRiskIssues.
     */
    skip?: number
    distinct?: OpenclawRiskIssueScalarFieldEnum | OpenclawRiskIssueScalarFieldEnum[]
  }

  /**
   * OpenclawRiskIssue create
   */
  export type OpenclawRiskIssueCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OpenclawRiskIssue
     */
    select?: OpenclawRiskIssueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OpenclawRiskIssue
     */
    omit?: OpenclawRiskIssueOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OpenclawRiskIssueInclude<ExtArgs> | null
    /**
     * The data needed to create a OpenclawRiskIssue.
     */
    data: XOR<OpenclawRiskIssueCreateInput, OpenclawRiskIssueUncheckedCreateInput>
  }

  /**
   * OpenclawRiskIssue createMany
   */
  export type OpenclawRiskIssueCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many OpenclawRiskIssues.
     */
    data: OpenclawRiskIssueCreateManyInput | OpenclawRiskIssueCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * OpenclawRiskIssue update
   */
  export type OpenclawRiskIssueUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OpenclawRiskIssue
     */
    select?: OpenclawRiskIssueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OpenclawRiskIssue
     */
    omit?: OpenclawRiskIssueOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OpenclawRiskIssueInclude<ExtArgs> | null
    /**
     * The data needed to update a OpenclawRiskIssue.
     */
    data: XOR<OpenclawRiskIssueUpdateInput, OpenclawRiskIssueUncheckedUpdateInput>
    /**
     * Choose, which OpenclawRiskIssue to update.
     */
    where: OpenclawRiskIssueWhereUniqueInput
  }

  /**
   * OpenclawRiskIssue updateMany
   */
  export type OpenclawRiskIssueUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update OpenclawRiskIssues.
     */
    data: XOR<OpenclawRiskIssueUpdateManyMutationInput, OpenclawRiskIssueUncheckedUpdateManyInput>
    /**
     * Filter which OpenclawRiskIssues to update
     */
    where?: OpenclawRiskIssueWhereInput
    /**
     * Limit how many OpenclawRiskIssues to update.
     */
    limit?: number
  }

  /**
   * OpenclawRiskIssue upsert
   */
  export type OpenclawRiskIssueUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OpenclawRiskIssue
     */
    select?: OpenclawRiskIssueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OpenclawRiskIssue
     */
    omit?: OpenclawRiskIssueOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OpenclawRiskIssueInclude<ExtArgs> | null
    /**
     * The filter to search for the OpenclawRiskIssue to update in case it exists.
     */
    where: OpenclawRiskIssueWhereUniqueInput
    /**
     * In case the OpenclawRiskIssue found by the `where` argument doesn't exist, create a new OpenclawRiskIssue with this data.
     */
    create: XOR<OpenclawRiskIssueCreateInput, OpenclawRiskIssueUncheckedCreateInput>
    /**
     * In case the OpenclawRiskIssue was found with the provided `where` argument, update it with this data.
     */
    update: XOR<OpenclawRiskIssueUpdateInput, OpenclawRiskIssueUncheckedUpdateInput>
  }

  /**
   * OpenclawRiskIssue delete
   */
  export type OpenclawRiskIssueDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OpenclawRiskIssue
     */
    select?: OpenclawRiskIssueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OpenclawRiskIssue
     */
    omit?: OpenclawRiskIssueOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OpenclawRiskIssueInclude<ExtArgs> | null
    /**
     * Filter which OpenclawRiskIssue to delete.
     */
    where: OpenclawRiskIssueWhereUniqueInput
  }

  /**
   * OpenclawRiskIssue deleteMany
   */
  export type OpenclawRiskIssueDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which OpenclawRiskIssues to delete
     */
    where?: OpenclawRiskIssueWhereInput
    /**
     * Limit how many OpenclawRiskIssues to delete.
     */
    limit?: number
  }

  /**
   * OpenclawRiskIssue without action
   */
  export type OpenclawRiskIssueDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the OpenclawRiskIssue
     */
    select?: OpenclawRiskIssueSelect<ExtArgs> | null
    /**
     * Omit specific fields from the OpenclawRiskIssue
     */
    omit?: OpenclawRiskIssueOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: OpenclawRiskIssueInclude<ExtArgs> | null
  }


  /**
   * Model SecurityResearchSnapshot
   */

  export type AggregateSecurityResearchSnapshot = {
    _count: SecurityResearchSnapshotCountAggregateOutputType | null
    _avg: SecurityResearchSnapshotAvgAggregateOutputType | null
    _sum: SecurityResearchSnapshotSumAggregateOutputType | null
    _min: SecurityResearchSnapshotMinAggregateOutputType | null
    _max: SecurityResearchSnapshotMaxAggregateOutputType | null
  }

  export type SecurityResearchSnapshotAvgAggregateOutputType = {
    id: number | null
    totalPapers: number | null
    conferencePaperCount: number | null
    preprintCount: number | null
    openclawCount: number | null
    clawCount: number | null
    skillCount: number | null
    agentCount: number | null
    pluginCount: number | null
  }

  export type SecurityResearchSnapshotSumAggregateOutputType = {
    id: number | null
    totalPapers: number | null
    conferencePaperCount: number | null
    preprintCount: number | null
    openclawCount: number | null
    clawCount: number | null
    skillCount: number | null
    agentCount: number | null
    pluginCount: number | null
  }

  export type SecurityResearchSnapshotMinAggregateOutputType = {
    id: number | null
    snapshotKey: string | null
    triggerSource: string | null
    status: string | null
    totalPapers: number | null
    conferencePaperCount: number | null
    preprintCount: number | null
    openclawCount: number | null
    clawCount: number | null
    skillCount: number | null
    agentCount: number | null
    pluginCount: number | null
    cacheDir: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SecurityResearchSnapshotMaxAggregateOutputType = {
    id: number | null
    snapshotKey: string | null
    triggerSource: string | null
    status: string | null
    totalPapers: number | null
    conferencePaperCount: number | null
    preprintCount: number | null
    openclawCount: number | null
    clawCount: number | null
    skillCount: number | null
    agentCount: number | null
    pluginCount: number | null
    cacheDir: string | null
    createdAt: Date | null
    updatedAt: Date | null
  }

  export type SecurityResearchSnapshotCountAggregateOutputType = {
    id: number
    snapshotKey: number
    triggerSource: number
    status: number
    totalPapers: number
    conferencePaperCount: number
    preprintCount: number
    openclawCount: number
    clawCount: number
    skillCount: number
    agentCount: number
    pluginCount: number
    sourceMeta: number
    cacheDir: number
    createdAt: number
    updatedAt: number
    _all: number
  }


  export type SecurityResearchSnapshotAvgAggregateInputType = {
    id?: true
    totalPapers?: true
    conferencePaperCount?: true
    preprintCount?: true
    openclawCount?: true
    clawCount?: true
    skillCount?: true
    agentCount?: true
    pluginCount?: true
  }

  export type SecurityResearchSnapshotSumAggregateInputType = {
    id?: true
    totalPapers?: true
    conferencePaperCount?: true
    preprintCount?: true
    openclawCount?: true
    clawCount?: true
    skillCount?: true
    agentCount?: true
    pluginCount?: true
  }

  export type SecurityResearchSnapshotMinAggregateInputType = {
    id?: true
    snapshotKey?: true
    triggerSource?: true
    status?: true
    totalPapers?: true
    conferencePaperCount?: true
    preprintCount?: true
    openclawCount?: true
    clawCount?: true
    skillCount?: true
    agentCount?: true
    pluginCount?: true
    cacheDir?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SecurityResearchSnapshotMaxAggregateInputType = {
    id?: true
    snapshotKey?: true
    triggerSource?: true
    status?: true
    totalPapers?: true
    conferencePaperCount?: true
    preprintCount?: true
    openclawCount?: true
    clawCount?: true
    skillCount?: true
    agentCount?: true
    pluginCount?: true
    cacheDir?: true
    createdAt?: true
    updatedAt?: true
  }

  export type SecurityResearchSnapshotCountAggregateInputType = {
    id?: true
    snapshotKey?: true
    triggerSource?: true
    status?: true
    totalPapers?: true
    conferencePaperCount?: true
    preprintCount?: true
    openclawCount?: true
    clawCount?: true
    skillCount?: true
    agentCount?: true
    pluginCount?: true
    sourceMeta?: true
    cacheDir?: true
    createdAt?: true
    updatedAt?: true
    _all?: true
  }

  export type SecurityResearchSnapshotAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SecurityResearchSnapshot to aggregate.
     */
    where?: SecurityResearchSnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SecurityResearchSnapshots to fetch.
     */
    orderBy?: SecurityResearchSnapshotOrderByWithRelationInput | SecurityResearchSnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SecurityResearchSnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SecurityResearchSnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SecurityResearchSnapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SecurityResearchSnapshots
    **/
    _count?: true | SecurityResearchSnapshotCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SecurityResearchSnapshotAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SecurityResearchSnapshotSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SecurityResearchSnapshotMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SecurityResearchSnapshotMaxAggregateInputType
  }

  export type GetSecurityResearchSnapshotAggregateType<T extends SecurityResearchSnapshotAggregateArgs> = {
        [P in keyof T & keyof AggregateSecurityResearchSnapshot]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSecurityResearchSnapshot[P]>
      : GetScalarType<T[P], AggregateSecurityResearchSnapshot[P]>
  }




  export type SecurityResearchSnapshotGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SecurityResearchSnapshotWhereInput
    orderBy?: SecurityResearchSnapshotOrderByWithAggregationInput | SecurityResearchSnapshotOrderByWithAggregationInput[]
    by: SecurityResearchSnapshotScalarFieldEnum[] | SecurityResearchSnapshotScalarFieldEnum
    having?: SecurityResearchSnapshotScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SecurityResearchSnapshotCountAggregateInputType | true
    _avg?: SecurityResearchSnapshotAvgAggregateInputType
    _sum?: SecurityResearchSnapshotSumAggregateInputType
    _min?: SecurityResearchSnapshotMinAggregateInputType
    _max?: SecurityResearchSnapshotMaxAggregateInputType
  }

  export type SecurityResearchSnapshotGroupByOutputType = {
    id: number
    snapshotKey: string
    triggerSource: string
    status: string
    totalPapers: number
    conferencePaperCount: number
    preprintCount: number
    openclawCount: number
    clawCount: number
    skillCount: number
    agentCount: number
    pluginCount: number
    sourceMeta: JsonValue
    cacheDir: string | null
    createdAt: Date
    updatedAt: Date
    _count: SecurityResearchSnapshotCountAggregateOutputType | null
    _avg: SecurityResearchSnapshotAvgAggregateOutputType | null
    _sum: SecurityResearchSnapshotSumAggregateOutputType | null
    _min: SecurityResearchSnapshotMinAggregateOutputType | null
    _max: SecurityResearchSnapshotMaxAggregateOutputType | null
  }

  type GetSecurityResearchSnapshotGroupByPayload<T extends SecurityResearchSnapshotGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SecurityResearchSnapshotGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SecurityResearchSnapshotGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SecurityResearchSnapshotGroupByOutputType[P]>
            : GetScalarType<T[P], SecurityResearchSnapshotGroupByOutputType[P]>
        }
      >
    >


  export type SecurityResearchSnapshotSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    snapshotKey?: boolean
    triggerSource?: boolean
    status?: boolean
    totalPapers?: boolean
    conferencePaperCount?: boolean
    preprintCount?: boolean
    openclawCount?: boolean
    clawCount?: boolean
    skillCount?: boolean
    agentCount?: boolean
    pluginCount?: boolean
    sourceMeta?: boolean
    cacheDir?: boolean
    createdAt?: boolean
    updatedAt?: boolean
    papers?: boolean | SecurityResearchSnapshot$papersArgs<ExtArgs>
    _count?: boolean | SecurityResearchSnapshotCountOutputTypeDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["securityResearchSnapshot"]>



  export type SecurityResearchSnapshotSelectScalar = {
    id?: boolean
    snapshotKey?: boolean
    triggerSource?: boolean
    status?: boolean
    totalPapers?: boolean
    conferencePaperCount?: boolean
    preprintCount?: boolean
    openclawCount?: boolean
    clawCount?: boolean
    skillCount?: boolean
    agentCount?: boolean
    pluginCount?: boolean
    sourceMeta?: boolean
    cacheDir?: boolean
    createdAt?: boolean
    updatedAt?: boolean
  }

  export type SecurityResearchSnapshotOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "snapshotKey" | "triggerSource" | "status" | "totalPapers" | "conferencePaperCount" | "preprintCount" | "openclawCount" | "clawCount" | "skillCount" | "agentCount" | "pluginCount" | "sourceMeta" | "cacheDir" | "createdAt" | "updatedAt", ExtArgs["result"]["securityResearchSnapshot"]>
  export type SecurityResearchSnapshotInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    papers?: boolean | SecurityResearchSnapshot$papersArgs<ExtArgs>
    _count?: boolean | SecurityResearchSnapshotCountOutputTypeDefaultArgs<ExtArgs>
  }

  export type $SecurityResearchSnapshotPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SecurityResearchSnapshot"
    objects: {
      papers: Prisma.$SecurityResearchPaperPayload<ExtArgs>[]
    }
    scalars: $Extensions.GetPayloadResult<{
      id: number
      snapshotKey: string
      triggerSource: string
      status: string
      totalPapers: number
      conferencePaperCount: number
      preprintCount: number
      openclawCount: number
      clawCount: number
      skillCount: number
      agentCount: number
      pluginCount: number
      sourceMeta: Prisma.JsonValue
      cacheDir: string | null
      createdAt: Date
      updatedAt: Date
    }, ExtArgs["result"]["securityResearchSnapshot"]>
    composites: {}
  }

  type SecurityResearchSnapshotGetPayload<S extends boolean | null | undefined | SecurityResearchSnapshotDefaultArgs> = $Result.GetResult<Prisma.$SecurityResearchSnapshotPayload, S>

  type SecurityResearchSnapshotCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SecurityResearchSnapshotFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SecurityResearchSnapshotCountAggregateInputType | true
    }

  export interface SecurityResearchSnapshotDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SecurityResearchSnapshot'], meta: { name: 'SecurityResearchSnapshot' } }
    /**
     * Find zero or one SecurityResearchSnapshot that matches the filter.
     * @param {SecurityResearchSnapshotFindUniqueArgs} args - Arguments to find a SecurityResearchSnapshot
     * @example
     * // Get one SecurityResearchSnapshot
     * const securityResearchSnapshot = await prisma.securityResearchSnapshot.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SecurityResearchSnapshotFindUniqueArgs>(args: SelectSubset<T, SecurityResearchSnapshotFindUniqueArgs<ExtArgs>>): Prisma__SecurityResearchSnapshotClient<$Result.GetResult<Prisma.$SecurityResearchSnapshotPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SecurityResearchSnapshot that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SecurityResearchSnapshotFindUniqueOrThrowArgs} args - Arguments to find a SecurityResearchSnapshot
     * @example
     * // Get one SecurityResearchSnapshot
     * const securityResearchSnapshot = await prisma.securityResearchSnapshot.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SecurityResearchSnapshotFindUniqueOrThrowArgs>(args: SelectSubset<T, SecurityResearchSnapshotFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SecurityResearchSnapshotClient<$Result.GetResult<Prisma.$SecurityResearchSnapshotPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SecurityResearchSnapshot that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SecurityResearchSnapshotFindFirstArgs} args - Arguments to find a SecurityResearchSnapshot
     * @example
     * // Get one SecurityResearchSnapshot
     * const securityResearchSnapshot = await prisma.securityResearchSnapshot.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SecurityResearchSnapshotFindFirstArgs>(args?: SelectSubset<T, SecurityResearchSnapshotFindFirstArgs<ExtArgs>>): Prisma__SecurityResearchSnapshotClient<$Result.GetResult<Prisma.$SecurityResearchSnapshotPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SecurityResearchSnapshot that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SecurityResearchSnapshotFindFirstOrThrowArgs} args - Arguments to find a SecurityResearchSnapshot
     * @example
     * // Get one SecurityResearchSnapshot
     * const securityResearchSnapshot = await prisma.securityResearchSnapshot.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SecurityResearchSnapshotFindFirstOrThrowArgs>(args?: SelectSubset<T, SecurityResearchSnapshotFindFirstOrThrowArgs<ExtArgs>>): Prisma__SecurityResearchSnapshotClient<$Result.GetResult<Prisma.$SecurityResearchSnapshotPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SecurityResearchSnapshots that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SecurityResearchSnapshotFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SecurityResearchSnapshots
     * const securityResearchSnapshots = await prisma.securityResearchSnapshot.findMany()
     * 
     * // Get first 10 SecurityResearchSnapshots
     * const securityResearchSnapshots = await prisma.securityResearchSnapshot.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const securityResearchSnapshotWithIdOnly = await prisma.securityResearchSnapshot.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SecurityResearchSnapshotFindManyArgs>(args?: SelectSubset<T, SecurityResearchSnapshotFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SecurityResearchSnapshotPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SecurityResearchSnapshot.
     * @param {SecurityResearchSnapshotCreateArgs} args - Arguments to create a SecurityResearchSnapshot.
     * @example
     * // Create one SecurityResearchSnapshot
     * const SecurityResearchSnapshot = await prisma.securityResearchSnapshot.create({
     *   data: {
     *     // ... data to create a SecurityResearchSnapshot
     *   }
     * })
     * 
     */
    create<T extends SecurityResearchSnapshotCreateArgs>(args: SelectSubset<T, SecurityResearchSnapshotCreateArgs<ExtArgs>>): Prisma__SecurityResearchSnapshotClient<$Result.GetResult<Prisma.$SecurityResearchSnapshotPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SecurityResearchSnapshots.
     * @param {SecurityResearchSnapshotCreateManyArgs} args - Arguments to create many SecurityResearchSnapshots.
     * @example
     * // Create many SecurityResearchSnapshots
     * const securityResearchSnapshot = await prisma.securityResearchSnapshot.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SecurityResearchSnapshotCreateManyArgs>(args?: SelectSubset<T, SecurityResearchSnapshotCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a SecurityResearchSnapshot.
     * @param {SecurityResearchSnapshotDeleteArgs} args - Arguments to delete one SecurityResearchSnapshot.
     * @example
     * // Delete one SecurityResearchSnapshot
     * const SecurityResearchSnapshot = await prisma.securityResearchSnapshot.delete({
     *   where: {
     *     // ... filter to delete one SecurityResearchSnapshot
     *   }
     * })
     * 
     */
    delete<T extends SecurityResearchSnapshotDeleteArgs>(args: SelectSubset<T, SecurityResearchSnapshotDeleteArgs<ExtArgs>>): Prisma__SecurityResearchSnapshotClient<$Result.GetResult<Prisma.$SecurityResearchSnapshotPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SecurityResearchSnapshot.
     * @param {SecurityResearchSnapshotUpdateArgs} args - Arguments to update one SecurityResearchSnapshot.
     * @example
     * // Update one SecurityResearchSnapshot
     * const securityResearchSnapshot = await prisma.securityResearchSnapshot.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SecurityResearchSnapshotUpdateArgs>(args: SelectSubset<T, SecurityResearchSnapshotUpdateArgs<ExtArgs>>): Prisma__SecurityResearchSnapshotClient<$Result.GetResult<Prisma.$SecurityResearchSnapshotPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SecurityResearchSnapshots.
     * @param {SecurityResearchSnapshotDeleteManyArgs} args - Arguments to filter SecurityResearchSnapshots to delete.
     * @example
     * // Delete a few SecurityResearchSnapshots
     * const { count } = await prisma.securityResearchSnapshot.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SecurityResearchSnapshotDeleteManyArgs>(args?: SelectSubset<T, SecurityResearchSnapshotDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SecurityResearchSnapshots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SecurityResearchSnapshotUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SecurityResearchSnapshots
     * const securityResearchSnapshot = await prisma.securityResearchSnapshot.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SecurityResearchSnapshotUpdateManyArgs>(args: SelectSubset<T, SecurityResearchSnapshotUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SecurityResearchSnapshot.
     * @param {SecurityResearchSnapshotUpsertArgs} args - Arguments to update or create a SecurityResearchSnapshot.
     * @example
     * // Update or create a SecurityResearchSnapshot
     * const securityResearchSnapshot = await prisma.securityResearchSnapshot.upsert({
     *   create: {
     *     // ... data to create a SecurityResearchSnapshot
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SecurityResearchSnapshot we want to update
     *   }
     * })
     */
    upsert<T extends SecurityResearchSnapshotUpsertArgs>(args: SelectSubset<T, SecurityResearchSnapshotUpsertArgs<ExtArgs>>): Prisma__SecurityResearchSnapshotClient<$Result.GetResult<Prisma.$SecurityResearchSnapshotPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SecurityResearchSnapshots.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SecurityResearchSnapshotCountArgs} args - Arguments to filter SecurityResearchSnapshots to count.
     * @example
     * // Count the number of SecurityResearchSnapshots
     * const count = await prisma.securityResearchSnapshot.count({
     *   where: {
     *     // ... the filter for the SecurityResearchSnapshots we want to count
     *   }
     * })
    **/
    count<T extends SecurityResearchSnapshotCountArgs>(
      args?: Subset<T, SecurityResearchSnapshotCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SecurityResearchSnapshotCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SecurityResearchSnapshot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SecurityResearchSnapshotAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SecurityResearchSnapshotAggregateArgs>(args: Subset<T, SecurityResearchSnapshotAggregateArgs>): Prisma.PrismaPromise<GetSecurityResearchSnapshotAggregateType<T>>

    /**
     * Group by SecurityResearchSnapshot.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SecurityResearchSnapshotGroupByArgs} args - Group by arguments.
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
      T extends SecurityResearchSnapshotGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SecurityResearchSnapshotGroupByArgs['orderBy'] }
        : { orderBy?: SecurityResearchSnapshotGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SecurityResearchSnapshotGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSecurityResearchSnapshotGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SecurityResearchSnapshot model
   */
  readonly fields: SecurityResearchSnapshotFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SecurityResearchSnapshot.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SecurityResearchSnapshotClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    papers<T extends SecurityResearchSnapshot$papersArgs<ExtArgs> = {}>(args?: Subset<T, SecurityResearchSnapshot$papersArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SecurityResearchPaperPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>
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
   * Fields of the SecurityResearchSnapshot model
   */
  interface SecurityResearchSnapshotFieldRefs {
    readonly id: FieldRef<"SecurityResearchSnapshot", 'Int'>
    readonly snapshotKey: FieldRef<"SecurityResearchSnapshot", 'String'>
    readonly triggerSource: FieldRef<"SecurityResearchSnapshot", 'String'>
    readonly status: FieldRef<"SecurityResearchSnapshot", 'String'>
    readonly totalPapers: FieldRef<"SecurityResearchSnapshot", 'Int'>
    readonly conferencePaperCount: FieldRef<"SecurityResearchSnapshot", 'Int'>
    readonly preprintCount: FieldRef<"SecurityResearchSnapshot", 'Int'>
    readonly openclawCount: FieldRef<"SecurityResearchSnapshot", 'Int'>
    readonly clawCount: FieldRef<"SecurityResearchSnapshot", 'Int'>
    readonly skillCount: FieldRef<"SecurityResearchSnapshot", 'Int'>
    readonly agentCount: FieldRef<"SecurityResearchSnapshot", 'Int'>
    readonly pluginCount: FieldRef<"SecurityResearchSnapshot", 'Int'>
    readonly sourceMeta: FieldRef<"SecurityResearchSnapshot", 'Json'>
    readonly cacheDir: FieldRef<"SecurityResearchSnapshot", 'String'>
    readonly createdAt: FieldRef<"SecurityResearchSnapshot", 'DateTime'>
    readonly updatedAt: FieldRef<"SecurityResearchSnapshot", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SecurityResearchSnapshot findUnique
   */
  export type SecurityResearchSnapshotFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecurityResearchSnapshot
     */
    select?: SecurityResearchSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecurityResearchSnapshot
     */
    omit?: SecurityResearchSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SecurityResearchSnapshotInclude<ExtArgs> | null
    /**
     * Filter, which SecurityResearchSnapshot to fetch.
     */
    where: SecurityResearchSnapshotWhereUniqueInput
  }

  /**
   * SecurityResearchSnapshot findUniqueOrThrow
   */
  export type SecurityResearchSnapshotFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecurityResearchSnapshot
     */
    select?: SecurityResearchSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecurityResearchSnapshot
     */
    omit?: SecurityResearchSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SecurityResearchSnapshotInclude<ExtArgs> | null
    /**
     * Filter, which SecurityResearchSnapshot to fetch.
     */
    where: SecurityResearchSnapshotWhereUniqueInput
  }

  /**
   * SecurityResearchSnapshot findFirst
   */
  export type SecurityResearchSnapshotFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecurityResearchSnapshot
     */
    select?: SecurityResearchSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecurityResearchSnapshot
     */
    omit?: SecurityResearchSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SecurityResearchSnapshotInclude<ExtArgs> | null
    /**
     * Filter, which SecurityResearchSnapshot to fetch.
     */
    where?: SecurityResearchSnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SecurityResearchSnapshots to fetch.
     */
    orderBy?: SecurityResearchSnapshotOrderByWithRelationInput | SecurityResearchSnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SecurityResearchSnapshots.
     */
    cursor?: SecurityResearchSnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SecurityResearchSnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SecurityResearchSnapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SecurityResearchSnapshots.
     */
    distinct?: SecurityResearchSnapshotScalarFieldEnum | SecurityResearchSnapshotScalarFieldEnum[]
  }

  /**
   * SecurityResearchSnapshot findFirstOrThrow
   */
  export type SecurityResearchSnapshotFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecurityResearchSnapshot
     */
    select?: SecurityResearchSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecurityResearchSnapshot
     */
    omit?: SecurityResearchSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SecurityResearchSnapshotInclude<ExtArgs> | null
    /**
     * Filter, which SecurityResearchSnapshot to fetch.
     */
    where?: SecurityResearchSnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SecurityResearchSnapshots to fetch.
     */
    orderBy?: SecurityResearchSnapshotOrderByWithRelationInput | SecurityResearchSnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SecurityResearchSnapshots.
     */
    cursor?: SecurityResearchSnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SecurityResearchSnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SecurityResearchSnapshots.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SecurityResearchSnapshots.
     */
    distinct?: SecurityResearchSnapshotScalarFieldEnum | SecurityResearchSnapshotScalarFieldEnum[]
  }

  /**
   * SecurityResearchSnapshot findMany
   */
  export type SecurityResearchSnapshotFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecurityResearchSnapshot
     */
    select?: SecurityResearchSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecurityResearchSnapshot
     */
    omit?: SecurityResearchSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SecurityResearchSnapshotInclude<ExtArgs> | null
    /**
     * Filter, which SecurityResearchSnapshots to fetch.
     */
    where?: SecurityResearchSnapshotWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SecurityResearchSnapshots to fetch.
     */
    orderBy?: SecurityResearchSnapshotOrderByWithRelationInput | SecurityResearchSnapshotOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SecurityResearchSnapshots.
     */
    cursor?: SecurityResearchSnapshotWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SecurityResearchSnapshots from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SecurityResearchSnapshots.
     */
    skip?: number
    distinct?: SecurityResearchSnapshotScalarFieldEnum | SecurityResearchSnapshotScalarFieldEnum[]
  }

  /**
   * SecurityResearchSnapshot create
   */
  export type SecurityResearchSnapshotCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecurityResearchSnapshot
     */
    select?: SecurityResearchSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecurityResearchSnapshot
     */
    omit?: SecurityResearchSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SecurityResearchSnapshotInclude<ExtArgs> | null
    /**
     * The data needed to create a SecurityResearchSnapshot.
     */
    data: XOR<SecurityResearchSnapshotCreateInput, SecurityResearchSnapshotUncheckedCreateInput>
  }

  /**
   * SecurityResearchSnapshot createMany
   */
  export type SecurityResearchSnapshotCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SecurityResearchSnapshots.
     */
    data: SecurityResearchSnapshotCreateManyInput | SecurityResearchSnapshotCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SecurityResearchSnapshot update
   */
  export type SecurityResearchSnapshotUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecurityResearchSnapshot
     */
    select?: SecurityResearchSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecurityResearchSnapshot
     */
    omit?: SecurityResearchSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SecurityResearchSnapshotInclude<ExtArgs> | null
    /**
     * The data needed to update a SecurityResearchSnapshot.
     */
    data: XOR<SecurityResearchSnapshotUpdateInput, SecurityResearchSnapshotUncheckedUpdateInput>
    /**
     * Choose, which SecurityResearchSnapshot to update.
     */
    where: SecurityResearchSnapshotWhereUniqueInput
  }

  /**
   * SecurityResearchSnapshot updateMany
   */
  export type SecurityResearchSnapshotUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SecurityResearchSnapshots.
     */
    data: XOR<SecurityResearchSnapshotUpdateManyMutationInput, SecurityResearchSnapshotUncheckedUpdateManyInput>
    /**
     * Filter which SecurityResearchSnapshots to update
     */
    where?: SecurityResearchSnapshotWhereInput
    /**
     * Limit how many SecurityResearchSnapshots to update.
     */
    limit?: number
  }

  /**
   * SecurityResearchSnapshot upsert
   */
  export type SecurityResearchSnapshotUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecurityResearchSnapshot
     */
    select?: SecurityResearchSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecurityResearchSnapshot
     */
    omit?: SecurityResearchSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SecurityResearchSnapshotInclude<ExtArgs> | null
    /**
     * The filter to search for the SecurityResearchSnapshot to update in case it exists.
     */
    where: SecurityResearchSnapshotWhereUniqueInput
    /**
     * In case the SecurityResearchSnapshot found by the `where` argument doesn't exist, create a new SecurityResearchSnapshot with this data.
     */
    create: XOR<SecurityResearchSnapshotCreateInput, SecurityResearchSnapshotUncheckedCreateInput>
    /**
     * In case the SecurityResearchSnapshot was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SecurityResearchSnapshotUpdateInput, SecurityResearchSnapshotUncheckedUpdateInput>
  }

  /**
   * SecurityResearchSnapshot delete
   */
  export type SecurityResearchSnapshotDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecurityResearchSnapshot
     */
    select?: SecurityResearchSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecurityResearchSnapshot
     */
    omit?: SecurityResearchSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SecurityResearchSnapshotInclude<ExtArgs> | null
    /**
     * Filter which SecurityResearchSnapshot to delete.
     */
    where: SecurityResearchSnapshotWhereUniqueInput
  }

  /**
   * SecurityResearchSnapshot deleteMany
   */
  export type SecurityResearchSnapshotDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SecurityResearchSnapshots to delete
     */
    where?: SecurityResearchSnapshotWhereInput
    /**
     * Limit how many SecurityResearchSnapshots to delete.
     */
    limit?: number
  }

  /**
   * SecurityResearchSnapshot.papers
   */
  export type SecurityResearchSnapshot$papersArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecurityResearchPaper
     */
    select?: SecurityResearchPaperSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecurityResearchPaper
     */
    omit?: SecurityResearchPaperOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SecurityResearchPaperInclude<ExtArgs> | null
    where?: SecurityResearchPaperWhereInput
    orderBy?: SecurityResearchPaperOrderByWithRelationInput | SecurityResearchPaperOrderByWithRelationInput[]
    cursor?: SecurityResearchPaperWhereUniqueInput
    take?: number
    skip?: number
    distinct?: SecurityResearchPaperScalarFieldEnum | SecurityResearchPaperScalarFieldEnum[]
  }

  /**
   * SecurityResearchSnapshot without action
   */
  export type SecurityResearchSnapshotDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecurityResearchSnapshot
     */
    select?: SecurityResearchSnapshotSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecurityResearchSnapshot
     */
    omit?: SecurityResearchSnapshotOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SecurityResearchSnapshotInclude<ExtArgs> | null
  }


  /**
   * Model SecurityResearchPaper
   */

  export type AggregateSecurityResearchPaper = {
    _count: SecurityResearchPaperCountAggregateOutputType | null
    _avg: SecurityResearchPaperAvgAggregateOutputType | null
    _sum: SecurityResearchPaperSumAggregateOutputType | null
    _min: SecurityResearchPaperMinAggregateOutputType | null
    _max: SecurityResearchPaperMaxAggregateOutputType | null
  }

  export type SecurityResearchPaperAvgAggregateOutputType = {
    id: number | null
    snapshotId: number | null
    relevanceScore: number | null
  }

  export type SecurityResearchPaperSumAggregateOutputType = {
    id: bigint | null
    snapshotId: number | null
    relevanceScore: number | null
  }

  export type SecurityResearchPaperMinAggregateOutputType = {
    id: bigint | null
    snapshotId: number | null
    canonicalId: string | null
    title: string | null
    normalizedTitle: string | null
    sourceType: string | null
    projectScope: string | null
    venue: string | null
    sourcePrimary: string | null
    sourceSearch: string | null
    abstractOrSummary: string | null
    sourceUrl: string | null
    relevanceScore: number | null
    isTopVenue: boolean | null
    publishedAt: Date | null
    status: string | null
    createdAt: Date | null
  }

  export type SecurityResearchPaperMaxAggregateOutputType = {
    id: bigint | null
    snapshotId: number | null
    canonicalId: string | null
    title: string | null
    normalizedTitle: string | null
    sourceType: string | null
    projectScope: string | null
    venue: string | null
    sourcePrimary: string | null
    sourceSearch: string | null
    abstractOrSummary: string | null
    sourceUrl: string | null
    relevanceScore: number | null
    isTopVenue: boolean | null
    publishedAt: Date | null
    status: string | null
    createdAt: Date | null
  }

  export type SecurityResearchPaperCountAggregateOutputType = {
    id: number
    snapshotId: number
    canonicalId: number
    title: number
    normalizedTitle: number
    sourceType: number
    projectScope: number
    venue: number
    sourcePrimary: number
    sourceSearch: number
    abstractOrSummary: number
    tags: number
    sourceUrl: number
    authors: number
    externalIds: number
    relevanceScore: number
    isTopVenue: number
    publishedAt: number
    status: number
    rawData: number
    createdAt: number
    _all: number
  }


  export type SecurityResearchPaperAvgAggregateInputType = {
    id?: true
    snapshotId?: true
    relevanceScore?: true
  }

  export type SecurityResearchPaperSumAggregateInputType = {
    id?: true
    snapshotId?: true
    relevanceScore?: true
  }

  export type SecurityResearchPaperMinAggregateInputType = {
    id?: true
    snapshotId?: true
    canonicalId?: true
    title?: true
    normalizedTitle?: true
    sourceType?: true
    projectScope?: true
    venue?: true
    sourcePrimary?: true
    sourceSearch?: true
    abstractOrSummary?: true
    sourceUrl?: true
    relevanceScore?: true
    isTopVenue?: true
    publishedAt?: true
    status?: true
    createdAt?: true
  }

  export type SecurityResearchPaperMaxAggregateInputType = {
    id?: true
    snapshotId?: true
    canonicalId?: true
    title?: true
    normalizedTitle?: true
    sourceType?: true
    projectScope?: true
    venue?: true
    sourcePrimary?: true
    sourceSearch?: true
    abstractOrSummary?: true
    sourceUrl?: true
    relevanceScore?: true
    isTopVenue?: true
    publishedAt?: true
    status?: true
    createdAt?: true
  }

  export type SecurityResearchPaperCountAggregateInputType = {
    id?: true
    snapshotId?: true
    canonicalId?: true
    title?: true
    normalizedTitle?: true
    sourceType?: true
    projectScope?: true
    venue?: true
    sourcePrimary?: true
    sourceSearch?: true
    abstractOrSummary?: true
    tags?: true
    sourceUrl?: true
    authors?: true
    externalIds?: true
    relevanceScore?: true
    isTopVenue?: true
    publishedAt?: true
    status?: true
    rawData?: true
    createdAt?: true
    _all?: true
  }

  export type SecurityResearchPaperAggregateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SecurityResearchPaper to aggregate.
     */
    where?: SecurityResearchPaperWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SecurityResearchPapers to fetch.
     */
    orderBy?: SecurityResearchPaperOrderByWithRelationInput | SecurityResearchPaperOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the start position
     */
    cursor?: SecurityResearchPaperWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SecurityResearchPapers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SecurityResearchPapers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Count returned SecurityResearchPapers
    **/
    _count?: true | SecurityResearchPaperCountAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to average
    **/
    _avg?: SecurityResearchPaperAvgAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to sum
    **/
    _sum?: SecurityResearchPaperSumAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the minimum value
    **/
    _min?: SecurityResearchPaperMinAggregateInputType
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/aggregations Aggregation Docs}
     * 
     * Select which fields to find the maximum value
    **/
    _max?: SecurityResearchPaperMaxAggregateInputType
  }

  export type GetSecurityResearchPaperAggregateType<T extends SecurityResearchPaperAggregateArgs> = {
        [P in keyof T & keyof AggregateSecurityResearchPaper]: P extends '_count' | 'count'
      ? T[P] extends true
        ? number
        : GetScalarType<T[P], AggregateSecurityResearchPaper[P]>
      : GetScalarType<T[P], AggregateSecurityResearchPaper[P]>
  }




  export type SecurityResearchPaperGroupByArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    where?: SecurityResearchPaperWhereInput
    orderBy?: SecurityResearchPaperOrderByWithAggregationInput | SecurityResearchPaperOrderByWithAggregationInput[]
    by: SecurityResearchPaperScalarFieldEnum[] | SecurityResearchPaperScalarFieldEnum
    having?: SecurityResearchPaperScalarWhereWithAggregatesInput
    take?: number
    skip?: number
    _count?: SecurityResearchPaperCountAggregateInputType | true
    _avg?: SecurityResearchPaperAvgAggregateInputType
    _sum?: SecurityResearchPaperSumAggregateInputType
    _min?: SecurityResearchPaperMinAggregateInputType
    _max?: SecurityResearchPaperMaxAggregateInputType
  }

  export type SecurityResearchPaperGroupByOutputType = {
    id: bigint
    snapshotId: number
    canonicalId: string
    title: string
    normalizedTitle: string
    sourceType: string
    projectScope: string
    venue: string
    sourcePrimary: string
    sourceSearch: string
    abstractOrSummary: string
    tags: JsonValue
    sourceUrl: string | null
    authors: JsonValue
    externalIds: JsonValue
    relevanceScore: number
    isTopVenue: boolean
    publishedAt: Date | null
    status: string
    rawData: JsonValue
    createdAt: Date
    _count: SecurityResearchPaperCountAggregateOutputType | null
    _avg: SecurityResearchPaperAvgAggregateOutputType | null
    _sum: SecurityResearchPaperSumAggregateOutputType | null
    _min: SecurityResearchPaperMinAggregateOutputType | null
    _max: SecurityResearchPaperMaxAggregateOutputType | null
  }

  type GetSecurityResearchPaperGroupByPayload<T extends SecurityResearchPaperGroupByArgs> = Prisma.PrismaPromise<
    Array<
      PickEnumerable<SecurityResearchPaperGroupByOutputType, T['by']> &
        {
          [P in ((keyof T) & (keyof SecurityResearchPaperGroupByOutputType))]: P extends '_count'
            ? T[P] extends boolean
              ? number
              : GetScalarType<T[P], SecurityResearchPaperGroupByOutputType[P]>
            : GetScalarType<T[P], SecurityResearchPaperGroupByOutputType[P]>
        }
      >
    >


  export type SecurityResearchPaperSelect<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetSelect<{
    id?: boolean
    snapshotId?: boolean
    canonicalId?: boolean
    title?: boolean
    normalizedTitle?: boolean
    sourceType?: boolean
    projectScope?: boolean
    venue?: boolean
    sourcePrimary?: boolean
    sourceSearch?: boolean
    abstractOrSummary?: boolean
    tags?: boolean
    sourceUrl?: boolean
    authors?: boolean
    externalIds?: boolean
    relevanceScore?: boolean
    isTopVenue?: boolean
    publishedAt?: boolean
    status?: boolean
    rawData?: boolean
    createdAt?: boolean
    snapshot?: boolean | SecurityResearchSnapshotDefaultArgs<ExtArgs>
  }, ExtArgs["result"]["securityResearchPaper"]>



  export type SecurityResearchPaperSelectScalar = {
    id?: boolean
    snapshotId?: boolean
    canonicalId?: boolean
    title?: boolean
    normalizedTitle?: boolean
    sourceType?: boolean
    projectScope?: boolean
    venue?: boolean
    sourcePrimary?: boolean
    sourceSearch?: boolean
    abstractOrSummary?: boolean
    tags?: boolean
    sourceUrl?: boolean
    authors?: boolean
    externalIds?: boolean
    relevanceScore?: boolean
    isTopVenue?: boolean
    publishedAt?: boolean
    status?: boolean
    rawData?: boolean
    createdAt?: boolean
  }

  export type SecurityResearchPaperOmit<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = $Extensions.GetOmit<"id" | "snapshotId" | "canonicalId" | "title" | "normalizedTitle" | "sourceType" | "projectScope" | "venue" | "sourcePrimary" | "sourceSearch" | "abstractOrSummary" | "tags" | "sourceUrl" | "authors" | "externalIds" | "relevanceScore" | "isTopVenue" | "publishedAt" | "status" | "rawData" | "createdAt", ExtArgs["result"]["securityResearchPaper"]>
  export type SecurityResearchPaperInclude<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    snapshot?: boolean | SecurityResearchSnapshotDefaultArgs<ExtArgs>
  }

  export type $SecurityResearchPaperPayload<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    name: "SecurityResearchPaper"
    objects: {
      snapshot: Prisma.$SecurityResearchSnapshotPayload<ExtArgs>
    }
    scalars: $Extensions.GetPayloadResult<{
      id: bigint
      snapshotId: number
      canonicalId: string
      title: string
      normalizedTitle: string
      sourceType: string
      projectScope: string
      venue: string
      sourcePrimary: string
      sourceSearch: string
      abstractOrSummary: string
      tags: Prisma.JsonValue
      sourceUrl: string | null
      authors: Prisma.JsonValue
      externalIds: Prisma.JsonValue
      relevanceScore: number
      isTopVenue: boolean
      publishedAt: Date | null
      status: string
      rawData: Prisma.JsonValue
      createdAt: Date
    }, ExtArgs["result"]["securityResearchPaper"]>
    composites: {}
  }

  type SecurityResearchPaperGetPayload<S extends boolean | null | undefined | SecurityResearchPaperDefaultArgs> = $Result.GetResult<Prisma.$SecurityResearchPaperPayload, S>

  type SecurityResearchPaperCountArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> =
    Omit<SecurityResearchPaperFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
      select?: SecurityResearchPaperCountAggregateInputType | true
    }

  export interface SecurityResearchPaperDelegate<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: { types: Prisma.TypeMap<ExtArgs>['model']['SecurityResearchPaper'], meta: { name: 'SecurityResearchPaper' } }
    /**
     * Find zero or one SecurityResearchPaper that matches the filter.
     * @param {SecurityResearchPaperFindUniqueArgs} args - Arguments to find a SecurityResearchPaper
     * @example
     * // Get one SecurityResearchPaper
     * const securityResearchPaper = await prisma.securityResearchPaper.findUnique({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUnique<T extends SecurityResearchPaperFindUniqueArgs>(args: SelectSubset<T, SecurityResearchPaperFindUniqueArgs<ExtArgs>>): Prisma__SecurityResearchPaperClient<$Result.GetResult<Prisma.$SecurityResearchPaperPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find one SecurityResearchPaper that matches the filter or throw an error with `error.code='P2025'`
     * if no matches were found.
     * @param {SecurityResearchPaperFindUniqueOrThrowArgs} args - Arguments to find a SecurityResearchPaper
     * @example
     * // Get one SecurityResearchPaper
     * const securityResearchPaper = await prisma.securityResearchPaper.findUniqueOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findUniqueOrThrow<T extends SecurityResearchPaperFindUniqueOrThrowArgs>(args: SelectSubset<T, SecurityResearchPaperFindUniqueOrThrowArgs<ExtArgs>>): Prisma__SecurityResearchPaperClient<$Result.GetResult<Prisma.$SecurityResearchPaperPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SecurityResearchPaper that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SecurityResearchPaperFindFirstArgs} args - Arguments to find a SecurityResearchPaper
     * @example
     * // Get one SecurityResearchPaper
     * const securityResearchPaper = await prisma.securityResearchPaper.findFirst({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirst<T extends SecurityResearchPaperFindFirstArgs>(args?: SelectSubset<T, SecurityResearchPaperFindFirstArgs<ExtArgs>>): Prisma__SecurityResearchPaperClient<$Result.GetResult<Prisma.$SecurityResearchPaperPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>

    /**
     * Find the first SecurityResearchPaper that matches the filter or
     * throw `PrismaKnownClientError` with `P2025` code if no matches were found.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SecurityResearchPaperFindFirstOrThrowArgs} args - Arguments to find a SecurityResearchPaper
     * @example
     * // Get one SecurityResearchPaper
     * const securityResearchPaper = await prisma.securityResearchPaper.findFirstOrThrow({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     */
    findFirstOrThrow<T extends SecurityResearchPaperFindFirstOrThrowArgs>(args?: SelectSubset<T, SecurityResearchPaperFindFirstOrThrowArgs<ExtArgs>>): Prisma__SecurityResearchPaperClient<$Result.GetResult<Prisma.$SecurityResearchPaperPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Find zero or more SecurityResearchPapers that matches the filter.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SecurityResearchPaperFindManyArgs} args - Arguments to filter and select certain fields only.
     * @example
     * // Get all SecurityResearchPapers
     * const securityResearchPapers = await prisma.securityResearchPaper.findMany()
     * 
     * // Get first 10 SecurityResearchPapers
     * const securityResearchPapers = await prisma.securityResearchPaper.findMany({ take: 10 })
     * 
     * // Only select the `id`
     * const securityResearchPaperWithIdOnly = await prisma.securityResearchPaper.findMany({ select: { id: true } })
     * 
     */
    findMany<T extends SecurityResearchPaperFindManyArgs>(args?: SelectSubset<T, SecurityResearchPaperFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<$Result.GetResult<Prisma.$SecurityResearchPaperPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>

    /**
     * Create a SecurityResearchPaper.
     * @param {SecurityResearchPaperCreateArgs} args - Arguments to create a SecurityResearchPaper.
     * @example
     * // Create one SecurityResearchPaper
     * const SecurityResearchPaper = await prisma.securityResearchPaper.create({
     *   data: {
     *     // ... data to create a SecurityResearchPaper
     *   }
     * })
     * 
     */
    create<T extends SecurityResearchPaperCreateArgs>(args: SelectSubset<T, SecurityResearchPaperCreateArgs<ExtArgs>>): Prisma__SecurityResearchPaperClient<$Result.GetResult<Prisma.$SecurityResearchPaperPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Create many SecurityResearchPapers.
     * @param {SecurityResearchPaperCreateManyArgs} args - Arguments to create many SecurityResearchPapers.
     * @example
     * // Create many SecurityResearchPapers
     * const securityResearchPaper = await prisma.securityResearchPaper.createMany({
     *   data: [
     *     // ... provide data here
     *   ]
     * })
     *     
     */
    createMany<T extends SecurityResearchPaperCreateManyArgs>(args?: SelectSubset<T, SecurityResearchPaperCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Delete a SecurityResearchPaper.
     * @param {SecurityResearchPaperDeleteArgs} args - Arguments to delete one SecurityResearchPaper.
     * @example
     * // Delete one SecurityResearchPaper
     * const SecurityResearchPaper = await prisma.securityResearchPaper.delete({
     *   where: {
     *     // ... filter to delete one SecurityResearchPaper
     *   }
     * })
     * 
     */
    delete<T extends SecurityResearchPaperDeleteArgs>(args: SelectSubset<T, SecurityResearchPaperDeleteArgs<ExtArgs>>): Prisma__SecurityResearchPaperClient<$Result.GetResult<Prisma.$SecurityResearchPaperPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Update one SecurityResearchPaper.
     * @param {SecurityResearchPaperUpdateArgs} args - Arguments to update one SecurityResearchPaper.
     * @example
     * // Update one SecurityResearchPaper
     * const securityResearchPaper = await prisma.securityResearchPaper.update({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    update<T extends SecurityResearchPaperUpdateArgs>(args: SelectSubset<T, SecurityResearchPaperUpdateArgs<ExtArgs>>): Prisma__SecurityResearchPaperClient<$Result.GetResult<Prisma.$SecurityResearchPaperPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>

    /**
     * Delete zero or more SecurityResearchPapers.
     * @param {SecurityResearchPaperDeleteManyArgs} args - Arguments to filter SecurityResearchPapers to delete.
     * @example
     * // Delete a few SecurityResearchPapers
     * const { count } = await prisma.securityResearchPaper.deleteMany({
     *   where: {
     *     // ... provide filter here
     *   }
     * })
     * 
     */
    deleteMany<T extends SecurityResearchPaperDeleteManyArgs>(args?: SelectSubset<T, SecurityResearchPaperDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Update zero or more SecurityResearchPapers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SecurityResearchPaperUpdateManyArgs} args - Arguments to update one or more rows.
     * @example
     * // Update many SecurityResearchPapers
     * const securityResearchPaper = await prisma.securityResearchPaper.updateMany({
     *   where: {
     *     // ... provide filter here
     *   },
     *   data: {
     *     // ... provide data here
     *   }
     * })
     * 
     */
    updateMany<T extends SecurityResearchPaperUpdateManyArgs>(args: SelectSubset<T, SecurityResearchPaperUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<BatchPayload>

    /**
     * Create or update one SecurityResearchPaper.
     * @param {SecurityResearchPaperUpsertArgs} args - Arguments to update or create a SecurityResearchPaper.
     * @example
     * // Update or create a SecurityResearchPaper
     * const securityResearchPaper = await prisma.securityResearchPaper.upsert({
     *   create: {
     *     // ... data to create a SecurityResearchPaper
     *   },
     *   update: {
     *     // ... in case it already exists, update
     *   },
     *   where: {
     *     // ... the filter for the SecurityResearchPaper we want to update
     *   }
     * })
     */
    upsert<T extends SecurityResearchPaperUpsertArgs>(args: SelectSubset<T, SecurityResearchPaperUpsertArgs<ExtArgs>>): Prisma__SecurityResearchPaperClient<$Result.GetResult<Prisma.$SecurityResearchPaperPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>


    /**
     * Count the number of SecurityResearchPapers.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SecurityResearchPaperCountArgs} args - Arguments to filter SecurityResearchPapers to count.
     * @example
     * // Count the number of SecurityResearchPapers
     * const count = await prisma.securityResearchPaper.count({
     *   where: {
     *     // ... the filter for the SecurityResearchPapers we want to count
     *   }
     * })
    **/
    count<T extends SecurityResearchPaperCountArgs>(
      args?: Subset<T, SecurityResearchPaperCountArgs>,
    ): Prisma.PrismaPromise<
      T extends $Utils.Record<'select', any>
        ? T['select'] extends true
          ? number
          : GetScalarType<T['select'], SecurityResearchPaperCountAggregateOutputType>
        : number
    >

    /**
     * Allows you to perform aggregations operations on a SecurityResearchPaper.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SecurityResearchPaperAggregateArgs} args - Select which aggregations you would like to apply and on what fields.
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
    aggregate<T extends SecurityResearchPaperAggregateArgs>(args: Subset<T, SecurityResearchPaperAggregateArgs>): Prisma.PrismaPromise<GetSecurityResearchPaperAggregateType<T>>

    /**
     * Group by SecurityResearchPaper.
     * Note, that providing `undefined` is treated as the value not being there.
     * Read more here: https://pris.ly/d/null-undefined
     * @param {SecurityResearchPaperGroupByArgs} args - Group by arguments.
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
      T extends SecurityResearchPaperGroupByArgs,
      HasSelectOrTake extends Or<
        Extends<'skip', Keys<T>>,
        Extends<'take', Keys<T>>
      >,
      OrderByArg extends True extends HasSelectOrTake
        ? { orderBy: SecurityResearchPaperGroupByArgs['orderBy'] }
        : { orderBy?: SecurityResearchPaperGroupByArgs['orderBy'] },
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
    >(args: SubsetIntersection<T, SecurityResearchPaperGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSecurityResearchPaperGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>
  /**
   * Fields of the SecurityResearchPaper model
   */
  readonly fields: SecurityResearchPaperFieldRefs;
  }

  /**
   * The delegate class that acts as a "Promise-like" for SecurityResearchPaper.
   * Why is this prefixed with `Prisma__`?
   * Because we want to prevent naming conflicts as mentioned in
   * https://github.com/prisma/prisma-client-js/issues/707
   */
  export interface Prisma__SecurityResearchPaperClient<T, Null = never, ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise"
    snapshot<T extends SecurityResearchSnapshotDefaultArgs<ExtArgs> = {}>(args?: Subset<T, SecurityResearchSnapshotDefaultArgs<ExtArgs>>): Prisma__SecurityResearchSnapshotClient<$Result.GetResult<Prisma.$SecurityResearchSnapshotPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>
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
   * Fields of the SecurityResearchPaper model
   */
  interface SecurityResearchPaperFieldRefs {
    readonly id: FieldRef<"SecurityResearchPaper", 'BigInt'>
    readonly snapshotId: FieldRef<"SecurityResearchPaper", 'Int'>
    readonly canonicalId: FieldRef<"SecurityResearchPaper", 'String'>
    readonly title: FieldRef<"SecurityResearchPaper", 'String'>
    readonly normalizedTitle: FieldRef<"SecurityResearchPaper", 'String'>
    readonly sourceType: FieldRef<"SecurityResearchPaper", 'String'>
    readonly projectScope: FieldRef<"SecurityResearchPaper", 'String'>
    readonly venue: FieldRef<"SecurityResearchPaper", 'String'>
    readonly sourcePrimary: FieldRef<"SecurityResearchPaper", 'String'>
    readonly sourceSearch: FieldRef<"SecurityResearchPaper", 'String'>
    readonly abstractOrSummary: FieldRef<"SecurityResearchPaper", 'String'>
    readonly tags: FieldRef<"SecurityResearchPaper", 'Json'>
    readonly sourceUrl: FieldRef<"SecurityResearchPaper", 'String'>
    readonly authors: FieldRef<"SecurityResearchPaper", 'Json'>
    readonly externalIds: FieldRef<"SecurityResearchPaper", 'Json'>
    readonly relevanceScore: FieldRef<"SecurityResearchPaper", 'Float'>
    readonly isTopVenue: FieldRef<"SecurityResearchPaper", 'Boolean'>
    readonly publishedAt: FieldRef<"SecurityResearchPaper", 'DateTime'>
    readonly status: FieldRef<"SecurityResearchPaper", 'String'>
    readonly rawData: FieldRef<"SecurityResearchPaper", 'Json'>
    readonly createdAt: FieldRef<"SecurityResearchPaper", 'DateTime'>
  }
    

  // Custom InputTypes
  /**
   * SecurityResearchPaper findUnique
   */
  export type SecurityResearchPaperFindUniqueArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecurityResearchPaper
     */
    select?: SecurityResearchPaperSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecurityResearchPaper
     */
    omit?: SecurityResearchPaperOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SecurityResearchPaperInclude<ExtArgs> | null
    /**
     * Filter, which SecurityResearchPaper to fetch.
     */
    where: SecurityResearchPaperWhereUniqueInput
  }

  /**
   * SecurityResearchPaper findUniqueOrThrow
   */
  export type SecurityResearchPaperFindUniqueOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecurityResearchPaper
     */
    select?: SecurityResearchPaperSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecurityResearchPaper
     */
    omit?: SecurityResearchPaperOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SecurityResearchPaperInclude<ExtArgs> | null
    /**
     * Filter, which SecurityResearchPaper to fetch.
     */
    where: SecurityResearchPaperWhereUniqueInput
  }

  /**
   * SecurityResearchPaper findFirst
   */
  export type SecurityResearchPaperFindFirstArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecurityResearchPaper
     */
    select?: SecurityResearchPaperSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecurityResearchPaper
     */
    omit?: SecurityResearchPaperOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SecurityResearchPaperInclude<ExtArgs> | null
    /**
     * Filter, which SecurityResearchPaper to fetch.
     */
    where?: SecurityResearchPaperWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SecurityResearchPapers to fetch.
     */
    orderBy?: SecurityResearchPaperOrderByWithRelationInput | SecurityResearchPaperOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SecurityResearchPapers.
     */
    cursor?: SecurityResearchPaperWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SecurityResearchPapers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SecurityResearchPapers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SecurityResearchPapers.
     */
    distinct?: SecurityResearchPaperScalarFieldEnum | SecurityResearchPaperScalarFieldEnum[]
  }

  /**
   * SecurityResearchPaper findFirstOrThrow
   */
  export type SecurityResearchPaperFindFirstOrThrowArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecurityResearchPaper
     */
    select?: SecurityResearchPaperSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecurityResearchPaper
     */
    omit?: SecurityResearchPaperOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SecurityResearchPaperInclude<ExtArgs> | null
    /**
     * Filter, which SecurityResearchPaper to fetch.
     */
    where?: SecurityResearchPaperWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SecurityResearchPapers to fetch.
     */
    orderBy?: SecurityResearchPaperOrderByWithRelationInput | SecurityResearchPaperOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for searching for SecurityResearchPapers.
     */
    cursor?: SecurityResearchPaperWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SecurityResearchPapers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SecurityResearchPapers.
     */
    skip?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/distinct Distinct Docs}
     * 
     * Filter by unique combinations of SecurityResearchPapers.
     */
    distinct?: SecurityResearchPaperScalarFieldEnum | SecurityResearchPaperScalarFieldEnum[]
  }

  /**
   * SecurityResearchPaper findMany
   */
  export type SecurityResearchPaperFindManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecurityResearchPaper
     */
    select?: SecurityResearchPaperSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecurityResearchPaper
     */
    omit?: SecurityResearchPaperOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SecurityResearchPaperInclude<ExtArgs> | null
    /**
     * Filter, which SecurityResearchPapers to fetch.
     */
    where?: SecurityResearchPaperWhereInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/sorting Sorting Docs}
     * 
     * Determine the order of SecurityResearchPapers to fetch.
     */
    orderBy?: SecurityResearchPaperOrderByWithRelationInput | SecurityResearchPaperOrderByWithRelationInput[]
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination#cursor-based-pagination Cursor Docs}
     * 
     * Sets the position for listing SecurityResearchPapers.
     */
    cursor?: SecurityResearchPaperWhereUniqueInput
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Take `±n` SecurityResearchPapers from the position of the cursor.
     */
    take?: number
    /**
     * {@link https://www.prisma.io/docs/concepts/components/prisma-client/pagination Pagination Docs}
     * 
     * Skip the first `n` SecurityResearchPapers.
     */
    skip?: number
    distinct?: SecurityResearchPaperScalarFieldEnum | SecurityResearchPaperScalarFieldEnum[]
  }

  /**
   * SecurityResearchPaper create
   */
  export type SecurityResearchPaperCreateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecurityResearchPaper
     */
    select?: SecurityResearchPaperSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecurityResearchPaper
     */
    omit?: SecurityResearchPaperOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SecurityResearchPaperInclude<ExtArgs> | null
    /**
     * The data needed to create a SecurityResearchPaper.
     */
    data: XOR<SecurityResearchPaperCreateInput, SecurityResearchPaperUncheckedCreateInput>
  }

  /**
   * SecurityResearchPaper createMany
   */
  export type SecurityResearchPaperCreateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to create many SecurityResearchPapers.
     */
    data: SecurityResearchPaperCreateManyInput | SecurityResearchPaperCreateManyInput[]
    skipDuplicates?: boolean
  }

  /**
   * SecurityResearchPaper update
   */
  export type SecurityResearchPaperUpdateArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecurityResearchPaper
     */
    select?: SecurityResearchPaperSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecurityResearchPaper
     */
    omit?: SecurityResearchPaperOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SecurityResearchPaperInclude<ExtArgs> | null
    /**
     * The data needed to update a SecurityResearchPaper.
     */
    data: XOR<SecurityResearchPaperUpdateInput, SecurityResearchPaperUncheckedUpdateInput>
    /**
     * Choose, which SecurityResearchPaper to update.
     */
    where: SecurityResearchPaperWhereUniqueInput
  }

  /**
   * SecurityResearchPaper updateMany
   */
  export type SecurityResearchPaperUpdateManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * The data used to update SecurityResearchPapers.
     */
    data: XOR<SecurityResearchPaperUpdateManyMutationInput, SecurityResearchPaperUncheckedUpdateManyInput>
    /**
     * Filter which SecurityResearchPapers to update
     */
    where?: SecurityResearchPaperWhereInput
    /**
     * Limit how many SecurityResearchPapers to update.
     */
    limit?: number
  }

  /**
   * SecurityResearchPaper upsert
   */
  export type SecurityResearchPaperUpsertArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecurityResearchPaper
     */
    select?: SecurityResearchPaperSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecurityResearchPaper
     */
    omit?: SecurityResearchPaperOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SecurityResearchPaperInclude<ExtArgs> | null
    /**
     * The filter to search for the SecurityResearchPaper to update in case it exists.
     */
    where: SecurityResearchPaperWhereUniqueInput
    /**
     * In case the SecurityResearchPaper found by the `where` argument doesn't exist, create a new SecurityResearchPaper with this data.
     */
    create: XOR<SecurityResearchPaperCreateInput, SecurityResearchPaperUncheckedCreateInput>
    /**
     * In case the SecurityResearchPaper was found with the provided `where` argument, update it with this data.
     */
    update: XOR<SecurityResearchPaperUpdateInput, SecurityResearchPaperUncheckedUpdateInput>
  }

  /**
   * SecurityResearchPaper delete
   */
  export type SecurityResearchPaperDeleteArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecurityResearchPaper
     */
    select?: SecurityResearchPaperSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecurityResearchPaper
     */
    omit?: SecurityResearchPaperOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SecurityResearchPaperInclude<ExtArgs> | null
    /**
     * Filter which SecurityResearchPaper to delete.
     */
    where: SecurityResearchPaperWhereUniqueInput
  }

  /**
   * SecurityResearchPaper deleteMany
   */
  export type SecurityResearchPaperDeleteManyArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Filter which SecurityResearchPapers to delete
     */
    where?: SecurityResearchPaperWhereInput
    /**
     * Limit how many SecurityResearchPapers to delete.
     */
    limit?: number
  }

  /**
   * SecurityResearchPaper without action
   */
  export type SecurityResearchPaperDefaultArgs<ExtArgs extends $Extensions.InternalArgs = $Extensions.DefaultArgs> = {
    /**
     * Select specific fields to fetch from the SecurityResearchPaper
     */
    select?: SecurityResearchPaperSelect<ExtArgs> | null
    /**
     * Omit specific fields from the SecurityResearchPaper
     */
    omit?: SecurityResearchPaperOmit<ExtArgs> | null
    /**
     * Choose, which related nodes to fetch as well
     */
    include?: SecurityResearchPaperInclude<ExtArgs> | null
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


  export const OpenclawRiskSnapshotScalarFieldEnum: {
    id: 'id',
    snapshotKey: 'snapshotKey',
    triggerSource: 'triggerSource',
    status: 'status',
    latestStableTag: 'latestStableTag',
    latestStableVersion: 'latestStableVersion',
    latestStableUrl: 'latestStableUrl',
    latestStablePublishedAt: 'latestStablePublishedAt',
    totalIssues: 'totalIssues',
    githubAdvisories: 'githubAdvisories',
    nvdCves: 'nvdCves',
    officialAdvisoryCount: 'officialAdvisoryCount',
    cveRecordCount: 'cveRecordCount',
    conferencePaperCount: 'conferencePaperCount',
    preprintCount: 'preprintCount',
    researchCount: 'researchCount',
    newsCount: 'newsCount',
    criticalCount: 'criticalCount',
    highRiskCount: 'highRiskCount',
    fixedCount: 'fixedCount',
    unfixedCount: 'unfixedCount',
    unknownCount: 'unknownCount',
    fixProgressPercent: 'fixProgressPercent',
    sourceMeta: 'sourceMeta',
    cacheDir: 'cacheDir',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type OpenclawRiskSnapshotScalarFieldEnum = (typeof OpenclawRiskSnapshotScalarFieldEnum)[keyof typeof OpenclawRiskSnapshotScalarFieldEnum]


  export const OpenclawRiskIssueScalarFieldEnum: {
    id: 'id',
    snapshotId: 'snapshotId',
    canonicalId: 'canonicalId',
    issueId: 'issueId',
    title: 'title',
    summary: 'summary',
    description: 'description',
    sourcePrimary: 'sourcePrimary',
    sourceType: 'sourceType',
    sourceSearch: 'sourceSearch',
    sourceLabels: 'sourceLabels',
    sources: 'sources',
    githubIds: 'githubIds',
    cveIds: 'cveIds',
    projectScope: 'projectScope',
    venue: 'venue',
    authors: 'authors',
    severity: 'severity',
    score: 'score',
    cvssVector: 'cvssVector',
    cwes: 'cwes',
    affectedRange: 'affectedRange',
    fixedVersion: 'fixedVersion',
    latestStableVersion: 'latestStableVersion',
    fixStatus: 'fixStatus',
    fixLabel: 'fixLabel',
    fixReason: 'fixReason',
    issueUrl: 'issueUrl',
    repoUrl: 'repoUrl',
    referenceUrls: 'referenceUrls',
    tags: 'tags',
    status: 'status',
    relevanceScore: 'relevanceScore',
    publishedAt: 'publishedAt',
    sourceUpdatedAt: 'sourceUpdatedAt',
    rawData: 'rawData',
    createdAt: 'createdAt'
  };

  export type OpenclawRiskIssueScalarFieldEnum = (typeof OpenclawRiskIssueScalarFieldEnum)[keyof typeof OpenclawRiskIssueScalarFieldEnum]


  export const SecurityResearchSnapshotScalarFieldEnum: {
    id: 'id',
    snapshotKey: 'snapshotKey',
    triggerSource: 'triggerSource',
    status: 'status',
    totalPapers: 'totalPapers',
    conferencePaperCount: 'conferencePaperCount',
    preprintCount: 'preprintCount',
    openclawCount: 'openclawCount',
    clawCount: 'clawCount',
    skillCount: 'skillCount',
    agentCount: 'agentCount',
    pluginCount: 'pluginCount',
    sourceMeta: 'sourceMeta',
    cacheDir: 'cacheDir',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
  };

  export type SecurityResearchSnapshotScalarFieldEnum = (typeof SecurityResearchSnapshotScalarFieldEnum)[keyof typeof SecurityResearchSnapshotScalarFieldEnum]


  export const SecurityResearchPaperScalarFieldEnum: {
    id: 'id',
    snapshotId: 'snapshotId',
    canonicalId: 'canonicalId',
    title: 'title',
    normalizedTitle: 'normalizedTitle',
    sourceType: 'sourceType',
    projectScope: 'projectScope',
    venue: 'venue',
    sourcePrimary: 'sourcePrimary',
    sourceSearch: 'sourceSearch',
    abstractOrSummary: 'abstractOrSummary',
    tags: 'tags',
    sourceUrl: 'sourceUrl',
    authors: 'authors',
    externalIds: 'externalIds',
    relevanceScore: 'relevanceScore',
    isTopVenue: 'isTopVenue',
    publishedAt: 'publishedAt',
    status: 'status',
    rawData: 'rawData',
    createdAt: 'createdAt'
  };

  export type SecurityResearchPaperScalarFieldEnum = (typeof SecurityResearchPaperScalarFieldEnum)[keyof typeof SecurityResearchPaperScalarFieldEnum]


  export const SortOrder: {
    asc: 'asc',
    desc: 'desc'
  };

  export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder]


  export const JsonNullValueInput: {
    JsonNull: typeof JsonNull
  };

  export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput]


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


  export const JsonNullValueFilter: {
    DbNull: typeof DbNull,
    JsonNull: typeof JsonNull,
    AnyNull: typeof AnyNull
  };

  export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter]


  export const QueryMode: {
    default: 'default',
    insensitive: 'insensitive'
  };

  export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode]


  export const OpenclawRiskSnapshotOrderByRelevanceFieldEnum: {
    snapshotKey: 'snapshotKey',
    triggerSource: 'triggerSource',
    status: 'status',
    latestStableTag: 'latestStableTag',
    latestStableVersion: 'latestStableVersion',
    latestStableUrl: 'latestStableUrl',
    cacheDir: 'cacheDir'
  };

  export type OpenclawRiskSnapshotOrderByRelevanceFieldEnum = (typeof OpenclawRiskSnapshotOrderByRelevanceFieldEnum)[keyof typeof OpenclawRiskSnapshotOrderByRelevanceFieldEnum]


  export const OpenclawRiskIssueOrderByRelevanceFieldEnum: {
    canonicalId: 'canonicalId',
    issueId: 'issueId',
    title: 'title',
    summary: 'summary',
    description: 'description',
    sourcePrimary: 'sourcePrimary',
    sourceType: 'sourceType',
    sourceSearch: 'sourceSearch',
    projectScope: 'projectScope',
    venue: 'venue',
    severity: 'severity',
    cvssVector: 'cvssVector',
    affectedRange: 'affectedRange',
    fixedVersion: 'fixedVersion',
    latestStableVersion: 'latestStableVersion',
    fixStatus: 'fixStatus',
    fixLabel: 'fixLabel',
    fixReason: 'fixReason',
    issueUrl: 'issueUrl',
    repoUrl: 'repoUrl',
    status: 'status'
  };

  export type OpenclawRiskIssueOrderByRelevanceFieldEnum = (typeof OpenclawRiskIssueOrderByRelevanceFieldEnum)[keyof typeof OpenclawRiskIssueOrderByRelevanceFieldEnum]


  export const SecurityResearchSnapshotOrderByRelevanceFieldEnum: {
    snapshotKey: 'snapshotKey',
    triggerSource: 'triggerSource',
    status: 'status',
    cacheDir: 'cacheDir'
  };

  export type SecurityResearchSnapshotOrderByRelevanceFieldEnum = (typeof SecurityResearchSnapshotOrderByRelevanceFieldEnum)[keyof typeof SecurityResearchSnapshotOrderByRelevanceFieldEnum]


  export const SecurityResearchPaperOrderByRelevanceFieldEnum: {
    canonicalId: 'canonicalId',
    title: 'title',
    normalizedTitle: 'normalizedTitle',
    sourceType: 'sourceType',
    projectScope: 'projectScope',
    venue: 'venue',
    sourcePrimary: 'sourcePrimary',
    sourceSearch: 'sourceSearch',
    abstractOrSummary: 'abstractOrSummary',
    sourceUrl: 'sourceUrl',
    status: 'status'
  };

  export type SecurityResearchPaperOrderByRelevanceFieldEnum = (typeof SecurityResearchPaperOrderByRelevanceFieldEnum)[keyof typeof SecurityResearchPaperOrderByRelevanceFieldEnum]


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
   * Reference to a field of type 'Json'
   */
  export type JsonFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Json'>
    


  /**
   * Reference to a field of type 'QueryMode'
   */
  export type EnumQueryModeFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'QueryMode'>
    


  /**
   * Reference to a field of type 'Float'
   */
  export type FloatFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Float'>
    


  /**
   * Reference to a field of type 'Boolean'
   */
  export type BooleanFieldRefInput<$PrismaModel> = FieldRefInputType<$PrismaModel, 'Boolean'>
    
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

  export type OpenclawRiskSnapshotWhereInput = {
    AND?: OpenclawRiskSnapshotWhereInput | OpenclawRiskSnapshotWhereInput[]
    OR?: OpenclawRiskSnapshotWhereInput[]
    NOT?: OpenclawRiskSnapshotWhereInput | OpenclawRiskSnapshotWhereInput[]
    id?: IntFilter<"OpenclawRiskSnapshot"> | number
    snapshotKey?: StringFilter<"OpenclawRiskSnapshot"> | string
    triggerSource?: StringFilter<"OpenclawRiskSnapshot"> | string
    status?: StringFilter<"OpenclawRiskSnapshot"> | string
    latestStableTag?: StringNullableFilter<"OpenclawRiskSnapshot"> | string | null
    latestStableVersion?: StringNullableFilter<"OpenclawRiskSnapshot"> | string | null
    latestStableUrl?: StringNullableFilter<"OpenclawRiskSnapshot"> | string | null
    latestStablePublishedAt?: DateTimeNullableFilter<"OpenclawRiskSnapshot"> | Date | string | null
    totalIssues?: IntFilter<"OpenclawRiskSnapshot"> | number
    githubAdvisories?: IntFilter<"OpenclawRiskSnapshot"> | number
    nvdCves?: IntFilter<"OpenclawRiskSnapshot"> | number
    officialAdvisoryCount?: IntFilter<"OpenclawRiskSnapshot"> | number
    cveRecordCount?: IntFilter<"OpenclawRiskSnapshot"> | number
    conferencePaperCount?: IntFilter<"OpenclawRiskSnapshot"> | number
    preprintCount?: IntFilter<"OpenclawRiskSnapshot"> | number
    researchCount?: IntFilter<"OpenclawRiskSnapshot"> | number
    newsCount?: IntFilter<"OpenclawRiskSnapshot"> | number
    criticalCount?: IntFilter<"OpenclawRiskSnapshot"> | number
    highRiskCount?: IntFilter<"OpenclawRiskSnapshot"> | number
    fixedCount?: IntFilter<"OpenclawRiskSnapshot"> | number
    unfixedCount?: IntFilter<"OpenclawRiskSnapshot"> | number
    unknownCount?: IntFilter<"OpenclawRiskSnapshot"> | number
    fixProgressPercent?: IntFilter<"OpenclawRiskSnapshot"> | number
    sourceMeta?: JsonFilter<"OpenclawRiskSnapshot">
    cacheDir?: StringNullableFilter<"OpenclawRiskSnapshot"> | string | null
    createdAt?: DateTimeFilter<"OpenclawRiskSnapshot"> | Date | string
    updatedAt?: DateTimeFilter<"OpenclawRiskSnapshot"> | Date | string
    issues?: OpenclawRiskIssueListRelationFilter
  }

  export type OpenclawRiskSnapshotOrderByWithRelationInput = {
    id?: SortOrder
    snapshotKey?: SortOrder
    triggerSource?: SortOrder
    status?: SortOrder
    latestStableTag?: SortOrderInput | SortOrder
    latestStableVersion?: SortOrderInput | SortOrder
    latestStableUrl?: SortOrderInput | SortOrder
    latestStablePublishedAt?: SortOrderInput | SortOrder
    totalIssues?: SortOrder
    githubAdvisories?: SortOrder
    nvdCves?: SortOrder
    officialAdvisoryCount?: SortOrder
    cveRecordCount?: SortOrder
    conferencePaperCount?: SortOrder
    preprintCount?: SortOrder
    researchCount?: SortOrder
    newsCount?: SortOrder
    criticalCount?: SortOrder
    highRiskCount?: SortOrder
    fixedCount?: SortOrder
    unfixedCount?: SortOrder
    unknownCount?: SortOrder
    fixProgressPercent?: SortOrder
    sourceMeta?: SortOrder
    cacheDir?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    issues?: OpenclawRiskIssueOrderByRelationAggregateInput
    _relevance?: OpenclawRiskSnapshotOrderByRelevanceInput
  }

  export type OpenclawRiskSnapshotWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    snapshotKey?: string
    AND?: OpenclawRiskSnapshotWhereInput | OpenclawRiskSnapshotWhereInput[]
    OR?: OpenclawRiskSnapshotWhereInput[]
    NOT?: OpenclawRiskSnapshotWhereInput | OpenclawRiskSnapshotWhereInput[]
    triggerSource?: StringFilter<"OpenclawRiskSnapshot"> | string
    status?: StringFilter<"OpenclawRiskSnapshot"> | string
    latestStableTag?: StringNullableFilter<"OpenclawRiskSnapshot"> | string | null
    latestStableVersion?: StringNullableFilter<"OpenclawRiskSnapshot"> | string | null
    latestStableUrl?: StringNullableFilter<"OpenclawRiskSnapshot"> | string | null
    latestStablePublishedAt?: DateTimeNullableFilter<"OpenclawRiskSnapshot"> | Date | string | null
    totalIssues?: IntFilter<"OpenclawRiskSnapshot"> | number
    githubAdvisories?: IntFilter<"OpenclawRiskSnapshot"> | number
    nvdCves?: IntFilter<"OpenclawRiskSnapshot"> | number
    officialAdvisoryCount?: IntFilter<"OpenclawRiskSnapshot"> | number
    cveRecordCount?: IntFilter<"OpenclawRiskSnapshot"> | number
    conferencePaperCount?: IntFilter<"OpenclawRiskSnapshot"> | number
    preprintCount?: IntFilter<"OpenclawRiskSnapshot"> | number
    researchCount?: IntFilter<"OpenclawRiskSnapshot"> | number
    newsCount?: IntFilter<"OpenclawRiskSnapshot"> | number
    criticalCount?: IntFilter<"OpenclawRiskSnapshot"> | number
    highRiskCount?: IntFilter<"OpenclawRiskSnapshot"> | number
    fixedCount?: IntFilter<"OpenclawRiskSnapshot"> | number
    unfixedCount?: IntFilter<"OpenclawRiskSnapshot"> | number
    unknownCount?: IntFilter<"OpenclawRiskSnapshot"> | number
    fixProgressPercent?: IntFilter<"OpenclawRiskSnapshot"> | number
    sourceMeta?: JsonFilter<"OpenclawRiskSnapshot">
    cacheDir?: StringNullableFilter<"OpenclawRiskSnapshot"> | string | null
    createdAt?: DateTimeFilter<"OpenclawRiskSnapshot"> | Date | string
    updatedAt?: DateTimeFilter<"OpenclawRiskSnapshot"> | Date | string
    issues?: OpenclawRiskIssueListRelationFilter
  }, "id" | "snapshotKey">

  export type OpenclawRiskSnapshotOrderByWithAggregationInput = {
    id?: SortOrder
    snapshotKey?: SortOrder
    triggerSource?: SortOrder
    status?: SortOrder
    latestStableTag?: SortOrderInput | SortOrder
    latestStableVersion?: SortOrderInput | SortOrder
    latestStableUrl?: SortOrderInput | SortOrder
    latestStablePublishedAt?: SortOrderInput | SortOrder
    totalIssues?: SortOrder
    githubAdvisories?: SortOrder
    nvdCves?: SortOrder
    officialAdvisoryCount?: SortOrder
    cveRecordCount?: SortOrder
    conferencePaperCount?: SortOrder
    preprintCount?: SortOrder
    researchCount?: SortOrder
    newsCount?: SortOrder
    criticalCount?: SortOrder
    highRiskCount?: SortOrder
    fixedCount?: SortOrder
    unfixedCount?: SortOrder
    unknownCount?: SortOrder
    fixProgressPercent?: SortOrder
    sourceMeta?: SortOrder
    cacheDir?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: OpenclawRiskSnapshotCountOrderByAggregateInput
    _avg?: OpenclawRiskSnapshotAvgOrderByAggregateInput
    _max?: OpenclawRiskSnapshotMaxOrderByAggregateInput
    _min?: OpenclawRiskSnapshotMinOrderByAggregateInput
    _sum?: OpenclawRiskSnapshotSumOrderByAggregateInput
  }

  export type OpenclawRiskSnapshotScalarWhereWithAggregatesInput = {
    AND?: OpenclawRiskSnapshotScalarWhereWithAggregatesInput | OpenclawRiskSnapshotScalarWhereWithAggregatesInput[]
    OR?: OpenclawRiskSnapshotScalarWhereWithAggregatesInput[]
    NOT?: OpenclawRiskSnapshotScalarWhereWithAggregatesInput | OpenclawRiskSnapshotScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"OpenclawRiskSnapshot"> | number
    snapshotKey?: StringWithAggregatesFilter<"OpenclawRiskSnapshot"> | string
    triggerSource?: StringWithAggregatesFilter<"OpenclawRiskSnapshot"> | string
    status?: StringWithAggregatesFilter<"OpenclawRiskSnapshot"> | string
    latestStableTag?: StringNullableWithAggregatesFilter<"OpenclawRiskSnapshot"> | string | null
    latestStableVersion?: StringNullableWithAggregatesFilter<"OpenclawRiskSnapshot"> | string | null
    latestStableUrl?: StringNullableWithAggregatesFilter<"OpenclawRiskSnapshot"> | string | null
    latestStablePublishedAt?: DateTimeNullableWithAggregatesFilter<"OpenclawRiskSnapshot"> | Date | string | null
    totalIssues?: IntWithAggregatesFilter<"OpenclawRiskSnapshot"> | number
    githubAdvisories?: IntWithAggregatesFilter<"OpenclawRiskSnapshot"> | number
    nvdCves?: IntWithAggregatesFilter<"OpenclawRiskSnapshot"> | number
    officialAdvisoryCount?: IntWithAggregatesFilter<"OpenclawRiskSnapshot"> | number
    cveRecordCount?: IntWithAggregatesFilter<"OpenclawRiskSnapshot"> | number
    conferencePaperCount?: IntWithAggregatesFilter<"OpenclawRiskSnapshot"> | number
    preprintCount?: IntWithAggregatesFilter<"OpenclawRiskSnapshot"> | number
    researchCount?: IntWithAggregatesFilter<"OpenclawRiskSnapshot"> | number
    newsCount?: IntWithAggregatesFilter<"OpenclawRiskSnapshot"> | number
    criticalCount?: IntWithAggregatesFilter<"OpenclawRiskSnapshot"> | number
    highRiskCount?: IntWithAggregatesFilter<"OpenclawRiskSnapshot"> | number
    fixedCount?: IntWithAggregatesFilter<"OpenclawRiskSnapshot"> | number
    unfixedCount?: IntWithAggregatesFilter<"OpenclawRiskSnapshot"> | number
    unknownCount?: IntWithAggregatesFilter<"OpenclawRiskSnapshot"> | number
    fixProgressPercent?: IntWithAggregatesFilter<"OpenclawRiskSnapshot"> | number
    sourceMeta?: JsonWithAggregatesFilter<"OpenclawRiskSnapshot">
    cacheDir?: StringNullableWithAggregatesFilter<"OpenclawRiskSnapshot"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"OpenclawRiskSnapshot"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"OpenclawRiskSnapshot"> | Date | string
  }

  export type OpenclawRiskIssueWhereInput = {
    AND?: OpenclawRiskIssueWhereInput | OpenclawRiskIssueWhereInput[]
    OR?: OpenclawRiskIssueWhereInput[]
    NOT?: OpenclawRiskIssueWhereInput | OpenclawRiskIssueWhereInput[]
    id?: BigIntFilter<"OpenclawRiskIssue"> | bigint | number
    snapshotId?: IntFilter<"OpenclawRiskIssue"> | number
    canonicalId?: StringFilter<"OpenclawRiskIssue"> | string
    issueId?: StringFilter<"OpenclawRiskIssue"> | string
    title?: StringFilter<"OpenclawRiskIssue"> | string
    summary?: StringFilter<"OpenclawRiskIssue"> | string
    description?: StringFilter<"OpenclawRiskIssue"> | string
    sourcePrimary?: StringFilter<"OpenclawRiskIssue"> | string
    sourceType?: StringFilter<"OpenclawRiskIssue"> | string
    sourceSearch?: StringFilter<"OpenclawRiskIssue"> | string
    sourceLabels?: JsonFilter<"OpenclawRiskIssue">
    sources?: JsonFilter<"OpenclawRiskIssue">
    githubIds?: JsonFilter<"OpenclawRiskIssue">
    cveIds?: JsonFilter<"OpenclawRiskIssue">
    projectScope?: StringFilter<"OpenclawRiskIssue"> | string
    venue?: StringNullableFilter<"OpenclawRiskIssue"> | string | null
    authors?: JsonFilter<"OpenclawRiskIssue">
    severity?: StringFilter<"OpenclawRiskIssue"> | string
    score?: FloatNullableFilter<"OpenclawRiskIssue"> | number | null
    cvssVector?: StringNullableFilter<"OpenclawRiskIssue"> | string | null
    cwes?: JsonFilter<"OpenclawRiskIssue">
    affectedRange?: StringNullableFilter<"OpenclawRiskIssue"> | string | null
    fixedVersion?: StringNullableFilter<"OpenclawRiskIssue"> | string | null
    latestStableVersion?: StringNullableFilter<"OpenclawRiskIssue"> | string | null
    fixStatus?: StringFilter<"OpenclawRiskIssue"> | string
    fixLabel?: StringFilter<"OpenclawRiskIssue"> | string
    fixReason?: StringFilter<"OpenclawRiskIssue"> | string
    issueUrl?: StringNullableFilter<"OpenclawRiskIssue"> | string | null
    repoUrl?: StringNullableFilter<"OpenclawRiskIssue"> | string | null
    referenceUrls?: JsonFilter<"OpenclawRiskIssue">
    tags?: JsonFilter<"OpenclawRiskIssue">
    status?: StringFilter<"OpenclawRiskIssue"> | string
    relevanceScore?: FloatNullableFilter<"OpenclawRiskIssue"> | number | null
    publishedAt?: DateTimeNullableFilter<"OpenclawRiskIssue"> | Date | string | null
    sourceUpdatedAt?: DateTimeNullableFilter<"OpenclawRiskIssue"> | Date | string | null
    rawData?: JsonFilter<"OpenclawRiskIssue">
    createdAt?: DateTimeFilter<"OpenclawRiskIssue"> | Date | string
    snapshot?: XOR<OpenclawRiskSnapshotScalarRelationFilter, OpenclawRiskSnapshotWhereInput>
  }

  export type OpenclawRiskIssueOrderByWithRelationInput = {
    id?: SortOrder
    snapshotId?: SortOrder
    canonicalId?: SortOrder
    issueId?: SortOrder
    title?: SortOrder
    summary?: SortOrder
    description?: SortOrder
    sourcePrimary?: SortOrder
    sourceType?: SortOrder
    sourceSearch?: SortOrder
    sourceLabels?: SortOrder
    sources?: SortOrder
    githubIds?: SortOrder
    cveIds?: SortOrder
    projectScope?: SortOrder
    venue?: SortOrderInput | SortOrder
    authors?: SortOrder
    severity?: SortOrder
    score?: SortOrderInput | SortOrder
    cvssVector?: SortOrderInput | SortOrder
    cwes?: SortOrder
    affectedRange?: SortOrderInput | SortOrder
    fixedVersion?: SortOrderInput | SortOrder
    latestStableVersion?: SortOrderInput | SortOrder
    fixStatus?: SortOrder
    fixLabel?: SortOrder
    fixReason?: SortOrder
    issueUrl?: SortOrderInput | SortOrder
    repoUrl?: SortOrderInput | SortOrder
    referenceUrls?: SortOrder
    tags?: SortOrder
    status?: SortOrder
    relevanceScore?: SortOrderInput | SortOrder
    publishedAt?: SortOrderInput | SortOrder
    sourceUpdatedAt?: SortOrderInput | SortOrder
    rawData?: SortOrder
    createdAt?: SortOrder
    snapshot?: OpenclawRiskSnapshotOrderByWithRelationInput
    _relevance?: OpenclawRiskIssueOrderByRelevanceInput
  }

  export type OpenclawRiskIssueWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    snapshotId_canonicalId?: OpenclawRiskIssueSnapshotIdCanonicalIdCompoundUniqueInput
    AND?: OpenclawRiskIssueWhereInput | OpenclawRiskIssueWhereInput[]
    OR?: OpenclawRiskIssueWhereInput[]
    NOT?: OpenclawRiskIssueWhereInput | OpenclawRiskIssueWhereInput[]
    snapshotId?: IntFilter<"OpenclawRiskIssue"> | number
    canonicalId?: StringFilter<"OpenclawRiskIssue"> | string
    issueId?: StringFilter<"OpenclawRiskIssue"> | string
    title?: StringFilter<"OpenclawRiskIssue"> | string
    summary?: StringFilter<"OpenclawRiskIssue"> | string
    description?: StringFilter<"OpenclawRiskIssue"> | string
    sourcePrimary?: StringFilter<"OpenclawRiskIssue"> | string
    sourceType?: StringFilter<"OpenclawRiskIssue"> | string
    sourceSearch?: StringFilter<"OpenclawRiskIssue"> | string
    sourceLabels?: JsonFilter<"OpenclawRiskIssue">
    sources?: JsonFilter<"OpenclawRiskIssue">
    githubIds?: JsonFilter<"OpenclawRiskIssue">
    cveIds?: JsonFilter<"OpenclawRiskIssue">
    projectScope?: StringFilter<"OpenclawRiskIssue"> | string
    venue?: StringNullableFilter<"OpenclawRiskIssue"> | string | null
    authors?: JsonFilter<"OpenclawRiskIssue">
    severity?: StringFilter<"OpenclawRiskIssue"> | string
    score?: FloatNullableFilter<"OpenclawRiskIssue"> | number | null
    cvssVector?: StringNullableFilter<"OpenclawRiskIssue"> | string | null
    cwes?: JsonFilter<"OpenclawRiskIssue">
    affectedRange?: StringNullableFilter<"OpenclawRiskIssue"> | string | null
    fixedVersion?: StringNullableFilter<"OpenclawRiskIssue"> | string | null
    latestStableVersion?: StringNullableFilter<"OpenclawRiskIssue"> | string | null
    fixStatus?: StringFilter<"OpenclawRiskIssue"> | string
    fixLabel?: StringFilter<"OpenclawRiskIssue"> | string
    fixReason?: StringFilter<"OpenclawRiskIssue"> | string
    issueUrl?: StringNullableFilter<"OpenclawRiskIssue"> | string | null
    repoUrl?: StringNullableFilter<"OpenclawRiskIssue"> | string | null
    referenceUrls?: JsonFilter<"OpenclawRiskIssue">
    tags?: JsonFilter<"OpenclawRiskIssue">
    status?: StringFilter<"OpenclawRiskIssue"> | string
    relevanceScore?: FloatNullableFilter<"OpenclawRiskIssue"> | number | null
    publishedAt?: DateTimeNullableFilter<"OpenclawRiskIssue"> | Date | string | null
    sourceUpdatedAt?: DateTimeNullableFilter<"OpenclawRiskIssue"> | Date | string | null
    rawData?: JsonFilter<"OpenclawRiskIssue">
    createdAt?: DateTimeFilter<"OpenclawRiskIssue"> | Date | string
    snapshot?: XOR<OpenclawRiskSnapshotScalarRelationFilter, OpenclawRiskSnapshotWhereInput>
  }, "id" | "snapshotId_canonicalId">

  export type OpenclawRiskIssueOrderByWithAggregationInput = {
    id?: SortOrder
    snapshotId?: SortOrder
    canonicalId?: SortOrder
    issueId?: SortOrder
    title?: SortOrder
    summary?: SortOrder
    description?: SortOrder
    sourcePrimary?: SortOrder
    sourceType?: SortOrder
    sourceSearch?: SortOrder
    sourceLabels?: SortOrder
    sources?: SortOrder
    githubIds?: SortOrder
    cveIds?: SortOrder
    projectScope?: SortOrder
    venue?: SortOrderInput | SortOrder
    authors?: SortOrder
    severity?: SortOrder
    score?: SortOrderInput | SortOrder
    cvssVector?: SortOrderInput | SortOrder
    cwes?: SortOrder
    affectedRange?: SortOrderInput | SortOrder
    fixedVersion?: SortOrderInput | SortOrder
    latestStableVersion?: SortOrderInput | SortOrder
    fixStatus?: SortOrder
    fixLabel?: SortOrder
    fixReason?: SortOrder
    issueUrl?: SortOrderInput | SortOrder
    repoUrl?: SortOrderInput | SortOrder
    referenceUrls?: SortOrder
    tags?: SortOrder
    status?: SortOrder
    relevanceScore?: SortOrderInput | SortOrder
    publishedAt?: SortOrderInput | SortOrder
    sourceUpdatedAt?: SortOrderInput | SortOrder
    rawData?: SortOrder
    createdAt?: SortOrder
    _count?: OpenclawRiskIssueCountOrderByAggregateInput
    _avg?: OpenclawRiskIssueAvgOrderByAggregateInput
    _max?: OpenclawRiskIssueMaxOrderByAggregateInput
    _min?: OpenclawRiskIssueMinOrderByAggregateInput
    _sum?: OpenclawRiskIssueSumOrderByAggregateInput
  }

  export type OpenclawRiskIssueScalarWhereWithAggregatesInput = {
    AND?: OpenclawRiskIssueScalarWhereWithAggregatesInput | OpenclawRiskIssueScalarWhereWithAggregatesInput[]
    OR?: OpenclawRiskIssueScalarWhereWithAggregatesInput[]
    NOT?: OpenclawRiskIssueScalarWhereWithAggregatesInput | OpenclawRiskIssueScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"OpenclawRiskIssue"> | bigint | number
    snapshotId?: IntWithAggregatesFilter<"OpenclawRiskIssue"> | number
    canonicalId?: StringWithAggregatesFilter<"OpenclawRiskIssue"> | string
    issueId?: StringWithAggregatesFilter<"OpenclawRiskIssue"> | string
    title?: StringWithAggregatesFilter<"OpenclawRiskIssue"> | string
    summary?: StringWithAggregatesFilter<"OpenclawRiskIssue"> | string
    description?: StringWithAggregatesFilter<"OpenclawRiskIssue"> | string
    sourcePrimary?: StringWithAggregatesFilter<"OpenclawRiskIssue"> | string
    sourceType?: StringWithAggregatesFilter<"OpenclawRiskIssue"> | string
    sourceSearch?: StringWithAggregatesFilter<"OpenclawRiskIssue"> | string
    sourceLabels?: JsonWithAggregatesFilter<"OpenclawRiskIssue">
    sources?: JsonWithAggregatesFilter<"OpenclawRiskIssue">
    githubIds?: JsonWithAggregatesFilter<"OpenclawRiskIssue">
    cveIds?: JsonWithAggregatesFilter<"OpenclawRiskIssue">
    projectScope?: StringWithAggregatesFilter<"OpenclawRiskIssue"> | string
    venue?: StringNullableWithAggregatesFilter<"OpenclawRiskIssue"> | string | null
    authors?: JsonWithAggregatesFilter<"OpenclawRiskIssue">
    severity?: StringWithAggregatesFilter<"OpenclawRiskIssue"> | string
    score?: FloatNullableWithAggregatesFilter<"OpenclawRiskIssue"> | number | null
    cvssVector?: StringNullableWithAggregatesFilter<"OpenclawRiskIssue"> | string | null
    cwes?: JsonWithAggregatesFilter<"OpenclawRiskIssue">
    affectedRange?: StringNullableWithAggregatesFilter<"OpenclawRiskIssue"> | string | null
    fixedVersion?: StringNullableWithAggregatesFilter<"OpenclawRiskIssue"> | string | null
    latestStableVersion?: StringNullableWithAggregatesFilter<"OpenclawRiskIssue"> | string | null
    fixStatus?: StringWithAggregatesFilter<"OpenclawRiskIssue"> | string
    fixLabel?: StringWithAggregatesFilter<"OpenclawRiskIssue"> | string
    fixReason?: StringWithAggregatesFilter<"OpenclawRiskIssue"> | string
    issueUrl?: StringNullableWithAggregatesFilter<"OpenclawRiskIssue"> | string | null
    repoUrl?: StringNullableWithAggregatesFilter<"OpenclawRiskIssue"> | string | null
    referenceUrls?: JsonWithAggregatesFilter<"OpenclawRiskIssue">
    tags?: JsonWithAggregatesFilter<"OpenclawRiskIssue">
    status?: StringWithAggregatesFilter<"OpenclawRiskIssue"> | string
    relevanceScore?: FloatNullableWithAggregatesFilter<"OpenclawRiskIssue"> | number | null
    publishedAt?: DateTimeNullableWithAggregatesFilter<"OpenclawRiskIssue"> | Date | string | null
    sourceUpdatedAt?: DateTimeNullableWithAggregatesFilter<"OpenclawRiskIssue"> | Date | string | null
    rawData?: JsonWithAggregatesFilter<"OpenclawRiskIssue">
    createdAt?: DateTimeWithAggregatesFilter<"OpenclawRiskIssue"> | Date | string
  }

  export type SecurityResearchSnapshotWhereInput = {
    AND?: SecurityResearchSnapshotWhereInput | SecurityResearchSnapshotWhereInput[]
    OR?: SecurityResearchSnapshotWhereInput[]
    NOT?: SecurityResearchSnapshotWhereInput | SecurityResearchSnapshotWhereInput[]
    id?: IntFilter<"SecurityResearchSnapshot"> | number
    snapshotKey?: StringFilter<"SecurityResearchSnapshot"> | string
    triggerSource?: StringFilter<"SecurityResearchSnapshot"> | string
    status?: StringFilter<"SecurityResearchSnapshot"> | string
    totalPapers?: IntFilter<"SecurityResearchSnapshot"> | number
    conferencePaperCount?: IntFilter<"SecurityResearchSnapshot"> | number
    preprintCount?: IntFilter<"SecurityResearchSnapshot"> | number
    openclawCount?: IntFilter<"SecurityResearchSnapshot"> | number
    clawCount?: IntFilter<"SecurityResearchSnapshot"> | number
    skillCount?: IntFilter<"SecurityResearchSnapshot"> | number
    agentCount?: IntFilter<"SecurityResearchSnapshot"> | number
    pluginCount?: IntFilter<"SecurityResearchSnapshot"> | number
    sourceMeta?: JsonFilter<"SecurityResearchSnapshot">
    cacheDir?: StringNullableFilter<"SecurityResearchSnapshot"> | string | null
    createdAt?: DateTimeFilter<"SecurityResearchSnapshot"> | Date | string
    updatedAt?: DateTimeFilter<"SecurityResearchSnapshot"> | Date | string
    papers?: SecurityResearchPaperListRelationFilter
  }

  export type SecurityResearchSnapshotOrderByWithRelationInput = {
    id?: SortOrder
    snapshotKey?: SortOrder
    triggerSource?: SortOrder
    status?: SortOrder
    totalPapers?: SortOrder
    conferencePaperCount?: SortOrder
    preprintCount?: SortOrder
    openclawCount?: SortOrder
    clawCount?: SortOrder
    skillCount?: SortOrder
    agentCount?: SortOrder
    pluginCount?: SortOrder
    sourceMeta?: SortOrder
    cacheDir?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    papers?: SecurityResearchPaperOrderByRelationAggregateInput
    _relevance?: SecurityResearchSnapshotOrderByRelevanceInput
  }

  export type SecurityResearchSnapshotWhereUniqueInput = Prisma.AtLeast<{
    id?: number
    snapshotKey?: string
    AND?: SecurityResearchSnapshotWhereInput | SecurityResearchSnapshotWhereInput[]
    OR?: SecurityResearchSnapshotWhereInput[]
    NOT?: SecurityResearchSnapshotWhereInput | SecurityResearchSnapshotWhereInput[]
    triggerSource?: StringFilter<"SecurityResearchSnapshot"> | string
    status?: StringFilter<"SecurityResearchSnapshot"> | string
    totalPapers?: IntFilter<"SecurityResearchSnapshot"> | number
    conferencePaperCount?: IntFilter<"SecurityResearchSnapshot"> | number
    preprintCount?: IntFilter<"SecurityResearchSnapshot"> | number
    openclawCount?: IntFilter<"SecurityResearchSnapshot"> | number
    clawCount?: IntFilter<"SecurityResearchSnapshot"> | number
    skillCount?: IntFilter<"SecurityResearchSnapshot"> | number
    agentCount?: IntFilter<"SecurityResearchSnapshot"> | number
    pluginCount?: IntFilter<"SecurityResearchSnapshot"> | number
    sourceMeta?: JsonFilter<"SecurityResearchSnapshot">
    cacheDir?: StringNullableFilter<"SecurityResearchSnapshot"> | string | null
    createdAt?: DateTimeFilter<"SecurityResearchSnapshot"> | Date | string
    updatedAt?: DateTimeFilter<"SecurityResearchSnapshot"> | Date | string
    papers?: SecurityResearchPaperListRelationFilter
  }, "id" | "snapshotKey">

  export type SecurityResearchSnapshotOrderByWithAggregationInput = {
    id?: SortOrder
    snapshotKey?: SortOrder
    triggerSource?: SortOrder
    status?: SortOrder
    totalPapers?: SortOrder
    conferencePaperCount?: SortOrder
    preprintCount?: SortOrder
    openclawCount?: SortOrder
    clawCount?: SortOrder
    skillCount?: SortOrder
    agentCount?: SortOrder
    pluginCount?: SortOrder
    sourceMeta?: SortOrder
    cacheDir?: SortOrderInput | SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
    _count?: SecurityResearchSnapshotCountOrderByAggregateInput
    _avg?: SecurityResearchSnapshotAvgOrderByAggregateInput
    _max?: SecurityResearchSnapshotMaxOrderByAggregateInput
    _min?: SecurityResearchSnapshotMinOrderByAggregateInput
    _sum?: SecurityResearchSnapshotSumOrderByAggregateInput
  }

  export type SecurityResearchSnapshotScalarWhereWithAggregatesInput = {
    AND?: SecurityResearchSnapshotScalarWhereWithAggregatesInput | SecurityResearchSnapshotScalarWhereWithAggregatesInput[]
    OR?: SecurityResearchSnapshotScalarWhereWithAggregatesInput[]
    NOT?: SecurityResearchSnapshotScalarWhereWithAggregatesInput | SecurityResearchSnapshotScalarWhereWithAggregatesInput[]
    id?: IntWithAggregatesFilter<"SecurityResearchSnapshot"> | number
    snapshotKey?: StringWithAggregatesFilter<"SecurityResearchSnapshot"> | string
    triggerSource?: StringWithAggregatesFilter<"SecurityResearchSnapshot"> | string
    status?: StringWithAggregatesFilter<"SecurityResearchSnapshot"> | string
    totalPapers?: IntWithAggregatesFilter<"SecurityResearchSnapshot"> | number
    conferencePaperCount?: IntWithAggregatesFilter<"SecurityResearchSnapshot"> | number
    preprintCount?: IntWithAggregatesFilter<"SecurityResearchSnapshot"> | number
    openclawCount?: IntWithAggregatesFilter<"SecurityResearchSnapshot"> | number
    clawCount?: IntWithAggregatesFilter<"SecurityResearchSnapshot"> | number
    skillCount?: IntWithAggregatesFilter<"SecurityResearchSnapshot"> | number
    agentCount?: IntWithAggregatesFilter<"SecurityResearchSnapshot"> | number
    pluginCount?: IntWithAggregatesFilter<"SecurityResearchSnapshot"> | number
    sourceMeta?: JsonWithAggregatesFilter<"SecurityResearchSnapshot">
    cacheDir?: StringNullableWithAggregatesFilter<"SecurityResearchSnapshot"> | string | null
    createdAt?: DateTimeWithAggregatesFilter<"SecurityResearchSnapshot"> | Date | string
    updatedAt?: DateTimeWithAggregatesFilter<"SecurityResearchSnapshot"> | Date | string
  }

  export type SecurityResearchPaperWhereInput = {
    AND?: SecurityResearchPaperWhereInput | SecurityResearchPaperWhereInput[]
    OR?: SecurityResearchPaperWhereInput[]
    NOT?: SecurityResearchPaperWhereInput | SecurityResearchPaperWhereInput[]
    id?: BigIntFilter<"SecurityResearchPaper"> | bigint | number
    snapshotId?: IntFilter<"SecurityResearchPaper"> | number
    canonicalId?: StringFilter<"SecurityResearchPaper"> | string
    title?: StringFilter<"SecurityResearchPaper"> | string
    normalizedTitle?: StringFilter<"SecurityResearchPaper"> | string
    sourceType?: StringFilter<"SecurityResearchPaper"> | string
    projectScope?: StringFilter<"SecurityResearchPaper"> | string
    venue?: StringFilter<"SecurityResearchPaper"> | string
    sourcePrimary?: StringFilter<"SecurityResearchPaper"> | string
    sourceSearch?: StringFilter<"SecurityResearchPaper"> | string
    abstractOrSummary?: StringFilter<"SecurityResearchPaper"> | string
    tags?: JsonFilter<"SecurityResearchPaper">
    sourceUrl?: StringNullableFilter<"SecurityResearchPaper"> | string | null
    authors?: JsonFilter<"SecurityResearchPaper">
    externalIds?: JsonFilter<"SecurityResearchPaper">
    relevanceScore?: FloatFilter<"SecurityResearchPaper"> | number
    isTopVenue?: BoolFilter<"SecurityResearchPaper"> | boolean
    publishedAt?: DateTimeNullableFilter<"SecurityResearchPaper"> | Date | string | null
    status?: StringFilter<"SecurityResearchPaper"> | string
    rawData?: JsonFilter<"SecurityResearchPaper">
    createdAt?: DateTimeFilter<"SecurityResearchPaper"> | Date | string
    snapshot?: XOR<SecurityResearchSnapshotScalarRelationFilter, SecurityResearchSnapshotWhereInput>
  }

  export type SecurityResearchPaperOrderByWithRelationInput = {
    id?: SortOrder
    snapshotId?: SortOrder
    canonicalId?: SortOrder
    title?: SortOrder
    normalizedTitle?: SortOrder
    sourceType?: SortOrder
    projectScope?: SortOrder
    venue?: SortOrder
    sourcePrimary?: SortOrder
    sourceSearch?: SortOrder
    abstractOrSummary?: SortOrder
    tags?: SortOrder
    sourceUrl?: SortOrderInput | SortOrder
    authors?: SortOrder
    externalIds?: SortOrder
    relevanceScore?: SortOrder
    isTopVenue?: SortOrder
    publishedAt?: SortOrderInput | SortOrder
    status?: SortOrder
    rawData?: SortOrder
    createdAt?: SortOrder
    snapshot?: SecurityResearchSnapshotOrderByWithRelationInput
    _relevance?: SecurityResearchPaperOrderByRelevanceInput
  }

  export type SecurityResearchPaperWhereUniqueInput = Prisma.AtLeast<{
    id?: bigint | number
    snapshotId_canonicalId?: SecurityResearchPaperSnapshotIdCanonicalIdCompoundUniqueInput
    AND?: SecurityResearchPaperWhereInput | SecurityResearchPaperWhereInput[]
    OR?: SecurityResearchPaperWhereInput[]
    NOT?: SecurityResearchPaperWhereInput | SecurityResearchPaperWhereInput[]
    snapshotId?: IntFilter<"SecurityResearchPaper"> | number
    canonicalId?: StringFilter<"SecurityResearchPaper"> | string
    title?: StringFilter<"SecurityResearchPaper"> | string
    normalizedTitle?: StringFilter<"SecurityResearchPaper"> | string
    sourceType?: StringFilter<"SecurityResearchPaper"> | string
    projectScope?: StringFilter<"SecurityResearchPaper"> | string
    venue?: StringFilter<"SecurityResearchPaper"> | string
    sourcePrimary?: StringFilter<"SecurityResearchPaper"> | string
    sourceSearch?: StringFilter<"SecurityResearchPaper"> | string
    abstractOrSummary?: StringFilter<"SecurityResearchPaper"> | string
    tags?: JsonFilter<"SecurityResearchPaper">
    sourceUrl?: StringNullableFilter<"SecurityResearchPaper"> | string | null
    authors?: JsonFilter<"SecurityResearchPaper">
    externalIds?: JsonFilter<"SecurityResearchPaper">
    relevanceScore?: FloatFilter<"SecurityResearchPaper"> | number
    isTopVenue?: BoolFilter<"SecurityResearchPaper"> | boolean
    publishedAt?: DateTimeNullableFilter<"SecurityResearchPaper"> | Date | string | null
    status?: StringFilter<"SecurityResearchPaper"> | string
    rawData?: JsonFilter<"SecurityResearchPaper">
    createdAt?: DateTimeFilter<"SecurityResearchPaper"> | Date | string
    snapshot?: XOR<SecurityResearchSnapshotScalarRelationFilter, SecurityResearchSnapshotWhereInput>
  }, "id" | "snapshotId_canonicalId">

  export type SecurityResearchPaperOrderByWithAggregationInput = {
    id?: SortOrder
    snapshotId?: SortOrder
    canonicalId?: SortOrder
    title?: SortOrder
    normalizedTitle?: SortOrder
    sourceType?: SortOrder
    projectScope?: SortOrder
    venue?: SortOrder
    sourcePrimary?: SortOrder
    sourceSearch?: SortOrder
    abstractOrSummary?: SortOrder
    tags?: SortOrder
    sourceUrl?: SortOrderInput | SortOrder
    authors?: SortOrder
    externalIds?: SortOrder
    relevanceScore?: SortOrder
    isTopVenue?: SortOrder
    publishedAt?: SortOrderInput | SortOrder
    status?: SortOrder
    rawData?: SortOrder
    createdAt?: SortOrder
    _count?: SecurityResearchPaperCountOrderByAggregateInput
    _avg?: SecurityResearchPaperAvgOrderByAggregateInput
    _max?: SecurityResearchPaperMaxOrderByAggregateInput
    _min?: SecurityResearchPaperMinOrderByAggregateInput
    _sum?: SecurityResearchPaperSumOrderByAggregateInput
  }

  export type SecurityResearchPaperScalarWhereWithAggregatesInput = {
    AND?: SecurityResearchPaperScalarWhereWithAggregatesInput | SecurityResearchPaperScalarWhereWithAggregatesInput[]
    OR?: SecurityResearchPaperScalarWhereWithAggregatesInput[]
    NOT?: SecurityResearchPaperScalarWhereWithAggregatesInput | SecurityResearchPaperScalarWhereWithAggregatesInput[]
    id?: BigIntWithAggregatesFilter<"SecurityResearchPaper"> | bigint | number
    snapshotId?: IntWithAggregatesFilter<"SecurityResearchPaper"> | number
    canonicalId?: StringWithAggregatesFilter<"SecurityResearchPaper"> | string
    title?: StringWithAggregatesFilter<"SecurityResearchPaper"> | string
    normalizedTitle?: StringWithAggregatesFilter<"SecurityResearchPaper"> | string
    sourceType?: StringWithAggregatesFilter<"SecurityResearchPaper"> | string
    projectScope?: StringWithAggregatesFilter<"SecurityResearchPaper"> | string
    venue?: StringWithAggregatesFilter<"SecurityResearchPaper"> | string
    sourcePrimary?: StringWithAggregatesFilter<"SecurityResearchPaper"> | string
    sourceSearch?: StringWithAggregatesFilter<"SecurityResearchPaper"> | string
    abstractOrSummary?: StringWithAggregatesFilter<"SecurityResearchPaper"> | string
    tags?: JsonWithAggregatesFilter<"SecurityResearchPaper">
    sourceUrl?: StringNullableWithAggregatesFilter<"SecurityResearchPaper"> | string | null
    authors?: JsonWithAggregatesFilter<"SecurityResearchPaper">
    externalIds?: JsonWithAggregatesFilter<"SecurityResearchPaper">
    relevanceScore?: FloatWithAggregatesFilter<"SecurityResearchPaper"> | number
    isTopVenue?: BoolWithAggregatesFilter<"SecurityResearchPaper"> | boolean
    publishedAt?: DateTimeNullableWithAggregatesFilter<"SecurityResearchPaper"> | Date | string | null
    status?: StringWithAggregatesFilter<"SecurityResearchPaper"> | string
    rawData?: JsonWithAggregatesFilter<"SecurityResearchPaper">
    createdAt?: DateTimeWithAggregatesFilter<"SecurityResearchPaper"> | Date | string
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

  export type OpenclawRiskSnapshotCreateInput = {
    snapshotKey: string
    triggerSource?: string
    status?: string
    latestStableTag?: string | null
    latestStableVersion?: string | null
    latestStableUrl?: string | null
    latestStablePublishedAt?: Date | string | null
    totalIssues?: number
    githubAdvisories?: number
    nvdCves?: number
    officialAdvisoryCount?: number
    cveRecordCount?: number
    conferencePaperCount?: number
    preprintCount?: number
    researchCount?: number
    newsCount?: number
    criticalCount?: number
    highRiskCount?: number
    fixedCount?: number
    unfixedCount?: number
    unknownCount?: number
    fixProgressPercent?: number
    sourceMeta: JsonNullValueInput | InputJsonValue
    cacheDir?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    issues?: OpenclawRiskIssueCreateNestedManyWithoutSnapshotInput
  }

  export type OpenclawRiskSnapshotUncheckedCreateInput = {
    id?: number
    snapshotKey: string
    triggerSource?: string
    status?: string
    latestStableTag?: string | null
    latestStableVersion?: string | null
    latestStableUrl?: string | null
    latestStablePublishedAt?: Date | string | null
    totalIssues?: number
    githubAdvisories?: number
    nvdCves?: number
    officialAdvisoryCount?: number
    cveRecordCount?: number
    conferencePaperCount?: number
    preprintCount?: number
    researchCount?: number
    newsCount?: number
    criticalCount?: number
    highRiskCount?: number
    fixedCount?: number
    unfixedCount?: number
    unknownCount?: number
    fixProgressPercent?: number
    sourceMeta: JsonNullValueInput | InputJsonValue
    cacheDir?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    issues?: OpenclawRiskIssueUncheckedCreateNestedManyWithoutSnapshotInput
  }

  export type OpenclawRiskSnapshotUpdateInput = {
    snapshotKey?: StringFieldUpdateOperationsInput | string
    triggerSource?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    latestStableTag?: NullableStringFieldUpdateOperationsInput | string | null
    latestStableVersion?: NullableStringFieldUpdateOperationsInput | string | null
    latestStableUrl?: NullableStringFieldUpdateOperationsInput | string | null
    latestStablePublishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totalIssues?: IntFieldUpdateOperationsInput | number
    githubAdvisories?: IntFieldUpdateOperationsInput | number
    nvdCves?: IntFieldUpdateOperationsInput | number
    officialAdvisoryCount?: IntFieldUpdateOperationsInput | number
    cveRecordCount?: IntFieldUpdateOperationsInput | number
    conferencePaperCount?: IntFieldUpdateOperationsInput | number
    preprintCount?: IntFieldUpdateOperationsInput | number
    researchCount?: IntFieldUpdateOperationsInput | number
    newsCount?: IntFieldUpdateOperationsInput | number
    criticalCount?: IntFieldUpdateOperationsInput | number
    highRiskCount?: IntFieldUpdateOperationsInput | number
    fixedCount?: IntFieldUpdateOperationsInput | number
    unfixedCount?: IntFieldUpdateOperationsInput | number
    unknownCount?: IntFieldUpdateOperationsInput | number
    fixProgressPercent?: IntFieldUpdateOperationsInput | number
    sourceMeta?: JsonNullValueInput | InputJsonValue
    cacheDir?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    issues?: OpenclawRiskIssueUpdateManyWithoutSnapshotNestedInput
  }

  export type OpenclawRiskSnapshotUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    snapshotKey?: StringFieldUpdateOperationsInput | string
    triggerSource?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    latestStableTag?: NullableStringFieldUpdateOperationsInput | string | null
    latestStableVersion?: NullableStringFieldUpdateOperationsInput | string | null
    latestStableUrl?: NullableStringFieldUpdateOperationsInput | string | null
    latestStablePublishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totalIssues?: IntFieldUpdateOperationsInput | number
    githubAdvisories?: IntFieldUpdateOperationsInput | number
    nvdCves?: IntFieldUpdateOperationsInput | number
    officialAdvisoryCount?: IntFieldUpdateOperationsInput | number
    cveRecordCount?: IntFieldUpdateOperationsInput | number
    conferencePaperCount?: IntFieldUpdateOperationsInput | number
    preprintCount?: IntFieldUpdateOperationsInput | number
    researchCount?: IntFieldUpdateOperationsInput | number
    newsCount?: IntFieldUpdateOperationsInput | number
    criticalCount?: IntFieldUpdateOperationsInput | number
    highRiskCount?: IntFieldUpdateOperationsInput | number
    fixedCount?: IntFieldUpdateOperationsInput | number
    unfixedCount?: IntFieldUpdateOperationsInput | number
    unknownCount?: IntFieldUpdateOperationsInput | number
    fixProgressPercent?: IntFieldUpdateOperationsInput | number
    sourceMeta?: JsonNullValueInput | InputJsonValue
    cacheDir?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    issues?: OpenclawRiskIssueUncheckedUpdateManyWithoutSnapshotNestedInput
  }

  export type OpenclawRiskSnapshotCreateManyInput = {
    id?: number
    snapshotKey: string
    triggerSource?: string
    status?: string
    latestStableTag?: string | null
    latestStableVersion?: string | null
    latestStableUrl?: string | null
    latestStablePublishedAt?: Date | string | null
    totalIssues?: number
    githubAdvisories?: number
    nvdCves?: number
    officialAdvisoryCount?: number
    cveRecordCount?: number
    conferencePaperCount?: number
    preprintCount?: number
    researchCount?: number
    newsCount?: number
    criticalCount?: number
    highRiskCount?: number
    fixedCount?: number
    unfixedCount?: number
    unknownCount?: number
    fixProgressPercent?: number
    sourceMeta: JsonNullValueInput | InputJsonValue
    cacheDir?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OpenclawRiskSnapshotUpdateManyMutationInput = {
    snapshotKey?: StringFieldUpdateOperationsInput | string
    triggerSource?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    latestStableTag?: NullableStringFieldUpdateOperationsInput | string | null
    latestStableVersion?: NullableStringFieldUpdateOperationsInput | string | null
    latestStableUrl?: NullableStringFieldUpdateOperationsInput | string | null
    latestStablePublishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totalIssues?: IntFieldUpdateOperationsInput | number
    githubAdvisories?: IntFieldUpdateOperationsInput | number
    nvdCves?: IntFieldUpdateOperationsInput | number
    officialAdvisoryCount?: IntFieldUpdateOperationsInput | number
    cveRecordCount?: IntFieldUpdateOperationsInput | number
    conferencePaperCount?: IntFieldUpdateOperationsInput | number
    preprintCount?: IntFieldUpdateOperationsInput | number
    researchCount?: IntFieldUpdateOperationsInput | number
    newsCount?: IntFieldUpdateOperationsInput | number
    criticalCount?: IntFieldUpdateOperationsInput | number
    highRiskCount?: IntFieldUpdateOperationsInput | number
    fixedCount?: IntFieldUpdateOperationsInput | number
    unfixedCount?: IntFieldUpdateOperationsInput | number
    unknownCount?: IntFieldUpdateOperationsInput | number
    fixProgressPercent?: IntFieldUpdateOperationsInput | number
    sourceMeta?: JsonNullValueInput | InputJsonValue
    cacheDir?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OpenclawRiskSnapshotUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    snapshotKey?: StringFieldUpdateOperationsInput | string
    triggerSource?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    latestStableTag?: NullableStringFieldUpdateOperationsInput | string | null
    latestStableVersion?: NullableStringFieldUpdateOperationsInput | string | null
    latestStableUrl?: NullableStringFieldUpdateOperationsInput | string | null
    latestStablePublishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totalIssues?: IntFieldUpdateOperationsInput | number
    githubAdvisories?: IntFieldUpdateOperationsInput | number
    nvdCves?: IntFieldUpdateOperationsInput | number
    officialAdvisoryCount?: IntFieldUpdateOperationsInput | number
    cveRecordCount?: IntFieldUpdateOperationsInput | number
    conferencePaperCount?: IntFieldUpdateOperationsInput | number
    preprintCount?: IntFieldUpdateOperationsInput | number
    researchCount?: IntFieldUpdateOperationsInput | number
    newsCount?: IntFieldUpdateOperationsInput | number
    criticalCount?: IntFieldUpdateOperationsInput | number
    highRiskCount?: IntFieldUpdateOperationsInput | number
    fixedCount?: IntFieldUpdateOperationsInput | number
    unfixedCount?: IntFieldUpdateOperationsInput | number
    unknownCount?: IntFieldUpdateOperationsInput | number
    fixProgressPercent?: IntFieldUpdateOperationsInput | number
    sourceMeta?: JsonNullValueInput | InputJsonValue
    cacheDir?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OpenclawRiskIssueCreateInput = {
    id?: bigint | number
    canonicalId: string
    issueId: string
    title: string
    summary: string
    description: string
    sourcePrimary: string
    sourceType?: string
    sourceSearch: string
    sourceLabels: JsonNullValueInput | InputJsonValue
    sources: JsonNullValueInput | InputJsonValue
    githubIds: JsonNullValueInput | InputJsonValue
    cveIds: JsonNullValueInput | InputJsonValue
    projectScope?: string
    venue?: string | null
    authors: JsonNullValueInput | InputJsonValue
    severity: string
    score?: number | null
    cvssVector?: string | null
    cwes: JsonNullValueInput | InputJsonValue
    affectedRange?: string | null
    fixedVersion?: string | null
    latestStableVersion?: string | null
    fixStatus: string
    fixLabel: string
    fixReason: string
    issueUrl?: string | null
    repoUrl?: string | null
    referenceUrls: JsonNullValueInput | InputJsonValue
    tags: JsonNullValueInput | InputJsonValue
    status?: string
    relevanceScore?: number | null
    publishedAt?: Date | string | null
    sourceUpdatedAt?: Date | string | null
    rawData: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    snapshot: OpenclawRiskSnapshotCreateNestedOneWithoutIssuesInput
  }

  export type OpenclawRiskIssueUncheckedCreateInput = {
    id?: bigint | number
    snapshotId: number
    canonicalId: string
    issueId: string
    title: string
    summary: string
    description: string
    sourcePrimary: string
    sourceType?: string
    sourceSearch: string
    sourceLabels: JsonNullValueInput | InputJsonValue
    sources: JsonNullValueInput | InputJsonValue
    githubIds: JsonNullValueInput | InputJsonValue
    cveIds: JsonNullValueInput | InputJsonValue
    projectScope?: string
    venue?: string | null
    authors: JsonNullValueInput | InputJsonValue
    severity: string
    score?: number | null
    cvssVector?: string | null
    cwes: JsonNullValueInput | InputJsonValue
    affectedRange?: string | null
    fixedVersion?: string | null
    latestStableVersion?: string | null
    fixStatus: string
    fixLabel: string
    fixReason: string
    issueUrl?: string | null
    repoUrl?: string | null
    referenceUrls: JsonNullValueInput | InputJsonValue
    tags: JsonNullValueInput | InputJsonValue
    status?: string
    relevanceScore?: number | null
    publishedAt?: Date | string | null
    sourceUpdatedAt?: Date | string | null
    rawData: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type OpenclawRiskIssueUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    canonicalId?: StringFieldUpdateOperationsInput | string
    issueId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    summary?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    sourcePrimary?: StringFieldUpdateOperationsInput | string
    sourceType?: StringFieldUpdateOperationsInput | string
    sourceSearch?: StringFieldUpdateOperationsInput | string
    sourceLabels?: JsonNullValueInput | InputJsonValue
    sources?: JsonNullValueInput | InputJsonValue
    githubIds?: JsonNullValueInput | InputJsonValue
    cveIds?: JsonNullValueInput | InputJsonValue
    projectScope?: StringFieldUpdateOperationsInput | string
    venue?: NullableStringFieldUpdateOperationsInput | string | null
    authors?: JsonNullValueInput | InputJsonValue
    severity?: StringFieldUpdateOperationsInput | string
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    cvssVector?: NullableStringFieldUpdateOperationsInput | string | null
    cwes?: JsonNullValueInput | InputJsonValue
    affectedRange?: NullableStringFieldUpdateOperationsInput | string | null
    fixedVersion?: NullableStringFieldUpdateOperationsInput | string | null
    latestStableVersion?: NullableStringFieldUpdateOperationsInput | string | null
    fixStatus?: StringFieldUpdateOperationsInput | string
    fixLabel?: StringFieldUpdateOperationsInput | string
    fixReason?: StringFieldUpdateOperationsInput | string
    issueUrl?: NullableStringFieldUpdateOperationsInput | string | null
    repoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    referenceUrls?: JsonNullValueInput | InputJsonValue
    tags?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    relevanceScore?: NullableFloatFieldUpdateOperationsInput | number | null
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sourceUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rawData?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    snapshot?: OpenclawRiskSnapshotUpdateOneRequiredWithoutIssuesNestedInput
  }

  export type OpenclawRiskIssueUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    snapshotId?: IntFieldUpdateOperationsInput | number
    canonicalId?: StringFieldUpdateOperationsInput | string
    issueId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    summary?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    sourcePrimary?: StringFieldUpdateOperationsInput | string
    sourceType?: StringFieldUpdateOperationsInput | string
    sourceSearch?: StringFieldUpdateOperationsInput | string
    sourceLabels?: JsonNullValueInput | InputJsonValue
    sources?: JsonNullValueInput | InputJsonValue
    githubIds?: JsonNullValueInput | InputJsonValue
    cveIds?: JsonNullValueInput | InputJsonValue
    projectScope?: StringFieldUpdateOperationsInput | string
    venue?: NullableStringFieldUpdateOperationsInput | string | null
    authors?: JsonNullValueInput | InputJsonValue
    severity?: StringFieldUpdateOperationsInput | string
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    cvssVector?: NullableStringFieldUpdateOperationsInput | string | null
    cwes?: JsonNullValueInput | InputJsonValue
    affectedRange?: NullableStringFieldUpdateOperationsInput | string | null
    fixedVersion?: NullableStringFieldUpdateOperationsInput | string | null
    latestStableVersion?: NullableStringFieldUpdateOperationsInput | string | null
    fixStatus?: StringFieldUpdateOperationsInput | string
    fixLabel?: StringFieldUpdateOperationsInput | string
    fixReason?: StringFieldUpdateOperationsInput | string
    issueUrl?: NullableStringFieldUpdateOperationsInput | string | null
    repoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    referenceUrls?: JsonNullValueInput | InputJsonValue
    tags?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    relevanceScore?: NullableFloatFieldUpdateOperationsInput | number | null
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sourceUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rawData?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OpenclawRiskIssueCreateManyInput = {
    id?: bigint | number
    snapshotId: number
    canonicalId: string
    issueId: string
    title: string
    summary: string
    description: string
    sourcePrimary: string
    sourceType?: string
    sourceSearch: string
    sourceLabels: JsonNullValueInput | InputJsonValue
    sources: JsonNullValueInput | InputJsonValue
    githubIds: JsonNullValueInput | InputJsonValue
    cveIds: JsonNullValueInput | InputJsonValue
    projectScope?: string
    venue?: string | null
    authors: JsonNullValueInput | InputJsonValue
    severity: string
    score?: number | null
    cvssVector?: string | null
    cwes: JsonNullValueInput | InputJsonValue
    affectedRange?: string | null
    fixedVersion?: string | null
    latestStableVersion?: string | null
    fixStatus: string
    fixLabel: string
    fixReason: string
    issueUrl?: string | null
    repoUrl?: string | null
    referenceUrls: JsonNullValueInput | InputJsonValue
    tags: JsonNullValueInput | InputJsonValue
    status?: string
    relevanceScore?: number | null
    publishedAt?: Date | string | null
    sourceUpdatedAt?: Date | string | null
    rawData: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type OpenclawRiskIssueUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    canonicalId?: StringFieldUpdateOperationsInput | string
    issueId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    summary?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    sourcePrimary?: StringFieldUpdateOperationsInput | string
    sourceType?: StringFieldUpdateOperationsInput | string
    sourceSearch?: StringFieldUpdateOperationsInput | string
    sourceLabels?: JsonNullValueInput | InputJsonValue
    sources?: JsonNullValueInput | InputJsonValue
    githubIds?: JsonNullValueInput | InputJsonValue
    cveIds?: JsonNullValueInput | InputJsonValue
    projectScope?: StringFieldUpdateOperationsInput | string
    venue?: NullableStringFieldUpdateOperationsInput | string | null
    authors?: JsonNullValueInput | InputJsonValue
    severity?: StringFieldUpdateOperationsInput | string
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    cvssVector?: NullableStringFieldUpdateOperationsInput | string | null
    cwes?: JsonNullValueInput | InputJsonValue
    affectedRange?: NullableStringFieldUpdateOperationsInput | string | null
    fixedVersion?: NullableStringFieldUpdateOperationsInput | string | null
    latestStableVersion?: NullableStringFieldUpdateOperationsInput | string | null
    fixStatus?: StringFieldUpdateOperationsInput | string
    fixLabel?: StringFieldUpdateOperationsInput | string
    fixReason?: StringFieldUpdateOperationsInput | string
    issueUrl?: NullableStringFieldUpdateOperationsInput | string | null
    repoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    referenceUrls?: JsonNullValueInput | InputJsonValue
    tags?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    relevanceScore?: NullableFloatFieldUpdateOperationsInput | number | null
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sourceUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rawData?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OpenclawRiskIssueUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    snapshotId?: IntFieldUpdateOperationsInput | number
    canonicalId?: StringFieldUpdateOperationsInput | string
    issueId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    summary?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    sourcePrimary?: StringFieldUpdateOperationsInput | string
    sourceType?: StringFieldUpdateOperationsInput | string
    sourceSearch?: StringFieldUpdateOperationsInput | string
    sourceLabels?: JsonNullValueInput | InputJsonValue
    sources?: JsonNullValueInput | InputJsonValue
    githubIds?: JsonNullValueInput | InputJsonValue
    cveIds?: JsonNullValueInput | InputJsonValue
    projectScope?: StringFieldUpdateOperationsInput | string
    venue?: NullableStringFieldUpdateOperationsInput | string | null
    authors?: JsonNullValueInput | InputJsonValue
    severity?: StringFieldUpdateOperationsInput | string
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    cvssVector?: NullableStringFieldUpdateOperationsInput | string | null
    cwes?: JsonNullValueInput | InputJsonValue
    affectedRange?: NullableStringFieldUpdateOperationsInput | string | null
    fixedVersion?: NullableStringFieldUpdateOperationsInput | string | null
    latestStableVersion?: NullableStringFieldUpdateOperationsInput | string | null
    fixStatus?: StringFieldUpdateOperationsInput | string
    fixLabel?: StringFieldUpdateOperationsInput | string
    fixReason?: StringFieldUpdateOperationsInput | string
    issueUrl?: NullableStringFieldUpdateOperationsInput | string | null
    repoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    referenceUrls?: JsonNullValueInput | InputJsonValue
    tags?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    relevanceScore?: NullableFloatFieldUpdateOperationsInput | number | null
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sourceUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rawData?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SecurityResearchSnapshotCreateInput = {
    snapshotKey: string
    triggerSource?: string
    status?: string
    totalPapers?: number
    conferencePaperCount?: number
    preprintCount?: number
    openclawCount?: number
    clawCount?: number
    skillCount?: number
    agentCount?: number
    pluginCount?: number
    sourceMeta: JsonNullValueInput | InputJsonValue
    cacheDir?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    papers?: SecurityResearchPaperCreateNestedManyWithoutSnapshotInput
  }

  export type SecurityResearchSnapshotUncheckedCreateInput = {
    id?: number
    snapshotKey: string
    triggerSource?: string
    status?: string
    totalPapers?: number
    conferencePaperCount?: number
    preprintCount?: number
    openclawCount?: number
    clawCount?: number
    skillCount?: number
    agentCount?: number
    pluginCount?: number
    sourceMeta: JsonNullValueInput | InputJsonValue
    cacheDir?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
    papers?: SecurityResearchPaperUncheckedCreateNestedManyWithoutSnapshotInput
  }

  export type SecurityResearchSnapshotUpdateInput = {
    snapshotKey?: StringFieldUpdateOperationsInput | string
    triggerSource?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    totalPapers?: IntFieldUpdateOperationsInput | number
    conferencePaperCount?: IntFieldUpdateOperationsInput | number
    preprintCount?: IntFieldUpdateOperationsInput | number
    openclawCount?: IntFieldUpdateOperationsInput | number
    clawCount?: IntFieldUpdateOperationsInput | number
    skillCount?: IntFieldUpdateOperationsInput | number
    agentCount?: IntFieldUpdateOperationsInput | number
    pluginCount?: IntFieldUpdateOperationsInput | number
    sourceMeta?: JsonNullValueInput | InputJsonValue
    cacheDir?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    papers?: SecurityResearchPaperUpdateManyWithoutSnapshotNestedInput
  }

  export type SecurityResearchSnapshotUncheckedUpdateInput = {
    id?: IntFieldUpdateOperationsInput | number
    snapshotKey?: StringFieldUpdateOperationsInput | string
    triggerSource?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    totalPapers?: IntFieldUpdateOperationsInput | number
    conferencePaperCount?: IntFieldUpdateOperationsInput | number
    preprintCount?: IntFieldUpdateOperationsInput | number
    openclawCount?: IntFieldUpdateOperationsInput | number
    clawCount?: IntFieldUpdateOperationsInput | number
    skillCount?: IntFieldUpdateOperationsInput | number
    agentCount?: IntFieldUpdateOperationsInput | number
    pluginCount?: IntFieldUpdateOperationsInput | number
    sourceMeta?: JsonNullValueInput | InputJsonValue
    cacheDir?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
    papers?: SecurityResearchPaperUncheckedUpdateManyWithoutSnapshotNestedInput
  }

  export type SecurityResearchSnapshotCreateManyInput = {
    id?: number
    snapshotKey: string
    triggerSource?: string
    status?: string
    totalPapers?: number
    conferencePaperCount?: number
    preprintCount?: number
    openclawCount?: number
    clawCount?: number
    skillCount?: number
    agentCount?: number
    pluginCount?: number
    sourceMeta: JsonNullValueInput | InputJsonValue
    cacheDir?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SecurityResearchSnapshotUpdateManyMutationInput = {
    snapshotKey?: StringFieldUpdateOperationsInput | string
    triggerSource?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    totalPapers?: IntFieldUpdateOperationsInput | number
    conferencePaperCount?: IntFieldUpdateOperationsInput | number
    preprintCount?: IntFieldUpdateOperationsInput | number
    openclawCount?: IntFieldUpdateOperationsInput | number
    clawCount?: IntFieldUpdateOperationsInput | number
    skillCount?: IntFieldUpdateOperationsInput | number
    agentCount?: IntFieldUpdateOperationsInput | number
    pluginCount?: IntFieldUpdateOperationsInput | number
    sourceMeta?: JsonNullValueInput | InputJsonValue
    cacheDir?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SecurityResearchSnapshotUncheckedUpdateManyInput = {
    id?: IntFieldUpdateOperationsInput | number
    snapshotKey?: StringFieldUpdateOperationsInput | string
    triggerSource?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    totalPapers?: IntFieldUpdateOperationsInput | number
    conferencePaperCount?: IntFieldUpdateOperationsInput | number
    preprintCount?: IntFieldUpdateOperationsInput | number
    openclawCount?: IntFieldUpdateOperationsInput | number
    clawCount?: IntFieldUpdateOperationsInput | number
    skillCount?: IntFieldUpdateOperationsInput | number
    agentCount?: IntFieldUpdateOperationsInput | number
    pluginCount?: IntFieldUpdateOperationsInput | number
    sourceMeta?: JsonNullValueInput | InputJsonValue
    cacheDir?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SecurityResearchPaperCreateInput = {
    id?: bigint | number
    canonicalId: string
    title: string
    normalizedTitle: string
    sourceType: string
    projectScope: string
    venue: string
    sourcePrimary: string
    sourceSearch: string
    abstractOrSummary: string
    tags: JsonNullValueInput | InputJsonValue
    sourceUrl?: string | null
    authors: JsonNullValueInput | InputJsonValue
    externalIds: JsonNullValueInput | InputJsonValue
    relevanceScore?: number
    isTopVenue?: boolean
    publishedAt?: Date | string | null
    status?: string
    rawData: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
    snapshot: SecurityResearchSnapshotCreateNestedOneWithoutPapersInput
  }

  export type SecurityResearchPaperUncheckedCreateInput = {
    id?: bigint | number
    snapshotId: number
    canonicalId: string
    title: string
    normalizedTitle: string
    sourceType: string
    projectScope: string
    venue: string
    sourcePrimary: string
    sourceSearch: string
    abstractOrSummary: string
    tags: JsonNullValueInput | InputJsonValue
    sourceUrl?: string | null
    authors: JsonNullValueInput | InputJsonValue
    externalIds: JsonNullValueInput | InputJsonValue
    relevanceScore?: number
    isTopVenue?: boolean
    publishedAt?: Date | string | null
    status?: string
    rawData: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type SecurityResearchPaperUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    canonicalId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    normalizedTitle?: StringFieldUpdateOperationsInput | string
    sourceType?: StringFieldUpdateOperationsInput | string
    projectScope?: StringFieldUpdateOperationsInput | string
    venue?: StringFieldUpdateOperationsInput | string
    sourcePrimary?: StringFieldUpdateOperationsInput | string
    sourceSearch?: StringFieldUpdateOperationsInput | string
    abstractOrSummary?: StringFieldUpdateOperationsInput | string
    tags?: JsonNullValueInput | InputJsonValue
    sourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    authors?: JsonNullValueInput | InputJsonValue
    externalIds?: JsonNullValueInput | InputJsonValue
    relevanceScore?: FloatFieldUpdateOperationsInput | number
    isTopVenue?: BoolFieldUpdateOperationsInput | boolean
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    rawData?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    snapshot?: SecurityResearchSnapshotUpdateOneRequiredWithoutPapersNestedInput
  }

  export type SecurityResearchPaperUncheckedUpdateInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    snapshotId?: IntFieldUpdateOperationsInput | number
    canonicalId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    normalizedTitle?: StringFieldUpdateOperationsInput | string
    sourceType?: StringFieldUpdateOperationsInput | string
    projectScope?: StringFieldUpdateOperationsInput | string
    venue?: StringFieldUpdateOperationsInput | string
    sourcePrimary?: StringFieldUpdateOperationsInput | string
    sourceSearch?: StringFieldUpdateOperationsInput | string
    abstractOrSummary?: StringFieldUpdateOperationsInput | string
    tags?: JsonNullValueInput | InputJsonValue
    sourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    authors?: JsonNullValueInput | InputJsonValue
    externalIds?: JsonNullValueInput | InputJsonValue
    relevanceScore?: FloatFieldUpdateOperationsInput | number
    isTopVenue?: BoolFieldUpdateOperationsInput | boolean
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    rawData?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SecurityResearchPaperCreateManyInput = {
    id?: bigint | number
    snapshotId: number
    canonicalId: string
    title: string
    normalizedTitle: string
    sourceType: string
    projectScope: string
    venue: string
    sourcePrimary: string
    sourceSearch: string
    abstractOrSummary: string
    tags: JsonNullValueInput | InputJsonValue
    sourceUrl?: string | null
    authors: JsonNullValueInput | InputJsonValue
    externalIds: JsonNullValueInput | InputJsonValue
    relevanceScore?: number
    isTopVenue?: boolean
    publishedAt?: Date | string | null
    status?: string
    rawData: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type SecurityResearchPaperUpdateManyMutationInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    canonicalId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    normalizedTitle?: StringFieldUpdateOperationsInput | string
    sourceType?: StringFieldUpdateOperationsInput | string
    projectScope?: StringFieldUpdateOperationsInput | string
    venue?: StringFieldUpdateOperationsInput | string
    sourcePrimary?: StringFieldUpdateOperationsInput | string
    sourceSearch?: StringFieldUpdateOperationsInput | string
    abstractOrSummary?: StringFieldUpdateOperationsInput | string
    tags?: JsonNullValueInput | InputJsonValue
    sourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    authors?: JsonNullValueInput | InputJsonValue
    externalIds?: JsonNullValueInput | InputJsonValue
    relevanceScore?: FloatFieldUpdateOperationsInput | number
    isTopVenue?: BoolFieldUpdateOperationsInput | boolean
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    rawData?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SecurityResearchPaperUncheckedUpdateManyInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    snapshotId?: IntFieldUpdateOperationsInput | number
    canonicalId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    normalizedTitle?: StringFieldUpdateOperationsInput | string
    sourceType?: StringFieldUpdateOperationsInput | string
    projectScope?: StringFieldUpdateOperationsInput | string
    venue?: StringFieldUpdateOperationsInput | string
    sourcePrimary?: StringFieldUpdateOperationsInput | string
    sourceSearch?: StringFieldUpdateOperationsInput | string
    abstractOrSummary?: StringFieldUpdateOperationsInput | string
    tags?: JsonNullValueInput | InputJsonValue
    sourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    authors?: JsonNullValueInput | InputJsonValue
    externalIds?: JsonNullValueInput | InputJsonValue
    relevanceScore?: FloatFieldUpdateOperationsInput | number
    isTopVenue?: BoolFieldUpdateOperationsInput | boolean
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    rawData?: JsonNullValueInput | InputJsonValue
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

  export type StringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type DateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }
  export type JsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonFilterBase<$PrismaModel>>, 'path'>>

  export type JsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type OpenclawRiskIssueListRelationFilter = {
    every?: OpenclawRiskIssueWhereInput
    some?: OpenclawRiskIssueWhereInput
    none?: OpenclawRiskIssueWhereInput
  }

  export type OpenclawRiskIssueOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type OpenclawRiskSnapshotOrderByRelevanceInput = {
    fields: OpenclawRiskSnapshotOrderByRelevanceFieldEnum | OpenclawRiskSnapshotOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type OpenclawRiskSnapshotCountOrderByAggregateInput = {
    id?: SortOrder
    snapshotKey?: SortOrder
    triggerSource?: SortOrder
    status?: SortOrder
    latestStableTag?: SortOrder
    latestStableVersion?: SortOrder
    latestStableUrl?: SortOrder
    latestStablePublishedAt?: SortOrder
    totalIssues?: SortOrder
    githubAdvisories?: SortOrder
    nvdCves?: SortOrder
    officialAdvisoryCount?: SortOrder
    cveRecordCount?: SortOrder
    conferencePaperCount?: SortOrder
    preprintCount?: SortOrder
    researchCount?: SortOrder
    newsCount?: SortOrder
    criticalCount?: SortOrder
    highRiskCount?: SortOrder
    fixedCount?: SortOrder
    unfixedCount?: SortOrder
    unknownCount?: SortOrder
    fixProgressPercent?: SortOrder
    sourceMeta?: SortOrder
    cacheDir?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OpenclawRiskSnapshotAvgOrderByAggregateInput = {
    id?: SortOrder
    totalIssues?: SortOrder
    githubAdvisories?: SortOrder
    nvdCves?: SortOrder
    officialAdvisoryCount?: SortOrder
    cveRecordCount?: SortOrder
    conferencePaperCount?: SortOrder
    preprintCount?: SortOrder
    researchCount?: SortOrder
    newsCount?: SortOrder
    criticalCount?: SortOrder
    highRiskCount?: SortOrder
    fixedCount?: SortOrder
    unfixedCount?: SortOrder
    unknownCount?: SortOrder
    fixProgressPercent?: SortOrder
  }

  export type OpenclawRiskSnapshotMaxOrderByAggregateInput = {
    id?: SortOrder
    snapshotKey?: SortOrder
    triggerSource?: SortOrder
    status?: SortOrder
    latestStableTag?: SortOrder
    latestStableVersion?: SortOrder
    latestStableUrl?: SortOrder
    latestStablePublishedAt?: SortOrder
    totalIssues?: SortOrder
    githubAdvisories?: SortOrder
    nvdCves?: SortOrder
    officialAdvisoryCount?: SortOrder
    cveRecordCount?: SortOrder
    conferencePaperCount?: SortOrder
    preprintCount?: SortOrder
    researchCount?: SortOrder
    newsCount?: SortOrder
    criticalCount?: SortOrder
    highRiskCount?: SortOrder
    fixedCount?: SortOrder
    unfixedCount?: SortOrder
    unknownCount?: SortOrder
    fixProgressPercent?: SortOrder
    cacheDir?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OpenclawRiskSnapshotMinOrderByAggregateInput = {
    id?: SortOrder
    snapshotKey?: SortOrder
    triggerSource?: SortOrder
    status?: SortOrder
    latestStableTag?: SortOrder
    latestStableVersion?: SortOrder
    latestStableUrl?: SortOrder
    latestStablePublishedAt?: SortOrder
    totalIssues?: SortOrder
    githubAdvisories?: SortOrder
    nvdCves?: SortOrder
    officialAdvisoryCount?: SortOrder
    cveRecordCount?: SortOrder
    conferencePaperCount?: SortOrder
    preprintCount?: SortOrder
    researchCount?: SortOrder
    newsCount?: SortOrder
    criticalCount?: SortOrder
    highRiskCount?: SortOrder
    fixedCount?: SortOrder
    unfixedCount?: SortOrder
    unknownCount?: SortOrder
    fixProgressPercent?: SortOrder
    cacheDir?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type OpenclawRiskSnapshotSumOrderByAggregateInput = {
    id?: SortOrder
    totalIssues?: SortOrder
    githubAdvisories?: SortOrder
    nvdCves?: SortOrder
    officialAdvisoryCount?: SortOrder
    cveRecordCount?: SortOrder
    conferencePaperCount?: SortOrder
    preprintCount?: SortOrder
    researchCount?: SortOrder
    newsCount?: SortOrder
    criticalCount?: SortOrder
    highRiskCount?: SortOrder
    fixedCount?: SortOrder
    unfixedCount?: SortOrder
    unknownCount?: SortOrder
    fixProgressPercent?: SortOrder
  }

  export type StringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type DateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }
  export type JsonWithAggregatesFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, Exclude<keyof Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>,
        Required<JsonWithAggregatesFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<JsonWithAggregatesFilterBase<$PrismaModel>>, 'path'>>

  export type JsonWithAggregatesFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedJsonFilter<$PrismaModel>
    _max?: NestedJsonFilter<$PrismaModel>
  }

  export type FloatNullableFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableFilter<$PrismaModel> | number | null
  }

  export type OpenclawRiskSnapshotScalarRelationFilter = {
    is?: OpenclawRiskSnapshotWhereInput
    isNot?: OpenclawRiskSnapshotWhereInput
  }

  export type OpenclawRiskIssueOrderByRelevanceInput = {
    fields: OpenclawRiskIssueOrderByRelevanceFieldEnum | OpenclawRiskIssueOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type OpenclawRiskIssueSnapshotIdCanonicalIdCompoundUniqueInput = {
    snapshotId: number
    canonicalId: string
  }

  export type OpenclawRiskIssueCountOrderByAggregateInput = {
    id?: SortOrder
    snapshotId?: SortOrder
    canonicalId?: SortOrder
    issueId?: SortOrder
    title?: SortOrder
    summary?: SortOrder
    description?: SortOrder
    sourcePrimary?: SortOrder
    sourceType?: SortOrder
    sourceSearch?: SortOrder
    sourceLabels?: SortOrder
    sources?: SortOrder
    githubIds?: SortOrder
    cveIds?: SortOrder
    projectScope?: SortOrder
    venue?: SortOrder
    authors?: SortOrder
    severity?: SortOrder
    score?: SortOrder
    cvssVector?: SortOrder
    cwes?: SortOrder
    affectedRange?: SortOrder
    fixedVersion?: SortOrder
    latestStableVersion?: SortOrder
    fixStatus?: SortOrder
    fixLabel?: SortOrder
    fixReason?: SortOrder
    issueUrl?: SortOrder
    repoUrl?: SortOrder
    referenceUrls?: SortOrder
    tags?: SortOrder
    status?: SortOrder
    relevanceScore?: SortOrder
    publishedAt?: SortOrder
    sourceUpdatedAt?: SortOrder
    rawData?: SortOrder
    createdAt?: SortOrder
  }

  export type OpenclawRiskIssueAvgOrderByAggregateInput = {
    id?: SortOrder
    snapshotId?: SortOrder
    score?: SortOrder
    relevanceScore?: SortOrder
  }

  export type OpenclawRiskIssueMaxOrderByAggregateInput = {
    id?: SortOrder
    snapshotId?: SortOrder
    canonicalId?: SortOrder
    issueId?: SortOrder
    title?: SortOrder
    summary?: SortOrder
    description?: SortOrder
    sourcePrimary?: SortOrder
    sourceType?: SortOrder
    sourceSearch?: SortOrder
    projectScope?: SortOrder
    venue?: SortOrder
    severity?: SortOrder
    score?: SortOrder
    cvssVector?: SortOrder
    affectedRange?: SortOrder
    fixedVersion?: SortOrder
    latestStableVersion?: SortOrder
    fixStatus?: SortOrder
    fixLabel?: SortOrder
    fixReason?: SortOrder
    issueUrl?: SortOrder
    repoUrl?: SortOrder
    status?: SortOrder
    relevanceScore?: SortOrder
    publishedAt?: SortOrder
    sourceUpdatedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type OpenclawRiskIssueMinOrderByAggregateInput = {
    id?: SortOrder
    snapshotId?: SortOrder
    canonicalId?: SortOrder
    issueId?: SortOrder
    title?: SortOrder
    summary?: SortOrder
    description?: SortOrder
    sourcePrimary?: SortOrder
    sourceType?: SortOrder
    sourceSearch?: SortOrder
    projectScope?: SortOrder
    venue?: SortOrder
    severity?: SortOrder
    score?: SortOrder
    cvssVector?: SortOrder
    affectedRange?: SortOrder
    fixedVersion?: SortOrder
    latestStableVersion?: SortOrder
    fixStatus?: SortOrder
    fixLabel?: SortOrder
    fixReason?: SortOrder
    issueUrl?: SortOrder
    repoUrl?: SortOrder
    status?: SortOrder
    relevanceScore?: SortOrder
    publishedAt?: SortOrder
    sourceUpdatedAt?: SortOrder
    createdAt?: SortOrder
  }

  export type OpenclawRiskIssueSumOrderByAggregateInput = {
    id?: SortOrder
    snapshotId?: SortOrder
    score?: SortOrder
    relevanceScore?: SortOrder
  }

  export type FloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type SecurityResearchPaperListRelationFilter = {
    every?: SecurityResearchPaperWhereInput
    some?: SecurityResearchPaperWhereInput
    none?: SecurityResearchPaperWhereInput
  }

  export type SecurityResearchPaperOrderByRelationAggregateInput = {
    _count?: SortOrder
  }

  export type SecurityResearchSnapshotOrderByRelevanceInput = {
    fields: SecurityResearchSnapshotOrderByRelevanceFieldEnum | SecurityResearchSnapshotOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type SecurityResearchSnapshotCountOrderByAggregateInput = {
    id?: SortOrder
    snapshotKey?: SortOrder
    triggerSource?: SortOrder
    status?: SortOrder
    totalPapers?: SortOrder
    conferencePaperCount?: SortOrder
    preprintCount?: SortOrder
    openclawCount?: SortOrder
    clawCount?: SortOrder
    skillCount?: SortOrder
    agentCount?: SortOrder
    pluginCount?: SortOrder
    sourceMeta?: SortOrder
    cacheDir?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SecurityResearchSnapshotAvgOrderByAggregateInput = {
    id?: SortOrder
    totalPapers?: SortOrder
    conferencePaperCount?: SortOrder
    preprintCount?: SortOrder
    openclawCount?: SortOrder
    clawCount?: SortOrder
    skillCount?: SortOrder
    agentCount?: SortOrder
    pluginCount?: SortOrder
  }

  export type SecurityResearchSnapshotMaxOrderByAggregateInput = {
    id?: SortOrder
    snapshotKey?: SortOrder
    triggerSource?: SortOrder
    status?: SortOrder
    totalPapers?: SortOrder
    conferencePaperCount?: SortOrder
    preprintCount?: SortOrder
    openclawCount?: SortOrder
    clawCount?: SortOrder
    skillCount?: SortOrder
    agentCount?: SortOrder
    pluginCount?: SortOrder
    cacheDir?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SecurityResearchSnapshotMinOrderByAggregateInput = {
    id?: SortOrder
    snapshotKey?: SortOrder
    triggerSource?: SortOrder
    status?: SortOrder
    totalPapers?: SortOrder
    conferencePaperCount?: SortOrder
    preprintCount?: SortOrder
    openclawCount?: SortOrder
    clawCount?: SortOrder
    skillCount?: SortOrder
    agentCount?: SortOrder
    pluginCount?: SortOrder
    cacheDir?: SortOrder
    createdAt?: SortOrder
    updatedAt?: SortOrder
  }

  export type SecurityResearchSnapshotSumOrderByAggregateInput = {
    id?: SortOrder
    totalPapers?: SortOrder
    conferencePaperCount?: SortOrder
    preprintCount?: SortOrder
    openclawCount?: SortOrder
    clawCount?: SortOrder
    skillCount?: SortOrder
    agentCount?: SortOrder
    pluginCount?: SortOrder
  }

  export type FloatFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatFilter<$PrismaModel> | number
  }

  export type BoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type SecurityResearchSnapshotScalarRelationFilter = {
    is?: SecurityResearchSnapshotWhereInput
    isNot?: SecurityResearchSnapshotWhereInput
  }

  export type SecurityResearchPaperOrderByRelevanceInput = {
    fields: SecurityResearchPaperOrderByRelevanceFieldEnum | SecurityResearchPaperOrderByRelevanceFieldEnum[]
    sort: SortOrder
    search: string
  }

  export type SecurityResearchPaperSnapshotIdCanonicalIdCompoundUniqueInput = {
    snapshotId: number
    canonicalId: string
  }

  export type SecurityResearchPaperCountOrderByAggregateInput = {
    id?: SortOrder
    snapshotId?: SortOrder
    canonicalId?: SortOrder
    title?: SortOrder
    normalizedTitle?: SortOrder
    sourceType?: SortOrder
    projectScope?: SortOrder
    venue?: SortOrder
    sourcePrimary?: SortOrder
    sourceSearch?: SortOrder
    abstractOrSummary?: SortOrder
    tags?: SortOrder
    sourceUrl?: SortOrder
    authors?: SortOrder
    externalIds?: SortOrder
    relevanceScore?: SortOrder
    isTopVenue?: SortOrder
    publishedAt?: SortOrder
    status?: SortOrder
    rawData?: SortOrder
    createdAt?: SortOrder
  }

  export type SecurityResearchPaperAvgOrderByAggregateInput = {
    id?: SortOrder
    snapshotId?: SortOrder
    relevanceScore?: SortOrder
  }

  export type SecurityResearchPaperMaxOrderByAggregateInput = {
    id?: SortOrder
    snapshotId?: SortOrder
    canonicalId?: SortOrder
    title?: SortOrder
    normalizedTitle?: SortOrder
    sourceType?: SortOrder
    projectScope?: SortOrder
    venue?: SortOrder
    sourcePrimary?: SortOrder
    sourceSearch?: SortOrder
    abstractOrSummary?: SortOrder
    sourceUrl?: SortOrder
    relevanceScore?: SortOrder
    isTopVenue?: SortOrder
    publishedAt?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type SecurityResearchPaperMinOrderByAggregateInput = {
    id?: SortOrder
    snapshotId?: SortOrder
    canonicalId?: SortOrder
    title?: SortOrder
    normalizedTitle?: SortOrder
    sourceType?: SortOrder
    projectScope?: SortOrder
    venue?: SortOrder
    sourcePrimary?: SortOrder
    sourceSearch?: SortOrder
    abstractOrSummary?: SortOrder
    sourceUrl?: SortOrder
    relevanceScore?: SortOrder
    isTopVenue?: SortOrder
    publishedAt?: SortOrder
    status?: SortOrder
    createdAt?: SortOrder
  }

  export type SecurityResearchPaperSumOrderByAggregateInput = {
    id?: SortOrder
    snapshotId?: SortOrder
    relevanceScore?: SortOrder
  }

  export type FloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type BoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type OpenclawRiskIssueCreateNestedManyWithoutSnapshotInput = {
    create?: XOR<OpenclawRiskIssueCreateWithoutSnapshotInput, OpenclawRiskIssueUncheckedCreateWithoutSnapshotInput> | OpenclawRiskIssueCreateWithoutSnapshotInput[] | OpenclawRiskIssueUncheckedCreateWithoutSnapshotInput[]
    connectOrCreate?: OpenclawRiskIssueCreateOrConnectWithoutSnapshotInput | OpenclawRiskIssueCreateOrConnectWithoutSnapshotInput[]
    createMany?: OpenclawRiskIssueCreateManySnapshotInputEnvelope
    connect?: OpenclawRiskIssueWhereUniqueInput | OpenclawRiskIssueWhereUniqueInput[]
  }

  export type OpenclawRiskIssueUncheckedCreateNestedManyWithoutSnapshotInput = {
    create?: XOR<OpenclawRiskIssueCreateWithoutSnapshotInput, OpenclawRiskIssueUncheckedCreateWithoutSnapshotInput> | OpenclawRiskIssueCreateWithoutSnapshotInput[] | OpenclawRiskIssueUncheckedCreateWithoutSnapshotInput[]
    connectOrCreate?: OpenclawRiskIssueCreateOrConnectWithoutSnapshotInput | OpenclawRiskIssueCreateOrConnectWithoutSnapshotInput[]
    createMany?: OpenclawRiskIssueCreateManySnapshotInputEnvelope
    connect?: OpenclawRiskIssueWhereUniqueInput | OpenclawRiskIssueWhereUniqueInput[]
  }

  export type NullableStringFieldUpdateOperationsInput = {
    set?: string | null
  }

  export type NullableDateTimeFieldUpdateOperationsInput = {
    set?: Date | string | null
  }

  export type OpenclawRiskIssueUpdateManyWithoutSnapshotNestedInput = {
    create?: XOR<OpenclawRiskIssueCreateWithoutSnapshotInput, OpenclawRiskIssueUncheckedCreateWithoutSnapshotInput> | OpenclawRiskIssueCreateWithoutSnapshotInput[] | OpenclawRiskIssueUncheckedCreateWithoutSnapshotInput[]
    connectOrCreate?: OpenclawRiskIssueCreateOrConnectWithoutSnapshotInput | OpenclawRiskIssueCreateOrConnectWithoutSnapshotInput[]
    upsert?: OpenclawRiskIssueUpsertWithWhereUniqueWithoutSnapshotInput | OpenclawRiskIssueUpsertWithWhereUniqueWithoutSnapshotInput[]
    createMany?: OpenclawRiskIssueCreateManySnapshotInputEnvelope
    set?: OpenclawRiskIssueWhereUniqueInput | OpenclawRiskIssueWhereUniqueInput[]
    disconnect?: OpenclawRiskIssueWhereUniqueInput | OpenclawRiskIssueWhereUniqueInput[]
    delete?: OpenclawRiskIssueWhereUniqueInput | OpenclawRiskIssueWhereUniqueInput[]
    connect?: OpenclawRiskIssueWhereUniqueInput | OpenclawRiskIssueWhereUniqueInput[]
    update?: OpenclawRiskIssueUpdateWithWhereUniqueWithoutSnapshotInput | OpenclawRiskIssueUpdateWithWhereUniqueWithoutSnapshotInput[]
    updateMany?: OpenclawRiskIssueUpdateManyWithWhereWithoutSnapshotInput | OpenclawRiskIssueUpdateManyWithWhereWithoutSnapshotInput[]
    deleteMany?: OpenclawRiskIssueScalarWhereInput | OpenclawRiskIssueScalarWhereInput[]
  }

  export type OpenclawRiskIssueUncheckedUpdateManyWithoutSnapshotNestedInput = {
    create?: XOR<OpenclawRiskIssueCreateWithoutSnapshotInput, OpenclawRiskIssueUncheckedCreateWithoutSnapshotInput> | OpenclawRiskIssueCreateWithoutSnapshotInput[] | OpenclawRiskIssueUncheckedCreateWithoutSnapshotInput[]
    connectOrCreate?: OpenclawRiskIssueCreateOrConnectWithoutSnapshotInput | OpenclawRiskIssueCreateOrConnectWithoutSnapshotInput[]
    upsert?: OpenclawRiskIssueUpsertWithWhereUniqueWithoutSnapshotInput | OpenclawRiskIssueUpsertWithWhereUniqueWithoutSnapshotInput[]
    createMany?: OpenclawRiskIssueCreateManySnapshotInputEnvelope
    set?: OpenclawRiskIssueWhereUniqueInput | OpenclawRiskIssueWhereUniqueInput[]
    disconnect?: OpenclawRiskIssueWhereUniqueInput | OpenclawRiskIssueWhereUniqueInput[]
    delete?: OpenclawRiskIssueWhereUniqueInput | OpenclawRiskIssueWhereUniqueInput[]
    connect?: OpenclawRiskIssueWhereUniqueInput | OpenclawRiskIssueWhereUniqueInput[]
    update?: OpenclawRiskIssueUpdateWithWhereUniqueWithoutSnapshotInput | OpenclawRiskIssueUpdateWithWhereUniqueWithoutSnapshotInput[]
    updateMany?: OpenclawRiskIssueUpdateManyWithWhereWithoutSnapshotInput | OpenclawRiskIssueUpdateManyWithWhereWithoutSnapshotInput[]
    deleteMany?: OpenclawRiskIssueScalarWhereInput | OpenclawRiskIssueScalarWhereInput[]
  }

  export type OpenclawRiskSnapshotCreateNestedOneWithoutIssuesInput = {
    create?: XOR<OpenclawRiskSnapshotCreateWithoutIssuesInput, OpenclawRiskSnapshotUncheckedCreateWithoutIssuesInput>
    connectOrCreate?: OpenclawRiskSnapshotCreateOrConnectWithoutIssuesInput
    connect?: OpenclawRiskSnapshotWhereUniqueInput
  }

  export type NullableFloatFieldUpdateOperationsInput = {
    set?: number | null
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type OpenclawRiskSnapshotUpdateOneRequiredWithoutIssuesNestedInput = {
    create?: XOR<OpenclawRiskSnapshotCreateWithoutIssuesInput, OpenclawRiskSnapshotUncheckedCreateWithoutIssuesInput>
    connectOrCreate?: OpenclawRiskSnapshotCreateOrConnectWithoutIssuesInput
    upsert?: OpenclawRiskSnapshotUpsertWithoutIssuesInput
    connect?: OpenclawRiskSnapshotWhereUniqueInput
    update?: XOR<XOR<OpenclawRiskSnapshotUpdateToOneWithWhereWithoutIssuesInput, OpenclawRiskSnapshotUpdateWithoutIssuesInput>, OpenclawRiskSnapshotUncheckedUpdateWithoutIssuesInput>
  }

  export type SecurityResearchPaperCreateNestedManyWithoutSnapshotInput = {
    create?: XOR<SecurityResearchPaperCreateWithoutSnapshotInput, SecurityResearchPaperUncheckedCreateWithoutSnapshotInput> | SecurityResearchPaperCreateWithoutSnapshotInput[] | SecurityResearchPaperUncheckedCreateWithoutSnapshotInput[]
    connectOrCreate?: SecurityResearchPaperCreateOrConnectWithoutSnapshotInput | SecurityResearchPaperCreateOrConnectWithoutSnapshotInput[]
    createMany?: SecurityResearchPaperCreateManySnapshotInputEnvelope
    connect?: SecurityResearchPaperWhereUniqueInput | SecurityResearchPaperWhereUniqueInput[]
  }

  export type SecurityResearchPaperUncheckedCreateNestedManyWithoutSnapshotInput = {
    create?: XOR<SecurityResearchPaperCreateWithoutSnapshotInput, SecurityResearchPaperUncheckedCreateWithoutSnapshotInput> | SecurityResearchPaperCreateWithoutSnapshotInput[] | SecurityResearchPaperUncheckedCreateWithoutSnapshotInput[]
    connectOrCreate?: SecurityResearchPaperCreateOrConnectWithoutSnapshotInput | SecurityResearchPaperCreateOrConnectWithoutSnapshotInput[]
    createMany?: SecurityResearchPaperCreateManySnapshotInputEnvelope
    connect?: SecurityResearchPaperWhereUniqueInput | SecurityResearchPaperWhereUniqueInput[]
  }

  export type SecurityResearchPaperUpdateManyWithoutSnapshotNestedInput = {
    create?: XOR<SecurityResearchPaperCreateWithoutSnapshotInput, SecurityResearchPaperUncheckedCreateWithoutSnapshotInput> | SecurityResearchPaperCreateWithoutSnapshotInput[] | SecurityResearchPaperUncheckedCreateWithoutSnapshotInput[]
    connectOrCreate?: SecurityResearchPaperCreateOrConnectWithoutSnapshotInput | SecurityResearchPaperCreateOrConnectWithoutSnapshotInput[]
    upsert?: SecurityResearchPaperUpsertWithWhereUniqueWithoutSnapshotInput | SecurityResearchPaperUpsertWithWhereUniqueWithoutSnapshotInput[]
    createMany?: SecurityResearchPaperCreateManySnapshotInputEnvelope
    set?: SecurityResearchPaperWhereUniqueInput | SecurityResearchPaperWhereUniqueInput[]
    disconnect?: SecurityResearchPaperWhereUniqueInput | SecurityResearchPaperWhereUniqueInput[]
    delete?: SecurityResearchPaperWhereUniqueInput | SecurityResearchPaperWhereUniqueInput[]
    connect?: SecurityResearchPaperWhereUniqueInput | SecurityResearchPaperWhereUniqueInput[]
    update?: SecurityResearchPaperUpdateWithWhereUniqueWithoutSnapshotInput | SecurityResearchPaperUpdateWithWhereUniqueWithoutSnapshotInput[]
    updateMany?: SecurityResearchPaperUpdateManyWithWhereWithoutSnapshotInput | SecurityResearchPaperUpdateManyWithWhereWithoutSnapshotInput[]
    deleteMany?: SecurityResearchPaperScalarWhereInput | SecurityResearchPaperScalarWhereInput[]
  }

  export type SecurityResearchPaperUncheckedUpdateManyWithoutSnapshotNestedInput = {
    create?: XOR<SecurityResearchPaperCreateWithoutSnapshotInput, SecurityResearchPaperUncheckedCreateWithoutSnapshotInput> | SecurityResearchPaperCreateWithoutSnapshotInput[] | SecurityResearchPaperUncheckedCreateWithoutSnapshotInput[]
    connectOrCreate?: SecurityResearchPaperCreateOrConnectWithoutSnapshotInput | SecurityResearchPaperCreateOrConnectWithoutSnapshotInput[]
    upsert?: SecurityResearchPaperUpsertWithWhereUniqueWithoutSnapshotInput | SecurityResearchPaperUpsertWithWhereUniqueWithoutSnapshotInput[]
    createMany?: SecurityResearchPaperCreateManySnapshotInputEnvelope
    set?: SecurityResearchPaperWhereUniqueInput | SecurityResearchPaperWhereUniqueInput[]
    disconnect?: SecurityResearchPaperWhereUniqueInput | SecurityResearchPaperWhereUniqueInput[]
    delete?: SecurityResearchPaperWhereUniqueInput | SecurityResearchPaperWhereUniqueInput[]
    connect?: SecurityResearchPaperWhereUniqueInput | SecurityResearchPaperWhereUniqueInput[]
    update?: SecurityResearchPaperUpdateWithWhereUniqueWithoutSnapshotInput | SecurityResearchPaperUpdateWithWhereUniqueWithoutSnapshotInput[]
    updateMany?: SecurityResearchPaperUpdateManyWithWhereWithoutSnapshotInput | SecurityResearchPaperUpdateManyWithWhereWithoutSnapshotInput[]
    deleteMany?: SecurityResearchPaperScalarWhereInput | SecurityResearchPaperScalarWhereInput[]
  }

  export type SecurityResearchSnapshotCreateNestedOneWithoutPapersInput = {
    create?: XOR<SecurityResearchSnapshotCreateWithoutPapersInput, SecurityResearchSnapshotUncheckedCreateWithoutPapersInput>
    connectOrCreate?: SecurityResearchSnapshotCreateOrConnectWithoutPapersInput
    connect?: SecurityResearchSnapshotWhereUniqueInput
  }

  export type FloatFieldUpdateOperationsInput = {
    set?: number
    increment?: number
    decrement?: number
    multiply?: number
    divide?: number
  }

  export type BoolFieldUpdateOperationsInput = {
    set?: boolean
  }

  export type SecurityResearchSnapshotUpdateOneRequiredWithoutPapersNestedInput = {
    create?: XOR<SecurityResearchSnapshotCreateWithoutPapersInput, SecurityResearchSnapshotUncheckedCreateWithoutPapersInput>
    connectOrCreate?: SecurityResearchSnapshotCreateOrConnectWithoutPapersInput
    upsert?: SecurityResearchSnapshotUpsertWithoutPapersInput
    connect?: SecurityResearchSnapshotWhereUniqueInput
    update?: XOR<XOR<SecurityResearchSnapshotUpdateToOneWithWhereWithoutPapersInput, SecurityResearchSnapshotUpdateWithoutPapersInput>, SecurityResearchSnapshotUncheckedUpdateWithoutPapersInput>
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

  export type NestedStringNullableFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableFilter<$PrismaModel> | string | null
  }

  export type NestedDateTimeNullableFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableFilter<$PrismaModel> | Date | string | null
  }

  export type NestedStringNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: string | StringFieldRefInput<$PrismaModel> | null
    in?: string[] | null
    notIn?: string[] | null
    lt?: string | StringFieldRefInput<$PrismaModel>
    lte?: string | StringFieldRefInput<$PrismaModel>
    gt?: string | StringFieldRefInput<$PrismaModel>
    gte?: string | StringFieldRefInput<$PrismaModel>
    contains?: string | StringFieldRefInput<$PrismaModel>
    startsWith?: string | StringFieldRefInput<$PrismaModel>
    endsWith?: string | StringFieldRefInput<$PrismaModel>
    search?: string
    not?: NestedStringNullableWithAggregatesFilter<$PrismaModel> | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedStringNullableFilter<$PrismaModel>
    _max?: NestedStringNullableFilter<$PrismaModel>
  }

  export type NestedDateTimeNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: Date | string | DateTimeFieldRefInput<$PrismaModel> | null
    in?: Date[] | string[] | null
    notIn?: Date[] | string[] | null
    lt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    lte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gt?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    gte?: Date | string | DateTimeFieldRefInput<$PrismaModel>
    not?: NestedDateTimeNullableWithAggregatesFilter<$PrismaModel> | Date | string | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _min?: NestedDateTimeNullableFilter<$PrismaModel>
    _max?: NestedDateTimeNullableFilter<$PrismaModel>
  }
  export type NestedJsonFilter<$PrismaModel = never> =
    | PatchUndefined<
        Either<Required<NestedJsonFilterBase<$PrismaModel>>, Exclude<keyof Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>,
        Required<NestedJsonFilterBase<$PrismaModel>>
      >
    | OptionalFlat<Omit<Required<NestedJsonFilterBase<$PrismaModel>>, 'path'>>

  export type NestedJsonFilterBase<$PrismaModel = never> = {
    equals?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
    path?: string
    mode?: QueryMode | EnumQueryModeFieldRefInput<$PrismaModel>
    string_contains?: string | StringFieldRefInput<$PrismaModel>
    string_starts_with?: string | StringFieldRefInput<$PrismaModel>
    string_ends_with?: string | StringFieldRefInput<$PrismaModel>
    array_starts_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_ends_with?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    array_contains?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | null
    lt?: InputJsonValue
    lte?: InputJsonValue
    gt?: InputJsonValue
    gte?: InputJsonValue
    not?: InputJsonValue | JsonFieldRefInput<$PrismaModel> | JsonNullValueFilter
  }

  export type NestedFloatNullableWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel> | null
    in?: number[] | null
    notIn?: number[] | null
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatNullableWithAggregatesFilter<$PrismaModel> | number | null
    _count?: NestedIntNullableFilter<$PrismaModel>
    _avg?: NestedFloatNullableFilter<$PrismaModel>
    _sum?: NestedFloatNullableFilter<$PrismaModel>
    _min?: NestedFloatNullableFilter<$PrismaModel>
    _max?: NestedFloatNullableFilter<$PrismaModel>
  }

  export type NestedBoolFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolFilter<$PrismaModel> | boolean
  }

  export type NestedFloatWithAggregatesFilter<$PrismaModel = never> = {
    equals?: number | FloatFieldRefInput<$PrismaModel>
    in?: number[]
    notIn?: number[]
    lt?: number | FloatFieldRefInput<$PrismaModel>
    lte?: number | FloatFieldRefInput<$PrismaModel>
    gt?: number | FloatFieldRefInput<$PrismaModel>
    gte?: number | FloatFieldRefInput<$PrismaModel>
    not?: NestedFloatWithAggregatesFilter<$PrismaModel> | number
    _count?: NestedIntFilter<$PrismaModel>
    _avg?: NestedFloatFilter<$PrismaModel>
    _sum?: NestedFloatFilter<$PrismaModel>
    _min?: NestedFloatFilter<$PrismaModel>
    _max?: NestedFloatFilter<$PrismaModel>
  }

  export type NestedBoolWithAggregatesFilter<$PrismaModel = never> = {
    equals?: boolean | BooleanFieldRefInput<$PrismaModel>
    not?: NestedBoolWithAggregatesFilter<$PrismaModel> | boolean
    _count?: NestedIntFilter<$PrismaModel>
    _min?: NestedBoolFilter<$PrismaModel>
    _max?: NestedBoolFilter<$PrismaModel>
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

  export type OpenclawRiskIssueCreateWithoutSnapshotInput = {
    id?: bigint | number
    canonicalId: string
    issueId: string
    title: string
    summary: string
    description: string
    sourcePrimary: string
    sourceType?: string
    sourceSearch: string
    sourceLabels: JsonNullValueInput | InputJsonValue
    sources: JsonNullValueInput | InputJsonValue
    githubIds: JsonNullValueInput | InputJsonValue
    cveIds: JsonNullValueInput | InputJsonValue
    projectScope?: string
    venue?: string | null
    authors: JsonNullValueInput | InputJsonValue
    severity: string
    score?: number | null
    cvssVector?: string | null
    cwes: JsonNullValueInput | InputJsonValue
    affectedRange?: string | null
    fixedVersion?: string | null
    latestStableVersion?: string | null
    fixStatus: string
    fixLabel: string
    fixReason: string
    issueUrl?: string | null
    repoUrl?: string | null
    referenceUrls: JsonNullValueInput | InputJsonValue
    tags: JsonNullValueInput | InputJsonValue
    status?: string
    relevanceScore?: number | null
    publishedAt?: Date | string | null
    sourceUpdatedAt?: Date | string | null
    rawData: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type OpenclawRiskIssueUncheckedCreateWithoutSnapshotInput = {
    id?: bigint | number
    canonicalId: string
    issueId: string
    title: string
    summary: string
    description: string
    sourcePrimary: string
    sourceType?: string
    sourceSearch: string
    sourceLabels: JsonNullValueInput | InputJsonValue
    sources: JsonNullValueInput | InputJsonValue
    githubIds: JsonNullValueInput | InputJsonValue
    cveIds: JsonNullValueInput | InputJsonValue
    projectScope?: string
    venue?: string | null
    authors: JsonNullValueInput | InputJsonValue
    severity: string
    score?: number | null
    cvssVector?: string | null
    cwes: JsonNullValueInput | InputJsonValue
    affectedRange?: string | null
    fixedVersion?: string | null
    latestStableVersion?: string | null
    fixStatus: string
    fixLabel: string
    fixReason: string
    issueUrl?: string | null
    repoUrl?: string | null
    referenceUrls: JsonNullValueInput | InputJsonValue
    tags: JsonNullValueInput | InputJsonValue
    status?: string
    relevanceScore?: number | null
    publishedAt?: Date | string | null
    sourceUpdatedAt?: Date | string | null
    rawData: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type OpenclawRiskIssueCreateOrConnectWithoutSnapshotInput = {
    where: OpenclawRiskIssueWhereUniqueInput
    create: XOR<OpenclawRiskIssueCreateWithoutSnapshotInput, OpenclawRiskIssueUncheckedCreateWithoutSnapshotInput>
  }

  export type OpenclawRiskIssueCreateManySnapshotInputEnvelope = {
    data: OpenclawRiskIssueCreateManySnapshotInput | OpenclawRiskIssueCreateManySnapshotInput[]
    skipDuplicates?: boolean
  }

  export type OpenclawRiskIssueUpsertWithWhereUniqueWithoutSnapshotInput = {
    where: OpenclawRiskIssueWhereUniqueInput
    update: XOR<OpenclawRiskIssueUpdateWithoutSnapshotInput, OpenclawRiskIssueUncheckedUpdateWithoutSnapshotInput>
    create: XOR<OpenclawRiskIssueCreateWithoutSnapshotInput, OpenclawRiskIssueUncheckedCreateWithoutSnapshotInput>
  }

  export type OpenclawRiskIssueUpdateWithWhereUniqueWithoutSnapshotInput = {
    where: OpenclawRiskIssueWhereUniqueInput
    data: XOR<OpenclawRiskIssueUpdateWithoutSnapshotInput, OpenclawRiskIssueUncheckedUpdateWithoutSnapshotInput>
  }

  export type OpenclawRiskIssueUpdateManyWithWhereWithoutSnapshotInput = {
    where: OpenclawRiskIssueScalarWhereInput
    data: XOR<OpenclawRiskIssueUpdateManyMutationInput, OpenclawRiskIssueUncheckedUpdateManyWithoutSnapshotInput>
  }

  export type OpenclawRiskIssueScalarWhereInput = {
    AND?: OpenclawRiskIssueScalarWhereInput | OpenclawRiskIssueScalarWhereInput[]
    OR?: OpenclawRiskIssueScalarWhereInput[]
    NOT?: OpenclawRiskIssueScalarWhereInput | OpenclawRiskIssueScalarWhereInput[]
    id?: BigIntFilter<"OpenclawRiskIssue"> | bigint | number
    snapshotId?: IntFilter<"OpenclawRiskIssue"> | number
    canonicalId?: StringFilter<"OpenclawRiskIssue"> | string
    issueId?: StringFilter<"OpenclawRiskIssue"> | string
    title?: StringFilter<"OpenclawRiskIssue"> | string
    summary?: StringFilter<"OpenclawRiskIssue"> | string
    description?: StringFilter<"OpenclawRiskIssue"> | string
    sourcePrimary?: StringFilter<"OpenclawRiskIssue"> | string
    sourceType?: StringFilter<"OpenclawRiskIssue"> | string
    sourceSearch?: StringFilter<"OpenclawRiskIssue"> | string
    sourceLabels?: JsonFilter<"OpenclawRiskIssue">
    sources?: JsonFilter<"OpenclawRiskIssue">
    githubIds?: JsonFilter<"OpenclawRiskIssue">
    cveIds?: JsonFilter<"OpenclawRiskIssue">
    projectScope?: StringFilter<"OpenclawRiskIssue"> | string
    venue?: StringNullableFilter<"OpenclawRiskIssue"> | string | null
    authors?: JsonFilter<"OpenclawRiskIssue">
    severity?: StringFilter<"OpenclawRiskIssue"> | string
    score?: FloatNullableFilter<"OpenclawRiskIssue"> | number | null
    cvssVector?: StringNullableFilter<"OpenclawRiskIssue"> | string | null
    cwes?: JsonFilter<"OpenclawRiskIssue">
    affectedRange?: StringNullableFilter<"OpenclawRiskIssue"> | string | null
    fixedVersion?: StringNullableFilter<"OpenclawRiskIssue"> | string | null
    latestStableVersion?: StringNullableFilter<"OpenclawRiskIssue"> | string | null
    fixStatus?: StringFilter<"OpenclawRiskIssue"> | string
    fixLabel?: StringFilter<"OpenclawRiskIssue"> | string
    fixReason?: StringFilter<"OpenclawRiskIssue"> | string
    issueUrl?: StringNullableFilter<"OpenclawRiskIssue"> | string | null
    repoUrl?: StringNullableFilter<"OpenclawRiskIssue"> | string | null
    referenceUrls?: JsonFilter<"OpenclawRiskIssue">
    tags?: JsonFilter<"OpenclawRiskIssue">
    status?: StringFilter<"OpenclawRiskIssue"> | string
    relevanceScore?: FloatNullableFilter<"OpenclawRiskIssue"> | number | null
    publishedAt?: DateTimeNullableFilter<"OpenclawRiskIssue"> | Date | string | null
    sourceUpdatedAt?: DateTimeNullableFilter<"OpenclawRiskIssue"> | Date | string | null
    rawData?: JsonFilter<"OpenclawRiskIssue">
    createdAt?: DateTimeFilter<"OpenclawRiskIssue"> | Date | string
  }

  export type OpenclawRiskSnapshotCreateWithoutIssuesInput = {
    snapshotKey: string
    triggerSource?: string
    status?: string
    latestStableTag?: string | null
    latestStableVersion?: string | null
    latestStableUrl?: string | null
    latestStablePublishedAt?: Date | string | null
    totalIssues?: number
    githubAdvisories?: number
    nvdCves?: number
    officialAdvisoryCount?: number
    cveRecordCount?: number
    conferencePaperCount?: number
    preprintCount?: number
    researchCount?: number
    newsCount?: number
    criticalCount?: number
    highRiskCount?: number
    fixedCount?: number
    unfixedCount?: number
    unknownCount?: number
    fixProgressPercent?: number
    sourceMeta: JsonNullValueInput | InputJsonValue
    cacheDir?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OpenclawRiskSnapshotUncheckedCreateWithoutIssuesInput = {
    id?: number
    snapshotKey: string
    triggerSource?: string
    status?: string
    latestStableTag?: string | null
    latestStableVersion?: string | null
    latestStableUrl?: string | null
    latestStablePublishedAt?: Date | string | null
    totalIssues?: number
    githubAdvisories?: number
    nvdCves?: number
    officialAdvisoryCount?: number
    cveRecordCount?: number
    conferencePaperCount?: number
    preprintCount?: number
    researchCount?: number
    newsCount?: number
    criticalCount?: number
    highRiskCount?: number
    fixedCount?: number
    unfixedCount?: number
    unknownCount?: number
    fixProgressPercent?: number
    sourceMeta: JsonNullValueInput | InputJsonValue
    cacheDir?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type OpenclawRiskSnapshotCreateOrConnectWithoutIssuesInput = {
    where: OpenclawRiskSnapshotWhereUniqueInput
    create: XOR<OpenclawRiskSnapshotCreateWithoutIssuesInput, OpenclawRiskSnapshotUncheckedCreateWithoutIssuesInput>
  }

  export type OpenclawRiskSnapshotUpsertWithoutIssuesInput = {
    update: XOR<OpenclawRiskSnapshotUpdateWithoutIssuesInput, OpenclawRiskSnapshotUncheckedUpdateWithoutIssuesInput>
    create: XOR<OpenclawRiskSnapshotCreateWithoutIssuesInput, OpenclawRiskSnapshotUncheckedCreateWithoutIssuesInput>
    where?: OpenclawRiskSnapshotWhereInput
  }

  export type OpenclawRiskSnapshotUpdateToOneWithWhereWithoutIssuesInput = {
    where?: OpenclawRiskSnapshotWhereInput
    data: XOR<OpenclawRiskSnapshotUpdateWithoutIssuesInput, OpenclawRiskSnapshotUncheckedUpdateWithoutIssuesInput>
  }

  export type OpenclawRiskSnapshotUpdateWithoutIssuesInput = {
    snapshotKey?: StringFieldUpdateOperationsInput | string
    triggerSource?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    latestStableTag?: NullableStringFieldUpdateOperationsInput | string | null
    latestStableVersion?: NullableStringFieldUpdateOperationsInput | string | null
    latestStableUrl?: NullableStringFieldUpdateOperationsInput | string | null
    latestStablePublishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totalIssues?: IntFieldUpdateOperationsInput | number
    githubAdvisories?: IntFieldUpdateOperationsInput | number
    nvdCves?: IntFieldUpdateOperationsInput | number
    officialAdvisoryCount?: IntFieldUpdateOperationsInput | number
    cveRecordCount?: IntFieldUpdateOperationsInput | number
    conferencePaperCount?: IntFieldUpdateOperationsInput | number
    preprintCount?: IntFieldUpdateOperationsInput | number
    researchCount?: IntFieldUpdateOperationsInput | number
    newsCount?: IntFieldUpdateOperationsInput | number
    criticalCount?: IntFieldUpdateOperationsInput | number
    highRiskCount?: IntFieldUpdateOperationsInput | number
    fixedCount?: IntFieldUpdateOperationsInput | number
    unfixedCount?: IntFieldUpdateOperationsInput | number
    unknownCount?: IntFieldUpdateOperationsInput | number
    fixProgressPercent?: IntFieldUpdateOperationsInput | number
    sourceMeta?: JsonNullValueInput | InputJsonValue
    cacheDir?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OpenclawRiskSnapshotUncheckedUpdateWithoutIssuesInput = {
    id?: IntFieldUpdateOperationsInput | number
    snapshotKey?: StringFieldUpdateOperationsInput | string
    triggerSource?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    latestStableTag?: NullableStringFieldUpdateOperationsInput | string | null
    latestStableVersion?: NullableStringFieldUpdateOperationsInput | string | null
    latestStableUrl?: NullableStringFieldUpdateOperationsInput | string | null
    latestStablePublishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    totalIssues?: IntFieldUpdateOperationsInput | number
    githubAdvisories?: IntFieldUpdateOperationsInput | number
    nvdCves?: IntFieldUpdateOperationsInput | number
    officialAdvisoryCount?: IntFieldUpdateOperationsInput | number
    cveRecordCount?: IntFieldUpdateOperationsInput | number
    conferencePaperCount?: IntFieldUpdateOperationsInput | number
    preprintCount?: IntFieldUpdateOperationsInput | number
    researchCount?: IntFieldUpdateOperationsInput | number
    newsCount?: IntFieldUpdateOperationsInput | number
    criticalCount?: IntFieldUpdateOperationsInput | number
    highRiskCount?: IntFieldUpdateOperationsInput | number
    fixedCount?: IntFieldUpdateOperationsInput | number
    unfixedCount?: IntFieldUpdateOperationsInput | number
    unknownCount?: IntFieldUpdateOperationsInput | number
    fixProgressPercent?: IntFieldUpdateOperationsInput | number
    sourceMeta?: JsonNullValueInput | InputJsonValue
    cacheDir?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SecurityResearchPaperCreateWithoutSnapshotInput = {
    id?: bigint | number
    canonicalId: string
    title: string
    normalizedTitle: string
    sourceType: string
    projectScope: string
    venue: string
    sourcePrimary: string
    sourceSearch: string
    abstractOrSummary: string
    tags: JsonNullValueInput | InputJsonValue
    sourceUrl?: string | null
    authors: JsonNullValueInput | InputJsonValue
    externalIds: JsonNullValueInput | InputJsonValue
    relevanceScore?: number
    isTopVenue?: boolean
    publishedAt?: Date | string | null
    status?: string
    rawData: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type SecurityResearchPaperUncheckedCreateWithoutSnapshotInput = {
    id?: bigint | number
    canonicalId: string
    title: string
    normalizedTitle: string
    sourceType: string
    projectScope: string
    venue: string
    sourcePrimary: string
    sourceSearch: string
    abstractOrSummary: string
    tags: JsonNullValueInput | InputJsonValue
    sourceUrl?: string | null
    authors: JsonNullValueInput | InputJsonValue
    externalIds: JsonNullValueInput | InputJsonValue
    relevanceScore?: number
    isTopVenue?: boolean
    publishedAt?: Date | string | null
    status?: string
    rawData: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type SecurityResearchPaperCreateOrConnectWithoutSnapshotInput = {
    where: SecurityResearchPaperWhereUniqueInput
    create: XOR<SecurityResearchPaperCreateWithoutSnapshotInput, SecurityResearchPaperUncheckedCreateWithoutSnapshotInput>
  }

  export type SecurityResearchPaperCreateManySnapshotInputEnvelope = {
    data: SecurityResearchPaperCreateManySnapshotInput | SecurityResearchPaperCreateManySnapshotInput[]
    skipDuplicates?: boolean
  }

  export type SecurityResearchPaperUpsertWithWhereUniqueWithoutSnapshotInput = {
    where: SecurityResearchPaperWhereUniqueInput
    update: XOR<SecurityResearchPaperUpdateWithoutSnapshotInput, SecurityResearchPaperUncheckedUpdateWithoutSnapshotInput>
    create: XOR<SecurityResearchPaperCreateWithoutSnapshotInput, SecurityResearchPaperUncheckedCreateWithoutSnapshotInput>
  }

  export type SecurityResearchPaperUpdateWithWhereUniqueWithoutSnapshotInput = {
    where: SecurityResearchPaperWhereUniqueInput
    data: XOR<SecurityResearchPaperUpdateWithoutSnapshotInput, SecurityResearchPaperUncheckedUpdateWithoutSnapshotInput>
  }

  export type SecurityResearchPaperUpdateManyWithWhereWithoutSnapshotInput = {
    where: SecurityResearchPaperScalarWhereInput
    data: XOR<SecurityResearchPaperUpdateManyMutationInput, SecurityResearchPaperUncheckedUpdateManyWithoutSnapshotInput>
  }

  export type SecurityResearchPaperScalarWhereInput = {
    AND?: SecurityResearchPaperScalarWhereInput | SecurityResearchPaperScalarWhereInput[]
    OR?: SecurityResearchPaperScalarWhereInput[]
    NOT?: SecurityResearchPaperScalarWhereInput | SecurityResearchPaperScalarWhereInput[]
    id?: BigIntFilter<"SecurityResearchPaper"> | bigint | number
    snapshotId?: IntFilter<"SecurityResearchPaper"> | number
    canonicalId?: StringFilter<"SecurityResearchPaper"> | string
    title?: StringFilter<"SecurityResearchPaper"> | string
    normalizedTitle?: StringFilter<"SecurityResearchPaper"> | string
    sourceType?: StringFilter<"SecurityResearchPaper"> | string
    projectScope?: StringFilter<"SecurityResearchPaper"> | string
    venue?: StringFilter<"SecurityResearchPaper"> | string
    sourcePrimary?: StringFilter<"SecurityResearchPaper"> | string
    sourceSearch?: StringFilter<"SecurityResearchPaper"> | string
    abstractOrSummary?: StringFilter<"SecurityResearchPaper"> | string
    tags?: JsonFilter<"SecurityResearchPaper">
    sourceUrl?: StringNullableFilter<"SecurityResearchPaper"> | string | null
    authors?: JsonFilter<"SecurityResearchPaper">
    externalIds?: JsonFilter<"SecurityResearchPaper">
    relevanceScore?: FloatFilter<"SecurityResearchPaper"> | number
    isTopVenue?: BoolFilter<"SecurityResearchPaper"> | boolean
    publishedAt?: DateTimeNullableFilter<"SecurityResearchPaper"> | Date | string | null
    status?: StringFilter<"SecurityResearchPaper"> | string
    rawData?: JsonFilter<"SecurityResearchPaper">
    createdAt?: DateTimeFilter<"SecurityResearchPaper"> | Date | string
  }

  export type SecurityResearchSnapshotCreateWithoutPapersInput = {
    snapshotKey: string
    triggerSource?: string
    status?: string
    totalPapers?: number
    conferencePaperCount?: number
    preprintCount?: number
    openclawCount?: number
    clawCount?: number
    skillCount?: number
    agentCount?: number
    pluginCount?: number
    sourceMeta: JsonNullValueInput | InputJsonValue
    cacheDir?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SecurityResearchSnapshotUncheckedCreateWithoutPapersInput = {
    id?: number
    snapshotKey: string
    triggerSource?: string
    status?: string
    totalPapers?: number
    conferencePaperCount?: number
    preprintCount?: number
    openclawCount?: number
    clawCount?: number
    skillCount?: number
    agentCount?: number
    pluginCount?: number
    sourceMeta: JsonNullValueInput | InputJsonValue
    cacheDir?: string | null
    createdAt?: Date | string
    updatedAt?: Date | string
  }

  export type SecurityResearchSnapshotCreateOrConnectWithoutPapersInput = {
    where: SecurityResearchSnapshotWhereUniqueInput
    create: XOR<SecurityResearchSnapshotCreateWithoutPapersInput, SecurityResearchSnapshotUncheckedCreateWithoutPapersInput>
  }

  export type SecurityResearchSnapshotUpsertWithoutPapersInput = {
    update: XOR<SecurityResearchSnapshotUpdateWithoutPapersInput, SecurityResearchSnapshotUncheckedUpdateWithoutPapersInput>
    create: XOR<SecurityResearchSnapshotCreateWithoutPapersInput, SecurityResearchSnapshotUncheckedCreateWithoutPapersInput>
    where?: SecurityResearchSnapshotWhereInput
  }

  export type SecurityResearchSnapshotUpdateToOneWithWhereWithoutPapersInput = {
    where?: SecurityResearchSnapshotWhereInput
    data: XOR<SecurityResearchSnapshotUpdateWithoutPapersInput, SecurityResearchSnapshotUncheckedUpdateWithoutPapersInput>
  }

  export type SecurityResearchSnapshotUpdateWithoutPapersInput = {
    snapshotKey?: StringFieldUpdateOperationsInput | string
    triggerSource?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    totalPapers?: IntFieldUpdateOperationsInput | number
    conferencePaperCount?: IntFieldUpdateOperationsInput | number
    preprintCount?: IntFieldUpdateOperationsInput | number
    openclawCount?: IntFieldUpdateOperationsInput | number
    clawCount?: IntFieldUpdateOperationsInput | number
    skillCount?: IntFieldUpdateOperationsInput | number
    agentCount?: IntFieldUpdateOperationsInput | number
    pluginCount?: IntFieldUpdateOperationsInput | number
    sourceMeta?: JsonNullValueInput | InputJsonValue
    cacheDir?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SecurityResearchSnapshotUncheckedUpdateWithoutPapersInput = {
    id?: IntFieldUpdateOperationsInput | number
    snapshotKey?: StringFieldUpdateOperationsInput | string
    triggerSource?: StringFieldUpdateOperationsInput | string
    status?: StringFieldUpdateOperationsInput | string
    totalPapers?: IntFieldUpdateOperationsInput | number
    conferencePaperCount?: IntFieldUpdateOperationsInput | number
    preprintCount?: IntFieldUpdateOperationsInput | number
    openclawCount?: IntFieldUpdateOperationsInput | number
    clawCount?: IntFieldUpdateOperationsInput | number
    skillCount?: IntFieldUpdateOperationsInput | number
    agentCount?: IntFieldUpdateOperationsInput | number
    pluginCount?: IntFieldUpdateOperationsInput | number
    sourceMeta?: JsonNullValueInput | InputJsonValue
    cacheDir?: NullableStringFieldUpdateOperationsInput | string | null
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
    updatedAt?: DateTimeFieldUpdateOperationsInput | Date | string
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

  export type OpenclawRiskIssueCreateManySnapshotInput = {
    id?: bigint | number
    canonicalId: string
    issueId: string
    title: string
    summary: string
    description: string
    sourcePrimary: string
    sourceType?: string
    sourceSearch: string
    sourceLabels: JsonNullValueInput | InputJsonValue
    sources: JsonNullValueInput | InputJsonValue
    githubIds: JsonNullValueInput | InputJsonValue
    cveIds: JsonNullValueInput | InputJsonValue
    projectScope?: string
    venue?: string | null
    authors: JsonNullValueInput | InputJsonValue
    severity: string
    score?: number | null
    cvssVector?: string | null
    cwes: JsonNullValueInput | InputJsonValue
    affectedRange?: string | null
    fixedVersion?: string | null
    latestStableVersion?: string | null
    fixStatus: string
    fixLabel: string
    fixReason: string
    issueUrl?: string | null
    repoUrl?: string | null
    referenceUrls: JsonNullValueInput | InputJsonValue
    tags: JsonNullValueInput | InputJsonValue
    status?: string
    relevanceScore?: number | null
    publishedAt?: Date | string | null
    sourceUpdatedAt?: Date | string | null
    rawData: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type OpenclawRiskIssueUpdateWithoutSnapshotInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    canonicalId?: StringFieldUpdateOperationsInput | string
    issueId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    summary?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    sourcePrimary?: StringFieldUpdateOperationsInput | string
    sourceType?: StringFieldUpdateOperationsInput | string
    sourceSearch?: StringFieldUpdateOperationsInput | string
    sourceLabels?: JsonNullValueInput | InputJsonValue
    sources?: JsonNullValueInput | InputJsonValue
    githubIds?: JsonNullValueInput | InputJsonValue
    cveIds?: JsonNullValueInput | InputJsonValue
    projectScope?: StringFieldUpdateOperationsInput | string
    venue?: NullableStringFieldUpdateOperationsInput | string | null
    authors?: JsonNullValueInput | InputJsonValue
    severity?: StringFieldUpdateOperationsInput | string
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    cvssVector?: NullableStringFieldUpdateOperationsInput | string | null
    cwes?: JsonNullValueInput | InputJsonValue
    affectedRange?: NullableStringFieldUpdateOperationsInput | string | null
    fixedVersion?: NullableStringFieldUpdateOperationsInput | string | null
    latestStableVersion?: NullableStringFieldUpdateOperationsInput | string | null
    fixStatus?: StringFieldUpdateOperationsInput | string
    fixLabel?: StringFieldUpdateOperationsInput | string
    fixReason?: StringFieldUpdateOperationsInput | string
    issueUrl?: NullableStringFieldUpdateOperationsInput | string | null
    repoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    referenceUrls?: JsonNullValueInput | InputJsonValue
    tags?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    relevanceScore?: NullableFloatFieldUpdateOperationsInput | number | null
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sourceUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rawData?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OpenclawRiskIssueUncheckedUpdateWithoutSnapshotInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    canonicalId?: StringFieldUpdateOperationsInput | string
    issueId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    summary?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    sourcePrimary?: StringFieldUpdateOperationsInput | string
    sourceType?: StringFieldUpdateOperationsInput | string
    sourceSearch?: StringFieldUpdateOperationsInput | string
    sourceLabels?: JsonNullValueInput | InputJsonValue
    sources?: JsonNullValueInput | InputJsonValue
    githubIds?: JsonNullValueInput | InputJsonValue
    cveIds?: JsonNullValueInput | InputJsonValue
    projectScope?: StringFieldUpdateOperationsInput | string
    venue?: NullableStringFieldUpdateOperationsInput | string | null
    authors?: JsonNullValueInput | InputJsonValue
    severity?: StringFieldUpdateOperationsInput | string
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    cvssVector?: NullableStringFieldUpdateOperationsInput | string | null
    cwes?: JsonNullValueInput | InputJsonValue
    affectedRange?: NullableStringFieldUpdateOperationsInput | string | null
    fixedVersion?: NullableStringFieldUpdateOperationsInput | string | null
    latestStableVersion?: NullableStringFieldUpdateOperationsInput | string | null
    fixStatus?: StringFieldUpdateOperationsInput | string
    fixLabel?: StringFieldUpdateOperationsInput | string
    fixReason?: StringFieldUpdateOperationsInput | string
    issueUrl?: NullableStringFieldUpdateOperationsInput | string | null
    repoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    referenceUrls?: JsonNullValueInput | InputJsonValue
    tags?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    relevanceScore?: NullableFloatFieldUpdateOperationsInput | number | null
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sourceUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rawData?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type OpenclawRiskIssueUncheckedUpdateManyWithoutSnapshotInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    canonicalId?: StringFieldUpdateOperationsInput | string
    issueId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    summary?: StringFieldUpdateOperationsInput | string
    description?: StringFieldUpdateOperationsInput | string
    sourcePrimary?: StringFieldUpdateOperationsInput | string
    sourceType?: StringFieldUpdateOperationsInput | string
    sourceSearch?: StringFieldUpdateOperationsInput | string
    sourceLabels?: JsonNullValueInput | InputJsonValue
    sources?: JsonNullValueInput | InputJsonValue
    githubIds?: JsonNullValueInput | InputJsonValue
    cveIds?: JsonNullValueInput | InputJsonValue
    projectScope?: StringFieldUpdateOperationsInput | string
    venue?: NullableStringFieldUpdateOperationsInput | string | null
    authors?: JsonNullValueInput | InputJsonValue
    severity?: StringFieldUpdateOperationsInput | string
    score?: NullableFloatFieldUpdateOperationsInput | number | null
    cvssVector?: NullableStringFieldUpdateOperationsInput | string | null
    cwes?: JsonNullValueInput | InputJsonValue
    affectedRange?: NullableStringFieldUpdateOperationsInput | string | null
    fixedVersion?: NullableStringFieldUpdateOperationsInput | string | null
    latestStableVersion?: NullableStringFieldUpdateOperationsInput | string | null
    fixStatus?: StringFieldUpdateOperationsInput | string
    fixLabel?: StringFieldUpdateOperationsInput | string
    fixReason?: StringFieldUpdateOperationsInput | string
    issueUrl?: NullableStringFieldUpdateOperationsInput | string | null
    repoUrl?: NullableStringFieldUpdateOperationsInput | string | null
    referenceUrls?: JsonNullValueInput | InputJsonValue
    tags?: JsonNullValueInput | InputJsonValue
    status?: StringFieldUpdateOperationsInput | string
    relevanceScore?: NullableFloatFieldUpdateOperationsInput | number | null
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    sourceUpdatedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    rawData?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SecurityResearchPaperCreateManySnapshotInput = {
    id?: bigint | number
    canonicalId: string
    title: string
    normalizedTitle: string
    sourceType: string
    projectScope: string
    venue: string
    sourcePrimary: string
    sourceSearch: string
    abstractOrSummary: string
    tags: JsonNullValueInput | InputJsonValue
    sourceUrl?: string | null
    authors: JsonNullValueInput | InputJsonValue
    externalIds: JsonNullValueInput | InputJsonValue
    relevanceScore?: number
    isTopVenue?: boolean
    publishedAt?: Date | string | null
    status?: string
    rawData: JsonNullValueInput | InputJsonValue
    createdAt?: Date | string
  }

  export type SecurityResearchPaperUpdateWithoutSnapshotInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    canonicalId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    normalizedTitle?: StringFieldUpdateOperationsInput | string
    sourceType?: StringFieldUpdateOperationsInput | string
    projectScope?: StringFieldUpdateOperationsInput | string
    venue?: StringFieldUpdateOperationsInput | string
    sourcePrimary?: StringFieldUpdateOperationsInput | string
    sourceSearch?: StringFieldUpdateOperationsInput | string
    abstractOrSummary?: StringFieldUpdateOperationsInput | string
    tags?: JsonNullValueInput | InputJsonValue
    sourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    authors?: JsonNullValueInput | InputJsonValue
    externalIds?: JsonNullValueInput | InputJsonValue
    relevanceScore?: FloatFieldUpdateOperationsInput | number
    isTopVenue?: BoolFieldUpdateOperationsInput | boolean
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    rawData?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SecurityResearchPaperUncheckedUpdateWithoutSnapshotInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    canonicalId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    normalizedTitle?: StringFieldUpdateOperationsInput | string
    sourceType?: StringFieldUpdateOperationsInput | string
    projectScope?: StringFieldUpdateOperationsInput | string
    venue?: StringFieldUpdateOperationsInput | string
    sourcePrimary?: StringFieldUpdateOperationsInput | string
    sourceSearch?: StringFieldUpdateOperationsInput | string
    abstractOrSummary?: StringFieldUpdateOperationsInput | string
    tags?: JsonNullValueInput | InputJsonValue
    sourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    authors?: JsonNullValueInput | InputJsonValue
    externalIds?: JsonNullValueInput | InputJsonValue
    relevanceScore?: FloatFieldUpdateOperationsInput | number
    isTopVenue?: BoolFieldUpdateOperationsInput | boolean
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    rawData?: JsonNullValueInput | InputJsonValue
    createdAt?: DateTimeFieldUpdateOperationsInput | Date | string
  }

  export type SecurityResearchPaperUncheckedUpdateManyWithoutSnapshotInput = {
    id?: BigIntFieldUpdateOperationsInput | bigint | number
    canonicalId?: StringFieldUpdateOperationsInput | string
    title?: StringFieldUpdateOperationsInput | string
    normalizedTitle?: StringFieldUpdateOperationsInput | string
    sourceType?: StringFieldUpdateOperationsInput | string
    projectScope?: StringFieldUpdateOperationsInput | string
    venue?: StringFieldUpdateOperationsInput | string
    sourcePrimary?: StringFieldUpdateOperationsInput | string
    sourceSearch?: StringFieldUpdateOperationsInput | string
    abstractOrSummary?: StringFieldUpdateOperationsInput | string
    tags?: JsonNullValueInput | InputJsonValue
    sourceUrl?: NullableStringFieldUpdateOperationsInput | string | null
    authors?: JsonNullValueInput | InputJsonValue
    externalIds?: JsonNullValueInput | InputJsonValue
    relevanceScore?: FloatFieldUpdateOperationsInput | number
    isTopVenue?: BoolFieldUpdateOperationsInput | boolean
    publishedAt?: NullableDateTimeFieldUpdateOperationsInput | Date | string | null
    status?: StringFieldUpdateOperationsInput | string
    rawData?: JsonNullValueInput | InputJsonValue
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