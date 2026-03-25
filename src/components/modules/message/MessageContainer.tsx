'use client';

import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { MessageCircleMore, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import OwnerMsgCard from './OwnerMsgCard';
import ReceiverMsgCard from './ReceiverMsgCard';
import UserCard from './UserCard';
import UserSearchContainer from './UserSearchContainer';
import CustomAvatar from '@/components/shared/custom-avatar';
import { MessageImageUpload } from '@/components/ui/core/UploadMessageImage';
import { cn } from '@/lib/utils';
import { useAppSelector } from '@/redux/hooks';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';
import { useSocket } from '@/providers/SocketProvider';
import useMultipleFileUpload from '@/hooks/useMultipleFileUpload';
import { useForm } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGetProductByIdQuery } from '@/redux/features/product/productApi';
import { useGetServiceByIdQuery } from '@/redux/features/service/serviceApi';
import { useGetUserByIdQuery } from '@/redux/features/user/userApi';

export interface UploadedImage {
  id: string;
  file: File;
  previewUrl: string;
  isImage: boolean;
}

const MessageContainer = () => {
  const { socket } = useSocket();
  const user = useAppSelector(selectCurrentUser);

  const [images, setImages] = useState<UploadedImage[]>([]);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [messages, setMessages] = useState<any[]>([]);
  const [onlineUser, setOnlineUser] = useState<string[]>([]);
  const [chatListData, setChatListData] = useState<any[]>([]);
  const [chatId, setChatId] = useState<string>('');
  const [isActive, setIsActive] = useState(false);
  const [wantTOSearch, setWantTOSearch] = useState(false);

  const chatBoxRef = useRef<HTMLDivElement>(null);
  const searchParams = useSearchParams();
  const userId = searchParams.get('userId');
  const productId = searchParams.get('productId');
  const serviceId = searchParams.get('serviceId');
  const selectedUserIdFrom = searchParams.get('selectedUserId');
  const router = useRouter();
  const [upload, isUploading, progress] = useMultipleFileUpload();
  const { register, handleSubmit, reset } = useForm();

  /* ------------------------------------------------------------------ */
  /*                          API Queries                                */
  /* ------------------------------------------------------------------ */

  const { data: userData } = useGetUserByIdQuery(selectedUserId!, {
    skip: !selectedUserId,
  });
  const userDetails = userData?.data;

  const { data: productData } = useGetProductByIdQuery(productId!, {
    skip: !productId,
  });

  const { data: serviceData } = useGetServiceByIdQuery(serviceId!, {
    skip: !serviceId,
  });

  /* ------------------------------------------------------------------ */
  /*                       Router & Redirection                          */
  /* ------------------------------------------------------------------ */

  useEffect(() => {
    if (userId) {
      router.replace(
        `/user/message?selectedUserId=${userId}${
          productId ? `&productId=${productId}` : ''
        }`,
      );
    }
  }, [userId, productId, router]);

  /* ------------------------------------------------------------------ */
  /*   ✅ SOCKET 1 — Chat List + Online                                  */
  /* ------------------------------------------------------------------ */

  useEffect(() => {
    if (!socket || !user?.userId) return;

    const handleChatList = (res: any) => {
      setChatListData(Array.isArray(res) ? res : []);
    };
    socket.on('chat-list', handleChatList);

    const handleOnlineUser = (res: any) => setOnlineUser(res);
    socket.on('onlineUser', handleOnlineUser);

    const emitChatList = () => {
      setTimeout(() => socket.emit('my-chat-list', {}), 500);
    };

    if (socket.connected) {
      emitChatList();
    } else {
      socket.once('connect', emitChatList);
    }

    socket.on('connect', emitChatList);

    return () => {
      socket.off('chat-list', handleChatList);
      socket.off('onlineUser', handleOnlineUser);
      socket.off('connect', emitChatList);
    };
  }, [socket, user?.userId]);

  /* ------------------------------------------------------------------ */
  /*   ✅ SOCKET 2 — Message History + New Message                       */
  /*   (ekta useEffect-e — duplicate 'message' event problem fix)        */
  /* ------------------------------------------------------------------ */

  useEffect(() => {
    if (!socket || !user?.userId || !selectedUserId) return;

    // clear previous messages
    setMessages([]);

    // ✅ backend 'message-page' → 'message' event-e history pathay
    socket.emit('message-page', selectedUserId);

    // ✅ full history
    const handleMessage = (res: any) => {
      setMessages(Array.isArray(res) ? res : []);
    };
    socket.on('message', handleMessage);

    // ✅ new message instant
    const handleNewMessage = (res: any) => {
      const senderId = res?.sender?._id?.toString() || res?.sender?.toString();
      const receiverId =
        res?.receiver?._id?.toString() || res?.receiver?.toString();

      const isRelated =
        senderId === selectedUserId ||
        receiverId === selectedUserId ||
        senderId === user.userId ||
        receiverId === user.userId;

      if (!isRelated) return;

      setMessages((prev) => {
        const isDuplicate = prev.some(
          (m) => m._id && res._id && m._id?.toString() === res._id?.toString(),
        );
        if (isDuplicate) return prev;
        return [...prev, res];
      });

      // chat list refresh
      socket.emit('my-chat-list', {});
    };
    socket.on('new-message', handleNewMessage);

    return () => {
      socket.off('message', handleMessage);
      socket.off('new-message', handleNewMessage);
    };
  }, [socket, user?.userId, selectedUserId]);

  /* ------------------------------------------------------------------ */
  /*   ✅ SOCKET 3 — Seen                                                */
  /* ------------------------------------------------------------------ */

  useEffect(() => {
    if (!socket || !chatId) return;
    socket.emit('seen', { chatId });
  }, [socket, chatId]);

  /* ------------------------------------------------------------------ */
  /*                       Active User Check                             */
  /* ------------------------------------------------------------------ */

  useEffect(() => {
    if (userDetails && onlineUser) {
      setIsActive(onlineUser.includes(userDetails._id));
    }
  }, [userDetails, onlineUser]);

  /* ------------------------------------------------------------------ */
  /*                       Set Selected User                             */
  /* ------------------------------------------------------------------ */

  useEffect(() => {
    if (selectedUserIdFrom) setSelectedUserId(selectedUserIdFrom);
  }, [selectedUserIdFrom]);

  /* ------------------------------------------------------------------ */
  /*                    Match chatId from chat list                      */
  /* ------------------------------------------------------------------ */

  useEffect(() => {
    const foundChat = chatListData?.find(
      (chat: any) => chat?.chat?.participants?.[0]?._id === selectedUserId,
    );
    if (foundChat) setChatId(foundChat.chat?._id);
  }, [selectedUserId, chatListData]);

  /* ------------------------------------------------------------------ */
  /*                      Auto Scroll to Bottom                          */
  /* ------------------------------------------------------------------ */

  useEffect(() => {
    chatBoxRef.current?.scrollTo({
      top: chatBoxRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  /* ------------------------------------------------------------------ */
  /*                        Send New Message                             */
  /* ------------------------------------------------------------------ */

  const handleSendMessage = async (data: any) => {
    if (!socket || !user?.userId || !selectedUserId) return;

    let uploadedUrls: string[] = [];
    if (uploadedImages.length > 0) {
      const files = uploadedImages.map((img) => img.file);
      const result = await upload(files);
      uploadedUrls = result.map((r: any) => r.url);
    }

    const payload = {
      receiver: selectedUserId,
      text: data.message || '',
      imageUrl: uploadedUrls,
      chatId,
      createdAt: new Date().toISOString(),
    };

    // ❌ optimistic UI remove — new-message event-e ashbe
    // setMessages((prev) => [...prev, { ...payload, sender: user.userId }]);

    // ✅ just send
    socket.emit('send-message', payload);

    setUploadedImages([]);
    setImages([]);
    reset();
  };

  /* ------------------------------------------------------------------ */
  /*                         Image Handlers                              */
  /* ------------------------------------------------------------------ */

  const handleImagesChange = (newImages: UploadedImage[]) =>
    setImages(newImages);

  const removeImage = (id: string) => {
    const updated = uploadedImages.filter((img) => img.id !== id);
    setUploadedImages(updated);
    handleImagesChange(updated);
  };

  /* ------------------------------------------------------------------ */
  /*                           Render UI                                 */
  /* ------------------------------------------------------------------ */

  return (
    <div className="mx-auto flex h-[90vh] w-full lg:max-w-6xl rounded-xl bg-white shadow-lg overflow-hidden">
      {/* Left Sidebar */}
      <div
        className={cn(
          'flex flex-col border-r border-gray-200 bg-gray-50 transition-all duration-300',
          selectedUserId ? 'hidden lg:flex lg:w-[30%]' : 'w-full lg:w-[30%]',
        )}
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4">
          <h4 className="text-2xl font-medium text-gray-800">Messages</h4>
          <Button
            size="icon"
            variant="ghost"
            className="lg:hidden"
            onClick={() => setWantTOSearch((prev) => !prev)}
          >
            <MessageCircleMore className="text-gray-700" />
          </Button>
        </div>

        <div className="p-4">
          {wantTOSearch ? (
            <UserSearchContainer
              setWantTOSearch={setWantTOSearch}
              chatListData={chatListData} // 👈 add korun
            />
          ) : (
            <Input
              placeholder="Search People..."
              className="w-full rounded-sm py-5 border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-primary-blue"
              onFocus={() => setWantTOSearch(true)}
            />
          )}
        </div>

        <div className="scroll-hide flex-1 overflow-y-auto px-4 pb-6">
          {chatListData?.length === 0 ? (
            <p className="text-center text-gray-500 mt-10">No recent chats</p>
          ) : (
            chatListData.map((chatData: any, idx: number) => (
              <UserCard
                key={idx}
                selectedUserId={selectedUserId}
                setChatId={setChatId}
                user={{
                  userData: chatData?.chat?.participants?.[0],
                  message: chatData?.message,
                  unseen: chatData?.unreadMessageCount ? true : false,
                  unseenMessage: chatData?.unreadMessageCount,
                }}
              />
            ))
          )}
        </div>
      </div>

      {/* Chat Section */}
      <div className="flex flex-1 flex-col bg-white">
        {!selectedUserId ? (
          <div className="flex flex-1 items-center justify-center text-gray-500 text-lg font-medium">
            <MessageCircleMore className="mr-2 text-gray-400" />
            Select a user to start chatting
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div className="flex items-center gap-x-3">
                <button
                  className="lg:hidden mr-2 text-gray-500 text-xl"
                  onClick={() => setSelectedUserId('')}
                >
                  ←
                </button>
                <CustomAvatar
                  img={userDetails?.image}
                  name={userDetails?.fullName as string}
                  className="size-12"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {userDetails?.fullName}
                  </h3>
                  <div className="flex items-center gap-x-2">
                    <div
                      className={cn(
                        'h-2 w-2 rounded-full',
                        isActive ? 'bg-green-500' : 'bg-yellow-500',
                      )}
                    />
                    <p className="text-sm text-gray-600">
                      {isActive ? 'Online' : 'Offline'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Product or Service Info */}
            {(productData?.data || serviceData?.data) && (
              <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 flex items-center gap-3">
                <Image
                  src={
                    productData?.data
                      ? productData.data?.images?.[0]?.url || '/placeholder.png'
                      : serviceData?.data?.images?.[0]?.url ||
                        '/placeholder.png'
                  }
                  alt="product/service"
                  width={100}
                  height={100}
                  className="rounded-md object-cover"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 truncate">
                    {productData?.data
                      ? productData.data.name
                      : serviceData?.data?.name}
                  </h3>
                  {productData?.data ? (
                    <p className="text-primary font-medium mt-1">
                      ${productData.data.price.toFixed(2)}
                    </p>
                  ) : serviceData?.data &&
                    serviceData.data.savedServices?.length ? (
                    <p className="text-primary font-medium mt-1">
                      ${serviceData.data.savedServices[0].finalPrice}
                    </p>
                  ) : null}
                </div>
              </div>
            )}

            {/* Messages List */}
            <div
              ref={chatBoxRef}
              className="scroll-hide flex-1 space-y-3 overflow-y-auto bg-gray-50 px-6 py-4"
            >
              {messages?.map((message, index) =>
                message.sender !== user?.userId ? (
                  <div className="flex items-end gap-x-2" key={index}>
                    <CustomAvatar
                      img={userDetails?.image}
                      name={userDetails?.fullName as string}
                      className="size-8 rounded-full"
                    />
                    <div className="max-w-[75%] md:max-w-[60%]">
                      <ReceiverMsgCard
                        date={message.createdAt}
                        message={message?.text}
                        files={
                          message?.imageUrl?.length ? message.imageUrl : null
                        }
                      />
                    </div>
                  </div>
                ) : (
                  <div
                    className="flex flex-row-reverse items-end gap-x-2"
                    key={index}
                  >
                    <div className="max-w-[75%] md:max-w-[60%] flex flex-col items-end">
                      <OwnerMsgCard
                        date={message.createdAt}
                        message={message?.text}
                        files={
                          message?.imageUrl?.length ? message.imageUrl : null
                        }
                      />
                    </div>
                  </div>
                ),
              )}
            </div>

            {/* Message Input */}
            <div className="border-t border-gray-200 bg-white p-4">
              {uploadedImages?.length > 0 && (
                <div className="mb-2 grid w-full gap-3 rounded-md bg-gray-100 p-3 sm:grid-cols-2 md:grid-cols-3">
                  {uploadedImages.map((image) => (
                    <div
                      key={image.id}
                      className="relative flex flex-col items-center"
                    >
                      {image.isImage ? (
                        <Image
                          src={image.previewUrl}
                          alt="Preview"
                          width={100}
                          height={100}
                          className="h-20 w-auto rounded-md object-cover shadow-sm"
                        />
                      ) : (
                        <p className="truncate text-sm">{image.file.name}</p>
                      )}
                      <button
                        onClick={() => removeImage(image.id)}
                        className="absolute right-2 top-2 rounded-full bg-red-500 p-1 text-white shadow-sm"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {isUploading && (
                <div className="w-full bg-gray-200 rounded h-2 my-2 overflow-hidden">
                  <div
                    className="bg-gradient-to-t to-green-800 from-green-500/70 h-2 rounded transition-all duration-200"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              )}

              <form
                onSubmit={handleSubmit(handleSendMessage)}
                className="flex items-center gap-x-3"
              >
                <MessageImageUpload
                  onImagesChange={handleImagesChange}
                  uploadedImages={uploadedImages}
                  setUploadedImages={setUploadedImages}
                />
                <Input
                  placeholder="Type a message..."
                  type="text"
                  className="flex-1 rounded-full border-gray-300 bg-gray-100 px-5 py-3 text-gray-800 placeholder:text-gray-500 focus:border-primary-blue focus:ring-2 focus:ring-primary-blue"
                  {...register('message', {
                    required: images.length > 0 ? false : true,
                  })}
                />
                <Button
                  type="submit"
                  className="rounded-full bg-[#003250] w-9 h-9 text-white"
                >
                  <Send className="h-5 w-5 text-white" />
                </Button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MessageContainer;
