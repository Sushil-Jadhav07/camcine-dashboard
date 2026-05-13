import { useEffect, useState } from 'react';
import { AlertCircle, ArrowLeft, Calendar, Clock, Eye, Film, Music, RefreshCw, Tag, Tv, Users } from 'lucide-react';
import { PAGE_STYLES } from '../lib/pageStyles.js';
import { contentService } from '../services/content.js';

const asArray = value => Array.isArray(value) ? value : value ? [value] : [];
const normalizeContent = data => data?.content || data?.item || data || null;
const normalizeList = data => data?.cast || data?.episodes || data?.items || data || [];
const typeIcon = {
  movie: Film,
  short_film: Film,
  news: Film,
  show: Tv,
  song: Music,
};

function durationLabel(seconds) {
  if (!seconds) return 'N/A';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h ? `${h}h ${m}m` : `${m}m`;
}

function statValue(value) {
  const n = Number(value || 0);
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toString();
}

export function ContentDetailSection({ onNavigate, contentId }) {
  const [content, setContent] = useState(null);
  const [cast, setCast] = useState([]);
  const [episodes, setEpisodes] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);
  useEffect(() => {
    if (contentId) fetchDetail();
  }, [contentId]);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      const detail = await contentService.getContentById(contentId);
      setContent(normalizeContent(detail.data));

      const [castResult, episodeResult] = await Promise.allSettled([
        contentService.getCast(contentId),
        contentService.getEpisodes(contentId),
      ]);

      setCast(castResult.status === 'fulfilled' ? normalizeList(castResult.value.data) : []);
      setEpisodes(episodeResult.status === 'fulfilled' ? normalizeList(episodeResult.value.data) : []);
    } catch (e) {
      setError(e.message || 'Failed to load content details');
    } finally {
      setLoading(false);
    }
  };

  const back = () => onNavigate && onNavigate('content');
  const genres = asArray(content?.genre);
  const Icon = typeIcon[content?.type] || Film;
  const poster = content?.poster_url || content?.thumbnail_url || content?.image_url;
  const stats = content?.stats || content?.analytics || {};
  const tabs = content?.type === 'show' ? ['overview', 'cast', 'episodes'] : ['overview', 'cast'];

  return (
    <div className={`page ${visible ? 'visible' : ''}`}>
      <div className="page-inner">
        <div className="ph">
          <div className="ph-left">
            <button className="btn btn-secondary btn-sm" onClick={back}><ArrowLeft size={14}/>Content Library</button>
            <h1 style={{marginTop:14}}>{content?.title || 'Content Details'}</h1>
            <p>{content?.description || 'View title metadata, cast, and episodes from the backend API.'}</p>
          </div>
          <div className="ph-right">
            <button className="btn btn-secondary btn-sm" onClick={fetchDetail} disabled={loading || !contentId}>
              <RefreshCw size={13} className={loading ? 'spin-icon' : ''}/>Refresh
            </button>
          </div>
        </div>

        {!contentId && (
          <div className="empty"><AlertCircle size={36}/><p>Select a title from Content Library first.</p></div>
        )}

        {error && (
          <div className="api-error">
            <AlertCircle size={16}/>{error}
            <button className="btn btn-secondary btn-sm" onClick={fetchDetail}>Retry</button>
          </div>
        )}

        {loading && !content ? (
          <div className="loader"><span className="spin"/>Loading content details...</div>
        ) : content && (
          <>
            <div className="detail-hero">
              <div className="poster">
                {poster ? <img src={poster} alt={content.title}/> : <Icon size={54}/>}
              </div>
              <div className="detail-main">
                <div className="meta-row">
                  <span className="badge b-accent"><Icon size={12}/>{content.type}</span>
                  <span className={`badge ${content.status === 'published' ? 'b-green' : 'b-yellow'}`}>{content.status || 'draft'}</span>
                  {content.rating && <span className="badge b-gray">{content.rating}</span>}
                </div>
                <h2>{content.title}</h2>
                <p>{content.description || 'No description added.'}</p>
                <div className="quick-grid">
                  <Info icon={Calendar} label="Release" value={content.release_year || content.release_date || 'N/A'} />
                  <Info icon={Clock} label="Duration" value={durationLabel(content.duration_seconds)} />
                  <Info icon={Tag} label="Genres" value={genres.join(', ') || 'N/A'} />
                  <Info icon={Eye} label="Views" value={statValue(stats.views || content.views || content.view_count)} />
                </div>
              </div>
            </div>

            <div className="tabs">
              {tabs.map(tab => (
                <button key={tab} className={`tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                  {tab[0].toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>

            {activeTab === 'overview' && (
              <div className="card">
                <div className="card-title">Backend Content Record</div>
                <div className="detail-grid">
                  <Field label="ID" value={content.id || content._id} />
                  <Field label="Language" value={content.language} />
                  <Field label="Director" value={content.director} />
                  <Field label="Free/Paid" value={content.is_free ? 'Free' : `Paid - ₹${content.price_tvod || 0}`} />
                  <Field label="Created" value={content.created_at} />
                  <Field label="Updated" value={content.updated_at} />
                </div>
              </div>
            )}

            {activeTab === 'cast' && (
              <div className="card">
                <div className="card-title">Cast From /content/{contentId}/cast</div>
                {cast.length ? (
                  <div className="list">
                    {cast.map((member, index) => (
                      <div className="list-row" key={member.id || member._id || index}>
                        <div className="avatar">{(member.name || member.actor_name || '?')[0]}</div>
                        <div>
                          <div className="row-title">{member.name || member.actor_name || member.full_name || 'Unnamed cast member'}</div>
                          <div className="row-sub">{member.role || member.character_name || 'Cast'}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <div className="empty"><Users size={32}/><p>No cast added.</p></div>}
              </div>
            )}

            {activeTab === 'episodes' && (
              <div className="card">
                <div className="card-title">Episodes From /content/{contentId}/episodes</div>
                {episodes.length ? (
                  <div className="list">
                    {episodes.map((episode, index) => (
                      <div className="list-row" key={episode.id || episode._id || index}>
                        <div className="episode-num">{episode.episode_number || index + 1}</div>
                        <div>
                          <div className="row-title">{episode.title || `Episode ${index + 1}`}</div>
                          <div className="row-sub">{durationLabel(episode.duration_seconds)}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <div className="empty"><Tv size={32}/><p>No episodes added.</p></div>}
              </div>
            )}
          </>
        )}
      </div>

      <style>{`
        ${PAGE_STYLES}
        @keyframes spin{to{transform:rotate(360deg)}}
        .spin,.spin-icon{animation:spin .75s linear infinite}
        .loader{display:flex;align-items:center;justify-content:center;gap:12px;padding:70px 0;color:rgba(255,255,255,.35);font-size:14px}
        .spin{width:18px;height:18px;border-radius:50%;border:2px solid rgba(255,255,255,.12);border-top-color:rgba(255,255,255,.55)}
        .api-error{display:flex;align-items:center;gap:10px;padding:14px 16px;background:rgba(239,68,68,.07);border:1px solid rgba(239,68,68,.15);border-radius:12px;color:#fca5a5;font-size:13px;margin-bottom:16px}
        .api-error .btn{margin-left:auto}
        .detail-hero{display:grid;grid-template-columns:260px 1fr;gap:22px;background:#141414;border:1px solid rgba(255,255,255,.07);border-radius:16px;padding:18px;margin-bottom:18px}
        .poster{aspect-ratio:2/3;background:#1a1a1a;border-radius:12px;display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,.25);overflow:hidden}
        .poster img{width:100%;height:100%;object-fit:cover}
        .detail-main{display:flex;flex-direction:column;justify-content:center;min-width:0}
        .meta-row{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}
        .meta-row .badge{display:flex;align-items:center;gap:5px}
        .detail-main h2{font-family:'Sora',sans-serif;font-size:28px;line-height:1.15;margin:0 0 10px;color:#f5f5f5}
        .detail-main p{font-size:14px;color:rgba(255,255,255,.50);line-height:1.7;margin:0 0 18px;max-width:860px}
        .quick-grid,.detail-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:12px}
        .info,.field{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:12px}
        .info{display:flex;gap:10px;align-items:flex-start}
        .info svg{color:#ff8080;flex-shrink:0}
        .info-label,.field-label{font-size:10px;text-transform:uppercase;letter-spacing:.08em;color:rgba(255,255,255,.28);margin-bottom:5px}
        .info-value,.field-value{font-size:13px;font-weight:650;color:rgba(255,255,255,.72);overflow-wrap:anywhere}
        .list{display:flex;flex-direction:column;gap:8px}
        .list-row{display:flex;align-items:center;gap:12px;padding:12px;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);border-radius:10px}
        .avatar,.episode-num{width:34px;height:34px;border-radius:10px;background:rgba(204,26,26,.15);border:1px solid rgba(204,26,26,.25);display:flex;align-items:center;justify-content:center;color:#ff8080;font-weight:800}
        .row-title{font-size:13px;font-weight:700;color:#f5f5f5}
        .row-sub{font-size:12px;color:rgba(255,255,255,.36);margin-top:3px}
        @media(max-width:900px){.detail-hero{grid-template-columns:1fr}.poster{max-width:240px}.quick-grid,.detail-grid{grid-template-columns:1fr 1fr}}
        @media(max-width:560px){.quick-grid,.detail-grid{grid-template-columns:1fr}}
      `}</style>
    </div>
  );
}

function Info({ icon: Icon, label, value }) {
  return (
    <div className="info">
      <Icon size={16}/>
      <div><div className="info-label">{label}</div><div className="info-value">{value || 'N/A'}</div></div>
    </div>
  );
}

function Field({ label, value }) {
  return (
    <div className="field">
      <div className="field-label">{label}</div>
      <div className="field-value">{value || 'N/A'}</div>
    </div>
  );
}
