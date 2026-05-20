import { useEffect, useState } from 'react';
import { AlertCircle, ArrowLeft, Calendar, Clock, Edit2, Eye, Film, FileText, Music, Music2, Plus, RefreshCw, Tag, Trash2, Tv, Upload, Users, X } from 'lucide-react';
import { PAGE_STYLES } from '../lib/pageStyles.js';
import { contentService } from '../services/content.js';
import { viewService } from '../services/views.js';
import { CustomSelect } from '../components/CustomSelect.jsx';
import { ConfirmDeleteDialog } from '../components/ConfirmDeleteDialog.jsx';

const asArray = value => Array.isArray(value) ? value : value ? [value] : [];
const normalizeContent = data => data?.content || data?.item || data || null;
const normalizeList = data => data?.cast || data?.episodes || data?.items || data || [];
const countries = ['India','United States','United Kingdom','Canada','Australia','United Arab Emirates','Other'];
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
  const [viewStats, setViewStats] = useState({});
  const [activeTab, setActiveTab] = useState('overview');
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modals state
  const [showCastModal, setShowCastModal] = useState(false);
  const [showEpisodeModal, setShowEpisodeModal] = useState(false);
  const [showAssetModal, setShowAssetModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [confirmLoading, setConfirmLoading] = useState(false);

  // Form states
  const [editForm, setEditForm] = useState({
    title: '', description: '', language: '', country: '', genre: '', director: '',
    release_year: '', rating: '', status: 'draft', duration_seconds: '', is_free: true, price_tvod: 0,
  });
  const [castForm, setCastForm] = useState({ actor_name: '', character_name: '', role_type: 'supporting_actor', billing_order: 1 });
  const [episodeForm, setEpisodeForm] = useState({ season: 1, episode_number: 1, title: '', description: '', duration_seconds: 3600, is_free: true });
  const [editingEpisodeId, setEditingEpisodeId] = useState(null);
  const [episodeFiles, setEpisodeFiles] = useState({ thumbnail: null, video: null });
  const [assetFiles, setAssetFiles] = useState({ audio_hq: null, audio_lq: null, lyrics: null });
  const [imageFiles, setImageFiles] = useState({ poster: null, thumbnail: null });
  const [assetType, setAssetType] = useState('audio'); // 'audio' or 'lyrics'
  const [uploadProgress, setUploadProgress] = useState({});

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
      const viewsResult = await viewService.getContentStats(contentId).catch(() => ({ data: {} }));

      setCast(castResult.status === 'fulfilled' ? normalizeList(castResult.value.data) : []);
      setEpisodes(episodeResult.status === 'fulfilled' ? normalizeList(episodeResult.value.data) : []);
      setViewStats(viewsResult.data || {});
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
  const imageUploads = asArray(content?.images?.uploads);
  const stats = { ...(content?.stats || content?.analytics || {}), ...viewStats };
  const tabs = content?.type === 'show' 
    ? ['overview', 'cast', 'episodes'] 
    : content?.type === 'song' 
      ? ['overview', 'cast', 'assets'] 
      : content?.type === 'movie'
        ? ['overview', 'cast', 'images']
        : ['overview', 'cast'];

  // Handlers
  const openEditModal = () => {
    setEditForm({
      title: content?.title || '',
      description: content?.description || '',
      language: content?.language || '',
      country: content?.country || countries[0],
      genre: asArray(content?.genre).join(', '),
      director: content?.director || '',
      release_year: content?.release_year || '',
      rating: content?.rating || '',
      status: content?.status || 'draft',
      duration_seconds: content?.duration_seconds || '',
      is_free: content?.is_free !== false,
      price_tvod: content?.price_tvod || 0,
    });
    setModalError(null);
    setShowEditModal(true);
  };

  const handleEditContent = async (e) => {
    e.preventDefault();
    try {
      setModalLoading(true);
      setModalError(null);
      const payload = {
        type: content.type,
        title: editForm.title.trim(),
        description: editForm.description.trim(),
        language: editForm.language.trim() || undefined,
        country: editForm.country.trim() || undefined,
        genre: editForm.genre.split(',').map(item => item.trim()).filter(Boolean),
        director: editForm.director.trim() || undefined,
        release_year: editForm.release_year ? Number(editForm.release_year) : undefined,
        rating: editForm.rating.trim() || undefined,
        status: editForm.status || undefined,
        duration_seconds: editForm.duration_seconds ? Number(editForm.duration_seconds) : undefined,
        is_free: editForm.is_free,
        price_tvod: editForm.is_free ? 0 : Number(editForm.price_tvod || 0),
      };
      Object.keys(payload).forEach(key => payload[key] === undefined && delete payload[key]);
      const updated = await contentService.updateContent(contentId, payload);
      if (updated?.data) setContent(normalizeContent(updated.data));
      setShowEditModal(false);
      await fetchDetail();
    } catch (err) {
      setModalError(err.message || 'Failed to update content');
    } finally {
      setModalLoading(false);
    }
  };

  const handleStatusToggle = async () => {
    const nextStatus = content?.status === 'published' ? 'draft' : 'published';
    try {
      setLoading(true);
      await contentService.updateStatus(contentId, nextStatus);
      await fetchDetail();
    } catch (err) {
      setError(err.message || 'Failed to update status');
    } finally {
      setLoading(false);
    }
  };

  const requestDeleteContent = () => {
    if (content?.status === 'archived') {
      alert('This content is already archived.');
      return;
    }
    setConfirmDelete({
      title: 'Delete content?',
      message: `"${content?.title || 'This content'}" will be moved to archived content and hidden from the active library.`,
      confirmLabel: 'Delete',
      action: async () => {
        await contentService.deleteContent(contentId);
        back();
      },
    });
  };

  const handleAddCast = async (e) => {
    e.preventDefault();
    try {
      setModalLoading(true);
      setModalError(null);
      await contentService.addCastMember(contentId, content.type, castForm);
      setShowCastModal(false);
      fetchDetail();
    } catch (err) {
      setModalError(err.message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteCast = async (castId) => {
    setConfirmDelete({
      title: 'Remove cast member?',
      message: 'This cast member will be removed from the selected content.',
      confirmLabel: 'Remove',
      action: async () => {
        await contentService.deleteCastMember(contentId, content.type, castId);
        await fetchDetail();
      },
    });
  };

  const openAddEpisodeModal = () => {
    setEditingEpisodeId(null);
    setEpisodeForm({ season: 1, episode_number: episodes.length + 1, title: '', description: '', duration_seconds: 3600, is_free: true });
    setEpisodeFiles({ thumbnail: null, video: null });
    setUploadProgress({});
    setModalError(null);
    setShowEpisodeModal(true);
  };

  const openEditEpisodeModal = episode => {
    setEditingEpisodeId(episode.id || episode._id);
    setEpisodeForm({
      season: episode.season || 1,
      episode_number: episode.episode_number || 1,
      title: episode.title || '',
      description: episode.description || '',
      duration_seconds: episode.duration_seconds || 3600,
      is_free: episode.is_free !== false,
      price_tvod: episode.price_tvod || 0,
      status: episode.status || 'published',
      aired_date: episode.aired_date || '',
    });
    setEpisodeFiles({ thumbnail: null, video: null });
    setUploadProgress({});
    setModalError(null);
    setShowEpisodeModal(true);
  };

  const handleSaveEpisode = async (e) => {
    e.preventDefault();
    try {
      setModalLoading(true);
      setModalError(null);
      setUploadProgress({});
      if (editingEpisodeId) {
        await contentService.updateEpisode(contentId, editingEpisodeId, episodeForm);
      } else {
        await contentService.addEpisodeWithUploads(contentId, episodeForm, episodeFiles, (key, progress) => {
          setUploadProgress(p => ({ ...p, [key]: progress }));
        });
      }
      setShowEpisodeModal(false);
      setEditingEpisodeId(null);
      setEpisodeFiles({ thumbnail: null, video: null });
      fetchDetail();
    } catch (err) {
      setModalError(err.message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteEpisode = async (episodeId) => {
    setConfirmDelete({
      title: 'Delete episode?',
      message: 'This episode will be moved to archived content.',
      confirmLabel: 'Delete',
      action: async () => {
        await contentService.deleteEpisode(contentId, episodeId);
        await fetchDetail();
      },
    });
  };

  const runConfirmDelete = async () => {
    if (!confirmDelete?.action) return;
    try {
      setConfirmLoading(true);
      await confirmDelete.action();
      setConfirmDelete(null);
    } catch (err) {
      setError(err.message || 'Delete failed');
    } finally {
      setConfirmLoading(false);
    }
  };

  const handleUploadAssets = async (e) => {
    e.preventDefault();
    try {
      setModalLoading(true);
      setModalError(null);
      setUploadProgress({});
      if (assetType === 'audio') {
        if (!assetFiles.audio_hq) throw new Error('HQ Audio is required');
        await contentService.uploadAudio(assetFiles.audio_hq, assetFiles.audio_lq, contentId, (key, progress) => {
          setUploadProgress(p => ({ ...p, [key]: progress }));
        });
      } else {
        if (!assetFiles.lyrics) throw new Error('Lyrics file is required');
        await contentService.uploadLyrics(assetFiles.lyrics, contentId, (key, progress) => {
          setUploadProgress(p => ({ ...p, [key]: progress }));
        });
      }
      setShowAssetModal(false);
      setAssetFiles({ audio_hq: null, audio_lq: null, lyrics: null });
      fetchDetail();
    } catch (err) {
      setModalError(err.message);
    } finally {
      setModalLoading(false);
    }
  };

  const handleUploadImageAsset = async (kind) => {
    const file = imageFiles[kind];
    if (!file) {
      setModalError(`Select a ${kind} image first.`);
      return;
    }

    try {
      setModalLoading(true);
      setModalError(null);
      setUploadProgress(p => ({ ...p, [kind]: 0 }));

      const upload = await contentService.uploadImage(
        file,
        contentId,
        content.type,
        progress => setUploadProgress(p => ({ ...p, [kind]: progress })),
        kind,
      );
      const url = upload.url || upload.data?.public_url || upload.data?.publicUrl;
      if (!url) throw new Error(`${kind} upload did not return a URL.`);

      await contentService.attachMediaUrls(contentId, {
        type: content.type,
        [`${kind}_url`]: url,
      });
      setImageFiles(p => ({ ...p, [kind]: null }));
      setUploadProgress(p => ({ ...p, [kind]: undefined }));
      await fetchDetail();
    } catch (err) {
      setModalError(err.message || `Failed to upload ${kind} image`);
    } finally {
      setModalLoading(false);
    }
  };

  return (
    <div className={`page ${visible ? 'visible' : ''}`}>
      <div className="page-inner">
        <div className="ph">
          <div className="ph-left">
            <button className="btn btn-secondary btn-sm" onClick={back}><ArrowLeft size={14}/>Content Library</button>
            <h1 style={{marginTop:14}}>{content?.title || 'Content Details'}</h1>
            <p>{content?.description || 'View title metadata and stats from the backend API.'}</p>
          </div>
          <div className="ph-right">
            {content && (
              <>
                <button className="btn btn-secondary btn-sm" onClick={handleStatusToggle} disabled={loading || content.status === 'archived'}>
                  {content.status === 'published' ? <Clock size={13}/> : <Eye size={13}/>}
                  {content.status === 'published' ? 'Set Draft' : 'Publish'}
                </button>
                <button className="btn btn-primary btn-sm" onClick={openEditModal}>
                  <Edit2 size={13}/>Edit
                </button>
                <button className="btn btn-danger btn-sm" onClick={requestDeleteContent} disabled={loading || content.status === 'archived'}>
                  <Trash2 size={13}/>Delete
                </button>
              </>
            )}
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
                  <Info icon={Film} label="Country" value={content.country || 'N/A'} />
                  <Info icon={Eye} label="Views" value={statValue(stats.views || stats.total_views || content.views || content.view_count)} />
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
                  <Field label="Country" value={content.country} />
                  <Field label="Director" value={content.director} />
                  <Field label="Free/Paid" value={content.is_free ? 'Free' : `Paid - ₹${content.price_tvod || 0}`} />
                  <Field label="Created" value={content.created_at} />
                  <Field label="Updated" value={content.updated_at} />
                </div>
              </div>
            )}

            {activeTab === 'cast' && (
              <div className="card">
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
                  <div className="card-title">Cast</div>
                  <button className="btn btn-primary btn-sm" onClick={() => setShowCastModal(true)}><Plus size={14}/>Add Cast</button>
                </div>
                {cast.length ? (
                  <div className="list">
                    {cast.map((member, index) => (
                      <div className="list-row" key={member.id || member._id || index}>
                        <div className="avatar">{(member.actor_name || member.name || '?')[0]}</div>
                        <div style={{flex:1}}>
                          <div className="row-title">{member.actor_name || member.name || member.full_name || 'Unnamed cast member'}</div>
                          <div className="row-sub">{member.role_type || member.role || member.character_name || 'Cast'}</div>
                        </div>
                        <button className="btn btn-ghost btn-icon btn-sm" style={{color:'#ef4444'}} onClick={() => handleDeleteCast(member.id || member._id)}>
                          <Trash2 size={13}/>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : <div className="empty"><Users size={32}/><p>No cast added.</p></div>}
              </div>
            )}

            {activeTab === 'episodes' && (
              <div className="card">
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:16}}>
                  <div className="card-title">Episodes</div>
                  <button className="btn btn-primary btn-sm" onClick={openAddEpisodeModal}><Plus size={14}/>Add Episode</button>
                </div>
                {episodes.length ? (
                  <div className="list">
                    {episodes.map((episode, index) => (
                      <div className="list-row" key={episode.id || episode._id || index}>
                        <div className="episode-num">{episode.episode_number || index + 1}</div>
                        <div style={{flex:1}}>
                          <div className="row-title">{episode.title || `Episode ${index + 1}`}</div>
                          <div className="row-sub">{durationLabel(episode.duration_seconds)}</div>
                        </div>
                        <div style={{display:'flex',gap:6}}>
                          <button className="btn btn-ghost btn-icon btn-sm" onClick={() => openEditEpisodeModal(episode)} title="Edit episode">
                            <Edit2 size={13}/>
                          </button>
                          <button className="btn btn-ghost btn-icon btn-sm" style={{color:'#ef4444'}} onClick={() => handleDeleteEpisode(episode.id || episode._id)} title="Delete episode">
                            <Trash2 size={13}/>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : <div className="empty"><Tv size={32}/><p>No episodes added.</p></div>}
              </div>
            )}

            {activeTab === 'assets' && (
              <div className="card">
                <div className="card-title">Song Assets</div>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:16,marginTop:16}}>
                  <div className="info" style={{flexDirection:'column',alignItems:'stretch',gap:12}}>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <Music2 size={20} style={{color:'#ff8080'}}/>
                      <div style={{flex:1}}>
                        <div className="info-label">Audio Files</div>
                        <div className="info-value" style={{fontSize:12,fontWeight:400}}>{content.audio_url_hq ? 'HQ Uploaded' : 'No audio'}</div>
                      </div>
                    </div>
                    <button className="btn btn-secondary btn-sm" onClick={() => { setAssetType('audio'); setShowAssetModal(true); }}><Upload size={13}/>Upload Audio</button>
                  </div>
                  <div className="info" style={{flexDirection:'column',alignItems:'stretch',gap:12}}>
                    <div style={{display:'flex',alignItems:'center',gap:10}}>
                      <FileText size={20} style={{color:'#ff8080'}}/>
                      <div style={{flex:1}}>
                        <div className="info-label">Lyrics</div>
                        <div className="info-value" style={{fontSize:12,fontWeight:400}}>{content.lyrics_url ? 'Uploaded' : 'No lyrics'}</div>
                      </div>
                    </div>
                    <button className="btn btn-secondary btn-sm" onClick={() => { setAssetType('lyrics'); setShowAssetModal(true); }}><Upload size={13}/>Upload Lyrics</button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'images' && (
              <div className="card">
                <div className="card-title">Images</div>
                <div className="image-manage-grid">
                  <ImageAssetPanel
                    label="Poster Image"
                    url={content.poster_url}
                    file={imageFiles.poster}
                    progress={uploadProgress.poster}
                    loading={modalLoading}
                    onFile={file => setImageFiles(p => ({ ...p, poster: file }))}
                    onUpload={() => handleUploadImageAsset('poster')}
                  />
                  <ImageAssetPanel
                    label="Thumbnail Image"
                    url={content.thumbnail_url}
                    file={imageFiles.thumbnail}
                    progress={uploadProgress.thumbnail}
                    loading={modalLoading}
                    onFile={file => setImageFiles(p => ({ ...p, thumbnail: file }))}
                    onUpload={() => handleUploadImageAsset('thumbnail')}
                  />
                </div>
                {imageUploads.length > 0 && (
                  <div className="image-upload-history">
                    <div className="info-label">Stored Image Uploads</div>
                    <div className="list" style={{marginTop:10}}>
                      {imageUploads.map(upload => (
                        <div className="list-row" key={upload.id || upload.public_url}>
                          <div className="upload-thumb">
                            {upload.public_url ? <img src={upload.public_url} alt={upload.original_name || upload.file_name || 'Upload'} /> : <Film size={16}/>}
                          </div>
                          <div style={{flex:1,minWidth:0}}>
                            <div className="row-title">{upload.original_name || upload.file_name || 'Image upload'}</div>
                            <div className="row-sub">{upload.mime_type || 'image'} - {upload.status || 'uploaded'}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {modalError && <div className="api-error" style={{marginTop:16,marginBottom:0}}><AlertCircle size={14}/>{modalError}</div>}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modals */}
      {showEditModal && (
        <div className="modal-bg" onClick={e => e.target === e.currentTarget && setShowEditModal(false)}>
          <div className="modal-box" style={{maxWidth:620}}>
            <div className="modal-hdr"><h3>Edit Metadata</h3><button className="modal-close" onClick={() => setShowEditModal(false)}><X size={15}/></button></div>
            <form onSubmit={handleEditContent}>
              <div style={{display:'flex',flexDirection:'column',gap:14}}>
                <div className="fg"><label className="lbl">Title *</label><input className="inp" value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} required/></div>
                <div className="fg"><label className="lbl">Description</label><textarea className="inp" rows={3} value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})}/></div>
                <div className="form-grid-2">
                  <div className="fg"><label className="lbl">Language</label><input className="inp" value={editForm.language} onChange={e => setEditForm({...editForm, language: e.target.value})}/></div>
                  <div className="fg"><label className="lbl">Genres</label><input className="inp" value={editForm.genre} onChange={e => setEditForm({...editForm, genre: e.target.value})} placeholder="Drama, Action"/></div>
                </div>
                <div className="fg">
                  <label className="lbl">Country</label>
                  <CustomSelect className="inp" value={editForm.country} onChange={value => setEditForm({...editForm, country: value})} options={countries} />
                </div>
                <div className="form-grid-3">
                  <div className="fg"><label className="lbl">Director / Artist</label><input className="inp" value={editForm.director} onChange={e => setEditForm({...editForm, director: e.target.value})}/></div>
                  <div className="fg"><label className="lbl">Release Year</label><input type="number" className="inp" value={editForm.release_year} onChange={e => setEditForm({...editForm, release_year: e.target.value})}/></div>
                  <div className="fg"><label className="lbl">Rating</label><CustomSelect className="inp" value={editForm.rating} onChange={value => setEditForm({...editForm, rating: value})} options={['U','UA','A','S']} /></div>
                </div>
                <div className="fg" style={{maxWidth:220}}>
                  <label className="lbl">Status</label>
                  <CustomSelect className="inp" value={editForm.status} onChange={value => setEditForm({...editForm, status: value})} options={[
                    { value: 'draft', label: 'Draft' },
                    { value: 'processing', label: 'Processing' },
                    { value: 'published', label: 'Published' },
                    { value: 'archived', label: 'Archived' },
                  ]} />
                </div>
                {content?.type !== 'show' && (
                  <div className="form-grid-2">
                    <div className="fg"><label className="lbl">Duration (seconds)</label><input type="number" className="inp" value={editForm.duration_seconds} onChange={e => setEditForm({...editForm, duration_seconds: e.target.value})}/></div>
                    <div className="fg">
                      <label className="lbl">Pricing</label>
                      <div style={{display:'flex',gap:10,marginTop:6}}>
                        <button type="button" className={`toggle-pill ${editForm.is_free ? 'active' : ''}`} onClick={() => setEditForm({...editForm, is_free: true})}>Free</button>
                        <button type="button" className={`toggle-pill ${!editForm.is_free ? 'active' : ''}`} onClick={() => setEditForm({...editForm, is_free: false, price_tvod: Number(editForm.price_tvod) > 0 ? editForm.price_tvod : 49})}>Paid</button>
                      </div>
                    </div>
                  </div>
                )}
                {!editForm.is_free && (
                  <div className="fg" style={{maxWidth:180}}><label className="lbl">Price</label><input type="number" className="inp" value={editForm.price_tvod} onChange={e => setEditForm({...editForm, price_tvod: e.target.value})}/></div>
                )}
                {modalError && <div className="api-error" style={{margin:0}}><AlertCircle size={14}/>{modalError}</div>}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={modalLoading}>{modalLoading ? 'Saving...' : 'Save Changes'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showCastModal && (
        <div className="modal-bg" onClick={e => e.target === e.currentTarget && setShowCastModal(false)}>
          <div className="modal-box" style={{maxWidth:450}}>
            <div className="modal-hdr"><h3>Add Cast Member</h3><button className="modal-close" onClick={() => setShowCastModal(false)}><X size={15}/></button></div>
            <form onSubmit={handleAddCast}>
              <div style={{display:'flex',flexDirection:'column',gap:14}}>
                <div className="fg"><label className="lbl">Actor Name *</label><input className="inp" value={castForm.actor_name} onChange={e => setCastForm({...castForm, actor_name: e.target.value})} required/></div>
                <div className="fg"><label className="lbl">Character Name</label><input className="inp" value={castForm.character_name} onChange={e => setCastForm({...castForm, character_name: e.target.value})}/></div>
                <div className="form-grid-2">
                  <div className="fg">
                    <label className="lbl">Role Type</label>
                    <CustomSelect className="inp" value={castForm.role_type} onChange={value => setCastForm({...castForm, role_type: value})} options={[
                      { value: 'lead_actor', label: 'Lead Actor' },
                      { value: 'lead_actress', label: 'Lead Actress' },
                      { value: 'supporting_actor', label: 'Supporting Actor' },
                      { value: 'supporting_actress', label: 'Supporting Actress' },
                      { value: 'director', label: 'Director' },
                      { value: 'singer', label: 'Singer' },
                    ]} />
                  </div>
                  <div className="fg"><label className="lbl">Billing Order</label><input type="number" className="inp" value={castForm.billing_order} onChange={e => setCastForm({...castForm, billing_order: Number(e.target.value)})}/></div>
                </div>
                {modalError && <div className="api-error" style={{margin:0}}><AlertCircle size={14}/>{modalError}</div>}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowCastModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={modalLoading}>{modalLoading ? 'Saving...' : 'Add Member'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEpisodeModal && (
        <div className="modal-bg" onClick={e => e.target === e.currentTarget && setShowEpisodeModal(false)}>
          <div className="modal-box" style={{maxWidth:500}}>
            <div className="modal-hdr"><h3>{editingEpisodeId ? 'Edit Episode' : 'Add Episode'}</h3><button className="modal-close" onClick={() => setShowEpisodeModal(false)}><X size={15}/></button></div>
            <form onSubmit={handleSaveEpisode}>
              <div style={{display:'flex',flexDirection:'column',gap:14}}>
                <div className="form-grid-2">
                  <div className="fg"><label className="lbl">Season</label><input type="number" className="inp" value={episodeForm.season} onChange={e => setEpisodeForm({...episodeForm, season: Number(e.target.value)})}/></div>
                  <div className="fg"><label className="lbl">Episode #</label><input type="number" className="inp" value={episodeForm.episode_number} onChange={e => setEpisodeForm({...episodeForm, episode_number: Number(e.target.value)})}/></div>
                </div>
                <div className="fg"><label className="lbl">Title *</label><input className="inp" value={episodeForm.title} onChange={e => setEpisodeForm({...episodeForm, title: e.target.value})} required/></div>
                <div className="fg"><label className="lbl">Description</label><textarea className="inp" rows={3} value={episodeForm.description} onChange={e => setEpisodeForm({...episodeForm, description: e.target.value})}/></div>
                <div className="form-grid-2">
                  <div className="fg"><label className="lbl">Duration (sec)</label><input type="number" className="inp" value={episodeForm.duration_seconds} onChange={e => setEpisodeForm({...episodeForm, duration_seconds: Number(e.target.value)})}/></div>
                  <div className="fg">
                    <label className="lbl">Access</label>
                    <div style={{display:'flex',gap:10,marginTop:6}}>
                      <button type="button" className={`toggle-pill ${episodeForm.is_free ? 'active' : ''}`} onClick={() => setEpisodeForm({...episodeForm, is_free: true})}>Free</button>
                      <button type="button" className={`toggle-pill ${!episodeForm.is_free ? 'active' : ''}`} onClick={() => setEpisodeForm({...episodeForm, is_free: false, price_tvod: Number(episodeForm.price_tvod) > 0 ? episodeForm.price_tvod : 49})}>Paid</button>
                    </div>
                  </div>
                </div>
                {!episodeForm.is_free && (
                  <div className="fg" style={{maxWidth:180}}>
                    <label className="lbl">Episode Price</label>
                    <input
                      type="number"
                      min="0"
                      step="1"
                      className="inp"
                      value={episodeForm.price_tvod || 0}
                      onChange={e => setEpisodeForm({...episodeForm, price_tvod: Number(e.target.value)})}
                    />
                  </div>
                )}
                {editingEpisodeId && (
                  <div className="form-grid-2">
                    <div className="fg"><label className="lbl">Status</label><CustomSelect className="inp" value={episodeForm.status} onChange={value => setEpisodeForm({...episodeForm, status: value})} options={['draft','published','archived']} /></div>
                    <div className="fg"><label className="lbl">Aired Date</label><input type="date" className="inp" value={episodeForm.aired_date || ''} onChange={e => setEpisodeForm({...episodeForm, aired_date: e.target.value})}/></div>
                  </div>
                )}
                {!editingEpisodeId && (
                  <div className="form-grid-2">
                    <UploadInput label="Thumbnail" accept="image/*" file={episodeFiles.thumbnail} progress={uploadProgress.thumbnail} onFile={file => setEpisodeFiles(p => ({ ...p, thumbnail: file }))} />
                    <UploadInput label="Episode Video" accept="video/*" file={episodeFiles.video} progress={uploadProgress.video} onFile={file => setEpisodeFiles(p => ({ ...p, video: file }))} />
                  </div>
                )}
                {modalError && <div className="api-error" style={{margin:0}}><AlertCircle size={14}/>{modalError}</div>}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowEpisodeModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={modalLoading}>{modalLoading ? 'Saving...' : editingEpisodeId ? 'Save Episode' : 'Add Episode'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAssetModal && (
        <div className="modal-bg" onClick={e => e.target === e.currentTarget && setShowAssetModal(false)}>
          <div className="modal-box" style={{maxWidth:450}}>
            <div className="modal-hdr"><h3>Upload {assetType === 'audio' ? 'Audio Files' : 'Lyrics'}</h3><button className="modal-close" onClick={() => setShowAssetModal(false)}><X size={15}/></button></div>
            <form onSubmit={handleUploadAssets}>
              <div style={{display:'flex',flexDirection:'column',gap:14}}>
                {assetType === 'audio' ? (
                  <>
                    <div className="fg">
                      <label className="lbl">HQ Audio (Required)</label>
                      <input type="file" className="inp" accept="audio/*" onChange={e => setAssetFiles({...assetFiles, audio_hq: e.target.files[0]})} required/>
                      <ProgressLine value={uploadProgress.audio_hq} />
                    </div>
                    <div className="fg">
                      <label className="lbl">LQ Audio (Optional)</label>
                      <input type="file" className="inp" accept="audio/*" onChange={e => setAssetFiles({...assetFiles, audio_lq: e.target.files[0]})}/>
                      <ProgressLine value={uploadProgress.audio_lq} />
                    </div>
                  </>
                ) : (
                  <div className="fg">
                    <label className="lbl">Lyrics File (.lrc, .txt, .srt)</label>
                    <input type="file" className="inp" accept=".lrc,.txt,.srt,.vtt" onChange={e => setAssetFiles({...assetFiles, lyrics: e.target.files[0]})} required/>
                    <ProgressLine value={uploadProgress.lyrics} />
                  </div>
                )}
                {modalError && <div className="api-error" style={{margin:0}}><AlertCircle size={14}/>{modalError}</div>}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAssetModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={modalLoading}>{modalLoading ? 'Uploading...' : 'Start Upload'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDeleteDialog
        open={!!confirmDelete}
        title={confirmDelete?.title}
        message={confirmDelete?.message}
        confirmLabel={confirmDelete?.confirmLabel}
        loading={confirmLoading}
        onCancel={() => !confirmLoading && setConfirmDelete(null)}
        onConfirm={runConfirmDelete}
      />

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
        .image-manage-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:16px;margin-top:16px}
        .image-panel{background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.06);border-radius:10px;padding:14px;display:flex;flex-direction:column;gap:12px}
        .image-preview{aspect-ratio:16/10;border-radius:10px;background:#101010;border:1px solid rgba(255,255,255,.06);display:flex;align-items:center;justify-content:center;overflow:hidden;color:rgba(255,255,255,.3)}
        .image-preview img{width:100%;height:100%;object-fit:cover}
        .image-upload-history{margin-top:18px}
        .upload-thumb{width:44px;height:44px;border-radius:8px;background:#101010;border:1px solid rgba(255,255,255,.08);display:flex;align-items:center;justify-content:center;overflow:hidden;color:rgba(255,255,255,.3);flex-shrink:0}
        .upload-thumb img{width:100%;height:100%;object-fit:cover}
        .modal-bg{position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,.8);backdrop-filter:blur(4px);display:flex;align-items:center;justify-content:center;z-index:1000;padding:20px}
        .modal-box{background:#141414;border:1px solid rgba(255,255,255,.1);border-radius:20px;width:100%;box-shadow:0 20px 50px rgba(0,0,0,.5);animation:modalIn .3s ease-out;scrollbar-width:none;-ms-overflow-style:none}
        .modal-box::-webkit-scrollbar{display:none;width:0;height:0}
        @keyframes modalIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
        .modal-hdr{padding:18px 20px;border-bottom:1px solid rgba(255,255,255,.06);display:flex;justify-content:space-between;align-items:center}
        .modal-hdr h3{margin:0;font-size:16px;font-weight:700;color:#f5f5f5}
        .modal-close{background:none;border:none;color:rgba(255,255,255,.3);cursor:pointer;padding:4px}
        .modal-box form{padding:20px}
        .modal-footer{padding:16px 20px;border-top:1px solid rgba(255,255,255,.06);display:flex;justify-content:flex-end;gap:12px}
        .toggle-pill{padding:6px 14px;border-radius:15px;background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);color:rgba(255,255,255,.4);font-size:12px;cursor:pointer;transition:all .2s}
        .toggle-pill.active{background:rgba(204,26,26,.15);border-color:rgba(204,26,26,.3);color:#ff8080;font-weight:600}
        .upload-line{margin-top:8px;height:6px;border-radius:999px;background:rgba(255,255,255,.08);overflow:hidden}
        .upload-line-fill{height:100%;background:#4ade80;border-radius:inherit;transition:width .2s ease}
        .upload-percent{font-size:11px;color:rgba(255,255,255,.42);margin-top:5px}
        @media(max-width:900px){.detail-hero{grid-template-columns:1fr}.poster{max-width:240px}.quick-grid,.detail-grid,.image-manage-grid{grid-template-columns:1fr 1fr}}
        @media(max-width:700px){.image-manage-grid{grid-template-columns:1fr}}
        @media(max-width:560px){.quick-grid,.detail-grid{grid-template-columns:1fr}}
      `}</style>
    </div>
  );
}

function ImageAssetPanel({ label, url, file, progress, loading, onFile, onUpload }) {
  return (
    <div className="image-panel">
      <div>
        <div className="info-label">{label}</div>
        <div className="image-preview" style={{marginTop:8}}>
          {url ? <img src={url} alt={label} /> : <Film size={24}/>}
        </div>
      </div>
      <UploadInput label={`New ${label}`} accept="image/jpeg,image/png,image/webp" file={file} progress={progress} onFile={onFile} />
      <button type="button" className="btn btn-secondary btn-sm" disabled={loading || !file} onClick={onUpload}>
        <Upload size={13}/>Reupload {label}
      </button>
    </div>
  );
}

function UploadInput({ label, accept, file, progress, onFile }) {
  return (
    <div className="fg">
      <label className="lbl">{label}</label>
      <input type="file" className="inp" accept={accept} onChange={e => onFile(e.target.files?.[0] || null)} />
      {file && <div className="upload-percent">{file.name}</div>}
      <ProgressLine value={progress} />
    </div>
  );
}

function ProgressLine({ value }) {
  if (typeof value !== 'number') return null;
  return (
    <>
      <div className="upload-line"><div className="upload-line-fill" style={{ width: `${value}%` }} /></div>
      <div className="upload-percent">{value}% uploaded</div>
    </>
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
