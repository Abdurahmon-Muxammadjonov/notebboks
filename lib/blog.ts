import Link from "next/link";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  imageUrl: string;
  category: string;
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "best-gaming-peripherals-2024",
    title: "Best Gaming Peripherals to Upgrade Your Setup in 2024",
    excerpt: "If you've recently made a desktop PC or laptop purchase, you might want to consider adding peripherals to enhance your home office setup, your gaming rig, or your business workspace...",
    date: "01.09.2020",
    imageUrl: "https://images.unsplash.com/photo-1593640408182-31c228b50b9d?w=600&q=80",
    category: "Gaming",
  },
  {
    slug: "gaming-audio-guide",
    title: "Superior Sound: A Gamer's Audio Guide",
    excerpt: "As a gamer, superior sound counts for a lot. You need to hear enemies tiptoeing up behind you for a sneak attack or a slight change in the atmospheric music signalling a new challenge or task...",
    date: "01.09.2020",
    imageUrl: "https://images.unsplash.com/photo-1547394765-185e1e68f34e?w=600&q=80",
    category: "Audio",
  },
  {
    slug: "home-office-setup",
    title: "Build the Perfect Home Office Setup",
    excerpt: "If you've recently made a desktop PC or laptop purchase, you might want to consider adding peripherals to enhance your home office setup, your gaming rig, or your business workspace...",
    date: "01.09.2020",
    imageUrl: "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80",
    category: "Workspace",
  },
  {
    slug: "rgb-lighting-setup",
    title: "RGB Everything: Lighting Your Gaming Space",
    excerpt: "If you've recently made a desktop PC or laptop purchase, you might want to consider adding peripherals to enhance your home office setup, your gaming rig, or your business workspace...",
    date: "01.08.2020",
    imageUrl: "https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?w=600&q=80",
    category: "Setup",
  },
  {
    slug: "gaming-mouse-guide",
    title: "Choosing the Right Gaming Mouse",
    excerpt: "If you've recently made a desktop PC or laptop purchase, you might want to consider adding peripherals to enhance your home office setup, your gaming rig, or your business workspace...",
    date: "01.09.2020",
    imageUrl: "https://images.unsplash.com/photo-1527814050087-3793815479db?w=600&q=80",
    category: "Peripherals",
  },
  {
    slug: "mechanical-keyboards",
    title: "Mechanical Keyboards: The Ultimate Guide",
    excerpt: "If you've recently made a desktop PC or laptop purchase, you might want to consider adding peripherals to enhance your home office setup, your gaming rig, or your business workspace...",
    date: "01.09.2020",
    imageUrl: "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&q=80",
    category: "Keyboards",
  },
  {
    slug: "gaming-pc-build-guide",
    title: "How to Build Your First Gaming PC",
    excerpt: "If you've recently made a desktop PC or laptop purchase, you might want to consider adding peripherals to enhance your home office setup, your gaming rig, or your business workspace...",
    date: "01.09.2020",
    imageUrl: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&q=80",
    category: "PC Building",
  },
  {
    slug: "white-desk-setup",
    title: "Clean Minimal White Desk Setup Ideas",
    excerpt: "If you've recently made a desktop PC or laptop purchase, you might want to consider adding peripherals to enhance your home office setup, your gaming rig, or your business workspace...",
    date: "01.09.2020",
    imageUrl: "https://images.unsplash.com/photo-1593640495253-23196b27a87f?w=600&q=80",
    category: "Setup",
  },
  {
    slug: "razer-gaming-setup",
    title: "Full Razer Gaming Setup Tour 2024",
    excerpt: "If you've recently made a desktop PC or laptop purchase, you might want to consider adding peripherals to enhance your home office setup, your gaming rig, or your business workspace...",
    date: "01.09.2020",
    imageUrl: "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=600&q=80",
    category: "Gaming",
  },
];
