'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowUpRight } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import serviceProviderImg from '@/assets/images/service-provider.png';
import buyerUserImg from '@/assets/images/buyer-user.png';
import rectangleBgImg from '@/assets/images/rectangle.png';

const UserRole = () => {
  const cards = [
    {
      title: 'Sign Up as a Service provider',
      description:
        'Showcase your services & products, and connect with users in your area. Expand your reach today!',
      image: serviceProviderImg,
      href: '/signup/service-provider',
    },
    {
      title: 'Sign Up as a User',
      description:
        'Find and hire the best professionals for your needs. Browse & select top-rated service providers in your area.',
      image: buyerUserImg,
      href: '/signup/user',
    },
  ];

  return (
    <div
      style={{
        backgroundImage: `url(${rectangleBgImg.src})`,
        backgroundSize: 'contain',
        width: '100%',
        backgroundRepeat: 'no-repeat',
      }}
      className="flex justify-center items-center py-20"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 px-4 py-8 container mx-auto">
        {cards.map((card, index) => (
          <Card
            key={index}
            className="rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <CardContent className="p-6 text-center">
              <h2 className="text-2xl font-semibold mb-2">{card.title}</h2>
              <p className="text-muted-foreground mb-4">{card.description}</p>

              <AspectRatio
                ratio={16 / 9}
                className="relative rounded-xl overflow-hidden mb-2"
              >
                <Image
                  src={card.image}
                  alt={card.title}
                  fill
                  className="object-cover"
                />
                <Link
                  href={card.href}
                  className="absolute inset-0 flex items-center justify-center group"
                >
                  <div className="bg-white/70 rounded-full p-3 transition-transform transform group-hover:scale-110">
                    <ArrowUpRight className="text-black" />
                  </div>
                </Link>
              </AspectRatio>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default UserRole;
