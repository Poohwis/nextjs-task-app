import { WORKSPACE_URL } from "./lib/constant"

/**An array of routes that are accessible to the public 
 * These routes do not require authentication
 * @type {string[]}
*/
export const publicRoutes = [
    "/"
]

export const authRouths = [
    "/login", "/register"
]

/**The prefix for API authentication routes 
 * Routes that start with this prefix are used for API authentication purpose
 * @type {string}
*/
export const apiAuthPrefix = "/api/auth"

/**The default redirect path after logging in
 * @type {string}
*/
export const DEFAULT_LOGIN_REDIRECT = WORKSPACE_URL