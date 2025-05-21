"use client";
import React, { useState } from "react";
import Button from "./Button";

function PasswordChangeCard() {
  const [showPassword, setShowPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const updateCurrentPassword = (event) => {
    setCurrentPassword(event.target.value);
    setPasswordError("");
  };

  const updateNewPassword = (event) => {
    setNewPassword(event.target.value);
    setPasswordError("");
  };

  const updateConfirmPassword = (event) => {
    setConfirmPassword(event.target.value);
    setPasswordError("");
  };

  const validatePassword = () => {
    if (!currentPassword) {
      setPasswordError("Current password is required");
      return false;
    }
    if (newPassword.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      return false;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return false;
    }
    setPasswordError("");
    return true;
  };

  const handlePasswordChange = () => {
    if (validatePassword()) {
      // Simulate API call
      console.log("Password updated");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  return (
    <section className="p-6 rounded-lg border border-solid bg-stone-50 border-zinc-100">
      <h2 className="mb-5 text-2xl text-zinc-800">Change Password</h2>
      <div className="mb-4">
        <label
          htmlFor="current-password"
          className="mb-1.5 block text-neutral-600"
        >
          Current Password
        </label>
        <input
          id="current-password"
          autoComplete="current-password"
          className="p-2.5 mb-2.5 w-full rounded border border-solid border-zinc-300"
          type={showPassword ? "text" : "password"}
          value={currentPassword}
          onChange={updateCurrentPassword}
          onKeyDown={(event) => event.key === "Enter" && handlePasswordChange()}
        />

        <label htmlFor="new-password" className="mb-1.5 block text-neutral-600">
          New Password
        </label>
        <input
          id="new-password"
          autoComplete="new-password"
          className="p-2.5 mb-2.5 w-full rounded border border-solid border-zinc-300"
          type={showPassword ? "text" : "password"}
          value={newPassword}
          onChange={updateNewPassword}
          onKeyDown={(event) => event.key === "Enter" && handlePasswordChange()}
        />

        <label
          htmlFor="confirm-password"
          className="mb-1.5 block text-neutral-600"
        >
          Confirm New Password
        </label>
        <input
          id="confirm-password"
          autoComplete="new-password"
          className="p-2.5 mb-2.5 w-full rounded border border-solid border-zinc-300"
          type={showPassword ? "text" : "password"}
          value={confirmPassword}
          onChange={updateConfirmPassword}
          onKeyDown={(event) => event.key === "Enter" && handlePasswordChange()}
        />

        {passwordError && (
          <p className="mt-1.5 text-sm text-red-600">{passwordError}</p>
        )}

        <button
          className="p-1.5 mb-2.5 bg-transparent cursor-pointer border-none text-stone-500"
          aria-label={showPassword ? "Hide password" : "Show password"}
          onClick={togglePasswordVisibility}
        >
          {showPassword ? <span>Hide</span> : <span>Show</span>} Password
        </button>

        <Button onClick={handlePasswordChange} aria-label="Update password">
          Update Password
        </Button>
      </div>
    </section>
  );
}

export default PasswordChangeCard;
