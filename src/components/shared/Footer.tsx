'use client';

import Link from 'next/link';
import logo from '@/assets/icons/Logo_light.png';
import Image from 'next/image';
import facebookIcon from '@/assets/icons/facebook.png';
import instagramIcon from '@/assets/icons/instagram.png';
import xIcon from '@/assets/icons/x.png';
import linkedinIcon from '@/assets/icons/linkdin.png';

export const Footer = () => {
  return (
    <footer className="bg-sky-950 py-10 text-gray-100">
      <div className="container mx-auto px-4 space-y-8">
        {/* Logo */}
        <div className="flex justify-center items-center">
          <Image src={logo} alt="AnyJob logo" className="h-14" />
        </div>

        {/* About Description */}
        <div className="text-center text-sm lg:text-lg text-gray-50 max-w-3xl mx-auto">
          {
            "We’re dedicated to providing the best products and services to our customers. Whether you're a vendor looking to showcase your offerings or a user searching for top-rated solutions, we offer a seamless experience for everyone."
          }
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-6">
          <Link
            href={'https://www.facebook.com/share/1BTrFQtoF2/?mibextid=wwXIfr'}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image src={facebookIcon} alt="facebook" />
          </Link>
          <Link
            href={
              'https://www.instagram.com/smevine_?igsh=MW40MzI4YTQyNHZlZQ%3D%3D&utm_source=qr'
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image src={instagramIcon} alt="instagram" />
          </Link>
          <Link
            href={'https://x.com/smevine_?s=11&t=eTXhTt3CIzwBAc1Ri-mzjA'}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image src={xIcon} alt="x" />
          </Link>
          <Link
            href={
              'https://www.linkedin.com/in/smevine-84b393395?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app'
            }
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image src={linkedinIcon} alt="linkedin" />
          </Link>
        </div>

        <hr className="bg-gray-900 my-6" />

        {/* Copyright & Links */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-y-4 text-sm">
          <p className="text-sm text-gray-400">
            Copyright © 2025 AnyJob. All rights reserved.
          </p>
          <ul className="flex flex-wrap justify-center gap-6">
            <li>
              <Link href="/" className="hover:underline text-gray-400">
                Home
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="hover:underline text-gray-400">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:underline text-gray-400">
                Terms Of Use
              </Link>
            </li>
            <li>
              <Link href="/pricing" className="hover:underline text-gray-400">
                Pricing
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};
