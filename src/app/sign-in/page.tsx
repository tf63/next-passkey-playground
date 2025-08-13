'use client'

// TODO: card切り出してuse clientは回避しておく
import { Accordion } from '@radix-ui/react-accordion'
import { startAuthentication, startRegistration } from '@simplewebauthn/browser'
import { Key } from 'lucide-react'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

import {
    getAuthenticationOptions,
    getRegistrationOptions,
    verifyAuthentication,
    verifyRegistration,
} from '@/app/actions/auth'
import { AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function PasskeySimpleForm() {
    const [email, setEmail] = useState('')
    const [isPending, startTransition] = useTransition()
    const [cred, setCred] = useState<string>('')

    const handleRegister = () => {
        if (!email) {
            toast.error('メールアドレスを入力してください')
            return
        }

        startTransition(async () => {
            try {
                const { options } = await getRegistrationOptions(email)
                const cred = await startRegistration({ optionsJSON: options })
                setCred(JSON.stringify(cred, null, 2))
                const { verified, message: verificationMessage } = await verifyRegistration(email, cred)

                if (verified) {
                    toast.success('登録成功', { description: verificationMessage })
                } else {
                    toast.error('登録失敗', { description: verificationMessage })
                }
            } catch {
                toast.error('エラーが発生しました')
            }
        })
    }

    const handleSignIn = () => {
        if (!email) {
            toast.error('メールアドレスを入力してください')
            return
        }

        startTransition(async () => {
            try {
                const { options, message: optionMessage } = await getAuthenticationOptions(email)
                if (!options) {
                    toast.error('認証オプションの取得に失敗しました', { description: optionMessage })
                    return
                }

                const cred = await startAuthentication({ optionsJSON: options })
                setCred(JSON.stringify(cred, null, 2))

                const { verified, message: verificationMessage } = await verifyAuthentication(email, cred)

                if (verified) {
                    toast.success('認証成功', { description: verificationMessage })
                } else {
                    toast.error('認証失敗', { description: verificationMessage })
                }
            } catch {
                toast.error('エラーが発生しました')
            }
        })
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center">
            <Card className="mx-auto w-lg border-none px-4 py-6">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Key className="h-5 w-5" />
                        Passkey Sample
                    </CardTitle>
                    <CardDescription>simplewebauthnを使ったパスキー登録・検証UI</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">メールアドレス</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                autoComplete="username webauthn"
                                required={true}
                                autoFocus={true}
                            />
                        </div>
                        <div className="flex gap-2">
                            <Button type="button" onClick={handleRegister} disabled={isPending}>
                                パスキー登録
                            </Button>
                            <Button type="button" onClick={handleSignIn} disabled={isPending}>
                                パスキー検証
                            </Button>
                        </div>

                        <Accordion type="single" collapsible={true}>
                            <AccordionItem value="credentials">
                                <AccordionTrigger>認証情報</AccordionTrigger>
                                <AccordionContent>
                                    {cred && (
                                        <pre className="bg-muted overflow-x-scroll rounded-md p-4 text-sm">{cred}</pre>
                                    )}
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
