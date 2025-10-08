import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const flow1 = `[Server -> Client] ① パスキー登録オプションの作成
{
  challenge: 'THIS_IS_CHALLENGE_STRING',
  rp: { name: 'SimpleWebAuthn Example', id: 'localhost' },
  user: {
    id: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
    name: 'user@gmail.com',
    displayName: ''
  },
  pubKeyCredParams: [
    { alg: -8, type: 'public-key' },
    { alg: -7, type: 'public-key' },
    { alg: -257, type: 'public-key' }
  ],
  timeout: 60000,
  attestation: 'none',
  excludeCredentials: [],
  authenticatorSelection: {
    residentKey: 'preferred',
    userVerification: 'preferred',
    authenticatorAttachment: 'platform',
    requireResidentKey: false
  },
  extensions: { credProps: true },
  hints: []
}`
const flow2 = `[Client -> Server] ② パスキーの登録リクエスト
{
  id: 'THIS_IS_CREDENTIAL_ID',
  rawId: 'THIS_IS_CREDENTIAL_ID',
  response: {
    attestationObject: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    clientDataJSON: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    transports: [ 'internal' ],
    publicKeyAlgorithm: -7,
    publicKey: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    authenticatorData: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX'
  },
  type: 'public-key',
  clientExtensionResults: { credProps: { rk: true } },
  authenticatorAttachment: 'platform'
}`
const flow3 = `[Server -> Server] ③ パスキー登録検証結果
{
  fmt: 'none',
  aaguid: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',
  credentialType: 'public-key',
  credential: {
    id: 'THIS_IS_CREDENTIAL_ID',
    publicKey: Uint8Array(77) [
			...77 items
    ],
    counter: 0,
    transports: [ 'internal' ]
  },
  attestationObject: Uint8Array(194) [
		...194 items
  ],
  userVerified: true,
  credentialDeviceType: 'singleDevice',
  credentialBackedUp: false,
  origin: 'http://localhost:3168',
  rpID: 'localhost',
  authenticatorExtensionResults: undefined
}`
const flow4 = `[Server -> Server] ④ パスキーを保存
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

export function RegisterDataBlock() {
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
