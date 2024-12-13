/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import { useAuth } from "@clerk/nextjs";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";
import { Star, ThumbsUp } from "lucide-react";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/UXEnhancements";
import { motion, AnimatePresence } from "framer-motion";

const StarRating = ({
  rating,
  onRate,
  disabled = false,
  size = "default",
}: {
  rating: number;
  onRate: (rating: number) => void;
  disabled?: boolean;
  size?: "small" | "default" | "large";
}) => {
  const [hover, setHover] = useState<number | null>(null);

  const sizeClasses = {
    small: "h-4 w-4",
    default: "h-6 w-6",
    large: "h-8 w-8",
  };

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          disabled={disabled}
          onClick={() => onRate(star)}
          onMouseEnter={() => setHover(star)}
          onMouseLeave={() => setHover(null)}
          className={`transition-all duration-200 ${
            disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer hover:scale-110"
          }`}
        >
          <Star
            className={`${sizeClasses[size]} transition-colors duration-200 ${
              (hover || rating) >= star
                ? "fill-yellow-500 text-yellow-500"
                : "fill-none text-gray-400 hover:text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
};

interface Props {
  templateId: Id<"marketplaceTemplates">;
}

export default function TemplateRatings({ templateId }: Props) {
  const { isSignedIn } = useAuth();
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const rateTemplate = useMutation(api.templates.rateTemplate);
  const ratingsData = useQuery(api.templates.getTemplateRatings, {
    templateId,
    limit: 10,
  });

  if (!ratingsData) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <LoadingSpinner />
      </div>
    );
  }

  const { ratings, userRating } = ratingsData;

  const handleSubmitRating = async () => {
    if (!rating) {
      toast.error("Please select a rating");
      return;
    }

    try {
      setIsSubmitting(true);
      await rateTemplate({
        templateId,
        rating,
        review: review.trim() || undefined,
      });
      setRating(0);
      setReview("");
      toast.success("Rating submitted successfully!");
    } catch (error) {
      toast.error("Failed to submit rating");
    } finally {
      setIsSubmitting(false);
    }
  };

  const averageRating =
    ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length || 0;

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-br from-[#1a1a24] to-[#121218] rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          Ratings & Reviews
        </h3>
        <div className="flex items-center gap-6">
          <div className="flex flex-col items-center gap-2 bg-[#0a0a0f]/50 rounded-lg p-4">
            <span className="text-3xl font-bold text-white">
              {averageRating.toFixed(1)}
            </span>
            <StarRating rating={Math.round(averageRating)} onRate={() => {}} disabled size="small" />
            <span className="text-sm text-gray-400">
              {ratings.length} {ratings.length === 1 ? "review" : "reviews"}
            </span>
          </div>
          <div className="flex-1 space-y-2">
            {[5, 4, 3, 2, 1].map((num) => {
              const count = ratings.filter((r) => r.rating === num).length;
              const percentage = (count / ratings.length) * 100 || 0;
              return (
                <div key={num} className="flex items-center gap-2 text-sm">
                  <span className="w-3">{num}</span>
                  <Star className="h-4 w-4 text-yellow-500" />
                  <div className="flex-1 h-2 bg-[#1a1a24] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                  <span className="w-12 text-right text-gray-400">{percentage.toFixed(0)}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {isSignedIn ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1a1a24] rounded-xl p-6 space-y-4 shadow-lg border border-[#ffffff0a]"
        >
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-200">Your Rating</label>
            <StarRating
              rating={rating}
              onRate={setRating}
              disabled={isSubmitting}
              size="large"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2 text-gray-200">
              Review (Optional)
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              disabled={isSubmitting}
              placeholder="Share your experience with this template..."
              className="w-full px-4 py-3 bg-[#0a0a0f] text-gray-100 rounded-lg border border-[#ffffff0a] focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-transparent resize-none h-24 placeholder:text-gray-500"
            />
          </div>

          <button
            onClick={handleSubmitRating}
            disabled={!rating || isSubmitting}
            className="w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <LoadingSpinner />
            ) : (
              <>
                <ThumbsUp className="h-4 w-4" />
                Submit Review
              </>
            )}
          </button>

          {userRating && (
            <p className="text-sm text-gray-400 bg-[#ffffff0a] rounded-lg p-3 border border-[#ffffff0a]">
              You've already rated this template. Submitting again will update your previous rating.
            </p>
          )}
        </motion.div>
      ) : (
        <div className="bg-[#1a1a24] rounded-xl p-6 text-center border border-[#ffffff0a]">
          <p className="text-gray-400">
            Please sign in to rate this template
          </p>
        </div>
      )}

      <div className="space-y-4">
        <AnimatePresence>
          {ratings.map((r, index) => (
            <motion.div
              key={r._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
              className="bg-[#1a1a24] rounded-xl p-6 space-y-3 border border-[#ffffff0a] hover:border-[#ffffff15] transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-medium">
                    {r.userName[0].toUpperCase()}
                  </div>
                  <div>
                    <span className="font-medium text-gray-200">{r.userName}</span>
                    <div className="flex items-center gap-2">
                      <StarRating rating={r.rating} onRate={() => {}} disabled size="small" />
                      <span className="text-sm text-gray-400">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                {r.updatedAt > r.createdAt && (
                  <span className="text-xs text-gray-500">(edited)</span>
                )}
              </div>
              {r.review && (
                <p className="text-gray-300 leading-relaxed">{r.review}</p>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
