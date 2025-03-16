'use client'

import { motion } from "motion/react"
import Link from "next/link"

export default function HomeHero() {
    return (
        <section className="hero min-h-screen bg-base-200 flex flex-col justify-center items-center text-center">
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
            >
                <h1 className="text-5xl font-bold">Luncheon Meet</h1>
                <p className="py-6 text-lg">The Ad-Hoc Meetups Application</p>
                <Link href={"/post"}><button className="btn btn-primary">Get Started</button></Link>
            </motion.div>
        </section>
    )
}