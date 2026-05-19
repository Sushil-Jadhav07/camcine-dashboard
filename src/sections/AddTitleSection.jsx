import { useState, useEffect } from 'react';
import { Upload, X, Save, ArrowLeft, Calendar, Clock, DollarSign, Check, AlertCircle, Film, Tv, Music } from 'lucide-react';
import { PAGE_STYLES } from '../lib/pageStyles.js';
import { contentService } from '../services/content.js';
import { CustomSelect } from '../components/CustomSelect.jsx';

const genres = ['Action','Comedy','Drama','Horror','Sci-Fi','Thriller','Romance','Documentary','Animation','Music','Sports','News','Crime','Fantasy','Adventure'];
const languages = ['English','Hindi','Tamil','Telugu','Bengali','Marathi','Kannada','Gujarati','Punjabi','Malayalam'];
const ratings = ['U','UA','A','S'];
const countries = ['India','United States','United Kingdom','Canada','Australia','United Arab Emirates','Other'];

// Map our UI type ids to API type values
const typeToApiType = {
  movie: 'movie',
  series: 'show',
  music: 'song',
  film: 'movie',
  show: 'show',
  song: 'song',
};

export function AddTitleSection({ onNavigate, titleType }) {
  const apiType = typeToApiType[titleType] || 'movie';
  const isShow = apiType === 'show';
  const isSong = apiType === 'song';

  const [form, setForm] = useState({
    title: '', description: '', language: 'Hindi',
    country: 'India',
    genre: [], director: '', release_year: new Date().getFullYear(),
    rating: 'U', is_free: true, price_tvod: 0, duration_seconds: '',
  });
  const [posterFile, setPosterFile] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [trailerFile, setTrailerFile] = useState(null);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadPhase, setUploadPhase] = useState('');
  const [uploadProgress, setUploadProgress] = useState({});
  const [error, setError] = useState(null);
  const [done, setDone] = useState(false);
  const [createdId, setCreatedId] = useState(null);

  useEffect(() => { setTimeout(() => setVisible(true), 80); }, []);
  const setF = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const toggleGenre = (g) => {
    setForm(p => ({
      ...p,
      genre: p.genre.includes(g) ? p.genre.filter(x => x !== g) : [...p.genre, g]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); setError(null); setUploadProgress({});
    try {
      const payload = {
        title: form.title.trim(),
        type: apiType,
        description: form.description.trim(),
        language: form.language,
        country: apiType === 'movie' ? form.country : undefined,
        genre: form.genre,
        director: form.director.trim() || undefined,
        release_year: Number(form.release_year),
        rating: form.rating,
        is_free: form.is_free,
        price_tvod: form.is_free ? 0 : Number(form.price_tvod),
        duration_seconds: form.duration_seconds ? Number(form.duration_seconds) : undefined,
      };
      // Remove undefined fields
      Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k]);

      const uploadedMedia = {};

      // 1. Upload selected files first. The content record is created only after uploads complete.
      if (posterFile) {
        setUploadPhase('Uploading poster...');
        const upload = await contentService.uploadImage(
          posterFile,
          null,
          apiType,
          progress => setUploadProgress(p => ({ ...p, poster: progress }))
        );
        if (upload.url) {
          uploadedMedia.poster_url = upload.url;
          uploadedMedia.thumbnail_url = upload.url;
        }
      }

      if (trailerFile) {
        setUploadPhase('Uploading trailer...');
        const upload = await contentService.uploadTrailer(
          trailerFile,
          null,
          apiType,
          progress => setUploadProgress(p => ({ ...p, trailer: progress }))
        );
        if (upload.url) uploadedMedia.trailer_url = upload.url;
      }

      // Upload video if provided. Shows use episode uploads after the series is created.
      if (videoFile && !isShow && !isSong) {
        setUploadPhase('Uploading video...');
        const upload = await contentService.uploadVideo(
          videoFile,
          null,
          apiType,
          progress => setUploadProgress(p => ({ ...p, video: progress }))
        );
        if (upload.url) uploadedMedia.video_url = upload.url;
      }

      // Create content only after all selected uploads are complete.
      setUploadPhase('Creating content...');
      const r = await contentService.createContent({ ...payload, ...uploadedMedia });
      if (!r.success && !r.data) throw new Error('Failed to create content');
      const contentId = r.data?.content?.id || r.data?.content?._id || r.data?.id || r.data?._id;
      if (!contentId) throw new Error('Content was created but the API did not return an ID.');
      setCreatedId(contentId);

      // Publish immediately.
      if (contentId) {
        setUploadPhase('Publishing...');
        await contentService.updateStatus(contentId, 'published');
      }

      setUploadPhase('');
      setDone(true);
      setTimeout(() => { if (onNavigate) onNavigate('content'); }, 2000);
    } catch(err) {
      setError(err.message || 'Something went wrong');
      setUploadPhase('');
    } finally {
      setLoading(false);
    }
  };

  const typeLabel = apiType === 'movie' ? 'Movie' : apiType === 'show' ? 'TV Series' : 'Song';
  const TypeIcon = apiType === 'movie' ? Film : apiType === 'show' ? Tv : Music;

  return (
    <div className={`page ${visible ? 'visible' : ''}`}>
      <div className="page-inner" style={{ maxWidth: 860 }}>
        <div className="ph">
          <div className="ph-left">
            <h1>Add {typeLabel}</h1>
            <p>Fill in the details for your new content</p>
          </div>
          <div className="ph-right">
            <button className="btn btn-secondary btn-sm" onClick={() => onNavigate && onNavigate('add-title-type')}>
              <ArrowLeft size={14}/>Back
            </button>
          </div>
        </div>

        {done ? (
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',padding:'60px 20px',gap:16}}>
            <div style={{width:64,height:64,borderRadius:20,background:'rgba(34,197,94,.12)',border:'1px solid rgba(34,197,94,.22)',color:'#4ade80',display:'flex',alignItems:'center',justifyContent:'center'}}>
              <Check size={28}/>
            </div>
            <div style={{fontSize:20,fontWeight:800,color:'#f5f5f5'}}>{typeLabel} Added!</div>
            <div style={{fontSize:13,color:'rgba(255,255,255,.40)'}}>Redirecting to Content Library...</div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div style={{display:'flex',flexDirection:'column',gap:20}}>

              {/* Basic Info */}
              <div className="card">
                <div style={{marginBottom:16}}><div className="card-title">Basic Information</div></div>
                <div style={{display:'flex',flexDirection:'column',gap:14}}>
                  <div className="fg">
                    <label className="lbl">Title *</label>
                    <input className="inp" value={form.title} onChange={e => setF('title',e.target.value)} placeholder={`Enter ${typeLabel.toLowerCase()} title`} required/>
                  </div>
                  <div className="fg">
                    <label className="lbl">Description</label>
                    <textarea className="inp" rows={3} value={form.description} onChange={e => setF('description',e.target.value)} placeholder="Brief description of the content" style={{resize:'vertical'}}/>
                  </div>
                  <div className="form-grid-3">
                    <div className="fg">
                      <label className="lbl">Language</label>
                      <CustomSelect className="inp" value={form.language} onChange={value => setF('language', value)} options={languages} />
                    </div>
                    {apiType === 'movie' && (
                      <div className="fg">
                        <label className="lbl">Country</label>
                        <CustomSelect className="inp" value={form.country} onChange={value => setF('country', value)} options={countries} />
                      </div>
                    )}
                    <div className="fg">
                      <label className="lbl">Rating</label>
                      <CustomSelect className="inp" value={form.rating} onChange={value => setF('rating', value)} options={ratings} />
                    </div>
                    <div className="fg">
                      <label className="lbl">Release Year</label>
                      <input type="number" className="inp" min="1900" max="2099" value={form.release_year} onChange={e => setF('release_year',e.target.value)}/>
                    </div>
                  </div>
                  {/* Genres */}
                  <div className="fg">
                    <label className="lbl">Genres</label>
                    <div style={{display:'flex',flexWrap:'wrap',gap:8,marginTop:4}}>
                      {genres.map(g => (
                        <button key={g} type="button"
                          className={`genre-chip ${form.genre.includes(g) ? 'selected' : ''}`}
                          onClick={() => toggleGenre(g)}
                        >{g}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Production Details */}
              {!isSong && (
                <div className="card">
                  <div style={{marginBottom:16}}><div className="card-title">Production Details</div></div>
                  <div className="form-grid-2" style={{gap:14}}>
                    <div className="fg">
                      <label className="lbl">Director</label>
                      <input className="inp" value={form.director} onChange={e => setF('director',e.target.value)} placeholder="Director name"/>
                    </div>
                    {!isShow && (
                      <div className="fg">
                        <label className="lbl">Duration (seconds)</label>
                        <div className="inp-wrap">
                          <Clock size={14} className="inp-icon"/>
                          <input type="number" className="inp" value={form.duration_seconds} onChange={e => setF('duration_seconds',e.target.value)} placeholder="e.g. 7200 for 2h"/>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Pricing */}
              <div className="card">
                <div style={{marginBottom:16}}><div className="card-title">Pricing</div></div>
                <div style={{display:'flex',flexDirection:'column',gap:14}}>
                  <div style={{display:'flex',alignItems:'center',gap:12}}>
                    <button type="button"
                      className={`toggle-pill ${form.is_free ? 'active' : ''}`}
                      onClick={() => setF('is_free', true)}
                    >Free</button>
                    <button type="button"
                      className={`toggle-pill ${!form.is_free ? 'active' : ''}`}
                      onClick={() => setForm(prev => ({ ...prev, is_free: false, price_tvod: Number(prev.price_tvod) > 0 ? prev.price_tvod : 49 }))}
                    >Paid (TVOD)</button>
                  </div>
                  {!form.is_free && (
                    <div className="fg" style={{maxWidth:200}}>
                      <label className="lbl">Price (INR)</label>
                      <div className="inp-wrap">
                        <DollarSign size={14} className="inp-icon"/>
                        <input type="number" min="0" step="1" className="inp" value={form.price_tvod}
                          onChange={e => setF('price_tvod',e.target.value)} placeholder="49"/>
                      </div>
                    </div>
                  )}
                  {isSong && (
                    <div style={{padding:'12px 14px',background:'rgba(59,130,246,.07)',border:'1px solid rgba(59,130,246,.15)',borderRadius:10,fontSize:13,color:'rgba(255,255,255,.50)'}}>
                      Audio and lyrics uploads are handled from the Songs section after creating the song.
                    </div>
                  )}
                </div>
              </div>

              {/* Media Uploads */}
              <div className="card">
                <div style={{marginBottom:16}}><div className="card-title">Media Files</div></div>
                <div style={{display:'flex',flexDirection:'column',gap:14}}>
                  <FileUploadField
                    label="Poster Image (JPG/PNG/WEBP)"
                    accept="image/jpeg,image/png,image/webp"
                    file={posterFile}
                    onFile={setPosterFile}
                    progress={uploadProgress.poster}
                  />
                  {!isSong && (
                    <FileUploadField
                      label="Trailer (MP4/MOV/WEBM)"
                      accept="video/mp4,video/quicktime,video/webm"
                      file={trailerFile}
                      onFile={setTrailerFile}
                      progress={uploadProgress.trailer}
                    />
                  )}
                  {!isShow && !isSong && (
                    <FileUploadField
                      label={`Full Video (MP4/MKV/AVI)${isShow ? ' - Add episodes after creation' : ''}`}
                      accept="video/mp4,video/x-matroska,video/x-msvideo,video/quicktime,video/webm"
                      file={videoFile}
                      onFile={setVideoFile}
                      disabled={isShow}
                      progress={uploadProgress.video}
                    />
                  )}
                  {isShow && (
                    <div style={{padding:'12px 14px',background:'rgba(59,130,246,.07)',border:'1px solid rgba(59,130,246,.15)',borderRadius:10,fontSize:13,color:'rgba(255,255,255,.50)'}}>
                      For TV Series, add individual episodes after creating the show from the Content Library.
                    </div>
                  )}
                  {isSong && (
                    <div style={{padding:'12px 14px',background:'rgba(59,130,246,.07)',border:'1px solid rgba(59,130,246,.15)',borderRadius:10,fontSize:13,color:'rgba(255,255,255,.50)'}}>
                      Audio and lyrics uploads are handled from the Songs section after creating the song.
                    </div>
                  )}
                </div>
              </div>

              {error && (
                <div style={{display:'flex',alignItems:'center',gap:10,padding:'13px 15px',background:'rgba(239,68,68,.07)',border:'1px solid rgba(239,68,68,.15)',borderRadius:12,color:'#fca5a5',fontSize:13}}>
                  <AlertCircle size={16}/>{error}
                </div>
              )}

              <div style={{display:'flex',justifyContent:'flex-end',gap:12}}>
                <button type="button" className="btn btn-secondary" onClick={() => onNavigate && onNavigate('content')}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={loading}>
                  {loading ? (
                    <><span className="spin-sm"/>{ uploadPhase || 'Saving...'}</>
                  ) : (
                    <><Save size={15}/>Save & Publish</>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
      </div>

      <style>{`
        ${PAGE_STYLES}
        @keyframes spin{to{transform:rotate(360deg)}}
        .spin-sm{width:14px;height:14px;border-radius:50%;border:2px solid rgba(255,255,255,.20);border-top-color:#fff;animation:spin .65s linear infinite;flex-shrink:0}
        .genre-chip{padding:5px 12px;border-radius:20px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.10);color:rgba(255,255,255,.50);font-size:12px;font-family:inherit;cursor:pointer;transition:all .15s}
        .genre-chip.selected{background:rgba(204,26,26,.15);border-color:rgba(204,26,26,.35);color:#ff8080}
        .toggle-pill{padding:8px 20px;border-radius:20px;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.10);color:rgba(255,255,255,.40);font-size:13px;font-family:inherit;cursor:pointer;transition:all .15s}
        .toggle-pill.active{background:rgba(204,26,26,.18);border-color:rgba(204,26,26,.35);color:#ff8080;font-weight:600}
        .file-upload-zone{border:2px dashed rgba(255,255,255,.12);border-radius:12px;padding:20px;display:flex;align-items:center;gap:14px;cursor:pointer;transition:border-color .15s,background .15s}
        .file-upload-zone:hover{border-color:rgba(204,26,26,.30);background:rgba(204,26,26,.04)}
        .file-upload-zone.has-file{border-color:rgba(34,197,94,.25);background:rgba(34,197,94,.04)}
        .file-upload-zone.disabled{opacity:.4;cursor:not-allowed}
        .upload-progress{margin-top:8px;height:6px;border-radius:999px;background:rgba(255,255,255,.08);overflow:hidden}
        .upload-progress-bar{height:100%;background:#4ade80;border-radius:inherit;transition:width .2s ease}
      `}</style>
    </div>
  );
}

function FileUploadField({ label, accept, file, onFile, disabled, progress }) {
  const inputId = `fu-${Math.random().toString(36).slice(2)}`;
  const isUploading = typeof progress === 'number' && progress < 100;
  const isUploaded = progress === 100;
  return (
    <div className="fg">
      <label className="lbl">{label}</label>
      <label htmlFor={inputId} className={`file-upload-zone ${file ? 'has-file' : ''} ${disabled ? 'disabled' : ''}`}>
        <div style={{width:36,height:36,borderRadius:10,background:'rgba(255,255,255,.06)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
          {file ? <Check size={18} style={{color:'#4ade80'}}/> : <Upload size={18} style={{color:'rgba(255,255,255,.30)'}}/>}
        </div>
        <div style={{flex:1}}>
          {file ? (
            <>
              <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',gap:10}}>
                <div style={{fontSize:13,color:'#4ade80',fontWeight:600,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{file.name}</div>
                {typeof progress === 'number' && (
                  <div style={{fontSize:12,color:isUploaded ? '#4ade80' : 'rgba(255,255,255,.58)',fontWeight:800}}>
                    {progress}%
                  </div>
                )}
              </div>
              {typeof progress === 'number' && (
                <div className="upload-progress">
                  <div className="upload-progress-bar" style={{width:`${progress}%`}} />
                </div>
              )}
              {isUploading && <div style={{fontSize:11,color:'rgba(255,255,255,.38)',marginTop:6}}>Uploading...</div>}
              {isUploaded && <div style={{fontSize:11,color:'#4ade80',marginTop:6}}>Uploaded</div>}
            </>
          ) : (
            <div style={{fontSize:13,color:'rgba(255,255,255,.35)'}}>Click to upload or drag and drop</div>
          )}
        </div>
        {file && (
          <button type="button" onClick={e => { e.preventDefault(); onFile(null); }}
            style={{background:'none',border:'none',color:'rgba(255,255,255,.30)',cursor:'pointer',padding:4}}>
            <X size={14}/>
          </button>
        )}
      </label>
      <input id={inputId} type="file" accept={accept} disabled={disabled}
        style={{display:'none'}} onChange={e => onFile(e.target.files?.[0] || null)}/>
    </div>
  );
}
