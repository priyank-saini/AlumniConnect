import { useState } from "react";
import {
  TextField,
  IconButton,
  InputBase,
  Select,
  MenuItem,
  FormControl,
  useTheme,
  useMediaQuery,
  Box,
  Typography,
} from "@mui/material";
import {
  Message,
  DarkMode,
  LightMode,
  Notifications,
  Help,
  Menu,
  Close,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { setMode, setLogout } from "@/pages/state";
import { useRouter } from "next/router";
import SearchIcon from "@mui/icons-material/Search";

const Navbar = () => {
  const [isMobileMenuToggled, setIsMobileMenuToggled] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  const theme = useTheme();
  const router = useRouter();

  const handleChat = () => {
    router.push("/chat");
  };

  const handleLogout = async () => {
    try {
      await dispatch(setLogout());
      router.push("/");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  const fullName = `${user?.firstName || "User"} ${user?.lastName || "Name"}`;

  return (
    <Box
      px={10}
      py={2}
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      bgcolor="background.paper"
    >
      {/* Left Side */}
      <Box display="flex" gap={2} alignItems="center">
        <img src="assets/lnmiit.png" alt="LNMIIT Logo" style={{ width: 80 }} />
        <img
          src="assets/logo.png"
          alt="Logo"
          style={{ width: 200, cursor: 'pointer' }}
          onClick={() => router.push("/")}
        />
      </Box>

      {/* Search Bar */}
      {isNonMobileScreens && (
        <Box
          display="flex"
          alignItems="center"
          bgcolor="grey.100"
          borderRadius="8px"
        >
          <TextField
            placeholder="Search..."
            fullWidth
            variant="outlined"
            size="small"
            InputProps={{
              endAdornment: (
                <IconButton
                  type="submit"
                  aria-label="search"
                >
                  <SearchIcon fontSize="small" />
                </IconButton>
              ),
            }}
            sx={{ bgcolor: 'background.default', borderRadius: '8px' }}
          />
        </Box>
      )}

      {/* Right Side */}
      {isNonMobileScreens ? (
        <Box display="flex" gap={2} alignItems="center">
          <IconButton onClick={() => dispatch(setMode())}>
            {theme.palette.mode === "dark" ? (
              <DarkMode fontSize="small" />
            ) : (
              <LightMode fontSize="small" />
            )}
          </IconButton>
          <IconButton onClick={handleChat}>
            <Message fontSize="small" />
          </IconButton>
          <IconButton>
            <Notifications fontSize="small" />
          </IconButton>
          <FormControl variant="standard">
            <Select
              value={fullName}
              className="bg-neutral-light w-36 rounded-md p-2"
              input={<InputBase />}
              MenuProps={{
                PaperProps: {
                  sx: { borderRadius: 1 }
                }
              }}
            >
              <MenuItem value={fullName}>
                <Typography variant="body2">{fullName}</Typography>
              </MenuItem>
              <MenuItem onClick={handleLogout}>
                <Typography variant="body2">Log Out</Typography>
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
      ) : (
        <IconButton onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}>
          <Menu fontSize="small" />
        </IconButton>
      )}

      {/* Mobile Menu */}
      {!isNonMobileScreens && isMobileMenuToggled && (
        <Box
          position="fixed"
          right={0}
          bottom={0}
          height="100%"
          width="300px"
          bgcolor="background.paper"
          zIndex="modal"
          display="flex"
          flexDirection="column"
          p={2}
        >
          <Box display="flex" justifyContent="flex-end" mb={2}>
            <IconButton onClick={() => setIsMobileMenuToggled(!isMobileMenuToggled)}>
              <Close fontSize="small" />
            </IconButton>
          </Box>
          <Box display="flex" flexDirection="column" gap={2} alignItems="center">
            <IconButton onClick={() => dispatch(setMode())}>
              {theme.palette.mode === "dark" ? (
                <DarkMode fontSize="small" />
              ) : (
                <LightMode fontSize="small" />
              )}
            </IconButton>
            <IconButton onClick={handleChat}>
              <Message fontSize="small" />
            </IconButton>
            <IconButton>
              <Notifications fontSize="small" />
            </IconButton>
            <IconButton>
              <Help fontSize="small" />
            </IconButton>
            <FormControl variant="standard">
              <Select
                value={fullName}
                className="bg-neutral-light w-36 rounded-md p-2"
                input={<InputBase />}
                MenuProps={{
                  PaperProps: {
                    sx: { borderRadius: 1 }
                  }
                }}
              >
                <MenuItem value={fullName}>
                  <Typography variant="body2">{fullName}</Typography>
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <Typography variant="body2">Log Out</Typography>
                </MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default Navbar;
