import { useEffect, useState } from "react";
import { useChatStore } from "../Store/useChatStore";
import { useAuthStore } from "../Store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users } from "lucide-react";
import { formatDistanceToNowStrict } from "date-fns"; // For formatting the timestamp
// Just a random comment to update commit
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
          <span className="font-medium items-center flex "> <Users className="size-6" /> &nbsp; Contacts</span>
          <span className="font-medium" >Invite</span>
        </div>
        <div className="mt-3 flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">
            ({onlineUsers.length > 0 ? onlineUsers.length - 1 : 0} online)
          </span>
        </div>
      </div>

      <div className="overflow-y-auto w-full py-3">
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
              className={`w-full p-3 flex items-center gap-3 hover:bg-base-300 transition-colors ${
                selectedUser?._id === user._id ? "bg-base-300" : ""
              }`}
            >
              <div className="relative">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.fullName}
                  className="size-12 object-cover rounded-full"
                />
                {isOnline && (
                  <span className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full ring-2 ring-base-100" />
                )}
              </div>

              <div className="flex-1 flex items-center justify-between min-w-0">
                <div className="text-left">
                  <div className="flex items-center justify-between w-full">
                    <p className="font-medium truncate">{user.fullName}</p>
                    <p className="text-xs text-base-content/60 whitespace-nowrap ml-2">
                      {lastMessageTimestamp}
                    </p>
                  </div>
                  <div className="flex items-center justify-between w-full mt-1">
                    <p className="text-sm text-base-content/70 truncate">
                      {user.lastMessage?.text || "No messages yet"}
                    </p>
                    {unreadCount > 0 && (
                      <div className="badge badge-secondary font-bold ml-auto">
                        {unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </button>
          );
        })}
        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No users found</div>
        )}
      </div>
    </aside>
  );
};
export default Sidebar;
