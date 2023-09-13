'use client';
import { motion, AnimatePresence } from 'framer-motion';
import Footer from './common/Footer';

/*
Animated transition when a page appears. Also includes a footer component.
Taken from https://github.com/realstoman/nextjs-firebase-auth/tree/main
*/

export const PageWrapper = ({ children }: { children: any }) => {
	return (
		<>
			<AnimatePresence>
				<motion.div
					initial={{
						opacity: 0,
						y: 0,
					}}
					animate={{
						opacity: 1,
						y: 0,
					}}
					exit={{ opacity: 0, y: 0 }}
					transition={{ delay: 0.3 }}
					className="min-h-screen flex justify-center items-center"
				>
					<div>
						{children}
						<Footer />
					</div>
				</motion.div>
			</AnimatePresence>
		</>
	);
};