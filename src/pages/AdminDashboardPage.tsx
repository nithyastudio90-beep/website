import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  CalendarCheck,
  Calendar as CalendarIcon,
  Users,
  Image as ImageIcon,
  Layers,
  Settings,
  Youtube,
  LogOut,
  ExternalLink,
  ShieldCheck,
  RefreshCw,
  LayoutDashboard,
  Home,
  BookOpen,
  MessageSquare,
  Quote,
  Sliders,
  Activity,
  Key,
  Bot,
  Menu,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useStudio } from '../context/StudioContext';
import { DataService } from '../lib/supabase';
import {
  Booking,
  BookingStatus,
  CustomerEnquiry,
  EnquiryStatus,
  GalleryImage,
  Service
} from '../types/database.types';
import { StatsOverview } from '../components/admin/StatsOverview';
import { BookingManager } from '../components/admin/BookingManager';
import { BookingCalendarManager } from '../components/admin/BookingCalendarManager';
import { CustomerManager } from '../components/admin/CustomerManager';
import { ServiceManager } from '../components/admin/ServiceManager';
import { GalleryManager } from '../components/admin/GalleryManager';
import { HomepageManager } from '../components/admin/HomepageManager';
import { AboutManager } from '../components/admin/AboutManager';
import { EnquiryManager } from '../components/admin/EnquiryManager';
import { TestimonialManager } from '../components/admin/TestimonialManager';
import { WebsiteSectionsManager } from '../components/admin/WebsiteSectionsManager';
import { StudioSettingsManager } from '../components/admin/StudioSettingsManager';
import { YouTubeManager } from '../components/admin/YouTubeManager';
import { DiagnosticsManager } from '../components/admin/DiagnosticsManager';
import { AdminAccountManager } from '../components/admin/AdminAccountManager';
import { AIAssistantManager } from '../components/admin/AIAssistantManager';
import { ActivityLogsManager } from '../components/admin/ActivityLogsManager';
import { Button } from '../components/ui/Button';
import { formatDate } from '../lib/utils';

