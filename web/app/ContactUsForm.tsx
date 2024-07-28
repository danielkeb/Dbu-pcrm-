import React, { useRef, FormEvent } from 'react'; // Import necessary React hooks and types
import emailjs from 'emailjs-com'; // Import emailjs for sending emails

export default function ContactUsForm() {
    // Use useRef to create a reference for the form element with a proper type
    const formRef = useRef<HTMLFormElement | null>(null);

    // Define the sendEmail function with explicit typing for the event parameter
    const sendEmail = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault(); // Prevent default form submission behavior

        if (!formRef.current) return; // Ensure formRef.current is not null

        // Create a FormData object from the formRef's current value
        const formData = new FormData(formRef.current);
        const fullName = formData.get('fullName') as string;
        const email = formData.get('email') as string;
        const subject = formData.get('subject') as string;
        const body = formData.get('body') as string;

        // Check if all required fields are filled
        if (!fullName || !email || !subject || !body) {
            alert('All fields are required.');
            return;
        }

        // Send email using emailjs
        emailjs.sendForm('service_ndzugzd', 'template_ykotyhr', formRef.current, 'zBuzq55OXkC-D2cpq')
            .then((result) => {
                console.log('Email successfully sent!', result.text);
                alert('Message sent successfully!');
                formRef.current?.reset(); // Reset the form after successful submission
            }, (error) => {
                console.error('Error sending email:', error);
                alert('There was an error sending your message. Please try again later.');
            });
    };

    return (
        <div className="flex justify-center items-center w-full p-4 m-2">
            <form
                className="bg-white/50 backdrop-blur-sm p-6 rounded-lg shadow-lg w-full max-w-xl"
                ref={formRef} // Assign formRef to the form element
                onSubmit={sendEmail} // Bind the sendEmail function to the onSubmit event
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
            <div className="mt-6 ml-10 text-center">
                <h2 className="text-lg font-semibold text-gray-700 mb-2">
                    Contact Information
                </h2>
                <p className="text-gray-600">
                    Email: <a href="mailto:danielkebede381@gmail.com" className="text-blue-500 hover:underline">danielkebede381@gmail.com</a>
                </p>
                <p className="text-gray-600">
                    Phone: <a href="tel:+251921154404" className="text-blue-500 hover:underline">+251 921 154 404</a>
                </p>
                <p className="text-gray-600">
                    Address: 445 Tebase sub-city, Debre birhan, Ethiopia
                </p>
                <div className="flex justify-center mt-4 space-x-4">
                    <a
                        href="https://www.facebook.com/dbu.edu.et"
                        className="text-blue-600 hover:text-blue-800"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="h-6 w-6"
                        >
                            <path d="M22 12.072C22 6.479 17.523 2 12 2S2 6.479 2 12.072c0 4.991 3.657 9.131 8.437 9.877v-6.99h-2.54V12h2.54v-2.7c0-2.507 1.492-3.891 3.777-3.891 1.094 0 2.238.196 2.238.196v2.47h-1.26c-1.242 0-1.63.772-1.63 1.563V12h2.773l-.443 2.96h-2.33v6.989C18.343 21.203 22 17.063 22 12.072z" />
                        </svg>
                    </a>
                    <a
                        href="https://www.twitter.com/dbu.edu.et"
                        className="text-blue-500 hover:text-blue-700"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="h-6 w-6"
                        >
                            <path d="M24 4.557a9.94 9.94 0 01-2.828.775A4.932 4.932 0 0023.337 3.1a9.862 9.862 0 01-3.13 1.195A4.922 4.922 0 0016.616 3c-2.73 0-4.943 2.21-4.943 4.92 0 .385.044.76.128 1.12C7.728 8.9 4.1 6.906 1.67 4.148a4.822 4.822 0 00-.67 2.477c0 1.71.87 3.215 2.19 4.102a4.88 4.88 0 01-2.23-.615v.06c0 2.388 1.698 4.374 3.946 4.827-.413.112-.848.171-1.297.171-.317 0-.626-.03-.928-.088.628 1.963 2.448 3.393 4.6 3.43a9.869 9.869 0 01-6.1 2.103c-.396 0-.786-.023-1.17-.067a13.895 13.895 0 007.555 2.209c9.054 0 14-7.497 14-13.986 0-.213 0-.425-.015-.636A9.935 9.935 0 0024 4.557z" />
                        </svg>
                    </a>
                    <a
                        href="https://www.linkedin.com/in/yourprofile"
                        className="text-blue-700 hover:text-blue-900"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            className="h-6 w-6"
                        >
                            <path d="M4.98 3.5c0 .827-.671 1.5-1.5 1.5a1.5 1.5 0 110-3c.83 0 1.5.673 1.5 1.5zm-.049 4.5H.959v15h4.001v-15zm7.47 0H8.5v15h4v-7.5c0-3.923 4-4.25 4 0v7.5h4v-8.57c0-5.64-6.147-5.467-8.499-2.67v-1.76z" />
                        </svg>
                    </a>
                </div>
            </div>
        </div>
    );
}
