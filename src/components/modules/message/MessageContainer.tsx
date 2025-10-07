'use client';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import { MessageCircleMore, SendHorizontal, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import OwnerMsgCard from './OwnerMsgCard';
import ReceiverMsgCard from './ReceiverMsgCard';
import UserCard from './UserCard';
import { useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import UserSearchContainer from './UserSearchContainer';
import { useAppSelector } from '@/redux/hooks';
import { useSocket } from '@/providers/SocketProvider';
import useMultipleFileUpload from '@/hooks/useMultipleFileUpload';
import CustomAvatar from '@/components/shared/custom-avater';
import { MessageImageUpload } from '@/components/ui/core/UploadMessageImage';
import { selectCurrentUser } from '@/redux/features/auth/authSlice';

export interface UploadedImage {
  id: string;
  file: File;
  previewUrl: string;
  isImage: boolean;
}

const MessageContainer = () => {
  const [images, setImages] = useState<UploadedImage[]>([]);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const { socket } = useSocket();
  const user = useAppSelector(selectCurrentUser);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [messages, setMessages] = useState<any>(null);
  const [onlineUser, setOnlineUser] = useState([]);
  const [onlineUserLoading, setOnlineUserLoading] = useState(false);
  const [userDetails, setUserDetails] = useState<any>(null);
  const [chatListData, setChatListData] = useState([]);
  const [chatId, setChatId] = useState<string>('');
  const [isActive, setIsActive] = useState(false);
  const selectedUserIdFrom = useSearchParams().get('selectedUserId');
  const { register, handleSubmit, reset } = useForm();
  const chatBoxRef = useRef(null);
  const [upload] = useMultipleFileUpload();

  const [wantTOSearch, setWantTOSearch] = useState(false);

  console.log(messages);

  // ========================= listen message::received ===========================
  const handleListenMessage = (res: any) => {
    setMessages(res);
    // console.log({ message: res });
  };

  /**
   * emit message page and listen message  to get
   * previous message
   *
   * **/
  useEffect(() => {
    if (socket && user?.userId) {
      socket?.on('message', handleListenMessage);

      console.log(selectedUserId);
      if (selectedUserId) {
        setTimeout(() => {
          socket?.emit('message-page', selectedUserId);
        }, 500);
      }
    }
    return () => {
      socket?.off('message', handleListenMessage);
    };
  }, [socket, selectedUserId, user?.userId]);

  // ======================== listen online user ===========================
  useEffect(() => {
    setOnlineUserLoading(true);
    if (socket && user?.userId) {
      socket.on('onlineUser', (res: any) => {
        setOnlineUser(res);
        setOnlineUserLoading(false);
      });
    }

    // return () => {
    //   if (socket && user?.userId) {
    //     socket.off("onlineUser", (res) => {
    //       setOnlineUser(res);
    //       setOnlineUserLoading(false);
    //     });
    //   }
    // };
  }, [socket, user?.userId, selectedUserId]);

  // ======================== listen user-details ===========================
  useEffect(() => {
    if (socket && user?.userId) {
      socket?.on('user-details', (res: any) => {
        console.log('user details ============= ', res);
        setUserDetails(res);
      });
    }
  }, [socket, user?.userId, selectedUser]);

  console.log({ userDetails });

  // ======================== listen chat-list ===========================
  useEffect(() => {
    socket?.on(`chat-list`, (res: any) => {
      console.log('chat list ==========', res);
      setChatListData(res);
    });

    setTimeout(() => {
      socket?.emit(`my-chat-list`, {}, (res: any) => {
        console.log('Keno chat list pacchi na?');
        console.log(res);
        setChatListData(res?.message);
      });
    }, 1000);

    return () => {
      if (socket) {
        socket.off(`chat-list`);
      }
    };
  }, [socket, socket?.connected]);

  // emit chat list
  // useEffect(() => {
  //   console.log(socket);
  //   if (socket && socket?.connected) {
  //     console.log({ socketConnected: socket.connected });
  //     socket?.emit(`my-chat-list`, {});

  //   }

  // }, [socket, socket?.connected])

  // ======================== listen new message  ===========================
  useEffect(() => {
    if (socket && user?.userId && selectedUserId && chatId) {
      socket?.on(`new-message::${chatId}`, (res: any) => {
        setMessages((prevMessages: any) => [...prevMessages, res]);
      });
    }
  }, [socket, user?.userId, selectedUserId, chatId]);

  // ======================== emit for seen message  ===========================
  useEffect(() => {
    if (socket && user?.userId && selectedUserId && chatId) {
      socket.emit('seen', { chatId });
    }
  }, [socket, user, selectedUserId, chatId]);

  // emit for send message
  const handleSendMessage = async (data: any) => {
    if (images.length > 0) {
      const files = images?.map((image) => image.file);

      const res = await upload(files);

      const payload = {
        receiver: selectedUserId,
        text: data?.message,
        imageUrl: res?.data?.images,
      };

      if (socket && user?.userId && selectedUserId) {
        socket.emit('send-message', payload);
        reset();
        setUploadedImages([]);
        setImages([]);
      }
      return;
    }

    const payload = {
      receiver: selectedUserId,
      text: data?.message,
    };
    if (socket && user?.userId && selectedUserId) {
      socket.emit('send-message', payload, (res: any) => {
        console.log(res);
      });
      reset();
      setUploadedImages([]);
      setImages([]);
    }
  };

  const handleImagesChange = (newImages: UploadedImage[]) => {
    setImages(newImages);
  };

  const removeImage = (id: string) => {
    const updatedImages = uploadedImages.filter((image) => image.id !== id);
    setUploadedImages(updatedImages);
    handleImagesChange(updatedImages);
  };

  // ============================= check isActive user====================================
  useEffect(() => {
    if (userDetails && onlineUser) {
      // @ts-ignore
      setIsActive(onlineUser?.includes(userDetails?._id));
    }
  }, [userDetails, onlineUser]);

  // set selected  user
  useEffect(() => {
    if (selectedUserIdFrom) {
      setSelectedUserId(selectedUserIdFrom);
    } else {
      setSelectedUserId('');
    }
  }, [selectedUserIdFrom]);

  // set chat id
  useEffect(() => {
    const selectedUserChatId: any = chatListData?.find(
      (chatList: any) =>
        chatList?.chat?.participants?.[0]?._id === selectedUserId,
    );

    if (!chatId) {
      setChatId(selectedUserChatId?.chat?._id);
    }
  }, [selectedUserId, chatListData]);

  // ===================================== scroll to bottom of chat box ==============================================
  useEffect(() => {
    if (messages) {
      if (chatBoxRef.current) {
        // @ts-ignore
        chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
      }
    }
  }, [messages]);

  return (
    <div className="lg:mx-auto ">
      <div className="relative z-10 flex flex-col rounded-xl rounded-t-xl lg:border-t-8 lg:border-t-primary-blue  lg:px-10 lg:py-8 lg:flex-row ">
        {/* left */}
        <div
          className={cn(
            'border-opacity-[40%] pr-2 lg:w-[30%] lg:border-r-2 lg:border-gray-300',
            selectedUserId && 'hidden lg:block',
          )}
        >
          <div className="lg:border-t-black flex items-end gap-x-5 border-b border-opacity-[40%] py-4 text-black">
            <h4 className="text-2xl font-medium">Messages</h4>
          </div>

          <div className="mx-auto mb-10 mt-4 lg:w-[95%]">
            {wantTOSearch ? (
              <UserSearchContainer
                setWantTOSearch={setWantTOSearch}
              ></UserSearchContainer>
            ) : (
              <>
                <Input
                  placeholder="Search people... "
                  className="w-full rounded-xl border  bg-transparent px-2 py-6 "
                  type="text"
                  onFocus={() => setWantTOSearch(true)}
                />
                {/* users list - TODO: Use dynamic data */}
                <div className="scroll-hide lg:mt-8 mt-5  max-h-[70vh] min-h-[65vh] space-y-5 overflow-auto">
                  {chatListData?.map((chatData: any, idx: number) => (
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
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* right */}
        {!selectedUserId ? (
          <div
            className={cn(
              'flex flex-1 h-[80vh] items-center justify-center',
              !selectedUserId && 'hidden lg:flex',
            )}
          >
            <div className="flex items-center gap-x-3 font-dm-sans lg:text-2xl">
              <MessageCircleMore size={26} /> Select your partner to start a
              conversation
            </div>
          </div>
        ) : (
          <div
            className={cn(
              'flex flex-col justify-between lg:flex-grow lg:px-8',
              !selectedUserId && 'hidden lg:flex',
            )}
          >
            <div className="border-t-black flex items-center justify-between border-b border-opacity-[40%] pb-1">
              <div className="flex items-center gap-x-2">
                <div>
                  <CustomAvatar
                    img={userDetails?.image}
                    name={userDetails?.fullName}
                    className="size-12"
                  ></CustomAvatar>
                </div>

                <div className="lg:flex-grow">
                  <h3 className="text-xl font-semibold text-black">
                    {userDetails?.fullName}
                  </h3>

                  {isActive ? (
                    <div className="mt-1 flex items-center gap-x-1">
                      {/* Active/Online Indicator */}
                      <div className="size-3 rounded-full bg-green-500" />
                      <p className="text-black border-t-black">Online</p>
                    </div>
                  ) : (
                    <div className="mt-1 flex items-center gap-x-1">
                      {/* Active/Online Indicator */}
                      <div className="size-3 rounded-full bg-yellow-500" />
                      <p className="text-black border-t-black">Offline</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div
              key={'message'}
              className="scroll-hide space-y-1 pt-8  max-h-[65vh] min-h-[65vh]  overflow-auto"
              ref={chatBoxRef}
            >
              {messages?.map((message: any, index: number) => {
                const isPreviousMessageFromSameSender =
                  index > 0 && messages[index - 1]?.sender === message.sender;

                const showAvatar =
                  !isPreviousMessageFromSameSender || index === 0; // Show avatar only if it's the first in a series or the first message overall.

                return message?.sender !== user?.userId ? (
                  <div className="flex items-start gap-x-2" key={message._id}>
                    {showAvatar && (
                      <CustomAvatar
                        img={userDetails?.image}
                        name={userDetails?.fullName}
                        className="size-8 rounded-full"
                      />
                    )}
                    <div
                      className={cn(
                        'md:max-w-[50%] max-w-[75%] space-y-3 overflow-ellipsis',
                        !showAvatar && 'pl-10',
                      )}
                    >
                      <ReceiverMsgCard
                        message={message?.text}
                        files={
                          message?.imageUrl?.length ? message?.imageUrl : null
                        }
                      />
                    </div>
                  </div>
                ) : (
                  <div
                    className="flex flex-row-reverse items-start gap-x-4"
                    key={message._id}
                  >
                    <div className="flex md:max-w-[50%] max-w-[75%] flex-col items-end space-y-1 break-words">
                      <OwnerMsgCard
                        message={message?.text}
                        files={
                          message?.imageUrl?.length ? message?.imageUrl : null
                        }
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* right bottom */}
            <div className="mt-3 flex w-full items-center gap-x-6 ">
              <div className="mt-5 relative  w-full">
                {uploadedImages?.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4   bg-gray-200 w-full px-10">
                    {uploadedImages?.map((image) => (
                      <div
                        key={image.id}
                        className="relative group flex flex-col justify-center items-center gap-x-2 py-2"
                      >
                        {image?.isImage && (
                          <Image
                            src={image?.previewUrl}
                            alt="Uploaded preview"
                            width={1200}
                            height={1200}
                            className="rounded-lg md:max-w-44 w-auto mx-auto h-20 max-w-36"
                          />
                        )}

                        {!image?.isImage && (
                          <p className=" max-w-[200px] truncate text-[14px]">
                            {image?.file?.name}
                          </p>
                        )}

                        <button
                          onClick={() => removeImage(image.id)}
                          className="absolute top-2 right-2 p-1 bg-red-500 rounded-full opacity-100 transition-opacity z-30"
                        >
                          <X className="w-4 h-4 text-white" />
                        </button>
                        <div className="absolute inset-0 bg-black/5 opacity-100 transition-opacity rounded-lg" />
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex w-full items-center gap-x-3">
                  <div>
                    <MessageImageUpload
                      onImagesChange={handleImagesChange}
                      uploadedImages={uploadedImages}
                      setUploadedImages={setUploadedImages}
                    />
                  </div>

                  <form
                    onSubmit={handleSubmit(handleSendMessage)}
                    className="flex flex-col w-full items-stretch gap-x-4 relative"
                  >
                    <div>
                      <Input
                        placeholder="Type a message"
                        type="text"
                        className="w-full border-2 border-black/50 bg-transparent px-4 py-6 rounded-3xl"
                        {...register('message', {
                          required: images.length > 0 ? false : true,
                        })}
                        // onFocus={handleInputFocus}
                        // onBlur={handleInputBlur}
                      />
                      {/*
                      <AutosizeTextarea
                        placeholder="Type a message"
                        className="w-full border-2 bg-transparent rounded-3xl"
                        {...register("message", {
                          required: images.length > 0 ? false : true,
                        })}
                        maxHeight={150}
                      ></AutosizeTextarea> */}

                      <Button className="cursor-pointer absolute right-4 top-1/2 -translate-y-1/2 bg-[#003250] px-3">
                        <SendHorizontal size={20} color="#fff" />
                      </Button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageContainer;
