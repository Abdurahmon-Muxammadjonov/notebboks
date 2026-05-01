"use client";

import Link from "next/link";
import { BLOG_POSTS } from "@/lib/blog";
import { useAppPreferences } from "@/components/app-preferences-provider";

export function InstagramFeed() {
  const { t } = useAppPreferences();

  return (
    <section id="blog" className="mx-auto max-w-360 scroll-mt-28 px-4 py-10 sm:px-6 sm:py-12">
      <h2 className="app-heading mb-6 text-[22px] font-semibold tracking-[-0.02em] sm:text-[24px]">
        {t("instagram.title")}
      </h2>

      {/* First row — 6 columns */}
      <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
        {BLOG_POSTS.slice(0, 6).map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>

      {/* Second row — 3 columns */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {BLOG_POSTS.slice(6, 9).map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
    </section>
  );
}

function BlogCard({ post }: { post: (typeof BLOG_POSTS)[number] }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      {/* Image */}
      <div className="overflow-hidden rounded-sm bg-[#f2f4f7] aspect-4/3">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      {/* Text */}
      <div className="mt-2.5 px-0.5">
        <p className="line-clamp-4 text-[12px] leading-[1.55] text-[#444] group-hover:text-[#0156ff] transition-colors duration-150">
          {post.excerpt}
        </p>
        <p className="mt-1.5 text-[11px] text-[#aaa]">{post.date}</p>
      </div>
    </Link>
  );
}
