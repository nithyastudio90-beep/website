import React, { useState } from 'react';
import { Plus, Trash2, Star, Image as ImageIcon, Sparkles, AlertTriangle } from 'lucide-react';
import { GalleryImage, GalleryCategory } from '../../types/database.types';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

interface GalleryManagerProps {
  images: GalleryImage[];
  categories: GalleryCategory[];
  onAddImage: (img: Omit<GalleryImage, 'id' | 'created_at'>) => Promise<void>;
  onDeleteImage: (id: string) => Promise<void>;
}

export const GalleryManager: React.FC<GalleryManagerProps> = ({
  images,
  categories,
  onAddImage,
  onDeleteImage,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const [newImage, setNewImage] = useState({
    title: '',
    category_slug: categories[1]?.slug || 'wedding-photography',
    category_id: categories[1]?.id || 'cat-wedding',
    image_url: '',
    thumbnail_url: '',
    is_featured: true,
    display_order: 1,
    alt_text: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredImages = categoryFilter === 'all'
    ? images
    : images.filter((img) => img.category_slug === categoryFilter);

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
      category_slug: categories[1]?.slug || 'wedding-photography',
      category_id: categories[1]?.id || 'cat-wedding',
      image_url: '',
      thumbnail_url: '',
      is_featured: true,
      display_order: 1,
      alt_text: '',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-studio-card/90 border border-studio-border/70">
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-wider text-studio-muted font-semibold">
            Filter Category:
          </span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-studio-dark border border-studio-border text-studio-light text-xs rounded-xl px-3 py-2 focus:outline-none focus:border-gold-500"
          >
            <option value="all">All Categories ({images.length})</option>
            {categories.filter((c) => c.slug !== 'all').map((cat) => (
              <option key={cat.id} value={cat.slug}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <Button
          variant="gold"
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add New Image
        </Button>
      </div>

      {/* Grid of Images */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredImages.map((img) => (
          <div
            key={img.id}
            className="group relative rounded-xl overflow-hidden bg-studio-card border border-studio-border/70 hover:border-gold-500/50 transition-all shadow-md"
          >
            <div className="aspect-[4/3] w-full overflow-hidden bg-studio-dark">
              <img
                src={img.thumbnail_url || img.image_url}
                alt={img.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Overlay Info */}
            <div className="p-3 bg-studio-dark/95 border-t border-studio-border/50 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-gold-400 font-semibold block truncate">
                  {img.category_slug?.replace('-', ' ')}
                </span>
                <h4 className="text-xs font-semibold text-studio-light truncate">
                  {img.title}
                </h4>
              </div>

              <div className="flex items-center justify-between pt-2 mt-2 border-t border-studio-border/40">
                {img.is_featured ? (
                  <span className="text-[10px] text-gold-400 flex items-center gap-1 font-medium">
                    <Star className="w-3 h-3 fill-gold-400" /> Featured
                  </span>
                ) : (
                  <span className="text-[10px] text-studio-muted">Standard</span>
                )}

                <button
                  onClick={() => setDeleteId(img.id)}
                  className="p-1 rounded text-studio-muted hover:text-rose-400 transition-colors"
                  title="Delete Image"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Image Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Image to Studio Gallery"
        maxWidth="md"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block uppercase tracking-wider text-studio-light font-semibold mb-1">
              Image Title <span className="text-gold-400">*</span>
            </label>
            <input
              type="text"
              required
              value={newImage.title}
              onChange={(e) => setNewImage({ ...newImage, title: e.target.value })}
              placeholder="e.g. Sacred Mangalyadharanam Moment"
              className="w-full bg-studio-dark border border-studio-border rounded-xl px-3.5 py-2.5 text-studio-light focus:outline-none focus:border-gold-500"
            />
          </div>

          <div>
            <label className="block uppercase tracking-wider text-studio-light font-semibold mb-1">
              Category <span className="text-gold-400">*</span>
            </label>
            <select
              value={newImage.category_slug}
              onChange={(e) => setNewImage({ ...newImage, category_slug: e.target.value })}
              className="w-full bg-studio-dark border border-studio-border rounded-xl px-3.5 py-2.5 text-studio-light focus:outline-none focus:border-gold-500"
            >
              {categories.filter((c) => c.slug !== 'all').map((cat) => (
                <option key={cat.id} value={cat.slug} className="bg-studio-dark text-white">
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block uppercase tracking-wider text-studio-light font-semibold mb-1">
              Image URL / Supabase Storage Link <span className="text-gold-400">*</span>
            </label>
            <input
              type="url"
              required
              value={newImage.image_url}
              onChange={(e) => setNewImage({ ...newImage, image_url: e.target.value })}
              placeholder="https://images.unsplash.com/... or Supabase storage URL"
              className="w-full bg-studio-dark border border-studio-border rounded-xl px-3.5 py-2.5 text-studio-light focus:outline-none focus:border-gold-500"
            />
          </div>

          <div>
            <label className="block uppercase tracking-wider text-studio-light font-semibold mb-1">
              Alt Text / Description (SEO)
            </label>
            <input
              type="text"
              value={newImage.alt_text}
              onChange={(e) => setNewImage({ ...newImage, alt_text: e.target.value })}
              placeholder="e.g. South Indian bride in red silk saree in Karapattu"
              className="w-full bg-studio-dark border border-studio-border rounded-xl px-3.5 py-2.5 text-studio-light focus:outline-none focus:border-gold-500"
            />
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="is_featured"
              checked={newImage.is_featured}
              onChange={(e) => setNewImage({ ...newImage, is_featured: e.target.checked })}
              className="rounded bg-studio-dark border-studio-border text-gold-500 focus:ring-gold-500"
            />
            <label htmlFor="is_featured" className="text-studio-light font-medium cursor-pointer">
              Mark as Featured on Homepage Portfolio
            </label>
          </div>

          <div className="pt-4 border-t border-studio-border/60 flex items-center justify-end gap-3">
            <Button variant="dark" size="sm" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="gold" size="sm" type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving Image...' : 'Save Image'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        title="Delete Gallery Image"
        maxWidth="sm"
      >
        <div className="text-center py-2 space-y-4 text-xs">
          <div className="w-12 h-12 rounded-full bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <p className="text-studio-muted">
            Are you sure you want to remove this image from the gallery?
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Button variant="dark" size="sm" onClick={() => setDeleteId(null)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={async () => {
                if (deleteId) {
                  await onDeleteImage(deleteId);
                  setDeleteId(null);
                }
              }}
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
