'use client';

import { useState } from 'react';
import { MapPin, Phone, Mail, Clock, ArrowRight } from 'lucide-react';
import { AppButton } from '@/components/shared/app-button';

export default function Contact() {
  const [rating, setRating] = useState<number | null>(null);
  const [followUp, setFollowUp] = useState<boolean | null>(null);

  const emojis = [
    { value: 1, label: 'Poor', emoji: '😔' },
    { value: 2, label: 'Average', emoji: '😐' },
    { value: 3, label: 'Medium', emoji: '🙂' },
    { value: 4, label: 'Good', emoji: '😎' },
    { value: 5, label: 'Very Good', emoji: '😁' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-center mb-8">
        Contact Us - Share Your Feedback
      </h1>

      <div className="flex flex-wrap justify-center gap-6 mb-8">
        <div className="flex items-center">
          <MapPin className="h-5 w-5 text-blue-500 mr-2" />
          <span className="text-gray-600">123A, Washington, UK</span>
        </div>
        <div className="flex items-center">
          <Phone className="h-5 w-5 text-blue-500 mr-2" />
          <span className="text-gray-600">+123456789</span>
        </div>
        <div className="flex items-center">
          <Mail className="h-5 w-5 text-blue-500 mr-2" />
          <span className="text-gray-600">Cleancrypt@gmail.com</span>
        </div>
        <div className="flex items-center">
          <Clock className="h-5 w-5 text-blue-500 mr-2" />
          <span className="text-gray-600">Available 24/7</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8">
        <form>
          <div className="mb-6">
            <p className="mb-3">Rate your experience</p>
            <div className="flex justify-between max-w-xs mx-auto">
              {emojis.map((item) => (
                <div key={item.value} className="flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => setRating(item.value)}
                    className={`text-3xl mb-1 focus:outline-none ${
                      rating === item.value ? 'transform scale-125' : ''
                    }`}
                    aria-label={item.label}
                  >
                    {item.emoji}
                  </button>
                  <span className="text-xs text-gray-500">{item.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                placeholder="Enter your first name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                placeholder="Enter your last name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Enter your email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Do you have any thoughts {"you'd"} like to share?
            </label>
            <textarea
              id="message"
              rows={5}
              placeholder="Enter your message here..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            ></textarea>
          </div>

          <div className="mb-6">
            <p className="mb-2">
              May we follow you up on your Feedback History?
            </p>
            <div className="flex items-center space-x-4">
              <button
                type="button"
                onClick={() => setFollowUp(true)}
                className={`flex items-center justify-center w-6 h-6 rounded-full border ${
                  followUp === true
                    ? 'bg-green-700 border-green-700'
                    : 'border-gray-300'
                }`}
                aria-label="Yes"
              >
                {followUp === true && (
                  <span className="text-white text-xs">✓</span>
                )}
              </button>
              <span>Yes</span>

              <button
                type="button"
                onClick={() => setFollowUp(false)}
                className={`flex items-center justify-center w-6 h-6 rounded-full border ${
                  followUp === false
                    ? 'bg-green-700 border-green-700'
                    : 'border-gray-300'
                }`}
                aria-label="No"
              >
                {followUp === false && (
                  <span className="text-white text-xs">✓</span>
                )}
              </button>
              <span>No</span>
            </div>
          </div>

          <AppButton
            className="w-full text-gray-50 border-gray-800 bg-gradient-to-t to-green-800 from-green-500/70 hover:bg-green-500/80"
            content={
              <div className="flex justify-center items-center space-x-2 font-semibold">
                <p className="uppercase">Submit Feedback</p>
                <ArrowRight />
              </div>
            }
          />
        </form>
      </div>

      <div className="mt-8 h-64 rounded-lg overflow-hidden">
        <div
          style={{
            width: '100%',
          }}
        >
          <iframe
            width="100%"
            height="400"
            frameBorder="0"
            scrolling="no"
            src="https://maps.google.com/maps?width=100%25&amp;height=400&amp;hl=en&amp;q=123A,%20Washington,%20UK+(Soft%20Technology)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
          >
            <a href="https://www.gps.ie/collections/sports-gps/">Cycling gps</a>
          </iframe>
        </div>
      </div>
    </div>
  );
}
