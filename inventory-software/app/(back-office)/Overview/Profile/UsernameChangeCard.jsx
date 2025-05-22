"use client";
import React, { useState } from "react";
import Button from "./Button";

function UsernameChangeCard() {
  const [username, setUsername] = useState("JohnDoe");
  const [newUsername, setNewUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");

  const updateNewUsername = (event) => {
    setNewUsername(event.target.value);
    setUsernameError("");
  };

  const validateUsername = () => {
    if (!newUsername) {
      setUsernameError("Username is required");
      return false;
    }
    if (newUsername.length < 3) {
      setUsernameError("Username must be at least 3 characters");
      return false;
    }
    setUsernameError("");
    return true;
  };

  const handleUsernameChange = () => {
    if (validateUsername()) {
      // Simulate API call
      setUsername(newUsername);
      setNewUsername("");
      console.log("Username updated");
    }
  };

  return (
    <section className="p-6 rounded-lg border border-solid bg-stone-50 border-zinc-100">
      <h2 className="mb-5 text-2xl text-zinc-800">Change Username</h2>
      <div className="mb-4">
        <p className="mb-2.5 text-stone-500">
          <span>Current Username: </span>
          <span>{username}</span>
        </p>

        <label htmlFor="new-username" className="mb-1.5 block text-neutral-600">
          New Username
        </label>
        <input
          id="new-username"
          type="text"
          autoComplete="username"
          className="p-2.5 mb-2.5 w-full rounded border border-solid border-zinc-300"
          value={newUsername}
          onChange={updateNewUsername}
          onKeyDown={(event) => event.key === "Enter" && handleUsernameChange()}
        />

        {usernameError && (
          <p className="mt-1.5 text-sm text-red-600">{usernameError}</p>
        )}

        <Button onClick={handleUsernameChange} aria-label="Update username">
          Update Username
        </Button>
      </div>
    </section>
  );
}

export default UsernameChangeCard;
