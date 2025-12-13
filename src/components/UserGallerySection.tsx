import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Upload, X, Camera } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { reviewsAPI } from "@/lib/api";

interface GalleryImage {
  id: number;
  imageUrl: string;
  caption: string;
  createdAt: string;
  User: {
    firstName: string;
    lastName: string;
  };
}

interface UserGallerySectionProps {
  productId: string;
}

const UserGallerySection = ({ productId }: UserGallerySectionProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Form state
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [caption, setCaption] = useState('');

  useEffect(() => {
    fetchGalleryImages();
  }, [productId]);

  const fetchGalleryImages = async () => {
    try {
      setLoading(true);
      const response = await reviewsAPI.getProductGallery(productId);
      setGalleryImages(response.galleryImages || []);
    } catch (error) {
      console.error('Failed to fetch gallery images:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "Image size should be less than 5MB", variant: "destructive" });
        return;
      }
      setSelectedImage(file);
    }
  };

  const handleUploadImage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast({ title: "Please login to upload images", variant: "destructive" });
      return;
    }

    if (!selectedImage) {
      toast({ title: "Please select an image", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('productId', productId);
      formData.append('image', selectedImage);
      formData.append('caption', caption);

      await reviewsAPI.uploadGalleryImage(formData);
      
      toast({ title: "Image uploaded for approval!" });
      setShowUploadForm(false);
      setSelectedImage(null);
      setCaption('');
      fetchGalleryImages();
    } catch (error: any) {
      toast({ 
        title: error.response?.data?.message || "Failed to upload image", 
        variant: "destructive" 
      });
    } finally {
      setUploading(false);
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
    return <div className="text-center py-8">Loading gallery...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="h-5 w-5" />
            User Gallery
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Share your photos of this product to help other customers see how it looks in real life.
          </p>
          <Button 
            onClick={() => setShowUploadForm(true)}
            disabled={!user}
            className="w-full"
          >
            {user ? 'Upload Your Photo' : 'Login to Upload Photo'}
          </Button>
        </CardContent>
      </Card>

      {/* Upload Form */}
      {showUploadForm && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Your Photo</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUploadImage} className="space-y-4">
              {/* Image Upload */}
              <div>
                <Label>Select Image *</Label>
                <div className="mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="gallery-image"
                  />
                  <label
                    htmlFor="gallery-image"
                    className="flex items-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary"
                  >
                    <Upload className="h-5 w-5" />
                    <span>Choose Image (Max 5MB)</span>
                  </label>
                </div>

                {/* Image Preview */}
                {selectedImage && (
                  <div className="mt-3 relative inline-block">
                    <img
                      src={URL.createObjectURL(selectedImage)}
                      alt="Preview"
                      className="w-32 h-32 object-cover rounded"
                    />
                    <button
                      type="button"
                      onClick={() => setSelectedImage(null)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                )}
              </div>

              {/* Caption */}
              <div>
                <Label htmlFor="caption">Caption (Optional)</Label>
                <Textarea
                  id="caption"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  placeholder="Add a caption to describe your photo"
                  rows={3}
                />
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button type="submit" disabled={uploading}>
                  {uploading ? 'Uploading...' : 'Upload Photo'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowUploadForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Gallery Grid */}
      <div>
        {galleryImages.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <Camera className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No photos yet. Be the first to share your photo!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {galleryImages.map((image) => (
              <Card key={image.id} className="overflow-hidden">
                <div className="aspect-square">
                  <img
                    src={`${import.meta.env.VITE_API_URL?.replace('/api', '') || 'https://elissh.com'}${image.imageUrl}`}
                    alt={image.caption || 'User photo'}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-3">
                  {image.caption && (
                    <p className="text-sm text-muted-foreground mb-2">{image.caption}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    By {image.User.firstName} • {formatDate(image.createdAt)}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserGallerySection;