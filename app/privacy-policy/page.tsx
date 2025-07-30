"use client";
import { title } from "@/components/primitives";

export default function PolicyPage() {
    return (
        <div className="max-w-4xl mx-auto py-10 px-4 sm:px-6 lg:px-8 text-left">
            <h1 className={title()}>Privacy Policy</h1>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">Personal Information</h2>
            <p className="mb-4">
                SEIN collects the following personal information from you when you create an account and when you use the Resource Hub. The information collected is used to provide the Resource Hub service to you:
            </p>
            <ul className="list-disc list-inside mb-4 pl-4 space-y-1">
                <li>Email address</li>
                <li>Name</li>
                <li>Organisation</li>
                <li>Profile photos (if you provide any)</li>
                <li>Contact details</li>
            </ul>
            <p className="mb-4">
                We don&apos;t sell, rent, or lend personal information to anyone under any circumstances.
            </p>
            <p className="mb-4">
                You can request to remove your account and any personally identifying information you provided by reaching out to us directly.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Cookies</h2>
            <p className="mb-4">
                Resource Hub uses your browser’s local storage for functionality that is necessary for the site to work. We do not rely on any first party cookies to track your interactions with the site. Resource Hub uses Vercel services and Vercel may set additional necessary browser cookies.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Messaging</h2>
            <p className="mb-4">
                The chat functionality provided within the Resource Hub is unencrypted. We strongly advise against sharing sensitive or personal details through this messaging service. For any communication requiring a secure and private exchange of information, we encourage you to use alternative, encrypted methods outside of the platform.
            </p>

            <h2 className="text-2xl font-semibold mt-8 mb-4">Data Retention and Deletion</h2>
            <p className="mb-4">
                We are committed to protecting your privacy and giving you control over your data. You can request the removal of your account and any personally identifying information you’ve provided by reaching out to us directly at <a href="mailto:info@seinglasgow.org.uk" className="text-primary hover:underline">info@seinglasgow.org.uk</a>. We will respond to and complete your request to delete your information within one month of receiving it.
            </p>
            <p className="mb-4">
                Additionally, if your account remains inactive for a long duration (e.g., two years), we reserve the right to delete your details to protect your privacy and maintain data hygiene.
            </p>
        </div>
    );
}
