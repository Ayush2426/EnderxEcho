import { Link } from "react-router-dom";
import { useAuthStore } from "../Store/useAuthStore";
import { LogOut, Settings, User, BarChart3, MessagesSquare } from "lucide-react";
import logo from "../Assets/Logo.png";
import { SocialButton } from "./SocialButton";

const Navbar = () => {
  const { logout, authUser } = useAuthStore();

  return (
    <header
      className="bg-base-100 border-b border-base-300 fixed w-full top-0 z-40 
    backdrop-blur-lg bg-base-100/80"
    >
      <div className="container mx-auto px-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Left Side: Logo and Social Links (Unchanged) */}
          <div className="flex items-center gap-8">
            <Link
              to="/"
              className="flex items-center gap-2.5 hover:opacity-80 transition-all"
            >
              <div className="size-9 rounded-lg bg-primary/10 flex items-center justify-center">
                <img src={logo} alt="EnderEcho Logo" />
              </div>
              <h1 className="text-lg font-bold">EnderEcho</h1>
            </Link>
            <SocialButton />
          </div>

          {/* Right Side: User Actions */}
          <div className="flex items-center">
            {authUser ? (
              // If user is logged in, show a dropdown menu
              <div className="dropdown dropdown-end">
                {/* This is the dropdown trigger (user's avatar) */}
                <div
                  tabIndex={0}
                  role="button"
                  className="btn btn-ghost btn-circle avatar"
                >
                  <div className="w-10 rounded-full">
                    <img
                      alt="User Profile"
                      // NOTE: Assuming your authUser object has a 'profilePic' property.
                      // If not, it will fall back to a default image or you can use an icon.
                      src={
                        authUser.profilePic ||
                        "https://static.vecteezy.com/system/resources/thumbnails/009/292/244/small/default-avatar-icon-of-social-media-user-vector.jpg"
                      }
                    />
                  </div>
                </div>

                {/* This is the dropdown menu content */}
                <ul
                  tabIndex={0}
                  className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
                >
                  <li>
                    <Link to="/profile" className="justify-between">
                      Profile
                      <User className="w-4 h-4" />
                    </Link>
                  </li>
                  <li>
                    <Link to="/stats" className="justify-between">
                      Statistics
                      <BarChart3 className="w-4 h-4" />{" "}
                      {/* Remember to import BarChart3 from lucide-react */}
                    </Link>
                  </li>
                  <li>
                    <Link to="/settings" className="justify-between">
                      Settings
                      <Settings className="w-4 h-4" />
                    </Link>
                  </li>
                  <li>
                    <Link to="/feedback" className="justify-between">
                      Feedback
                      <MessagesSquare className="w-4 h-4" />
                    </Link>
                  </li>
                  <div className="divider my-1" />
                  <li>
                    <button onClick={logout} className="justify-between">
                      Logout
                      <LogOut className="w-4 h-4" />
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              // Optional: If user is not logged in, you can show a Login button
              <Link to="/login" className="btn btn-primary btn-sm">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
