import React, { useState } from 'react';
import { Plus, Trash2, Star, Image as ImageIcon, Sparkles, Upload, Check, AlertCircle } from 'lucide-react';
import { GalleryImage, GalleryCategory } from '../../types/database.types';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { DataService, parseGoogleDriveUrl } from '../../lib/supabase';

interface GalleryManagerProps {
  images: GalleryImage[];
  categories: GalleryCategory[];
  onAddImage: (img: Omit<GalleryImage, 'id' | 'created_at'>) => Promise<void>;
  onDeleteImage: (id: string, storagePath?: string) => Promise<void>;
}

export const GalleryManager: React.FC<GalleryManagerProps> = ({
  images,
  categories,
  onAddImage,
  onDeleteImage,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<GalleryImage | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const [newImage, setNewImage] = useState({
    title: '',
    category_slug: categories[0]?.slug || 'wedding-photography',
    category_id: categories[0]?.id || 'cat-wedding',
    image_url: '',
    thumbnail_url: '',
    storage_path: '',
    is_featured: true,
    is_published: true,
    display_order: 1,
    alt_text: '',
  });

  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const filteredImages = categoryFilter === 'all'
    ? images
    : images.filter((img) => img.category_slug === categoryFilter);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setUploadError('File size exceeds 15MB limit.');
      return;
    }

    setIsUploading(true);
    setUploadError(null);

    const res = await DataService.uploadImageToStorage(file, `portfolio/${newImage.category_slug}`);
    setIsUploading(false);

    if (res.success && res.url) {
      setNewImage(prev => ({
        ...prev,
        image_url: res.url!,
        thumbnail_url: res.url!,
        storage_path: res.storagePath || '',
        title: prev.title || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        alt_text: prev.alt_text || `Photography portfolio by Nithya Studio`
      }));
    } else {
      setUploadError(res.error || 'Failed to upload image to Supabase Storage.');
    }
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newImage.title || !newImage.image_url) return;

    setIsSubmitting(true);
    const cat = categories.find((c) => c.slug === newImage.category_slug);

    await onAddImage({
      ...newImage,
      category_id: cat ? cat.id : 'cat-wedding',
      thumbnail_url: newImage.thumbnail_url || newImage.image_url,
    });

    setIsSubmitting(false);
    setIsAddModalOpen(false);
    setNewImage({
      title: '',
      category_slug: categories[0]?.slug || 'wedding-photography',
      category_id: categories[0]?.id || 'cat-wedding',
      image_url: '',
      thumbnail_url: '',
      storage_path: '',
      is_featured: true,
      is_published: true,
      display_order: 1,
      alt_text: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-studio-card/80 p-6 rounded-2xl border border-studio-border">
        <div>
          <h2 className="font-cinzel text-xl font-bold text-studio-light">
            Portfolio & Gallery Management
          </h2>
          <p className="text-xs text-studio-muted mt-1">
            Upload, replace, categorize, and publish high-resolution photos via Supabase Storage.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-studio-charcoal border border-studio-border text-xs rounded-xl px-3 py-2 text-studio-light focus:outline-none focus:border-gold-500"
          >
            <option value="all">All Categories ({images.length})</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>

          <Button
            variant="gold"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center gap-2 whitespace-nowrap shadow-gold-glow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Upload Photo</span>
          </Button>
        </div>
      </div>

      {/* Images Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {filteredImages.map((img) => (
          <div
            key={img.id}
            className="group relative bg-studio-card rounded-2xl border border-studio-border overflow-hidden flex flex-col justify-between hover:border-gold-500/50 transition-all shadow-md"
          >
            <div className="aspect-[4/3] w-full overflow-hidden bg-studio-dark relative">
              <img
                src={img.image_url}
                alt={img.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              {img.is_featured && (
                <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-gold-500/90 text-studio-black text-[10px] font-bold flex items-center gap-1 shadow-md">
                  <Star className="w-2.5 h-2.5 fill-studio-black" />
                  <span>Featured</span>
                </div>
              )}
            </div>

            <div className="p-3">
              <p className="text-xs font-semibold text-studio-light line-clamp-1">
                {img.title}
              </p>
              <p className="text-[10px] text-gold-400 capitalize mt-0.5">
                {img.category_slug.replace('-', ' ')}
              </p>

              <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/5">
                <span className="text-[10px] text-studio-muted">Order: {img.display_order}</span>
                <button
                  onClick={() => setDeleteTarget(img)}
                  className="p-1 rounded-lg text-studio-muted hover:text-red-400 hover:bg-red-950/40 transition-colors"
                  title="Delete image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {filteredImages.length === 0 && (
          <div className="col-span-full py-16 text-center text-studio-muted bg-studio-card/40 rounded-2xl border border-studio-border">
            <ImageIcon className="w-10 h-10 mx-auto text-studio-muted/40 mb-3" />
            <p className="text-sm">No photos found in this category.</p>
          </div>
        )}
      </div>

      {/* Upload Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Upload Image to Supabase Gallery"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          {/* File Upload Box */}
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-studio-light mb-1.5">
              Upload Image File (Supabase Storage)
            </label>
            <div className="border-2 border-dashed border-studio-border hover:border-gold-500/60 rounded-2xl p-4 text-center cursor-pointer relative bg-studio-charcoal/50 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                disabled={isUploading}
              />
              <Upload className="w-8 h-8 mx-auto text-gold-400 mb-2" />
              <p className="text-xs font-semibold text-studio-light">
                {isUploading ? 'Uploading to Supabase Storage...' : 'Click or Drag & Drop image here'}
              </p>
              <p className="text-[10px] text-studio-muted mt-1">Supports JPG, PNG, WebP up to 15MB</p>
            </div>
            {uploadError && (
              <p className="text-[11px] text-red-400 mt-1 flex items-center gap-1">
                <AlertCircle className="w-3 h-3" /> {uploadError}
              </p>
            )}
          </div>

          <div className="text-center">
            <span className="text-[10px] text-studio-muted uppercase tracking-wider">— OR PASTE GOOGLE DRIVE / EXTERNAL LINK —</span>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-studio-light mb-1.5">
              Google Drive Link / Direct Image URL
            </label>
            <input
              type="text"
              value={newImage.image_url.startsWith('data:') ? '' : newImage.image_url}
              onChange={(e) => {
                const parsed = parseGoogleDriveUrl(e.target.value);
                setNewImage(prev => ({
                  ...prev,
                  image_url: parsed,
                  thumbnail_url: parsed,
                  google_drive_url: e.target.value
                }));
              }}
              placeholder="https://drive.google.com/file/d/... or https://..."
              className="w-full bg-studio-charcoal border border-studio-border rounded-xl px-4 py-2 text-xs text-studio-light focus:outline-none focus:border-gold-500"
            />
            <p className="text-[10px] text-studio-muted mt-1">Google Drive URLs are automatically parsed to direct high-res renderable assets.</p>
          </div>

          {/* Image Preview */}
          {newImage.image_url && (
            <div className="p-3 bg-studio-charcoal rounded-xl border border-gold-500/30 flex items-center gap-3">
              <img src={newImage.image_url} alt="Preview" className="w-14 h-14 object-cover rounded-lg" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-studio-light truncate">Uploaded Image Ready</p>
                <p className="text-[10px] text-studio-muted truncate">{newImage.image_url}</p>
              </div>
              <Check className="w-5 h-5 text-green-400 flex-shrink-0" />
            </div>
          )}

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-studio-light mb-1.5">
              Image Title / Caption *
            </label>
            <input
              type="text"
              value={newImage.title}
              onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
              placeholder="e.g. Sacred Muhurtham Garland Exchange"
              required
              className="w-full bg-studio-charcoal border border-studio-border rounded-xl px-4 py-2.5 text-xs text-studio-light focus:outline-none focus:border-gold-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-studio-light mb-1.5">
                Category
              </label>
              <select
                value={newImage.category_slug}
                onChange={(e) => setNewImage({ ...newImage, category_slug: e.target.value })}
                className="w-full bg-studio-charcoal border border-studio-border rounded-xl px-3 py-2 text-xs text-studio-light focus:outline-none focus:border-gold-500"
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-studio-light mb-1.5">
                Display Order
              </label>
              <input
                type="number"
                value={newImage.display_order}
                onChange={(e) => setNewImage({ ...newImage, display_order: parseInt(e.target.value) || 1 })}
                className="w-full bg-studio-charcoal border border-studio-border rounded-xl px-3 py-2 text-xs text-studio-light focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-studio-light">
              <input
                type="checkbox"
                checked={newImage.is_featured}
                onChange={(e) => setNewImage({ ...newImage, is_featured: e.target.checked })}
                className="rounded accent-gold-500"
              />
              <span>Feature on Homepage</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-studio-light">
              <input
                type="checkbox"
                checked={newImage.is_published}
                onChange={(e) => setNewImage({ ...newImage, is_published: e.target.checked })}
                className="rounded accent-gold-500"
              />
              <span>Published</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="gold"
              size="sm"
              type="submit"
              disabled={isSubmitting || !newImage.image_url}
              className="shadow-gold-glow-sm"
            >
              {isSubmitting ? 'Saving...' : 'Add to Portfolio'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteTarget)}
        onClose={() => setDeleteTarget(null)}
        title="Confirm Photo Deletion"
      >
        <div className="space-y-4">
          <p className="text-xs text-studio-muted">
            Are you sure you want to permanently delete <strong className="text-white">"{deleteTarget?.title}"</strong>? If uploaded to Supabase Storage, the file will also be removed.
          </p>

          <div className="flex items-center justify-end gap-3 pt-4">
            <Button variant="ghost" size="sm" onClick={() => setDeleteTarget(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={async () => {
                if (deleteTarget) {
                  await onDeleteImage(deleteTarget.id, deleteTarget.storage_path);
                  setDeleteTarget(null);
                }
              }}
            >
              Permanently Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
