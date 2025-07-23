import Link from 'next/link';
import logo from '@/assets/icons/Logo_light.png';
import Image from 'next/image';
import facebookIcon from '@/assets/icons/facebook.png';
import instagramIcon from '@/assets/icons/instagram.png';
import xIcon from '@/assets/icons/x.png';
import linkdinIcon from '@/assets/icons/linkdin.png';

export const Footer = () => {
  return (
    <footer className="bg-sky-950 py-10 text-gray-100">
      <div className="container mx-auto px-4 space-y-8">
        {/* Logo */}
        <div className="flex justify-center items-center">
          <Image src={logo} alt="AnyJob logo" className="h-14" />
        </div>

        {/* About Description */}
        <div className="text-center text-lg text-gray-50 max-w-3xl mx-auto">
          We're dedicated to providing the best products and services to our
          customers. Whether you're a vendor showcasing your offerings or a user
          searching for top-rated solutions, we offer a seamless experience for
          everyone.
        </div>

        {/* Social Links */}
        <div className="flex justify-center gap-6">
          <Image src={facebookIcon} alt="facebook" />
          <Image src={instagramIcon} alt="instagram" />
          <Image src={xIcon} alt="x" />
          <Image src={linkdinIcon} alt="linkdin" />
        </div>

        <hr className="bg-gray-900 my-6" />

        {/* Copyright & Links */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-y-4 text-sm">
          <p className="text-sm text-gray-400">
            Copyright © 2025 AnyJob. All rights reserved.
          </p>
          <ul className="flex flex-wrap justify-center gap-6">
            <li>
              <Link href="#" className="hover:underline text-gray-400">
                Home
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:underline text-gray-400">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:underline text-gray-400">
                Terms Of Use
              </Link>
            </li>
            <li>
              <Link href="#" className="hover:underline text-gray-400">
                Pricing
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
};
