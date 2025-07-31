import { useNavigate } from "react-router-dom";
import { register } from "../../services/api";
import { useState } from "react";
import toast from "react-hot-toast";

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const registerUser = async (formData) => {
    setIsLoading(true);

    try {
      const response = await register(formData);

      if (response.error) {
        toast.error(
          response.e?.response?.data?.message ||
          "Error registering user"
        );
        return null;
      } else {
        return response.data;
      }
    } catch (error) {
      toast.error(error.message || "Registration failed");
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    registerUser,
    isLoading
  };
};