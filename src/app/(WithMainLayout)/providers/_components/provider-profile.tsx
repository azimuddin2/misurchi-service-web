'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Verified,
  Mail,
  MapPin,
  Calendar,
  Users,
  ShoppingCart,
  Send,
  Plus,
  XCircle,
  User,
} from 'lucide-react';
import bannerImg from '@/assets/images/banner.png';
import Image from 'next/image';
import { AppButton } from '@/components/shared/app-button';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProviderProducts from './provider-products';
import ProviderServices from './provider-services';
import { useGetVendorUserByIdQuery } from '@/redux/features/user/userApi';
import { IUser, TVendorUser } from '@/types';
import { format } from 'date-fns';
import Spinner from '@/components/shared/Spinner';

type Props = {
  providerId: string;
};

const ProviderProfile = ({ providerId }: Props) => {
  const { data, isLoading } = useGetVendorUserByIdQuery(providerId);
  const vendorUser: TVendorUser | undefined = data?.data;

  const vendorId = vendorUser?._id as string;

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <div>
      {/* User Info */}
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <Card className="mb-6 overflow-hidden pt-0">
            <div className="relative w-full h-48 md:h-56 lg:h-64">
              <Image
                src={bannerImg}
                alt="Cover"
                fill
                className="object-cover rounded-xl"
              />
            </div>
            <CardContent className="relative pt-12">
              <div className="absolute -top-24 left-12">
                <Avatar className="w-24 h-24 lg:h-40 lg:w-40 border-4 border-white">
                  <AvatarImage src={vendorUser?.image} alt="Fashion_makeup" />
                  <AvatarFallback className="bg-cyan-100 text-cyan-700 text-5xl">
                    {vendorUser?.businessName.slice(0, 1)}
                  </AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end">
                <div>
                  <div className="flex items-center gap-2 mt-5">
                    <h1 className="text-2xl font-bold">
                      {vendorUser?.businessName}
                    </h1>
                    {vendorUser?.userId.isVerified === true && (
                      <Verified className="h-5 w-5 text-blue-500 fill-blue-100" />
                    )}
                  </div>
                  <p className="text-gray-600">
                    Passionate aquarist with 10 years of experience
                  </p>
                </div>
                {/* Button */}
                <div className="mt-4 sm:mt-0 flex gap-2">
                  <AppButton
                    className="text-black border-gray-800 bg-gradient-to-t to-[#FFFFFF] from-[#FFFFFF] hover:bg-green-500/80"
                    content={
                      <Link
                        href={`/`}
                        className="flex justify-center items-center space-x-1 font-semibold"
                      >
                        <Send size={24} />
                        <span className="uppercase text-sm font-semibold">
                          Message
                        </span>
                      </Link>
                    }
                  />
                  <AppButton
                    className="text-white border-gray-800 bg-gradient-to-t to-green-800 from-green-500/70 hover:bg-green-500/80"
                    content={
                      <Link
                        href={`/`}
                        className="flex justify-center items-center space-x-1 font-semibold"
                      >
                        <Plus size={24} />
                        <span className="uppercase text-sm font-semibold">
                          Follow
                        </span>
                      </Link>
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="pt-2">
                <div className="flex flex-col items-center">
                  <Users className="h-6 w-6 text-gray-500 mb-2" />
                  <span className="text-2xl font-bold">2.5K</span>
                  <span className="text-sm text-gray-500">Followers</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-2">
                <div className="flex flex-col items-center">
                  <Users className="h-6 w-6 text-gray-500 mb-2" />
                  <span className="text-2xl font-bold">25</span>
                  <span className="text-sm text-gray-500">Following</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-2">
                <div className="flex flex-col items-center">
                  <ShoppingCart className="h-6 w-6 text-gray-500 mb-2" />
                  <span className="text-2xl font-bold">100+</span>
                  <span className="text-sm text-gray-500">Total Sold</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-2">
                <div className="flex flex-col items-center">
                  <Badge
                    variant="outline"
                    className="mb-2 bg-cyan-100 text-cyan-800"
                  >
                    Aquarist
                  </Badge>
                  <span className="text-sm text-gray-500">Specialist</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Left Column - About & Contact */}
            <div className="md:col-span-2 space-y-6">
              {/* About Section */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl font-medium">About</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-500">{vendorUser?.description}</p>
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Details */}
            <div className="space-y-6">
              {/* Contact Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium">
                    Contact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-gray-500" />
                    <div className="flex items-center gap-3">
                      <p className="text-base text-gray-500">Date of Join</p>
                      <p className="text-base text-gray-900">
                        {vendorUser?.createdAt
                          ? format(new Date(vendorUser.createdAt), 'MMMM yyyy')
                          : 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-gray-500" />
                    <div className="flex items-center gap-2">
                      <p className="text-base text-gray-500">Location</p>
                      <p className="text-base text-gray-900">
                        {vendorUser?.country}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-gray-500" />
                    <div className="flex items-center gap-2">
                      <p className="text-base text-gray-500">Email</p>
                      {vendorUser?.userId?.isVerified ? (
                        <div className="flex items-center gap-2">
                          <span className="text-base font-medium text-green-600">
                            Verified
                          </span>
                          <Verified className="h-5 w-5 text-green-600" />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-base font-medium text-red-600">
                            Not Verified
                          </span>
                          <XCircle className="h-5 w-5 text-red-600" />
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Service & Product */}
      <div className="my-5">
        <Tabs defaultValue="products">
          <TabsList
            style={{ background: 'none' }}
            className="flex rounded-md w-full py-5 lg:max-w-6xl gap-1 mx-auto lg:gap-3 shadow-none"
          >
            {/* Products Tab */}
            <TabsTrigger
              value="products"
              className="relative w-full cursor-pointer text-[#165940] bg-gray-100 text-lg 
    rounded-md font-medium py-6 transition
    data-[state=active]:text-[#165940] 
    data-[state=active]:shadow
    data-[state=active]:bg-gradient-to-b 
    data-[state=active]:from-[#cadfe7] 
    data-[state=active]:to-[#d9ebe8]
    data-[state=active]:before:absolute
    data-[state=active]:before:inset-0
    data-[state=active]:before:rounded-md
    data-[state=active]:before:bg-gradient-to-t
    data-[state=active]:before:from-[#cadfe7]
    data-[state=active]:before:to-transparent
    data-[state=active]:before:opacity-40
    data-[state=active]:before:content-['']"
            >
              Products
            </TabsTrigger>

            {/* Services Tab */}
            <TabsTrigger
              value="services"
              className="relative w-full cursor-pointer text-[#165940] bg-gray-100 text-lg 
    rounded-md font-medium py-6 transition
    data-[state=active]:text-[#165940] 
    data-[state=active]:shadow
    data-[state=active]:bg-gradient-to-b 
    data-[state=active]:from-[#cadfe7] 
    data-[state=active]:to-[#d9ebe8]
    data-[state=active]:before:absolute
    data-[state=active]:before:inset-0
    data-[state=active]:before:rounded-md
    data-[state=active]:before:bg-gradient-to-t
    data-[state=active]:before:from-[#cadfe7]
    data-[state=active]:before:to-transparent
    data-[state=active]:before:opacity-40
    data-[state=active]:before:content-['']"
            >
              Services
            </TabsTrigger>
          </TabsList>

          {/* Content Panels */}
          <TabsContent value="products" className="mt-2">
            <ProviderProducts vendorId={vendorId} />
          </TabsContent>

          <TabsContent value="services" className="mt-2">
            <ProviderServices vendorId={vendorId} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ProviderProfile;
