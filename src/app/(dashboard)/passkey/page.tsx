import { Fingerprint, User } from 'lucide-react'

import { Card, CardContent } from '@/components/ui/card'
import { DashboardTitle } from '@/features/dashboard/title/title'

export default function Page() {
    return (
        <>
            <DashboardTitle title="パスキー" />

            <Card>
                <CardContent>
                    <div className="flex items-center gap-2 text-lg font-bold">
                        <Fingerprint className="h-5 w-5" />
                        パスキー登録
                    </div>

                    <div className="flex items-center gap-2 text-lg font-bold">
                        <User className="h-5 w-5" />
                        パスキー検証
                    </div>
                </CardContent>
            </Card>
        </>
    )
}
