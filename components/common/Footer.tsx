import { useRouter } from 'next/router';

//A footer component that can be used across pages
function Footer({ children, showBackButton }) {
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
							className="fill-current w-4 h-4 mr-2"
							xmlns="http://www.w3.org/2000/svg"
							viewBox="0 0 20 20"
						>
							<path
								fillRule="evenodd"
								d="M7.707 14.707a1 1 0 010-1.414L10.586 10 7.707 7.121a1 1 0 111.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
								clipRule="evenodd"
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