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

// Type for uploaded images
export interface UploadedImage {
  id: string;
  file: File;
  previewUrl: string;
  isImage: boolean;
}

const MessageContainer = () => {
  // 🔌 Initialize Socket & Redux user
  const { socket } = useSocket();
  const user = useAppSelector(selectCurrentUser);

  // ⚙️ Local states
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
  const [upload] = useMultipleFileUpload();
  const { register, handleSubmit, reset } = useForm();

  /* -------------------------------------------------------------------------- */
  /*                               🔹 API Queries                               */
  /* -------------------------------------------------------------------------- */

  // 🧍 Fetch selected user details using REST (RTK Query)
  const { data: userData } = useGetUserByIdQuery(selectedUserId!, {
    skip: !selectedUserId,
  });
  const userDetails = userData?.data;

  // 🛒 Fetch product details if productId exists
  const { data: productData } = useGetProductByIdQuery(productId!, {
    skip: !productId,
  });

  // 🧾 Fetch service details if serviceId exists
  const { data: serviceData } = useGetServiceByIdQuery(serviceId!, {
    skip: !serviceId,
  });

  /* -------------------------------------------------------------------------- */
  /*                            🔹 Router & Redirection                         */
  /* -------------------------------------------------------------------------- */

  // When userId param comes from another page, redirect with selectedUserId
  useEffect(() => {
    if (userId) {
      router.replace(
        `/user/message?selectedUserId=${userId}${
          productId ? `&productId=${productId}` : ''
        }`,
      );
    }
  }, [userId, productId, router]);

  /* -------------------------------------------------------------------------- */
  /*                               🔹 Socket Logic                              */
  /* -------------------------------------------------------------------------- */

  useEffect(() => {
    if (!socket || !user?.userId) return;

    // 📩 Listen for chat messages
    const handleMessage = (res: any) => setMessages(res);
    socket.on('message', handleMessage);

    // 🆕 Listen for new incoming messages (specific to current chat)
    const handleNewMessage = (res: any) =>
      setMessages((prev) => [...prev, res]);
    if (chatId) socket.on(`new-message::${chatId}`, handleNewMessage);

    // 🟢 Listen for online users update
    const handleOnlineUser = (res: any) => setOnlineUser(res);
    socket.on('onlineUser', handleOnlineUser);

    // 💬 Listen for chat list updates
    const handleChatList = (res: any) => setChatListData(res);
    socket.on('chat-list', handleChatList);

    // 🔄 Fetch my chat list once
    socket.emit('my-chat-list', {}, (res: any) =>
      setChatListData(res?.message || []),
    );

    // 🧹 Cleanup listeners
    return () => {
      socket.off('message', handleMessage);
      if (chatId) socket.off(`new-message::${chatId}`, handleNewMessage);
      socket.off('onlineUser', handleOnlineUser);
      socket.off('chat-list', handleChatList);
    };
  }, [socket, user?.userId, chatId]);

  // ✅ Mark all messages as seen when opening chat
  useEffect(() => {
    if (socket && user?.userId && chatId) {
      socket.emit('seen', { chatId });
    }
  }, [socket, user?.userId, chatId]);

  // 🟢 Active user check (online/offline indicator)
  useEffect(() => {
    if (userDetails && onlineUser) {
      setIsActive(onlineUser.includes(userDetails._id));
    }
  }, [userDetails, onlineUser]);

  // Set selected userId from query param
  useEffect(() => {
    if (selectedUserIdFrom) setSelectedUserId(selectedUserIdFrom);
  }, [selectedUserIdFrom]);

  // Match chatId with selected user from chat list
  useEffect(() => {
    const foundChat = chatListData?.find(
      (chat: any) => chat?.chat?.participants?.[0]?._id === selectedUserId,
    );
    if (foundChat) setChatId(foundChat.chat?._id);
  }, [selectedUserId, chatListData]);

  // Always scroll to bottom on message update
  useEffect(() => {
    chatBoxRef.current?.scrollTo({
      top: chatBoxRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  /* -------------------------------------------------------------------------- */
  /*                             🔹 Send New Message                            */
  /* -------------------------------------------------------------------------- */

  const handleSendMessage = async (data: any) => {
    if (!socket || !user?.userId || !selectedUserId) return;

    // 📤 Upload any attached images first
    let uploadedUrls: string[] = [];
    if (uploadedImages.length > 0) {
      const files = uploadedImages.map((img) => img.file);
      const result = await upload(files);
      uploadedUrls = result.map((r: any) => r.url);
    }

    // 🧾 Prepare message payload
    const payload = {
      sender: user.userId,
      receiver: selectedUserId,
      text: data.message || '',
      imageUrl: uploadedUrls,
      chatId,
      createdAt: new Date().toISOString(),
    };

    // 🕒 Optimistic UI update before sending
    setMessages((prev) => [...prev, payload]);

    // 🚀 Send message to socket server
    socket.emit('send-message', payload);

    // ♻️ Reset input and images
    setUploadedImages([]);
    setImages([]);
    reset();
  };

  /* -------------------------------------------------------------------------- */
  /*                             🔹 Image Handlers                              */
  /* -------------------------------------------------------------------------- */

  const handleImagesChange = (newImages: UploadedImage[]) =>
    setImages(newImages);

  const removeImage = (id: string) => {
    const updated = uploadedImages.filter((img) => img.id !== id);
    setUploadedImages(updated);
    handleImagesChange(updated);
  };

  /* -------------------------------------------------------------------------- */
  /*                                 🔹 Render UI                               */
  /* -------------------------------------------------------------------------- */

  return (
    <div className="mx-auto flex h-[90vh] w-full lg:max-w-6xl rounded-xl bg-white shadow-lg overflow-hidden">
      {/* --------------------------- Left Sidebar --------------------------- */}
      <div
        className={cn(
          'flex flex-col border-r border-gray-200 bg-gray-50 transition-all duration-300',
          selectedUserId ? 'hidden lg:flex lg:w-[30%]' : 'w-full lg:w-[30%]',
        )}
      >
        {/* Header */}
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

        {/* Search or User Search Container */}
        <div className="p-4">
          {wantTOSearch ? (
            <UserSearchContainer setWantTOSearch={setWantTOSearch} />
          ) : (
            <Input
              placeholder="Search people..."
              className="w-full rounded-full border-gray-300 bg-white text-gray-800 focus:ring-2 focus:ring-primary-blue"
              onFocus={() => setWantTOSearch(true)}
            />
          )}
        </div>

        {/* Chat List */}
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

      {/* --------------------------- Chat Section --------------------------- */}
      <div className="flex flex-1 flex-col bg-white">
        {!selectedUserId ? (
          // If no user selected
          <div className="flex flex-1 items-center justify-center text-gray-500 text-lg font-medium">
            <MessageCircleMore className="mr-2 text-gray-400" />
            Select a user to start chatting
          </div>
        ) : (
          <>
            {/* --------------------- Chat Header --------------------- */}
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <div className="flex items-center gap-x-3">
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

            {/* ---------------- Product or Service Info ---------------- */}
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
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {productData?.data
                      ? productData.data.description || 'No description'
                      : serviceData?.data?.description || 'No description'}
                  </p>
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

            {/* --------------------- Messages List --------------------- */}
            <div
              ref={chatBoxRef}
              className="scroll-hide flex-1 space-y-3 overflow-y-auto bg-gray-50 px-6 py-4"
            >
              {messages?.map((message, index) =>
                message.sender !== user?.userId ? (
                  // Receiver Message
                  <div className="flex items-end gap-x-2" key={index}>
                    <CustomAvatar
                      img={userDetails?.image}
                      name={userDetails?.fullName as string}
                      className="size-8 rounded-full"
                    />
                    <div className="max-w-[75%] md:max-w-[60%]">
                      <ReceiverMsgCard
                        message={message?.text}
                        files={
                          message?.imageUrl?.length ? message.imageUrl : null
                        }
                      />
                    </div>
                  </div>
                ) : (
                  // Owner Message
                  <div
                    className="flex flex-row-reverse items-end gap-x-2"
                    key={index}
                  >
                    <div className="max-w-[75%] md:max-w-[60%] flex flex-col items-end">
                      <OwnerMsgCard
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

            {/* --------------------- Message Input --------------------- */}
            <div className="border-t border-gray-200 bg-white p-4">
              {/* Preview Uploaded Images */}
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

              {/* Message Form */}
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
