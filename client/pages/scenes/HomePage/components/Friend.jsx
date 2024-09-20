import React from "react";
import { Avatar, Typography, Box, Badge } from "@mui/material";

function Friend({ picturePath, firstName, lastName, location, isActive }) {
  return (
    <Box display="flex" gap={2} alignItems="center">
      {/* Avatar with image */}
      <Avatar
        alt={`${firstName} ${lastName}`}
        src={picturePath}
        sx={{ width: 55, height: 55 }}
      />

      {/* Friend Info */}
      <Box flex={1}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          {/* Name */}
          <Typography variant="h6" fontWeight={700}>
            {`${firstName} ${lastName}`}
          </Typography>

          {/* Active status with Badge */}
          <Badge
            variant="dot"
            color={isActive ? "success" : "error"}
            overlap="circular"
            sx={{
              "& .MuiBadge-dot": { height: 12, width: 12, borderRadius: "50%" },
            }}
          />
        </Box>

        {/* Location */}
        <Typography variant="body2" fontWeight={500} color="textSecondary">
          {location}
        </Typography>
      </Box>
    </Box>
  );
}

export default Friend;
