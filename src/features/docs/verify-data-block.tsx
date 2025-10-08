import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const flow1 = `[Client -> Server] ① パスキー検証オプションの作成
{
  rpId: 'localhost',
  challenge: 'THIS_IS_CHALLENGE_STRING',
  allowCredentials: [
    {
      id: 'THIS_IS_CREDENTIAL_ID',
      transports: [Array],
      type: 'public-key'
    }
  ],
  timeout: 60000,
  userVerification: 'preferred',
  extensions: undefined
}`
const flow2 = `[Client -> Server] ② パスキー検証リクエスト
{
  id: 'THIS_IS_CREDENTIAL_ID',
  rawId: 'THIS_IS_CREDENTIAL_ID',
  response: {
    authenticatorData: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    clientDataJSON: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    signature: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    userHandle: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
  },
  type: 'public-key',
  clientExtensionResults: {},
  authenticatorAttachment: 'platform'
}`
const flow3 = `[Server -> Server] ③ パスキー検証検証結果
{
  newCounter: 0,
  credentialID: 'THIS_IS_CREDENTIAL_ID',
  userVerified: true,
  credentialDeviceType: 'singleDevice',
  credentialBackedUp: false,
  authenticatorExtensionResults: undefined,
  origin: 'http://localhost:3168',
  rpID: 'localhost'
}`
const flow4 = `[Server -> Server] ④ パスキーのカウンタを更新
{
  userID: '0',
  webAuthnUserID: '0',
  id: 'THIS_IS_CREDENTIAL_ID',
  publicKey: Uint8Array(77) [
		...77 items
  ],
  counter: 0,
  transports: [ 'internal' ],
  deviceType: 'singleDevice',
  backedUp: false
}`

export function VerifyDataBlock() {
	return (
		<Card className="min-h-60 bg-transparent mb-80">
			<CardContent>
				<Tabs defaultValue="flow1">
					<TabsList>
						<TabsTrigger value="flow1">フロー①</TabsTrigger>
						<TabsTrigger value="flow2">フロー②</TabsTrigger>
						<TabsTrigger value="flow3">フロー③</TabsTrigger>
						<TabsTrigger value="flow4">フロー④</TabsTrigger>
					</TabsList>
					<TabsContent value="flow1" className="mt-4">
						<pre className="bg-muted rounded-sm p-4">{flow1}</pre>
					</TabsContent>
					<TabsContent value="flow2" className="mt-4">
						<pre className="bg-muted rounded-sm p-4">{flow2}</pre>
					</TabsContent>
					<TabsContent value="flow3" className="mt-4">
						<pre className="bg-muted rounded-sm p-4">{flow3}</pre>
					</TabsContent>
					<TabsContent value="flow4" className="mt-4">
						<pre className="bg-muted rounded-sm p-4">{flow4}</pre>
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	)
}
