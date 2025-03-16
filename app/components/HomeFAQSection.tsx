'use client'

import { motion } from "motion/react";

import React from 'react';

const faqs = [
    {
        question: 'How does Luncheon Meet work?',
        answer: 'You can login with google, customize your profile, create new meetups, join existing meetups, and chat with participants of the meetups that you join.',
    },
    {
        question: 'How do I communicate with other participants?',
        answer: 'You can communicate with participants using the in-app chat functionality. It is called: Meeting Room.',
    },
    {
        question: 'Where can I view the source code for this project?',
        answer: 'The source code is available on Github at https://github.com/charlesgohck/luncheonmeet',
    },
];

export default function HomeFAQSection() {
    return (
        <section className="bg-base-200 py-20">
            <div className="mx-auto">
                <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <motion.div
                            key={index}
                            className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box mb-4"
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div key={index} className="collapse collapse-arrow border border-base-300 bg-base-100 rounded-box">
                                <input type="radio" name="faq-accordion" />
                                <div className="collapse-title text-lg font-medium">{faq.question}</div>
                                <div className="collapse-content">
                                    <p>{faq.answer}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};