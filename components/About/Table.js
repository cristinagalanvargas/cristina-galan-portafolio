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
                            className="tw-transition flex border-b border-neutral-200 dark:border-neutral-900"
                            key={row.id}
                        >
                            {row.year && (
                                <td className="about-row w-1/12">{row.year}</td>
                            )}

                            {row.description && (
                                <td className="about-row w-7/12">
                                    {row.description}
                                </td>
                            )}

                            {row.institution && (
                                <td className="about-row w-4/12">
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
