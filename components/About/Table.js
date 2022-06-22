import { motion } from 'framer-motion';

import { tableVariants } from '@/utils/framer';

export default function Table({ rows }) {
    return (
        <>
            <motion.table
                className="w-full origin-top"
                intial="initial"
                animate="animate"
                variants={tableVariants}
            >
                <tbody>
                    {rows.map((row) => (
                        <tr
                            className="flex border-b-2 border-gray-100 dark:border-gray-900 tw-transition"
                            key={row.id}
                        >
                            {row.year && (
                                <td className="w-3/12 about-row">{row.year}</td>
                            )}

                            {row.description && (
                                <td className="w-5/12 about-row">
                                    {row.description}
                                </td>
                            )}

                            {row.institution && (
                                <td className="w-4/12 about-row">
                                    {row.institution}
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </motion.table>
        </>
    );
}
