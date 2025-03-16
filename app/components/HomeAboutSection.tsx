'use client'

import { faBowlFood } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "motion/react";

export default function HomeAboutSection() {
    return (
        <section className="bg-base-100 py-12 p-5">
            <div className="container mx-auto flex flex-col lg:flex-row items-center gap-8">
                <motion.div
                    className="lg:w-1/2"
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-3xl font-bold">About Luncheon Meet</h2>
                    <p className="mt-4 text-lg">
                        Luncheon Meet was built as a test project to discover the capabilities of NextJS, Postgres databases, and Platform as a Service Cloud services. 
                    </p>
                    <p className="mt-2 text-lg">
                        The ad-hoc meetups idea came from a discussion between colleagues about the need for an adhoc meetups application that could help individuals connect quickly and communicate with each other in-app.
                    </p>
                </motion.div>
                <motion.div
                    className="lg:w-1/2 flex justify-center"
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <FontAwesomeIcon icon={faBowlFood} size="6x" className="text-primary" />
                </motion.div>
            </div>
        </section>
    )
}