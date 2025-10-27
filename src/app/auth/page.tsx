'use client'

import React, { useEffect, useState } from "react";
import Image from "next/image";
import useAuth from "@/services/useAuth";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { saveToken } from "@/services/Token";
import { useUserContext } from "@/context";

type AuthMode = "signIn" | "signUp" | "forgot" | "verify" | "reset";

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("signIn");
  const [currentEmail, setCurrentEmail] = useState<string | undefined>();

  const isLeftDark =
    mode === "signUp" || mode === "forgot" || mode === "reset";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0A1628] via-[#0F1F3A] to-[#050F24] p-4 transition-colors duration-500">
      <div className="flex flex-col lg:flex-row w-full max-w-6xl min-h-[620px] rounded-3xl overflow-hidden shadow-2xl bg-white">
        {/* Left Panel - Logo & Info */}
        <div
          className={`flex flex-col items-center justify-center w-full lg:w-1/2 px-6 sm:px-8 py-8 lg:py-6 transition-all duration-500 ${
            isLeftDark ? "bg-[#050F24] text-white" : "bg-white text-[#050F24]"
          }`}
        >
          <Image
            src="/logo.png"
            alt="Logo"
            width={80}
            height={80}
            className={`mb-4 sm:mb-6 ${isLeftDark ? "" : "invert"}`}
          />
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">WALLETO</h1>
          <p className="text-sm sm:text-base text-center opacity-80 leading-relaxed max-w-xs">
            Giải pháp tài chính cá nhân
            <br />
            Quản lý tài chính và crypto hiệu quả hơn
          </p>

          {mode === "signIn" && (
            <div className="mt-6 sm:mt-10 text-sm sm:text-base text-center">
              Người mới?{" "}
              <button
                onClick={() => setMode("signUp")}
                className="cursor-pointer text-blue-500 hover:underline font-semibold"
              >
                Đăng ký ngay
              </button>
            </div>
          )}

          {mode === "signUp" && (
            <div className="mt-6 sm:mt-10 text-sm sm:text-base text-center">
              Đã có tài khoản?{" "}
              <button
                onClick={() => setMode("signIn")}
                className="cursor-pointer text-blue-400 hover:underline font-semibold"
              >
                Đăng nhập ngay
              </button>
            </div>
          )}

          {(mode === "forgot" || mode === "reset") && (
            <button
              onClick={() => setMode("signIn")}
              className="cursor-pointer mt-6 sm:mt-10 px-6 py-2.5 border border-white/40 rounded-full text-sm sm:text-base hover:bg-white/10 transition-all duration-300 hover:scale-105"
            >
              ← Quay lại
            </button>
          )}
        </div>

        {/* Right Panel - Forms */}
        <div
          className={`flex flex-col items-center justify-center w-full lg:w-1/2 px-6 sm:px-10 py-8 lg:py-6 transition-all duration-500 ${
            isLeftDark ? "bg-white text-[#050F24]" : "bg-[#050F24] text-white"
          }`}
        >
          {mode === "signIn" && <SignIn setMode={setMode} />}

          {mode === "signUp" && <SignUp setMode={setMode} setCurrentEmail={setCurrentEmail} />}
          {mode === "verify" && <VerifyOtp email={currentEmail} setMode={setMode} />}

          {mode === "forgot" && <ForgotPassword setMode={setMode} setCurrentEmail={setCurrentEmail} />}
          {mode === "reset" && <ResetPassword setMode={setMode} currentEmail={currentEmail} />}
        </div>
      </div>
    </div>
  );
}

/* ========================== COMPONENTS ========================== */
const Input = ({
  placeholder,
  type = "text",
  value,
  onChange
}: {
  placeholder: string;
  type?: string;
  value?: string;
  onChange: (value: string) => void
}) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={e => onChange(e.target.value)}
    className="w-full px-4 py-3 sm:py-3.5 mb-3 sm:mb-4 text-sm sm:text-base rounded-xl
      bg-white/10 text-[#94a3b8] placeholder:text-[#94a3b8]/60
      border border-black/50 focus:border-blue-400
      focus:outline-none focus:ring-2 focus:ring-blue-400/40
      transition-all duration-300 hover:border-blue-300"
  />
);

