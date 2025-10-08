import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { DashboardTitle } from "@/features/dashboard/title/title"
import { VerifyDataBlock } from "@/features/docs/verify-data-block"

export default function VerifyFlowPage() {
	return (
		<>
			<DashboardTitle title="パスキー検証フロー" />
			<Card className="bg-white">
				<CardContent className="bg-white flex justify-center items-center h-[480px] relative">
					<Image src="/passkey-verification.png" alt="verify flow" className="object-contain" fill={true} />
				</CardContent>
			</Card>
			<VerifyDataBlock />
		</>
	)
}