type ActiveTab =
  | 'overview'
  | 'bookings'
  | 'calendar'
  | 'customers'
  | 'services'
  | 'gallery'
  | 'homepage'
  | 'about'
  | 'testimonials'
  | 'settings'
  | 'diagnostics'
  | 'ai'
  | 'security'
  | 'activity_logs'
  | 'enquiries'
  | 'sections'
  | 'youtube';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAdmin, isLoading: authLoading, logout } = useAuth();
  const {
    settings,
    homepage,
    about,
    sections,
    services,
    categories,
    portfolioImages,
    testimonials,
    youtubeVideos,
    customers,
    calendarEvents,
    activityLogs,
    updateSettings,
    updateHomepage,
    updateAbout,
    updateSections,
    saveService,
    deleteService,
    saveCategory,
    deleteCategory,
    savePortfolioImage,
    deletePortfolioImage,
    saveTestimonial,
    deleteTestimonial,
    saveYouTubeVideo,
    deleteYouTubeVideo,
    refreshData,
  } = useStudio();

  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [enquiries, setEnquiries] = useState<CustomerEnquiry[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Authentication check
  useEffect(() => {
    if (!authLoading && !isAdmin) {
      navigate('/admin/login', { replace: true });
    }
  }, [isAdmin, authLoading, navigate]);

  // Load administrative data
  const loadAdminData = async () => {
    setLoadingData(true);
    try {
      const [bData, eData] = await Promise.all([
        DataService.fetchBookings(),
        DataService.fetchEnquiries(),
      ]);
      setBookings(bData);
      setEnquiries(eData);
    } catch (e) {
      console.error('Failed to load admin data:', e);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleUpdateBookingStatus = async (
    id: string,
    status: BookingStatus,
    adminNotes?: string
  ) => {
    const success = await DataService.updateBookingStatus(id, status, adminNotes);
    if (success) {
      setBookings((prev) =>
        prev.map((b) =>
          b.id === id
            ? { ...b, status, ...(adminNotes ? { admin_notes: adminNotes } : {}) }
            : b
        )
      );
    }
  };

  const handleDeleteBooking = async (id: string) => {
    const success = await DataService.deleteBooking(id);
    if (success) {
      setBookings((prev) => prev.filter((b) => b.id !== id));
    }
  };

  const handleUpdateEnquiryStatus = async (
    id: string,
    status: EnquiryStatus,
    adminNotes?: string
  ): Promise<boolean> => {
    const success = await DataService.updateEnquiryStatus(id, status, adminNotes);
    if (success) {
      setEnquiries((prev) =>
        prev.map((e) =>
          e.id === id
            ? { ...e, status, ...(adminNotes ? { admin_notes: adminNotes } : {}) }
            : e
        )
      );
      return true;
    }
    return false;
  };

  const handleAddGalleryImage = async (newImg: any) => {
    await savePortfolioImage(newImg);
  };

  const handleDeleteGalleryImage = async (id: string, storagePath?: string) => {
    await deletePortfolioImage(id, storagePath);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  // 14 Primary Sidebar Navigation Items
  const navItems = [
    { id: 'overview' as ActiveTab, label: 'Overview', icon: LayoutDashboard },
    { id: 'bookings' as ActiveTab, label: 'Bookings', icon: CalendarCheck, badge: bookings.filter(b => b.status === 'New' || b.status === 'Pending').length },
    { id: 'calendar' as ActiveTab, label: 'Booking Calendar', icon: CalendarIcon },
    { id: 'customers' as ActiveTab, label: 'Customers', icon: Users, badge: customers.length },
    { id: 'services' as ActiveTab, label: 'Services', icon: Layers },
    { id: 'gallery' as ActiveTab, label: 'Gallery Management', icon: ImageIcon },
    { id: 'homepage' as ActiveTab, label: 'Homepage Editor', icon: Home },
    { id: 'about' as ActiveTab, label: 'About Page Editor', icon: BookOpen },
    { id: 'testimonials' as ActiveTab, label: 'Reviews', icon: Quote },
    { id: 'settings' as ActiveTab, label: 'Website Settings', icon: Settings },
    { id: 'diagnostics' as ActiveTab, label: 'Cloud & Database Status', icon: Activity },
    { id: 'ai' as ActiveTab, label: 'AI Assistant Settings', icon: Bot },
    { id: 'security' as ActiveTab, label: 'Admin Security', icon: Key },
    { id: 'activity_logs' as ActiveTab, label: 'Activity Logs', icon: ShieldCheck },
    { id: 'enquiries' as ActiveTab, label: 'Customer Enquiries', icon: MessageSquare, badge: enquiries.filter(e => e.status === 'New').length },
    { id: 'sections' as ActiveTab, label: 'Section Visibility', icon: Sliders },
    { id: 'youtube' as ActiveTab, label: 'YouTube Showcase', icon: Youtube },
  ];

  return (
    <div className="min-h-screen bg-studio-black flex">
      {/* Mobile Drawer Overlay */}
      {mobileSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 lg:hidden"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Desktop Sticky & Mobile Drawer Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-screen w-64 bg-studio-dark border-r border-studio-border/70 flex flex-col justify-between z-50 transition-transform duration-300 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Studio Brand Header */}
          <div className="p-5 border-b border-studio-border/70 flex items-center justify-between">
            <div>
              <h1 className="font-cinzel text-base font-bold tracking-wider text-studio-light">
                NITHYA STUDIO
              </h1>
              <p className="text-[9px] tracking-[0.25em] uppercase text-gold-500 font-semibold">
                Studio Management CMS
              </p>
            </div>
            <button
              onClick={() => setMobileSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg text-studio-muted hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links (Scrollable independently) */}
          <nav className="flex-1 overflow-y-auto p-3 space-y-1 text-xs">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all font-medium ${
                    isActive
                      ? 'bg-gold-500 text-studio-black font-semibold shadow-gold-glow-sm'
                      : 'text-studio-muted hover:text-studio-light hover:bg-studio-surface/50'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-studio-black' : 'text-gold-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {Boolean(item.badge) && item.badge! > 0 && (
                    <span
                      className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                        isActive
                          ? 'bg-studio-black text-gold-400'
                          : 'bg-gold-500/20 text-gold-400'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Sidebar Footer Controls */}
          <div className="p-4 border-t border-studio-border/60 space-y-1 bg-studio-dark/50">
            <a
              href="#/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 w-full px-3 py-2 text-xs text-studio-muted hover:text-gold-400 rounded-lg hover:bg-studio-surface transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Public Website</span>
            </a>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-3 py-2 text-xs text-rose-400 hover:text-rose-300 rounded-lg hover:bg-rose-950/20 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* Top Navbar */}
        <header className="h-16 px-6 bg-studio-dark/70 backdrop-blur-md border-b border-studio-border/60 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg bg-studio-surface border border-studio-border text-studio-light"
              aria-label="Toggle menu"
            >
              <Menu className="w-4 h-4" />
            </button>
            <span className="text-xs uppercase tracking-wider text-studio-muted hidden sm:inline">Active Module:</span>
            <span className="text-xs font-semibold text-gold-400 capitalize">
              {navItems.find((n) => n.id === activeTab)?.label}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={async () => {
                await Promise.all([refreshData(), loadAdminData()]);
              }}
              className="p-2 rounded-lg bg-studio-surface border border-studio-border text-studio-muted hover:text-gold-400 transition-colors"
              title="Refresh Data from Supabase"
            >
              <RefreshCw className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 text-xs text-studio-muted pl-3 border-l border-studio-border">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="truncate max-w-[150px]">{user?.email || 'Administrator'}</span>
            </div>
          </div>
        </header>

        {/* Tab Canvas */}
        <div className="p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6 flex-1">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <StatsOverview bookings={bookings} enquiries={enquiries} />
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Bookings preview */}
                <div className="bg-studio-card/80 p-6 rounded-2xl border border-studio-border space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-cinzel text-base font-bold text-studio-light">Recent Booking Enquiries</h3>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab('bookings')} className="text-xs">
                      View All
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {bookings.slice(0, 5).map((b) => (
                      <div key={b.id} className="p-3 bg-studio-surface/50 rounded-xl border border-white/5 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-semibold text-white">{b.customer_name}</p>
                          <p className="text-[10px] text-studio-muted">{b.service_name} • {formatDate(b.event_date)}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                          b.status === 'Pending' || b.status === 'New' ? 'bg-amber-950 text-amber-300' :
                          b.status === 'Confirmed' ? 'bg-emerald-950 text-emerald-300' : 'bg-zinc-800 text-zinc-300'
                        }`}>
                          {b.status}
                        </span>
                      </div>
                    ))}
                    {bookings.length === 0 && (
                      <p className="text-xs text-studio-muted italic py-4 text-center">No bookings submitted yet.</p>
                    )}
                  </div>
                </div>

                {/* Recent Contact Enquiries preview */}
                <div className="bg-studio-card/80 p-6 rounded-2xl border border-studio-border space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-cinzel text-base font-bold text-studio-light">Recent Contact Messages</h3>
                    <Button variant="ghost" size="sm" onClick={() => setActiveTab('enquiries')} className="text-xs">
                      View All
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {enquiries.slice(0, 5).map((e) => (
                      <div key={e.id} className="p-3 bg-studio-surface/50 rounded-xl border border-white/5 flex items-center justify-between text-xs">
                        <div>
                          <p className="font-semibold text-white">{e.customer_name}</p>
                          <p className="text-[10px] text-studio-muted truncate max-w-[200px]">{e.message}</p>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-950 text-blue-300">
                          {e.status}
                        </span>
                      </div>
                    ))}
                    {enquiries.length === 0 && (
                      <p className="text-xs text-studio-muted italic py-4 text-center">No contact messages received yet.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <BookingManager
              bookings={bookings}
              onUpdateStatus={handleUpdateBookingStatus}
              onDeleteBooking={handleDeleteBooking}
            />
          )}

          {activeTab === 'calendar' && (
            <BookingCalendarManager />
          )}

          {activeTab === 'customers' && (
            <CustomerManager />
          )}

          {activeTab === 'services' && (
            <ServiceManager
              services={services}
              onSaveService={saveService}
              onDeleteService={deleteService}
            />
          )}

          {activeTab === 'gallery' && (
            <GalleryManager
              images={portfolioImages}
              categories={categories}
              onAddImage={handleAddGalleryImage}
              onDeleteImage={handleDeleteGalleryImage}
            />
          )}

          {activeTab === 'homepage' && (
            <HomepageManager
              content={homepage}
              onSave={updateHomepage}
            />
          )}

          {activeTab === 'about' && (
            <AboutManager
              content={about}
              onSave={updateAbout}
            />
          )}

          {activeTab === 'testimonials' && (
            <TestimonialManager
              testimonials={testimonials}
              onSave={saveTestimonial}
              onDelete={deleteTestimonial}
            />
          )}

          {activeTab === 'settings' && (
            <StudioSettingsManager
              settings={settings}
              onUpdateSettings={updateSettings}
            />
          )}

          {activeTab === 'diagnostics' && (
            <DiagnosticsManager />
          )}

          {activeTab === 'ai' && (
            <AIAssistantManager />
          )}

          {activeTab === 'security' && (
            <AdminAccountManager />
          )}

          {activeTab === 'activity_logs' && (
            <ActivityLogsManager />
          )}

          {activeTab === 'enquiries' && (
            <EnquiryManager
              enquiries={enquiries}
              onUpdateStatus={handleUpdateEnquiryStatus}
            />
          )}

          {activeTab === 'sections' && (
            <WebsiteSectionsManager
              sections={sections}
              onSave={updateSections}
            />
          )}

          {activeTab === 'youtube' && (
            <YouTubeManager
              videos={youtubeVideos}
              onSaveVideo={saveYouTubeVideo}
              onDeleteVideo={deleteYouTubeVideo}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboardPage;
