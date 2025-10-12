'use client'

import React, { useState } from "react";
import Image from "next/image";

type AuthMode = "signIn" | "signUp" | "forgot" | "verify" | "reset";

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("signIn");
  const isLeftDark =
    mode === "signUp" || mode === "forgot" || mode === "reset";

  return (
    <div className="min-h-screen flex items-center justify-center bg-foreground transition-colors duration-500">
      <div className="flex w-[90%] max-w-5xl h-[620px] rounded-2xl overflow-hidden shadow-2xl bg-white">
        <div
          className={`flex flex-col items-center justify-center w-1/2 px-8 py-6 transition-all duration-500 ${
            isLeftDark ? "bg-[#050F24] text-white" : "bg-white text-[#050F24]"
          }`}
        >
          <Image
            src="/logo.png"
            alt="Logo"
            width={70}
            height={70}
            className={`mb-6 ${isLeftDark ? "" : "invert"}`}
          />
          <h1 className="text-2xl font-bold mb-3">WALLETO</h1>
          <p className="text-sm text-center opacity-80 leading-relaxed">
            Giải pháp tài chính cá nhân
            <br />
            Quản lý tài chính và crypto hiệu quả hơn
          </p>

          {mode === "signIn" && (
            <div className="mt-10 text-sm text-center">
              New to our platform?{" "}
              <button
                onClick={() => setMode("signUp")}
                className="cursor-pointer text-blue-500 hover:underline"
              >
                Sign Up now
              </button>
            </div>
          )}

          {mode === "signUp" && (
            <div className="mt-10 text-sm text-center">
              Already have an account?{" "}
              <button
                onClick={() => setMode("signIn")}
                className="cursor-pointer text-blue-400 hover:underline"
              >
                Sign In now
              </button>
            </div>
          )}

          {(mode === "forgot" || mode === "reset") && (
            <button
              onClick={() => setMode("signIn")}
              className="cursor-pointer mt-10 px-5 py-2 border border-white/40 rounded-full text-sm hover:bg-white/10 transition"
            >
              ← Back
            </button>
          )}
        </div>

        <div
          className={`flex flex-col items-center justify-center w-1/2 px-10 transition-all duration-500 ${
            isLeftDark ? "bg-white text-[#050F24]" : "bg-[#050F24] text-white"
          }`}
        >
          {mode === "signIn" && <SignIn setMode={setMode} />}
          {mode === "signUp" && <SignUp setMode={setMode} />}
          {mode === "forgot" && <ForgotPassword />}
          {mode === "verify" && <VerifyOtp />}
          {mode === "reset" && <ResetPassword />}
        </div>
      </div>
    </div>
  );
}

/* ========================== COMPONENTS ========================== */

const Input = ({
  placeholder,
  type = "text",
}: {
  placeholder: string;
  type?: string;
}) => (
  <input
    type={type}
    placeholder={placeholder}
    className="w-full px-4 py-3 mb-4 text-sm rounded-xl
      bg-white/10 text-zinc-500
      border border-black/50 focus:border-blue-400
      focus:outline-none focus:ring-0 focus:ring-blue-400/40
      transition-all duration-300"
  />
);

const Button = ({ label }: { label: string }) => (
  <button
    className="cursor-pointer w-full py-2.5 mt-2 bg-gradient-to-r from-[#081A32] to-[#0B2142] text-white font-semibold rounded-xl 
    shadow-md hover:shadow-lg hover:brightness-110 transition duration-300"
  >
    {label}
  </button>
);

/* ---------------- SIGN IN ---------------- */
function SignIn({ setMode }: { setMode: (m: AuthMode) => void }) {
  return (
    <div className="w-full max-w-sm text-center">
      <h2 className="text-2xl font-bold mb-2">Welcome Back!</h2>
      <p className="text-sm opacity-80 mb-6">
        Please enter your credentials to log in
      </p>
      <Input placeholder="Email" type="email" />
      <Input placeholder="Password" type="password" />
      <p
        className="text-xs opacity-80 mb-6 cursor-pointer hover:underline"
        onClick={() => setMode("forgot")}
      >
        Forgot password?
      </p>
      <Button label="SIGN IN" />
    </div>
  );
}

/* ---------------- SIGN UP ---------------- */
function SignUp({setMode}: {setMode: (m: AuthMode) => void}) {
  return (
    <div className="w-full max-w-sm text-center">
      <h2 className="text-2xl font-bold mb-2">Sign Up</h2>
      <p className="text-sm opacity-80 mb-6">
        Please provide your information to sign up.
      </p>
      <Input placeholder="Name" />
      <Input placeholder="Email" type="email" />
      <Input placeholder="Password" type="password" />
      <Input placeholder="Confirm Password" type="password" />
      <Button label="SIGN UP" />
    </div>
  );
}

/* ---------------- FORGOT PASSWORD ---------------- */
function ForgotPassword() {
  return (
    <div className="w-full max-w-sm text-center">
      <h2 className="text-2xl font-bold mb-2">Forgot Password</h2>
      <p className="text-sm opacity-80 mb-6">
        Please enter your username to reset password
      </p>
      <Input placeholder="Email" type="email" />
      <Button label="RESET PASSWORD" />
    </div>
  );
}

/* ---------------- VERIFY OTP ---------------- */
function VerifyOtp() {
  return (
    <div className="w-full max-w-sm text-center">
      <h2 className="text-2xl font-bold mb-2">Check your Mailbox</h2>
      <p className="text-sm opacity-80 mb-6">
        Please enter the OTP to proceed
      </p>
      <Input placeholder="OTP" />
      <Button label="VERIFY" />
    </div>
  );
}

/* ---------------- RESET PASSWORD ---------------- */
function ResetPassword() {
  return (
    <div className="w-full max-w-sm text-center">
      <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
      <p className="text-sm opacity-80 mb-6">
        Please enter your new password
      </p>
      <Input placeholder="New Password" type="password" />
      <Input placeholder="Confirm Password" type="password" />
      <Button label="RESET PASSWORD" />
    </div>
  );
}
