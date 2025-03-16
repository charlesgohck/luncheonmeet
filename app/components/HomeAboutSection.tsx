'use client'

import { faMessage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "motion/react";

export default function HomeAboutSection() {
    return (
        <section className="bg-base-100 py-20">
            <div className="flex flex-justify-center flex-wrap">
                <motion.div
                    className="lg:w-1/2 flex justify-center items-center w-full p-10"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <FontAwesomeIcon icon={faMessage} size="6x" className="text-primary" />
                </motion.div>
                <motion.div
                    className="lg:w-1/2 w-full p-10"
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
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
            </div>
        </section>
    )
}