const Button = ({ label, onClick, loading }: { label: string; onClick: () => void; loading: boolean }) => (
  <button
    onClick={onClick}
    disabled={loading}
    className="cursor-pointer w-full py-3 sm:py-3.5 mt-2 sm:mt-3 bg-gradient-to-r from-[#081A32] to-[#0B2142] text-white font-semibold rounded-xl 
    shadow-md hover:shadow-xl hover:brightness-110 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed
    active:scale-95 text-sm sm:text-base"
  >
    {loading ?
      (
        <Loader2 className="animate-spin mx-auto" size={20} />
      ) : label}
  </button>
);

/* ---------------- SIGN IN ---------------- */
function SignIn({ setMode }: { setMode: (m: AuthMode) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();

  const { login, authLoading } = useAuth();
  const userContext = useUserContext();
  const { setUser } = userContext || {};

   const { refresh } = useAuth();

    const fetchToken = async () => {
        try {
            const data = await refresh();
            const token = data?.data?.token;
            saveToken(token);
            setUser?.(data?.data?.infUser);
            router.push('/dashboard');
        } catch (error) {
            setUser?.(undefined);
        }
    }

    useEffect(() => {
        fetchToken();
    }, [])

  const handleLogin = async () => {
    try {
      const data = await login({ email, password });
      saveToken(data?.data?.token);
      setUser?.(data?.data?.infUser);
      setEmail("");
      setPassword("");
      setError("");
      router.push('/dashboard');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Login failed");
      }
    }
  }

  return (
    <div className="w-full max-w-sm text-center">
      <h2 className="text-2xl font-bold mb-2">Chào mừng trở lại!</h2>
      <p className="text-sm opacity-80 mb-6">
        Vui lòng nhập thông tin xác thực của bạn để đăng nhập
      </p>
      <Input placeholder="Email" type="email" value={email} onChange={setEmail} />
      <Input placeholder="Mật khẩu" type="password" value={password} onChange={setPassword} />
      {error && <p className="text-xs text-red-500 mb-2">{error}</p>}
      <p
        className="text-xs opacity-80 mb-2 cursor-pointer hover:underline"
        onClick={() => setMode("forgot")}
      >
        Quên mật khẩu?
      </p>
      <Button label="Đăng nhập" onClick={handleLogin} loading={authLoading} />
    </div>
  );
}

/* ---------------- SIGN UP ---------------- */
function SignUp({ setMode, setCurrentEmail }: { setMode: (m: AuthMode) => void; setCurrentEmail: (email: string) => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const { register, authLoading } = useAuth();

  const handleSignup = async () => {
    try {
      if (password !== confirmPassword) throw new Error("Mật khẩu không khớp");
      if (password.length < 6) throw new Error("Mật khẩu phải có ít nhất 6 ký tự");
      await register({ name, email, password, confirmPassword });

      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setError("");
      setCurrentEmail(email);

      setMode("verify");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Registration failed");
      }
    }
  }

  return (
    <div className="w-full max-w-sm text-center">
      <h2 className="text-2xl font-bold mb-2">Đăng ký</h2>
      <p className="text-sm opacity-80 mb-6">
        Nhập thông tin để đăng ký.
      </p>
      <Input placeholder="Tên" value={name} onChange={setName} />
      <Input placeholder="Email" type="email" value={email} onChange={setEmail} />
      <Input placeholder="Mật khẩu" type="password" value={password} onChange={setPassword} />
      <Input placeholder="Xác nhận mật khẩu" type="password" value={confirmPassword} onChange={setConfirmPassword} />
      {error && <p className="text-xs text-red-500 mb-2">{error}</p>}
      <Button label="SIGN UP" onClick={handleSignup} loading={authLoading} />
    </div>
  );
}

