import { motion } from 'framer-motion';

export default function ProjectsList({ children }) {
    return (
        <section className="mx-auto mt-12 max-w-7xl md:mt-16 lg:mt-24">
            <motion.ul
                layout
                role="list"
                className="grid grid-cols-2 gap-y-12 md:gap-x-12 md:gap-y-16 lg:gap-x-16 lg:gap-y-20"
            >
                {children}
            </motion.ul>
        </section>
    );
}
