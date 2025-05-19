// components/RegisterShopCard.tsx
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Sparkles } from "lucide-react"

export default function RegisterShop() {
	return (
		<div className="bg-gradient-to-br from-[#fff0dc] to-[#ffc8b6] flex items-center justify-center p-6">
			<Card className="w-full max-w-md shadow-2xl backdrop-blur-sm bg-white/70 rounded-2xl border-none relative overflow-hidden">
				<div className="absolute inset-0 bg-gradient-to-br from-pink-200 via-transparent to-yellow-100 opacity-30 animate-pulse" />
				<CardContent className="relative z-10 p-8">
					<div className="text-center mb-6">
						<Sparkles className="w-10 h-10 mx-auto animate-bounce text-orange-500" />
						<h2 className="text-2xl font-bold text-gray-800">Đăng ký cửa hàng của bạn</h2>
						<p className="text-sm text-gray-500">Bắt đầu hành trình kinh doanh ngay hôm nay!</p>
					</div>
					<div className="space-y-4">
						<div>
							<Label htmlFor="shopName" className="text-gray-700 mb-3">Tên Shop</Label>
							<Input
								id="shopName"
								placeholder="VD: Quán Trà Sữa Cute"
								className="mt-1 bg-white/60 border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 rounded-lg shadow-sm"
							/>
						</div>
						<Button
							type="submit"
							className="form-element w-full h-10 sm:h-12 bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white font-medium rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
						>
							Đăng ký
						</Button>
					</div>
					
				</CardContent>
			</Card>
		</div>
	)
}
