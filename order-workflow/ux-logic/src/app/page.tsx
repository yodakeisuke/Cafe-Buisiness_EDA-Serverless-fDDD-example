import Link from "next/link"
import { Button } from "@/app/_components/ui/button"

export default function Home() {
	return (
		<div className="hero min-h-screen bg-base-200 grid place-items-center">
			<div className="hero-content flex-col lg:flex-row-reverse">
				<div>
					<h1 className="text-5xl font-bold">Reactive Coffee App</h1>
					<p className="py-6">
						demo 3 factor order app
					</p>
            <Link href="/order">
              <Button variant="outline">Get Started</Button>
            </Link>
				</div>
			</div>
		</div>
	)
}
