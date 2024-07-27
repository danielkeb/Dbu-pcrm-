import React from 'react';

export default function ContactUsForm() {
    return (
        <div className="flex justify-center items-center  w-full  p-4 m-2">
            <form
                className="bg-white/50 backdrop-blur-sm p-6 rounded-lg shadow-lg w-full max-w-xl"
                action="https://your-form-endpoint"
                method="POST"
            >
                <h2 className="text-2xl font-semibold mb-4 text-center">Contact Us</h2>
                <div className="space-y-4">
                    <div>
                        <label htmlFor="fullName" className="block text-gray-700">Full Name</label>
                        <input
                            id="fullName"
                            name="fullName"
                            type="text"
                            className="mt-1 p-2 w-full border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-gray-700">Email</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            className="mt-1 p-2 w-full border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="subject" className="block text-gray-700">Subject</label>
                        <input
                            id="subject"
                            name="subject"
                            type="text"
                            className="mt-1 p-2 w-full border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="body" className="block text-gray-700">Message</label>
                        <textarea
                            id="body"
                            name="body"
                            rows={4}
                            className="mt-1 p-2 w-full border border-gray-300 rounded"
                            required
                        />
                    </div>
                </div>
                <button
                    type="submit"
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                    Send Message
                </button>
            </form>
        </div>
    );
};
