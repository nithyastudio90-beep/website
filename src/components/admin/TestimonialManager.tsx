import React, { useState } from 'react';
import { Plus, Trash2, Star, Edit, Check, AlertCircle, Quote } from 'lucide-react';
import { Testimonial } from '../../types/database.types';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

interface TestimonialManagerProps {
  testimonials: Testimonial[];
  onSave: (t: Testimonial) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}

export const TestimonialManager: React.FC<TestimonialManagerProps> = ({
  testimonials,
  onSave,
  onDelete,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<Testimonial>({
    id: '',
    client_name: '',
    event_type: 'Traditional Wedding',
    location: 'Karapattu, Tamil Nadu',
    rating: 5,
    comment: '',
    is_featured: true,
    is_published: true,
    display_order: 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOpenAdd = () => {
    setEditingItem({
      id: `test-${Date.now()}`,
      client_name: '',
      event_type: 'Wedding Photography',
      location: 'Uthangarai, Tamil Nadu',
      rating: 5,
      comment: '',
      is_featured: true,
      is_published: true,
      display_order: testimonials.length + 1,
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (t: Testimonial) => {
    setEditingItem(t);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem.client_name || !editingItem.comment) return;

    setIsSubmitting(true);
    await onSave(editingItem);
    setIsSubmitting(false);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-studio-card/80 p-6 rounded-2xl border border-studio-border">
        <div>
          <h2 className="font-cinzel text-xl font-bold text-studio-light">
            Customer Testimonials
          </h2>
          <p className="text-xs text-studio-muted mt-1">
            Display genuine reviews from couples and families on the public homepage.
          </p>
        </div>

        <Button
          variant="gold"
          size="sm"
          onClick={handleOpenAdd}
          className="flex items-center gap-2 shadow-gold-glow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Testimonial</span>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {testimonials.map((t) => (
          <div
            key={t.id}
            className="p-5 bg-studio-card rounded-2xl border border-studio-border flex flex-col justify-between space-y-4 hover:border-gold-500/40 transition-colors"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-1 text-gold-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-gold-400 text-gold-400" />
                  ))}
                </div>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${t.is_published ? 'bg-green-950/60 text-green-300 border border-green-800/40' : 'bg-zinc-800 text-zinc-400'}`}>
                  {t.is_published ? 'Published' : 'Draft'}
                </span>
              </div>

              <p className="text-xs text-studio-light/90 italic leading-relaxed line-clamp-3">
                "{t.comment}"
              </p>
            </div>

            <div className="pt-3 border-t border-white/5 flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold text-studio-light">{t.client_name}</h4>
                <p className="text-[10px] text-gold-400">{t.event_type} • {t.location}</p>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => handleOpenEdit(t)}
                  className="p-1.5 rounded-lg text-studio-muted hover:text-gold-400 hover:bg-studio-charcoal transition-colors"
                >
                  <Edit className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setDeleteId(t.id)}
                  className="p-1.5 rounded-lg text-studio-muted hover:text-red-400 hover:bg-red-950/40 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {testimonials.length === 0 && (
          <div className="col-span-full py-16 text-center text-studio-muted bg-studio-card/40 rounded-2xl border border-studio-border">
            <Quote className="w-10 h-10 mx-auto text-studio-muted/40 mb-3" />
            <p className="text-sm">No testimonials added yet.</p>
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingItem.id.startsWith('test-') ? 'Add Testimonial' : 'Edit Testimonial'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-studio-light mb-1.5">
              Client / Couple Name *
            </label>
            <input
              type="text"
              value={editingItem.client_name}
              onChange={(e) => setEditingItem({ ...editingItem, client_name: e.target.value })}
              required
              placeholder="e.g. Dinesh & Priya"
              className="w-full bg-studio-charcoal border border-studio-border rounded-xl px-4 py-2.5 text-xs text-studio-light focus:outline-none focus:border-gold-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-studio-light mb-1.5">
                Event Type
              </label>
              <input
                type="text"
                value={editingItem.event_type}
                onChange={(e) => setEditingItem({ ...editingItem, event_type: e.target.value })}
                placeholder="e.g. Wedding Photography"
                className="w-full bg-studio-charcoal border border-studio-border rounded-xl px-3 py-2 text-xs text-studio-light focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-xs uppercase tracking-wider font-semibold text-studio-light mb-1.5">
                Location
              </label>
              <input
                type="text"
                value={editingItem.location}
                onChange={(e) => setEditingItem({ ...editingItem, location: e.target.value })}
                placeholder="e.g. Uthangarai"
                className="w-full bg-studio-charcoal border border-studio-border rounded-xl px-3 py-2 text-xs text-studio-light focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-studio-light mb-1.5">
              Rating (1 - 5 Stars)
            </label>
            <select
              value={editingItem.rating}
              onChange={(e) => setEditingItem({ ...editingItem, rating: parseInt(e.target.value) || 5 })}
              className="w-full bg-studio-charcoal border border-studio-border rounded-xl px-3 py-2 text-xs text-studio-light focus:outline-none focus:border-gold-500"
            >
              <option value={5}>★★★★★ (5 Stars - Exceptional)</option>
              <option value={4}>★★★★☆ (4 Stars - Very Good)</option>
              <option value={3}>★★★☆☆ (3 Stars - Good)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-wider font-semibold text-studio-light mb-1.5">
              Review Comments *
            </label>
            <textarea
              rows={4}
              value={editingItem.comment}
              onChange={(e) => setEditingItem({ ...editingItem, comment: e.target.value })}
              required
              placeholder="What did the client say about their experience with Nithya Studio?"
              className="w-full bg-studio-charcoal border border-studio-border rounded-xl p-3 text-xs text-studio-light focus:outline-none focus:border-gold-500"
            />
          </div>

          <div className="flex items-center gap-6 pt-2">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-studio-light">
              <input
                type="checkbox"
                checked={editingItem.is_published}
                onChange={(e) => setEditingItem({ ...editingItem, is_published: e.target.checked })}
                className="rounded accent-gold-500"
              />
              <span>Published on Website</span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
            <Button variant="ghost" size="sm" type="button" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="gold" size="sm" type="submit" disabled={isSubmitting} className="shadow-gold-glow-sm">
              {isSubmitting ? 'Saving...' : 'Save Testimonial'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <Modal
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        title="Delete Testimonial"
      >
        <div className="space-y-4">
          <p className="text-xs text-studio-muted">
            Are you sure you want to delete this testimonial?
          </p>
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button variant="ghost" size="sm" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button
              variant="danger"
              size="sm"
              onClick={async () => {
                if (deleteId) {
                  await onDelete(deleteId);
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
