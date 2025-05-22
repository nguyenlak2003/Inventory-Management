"use client";
import React, { useState } from "react";

function AccountDetailsCard() {
  const [accountType] = useState("Premium");
  const [sessionId] = useState("abc123xyz789");
  const [activeTime] = useState("365 days");

  const getMaskedSessionId = () => {
    return sessionId.replace(/^(.{4})(.*)(.{4})$/, "$1****$3");
  };

  return (
    <section className="p-6 rounded-lg border border-solid bg-stone-50 border-zinc-100">
      <h2 className="mb-5 text-2xl text-zinc-800">Account Details</h2>
      <div className="mb-4">
        <p className="text-stone-500">
          <span>Account Type: </span>
          <span>{accountType}</span>
        </p>
        <p className="text-stone-500">
          <span>Active Time: </span>
          <span>{activeTime}</span>
        </p>
        <p className="text-stone-500">
          <span>Session ID: </span>
          <span>{getMaskedSessionId()}</span>
        </p>
      </div>
    </section>
  );
}

export default AccountDetailsCard;
