// lib/api.ts
import axios from "axios";

export const fetchUserProfile = async () => {
  const response = await axios.get(
    "https://api.escuelajs.co/api/v1/auth/profile",
    {
      headers: {
        Authorization: `Bearer ${process.env.ACCESS_TOKEN || ""}`,
      },
    }
  );
  return response.data;
};
