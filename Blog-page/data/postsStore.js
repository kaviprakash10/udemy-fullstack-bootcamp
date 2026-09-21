/**
 * In-memory Blog Posts Data Store
 */

let posts = [
  {
    id: "1",
    title: "How to Think Clearly in the Age of Information Overload",
    subtitle: "Navigating noise, cultivating focus, and building mental models for better decision-making.",
    author: "Paul Graham",
    category: "Essays",
    readTime: "5 min read",
    createdAt: new Date("2026-03-15T10:30:00Z").toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    }),
    coverImage: "https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1200&auto=format&fit=crop",
    content: `When you look back at historical periods of major technological breakthroughs, the most valuable skill has rarely been the ability to consume more information. Instead, it has always been the filter—the framework through which we decide what deserves our finite attention.

### The Tyranny of the Immediate

Modern media feeds are engineered for recency bias. They prioritize what happened 5 minutes ago over what will matter 5 years from now. If you want to think clearly, you must systematically insulate yourself from real-time commentary and spend more time with foundational ideas.

### Building Your Own Mental Filter

1. **Focus on evergreen principles**: Physics, human psychology, economics, and mathematics outlive news cycles.
2. **Write to clarify your thoughts**: As the saying goes, writing isn't just a communication tool; it is a discovery process for what you actually believe.
3. **Embrace deep work**: Allocate unbroken blocks of time without notifications or distraction.

When you write regularly, you force yourself to compress complex ideas into simple, structured sentences. That discipline alone sets high-level thinkers apart from passive consumers.`
  },
  {
    id: "2",
    title: "Building Great Web Software with Node.js and Express",
    subtitle: "A practical breakdown of server-side architecture, dynamic routing, and modular code.",
    author: "Kaviprakash S",
    category: "Engineering",
    readTime: "4 min read",
    createdAt: new Date("2026-03-18T14:15:00Z").toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    }),
    coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop",
    content: `Express.js remains one of the most elegant minimal web frameworks in the JavaScript ecosystem. Its middleware-centric architecture allows developers to compose applications with minimal overhead.

### Middleware as a Pipeline

In Express, everything is middleware. Request processing flows through a chain of functions, each performing a specific transformation or check:

- Parsing request bodies (\`express.urlencoded\` or \`body-parser\`)
- Serving static assets like CSS stylesheets and client scripts
- Routing incoming HTTP requests to dedicated handler logic

### Dynamic Templating with EJS

Combining Express with EJS (Embedded JavaScript) gives you the power of server-side rendering with full JavaScript expressions right inside HTML. It keeps template logic intuitive while outputting clean, performant markup directly to the client browser.`
  },
  {
    id: "3",
    title: "The Art of Minimalist UI & UX Design",
    subtitle: "Creating immersive digital experiences through typography, negative space, and dark aesthetics.",
    author: "Elena Rostova",
    category: "Design",
    readTime: "3 min read",
    createdAt: new Date("2026-03-20T09:00:00Z").toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    }),
    coverImage: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop",
    content: `Great design is invisible. When a user interacts with a well-crafted application, they shouldn't spend cognitive effort deciphering where to click or how to read text.

### Core Pillars of Modern Digital Design

- **Hierarchy over density**: Give elements room to breathe. High contrast headings and calculated white space guide the eye effortlessly.
- **Glassmorphism & Depth**: Subtle backdrop blurs, soft glows, and layered shadows create a visual sense of tactile depth.
- **Micro-interactions**: Subtle hover states and smooth transitions make the user feel in complete control of the application.`
  }
];

function calculateReadTime(text) {
  if (!text) return "1 min read";
  const words = text.trim().split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(words / 200));
  return `${minutes} min read`;
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

module.exports = {
  getAllPosts: () => [...posts],
  getPostById: (id) => posts.find((p) => p.id === String(id)),
  createPost: ({ title, subtitle, author, category, content, coverImage }) => {
    const newPost = {
      id: generateId(),
      title: title.trim(),
      subtitle: subtitle ? subtitle.trim() : "",
      author: author ? author.trim() : "Anonymous Writer",
      category: category ? category.trim() : "General",
      readTime: calculateReadTime(content),
      createdAt: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      }),
      coverImage: coverImage && coverImage.trim() !== "" 
        ? coverImage.trim() 
        : "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=1200&auto=format&fit=crop",
      content: content.trim()
    };
    posts.unshift(newPost); // Newest first
    return newPost;
  },
  updatePost: (id, { title, subtitle, author, category, content, coverImage }) => {
    const index = posts.findIndex((p) => p.id === String(id));
    if (index === -1) return null;

    posts[index] = {
      ...posts[index],
      title: title.trim(),
      subtitle: subtitle ? subtitle.trim() : posts[index].subtitle,
      author: author ? author.trim() : posts[index].author,
      category: category ? category.trim() : posts[index].category,
      content: content.trim(),
      readTime: calculateReadTime(content),
      coverImage: coverImage && coverImage.trim() !== "" ? coverImage.trim() : posts[index].coverImage,
      updatedAt: new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
      })
    };
    return posts[index];
  },
  deletePost: (id) => {
    const initialLength = posts.length;
    posts = posts.filter((p) => p.id !== String(id));
    return posts.length < initialLength;
  }
};
