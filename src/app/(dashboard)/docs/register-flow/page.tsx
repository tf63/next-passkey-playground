import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { DashboardTitle } from "@/features/dashboard/title/title"
import { RegisterDataBlock } from "@/features/docs/register-data-block"

export default function RegisterFlowPage() {
	return (
		<>
			<DashboardTitle title="パスキー登録フロー" />
			<Card className="bg-white">
				<CardContent className="bg-white flex justify-center items-center h-[480px] relative">
					<Image src="/passkey-registration.png" alt="register flow" className="object-contain" fill={true} />
				</CardContent>
			</Card>
			<RegisterDataBlock />
		</>
	)
}
