import React from "react";
import { Badge } from "@/components/ui/Badge";
import { Sparkles, Flame, Zap, ShieldCheck } from "lucide-react";

interface ProductBadgeProps {
  badge?: string;
  isFeatured?: boolean;
  isPopular?: boolean;
  discountPercentage?: number;
}

export const ProductBadge: React.FC<ProductBadgeProps> = ({
  badge,
  isFeatured,
  isPopular,
  discountPercentage,
}) => {
  if (discountPercentage && discountPercentage >= 40) {
    return (
      <Badge variant="danger" size="sm" className="font-bold shadow-xs">
        <Zap className="h-3 w-3 fill-rose-500 text-rose-500" />
        <span>{discountPercentage}% OFF</span>
      </Badge>
    );
  }

  if (badge) {
    return (
      <Badge variant="purple" size="sm" className="font-bold shadow-xs">
        <Sparkles className="h-3 w-3 text-purple-600" />
        <span>{badge}</span>
      </Badge>
    );
  }

  if (isFeatured) {
    return (
      <Badge variant="primary" size="sm" className="font-bold shadow-xs">
        <ShieldCheck className="h-3 w-3 text-blue-600" />
        <span>Featured</span>
      </Badge>
    );
  }

  if (isPopular) {
    return (
      <Badge variant="warning" size="sm" className="font-bold shadow-xs">
        <Flame className="h-3 w-3 fill-amber-500 text-amber-500" />
        <span>Popular</span>
      </Badge>
    );
  }

  return null;
};
