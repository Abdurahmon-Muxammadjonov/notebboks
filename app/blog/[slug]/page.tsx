import { notFound } from "next/navigation";
import Link from "next/link";
import { TopBar } from "@/components/top-bar";
import { MainNavbar } from "@/components/main-navbar";
import { BLOG_POSTS } from "@/lib/blog";

const RELATED_PRODUCTS = [
  {
    id: "rp1",
    name: "MSI GS66 Stealth Gaming Laptop",
    price: 1499,
    imageUrl: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400&q=80",
    tag: "Notebook",
  },
  {
    id: "rp2",
    name: "Razer BlackWidow Mechanical Keyboard",
    price: 149,
    imageUrl: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=400&q=80",
    tag: "Peripherals",
  },
  {
    id: "rp3",
    name: "MSI Optix MAG274QRF Gaming Monitor",
    price: 399,
    imageUrl: "https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?w=400&q=80",
    tag: "Monitor",
  },
  {
    id: "rp4",
    name: "Razer DeathAdder V3 Gaming Mouse",
    price: 89,
    imageUrl: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&q=80",
    tag: "Peripherals",
  },
  {
    id: "rp5",
    name: "Thermaltake Tower 900 Full Tower Case",
    price: 329,
    imageUrl: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=400&q=80",
    tag: "PCcorpuse",
  },
  {
    id: "rp6",
    name: "ROCCAT Kone Pro Air Wireless Mouse",
    price: 119,
    imageUrl: "https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=400&q=80",
    tag: "Peripherals",
  },
];

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return BLOG_POSTS.map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = BLOG_POSTS.find((p) => p.slug === slug);

  if (!post) notFound();

  const related = BLOG_POSTS.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <MainNavbar />

      {/* Hero image — full width, large */}
      <div className="relative h-[320px] w-full overflow-hidden bg-[#111] sm:h-[420px] lg:h-120">
        <img
          src={post.imageUrl}
          alt={post.title}
          className="h-full w-full object-cover opacity-80"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 mx-auto max-w-360 px-4 pb-8 sm:px-6 sm:pb-10">
          <span className="mb-3 inline-block rounded-full bg-[#0156ff] px-3 py-1 text-[12px] font-semibold uppercase tracking-wider text-white">
            {post.category}
          </span>
          <h1 className="mt-2 max-w-3xl text-[28px] font-bold leading-[1.15] tracking-[-0.03em] text-white sm:text-[36px]">
            {post.title}
          </h1>
          <p className="mt-2 text-[13px] text-white/60">{post.date}</p>
        </div>
      </div>

      {/* Article content */}
      <article className="mx-auto max-w-360 px-4 py-10 sm:px-6 sm:py-12">
        <div className="mx-auto max-w-3xl">
          {/* Breadcrumb */}
          <nav className="mb-8 flex items-center gap-2 text-[13px] text-[#999]">
            <Link href="/" className="hover:text-[#0156ff] transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-[#0156ff] transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-[#333]">{post.title}</span>
          </nav>

          <p className="mb-6 text-[16px] leading-[1.8] text-[#333] sm:text-[17px]">
            {post.excerpt.replace("...", "")} If you've recently made a desktop PC or laptop purchase,
            you might want to consider adding peripherals to enhance your home office setup, your gaming rig,
            or your business workspace. The right peripherals can dramatically improve your productivity,
            comfort, and overall computing experience.
          </p>

          <h2 className="mb-4 text-[24px] font-bold tracking-[-0.02em] text-black">
            Why Quality Peripherals Matter
          </h2>
          <p className="mb-6 text-[16px] leading-[1.8] text-[#333] sm:text-[17px]">
            When building or upgrading your PC setup, it's easy to focus entirely on the core components —
            the CPU, GPU, RAM, and storage. But the peripherals you choose will directly impact how you
            interact with your machine every single day. A high-quality mechanical keyboard, a precise
            gaming mouse, and a crystal-clear monitor can transform your computing experience.
          </p>
          <p className="mb-6 text-[16px] leading-[1.8] text-[#333] sm:text-[17px]">
            Whether you're a competitive gamer, a creative professional, or a remote worker, investing in
            the right tools will pay dividends in performance and comfort. Let's explore some of the best
            options available in our store right now.
          </p>

          <h2 className="mb-4 text-[24px] font-bold tracking-[-0.02em] text-black">
            Top Picks for Your Setup
          </h2>
          <p className="mb-10 text-[16px] leading-[1.8] text-[#333] sm:text-[17px]">
            From RGB mechanical keyboards that light up your desk to ultra-precise mice designed for
            tournament play, we've curated the best selection of peripherals and components. Browse our
            full catalog to find everything you need to build your dream setup.
          </p>
        </div>

        {/* Related products */}
        <div className="border-t border-[#e7eef6] pt-10">
          <h3 className="mb-6 text-[22px] font-bold tracking-[-0.02em] text-black">
            Related Products
          </h3>
          <div className="grid grid-cols-1 gap-5 min-[480px]:grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
            {RELATED_PRODUCTS.map((product) => (
              <Link
                key={product.id}
                href={`/products?category=${product.tag}`}
                className="group block rounded-lg border border-[#e7eef6] bg-white p-3 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
              >
                <div className="mb-3 overflow-hidden rounded-md bg-[#f6f8fb] aspect-4/3">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <h4 className="line-clamp-2 text-[12px] font-medium leading-[1.4] text-[#1a1a1a] group-hover:text-[#0156ff] transition-colors duration-150">
                  {product.name}
                </h4>
                <p className="mt-1.5 text-[15px] font-bold tracking-[-0.03em] text-black">
                  ${product.price.toLocaleString()}.00
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Related posts */}
        <div className="mt-14 border-t border-[#e7eef6] pt-10">
          <h3 className="mb-6 text-[22px] font-bold tracking-[-0.02em] text-black">
            More Articles
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {related.map((relPost) => (
              <Link key={relPost.slug} href={`/blog/${relPost.slug}`} className="group block">
                <div className="mb-3 overflow-hidden rounded-sm aspect-4/3 bg-[#f2f4f7]">
                  <img
                    src={relPost.imageUrl}
                    alt={relPost.title}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#0156ff]">
                  {relPost.category}
                </span>
                <h4 className="mt-1 text-[15px] font-semibold leading-[1.4] text-[#1a1a1a] group-hover:text-[#0156ff] transition-colors duration-150">
                  {relPost.title}
                </h4>
                <p className="mt-1 text-[12px] text-[#aaa]">{relPost.date}</p>
              </Link>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}
