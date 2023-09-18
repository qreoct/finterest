import { useRouter } from 'next/router';

//A footer component that can be used across pages
function Footer({ children, showBackButton }: { children: React.ReactNode, showBackButton: Boolean }) {
	const router = useRouter();
	return (
		<>
			<div className="flex items-center justify-center mt-14 ">
				<a
					href="#"
					target="__blank"
					className="text-gray-700 hover:text-gray-900 cursor-pointer underline text-xl"
				>
					This is a footer.
				</a>

				<br />


			</div>

			<main>{children}</main>

			<div className="flex items-center justify-center mt-14 ">
				{showBackButton && (
					<button
						onClick={() => router.back()}
						className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							className="h-6 w-6 mr-2"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor"
						>
							<path
								strokeLinecap="round"
								strokeLinejoin="round"
								strokeWidth="2"
								d="M15 19l-7-7 7-7"
							/>
						</svg>
						<span>Back</span>
					</button>
				)}
			</div>
		</>
	);
}

export default Footer;