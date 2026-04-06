const STORAGE_KEY = "cg_security_research_discussion";

function createId(prefix = "id") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeText(value) {
  return String(value ?? "").replace(/\s+/g, " ").trim();
}

function normalizeRecord(record) {
  return {
    id: String(record?.id || createId("comment")),
    author: String(record?.author || "guest"),
    content: normalizeText(record?.content),
    createdAt: String(record?.createdAt || new Date().toISOString()),
    likes: Array.isArray(record?.likes) ? Array.from(new Set(record.likes.map((item) => String(item)))) : [],
    replies: Array.isArray(record?.replies)
      ? record.replies
        .map((reply) => ({
          id: String(reply?.id || createId("reply")),
          author: String(reply?.author || "guest"),
          content: normalizeText(reply?.content),
          createdAt: String(reply?.createdAt || new Date().toISOString()),
          likes: Array.isArray(reply?.likes) ? Array.from(new Set(reply.likes.map((item) => String(item)))) : [],
        }))
        .filter((reply) => reply.content)
      : [],
  };
}

function persistDiscussion(comments) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
}

export function loadSecurityResearchDiscussion() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => normalizeRecord(item))
      .filter((item) => item.content)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch {
    return [];
  }
}

export function createSecurityResearchComment({ author, content }) {
  const nextComments = [
    {
      id: createId("comment"),
      author: String(author || "guest"),
      content: normalizeText(content),
      createdAt: new Date().toISOString(),
      likes: [],
      replies: [],
    },
    ...loadSecurityResearchDiscussion(),
  ].filter((item) => item.content);

  persistDiscussion(nextComments);
  return nextComments;
}

export function toggleSecurityResearchCommentLike({ commentId, replyId = "", username }) {
  const normalizedUsername = String(username || "").trim().toLowerCase();
  if (!normalizedUsername) return loadSecurityResearchDiscussion();

  const nextComments = loadSecurityResearchDiscussion().map((comment) => {
    if (comment.id !== commentId) return comment;

    if (replyId) {
      return {
        ...comment,
        replies: comment.replies.map((reply) => {
          if (reply.id !== replyId) return reply;
          const hasLiked = reply.likes.includes(normalizedUsername);
          return {
            ...reply,
            likes: hasLiked
              ? reply.likes.filter((item) => item !== normalizedUsername)
              : [...reply.likes, normalizedUsername],
          };
        }),
      };
    }

    const hasLiked = comment.likes.includes(normalizedUsername);
    return {
      ...comment,
      likes: hasLiked
        ? comment.likes.filter((item) => item !== normalizedUsername)
        : [...comment.likes, normalizedUsername],
    };
  });

  persistDiscussion(nextComments);
  return nextComments;
}

export function replySecurityResearchComment({ commentId, author, content }) {
  const normalizedContent = normalizeText(content);
  if (!normalizedContent) return loadSecurityResearchDiscussion();

  const nextComments = loadSecurityResearchDiscussion().map((comment) => {
    if (comment.id !== commentId) return comment;
    return {
      ...comment,
      replies: [
        ...comment.replies,
        {
          id: createId("reply"),
          author: String(author || "guest"),
          content: normalizedContent,
          createdAt: new Date().toISOString(),
          likes: [],
        },
      ],
    };
  });

  persistDiscussion(nextComments);
  return nextComments;
}
