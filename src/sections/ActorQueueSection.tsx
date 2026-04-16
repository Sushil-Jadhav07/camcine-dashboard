import { useEffect, useMemo, useState } from 'react';
import { CheckCircle, XCircle, Clock, User, Eye, ChevronRight } from 'lucide-react';
import type { Section } from '../App';

interface ActorQueueSectionProps {
  onNavigate: (section: Section) => void;
}

type QueueTab = 'creation' | 'updates';
type CreationStatus = 'Pending' | 'Under Review' | 'Approved' | 'Rejected';

interface ProfileRequest {
  id: number;
  name: string;
  role: string;
  submitted: string;
  status: CreationStatus;
  headshot: string;
  email: string;
  phone: string;
  dob: string;
  nationality: string;
  languages: string;
  bio: string;
  instagram: string;
  imdb: string;
  website: string;
  showreel: string;
  filmography: string[];
}

interface UpdateRequest {
  id: number;
  name: string;
  headshot: string;
  field: string;
  submitted: string;
  currentValue: string;
  requestedValue: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

const initialProfileRequests: ProfileRequest[] = [
  {
    id: 1,
    name: 'Priya Sharma',
    role: 'Actress',
    submitted: '2 hours ago',
    status: 'Pending',
    headshot: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&h=160&fit=crop&crop=face',
    email: 'priya.sharma@example.com',
    phone: '+91 98765 43210',
    dob: '1996-08-14',
    nationality: 'Indian',
    languages: 'Hindi, English, Marathi',
    bio: 'Mumbai-based performer with theatre and independent film experience.',
    instagram: 'https://instagram.com/priyasharma',
    imdb: 'https://imdb.com/name/priyasharma',
    website: 'https://priyasharma.in',
    showreel: 'https://vimeo.com/priya-showreel',
    filmography: ['Monsoon Lines - 2024 - Lead - Movie', 'City Echoes - 2023 - Supporting - Series'],
  },
  {
    id: 2,
    name: 'Arjun Mehta',
    role: 'Director',
    submitted: '4 hours ago',
    status: 'Under Review',
    headshot: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&crop=face',
    email: 'arjun.mehta@example.com',
    phone: '+91 98111 20491',
    dob: '1989-02-22',
    nationality: 'Indian',
    languages: 'Hindi, English, Gujarati',
    bio: 'Director focused on social dramas, short films, and documentary features.',
    instagram: 'https://instagram.com/arjunfilms',
    imdb: 'https://imdb.com/name/arjunmehta',
    website: 'https://arjunmehta.com',
    showreel: 'https://youtube.com/watch?v=arjun-reel',
    filmography: ['Dust Roads - 2025 - Director - Movie', 'Frames - 2022 - Director - Short'],
  },
  {
    id: 3,
    name: 'Neha Iyer',
    role: 'Music Director',
    submitted: '6 hours ago',
    status: 'Pending',
    headshot: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop&crop=face',
    email: 'neha.iyer@example.com',
    phone: '+91 90045 77821',
    dob: '1991-11-03',
    nationality: 'Indian',
    languages: 'Tamil, Hindi, English',
    bio: 'Composer and arranger for indie films, web originals, and songs.',
    instagram: 'https://instagram.com/neha.iyer.music',
    imdb: 'https://imdb.com/name/nehaiyer',
    website: 'https://nehaiyer.studio',
    showreel: 'https://soundcloud.com/neha-iyer',
    filmography: ['The Last Letter - 2024 - Composer - Movie', 'Raag 7 - 2023 - Music Director - Song'],
  },
  {
    id: 4,
    name: 'Kabir Khan',
    role: 'Cinematographer',
    submitted: '8 hours ago',
    status: 'Pending',
    headshot: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop&crop=face',
    email: 'kabir.khan@example.com',
    phone: '+91 99588 11023',
    dob: '1987-04-18',
    nationality: 'Indian',
    languages: 'Hindi, Urdu, English',
    bio: 'Cinematographer working across digital features and commercial films.',
    instagram: 'https://instagram.com/kabirframes',
    imdb: 'https://imdb.com/name/kabirkhan',
    website: 'https://kabirkhanframes.com',
    showreel: 'https://vimeo.com/kabirframes',
    filmography: ['Night Market - 2025 - DOP - Movie', 'Red Fort - 2023 - DOP - Series'],
  },
  {
    id: 5,
    name: 'Meera Rao',
    role: 'Producer',
    submitted: '1 day ago',
    status: 'Pending',
    headshot: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&h=160&fit=crop&crop=face',
    email: 'meera.rao@example.com',
    phone: '+91 98444 22331',
    dob: '1984-09-09',
    nationality: 'Indian',
    languages: 'Kannada, Hindi, English',
    bio: 'Producer backing regional stories and new independent voices.',
    instagram: 'https://instagram.com/meerarao',
    imdb: 'https://imdb.com/name/meerarao',
    website: 'https://meerarao.productions',
    showreel: 'https://youtube.com/meerarao',
    filmography: ['River Home - 2024 - Producer - Movie', 'Tea Stall - 2022 - Producer - Short'],
  },
  {
    id: 6,
    name: 'Rohan Sen',
    role: 'Lyricist',
    submitted: '1 day ago',
    status: 'Pending',
    headshot: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=160&h=160&fit=crop&crop=face',
    email: 'rohan.sen@example.com',
    phone: '+91 97001 33214',
    dob: '1993-01-28',
    nationality: 'Indian',
    languages: 'Bengali, Hindi, English',
    bio: 'Lyricist for film songs, title tracks, and web music albums.',
    instagram: 'https://instagram.com/rohansenwrites',
    imdb: 'https://imdb.com/name/rohansen',
    website: 'https://rohansen.com',
    showreel: 'https://soundcloud.com/rohansen',
    filmography: ['Aami - 2025 - Lyricist - Song', 'Rain Cut - 2023 - Lyricist - Movie'],
  },
  {
    id: 7,
    name: 'Sana Qureshi',
    role: 'Actor',
    submitted: '2 days ago',
    status: 'Pending',
    headshot: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=160&h=160&fit=crop&crop=face',
    email: 'sana.qureshi@example.com',
    phone: '+91 99102 44567',
    dob: '1998-06-30',
    nationality: 'Indian',
    languages: 'Hindi, English, Punjabi',
    bio: 'Actor trained in theatre with recent work in shorts and music videos.',
    instagram: 'https://instagram.com/sanaqureshi',
    imdb: 'https://imdb.com/name/sanaqureshi',
    website: 'https://sanaqureshi.in',
    showreel: 'https://vimeo.com/sana-showreel',
    filmography: ['The Audition - 2024 - Lead - Short', 'Blue Train - 2023 - Supporting - Song'],
  },
];

const initialUpdateRequests: UpdateRequest[] = [
  {
    id: 1,
    name: 'Priya Sharma',
    headshot: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=160&h=160&fit=crop&crop=face',
    field: 'Bio',
    submitted: '35 min ago',
    currentValue: 'Mumbai-based performer with theatre and independent film experience.',
    requestedValue: 'Award-nominated performer working across Hindi cinema, theatre, and streaming originals.',
    status: 'Pending',
  },
  {
    id: 2,
    name: 'Arjun Mehta',
    headshot: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&h=160&fit=crop&crop=face',
    field: 'Instagram Link',
    submitted: '3 hours ago',
    currentValue: 'https://instagram.com/arjunfilms',
    requestedValue: 'https://instagram.com/arjunmehta.director',
    status: 'Pending',
  },
  {
    id: 3,
    name: 'Neha Iyer',
    headshot: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&h=160&fit=crop&crop=face',
    field: 'Headshot',
    submitted: '9 hours ago',
    currentValue: 'Current approved portrait photo',
    requestedValue: 'New studio portrait uploaded on April 15, 2026',
    status: 'Pending',
  },
  {
    id: 4,
    name: 'Kabir Khan',
    headshot: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&h=160&fit=crop&crop=face',
    field: 'Filmography Addition',
    submitted: '1 day ago',
    currentValue: 'Night Market - 2025 - DOP - Movie',
    requestedValue: 'Add: Glass House - 2026 - Cinematographer - Series',
    status: 'Pending',
  },
];

export function ActorQueueSection({ onNavigate }: ActorQueueSectionProps) {
  const [activeTab, setActiveTab] = useState<QueueTab>('creation');
  const [requests, setRequests] = useState(initialProfileRequests);
  const [updateRequests, setUpdateRequests] = useState(initialUpdateRequests);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [comments, setComments] = useState<Record<number, string>>({});
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [toast, setToast] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(''), 2400);
    return () => clearTimeout(timer);
  }, [toast]);

  const filteredProfiles = useMemo(
    () => requests.filter((request) => request.name.toLowerCase().includes(search.toLowerCase())),
    [requests, search]
  );

  const filteredUpdates = useMemo(
    () => updateRequests.filter((request) => request.name.toLowerCase().includes(search.toLowerCase())),
    [updateRequests, search]
  );

  const setProfileStatus = (id: number, status: CreationStatus) => {
    setRequests((current) => current.map((request) => request.id === id ? { ...request, status } : request));
    setRejectingId(null);
    setExpandedId(null);
    setToast(status === 'Approved' ? 'Profile approved successfully.' : 'Profile rejected.');
  };

  const setUpdateStatus = (id: number, status: 'Approved' | 'Rejected') => {
    setUpdateRequests((current) => current.map((request) => request.id === id ? { ...request, status } : request));
    setToast(status === 'Approved' ? 'Update request approved.' : 'Update request rejected.');
  };

  const stats = [
    { label: 'Pending Review', value: '7', icon: Clock },
    { label: 'Approved Today', value: '3', icon: CheckCircle },
    { label: 'Rejected Today', value: '1', icon: XCircle },
  ];

  return (
    <section className="actor-queue-section">
      <div className="queue-bg" />
      <div className="queue-overlay" />
      {toast && <div className="queue-toast"><CheckCircle /> {toast}</div>}

      <div className="queue-content">
        <div
          className="queue-header"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(-20px)',
          }}
        >
          <div>
            <h1>Actor Queue</h1>
            <p>Review verified film industry profile requests.</p>
          </div>
          <button className="header-link" onClick={() => onNavigate('dashboard')}>
            Dashboard <ChevronRight />
          </button>
        </div>

        <div className="queue-tabs">
          <button className={activeTab === 'creation' ? 'active' : ''} onClick={() => { setActiveTab('creation'); setSearch(''); }}>
            Profile Creation Requests
          </button>
          <button className={activeTab === 'updates' ? 'active' : ''} onClick={() => { setActiveTab('updates'); setSearch(''); }}>
            Update Requests
          </button>
        </div>

        <div className="queue-search">
          <User />
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search by actor name..." />
        </div>

        {activeTab === 'creation' && (
          <>
            <div className="queue-stats">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div className="queue-stat-card" key={stat.label} style={{ animationDelay: `${index * 0.08}s` }}>
                    <Icon />
                    <span>{stat.label}</span>
                    <strong>{stat.value}</strong>
                  </div>
                );
              })}
            </div>

            <div className="queue-list">
              {filteredProfiles.map((request, index) => (
                <div className="queue-card" key={request.id} style={{ animationDelay: `${index * 0.06}s` }}>
                  <div className="request-row">
                    <img className="avatar" src={request.headshot} alt="" />
                    <div className="request-main">
                      <strong>{request.name} — {request.role}</strong>
                      <span>Submitted: {request.submitted}</span>
                    </div>
                    <StatusBadge status={request.status} />
                    <button className="review-btn" onClick={() => setExpandedId(expandedId === request.id ? null : request.id)}>
                      <Eye /> Review
                    </button>
                  </div>

                  {expandedId === request.id && (
                    <div className="review-panel">
                      <div className="review-top">
                        <img className="large-headshot" src={request.headshot} alt="" />
                        <div>
                          <h2>{request.name}</h2>
                          <p>{request.role} profile submission</p>
                        </div>
                      </div>

                      <div className="profile-grid">
                        <Info label="Email" value={request.email} />
                        <Info label="Phone" value={request.phone} />
                        <Info label="Date of Birth" value={request.dob} />
                        <Info label="Nationality" value={request.nationality} />
                        <Info label="Languages" value={request.languages} />
                        <Info label="Showreel" value={request.showreel} />
                        <Info label="Bio" value={request.bio} wide />
                      </div>

                      <div className="link-chips">
                        <a href={request.instagram}>Instagram</a>
                        <a href={request.imdb}>IMDb</a>
                        <a href={request.website}>Website</a>
                      </div>

                      <div className="filmography-box">
                        <h3>Filmography</h3>
                        {request.filmography.map((item) => <p key={item}>{item}</p>)}
                      </div>

                      <label className="comment-field">
                        Optional admin comment
                        <textarea
                          value={comments[request.id] || ''}
                          onChange={(event) => setComments((current) => ({ ...current, [request.id]: event.target.value }))}
                          placeholder="Add notes before actioning..."
                        />
                      </label>

                      {rejectingId === request.id && (
                        <label className="comment-field reject-reason">
                          Rejection reason
                          <textarea placeholder="Explain why this profile is rejected..." />
                        </label>
                      )}

                      <div className="review-actions">
                        <button className="approve-btn" onClick={() => setProfileStatus(request.id, 'Approved')}>
                          <CheckCircle /> Approve Profile
                        </button>
                        {rejectingId === request.id ? (
                          <button className="reject-btn filled" onClick={() => setProfileStatus(request.id, 'Rejected')}>
                            <XCircle /> Confirm Reject
                          </button>
                        ) : (
                          <button className="reject-btn" onClick={() => setRejectingId(request.id)}>
                            <XCircle /> Reject
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'updates' && (
          <div className="queue-list">
            {filteredUpdates.map((request, index) => (
              <div className="update-card" key={request.id} style={{ animationDelay: `${index * 0.06}s` }}>
                <div className="request-row">
                  <img className="avatar" src={request.headshot} alt="" />
                  <div className="request-main">
                    <strong>{request.name}</strong>
                    <span>Requested to change: {request.field}</span>
                    <span>Submitted: {request.submitted}</span>
                  </div>
                  <StatusBadge status={request.status} />
                </div>
                <div className="comparison-grid">
                  <div className="current-value">
                    <span>Current Value</span>
                    <p>{request.currentValue}</p>
                  </div>
                  <div className="requested-value">
                    <span>Requested Value</span>
                    <p>{request.requestedValue}</p>
                  </div>
                </div>
                <label className="comment-field">
                  Optional rejection comment
                  <textarea placeholder="Add a reason if rejecting..." />
                </label>
                <div className="review-actions">
                  <button className="approve-btn" onClick={() => setUpdateStatus(request.id, 'Approved')}>
                    <CheckCircle /> Approve Change
                  </button>
                  <button className="reject-btn" onClick={() => setUpdateStatus(request.id, 'Rejected')}>
                    <XCircle /> Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .actor-queue-section {
          position: relative;
          min-height: 100vh;
          padding: 28px 0 56px;
        }

        .queue-bg {
          position: fixed;
          inset: 0;
          background-image: url('/dashboard_bg.jpg');
          background-size: cover;
          background-position: center;
          background-attachment: fixed;
        }

        .queue-overlay {
          position: fixed;
          inset: 0;
          background: linear-gradient(to bottom, rgba(22, 7, 9, 0.86), rgba(22, 7, 9, 0.93) 50%, rgba(22, 7, 9, 0.98));
        }

        .queue-content {
          position: relative;
          z-index: 10;
          max-width: 1300px;
          margin: 0 auto;
          padding: 0 24px;
        }

        .queue-header,
        .queue-tabs,
        .queue-search,
        .queue-stat-card,
        .queue-card,
        .update-card {
          background: linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02)), rgba(50, 18, 23, 0.58);
          border: 1px solid var(--border);
          border-radius: 24px;
          backdrop-filter: blur(24px);
          box-shadow: var(--shadow-soft);
        }

        .queue-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 26px 30px;
          margin-bottom: 22px;
          transition: opacity 0.5s ease, transform 0.5s ease;
        }

        .queue-header h1 {
          color: var(--text-primary);
          font-size: 36px;
          margin-bottom: 8px;
        }

        .queue-header p,
        .request-main span,
        .info-item span,
        .comment-field,
        .filmography-box p {
          color: var(--text-secondary);
          font-size: 13px;
        }

        .header-link,
        .queue-tabs button,
        .review-btn,
        .approve-btn,
        .reject-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text-primary);
          cursor: pointer;
          font-weight: 700;
          padding: 10px 13px;
          transition: all 0.2s ease;
        }

        .header-link,
        .review-btn,
        .queue-tabs button {
          background: rgba(255,255,255,0.04);
        }

        .header-link svg,
        .review-btn svg,
        .approve-btn svg,
        .reject-btn svg,
        .queue-toast svg {
          width: 16px;
          height: 16px;
        }

        .queue-tabs {
          display: flex;
          gap: 10px;
          padding: 8px;
          margin-bottom: 16px;
          width: fit-content;
        }

        .queue-tabs button.active {
          background: rgba(128, 0, 32, 0.18);
          border-color: rgba(128, 0, 32, 0.34);
        }

        .queue-search {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 14px;
          margin-bottom: 22px;
        }

        .queue-search svg {
          width: 18px;
          height: 18px;
          color: var(--accent);
        }

        .queue-search input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: var(--text-primary);
          font-size: 14px;
        }

        .queue-stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 22px;
        }

        .queue-stat-card {
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          gap: 12px;
          padding: 18px;
          animation: queueRise 0.45s ease both;
        }

        .queue-stat-card svg {
          width: 22px;
          height: 22px;
          color: var(--accent);
        }

        .queue-stat-card span {
          color: var(--text-secondary);
          font-size: 13px;
          font-weight: 600;
        }

        .queue-stat-card strong {
          color: var(--text-primary);
          font-size: 24px;
        }

        .queue-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .queue-card,
        .update-card {
          padding: 16px;
          animation: queueRise 0.45s ease both;
        }

        .request-row {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          object-fit: cover;
          border: 1px solid rgba(255,255,255,0.14);
        }

        .request-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .request-main strong,
        .review-top h2,
        .filmography-box h3 {
          color: var(--text-primary);
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,0.08);
          font-size: 12px;
          font-weight: 800;
          white-space: nowrap;
        }

        .status-badge.pending {
          color: #fbbf24;
          background: rgba(245, 158, 11, 0.12);
        }

        .status-badge.under-review {
          color: #93c5fd;
          background: rgba(59, 130, 246, 0.12);
        }

        .status-badge.approved {
          color: #86efac;
          background: rgba(34, 197, 94, 0.12);
        }

        .status-badge.rejected {
          color: #fca5a5;
          background: rgba(239, 68, 68, 0.12);
        }

        .review-panel {
          margin-top: 16px;
          padding: 20px;
          border-top: 1px solid rgba(255,255,255,0.08);
          animation: queueRise 0.25s ease both;
        }

        .review-top {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 18px;
        }

        .large-headshot {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid rgba(128, 0, 32, 0.42);
        }

        .profile-grid,
        .comparison-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 16px;
        }

        .info-item,
        .current-value,
        .requested-value,
        .filmography-box {
          padding: 14px;
          border-radius: 14px;
          border: 1px solid var(--border);
          background: rgba(255,255,255,0.04);
        }

        .info-item.wide {
          grid-column: 1 / -1;
        }

        .info-item strong,
        .current-value p,
        .requested-value p {
          display: block;
          color: var(--text-primary);
          margin-top: 5px;
        }

        .link-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-bottom: 16px;
        }

        .link-chips a {
          color: var(--text-primary);
          background: rgba(128, 0, 32, 0.14);
          border: 1px solid rgba(128, 0, 32, 0.28);
          border-radius: 999px;
          padding: 7px 11px;
          font-size: 13px;
          text-decoration: none;
        }

        .filmography-box {
          margin-bottom: 16px;
        }

        .comment-field {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 14px;
          font-weight: 600;
        }

        .comment-field textarea {
          min-height: 92px;
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--border);
          border-radius: 12px;
          color: var(--text-primary);
          outline: none;
          padding: 12px 14px;
          resize: vertical;
        }

        .comment-field textarea:focus {
          border-color: var(--accent);
          box-shadow: 0 0 0 4px rgba(128, 0, 32, 0.1);
        }

        .reject-reason textarea {
          border-color: rgba(239, 68, 68, 0.32);
        }

        .review-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .approve-btn {
          background: rgba(34, 197, 94, 0.16);
          border-color: rgba(34, 197, 94, 0.34);
          color: #86efac;
        }

        .reject-btn {
          background: transparent;
          border-color: rgba(239, 68, 68, 0.34);
          color: #fca5a5;
        }

        .reject-btn.filled {
          background: rgba(239, 68, 68, 0.16);
        }

        .comparison-grid {
          margin-top: 16px;
        }

        .current-value {
          background: rgba(148, 163, 184, 0.08);
        }

        .requested-value {
          background: rgba(128, 0, 32, 0.14);
          border-color: rgba(128, 0, 32, 0.28);
        }

        .current-value span,
        .requested-value span {
          color: var(--text-secondary);
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.06em;
          text-transform: uppercase;
        }

        .queue-toast {
          position: fixed;
          top: 22px;
          right: 22px;
          z-index: 2000;
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 14px;
          border-radius: 12px;
          color: #86efac;
          background: rgba(22, 40, 28, 0.94);
          border: 1px solid rgba(34, 197, 94, 0.26);
          box-shadow: var(--shadow-soft);
        }

        @keyframes queueRise {
          from {
            opacity: 0;
            transform: translateY(18px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 900px) {
          .queue-header,
          .request-row {
            align-items: flex-start;
            flex-direction: column;
          }

          .queue-stats,
          .profile-grid,
          .comparison-grid {
            grid-template-columns: 1fr;
          }

          .queue-tabs {
            width: 100%;
          }

          .queue-tabs button {
            flex: 1;
          }
        }
      `}</style>
    </section>
  );
}

function Info({ label, value, wide = false }: { label: string; value: string; wide?: boolean }) {
  return (
    <div className={`info-item ${wide ? 'wide' : ''}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function StatusBadge({ status }: { status: CreationStatus | UpdateRequest['status'] }) {
  const className = status.toLowerCase().replace(' ', '-');
  const Icon = status === 'Approved' ? CheckCircle : status === 'Rejected' ? XCircle : Clock;

  return (
    <span className={`status-badge ${className}`}>
      <Icon />
      {status}
    </span>
  );
}
