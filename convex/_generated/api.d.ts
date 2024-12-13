/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as codeExecutions from "../codeExecutions.js";
import type * as comments from "../comments.js";
import type * as http from "../http.js";
import type * as lemonSqueezy from "../lemonSqueezy.js";
import type * as marketplace from "../marketplace.js";
import type * as migrations from "../migrations.js";
import type * as newsletter from "../newsletter.js";
import type * as snippets from "../snippets.js";
import type * as templateFavorites from "../templateFavorites.js";
import type * as templates from "../templates.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  codeExecutions: typeof codeExecutions;
  comments: typeof comments;
  http: typeof http;
  lemonSqueezy: typeof lemonSqueezy;
  marketplace: typeof marketplace;
  migrations: typeof migrations;
  newsletter: typeof newsletter;
  snippets: typeof snippets;
  templateFavorites: typeof templateFavorites;
  templates: typeof templates;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
