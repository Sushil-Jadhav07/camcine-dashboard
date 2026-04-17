import { useState } from 'react';
import {
  BadgeCheck,
  CheckCircle,
  Clock,
  Film,
  Loader2,
  Mail,
  Phone,
  Plus,
  Upload,
  User,
  Video,
} from 'lucide-react';

const mockActorData = {
  profile: {
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    phone: '+1 (555) 123-4567',
    bio: 'Professional actor with 10+ years experience in film, television, and commercial work. Specialized in drama and action roles.',
    avatar: 'https://ui-avatars.com/api/?name=Alex+Johnson&background=780000&color=fff',
    rating: 4.8,
    completedJobs: 127,
    verified: true,
  },
  upcomingJobs: [
    { id: 1, title: 'Mystery Thriller', role: 'Lead Detective', date: '2024-03-20', status: 'confirmed', director: 'Sarah Chen' },
    { id: 2, title: 'Commercial Campaign', role: 'Brand Ambassador', date: '2024-03-22', status: 'pending', director: 'Mike Roberts' },
    { id: 3, title: 'Independent Film', role: 'Supporting Actor', date: '2024-03-25', status: 'confirmed', director: 'Lisa Martinez' },
  ],
  portfolio: [
    { id: 1, title: 'The Last Stand', type: 'Film', year: 2023, role: 'Lead', thumbnail: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80' },
    { id: 2, title: 'City Lights', type: 'Series', year: 2023, role: 'Recurring', thumbnail: 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=900&q=80' },
    { id: 3, title: 'Brand X Commercial', type: 'Commercial', year: 2022, role: 'Lead', thumbnail: 'https://images.unsplash.com/photo-1499364615650-ec38552f4f34?auto=format&fit=crop&w=900&q=80' },
  ],
};

export function ActorPortalSection({ onNavigate }) {
  const [activeTab, setActiveTab] = useState('profile');
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = (event) => {
    if (event.target.files?.length) {
      setUploading(true);
      window.setTimeout(() => setUploading(false), 2000);
    }
  };

  return (
    <section className="dashboard-shell">
      <div className="shell-container">
        <div className="hero-panel compact">
          <div className="hero-content hero-grid">
            <div className="hero-copy">
              <span className="hero-topline">Actor portal</span>
              <h1>Profile, booking queue, and portfolio in a sharper presentation.</h1>
              <p>All current tabs stay intact. The redesign shifts this into a polished profile-first workspace.</p>
            </div>
            <div className="hero-side">
              <button className="btn btn-secondary" onClick={() => onNavigate('actor-queue')}>
                <Clock size={16} />
                View Queue
              </button>
            </div>
          </div>
        </div>

        <div className="surface-panel">
          <div className="surface-content toolbar">
            <div className="toolbar-group">
              {[
                ['profile', 'Profile', User],
                ['jobs', 'Jobs', Film],
                ['portfolio', 'Portfolio', Video],
              ].map(([id, label, Icon]) => (
                <button key={id} className={`tab-button ${activeTab === id ? 'active' : ''}`} onClick={() => setActiveTab(id)}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
                    <Icon size={16} />
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {activeTab === 'profile' && (
          <div className="content-grid-2">
            <div className="surface-panel">
              <div className="surface-content">
                <div style={{ display: 'flex', gap: 18, alignItems: 'center', flexWrap: 'wrap' }}>
                  <img
                    src={mockActorData.profile.avatar}
                    alt={mockActorData.profile.name}
                    style={{ width: 110, height: 110, borderRadius: 26, border: '1px solid rgba(255,244,242,0.12)' }}
                  />
                  <div>
                    <div className="inline-meta" style={{ marginBottom: 8 }}>
                      {mockActorData.profile.verified && <span className="status-pill success"><BadgeCheck size={14} /> Verified</span>}
                    </div>
                    <h2 style={{ margin: 0 }}>{mockActorData.profile.name}</h2>
                    <p className="subtle" style={{ marginTop: 10 }}>{mockActorData.profile.bio}</p>
                    <div className="inline-meta" style={{ marginTop: 12 }}>
                      <span><Mail size={14} /> {mockActorData.profile.email}</span>
                      <span><Phone size={14} /> {mockActorData.profile.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="metric-grid" style={{ gridTemplateColumns: '1fr' }}>
              <div className="metric-card">
                <div className="metric-icon"><Film size={22} /></div>
                <span className="eyebrow">Completed Jobs</span>
                <strong>{mockActorData.profile.completedJobs}</strong>
              </div>
              <div className="metric-card">
                <div className="metric-icon"><BadgeCheck size={22} /></div>
                <span className="eyebrow">Profile Rating</span>
                <strong>{mockActorData.profile.rating}</strong>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'jobs' && (
          <div className="surface-panel">
            <div className="surface-content">
              <div className="section-heading">
                <div>
                  <h3>Upcoming Jobs</h3>
                  <p>Same data, organized as a casting call sheet.</p>
                </div>
              </div>
              <div className="list-stack">
                {mockActorData.upcomingJobs.map((job) => (
                  <div key={job.id} className="list-card">
                    <div>
                      <strong style={{ display: 'block', marginBottom: 4 }}>{job.title}</strong>
                      <div className="subtle">{job.role}</div>
                      <div className="inline-meta" style={{ marginTop: 10 }}>
                        <span>Director: {job.director}</span>
                        <span>{job.date}</span>
                      </div>
                    </div>
                    <span className={`status-pill ${job.status === 'confirmed' ? 'success' : 'warning'}`}>
                      {job.status === 'confirmed' ? <CheckCircle size={14} /> : <Clock size={14} />}
                      {job.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'portfolio' && (
          <div className="surface-panel">
            <div className="surface-content">
              <div className="section-heading">
                <div>
                  <h3>Portfolio</h3>
                  <p>Selected work displayed as editorial-style tiles.</p>
                </div>
                <button className="btn btn-primary">
                  <Plus size={16} />
                  Add Work
                </button>
              </div>
              <div className="poster-grid">
                {mockActorData.portfolio.map((item) => (
                  <article key={item.id} className="poster-card">
                    <div className="poster-media">
                      <img src={item.thumbnail} alt={item.title} />
                    </div>
                    <div className="poster-body">
                      <h3 style={{ marginBottom: 8 }}>{item.title}</h3>
                      <div className="inline-meta">
                        <span>{item.type}</span>
                        <span>{item.year}</span>
                        <span>{item.role}</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="surface-panel">
          <div className="surface-content">
            <div className="section-heading">
              <div>
                <h3>Upload Area</h3>
                <p>Upload interaction is preserved.</p>
              </div>
            </div>
            <label
              htmlFor="actor-upload"
              style={{
                display: 'grid',
                placeItems: 'center',
                minHeight: 180,
                borderRadius: 24,
                border: '1px dashed rgba(255,244,242,0.18)',
                background: 'rgba(255,244,242,0.04)',
                cursor: 'pointer',
                textAlign: 'center',
                gap: 10,
                padding: 20,
              }}
            >
              {uploading ? (
                <>
                  <Loader2 size={24} className="spin-loader" />
                  <strong>Uploading...</strong>
                </>
              ) : (
                <>
                  <Upload size={24} />
                  <strong>Upload headshots or demo reel</strong>
                  <span className="subtle">Drag and drop or click to browse</span>
                </>
              )}
            </label>
            <input id="actor-upload" type="file" multiple accept="image/*,video/*" style={{ display: 'none' }} onChange={handleFileUpload} />
          </div>
        </div>

        <style>{`
          .spin-loader {
            animation: spin-loader 1s linear infinite;
          }
          @keyframes spin-loader {
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </section>
  );
}
