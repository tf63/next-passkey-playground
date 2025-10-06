// NOTE: 実際には環境変数から読み込む、今回は環境構築をスキップするためにベタ書き
/**
 * Human-readable title for your website
 */
export const RP_NAME = "SimpleWebAuthn Example"
/**
 * A unique identifier for your website. 'localhost' is okay for
 * local dev
 */
export const RP_ID = "localhost"
/**
 * The URL at which registrations and authentications should occur.
 * 'http://localhost' and 'http://localhost:PORT' are also valid.
 * Do NOT include any trailing /
 */
export const ORIGIN = `http://${RP_ID}:3168`
