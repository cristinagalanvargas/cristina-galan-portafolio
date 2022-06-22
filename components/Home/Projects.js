// // import { motion, AnimatePresence } from 'framer-motion';

// // import Card from '@/components/Project/Card';

// // export default function Projects({ displayedProjects, onCursor }) {
// //   return (
// //     <section>
// //       <motion.ul
// //         layout
// //         role="list"
// //         className="tw-section-separator grid gap-y-12 lg:grid-cols-2 lg:gap-24"
// //       >
// //         <AnimatePresence>
// //           {displayedProjects &&
// //             displayedProjects.map((project, idx) => (
// //               <motion.div
// //                 key={idx}
// //                 onMouseEnter={() => onCursor('tw-hovered')}
// //                 onMouseLeave={onCursor}
// //                 layout
// //                 initial={{ opacity: 0 }}
// //                 animate={{ opacity: 1 }}
// //                 exit={{ opacity: 0 }}
// //               >
// //                 <Card project={project.node} />
// //               </motion.div>
// //             ))}
// //         </AnimatePresence>
// //       </motion.ul>
// //     </section>
// //   );
// // }

import React from 'react';

const Projects = () => {
    return <div>Projects</div>;
};

export default Projects;
