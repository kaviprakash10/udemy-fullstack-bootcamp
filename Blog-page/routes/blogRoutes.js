const express = require("express");
const router = express.Router();
const store = require("../data/postsStore");

// Helper to get unique categories
function getCategories() {
  const posts = store.getAllPosts();
  const cats = new Set(posts.map((p) => p.category));
  return Array.from(cats);
}

// 1. Home Page - List all posts (with search & category filter support)
router.get("/", (req, res) => {
  let posts = store.getAllPosts();
  const { category, q } = req.query;

  if (category) {
    posts = posts.filter(
      (p) => p.category.toLowerCase() === category.toLowerCase()
    );
  }

  if (q) {
    const query = q.toLowerCase();
    posts = posts.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.content.toLowerCase().includes(query) ||
        p.author.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
    );
  }

  const categories = getCategories();
  const activeCategory = category || "All";

  res.render("index", {
    posts,
    categories,
    activeCategory,
    searchQuery: q || "",
    featuredPost: posts.length > 0 ? posts[0] : null
  });
});

// 2. New Post Form Page
router.get("/posts/new", (req, res) => {
  res.render("create", {
    categories: getCategories()
  });
});

// 3. Handle Post Creation
router.post("/posts", (req, res) => {
  const { title, subtitle, author, category, content, coverImage } = req.body;

  if (!title || !content) {
    return res.status(400).render("create", {
      error: "Title and Content are required fields.",
      categories: getCategories(),
      formData: req.body
    });
  }

  const newPost = store.createPost({
    title,
    subtitle,
    author,
    category,
    content,
    coverImage
  });

  res.redirect(`/posts/${newPost.id}?notice=created`);
});

// 4. View Single Post Page
router.get("/posts/:id", (req, res) => {
  const post = store.getPostById(req.params.id);

  if (!post) {
    return res.status(404).render("404", {
      message: "Post not found."
    });
  }

  const notice = req.query.notice || null;

  res.render("post", {
    post,
    notice
  });
});

// 5. Edit Post Form Page
router.get("/posts/:id/edit", (req, res) => {
  const post = store.getPostById(req.params.id);

  if (!post) {
    return res.status(404).render("404", {
      message: "Post not found."
    });
  }

  res.render("edit", {
    post,
    categories: getCategories()
  });
});

// 6. Handle Edit Post Update
router.post("/posts/:id/edit", (req, res) => {
  const { title, subtitle, author, category, content, coverImage } = req.body;

  if (!title || !content) {
    const post = store.getPostById(req.params.id) || { id: req.params.id };
    return res.status(400).render("edit", {
      error: "Title and Content cannot be empty.",
      post: { ...post, title, subtitle, author, category, content, coverImage },
      categories: getCategories()
    });
  }

  const updatedPost = store.updatePost(req.params.id, {
    title,
    subtitle,
    author,
    category,
    content,
    coverImage
  });

  if (!updatedPost) {
    return res.status(404).render("404", { message: "Post not found." });
  }

  res.redirect(`/posts/${updatedPost.id}?notice=updated`);
});

// 7. Handle Delete Post
router.post("/posts/:id/delete", (req, res) => {
  const success = store.deletePost(req.params.id);
  if (!success) {
    return res.status(404).render("404", { message: "Post not found." });
  }
  res.redirect("/?notice=deleted");
});

// 8. About Page
router.get("/about", (req, res) => {
  res.render("about");
});

module.exports = router;
