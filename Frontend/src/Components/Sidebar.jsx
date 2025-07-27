import { useEffect, useState } from "react";
import { useChatStore } from "../Store/useChatStore";
import { useAuthStore } from "../Store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";
import { formatDistanceToNowStrict } from "date-fns";
import InviteButton from "./InviteButton";

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
    unreadCounts,
  } = useChatStore();

  const { onlineUsers } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <aside className="h-full w-full lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200">
      <div className="border-b border-base-300 w-full p-5">
        <div className="flex items-center justify-between gap-2">
          <div className="font-medium items-center flex text-xl">
            <Users className="size-6 mr-2" />
            Contacts
          </div>
          <InviteButton />
        </div>
        <div className="mt-4 flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-base-content/70">
            ({onlineUsers.length > 0 ? onlineUsers.length - 1 : 0} online)
          </span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-2">
        {filteredUsers.map((user) => {
          const unreadCount = unreadCounts[user._id] || 0;
          const isOnline = onlineUsers.includes(user._id);
          const lastMessageTimestamp = user.lastMessage?.createdAt
            ? formatDistanceToNowStrict(new Date(user.lastMessage.createdAt))
            : "";

          return (
            <button
              key={user._id}
              onClick={() => setSelectedUser(user)}
              className={`w-full p-3 flex items-center gap-4 hover:bg-base-300 transition-colors ${
                selectedUser?._id === user._id ? "bg-base-300" : ""
              }`}
            >
              {/* FIXED: Re-added the explicit green dot for online status */}
              <div className="relative">
                <div className="avatar">
                  <div className="w-12 rounded-full">
                    <img
                      src={user.profilePic || "/avatar.png"}
                      alt={user.fullName}
                    />
                  </div>
                </div>
                {isOnline && (
                  <span className="absolute bottom-1 right-1 size-3 bg-green-500 rounded-full ring-2 ring-base-100" />
                )}
              </div>

              <div className="flex-1 text-left min-w-0">
                <div className="flex justify-between items-center">
                  <p className="font-md truncate font-['Poppins',_sans-serif] ">{user.fullName}</p>
                  <p className="text-xs text-base-content/60 whitespace-nowrap">
                    {lastMessageTimestamp}
                  </p>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-sm text-base-content/70 truncate">
                    <span className="lg:hidden">
                      {user.lastMessage?.text || "No messages yet"}
                    </span>
                    <span className="hidden lg:inline">
                      {isOnline ? "Online" : "Offline"}
                    </span>
                  </p>
                  {unreadCount > 0 && (
                    <div className="badge badge-primary font-bold ml-2">
                      {unreadCount}
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}

        {filteredUsers.length === 0 && (
          <div className="text-center text-base-content/70 mt-10">
            No users found.
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
