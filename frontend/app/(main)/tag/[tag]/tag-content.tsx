"use client";

import { useState, useEffect } from "react";
import { PostCard } from "@/components/post/post-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { api } from "@/lib/api";
import type { Post, Tag } from "@/lib/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface TagContentProps {
  tagSlug: string;
  initialTag: Tag | null;
  initialPosts: Post[];
  initialTotalPages: number;
}

export function TagContent({
  tagSlug,
  initialTag,
  initialPosts,
  initialTotalPages,
}: TagContentProps) {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [tag, setTag] = useState<Tag | null>(initialTag);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (page === 1) return;
    setLoading(true);
    api
      .get<{
        tag: Tag;
        data: Post[];
        total_pages: number;
      }>(`/tags/${tagSlug}/posts`, { page: String(page), per_page: "10" })
      .then((res) => {
        setTag(res.tag);
        setPosts(res.data || []);
        setTotalPages(res.total_pages);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [tagSlug, page]);

  return (
    <>
      <h1 className="mb-2 text-2xl font-bold">
        {tag ? `#${tag.name}` : tagSlug}
      </h1>
      {tag && (
        <p className="mb-6 text-sm text-muted-foreground">
          {tag.post_count} post{tag.post_count !== 1 ? "s" : ""}
        </p>
      )}

      {loading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-2 border-b pb-6">
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
            </div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <p className="text-muted-foreground">No posts found with this tag.</p>
      ) : (
        <>
          <div>
            {posts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
          </div>
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page - 1)}
                disabled={page <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(page + 1)}
                disabled={page >= totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      )}
    </>
  );
}
