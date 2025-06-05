import React from "react";

function AboutTab() {
  return (
    <section role="tabpanel" id="panel-about" aria-labelledby="tab-about">
      <h2 className="mb-6 text-3xl text-zinc-900">About Our System</h2>
      <div className="grid gap-8 mb-8 grid-cols-[1fr_1fr] max-sm:grid-cols-[1fr]">
        <img
          alt="Inventory tracking interface"
          src="https://images.pexels.com/photos/1188751/pexels-photo-1188751.jpeg"
          className="object-cover overflow-hidden w-full rounded-lg aspect-square shadow-[0_4px_8px_rgba(0,0,0,0.1)]"
        />
        <p className="text-base leading-relaxed text-zinc-600">
          Inventory Pro is a comprehensive inventory management solution
          designed to streamline your business operations. Our system helps you
          track stock levels, manage orders, and analyze sales performance all
          in one place.
        </p>
      </div>
    </section>
  );
}

export default AboutTab;
