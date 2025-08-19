'use client'

import '@simplewebauthn/browser'
import 'react'
import '@/app/actions/auth'
import '@/components/ui/accordion'

import { Card } from '@/components/ui/card'
import { DashboardTitle } from '@/features/dashboard/title/title'

export default function Page() {
    return (
        <>
            <DashboardTitle title="タイトル" />
            <Card className="p-5">
                <pre className="overflow-x-auto">
                    {`{
  "id": "ifi832jQU5_9xl2LIgq0jFT8yE4UNNhmzTVjetd3ZCI",
  "rawId": "ifi832jQU5_9xl2LIgq0jFT8yE4UNNhmzTVjetd3ZCI",
  "response": {
    "attestationObject": "o2NmbXRkbm9uZWdhdHRTdG10oGhhdXRoRGF0YVikSZYN5YgOjGh0NBcPZHZgW4_krrmihjLHmVzzuoMdl2NFAAAAALU5dmZIhaprzr_lImKkOaIAIIn4vN9o0FOf_cZdiyIKtIxU_MhOFDTYZs01Y3rXd2QipQECAyYgASFYIAIoSATGuosSugBzf1Hl2JizwV3X3Bccucx5KJ_5vZF_IlggE9opkEDAIBfMdhwn3lwJSOQA7X6IykkixxFeSF4BNRw",
    "clientDataJSON": "eyJ0eXBlIjoid2ViYXV0aG4uY3JlYXRlIiwiY2hhbGxlbmdlIjoidTZIMGp2OGZqTTBoY2NOLWRYMFlnUEZoZ2RHeTdER3pHbEtiSHl6dEE5dyIsIm9yaWdpbiI6Imh0dHA6Ly9sb2NhbGhvc3Q6MzAwMSIsImNyb3NzT3JpZ2luIjpmYWxzZX0",
    "transports": [
      "internal"
    ],
    "publicKeyAlgorithm": -7,
    "publicKey": "MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEAihIBMa6ixK6AHN_UeXYmLPBXdfcFxy5zHkon_m9kX8T2imQQMAgF8x2HCfeXAlI5ADtfojKSSLHEV5IXgE1HA",
    "authenticatorData": "SZYN5YgOjGh0NBcPZHZgW4_krrmihjLHmVzzuoMdl2NFAAAAALU5dmZIhaprzr_lImKkOaIAIIn4vN9o0FOf_cZdiyIKtIxU_MhOFDTYZs01Y3rXd2QipQECAyYgASFYIAIoSATGuosSugBzf1Hl2JizwV3X3Bccucx5KJ_5vZF_IlggE9opkEDAIBfMdhwn3lwJSOQA7X6IykkixxFeSF4BNRw"
  },
  "type": "public-key",
  "clientExtensionResults": {
    "credProps": {
      "rk": true
    }
  },
  "authenticatorAttachment": "platform"
}`}
                </pre>
            </Card>
        </>
    )
}
