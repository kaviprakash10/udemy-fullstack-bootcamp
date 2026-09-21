/**
 * ThoughtCanvas - Main Client Script
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Toast Notification Auto Dismiss
  const toastNotice = document.getElementById('toastNotice');
  if (toastNotice) {
    setTimeout(() => {
      toastNotice.style.opacity = '0';
      toastNotice.style.transform = 'translateY(-10px)';
      setTimeout(() => toastNotice.remove(), 400);
    }, 5000);
  }

  // 2. Word & Read Time Counter in Form
  const contentTextarea = document.getElementById('content');
  const wordCounter = document.getElementById('wordCounter');

  if (contentTextarea && wordCounter) {
    const updateWordCount = () => {
      const text = contentTextarea.value.trim();
      if (!text) {
        wordCounter.textContent = '0 words (1 min read)';
        return;
      }
      const words = text.split(/\s+/).filter(Boolean).length;
      const minutes = Math.max(1, Math.ceil(words / 200));
      wordCounter.textContent = `${words} word${words === 1 ? '' : 's'} (${minutes} min read)`;
    };

    contentTextarea.addEventListener('input', updateWordCount);
    updateWordCount(); // Initial calculation on load
  }

  // 3. Back to Top Button
  const backToTopBtn = document.getElementById('backToTop');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
});

// 4. Modal Functions for Deleting Posts
function openDeleteModal(postId, postTitle) {
  const modal = document.getElementById('deleteModal');
  const titleElem = document.getElementById('deletePostTitle');
  const formElem = document.getElementById('deleteForm');

  if (modal && titleElem && formElem) {
    titleElem.textContent = `"${postTitle}"`;
    formElem.action = `/posts/${postId}/delete`;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
}

function closeDeleteModal() {
  const modal = document.getElementById('deleteModal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}

// Close modal on Escape key or outside backdrop click
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeDeleteModal();
});

document.addEventListener('click', (e) => {
  const modal = document.getElementById('deleteModal');
  if (modal && e.target === modal) {
    closeDeleteModal();
  }
});