/* ---------------- FORGOT PASSWORD ---------------- */
function ForgotPassword({ setMode, setCurrentEmail }: { setMode: (m: AuthMode) => void; setCurrentEmail: (email: string) => void }) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const { forgotPassword, authLoading } = useAuth();

  const handleForgotPassword = async () => {
    try {
      await forgotPassword(email);
      setEmail("");
      setError("");
      setMode("reset");
      setCurrentEmail(email);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Forgot password request failed");
      }
    }
  };

  return (
    <div className="w-full max-w-sm text-center">
      <h2 className="text-2xl font-bold mb-2">Quên mật khẩu</h2>
      <p className="text-sm opacity-80 mb-6">
        Vui lòng nhập email để đặt lại mật khẩu
      </p>
      <Input placeholder="Email" type="email" value={email} onChange={setEmail} />
      {error && <p className="text-xs text-red-500 mb-2">{error}</p>}
      <Button label="QUÊN MẬT KHẨU" onClick={handleForgotPassword} loading={authLoading} />
    </div>
  );
}

/* ---------------- VERIFY OTP ---------------- */
function VerifyOtp({ email, setMode }: { email?: string, setMode: (m: AuthMode) => void }) {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const { confirmOTPRegister, authLoading } = useAuth();

  const handleVerify = async () => {
    if (!email) return;
    try {
      await confirmOTPRegister(email, otp.trim());
      setOtp("");
      setError("");
      setMode("signIn");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Verification failed");
      }
    }
  }

  return (
    <div className="w-full max-w-sm text-center">
      <h2 className="text-2xl font-bold mb-2">Kiểm tra hộp thư của bạn</h2>
      <p className="text-sm opacity-80 mb-6">
        Vui lòng nhập OTP để tiếp tục
      </p>
      <Input placeholder="OTP" value={otp} onChange={setOtp} />
      {error && <p className="text-xs text-red-500 mb-2">{error}</p>}
      <Button label="XÁC NHẬN" loading={authLoading} onClick={handleVerify} />
    </div>
  );
}

/* ---------------- RESET PASSWORD ---------------- */
function ResetPassword({ currentEmail, setMode }: { currentEmail?: string, setMode: (m: AuthMode) => void }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");

  const { confirmOTPForgotPassword, authLoading } = useAuth();

  const handleReset = async () => {
    try {
      if (newPassword !== confirmPassword) throw new Error("Mật khẩu không khớp");
      if (newPassword.length < 6) throw new Error("Mật khẩu phải có ít nhất 6 ký tự");
      if (!currentEmail) throw new Error("Email không hợp lệ");
      if (!otp) throw new Error("Vui lòng nhập OTP");
      await confirmOTPForgotPassword(currentEmail, otp.trim(), newPassword, confirmPassword);
      setNewPassword("");
      setConfirmPassword("");
      setOtp("");
      setError("");
      setMode("signIn");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Reset password failed");
      }
    }
  };

  return (
    <div className="w-full max-w-sm text-center">
      <h2 className="text-2xl font-bold mb-2">Đặt lại mật khẩu</h2>
      <p className="text-sm opacity-80 mb-6">
        Nhập mật khẩu mới
      </p>
      <Input placeholder="Mật khẩu mới" type="password" value={newPassword} onChange={setNewPassword} />
      <Input placeholder="Xác nhận mật khẩu" type="password" value={confirmPassword} onChange={setConfirmPassword} />
      <Input placeholder="OTP" value={otp} onChange={setOtp} />
      {error && <p className="text-xs text-red-500 mb-2">{error}</p>}
      <Button label="ĐẶT LẠI" onClick={handleReset} loading={authLoading} />
    </div>
  );
}
