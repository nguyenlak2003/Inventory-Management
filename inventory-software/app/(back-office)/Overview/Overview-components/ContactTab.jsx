"use client";
import React, { useState } from "react";

function ContactTab() {
  const [contactForm, setContactForm] = useState({
    name: "",
    message: "",
  });

  const handleContactSubmit = (event) => {
    event.preventDefault();
    // Simulate form submission
    console.log("Form submitted:", contactForm);
    setContactForm({
      name: "",
      message: "",
    });
  };

  const updateContactForm = (field, value) => {
    setContactForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <section role="tabpanel" id="panel-contact" aria-labelledby="tab-contact">
      <h2 className="mb-6 text-3xl text-zinc-900">Contact Support</h2>
      <div className="grid gap-8 mb-8 grid-cols-[1fr_1fr] max-sm:grid-cols-[1fr]">
        <img
          alt="Customer support team"
          src="https://images.pexels.com/photos/7731373/pexels-photo-7731373.jpeg"
          className="object-cover overflow-hidden w-full rounded-lg aspect-square shadow-[0_4px_8px_rgba(0,0,0,0.1)]"
        />
        <form className="max-w-[600px]" onSubmit={handleContactSubmit}>
          <div className="mb-5">
            <label htmlFor="contact-name" className="mb-2 block">
              Name
            </label>
            <input
              id="contact-name"
              type="text"
              className="p-2.5 w-full rounded border border-solid border-zinc-500"
              value={contactForm.name}
              onChange={(event) =>
                updateContactForm("name", event.target.value)
              }
            />
          </div>
          <div className="mb-5">
            <label htmlFor="contact-message" className="mb-2 block">
              Message
            </label>
            <textarea
              id="contact-message"
              className="p-2.5 w-full rounded border border-solid border-zinc-500 min-h-[150px]"
              value={contactForm.message}
              onChange={(event) =>
                updateContactForm("message", event.target.value)
              }
            />
          </div>
          <button
            type="submit"
            className="px-8 py-3 bg-red-600 rounded cursor-pointer border-none text-white hover:bg-red-700 transition-colors"
          >
            Send Message
          </button>
        </form>
      </div>
    </section>
  );
}

export default ContactTab;
