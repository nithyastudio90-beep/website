import React, { useState } from 'react';
import { Youtube, Plus, Trash2, ExternalLink, Play } from 'lucide-react';
import { YouTubeVideo } from '../../types/database.types';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

interface YouTubeManagerProps {
  videos: YouTubeVideo[];
  onSaveVideo: (video: YouTubeVideo) => Promise<boolean>;
  onDeleteVideo: (id: string) => Promise<boolean>;
}

export const YouTubeManager: React.FC<YouTubeManagerProps> = ({
  videos,
  onSaveVideo,
  onDeleteVideo,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [newVideo, setNewVideo] = useState({
    title: '',
    video_url: '',
    youtube_id: '',
    description: '',
    is_featured: true,
  });

  const extractYouTubeId = (url: string): string => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : 'dQw4w9WgXcQ';
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVideo.title || !newVideo.video_url) return;

    const ytId = extractYouTubeId(newVideo.video_url);

    const videoToSave: YouTubeVideo = {
      id: `yt-${Date.now()}`,
      title: newVideo.title,
      video_url: newVideo.video_url,
      youtube_id: ytId,
      thumbnail_url: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
      description: newVideo.description,
      is_featured: newVideo.is_featured,
      display_order: videos.length + 1,
      created_at: new Date().toISOString(),
    };

    await onSaveVideo(videoToSave);
    setIsAddModalOpen(false);
    setNewVideo({
      title: '',
      video_url: '',
      youtube_id: '',
      description: '',
      is_featured: true,
    });
  };

  return (
    <div className="space-y-6">
      <div className="p-4 rounded-2xl bg-studio-card/90 border border-studio-border/70 flex items-center justify-between">
        <div>
          <h3 className="font-cinzel text-base font-semibold text-studio-light">
            YouTube Video Showcase Management ({videos.length})
          </h3>
          <p className="text-xs text-studio-muted">
            Manage highlight films displayed on the homepage and video pages.
          </p>
        </div>

        <Button
          variant="gold"
          size="sm"
          onClick={() => setIsAddModalOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Video Link
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {videos.map((vid) => (
          <div
            key={vid.id}
            className="p-5 rounded-2xl bg-studio-card/90 border border-studio-border/70 space-y-4"
          >
            <div className="aspect-video rounded-xl overflow-hidden bg-black relative group">
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${vid.youtube_id}`}
                title={vid.title}
                className="w-full h-full border-0"
              />
            </div>

            <div>
              <h4 className="font-cinzel text-sm font-bold text-studio-light">
                {vid.title}
              </h4>
              <p className="text-xs text-studio-muted line-clamp-2 mt-1">
                {vid.description}
              </p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-studio-border/40 text-xs">
              <a
                href={vid.video_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold-400 hover:underline flex items-center gap-1"
              >
                <span>View on YouTube</span>
                <ExternalLink className="w-3 h-3" />
              </a>

              <button
                onClick={() => setDeleteId(vid.id)}
                className="p-1 text-studio-muted hover:text-rose-400"
                title="Remove Video"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add YouTube Video Link"
        maxWidth="md"
      >
        <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block uppercase tracking-wider text-studio-light font-semibold mb-1">
              Video Title
            </label>
            <input
              type="text"
              required
              value={newVideo.title}
              onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
              placeholder="e.g. Tamil Wedding Cinematic Highlights 4K"
              className="w-full bg-studio-dark border border-studio-border rounded-xl px-3.5 py-2.5 text-studio-light focus:outline-none focus:border-gold-500"
            />
          </div>

          <div>
            <label className="block uppercase tracking-wider text-studio-light font-semibold mb-1">
              YouTube Video URL
            </label>
            <input
              type="url"
              required
              value={newVideo.video_url}
              onChange={(e) => setNewVideo({ ...newVideo, video_url: e.target.value })}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full bg-studio-dark border border-studio-border rounded-xl px-3.5 py-2.5 text-studio-light focus:outline-none focus:border-gold-500"
            />
          </div>

          <div>
            <label className="block uppercase tracking-wider text-studio-light font-semibold mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={newVideo.description}
              onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
              placeholder="Brief description of the wedding film or trailer..."
              className="w-full bg-studio-dark border border-studio-border rounded-xl px-3.5 py-2.5 text-studio-light focus:outline-none focus:border-gold-500 resize-none"
            />
          </div>

          <div className="pt-4 border-t border-studio-border/60 flex items-center justify-end gap-3">
            <Button variant="dark" size="sm" type="button" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="gold" size="sm" type="submit">
              Save Video
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteId !== null}
        onClose={() => setDeleteId(null)}
        title="Delete Video"
        maxWidth="sm"
      >
        <div className="text-center py-2 space-y-4 text-xs">
          <p className="text-studio-muted">
            Are you sure you want to remove this video from your showcase?
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
                  await onDeleteVideo(deleteId);
                  setDeleteId(null);
                }
              }}
            >
              Confirm Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
