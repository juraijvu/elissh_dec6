import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Upload, Eye, Settings, Tag, Image as ImageIcon, ArrowUp, ArrowDown } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiCall } from '@/lib/api';

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    image: '',
    parentId: null,
    isActive: true,
    sortOrder: 1,
    metaTitle: '',
    metaDescription: '',
    seoKeywords: '',
    seoContent: '',
    h1Tag: '',
    primaryKeyword: '',
    focusKeyword: '',
    altText: '',
    canonicalUrl: '',
    seoScore: '0.8',
    noIndex: false,
    noFollow: false,
    enableSchema: true,
    ogTitle: '',
    ogDescription: '',
    twitterTitle: '',
    twitterDescription: '',
    showOnHomepage: false
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await apiCall('/categories/admin/all');
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      toast({ title: 'Error fetching categories', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        const response = await apiCall(`/categories/${editingCategory.id}`, {
          method: 'PUT',
          body: JSON.stringify(formData)
        });
        toast({ title: 'Category updated successfully!' });
      } else {
        const response = await apiCall('/categories', {
          method: 'POST',
          body: JSON.stringify(formData)
        });
        toast({ title: 'Category created successfully!' });
      }
      fetchCategories();
      resetForm();
    } catch (error) {
      toast({ title: 'Error saving category', variant: 'destructive' });
    }
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description,
      image: category.image,
      parentId: category.parentId,
      isActive: category.isActive,
      sortOrder: category.sortOrder,
      metaTitle: category.metaTitle || '',
      metaDescription: category.metaDescription || '',
      seoKeywords: Array.isArray(category.seoKeywords) ? category.seoKeywords.join(', ') : (category.seoKeywords || ''),
      seoContent: category.seoContent || '',
      h1Tag: category.h1Tag || '',
      primaryKeyword: category.primaryKeyword || '',
      focusKeyword: category.focusKeyword || '',
      altText: category.altText || '',
      canonicalUrl: category.canonicalUrl || '',
      seoScore: category.seoScore?.toString() || '0.8',
      noIndex: category.noIndex || false,
      noFollow: category.noFollow || false,
      enableSchema: category.enableSchema ?? true,
      ogTitle: category.ogTitle || '',
      ogDescription: category.ogDescription || '',
      twitterTitle: category.twitterTitle || '',
      twitterDescription: category.twitterDescription || '',
      showOnHomepage: category.showOnHomepage
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        const response = await apiCall(`/categories/${id}`, {
          method: 'DELETE'
        });
        toast({ title: 'Category deleted successfully!' });
        fetchCategories();
      } catch (error) {
        toast({ title: 'Error deleting category', variant: 'destructive' });
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      image: '',
      parentId: null,
      isActive: true,
      sortOrder: 1,
      metaTitle: '',
      metaDescription: '',
      seoKeywords: '',
      seoContent: '',
      showOnHomepage: false
    });
    setEditingCategory(null);
    setIsDialogOpen(false);
  };

  const generateSlug = (name) => {
    return name.toLowerCase().replace(/[^a-zA-Z0-9]/g, '-').replace(/-+/g, '-');
  };

  const moveCategory = (id, direction) => {
    setCategories(prev => {
      const newCategories = [...prev];
      const index = newCategories.findIndex(cat => cat.id === id);
      if (direction === 'up' && index > 0) {
        [newCategories[index], newCategories[index - 1]] = [newCategories[index - 1], newCategories[index]];
      } else if (direction === 'down' && index < newCategories.length - 1) {
        [newCategories[index], newCategories[index + 1]] = [newCategories[index + 1], newCategories[index]];
      }
      return newCategories;
    });
  };

  return (
    <div className="p-6 pt-2">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Category Management</h1>
          <p className="text-muted-foreground">Organize your products with categories and subcategories</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCategory ? 'Edit Category' : 'Create New Category'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Category Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => {
                        setFormData(prev => ({ 
                          ...prev, 
                          name: e.target.value,
                          slug: generateSlug(e.target.value)
                        }));
                      }}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="slug">URL Slug</Label>
                    <Input
                      id="slug"
                      value={formData.slug}
                      onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>

                <div>
                  <Label htmlFor="parentId">Parent Category</Label>
                  <Select value={formData.parentId?.toString() || 'none'} onValueChange={(value) => setFormData(prev => ({ ...prev, parentId: value === 'none' ? null : parseInt(value) }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select parent category (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No Parent (Main Category)</SelectItem>
                      {categories.filter(cat => cat.parentId === null).map(cat => (
                        <SelectItem key={cat.id} value={cat.id.toString()}>{cat.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Category Image</h3>
                <div className="border-2 border-dashed border-gray-300 rounded p-6 text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">Click to upload category image</p>
                  <p className="text-xs text-gray-400">Recommended: 300x200px</p>
                </div>
              </div>

              {/* SEO Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">SEO Settings</h3>
                <div>
                  <Label htmlFor="metaTitle">SEO Title (≤60 chars)</Label>
                  <Input
                    id="metaTitle"
                    value={formData.metaTitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, metaTitle: e.target.value }))}
                    placeholder={`${formData.name} - Premium Beauty Products | Elissh`}
                    maxLength={60}
                  />
                  <p className="text-xs text-muted-foreground mt-1">{(formData.metaTitle || '').length}/60</p>
                </div>
                <div>
                  <Label htmlFor="metaDescription">Meta Description (≤155 chars)</Label>
                  <Textarea
                    id="metaDescription"
                    rows={3}
                    value={formData.metaDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, metaDescription: e.target.value }))}
                    placeholder={`Discover premium ${formData.name?.toLowerCase()} products. Shop authentic beauty brands with free shipping in UAE.`}
                    maxLength={155}
                  />
                  <p className="text-xs text-muted-foreground mt-1">{(formData.metaDescription || '').length}/155</p>
                </div>
                <div>
                  <Label htmlFor="seoKeywords">SEO Keywords (comma-separated)</Label>
                  <Input
                    id="seoKeywords"
                    value={formData.seoKeywords || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, seoKeywords: e.target.value }))}
                    placeholder={`${formData.name?.toLowerCase()}, beauty products uae, cosmetics online`}
                  />
                </div>
                <div>
                  <Label htmlFor="seoContent">SEO Content (for category page)</Label>
                  <Textarea
                    id="seoContent"
                    rows={4}
                    value={formData.seoContent || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, seoContent: e.target.value }))}
                    placeholder="Additional SEO content, buying guides, category information..."
                  />
                </div>
              </div>

              {/* Display Settings */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Display Settings</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="sortOrder">Sort Order</Label>
                    <Input
                      id="sortOrder"
                      type="number"
                      value={formData.sortOrder}
                      onChange={(e) => setFormData(prev => ({ ...prev, sortOrder: parseInt(e.target.value) }))}
                    />
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isActive"
                        checked={formData.isActive}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isActive: checked }))}
                      />
                      <Label htmlFor="isActive">Active</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="showOnHomepage"
                        checked={formData.showOnHomepage}
                        onCheckedChange={(checked) => setFormData(prev => ({ ...prev, showOnHomepage: checked }))}
                      />
                      <Label htmlFor="showOnHomepage">Show on Homepage</Label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancel
                </Button>
                <Button type="submit">
                  {editingCategory ? 'Update' : 'Create'} Category
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories List */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid gap-4">
          {categories.map((category) => (
          <Card key={category.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-20 h-20 rounded bg-gray-100 flex items-center justify-center overflow-hidden">
                    {category.image ? (
                      <img 
                        src={category.image} 
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{category.name}</h3>
                      <Badge variant={category.isActive ? 'default' : 'secondary'}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                      {category.showOnHomepage && (
                        <Badge variant="outline">Homepage</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">/{category.slug}</p>
                    <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                    
                    {category.children && category.children.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Subcategories:</p>
                        <div className="flex flex-wrap gap-1">
                          {category.children.map(sub => (
                            <Badge key={sub.id} variant="outline" className="text-xs">
                              {sub.name}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex flex-col gap-1">
                    <Button size="sm" variant="outline" onClick={() => moveCategory(category.id, 'up')}>
                      <ArrowUp className="w-3 h-3" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => moveCategory(category.id, 'down')}>
                      <ArrowDown className="w-3 h-3" />
                    </Button>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => handleEdit(category)}>
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => handleDelete(category.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
          ))}
        </div>
      )}

      {/* Category Statistics */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Category Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{categories.filter(c => c.parentId === null).length}</p>
              <p className="text-sm text-muted-foreground">Main Categories</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{categories.reduce((acc, c) => acc + (c.subcategories?.length || 0), 0)}</p>
              <p className="text-sm text-muted-foreground">Subcategories</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{categories.filter(c => c.isActive).length}</p>
              <p className="text-sm text-muted-foreground">Active Categories</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">{categories.filter(c => c.showOnHomepage).length}</p>
              <p className="text-sm text-muted-foreground">Homepage Featured</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryManager;