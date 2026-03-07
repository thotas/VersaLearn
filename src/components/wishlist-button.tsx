"use client";

import { useState } from "react";
import { toggleWishlist, getWishlistStatus } from "@/actions/wishlist";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";

interface WishlistButtonProps {
  courseId: string;
  initialInWishlist?: boolean;
}

export function WishlistButton({
  courseId,
  initialInWishlist = false,
}: WishlistButtonProps) {
  const [inWishlist, setInWishlist] = useState(initialInWishlist);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      const result = await toggleWishlist(courseId);
      if (result.success) {
        setInWishlist(result.inWishlist);
      }
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleToggle}
      disabled={isPending}
      className={`p-2 h-auto transition-colors ${
        inWishlist
          ? "text-red-500 hover:text-red-400"
          : "text-zinc-400 hover:text-red-500"
      }`}
      title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart
        className={`h-5 w-5 ${inWishlist ? "fill-current" : ""} transition-all`}
      />
    </Button>
  );
}
