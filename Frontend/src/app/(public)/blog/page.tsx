const posts = [
  { title: "5 signs of early blight before it spreads", tag: "Crop Health", read: "4 min" },
  { title: "How to read the weekly mandi price report", tag: "Market", read: "6 min" },
  { title: "Choosing fertilizer by soil type: a farmer's guide", tag: "Guide", read: "5 min" },
  { title: "Why maize prices spike every monsoon", tag: "Market", read: "3 min" },
];

export default function BlogPage() {
  return (
    <section className="px-6 py-20 md:px-12">
      <div className="mx-auto max-w-5xl">
        <span className="font-mono text-xs tracking-wide text-primary">BLOG</span>
        <h1 className="mt-3 font-display text-3xl text-dark md:text-4xl">
          Field notes and market insights
        </h1>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <article key={post.title} className="leaf-shape border border-dark/5 bg-white/70 p-6">
              <span className="font-mono text-xs text-primary">{post.tag.toUpperCase()}</span>
              <h2 className="mt-2 font-display text-xl text-dark">{post.title}</h2>
              <p className="mt-3 text-xs text-dark/40">{post.read} read</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
