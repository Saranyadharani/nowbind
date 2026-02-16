import { MetadataRoute } from "next";
import { API_URL, SITE_URL } from "@/lib/constants";
import type { Post, Tag, User, PaginatedResponse } from "@/lib/types";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/explore`, lastModified: new Date(), changeFrequency: "daily", priority: 0.8 },
    { url: `${SITE_URL}/search`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${SITE_URL}/docs`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${SITE_URL}/terms`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/privacy`, changeFrequency: "monthly", priority: 0.3 },
  ];

  try {
    const res = await fetch(`${API_URL}/posts?per_page=50`);
    if (res.ok) {
      const data: PaginatedResponse<Post> = await res.json();
      for (const post of data.data || []) {
        entries.push({
          url: `${SITE_URL}/post/${post.slug}`,
          lastModified: new Date(post.updated_at),
          changeFrequency: "weekly",
          priority: 0.7,
        });
      }
    }
  } catch {
    // Fail gracefully
  }

  try {
    const res = await fetch(`${API_URL}/tags`);
    if (res.ok) {
      const tags: Tag[] = await res.json();
      for (const tag of tags || []) {
        entries.push({
          url: `${SITE_URL}/tag/${tag.slug}`,
          changeFrequency: "weekly",
          priority: 0.5,
        });
      }
    }
  } catch {
    // Fail gracefully
  }

  try {
    const res = await fetch(`${API_URL}/users?per_page=50`);
    if (res.ok) {
      const data = await res.json();
      const users: User[] = data.data || data || [];
      for (const user of users) {
        entries.push({
          url: `${SITE_URL}/author/${user.username}`,
          changeFrequency: "weekly",
          priority: 0.6,
        });
      }
    }
  } catch {
    // Fail gracefully
  }

  return entries;
}
