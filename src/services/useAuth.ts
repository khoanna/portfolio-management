import { useState } from "react"
import APICall from "./API"
import { removeToken } from "./Token"

const useAuth = () => {
  const [authLoading, setAuthLoading] = useState<boolean>(false)

  const register = async ({ name, email, password, confirmPassword }: { name: string, email: string, password: string, confirmPassword: string }) => {
    try {
      setAuthLoading(true)
      const data = await APICall({
        method: "POST",
        body: { name, email, password, confirmPassword },
        endpoint: "/authen/register",
      });
      
      return data;
    } catch (error) {
      throw error;
    } finally {
      setAuthLoading(false)
    }
  }

  const confirmOTPRegister = async (email: string, otp: string) => {
    try {
      setAuthLoading(true)

      const data = await APICall({
        method: "POST",
        body: { email, otp },
        endpoint: "/authen/confirm-otp-register",
      })
      
      return data;

    } catch (error) {
      throw error;
    } finally {
      setAuthLoading(false)
    }
  }

  const login = async ({ email, password }: { email: string, password: string }) => {
    try {
      setAuthLoading(true)
      const data = await APICall({
        method: "POST",
        body: { email, password },
        endpoint: "/authen/login",
        sendWithCookie: true
      })
      console.log(data);
      
      return data;
    } catch (error) {
      throw error;
    } finally {
      setAuthLoading(false)
    }
  }

  const logout = async () => {
    try {
      setAuthLoading(true)
      const data = await APICall({
        method: "POST",
        endpoint: "/authen/logout",
        sendWithCookie: true,
      })
      removeToken();
      return data;
    } catch (error) {
      throw error;
    } finally {
      setAuthLoading(false)
    }
  }

  const refresh = async () => {
    try {
      setAuthLoading(true)
      const data = await APICall({
        method: "POST",
        sendWithCookie: true,
        endpoint: "/authen/refresh-token"
      })
      return data;
    } catch (error) {
      throw error;
    } finally {
      setAuthLoading(false)
    }
  }

  const forgotPassword = async (email: string) => {
    try {
      setAuthLoading(true)
      const data = await APICall({
        method: "POST",
        body: { email },
        endpoint: "/authen/forgot-password"
      })
      return data;
    } catch (error) {
      throw error;
    } finally {
      setAuthLoading(false)
    }
  }

  const confirmOTPForgotPassword = async (email?: string, otp?: string, newPassword?: string, confirmPassword?: string) => {
    try {
      setAuthLoading(true)
      const data = await APICall({
        method: "POST",
        body: { email, otp, newPassword, confirmPassword },
        endpoint: "/authen/change-password"
      })
      return data;
    } catch (error) {
      throw error;
    } finally {
      setAuthLoading(false)
    }
  }

  return {
    login,
    logout,
    refresh,
    authLoading,
    register,
    forgotPassword,
    confirmOTPRegister,
    confirmOTPForgotPassword
  }
}

export default useAuth