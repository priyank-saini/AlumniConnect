import {useState} from "react";
import {
    Box,
    IconButton,
    InputBase,
    Typography,
    Select,
    MenuItem,
    FormControl,
    useTheme,
    useMediaQuery
} from "@mui/material";
import {
    Search,
    Message,
    DarkMode,
    LightMode,
    Notifications,
    Help,
    Menu,
    Close
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "@/pages/state";
import { useRouter } from "next/router";

const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  
  const theme = useTheme();
  const router = useRouter();
  // const neutralLight = theme.palette.neutral.light;
  // const dark = theme.palette.neutral.dark;
  // const background = theme.palette.background.default;
  // const primaryLight = theme.palette.primary.light;
  // const alt = theme.palette.background.alt;

  const fullName = `${user?.firstName || "User"} ${user?.lastName || "Name"}`;

  return (
    <div className="px-24 py-8 flex justify-between items-center bg-white">
      {/* Left Side */}
      <div className="flex gap-10 items-center">
        <img src="assets/lnmiit.png" alt="" className="w-[100px]"/>
        <img src="assets/logo.png" alt="" className="w-[250px] cursor-pointer" onClick={() => router.push("/")}/>
      </div>

      {isNonMobileScreens && (
        <div className="flex gap-12 items-center rounded-lg py-0.5 px-6 bg-slate-200 h-[35px]">
          <InputBase placeholder="Search..." className="text-gray-600">
            <IconButton>
              <Search />
            </IconButton>
          </InputBase>
        </div>
      )}

      {/* Right Side */}
      {isNonMobileScreens ? (
        <div className="flex gap-8 items-center">
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <DarkMode className="text-2xl" />
            ) : (
              <LightMode className="text-2xl text-dark" />
            )}
          </IconButton>
          <Message className="text-2xl" />
          <Notifications className="text-2xl" />
          <FormControl variant="standard">
            <Select
              value={fullName}
              className="bg-neutral-light w-36 rounded-md p-2"
              input={<InputBase />}
            >
              <MenuItem value={fullName}>
                <span>{fullName}</span>
              </MenuItem>
              <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
            </Select>
          </FormControl>
        </div>
      ) : (
        <IconButton onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}>
          <Menu />
        </IconButton>
      )}

      {/* Mobile Menu */}
      {!isNonMobileScreens && isMobileMenuToggled && (
        <div className="fixed right-0 bottom-0 h-full z-10 max-w-[500px] min-w-[300px] bg-background">
          {/* Close Button */}
          <div className="flex justify-end p-4">
            <IconButton onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}>
              <Close />
            </IconButton>
          </div>

          {/* Mobile Menu Items */}
          <div className="flex flex-col gap-12 items-center">
            <IconButton onClick={() => dispatch(setMode())}>
              {theme.palette.mode === "dark" ? (
                <DarkMode className="text-2xl" />
              ) : (
                <LightMode className="text-2xl text-dark" />
              )}
            </IconButton>
            <Message className="text-2xl" />
            <Notifications className="text-2xl" />
            <Help className="text-2xl" />
            <FormControl variant="standard">
              <Select
                value={fullName}
                className="bg-neutral-light w-36 rounded-md p-2"
                input={<InputBase />}
              >
                <MenuItem value={fullName}>
                  <span>{fullName}</span>
                </MenuItem>
                <MenuItem onClick={() => dispatch(setLogout())}>Log Out</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
      )}
    </div>
    );
}

export default Navbar;