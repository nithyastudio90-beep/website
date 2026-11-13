import React, { useState } from 'react';
import {
  Edit2,
  Check,
  X,
  Camera,
  Plus,
  Trash2,
  Clock,
  Tag,
  Users,
  Image as ImageIcon
} from 'lucide-react';
import { Service } from '../../types/database.types';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { parseGoogleDriveUrl } from '../../lib/supabase';

interface ServiceManagerProps {
  services: Service[];
  onSaveService: (srv: Service) => Promise<boolean>;
  onDeleteService?: (id: string) => Promise<boolean>;
}

export const ServiceManager: React.FC<ServiceManagerProps> = ({
  services,
  onSaveService,
  onDeleteService,
}) => {
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const emptyService: Service = {
    id: `srv-${Date.now()}`,
    title: '',
    slug: '',
    short_description: '',
    full_description: '',
    image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    price: 10000,
    price_label: '₹10,000 onward',
    duration_minutes: 240,
    duration_label: '4 Hours',
    capacity: 1,
    is_active: true,
    display_order: services.length + 1,
    features: ['Professional Coverage', 'High-Res Edited Photos']
  };

  const [formData, setFormData] = useState<Service>(emptyService);

  const handleOpenAdd = () => {
    setFormData({
      ...emptyService,
      id: `srv-${Date.now()}`,
      display_order: services.length + 1
    });
    setIsAddingNew(true);
  };

  const handleOpenEdit = (srv: Service) => {
    setEditingService(srv);
    setFormData(srv);
  };

  const handleToggleActive = async (srv: Service) => {
    await onSaveService({ ...srv, is_active: !srv.is_active });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setIsSaving(true);
    const cleanSlug = formData.slug.trim() || formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const cleanImageUrl = parseGoogleDriveUrl(formData.image_url);

    const serviceToSave: Service = {
      ...formData,
      slug: cleanSlug,
      image_url: cleanImageUrl
    };

    await onSaveService(serviceToSave);
    setIsSaving(false);
    setIsAddingNew(false);
    setEditingService(null);
  };

  const handleDelete = async () => {
    if (!deleteId || !onDeleteService) return;
    await onDeleteService(deleteId);
    setDeleteId(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="p-4 rounded-2xl bg-studio-card/90 border border-studio-border/70 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-cinzel text-base font-semibold text-studio-light">
            Studio Services Directory ({services.length})
          </h3>
          <p className="text-xs text-studio-muted">
            Add unlimited photography & videography packages, set pricing, and control public visibility.
          </p>
        </div>

        <Button
          variant="gold"
          size="sm"
          onClick={handleOpenAdd}
          leftIcon={<Plus className="w-4 h-4 text-studio-black" />}
        >
          Add New Service
        </Button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((srv) => (
          <div
            key={srv.id}
            className="rounded-2xl overflow-hidden bg-studio-card/90 border border-studio-border/70 flex flex-col justify-between hover:border-gold-500/40 transition-colors shadow-lg"
          >
            <div className="relative h-44 overflow-hidden bg-studio-dark">
              <img
                src={srv.image_url}
                alt={srv.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 flex items-center gap-2">
                <button
                  onClick={() => handleToggleActive(srv)}
                  className={`px-2.5 py-1 rounded-full text-[10px] uppercase font-semibold tracking-wider transition-colors ${
                    srv.is_active
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  }`}
                >
                  {srv.is_active ? 'Active' : 'Disabled'}
                </button>
              </div>

              {srv.price_label && (
                <div className="absolute bottom-3 left-3 bg-studio-black/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-gold-500/40 text-[11px] font-semibold text-gold-400 flex items-center gap-1">
                  <Tag className="w-3 h-3" />
                  <span>{srv.price_label}</span>
                </div>
              )}
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-1">
                  <h4 className="font-cinzel text-base font-bold text-studio-light">
                    {srv.title}
                  </h4>
                  <span className="text-[11px] text-studio-muted flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{srv.duration_label || `${srv.duration_minutes || 240}m`}</span>
                  </span>
                </div>

                <p className="text-xs text-studio-muted line-clamp-2 leading-relaxed mb-4">
                  {srv.short_description}
                </p>
              </div>

              <div className="pt-3 border-t border-studio-border/60 flex items-center justify-between">
                <span className="text-[10px] text-studio-muted">Order: #{srv.display_order}</span>
                <div className="flex items-center gap-2">
                  {onDeleteService && (
                    <button
                      onClick={() => setDeleteId(srv.id)}
                      className="p-2 rounded-lg bg-studio-surface border border-studio-border text-studio-muted hover:text-rose-400 hover:border-rose-500/40 text-xs"
                      title="Delete Service"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <Button
                    variant="dark"
                    size="sm"
                    onClick={() => handleOpenEdit(srv)}
                    leftIcon={<Edit2 className="w-3.5 h-3.5 text-gold-400" />}
                  >
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Service Modal */}
      <Modal
        isOpen={isAddingNew || editingService !== null}
        onClose={() => {
          setIsAddingNew(false);
          setEditingService(null);
        }}
        title={isAddingNew ? "Add New Studio Service" : `Edit Service: ${formData.title}`}
        maxWidth="lg"
      >
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-studio-muted mb-1 font-semibold uppercase tracking-wider text-[10px]">
                Service Title *
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Traditional Wedding Photography"
                className="w-full bg-studio-dark border border-studio-border rounded-xl px-3 py-2 text-studio-light focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-studio-muted mb-1 font-semibold uppercase tracking-wider text-[10px]">
                URL Slug (Optional)
              </label>
              <input
                type="text"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="e.g. wedding-photography"
                className="w-full bg-studio-dark border border-studio-border rounded-xl px-3 py-2 text-studio-light focus:outline-none focus:border-gold-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-studio-muted mb-1 font-semibold uppercase tracking-wider text-[10px]">
              Cover Image URL or Google Drive Link *
            </label>
            <input
              type="text"
              required
              value={formData.image_url}
              onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
              placeholder="https://images.unsplash.com/... or Google Drive link"
              className="w-full bg-studio-dark border border-studio-border rounded-xl px-3 py-2 text-studio-light focus:outline-none focus:border-gold-500"
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label className="block text-studio-muted mb-1 font-semibold uppercase tracking-wider text-[10px]">
                Price Label
              </label>
              <input
                type="text"
                value={formData.price_label || ''}
                onChange={(e) => setFormData({ ...formData, price_label: e.target.value })}
                placeholder="e.g. ₹25,000 onward"
                className="w-full bg-studio-dark border border-studio-border rounded-xl px-3 py-2 text-studio-light focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-studio-muted mb-1 font-semibold uppercase tracking-wider text-[10px]">
                Duration Label
              </label>
              <input
                type="text"
                value={formData.duration_label || ''}
                onChange={(e) => setFormData({ ...formData, duration_label: e.target.value })}
                placeholder="e.g. Full Day / 8h"
                className="w-full bg-studio-dark border border-studio-border rounded-xl px-3 py-2 text-studio-light focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block text-studio-muted mb-1 font-semibold uppercase tracking-wider text-[10px]">
                Display Order
              </label>
              <input
                type="number"
                value={formData.display_order}
                onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 1 })}
                className="w-full bg-studio-dark border border-studio-border rounded-xl px-3 py-2 text-studio-light focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="flex items-center gap-2 pt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="rounded bg-studio-dark border-studio-border text-gold-500 focus:ring-gold-500"
                />
                <span className="text-xs font-semibold text-studio-light">Active</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-studio-muted mb-1 font-semibold uppercase tracking-wider text-[10px]">
              Short Description *
            </label>
            <textarea
              rows={2}
              required
              value={formData.short_description}
              onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
              placeholder="Brief summary for service cards..."
              className="w-full bg-studio-dark border border-studio-border rounded-xl px-3 py-2 text-studio-light focus:outline-none focus:border-gold-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-studio-muted mb-1 font-semibold uppercase tracking-wider text-[10px]">
              Full Description & Package Details
            </label>
            <textarea
              rows={3}
              value={formData.full_description || ''}
              onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
              placeholder="Detailed inclusions, cameras used, albums included..."
              className="w-full bg-studio-dark border border-studio-border rounded-xl px-3 py-2 text-studio-light focus:outline-none focus:border-gold-500 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-studio-border/60">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsAddingNew(false);
                setEditingService(null);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" variant="gold" size="sm" disabled={isSaving}>
              {isSaving ? "Saving..." : isAddingNew ? "Create Service" : "Save Changes"}
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={Boolean(deleteId)}
        onClose={() => setDeleteId(null)}
        title="Delete Service"
      >
        <div className="space-y-4 text-xs">
          <p className="text-studio-muted">
            Are you sure you want to permanently delete this service? Previously confirmed bookings for this service will remain intact in your historical records.
          </p>
          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="ghost" size="sm" onClick={() => setDeleteId(null)}>Cancel</Button>
            <Button variant="danger" size="sm" onClick={handleDelete}>Delete Service</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
