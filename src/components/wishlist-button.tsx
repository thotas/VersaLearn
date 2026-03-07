"use client";

import { useState } from "react";
import { toggleWishlist } from "@/actions/wishlist";
import { Heart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

interface WishlistButtonProps {
  courseId: string;
  initialInWishlist?: boolean;
}

export function WishlistButton({
  courseId,
  initialInWishlist = false,
}: WishlistButtonProps) {
  const [inWishlist, setInWishlist] = useState(initialInWishlist);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    startTransition(async () => {
      const result = await toggleWishlist(courseId);
      if (result.success) {
        setInWishlist(result.inWishlist);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 1500);
        // Refresh to update navbar wishlist count
        router.refresh();
      }
    });
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={(e) => handleToggle(e)}
      disabled={isPending}
      className={`p-2 h-auto transition-colors ${
        inWishlist
          ? "text-red-500 hover:text-red-400"
          : "text-zinc-400 hover:text-red-500"
      }`}
      title={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
    >
      {showSuccess ? (
        <Check className="h-5 w-5 text-green-500 animate-bounce" />
      ) : (
        <Heart
          className={`h-5 w-5 ${inWishlist ? "fill-current" : ""} transition-all`}
        />
      )}
    </Button>
  );
}
