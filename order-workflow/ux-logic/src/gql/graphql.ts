/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** The `AWSDateTime` scalar type provided by AWS AppSync, represents a valid ***extended*** [ISO 8601 DateTime](https://en.wikipedia.org/wiki/ISO_8601#Combined_date_and_time_representations) string. In other words, this scalar type accepts datetime strings of the form `YYYY-MM-DDThh:mm:ss.SSSZ`.  The scalar can also accept "negative years" of the form `-YYYY` which correspond to years before `0000`. For example, "**-2017-01-01T00:00Z**" and "**-9999-01-01T00:00Z**" are both valid datetime strings.  The field after the two digit seconds field is a nanoseconds field. It can accept between 1 and 9 digits. So, for example, "**1970-01-01T12:00:00.2Z**", "**1970-01-01T12:00:00.277Z**" and "**1970-01-01T12:00:00.123456789Z**" are all valid datetime strings.  The seconds and nanoseconds fields are optional (the seconds field must be specified if the nanoseconds field is to be used).  The [time zone offset](https://en.wikipedia.org/wiki/ISO_8601#Time_zone_designators) is compulsory for this scalar. The time zone offset must either be `Z` (representing the UTC time zone) or be in the format `±hh:mm:ss`. The seconds field in the timezone offset will be considered valid even though it is not part of the ISO 8601 standard. */
  AWSDateTime: { input: any; output: any; }
  /** The `AWSJSON` scalar type provided by AWS AppSync, represents a JSON string that complies with [RFC 8259](https://tools.ietf.org/html/rfc8259).  Maps like "**{\\"upvotes\\": 10}**", lists like "**[1,2,3]**", and scalar values like "**\\"AWSJSON example string\\"**", "**1**", and "**true**" are accepted as valid JSON and will automatically be parsed and loaded in the resolver mapping templates as Maps, Lists, or Scalar values rather than as the literal input strings.  Invalid JSON strings like "**{a: 1}**", "**{'a': 1}**" and "**Unquoted string**" will throw GraphQL validation errors. */
  AWSJSON: { input: any; output: any; }
};

export type CreateOrderInput = {
  OrderDateTime: Scalars['AWSDateTime']['input'];
  OrderTransaction: Scalars['AWSJSON']['input'];
  Status: Scalars['String']['input'];
  UserID: Scalars['ID']['input'];
};

export type CreateOrderStateViewInput = {
  Datetime: Scalars['String']['input'];
  OrderID: Scalars['String']['input'];
  OrderItem: Scalars['AWSJSON']['input'];
  Status: Scalars['String']['input'];
  UserID: Scalars['String']['input'];
};

export type DeleteOrderStateViewInput = {
  OrderID: Scalars['String']['input'];
  UserID: Scalars['String']['input'];
};

export type ModelSizeInput = {
  between?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  eq?: InputMaybe<Scalars['Int']['input']>;
  ge?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  le?: InputMaybe<Scalars['Int']['input']>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  ne?: InputMaybe<Scalars['Int']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createOrder?: Maybe<Order>;
  createOrderStateView?: Maybe<OrderStateView>;
  deleteOrderStateView?: Maybe<OrderStateView>;
  updateOrder?: Maybe<Order>;
  updateOrderStateView?: Maybe<OrderStateView>;
};


export type MutationCreateOrderArgs = {
  input: CreateOrderInput;
};


export type MutationCreateOrderStateViewArgs = {
  input: CreateOrderStateViewInput;
};


export type MutationDeleteOrderStateViewArgs = {
  input: DeleteOrderStateViewInput;
};


export type MutationUpdateOrderArgs = {
  input: UpdateOrderInput;
};


export type MutationUpdateOrderStateViewArgs = {
  input: UpdateOrderStateViewInput;
};

export type Order = {
  __typename?: 'Order';
  OrderDateTime: Scalars['AWSDateTime']['output'];
  OrderTransaction: Scalars['AWSJSON']['output'];
  Status: Scalars['String']['output'];
  UserID: Scalars['ID']['output'];
};

export type OrderConnection = {
  __typename?: 'OrderConnection';
  items?: Maybe<Array<Maybe<Order>>>;
  nextToken?: Maybe<Scalars['String']['output']>;
};

export type OrderStateView = {
  __typename?: 'OrderStateView';
  Datetime: Scalars['String']['output'];
  OrderID: Scalars['String']['output'];
  OrderItem: Scalars['AWSJSON']['output'];
  Status: Scalars['String']['output'];
  UserID: Scalars['String']['output'];
};

export type OrderStateViewConnection = {
  __typename?: 'OrderStateViewConnection';
  items?: Maybe<Array<Maybe<OrderStateView>>>;
  nextToken?: Maybe<Scalars['String']['output']>;
};

