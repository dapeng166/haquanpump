import type { NewsPost } from "@/lib/types";
import type { Locale } from "./config";
import { translate, translateMany } from "./translate";

/** Translate the fields a news card shows (title, excerpt, category). */
export async function translateNewsCard(
  post: NewsPost,
  locale: Locale,
): Promise<NewsPost> {
  if (locale === "en") return post;
  const [title, excerpt, category] = await translateMany(
    [post.title, post.excerpt, post.category],
    locale,
  );
  return { ...post, title, excerpt, category };
}

/** Translate a full news article (card fields + the HTML body). */
export async function translateNewsPost(
  post: NewsPost,
  locale: Locale,
): Promise<NewsPost> {
  if (locale === "en") return post;
  const [title, excerpt, category, author] = await translateMany(
    [post.title, post.excerpt, post.category, post.author],
    locale,
  );
  const content = await translate(post.content, locale, "html");
  return { ...post, title, excerpt, category, author, content };
}
