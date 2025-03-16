'use client'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faBowlFood, faPlane } from '@fortawesome/free-solid-svg-icons';
import { motion } from 'motion/react';

const features = [
    { icon: faBowlFood, title: 'Lunch', description: 'Create ad-hoc lunch groups.' },
    { icon: faPlane, title: 'Customizable', description: 'Meet new people while traveling.' },
    { icon: faUsers, title: 'Connection', description: 'Connect with like-minded individuals.' }
];

export default function HomeFeaturesSection() {
    return (
        <section className="py-20">
            <div className="mx-auto">
                <h2 className="text-3xl font-bold text-center mb-8">What Can I Do?</h2>
                <div className="flex justify-between flex-wrap">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            className="w-full lg:w-1/3"
                            initial={{ opacity: 0, x: 50 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="card shadow-xl p-6 text-center">
                                <FontAwesomeIcon icon={feature.icon} size="3x" className="text-primary mb-4" />
                                <h3 className="text-xl font-semibold">{feature.title}</h3>
                                <p className="mt-2">{feature.description}</p>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}