export type Query = {
  __typename?: 'Query';
  getOrder?: Maybe<Order>;
  getOrderStateView?: Maybe<OrderStateView>;
  getOrdersByUserID?: Maybe<Array<Maybe<OrderStateView>>>;
  listOrderStateViews?: Maybe<OrderStateViewConnection>;
  listOrders?: Maybe<OrderConnection>;
  queryOrderStateViewsByStatusIndex?: Maybe<OrderStateViewConnection>;
  queryOrdersByUserIDStatusIndex?: Maybe<OrderConnection>;
};


export type QueryGetOrderArgs = {
  OrderDateTime: Scalars['AWSDateTime']['input'];
  UserID: Scalars['ID']['input'];
};


export type QueryGetOrderStateViewArgs = {
  OrderID: Scalars['String']['input'];
  UserID: Scalars['String']['input'];
};


export type QueryGetOrdersByUserIdArgs = {
  UserID: Scalars['ID']['input'];
};


export type QueryListOrderStateViewsArgs = {
  filter?: InputMaybe<TableOrderStateViewFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
};


export type QueryListOrdersArgs = {
  filter?: InputMaybe<TableOrderFilterInput>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  nextToken?: InputMaybe<Scalars['String']['input']>;
};


export type QueryQueryOrderStateViewsByStatusIndexArgs = {
  UserID: Scalars['String']['input'];
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryQueryOrdersByUserIdStatusIndexArgs = {
  UserID: Scalars['ID']['input'];
  after?: InputMaybe<Scalars['String']['input']>;
  first?: InputMaybe<Scalars['Int']['input']>;
};

export type Subscription = {
  __typename?: 'Subscription';
  onCreateOrder?: Maybe<Order>;
  onCreateOrderStateView?: Maybe<OrderStateView>;
  onDeleteOrderStateView?: Maybe<OrderStateView>;
  onUpdateOrder?: Maybe<Order>;
  onUpdateOrderStateView?: Maybe<OrderStateView>;
};


export type SubscriptionOnCreateOrderArgs = {
  OrderDateTime?: InputMaybe<Scalars['AWSDateTime']['input']>;
  OrderTransaction?: InputMaybe<Scalars['AWSJSON']['input']>;
  Status?: InputMaybe<Scalars['String']['input']>;
  UserID?: InputMaybe<Scalars['ID']['input']>;
};


export type SubscriptionOnCreateOrderStateViewArgs = {
  OrderID?: InputMaybe<Scalars['String']['input']>;
  OrderItem?: InputMaybe<Scalars['AWSJSON']['input']>;
  Status?: InputMaybe<Scalars['String']['input']>;
  UserID?: InputMaybe<Scalars['String']['input']>;
};


export type SubscriptionOnDeleteOrderStateViewArgs = {
  OrderID?: InputMaybe<Scalars['String']['input']>;
  OrderItem?: InputMaybe<Scalars['AWSJSON']['input']>;
  Status?: InputMaybe<Scalars['String']['input']>;
  UserID?: InputMaybe<Scalars['String']['input']>;
};


export type SubscriptionOnUpdateOrderArgs = {
  OrderDateTime?: InputMaybe<Scalars['AWSDateTime']['input']>;
  OrderTransaction?: InputMaybe<Scalars['AWSJSON']['input']>;
  Status?: InputMaybe<Scalars['String']['input']>;
  UserID?: InputMaybe<Scalars['ID']['input']>;
};


export type SubscriptionOnUpdateOrderStateViewArgs = {
  OrderID?: InputMaybe<Scalars['String']['input']>;
  OrderItem?: InputMaybe<Scalars['AWSJSON']['input']>;
  Status?: InputMaybe<Scalars['String']['input']>;
  UserID?: InputMaybe<Scalars['String']['input']>;
};

export type TableBooleanFilterInput = {
  attributeExists?: InputMaybe<Scalars['Boolean']['input']>;
  eq?: InputMaybe<Scalars['Boolean']['input']>;
  ne?: InputMaybe<Scalars['Boolean']['input']>;
};

export type TableFloatFilterInput = {
  attributeExists?: InputMaybe<Scalars['Boolean']['input']>;
  between?: InputMaybe<Array<InputMaybe<Scalars['Float']['input']>>>;
  eq?: InputMaybe<Scalars['Float']['input']>;
  ge?: InputMaybe<Scalars['Float']['input']>;
  gt?: InputMaybe<Scalars['Float']['input']>;
  le?: InputMaybe<Scalars['Float']['input']>;
  lt?: InputMaybe<Scalars['Float']['input']>;
  ne?: InputMaybe<Scalars['Float']['input']>;
};

export type TableIdFilterInput = {
  attributeExists?: InputMaybe<Scalars['Boolean']['input']>;
  beginsWith?: InputMaybe<Scalars['ID']['input']>;
  between?: InputMaybe<Array<InputMaybe<Scalars['ID']['input']>>>;
  contains?: InputMaybe<Scalars['ID']['input']>;
  eq?: InputMaybe<Scalars['ID']['input']>;
  ge?: InputMaybe<Scalars['ID']['input']>;
  gt?: InputMaybe<Scalars['ID']['input']>;
  le?: InputMaybe<Scalars['ID']['input']>;
  lt?: InputMaybe<Scalars['ID']['input']>;
  ne?: InputMaybe<Scalars['ID']['input']>;
  notContains?: InputMaybe<Scalars['ID']['input']>;
  size?: InputMaybe<ModelSizeInput>;
};

export type TableIntFilterInput = {
  attributeExists?: InputMaybe<Scalars['Boolean']['input']>;
  between?: InputMaybe<Array<InputMaybe<Scalars['Int']['input']>>>;
  eq?: InputMaybe<Scalars['Int']['input']>;
  ge?: InputMaybe<Scalars['Int']['input']>;
  gt?: InputMaybe<Scalars['Int']['input']>;
  le?: InputMaybe<Scalars['Int']['input']>;
  lt?: InputMaybe<Scalars['Int']['input']>;
  ne?: InputMaybe<Scalars['Int']['input']>;
};

export type TableOrderFilterInput = {
  OrderDateTime?: InputMaybe<TableStringFilterInput>;
  Status?: InputMaybe<TableStringFilterInput>;
  UserID?: InputMaybe<TableIdFilterInput>;
};

export type TableOrderStateViewFilterInput = {
  OrderID?: InputMaybe<TableStringFilterInput>;
  Status?: InputMaybe<TableStringFilterInput>;
  UserID?: InputMaybe<TableStringFilterInput>;
};

export type TableStringFilterInput = {
  attributeExists?: InputMaybe<Scalars['Boolean']['input']>;
  beginsWith?: InputMaybe<Scalars['String']['input']>;
  between?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  contains?: InputMaybe<Scalars['String']['input']>;
  eq?: InputMaybe<Scalars['String']['input']>;
  ge?: InputMaybe<Scalars['String']['input']>;
  gt?: InputMaybe<Scalars['String']['input']>;
  le?: InputMaybe<Scalars['String']['input']>;
  lt?: InputMaybe<Scalars['String']['input']>;
  ne?: InputMaybe<Scalars['String']['input']>;
  notContains?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<ModelSizeInput>;
};

export type UpdateOrderInput = {
  OrderDateTime: Scalars['AWSDateTime']['input'];
  OrderTransaction?: InputMaybe<Scalars['AWSJSON']['input']>;
  Status?: InputMaybe<Scalars['String']['input']>;
  UserID: Scalars['ID']['input'];
};

export type UpdateOrderStateViewInput = {
  Datetime?: InputMaybe<Scalars['String']['input']>;
  OrderID: Scalars['String']['input'];
  OrderItem?: InputMaybe<Scalars['AWSJSON']['input']>;
  Status?: InputMaybe<Scalars['String']['input']>;
  UserID: Scalars['String']['input'];
};

export type CreateOrderMutationVariables = Exact<{
  input: CreateOrderInput;
}>;


export type CreateOrderMutation = { __typename?: 'Mutation', createOrder?: { __typename?: 'Order', OrderDateTime: any, OrderTransaction: any, Status: string, UserID: string } | null };

export type ListAllOrdersByUserQueryVariables = Exact<{
  UserID: Scalars['ID']['input'];
}>;


export type ListAllOrdersByUserQuery = { __typename?: 'Query', getOrdersByUserID?: Array<{ __typename?: 'OrderStateView', UserID: string, OrderID: string, OrderItem: any, Status: string, Datetime: string } | null> | null };


export const CreateOrderDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"CreateOrder"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"input"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"CreateOrderInput"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"createOrder"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"input"},"value":{"kind":"Variable","name":{"kind":"Name","value":"input"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"OrderDateTime"}},{"kind":"Field","name":{"kind":"Name","value":"OrderTransaction"}},{"kind":"Field","name":{"kind":"Name","value":"Status"}},{"kind":"Field","name":{"kind":"Name","value":"UserID"}}]}}]}}]} as unknown as DocumentNode<CreateOrderMutation, CreateOrderMutationVariables>;
export const ListAllOrdersByUserDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"ListAllOrdersByUser"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"UserID"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"getOrdersByUserID"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"UserID"},"value":{"kind":"Variable","name":{"kind":"Name","value":"UserID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"UserID"}},{"kind":"Field","name":{"kind":"Name","value":"OrderID"}},{"kind":"Field","name":{"kind":"Name","value":"OrderItem"}},{"kind":"Field","name":{"kind":"Name","value":"Status"}},{"kind":"Field","name":{"kind":"Name","value":"Datetime"}}]}}]}}]} as unknown as DocumentNode<ListAllOrdersByUserQuery, ListAllOrdersByUserQueryVariables>;