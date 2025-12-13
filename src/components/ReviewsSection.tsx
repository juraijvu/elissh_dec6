import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Star, Upload, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { reviewsAPI } from "@/lib/api";

interface Review {
  id: number;
  rating: number;
  title: string;
  comment: string;
  images: string[];
  createdAt: string;
  User: {
    firstName: string;
    lastName: string;
  };
}

interface ReviewsSectionProps {
  productId: string;
}

const ReviewsSection = ({ productId }: ReviewsSectionProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddReview, setShowAddReview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [ratingSummary, setRatingSummary] = useState({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
  const [avgRating, setAvgRating] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  // Form state
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [images, setImages] = useState<File[]>([]);

  useEffect(() => {
    fetchReviews();
  }, [productId]);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await reviewsAPI.getProductReviews(productId);
      setReviews(response.reviews || []);
      setRatingSummary(response.ratingSummary || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });
      setAvgRating(response.avgRating || 0);
      setTotalReviews(response.totalReviews || 0);
    } catch (error) {
      console.error('Failed to fetch reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 5) {
      toast({ title: "Maximum 5 images allowed", variant: "destructive" });
      return;
    }
    setImages([...images, ...files]);
  };

  const removeImage = (index: number) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Please login to submit a review", variant: "destructive" });
      return;
    }

    if (rating === 0) {
      toast({ title: "Please select a rating", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('productId', productId);
      formData.append('rating', rating.toString());
      formData.append('title', title);
      formData.append('comment', comment);
      
      images.forEach((image) => {
        formData.append('images', image);
      });

      await reviewsAPI.createReview(formData);
      
      toast({ title: "Review submitted for approval!" });
      setShowAddReview(false);
      setRating(0);
      setTitle('');
      setComment('');
      setImages([]);
      fetchReviews();
    } catch (error: any) {
      toast({ 
        title: error.response?.data?.message || "Failed to submit review", 
        variant: "destructive" 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return <div className="text-center py-8">Loading reviews...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Customer Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4 mb-4">
              <div className="text-4xl font-bold">{avgRating}</div>
              <div>
                <div className="flex items-center gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < Math.floor(avgRating) ? 'fill-primary text-primary' : 'text-gray-300'}`} />
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">{totalReviews} reviews</div>
              </div>
            </div>
            
            {/* Rating Breakdown */}
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((stars) => (
                <div key={stars} className="flex items-center gap-2">
                  <span className="text-sm w-8">{stars}★</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ 
                        width: totalReviews > 0 ? `${(ratingSummary[stars as keyof typeof ratingSummary] / totalReviews) * 100}%` : '0%' 
                      }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-8">{ratingSummary[stars as keyof typeof ratingSummary]}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Add Review Button */}
        <Card>
          <CardHeader>
            <CardTitle>Share Your Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Help other customers by sharing your experience with this product.
            </p>
            <Button 
              onClick={() => setShowAddReview(true)}
              disabled={!user}
              className="w-full"
            >
              {user ? 'Write a Review' : 'Login to Write Review'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Add Review Form */}
      {showAddReview && (
        <Card>
          <CardHeader>
            <CardTitle>Write Your Review</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmitReview} className="space-y-4">
              {/* Rating */}
              <div>
                <Label>Rating *</Label>
                <div className="flex items-center gap-1 mt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1"
                    >
                      <Star 
                        className={`h-6 w-6 ${star <= rating ? 'fill-primary text-primary' : 'text-gray-300'}`} 
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div>
                <Label htmlFor="title">Review Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Summarize your experience"
                  required
                />
              </div>

              {/* Comment */}
              <div>
                <Label htmlFor="comment">Your Review *</Label>
                <Textarea
                  id="comment"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your detailed experience with this product"
                  rows={4}
                  required
                />
              </div>

              {/* Image Upload */}
              <div>
                <Label>Add Photos (Optional)</Label>
                <div className="mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="review-images"
                  />
                  <label
                    htmlFor="review-images"
                    className="flex items-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary"
                  >
                    <Upload className="h-5 w-5" />
                    <span>Upload Images (Max 5)</span>
                  </label>
                </div>

                {/* Image Previews */}
                {images.length > 0 && (
                  <div className="grid grid-cols-5 gap-2 mt-3">
                    {images.map((image, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(image)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-20 object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button type="submit" disabled={submitting}>
                  {submitting ? 'Submitting...' : 'Submit Review'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowAddReview(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <p className="text-muted-foreground">No reviews yet. Be the first to review this product!</p>
            </CardContent>
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-primary text-primary' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <span className="font-semibold">{review.title}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      By {review.User.firstName} {review.User.lastName} • {formatDate(review.createdAt)}
                    </p>
                  </div>
                </div>
                
                <p className="text-muted-foreground mb-3">{review.comment}</p>
                
                {/* Review Images */}
                {review.images && review.images.length > 0 && (
                  <div className="grid grid-cols-4 gap-2">
                    {review.images.map((image, index) => (
                      <img
                        key={index}
                        src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'https://elissh.com'}${image}`}
                        alt={`Review image ${index + 1}`}
                        className="w-full h-20 object-cover rounded"
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewsSection;