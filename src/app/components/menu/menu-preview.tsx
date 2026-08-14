"use client";

import React, { useRef } from "react";
import {
  PREVIEWS,
  DEFAULT_PREVIEW_KEY,
  type MenuPreview as Preview,
  type PreviewVideo,
} from "./menu-data";

/**
 * Right-hand panel of the full-screen menu. The layout is chosen by the
 * preview's `variant`, so each destination gets a shape that suits it —
 * a split image/text card, a video reel, blog rows, products, or service
 * cards.
 *
 * The wrapper is re-keyed on every change so the CSS enter animation replays.
 */
export default function MenuPreview({ activeKey }: { activeKey: string }) {
  const preview: Preview = PREVIEWS[activeKey] ?? PREVIEWS[DEFAULT_PREVIEW_KEY];

  return (
    <div className="w-full">
      <div key={activeKey} className="menu-preview-enter">
        {preview.variant === "default" && <DefaultPanel preview={preview} />}
        {preview.variant === "lookbook" && <LookbookPanel preview={preview} />}
        {preview.variant === "blog" && <BlogPanel preview={preview} />}
        {preview.variant === "shop" && <ShopPanel preview={preview} />}
        {preview.variant === "contact" && <ContactPanel preview={preview} />}
        {preview.variant === "cards" && <CardsPanel preview={preview} />}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Shared bits                                                         */
/* ------------------------------------------------------------------ */

function PanelHeader({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body?: string;
}) {
  return (
    <div className="mb-6">
      <p className="gotham text-[11px] tracking-[5px] uppercase text-white/55 mb-3">
        {eyebrow}
      </p>
      <h3 className="valturin text-[27px] xl:text-[32px] leading-[1.15] text-white">
        {title}
      </h3>
      <div className="w-[70px] h-[1px] bg-white/35 mt-3 xl:mt-4" />
      {body && (
        <p className="gotham text-[13px] xl:text-[14px] leading-[24px] xl:leading-[26px] text-white/70 font-light mt-3 xl:mt-4 max-w-[440px]">
          {body}
        </p>
      )}
    </div>
  );
}

function Frame({
  src,
  alt,
  className = "",
}: {
  src: string;
  alt: string;
  className?: string;
}) {
  return (
    // Callers supply their own rounding, so none is set here.
    <div className={`relative overflow-hidden bg-black/20 ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Default — text left, image right                                    */
/* ------------------------------------------------------------------ */

function DefaultPanel({
  preview,
}: {
  preview: Extract<Preview, { variant: "default" }>;
}) {
  return (
    <div className="grid grid-cols-[1fr_1fr] gap-8 items-center">
      <div>
        <p className="gotham text-[11px] tracking-[5px] uppercase text-white/55 mb-3">
          {preview.eyebrow}
        </p>
        <h3 className="valturin text-[29px] xl:text-[34px] leading-[1.15] text-white">
          {preview.title}
        </h3>
        <div className="w-[70px] h-[1px] bg-white/35 mt-4 mb-5" />
        <p className="gotham text-[14px] xl:text-[15px] leading-[26px] xl:leading-[28px] text-white/70 font-light">
          {preview.body}
        </p>
      </div>

      <div className="relative">
        {/* Offset frame, echoing the service-detail overview treatment */}
        <div className="absolute -inset-3 border border-white/25 rounded-[22px] translate-x-3 translate-y-3 pointer-events-none" />
        <Frame
          src={preview.image}
          alt={preview.title}
          className="aspect-[3/4] max-h-[54vh] rounded-[20px]"
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Lookbook — 2x2 reels that play on hover                             */
/* ------------------------------------------------------------------ */

function LookbookPanel({
  preview,
}: {
  preview: Extract<Preview, { variant: "lookbook" }>;
}) {
  return (
    <div>
      <PanelHeader
        eyebrow={preview.eyebrow}
        title={preview.title}
        body={preview.body}
      />
      <div className="grid grid-cols-2 gap-4">
        {preview.videos.map((video) => (
          <VideoTile key={video.src} video={video} />
        ))}
      </div>
    </div>
  );
}

function VideoTile({ video }: { video: PreviewVideo }) {
  const ref = useRef<HTMLVideoElement>(null);

  const play = () => {
    // play() rejects if the browser blocks it; nothing to recover, so ignore.
    ref.current?.play().catch(() => {});
  };

  const stop = () => {
    const element = ref.current;
    if (!element) return;
    element.pause();
    element.currentTime = 0;
  };

  return (
    <div
      onMouseEnter={play}
      onMouseLeave={stop}
      className="group/reel relative rounded-[18px] overflow-hidden border border-white/15 hover:border-white/45 transition-colors duration-300"
    >
      <video
        ref={ref}
        src={video.src}
        muted
        loop
        playsInline
        preload="metadata"
        className="w-full aspect-[4/5] max-h-[46vh] object-cover transition-transform duration-700 group-hover/reel:scale-105"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

      {/* Play affordance, fades out while the reel is playing */}
      <span className="absolute inset-0 flex items-center justify-center opacity-100 group-hover/reel:opacity-0 transition-opacity duration-300">
        <span className="w-[38px] h-[38px] rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-[12px] pl-[2px]">
          ▶
        </span>
      </span>

      <p className="absolute bottom-3 left-4 right-4 gotham text-[12px] tracking-[1px] text-white truncate">
        {video.label}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Glory News — 2 rows: image left, copy + read more right             */
/* ------------------------------------------------------------------ */

function BlogPanel({
  preview,
}: {
  preview: Extract<Preview, { variant: "blog" }>;
}) {
  return (
    <div>
      <PanelHeader
        eyebrow={preview.eyebrow}
        title={preview.title}
        body={preview.body}
      />

      <div className="flex flex-col gap-5">
        {preview.posts.map((post, index) => (
          <article
            key={index}
            className="group/post flex gap-5 rounded-[18px] border border-white/15 hover:border-white/40 bg-black/10 p-4 transition-colors duration-300"
          >
            <Frame
              src={post.image}
              alt={post.title}
              className="w-[150px] shrink-0 aspect-[4/3] rounded-[14px]"
            />

            <div className="min-w-0">
              <p className="gotham text-[11px] tracking-[2px] uppercase text-white/50 mb-2">
                {post.date} · {post.readTime}
              </p>

              <h4 className="valturin text-[17px] leading-[24px] text-white mb-2 line-clamp-2">
                {post.title}
              </h4>

              <p className="gotham text-[13px] leading-[22px] text-white/65 font-light line-clamp-2">
                {post.excerpt}
              </p>

              <a
                href={post.href}
                className="inline-flex items-center gap-2 mt-3 gotham text-[11px] tracking-[2px] uppercase text-white hover:text-[#f3e3c6] transition-colors duration-300"
              >
                Read More
                <span className="inline-block transition-transform duration-300 group-hover/post:translate-x-1">
                  →
                </span>
              </a>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Shop — product grid                                                 */
/* ------------------------------------------------------------------ */

function ShopPanel({
  preview,
}: {
  preview: Extract<Preview, { variant: "shop" }>;
}) {
  return (
    <div>
      <PanelHeader eyebrow={preview.eyebrow} title={preview.title} />

      <div className="grid grid-cols-2 gap-5">
        {preview.products.map((product) => (
          <a
            key={product.title}
            href="/shop"
            className="group/product relative block rounded-[20px] overflow-hidden border border-white/15 hover:border-[#f3e3c6]/60 bg-gradient-to-b from-white/[0.08] to-white/[0.02] transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_20px_40px_rgba(0,0,0,0.3)]"
          >
            <div className="relative aspect-square max-h-[38vh] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover/product:scale-[1.08]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

              <span className="absolute top-3 right-3 rounded-full bg-[#f3e3c6] text-[#5c4436] gotham text-[11px] font-bold px-3 py-[5px]">
                {product.price}
              </span>
            </div>

            <div className="px-4 py-3.5 flex items-center justify-between gap-2">
              <p className="gotham text-[13px] leading-[19px] text-white truncate">
                {product.title}
              </p>
              <span className="gotham text-[13px] text-white/45 shrink-0 transition-all duration-300 group-hover/product:text-white group-hover/product:translate-x-0.5">
                →
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Contact — intro row + appointment row                               */
/* ------------------------------------------------------------------ */

function ContactPanel({
  preview,
}: {
  preview: Extract<Preview, { variant: "contact" }>;
}) {
  return (
    <div className="flex flex-col gap-6">
      {/* Row 1 — copy left, image right, matching the About Us layout */}
      <div className="flex gap-6 items-center">
        <div className="min-w-0">
          <p className="gotham text-[11px] tracking-[5px] uppercase text-white/55 mb-3">
            {preview.eyebrow}
          </p>
          <h3 className="valturin text-[26px] xl:text-[30px] leading-[1.15] text-white mb-3">
            {preview.title}
          </h3>
          <div className="w-[60px] h-[1px] bg-white/35 mb-4" />
          <p className="gotham text-[13px] leading-[23px] text-white/70 font-light line-clamp-4">
            {preview.body}
          </p>
        </div>

        <Frame
          src={preview.image}
          alt={preview.title}
          className="w-[42%] shrink-0 aspect-[4/3] max-h-[32vh] rounded-[18px]"
        />
      </div>

      {/* Row 2 — appointment details */}
      <div className="rounded-[18px] border border-white/15 bg-black/10 p-6">
        <h4 className="gotham text-[11px] tracking-[4px] uppercase text-white/55 border-b border-white/20 pb-3 mb-5">
          By Appointment Only
        </h4>

        <a
          href={preview.phoneHref}
          className="flex items-center gap-4 mb-4 text-[15px] gotham text-white hover:text-[#f3e3c6] transition-colors duration-300"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.864-1.051l-3.219-.536a2.25 2.25 0 00-2.15.586l-1.332 1.332c-1.25-.56-2.43-1.28-3.486-2.136a13.31 13.31 0 01-2.136-3.486l1.332-1.332a2.25 2.25 0 00.586-2.15l-.536-3.22C7.716 2.601 7.266 2.25 6.75 2.25H5.372c-1.12 0-2.072.84-2.146 1.954C3.064 4.887 2.25 5.803 2.25 6.75z" />
          </svg>
          {preview.phone}
        </a>

        {/* Map link — set CONTACT_MAP_HREF in menu-data.ts */}
        <a
          href={preview.mapHref}
          className="flex items-center gap-4 text-[15px] gotham text-white hover:text-[#f3e3c6] transition-colors duration-300"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
          </svg>
          {preview.address}
        </a>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Services / Packages — rows of two cards                             */
/* ------------------------------------------------------------------ */

function CardsPanel({
  preview,
}: {
  preview: Extract<Preview, { variant: "cards" }>;
}) {
  return (
    <div>
      <PanelHeader eyebrow={preview.eyebrow} title={preview.title} />

      <div className="grid grid-cols-2 gap-4">
        {preview.cards.map((card) => (
          <a
            key={card.href}
            href={card.href}
            className="group/card flex gap-4 rounded-[18px] border border-white/15 hover:border-[#f3e3c6]/60 bg-black/10 p-3.5 transition-all duration-500 hover:-translate-y-1"
          >
            <Frame
              src={card.image}
              alt={card.title}
              className="w-[92px] shrink-0 aspect-[3/4] rounded-[13px]"
            />

            <div className="min-w-0 flex flex-col">
              <h4 className="valturin text-[16px] leading-[21px] text-white mb-2 line-clamp-2">
                {card.title}
              </h4>

              <p className="gotham text-[12px] leading-[19px] text-white/60 font-light line-clamp-3">
                {card.body}
              </p>

              <span className="inline-flex items-center gap-1.5 mt-auto pt-2.5 gotham text-[10px] tracking-[2px] uppercase text-white/75 group-hover/card:text-[#f3e3c6] transition-colors duration-300">
                {preview.cardCta}
                <span className="inline-block transition-transform duration-300 group-hover/card:translate-x-1">
                  →
                </span>
              </span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
