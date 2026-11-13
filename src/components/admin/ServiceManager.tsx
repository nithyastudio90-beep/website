import React, { useState } from 'react';
import { Edit2, Check, X, Camera } from 'lucide-react';
import { Service } from '../../types/database.types';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

interface ServiceManagerProps {
  services: Service[];
  onSaveService: (srv: Service) => Promise<boolean>;
}

export const ServiceManager: React.FC<ServiceManagerProps> = ({
  services,
  onSaveService,
}) => {
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleToggleActive = async (srv: Service) => {
    await onSaveService({ ...srv, is_active: !srv.is_active });
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    setIsSaving(true);
    await onSaveService(editingService);
    setIsSaving(false);
    setEditingService(null);
  };

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-2xl bg-studio-card/90 border border-studio-border/70 flex items-center justify-between">
        <div>
          <h3 className="font-cinzel text-base font-semibold text-studio-light">
            Studio Services Directory ({services.length})
          </h3>
          <p className="text-xs text-studio-muted">
            Manage your service descriptions, cover imagery, and visibility.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((srv) => (
          <div
            key={srv.id}
            className="rounded-2xl overflow-hidden bg-studio-card/90 border border-studio-border/70 flex flex-col justify-between"
          >
            <div className="relative h-44 overflow-hidden bg-studio-dark">
              <img
                src={srv.image_url}
                alt={srv.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3">
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
            </div>

            <div className="p-5 flex-1 flex flex-col justify-between">
              <div>
                <h4 className="font-cinzel text-base font-bold text-studio-light mb-1.5">
                  {srv.title}
                </h4>
                <p className="text-xs text-studio-muted line-clamp-3 leading-relaxed mb-4">
                  {srv.short_description}
                </p>
              </div>

              <div className="pt-3 border-t border-studio-border/60 flex items-center justify-end">
                <Button
                  variant="dark"
                  size="sm"
                  onClick={() => setEditingService(srv)}
                  leftIcon={<Edit2 className="w-3.5 h-3.5 text-gold-400" />}
                >
                  Edit Service
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Service Modal */}
      <Modal
        isOpen={editingService !== null}
        onClose={() => setEditingService(null)}
        title="Edit Service Details"
        maxWidth="lg"
      >
        {editingService && (
          <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block uppercase tracking-wider text-studio-light font-semibold mb-1">
                Service Title
              </label>
              <input
                type="text"
                required
                value={editingService.title}
                onChange={(e) =>
                  setEditingService({ ...editingService, title: e.target.value })
                }
                className="w-full bg-studio-dark border border-studio-border rounded-xl px-3.5 py-2.5 text-studio-light focus:outline-none focus:border-gold-500"
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider text-studio-light font-semibold mb-1">
                Short Description
              </label>
              <textarea
                rows={2}
                required
                value={editingService.short_description}
                onChange={(e) =>
                  setEditingService({
                    ...editingService,
                    short_description: e.target.value,
                  })
                }
                className="w-full bg-studio-dark border border-studio-border rounded-xl px-3.5 py-2.5 text-studio-light focus:outline-none focus:border-gold-500 resize-none"
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider text-studio-light font-semibold mb-1">
                Full Description (Detailed Page)
              </label>
              <textarea
                rows={3}
                value={editingService.full_description || ''}
                onChange={(e) =>
                  setEditingService({
                    ...editingService,
                    full_description: e.target.value,
                  })
                }
                className="w-full bg-studio-dark border border-studio-border rounded-xl px-3.5 py-2.5 text-studio-light focus:outline-none focus:border-gold-500 resize-none"
              />
            </div>

            <div>
              <label className="block uppercase tracking-wider text-studio-light font-semibold mb-1">
                Cover Image URL
              </label>
              <input
                type="url"
                required
                value={editingService.image_url}
                onChange={(e) =>
                  setEditingService({ ...editingService, image_url: e.target.value })
                }
                className="w-full bg-studio-dark border border-studio-border rounded-xl px-3.5 py-2.5 text-studio-light focus:outline-none focus:border-gold-500"
              />
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="edit_service_active"
                checked={editingService.is_active}
                onChange={(e) =>
                  setEditingService({
                    ...editingService,
                    is_active: e.target.checked,
                  })
                }
                className="rounded bg-studio-dark border-studio-border text-gold-500 focus:ring-gold-500"
              />
              <label
                htmlFor="edit_service_active"
                className="text-studio-light font-medium cursor-pointer"
              >
                Display service on public website
              </label>
            </div>

            <div className="pt-4 border-t border-studio-border/60 flex items-center justify-end gap-3">
              <Button
                variant="dark"
                size="sm"
                type="button"
                onClick={() => setEditingService(null)}
              >
                Cancel
              </Button>
              <Button variant="gold" size="sm" type="submit" disabled={isSaving}>
                {isSaving ? 'Updating...' : 'Save Changes'}
              </Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
};
