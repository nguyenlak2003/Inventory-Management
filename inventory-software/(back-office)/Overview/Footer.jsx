"use client";
import React from "react";

function Footer() {
  return (
    <footer className="px-16 py-10 bg-white text-neutral-400">
      <div className="flex justify-between mb-10">
        <div>
          <h3 className="mb-5 text-zinc-800 font-semibold">InventoryPro</h3>
          <p className="max-w-[300px]">
            Streamline your warehouse operations with our cutting-edge inventory
            management solutions.
          </p>
        </div>
        <div className="flex gap-16">
          <nav>
            <h4 className="mb-4 text-zinc-800 font-medium">Company</h4>
            <ul className="p-0 list-none">
              <li className="mb-2.5">
                <a
                  href="#about"
                  className="no-underline text-inherit hover:text-red-600 transition-colors"
                >
                  About
                </a>
              </li>
              <li className="mb-2.5">
                <a
                  href="#careers"
                  className="no-underline text-inherit hover:text-red-600 transition-colors"
                >
                  Careers
                </a>
              </li>
              <li className="mb-2.5">
                <a
                  href="#contact"
                  className="no-underline text-inherit hover:text-red-600 transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </nav>
          <nav>
            <h4 className="mb-4 text-zinc-800 font-medium">Resources</h4>
            <ul className="p-0 list-none">
              <li className="mb-2.5">
                <a
                  href="#blog"
                  className="no-underline text-inherit hover:text-red-600 transition-colors"
                >
                  Blog
                </a>
              </li>
              <li className="mb-2.5">
                <a
                  href="#guides"
                  className="no-underline text-inherit hover:text-red-600 transition-colors"
                >
                  Guides
                </a>
              </li>
              <li className="mb-2.5">
                <a
                  href="#webinars"
                  className="no-underline text-inherit hover:text-red-600 transition-colors"
                >
                  Webinars
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
      <div className="pt-5 text-center border-t border-solid border-t-zinc-100">
        <p>© 2024 InventoryPro. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;
