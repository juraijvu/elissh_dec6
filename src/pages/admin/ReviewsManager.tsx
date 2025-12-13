import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, Check, X, Eye, MessageSquare } from "lucide-react";
import { reviewsAPI } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

interface PendingReview {
  id: number;
  rating: number;
  title: string;
  comment: string;
  images: string[];
  createdAt: string;
  User: {
    firstName: string;
    lastName: string;
    email: string;
  };
  Product: {
    name: string;
    brand: string;
  };
}

interface PendingGalleryImage {
  id: number;
  imageUrl: string;
  caption: string;
  createdAt: string;
  User: {
    firstName: string;
    lastName: string;
    email: string;
  };
  Product: {
    name: string;
    brand: string;
  };
}

const ReviewsManager = () => {
  const { toast } = useToast();
  const [pendingReviews, setPendingReviews] = useState<PendingReview[]>([]);
  const [pendingGallery, setPendingGallery] = useState<PendingGalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReview, setSelectedReview] = useState<PendingReview | null>(null);
  const [selectedGallery, setSelectedGallery] = useState<PendingGalleryImage | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchPendingItems();
  }, []);

  const fetchPendingItems = async () => {
    try {
      setLoading(true);
      const [reviewsResponse, galleryResponse] = await Promise.all([
        reviewsAPI.getPendingReviews(),
        reviewsAPI.getPendingGallery()
      ]);
      
      setPendingReviews(reviewsResponse.reviews || []);
      setPendingGallery(galleryResponse.galleryImages || []);
    } catch (error) {
      console.error('Failed to fetch pending items:', error);
      toast({ title: "Failed to load pending items", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleReviewAction = async (reviewId: number, isApproved: boolean) => {
    setProcessing(true);
    try {
      await reviewsAPI.approveReview(reviewId, { isApproved, adminNotes });
      toast({ 
        title: `Review ${isApproved ? 'approved' : 'rejected'} successfully` 
      });
      setSelectedReview(null);
      setAdminNotes('');
      fetchPendingItems();
    } catch (error) {
      toast({ 
        title: "Failed to process review", 
        variant: "destructive" 
      });
    } finally {
      setProcessing(false);
    }
  };

  const handleGalleryAction = async (galleryId: number, isApproved: boolean) => {
    setProcessing(true);
    try {
      await reviewsAPI.approveGalleryImage(galleryId, { isApproved, adminNotes });
      toast({ 
        title: `Gallery image ${isApproved ? 'approved' : 'rejected'} successfully` 
      });
      setSelectedGallery(null);
      setAdminNotes('');
      fetchPendingItems();
    } catch (error) {
      toast({ 
        title: "Failed to process gallery image", 
        variant: "destructive" 
      });
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Reviews & Gallery Manager</h1>
        <div className="flex gap-2">
          <Badge variant="secondary">
            {pendingReviews.length} Pending Reviews
          </Badge>
          <Badge variant="secondary">
            {pendingGallery.length} Pending Images
          </Badge>
        </div>
      </div>

      <Tabs defaultValue="reviews" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="reviews" className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Reviews ({pendingReviews.length})
          </TabsTrigger>
          <TabsTrigger value="gallery" className="flex items-center gap-2">
            <Eye className="h-4 w-4" />
            Gallery ({pendingGallery.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reviews" className="space-y-4">
          {pendingReviews.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <MessageSquare className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No pending reviews</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {pendingReviews.map((review) => (
                <Card key={review.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{review.Product.name}</CardTitle>
                        <p className="text-sm text-muted-foreground">{review.Product.brand}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className={`h-4 w-4 ${i < review.rating ? 'fill-primary text-primary' : 'text-gray-300'}`} />
                        ))}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold mb-2">{review.title}</h4>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </div>

                    {review.images && review.images.length > 0 && (
                      <div>
                        <h5 className="font-medium mb-2">Attached Images:</h5>
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
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t">
                      <div className="text-sm text-muted-foreground">
                        By {review.User.firstName} {review.User.lastName} ({review.User.email})
                        <br />
                        {formatDate(review.createdAt)}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedReview(review);
                            setAdminNotes('');
                          }}
                        >
                          Review
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="gallery" className="space-y-4">
          {pendingGallery.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Eye className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No pending gallery images</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingGallery.map((image) => (
                <Card key={image.id}>
                  <div className="aspect-square">
                    <img
                      src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'https://elissh.com'}${image.imageUrl}`}
                      alt={image.caption || 'User gallery image'}
                      className="w-full h-full object-cover rounded-t"
                    />
                  </div>
                  <CardContent className="p-4">
                    <h4 className="font-semibold mb-1">{image.Product.name}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{image.Product.brand}</p>
                    
                    {image.caption && (
                      <p className="text-sm mb-3">{image.caption}</p>
                    )}
                    
                    <div className="text-xs text-muted-foreground mb-3">
                      By {image.User.firstName} {image.User.lastName}
                      <br />
                      {formatDate(image.createdAt)}
                    </div>
                    
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full"
                      onClick={() => {
                        setSelectedGallery(image);
                        setAdminNotes('');
                      }}
                    >
                      Review
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Review Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Review: {selectedReview.Product.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`h-5 w-5 ${i < selectedReview.rating ? 'fill-primary text-primary' : 'text-gray-300'}`} />
                  ))}
                </div>
                <span className="font-semibold">{selectedReview.title}</span>
              </div>
              
              <p className="text-muted-foreground">{selectedReview.comment}</p>
              
              {selectedReview.images && selectedReview.images.length > 0 && (
                <div className="grid grid-cols-2 gap-2">
                  {selectedReview.images.map((image, index) => (
                    <img
                      key={index}
                      src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'https://elissh.com'}${image}`}
                      alt={`Review image ${index + 1}`}
                      className="w-full h-32 object-cover rounded"
                    />
                  ))}
                </div>
              )}
              
              <div>
                <Label htmlFor="adminNotes">Admin Notes (Optional)</Label>
                <Textarea
                  id="adminNotes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes for this review..."
                  rows={3}
                />
              </div>
              
              <div className="flex gap-3">
                <Button
                  onClick={() => handleReviewAction(selectedReview.id, true)}
                  disabled={processing}
                  className="flex-1"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleReviewAction(selectedReview.id, false)}
                  disabled={processing}
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedReview(null)}
                  disabled={processing}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Gallery Modal */}
      {selectedGallery && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl">
            <CardHeader>
              <CardTitle>Gallery Image: {selectedGallery.Product.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-square max-w-md mx-auto">
                <img
                  src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'https://elissh.com'}${selectedGallery.imageUrl}`}
                  alt={selectedGallery.caption || 'User gallery image'}
                  className="w-full h-full object-cover rounded"
                />
              </div>
              
              {selectedGallery.caption && (
                <div>
                  <Label>Caption:</Label>
                  <p className="text-muted-foreground">{selectedGallery.caption}</p>
                </div>
              )}
              
              <div>
                <Label htmlFor="adminNotes">Admin Notes (Optional)</Label>
                <Textarea
                  id="adminNotes"
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Add notes for this image..."
                  rows={3}
                />
              </div>
              
              <div className="flex gap-3">
                <Button
                  onClick={() => handleGalleryAction(selectedGallery.id, true)}
                  disabled={processing}
                  className="flex-1"
                >
                  <Check className="h-4 w-4 mr-2" />
                  Approve
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleGalleryAction(selectedGallery.id, false)}
                  disabled={processing}
                  className="flex-1"
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedGallery(null)}
                  disabled={processing}
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default ReviewsManager;