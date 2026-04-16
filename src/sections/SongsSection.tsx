import { useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { Globe, Heart, Mic2, Music, Play, Upload } from 'lucide-react';
import type { Section } from '../App';

interface SongsSectionProps {
  onNavigate: (section: Section) => void;
}

type SongType = 'Audio Only' | 'Music Video';
type SongStatus = 'Published' | 'Draft';
type Pricing = 'Free (AVOD)' | 'Premium Only' | 'Per-purchase';

interface Song {
  id: number;
  title: string;
  artist: string;
  language: string;
  category: string;
  duration: string;
  plays: string;
  type: SongType;
  status: SongStatus;
  art: string;
}

const languages = ['Hindi', 'Tamil', 'Telugu', 'Bengali', 'Punjabi', 'Kannada', 'Marathi', 'Classical'];
const categories = ['Folk', 'Classical', 'Devotional', 'Contemporary', 'Film Song', 'Indie'];
const states = ['Maharashtra', 'Tamil Nadu', 'Telangana', 'West Bengal', 'Punjab', 'Karnataka', 'Rajasthan', 'Kerala', 'Uttar Pradesh'];
const occasions = ['Diwali', 'Eid', 'Navratri', 'Pongal', 'Holi', 'Onam', 'Christmas', 'General'];
const instruments = ['Sitar', 'Tabla', 'Harmonium', 'Flute', 'Veena', 'Mridangam', 'Guitar', 'Violin'];
const moods = ['Devotional', 'Romantic', 'Energetic', 'Melancholic', 'Folk', 'Festive', 'Classical'];

const songs: Song[] = [
  { id: 1, title: 'Kesariya Dhun', artist: 'Aarav Mehta', language: 'Hindi', category: 'Film Song', duration: '4:23', plays: '82.4K', type: 'Music Video', status: 'Published', art: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=500&h=500&fit=crop' },
  { id: 2, title: 'Kaveri Raagam', artist: 'Nila Subramaniam', language: 'Tamil', category: 'Classical', duration: '6:12', plays: '41.8K', type: 'Audio Only', status: 'Published', art: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=500&h=500&fit=crop' },
  { id: 3, title: 'Dhol Punjab Da', artist: 'Gurpreet Gill', language: 'Punjabi', category: 'Folk', duration: '3:48', plays: '119.2K', type: 'Music Video', status: 'Published', art: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=500&h=500&fit=crop' },
  { id: 4, title: 'Bhakti Deepam', artist: 'Meera Joshi', language: 'Marathi', category: 'Devotional', duration: '5:09', plays: '28.9K', type: 'Audio Only', status: 'Draft', art: 'https://images.unsplash.com/photo-1507838153414-b4b713384a76?w=500&h=500&fit=crop' },
  { id: 5, title: 'Monsoon Indie', artist: 'Rhea Sen', language: 'Bengali', category: 'Indie', duration: '3:55', plays: '33.7K', type: 'Audio Only', status: 'Published', art: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=500&h=500&fit=crop' },
  { id: 6, title: 'Veena Varnam', artist: 'Lakshmi Rao', language: 'Classical', category: 'Classical', duration: '7:31', plays: '21.4K', type: 'Audio Only', status: 'Published', art: 'https://images.unsplash.com/photo-1465821185615-20b3c2fbf41b?w=500&h=500&fit=crop' },
  { id: 7, title: 'Hyderabad Nights', artist: 'Sahil Khan', language: 'Telugu', category: 'Contemporary', duration: '4:01', plays: '64.1K', type: 'Music Video', status: 'Published', art: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&h=500&fit=crop' },
  { id: 8, title: 'Kannada Kanasu', artist: 'Anika Shetty', language: 'Kannada', category: 'Film Song', duration: '4:44', plays: '39.6K', type: 'Music Video', status: 'Draft', art: 'https://images.unsplash.com/photo-1525201548942-d8732f6617a0?w=500&h=500&fit=crop' },
  { id: 9, title: 'Pongal Paattu', artist: 'Karthik Velu', language: 'Tamil', category: 'Folk', duration: '3:37', plays: '45.2K', type: 'Audio Only', status: 'Published', art: 'https://images.unsplash.com/photo-1458560871784-56d23406c091?w=500&h=500&fit=crop' },
  { id: 10, title: 'Holi Rang', artist: 'Tara Kapoor', language: 'Hindi', category: 'Contemporary', duration: '3:29', plays: '76.5K', type: 'Music Video', status: 'Published', art: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=500&h=500&fit=crop' },
  { id: 11, title: 'Baul Path', artist: 'Anirban Das', language: 'Bengali', category: 'Folk', duration: '5:18', plays: '18.4K', type: 'Audio Only', status: 'Draft', art: 'https://images.unsplash.com/photo-1494232410401-ad00d5433cfa?w=500&h=500&fit=crop' },
  { id: 12, title: 'Tabla Sunrise', artist: 'Kabir Malhotra', language: 'Classical', category: 'Classical', duration: '6:46', plays: '22.1K', type: 'Audio Only', status: 'Published', art: 'https://images.unsplash.com/photo-1520523839897-bd0b52f945a0?w=500&h=500&fit=crop' },
  { id: 13, title: 'Lavani Beat', artist: 'Sonia Patil', language: 'Marathi', category: 'Folk', duration: '4:12', plays: '51.3K', type: 'Music Video', status: 'Published', art: 'https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=500&h=500&fit=crop' },
  { id: 14, title: 'Eid Mehfil', artist: 'Zoya Rahman', language: 'Hindi', category: 'Devotional', duration: '5:54', plays: '26.8K', type: 'Audio Only', status: 'Published', art: 'https://images.unsplash.com/photo-1518609878373-06d740f60d8b?w=500&h=500&fit=crop' },
  { id: 15, title: 'Guitar Gully', artist: 'Neil Dsouza', language: 'Hindi', category: 'Indie', duration: '3:21', plays: '14.9K', type: 'Music Video', status: 'Draft', art: 'https://images.unsplash.com/photo-1510915361894-db8b60106cb1?w=500&h=500&fit=crop' },
  { id: 16, title: 'Navratri Garba', artist: 'Devika Shah', language: 'Hindi', category: 'Folk', duration: '4:58', plays: '132.6K', type: 'Music Video', status: 'Published', art: 'https://images.unsplash.com/photo-1504609813442-a8924e83f76e?w=500&h=500&fit=crop' },
  { id: 17, title: 'Flute by the Ghats', artist: 'Ishaan Bhat', language: 'Classical', category: 'Devotional', duration: '6:05', plays: '30.2K', type: 'Audio Only', status: 'Published', art: 'https://images.unsplash.com/photo-1514119412350-e174d90d280e?w=500&h=500&fit=crop' },
  { id: 18, title: 'Mumbai After Dark', artist: 'Maya Rao', language: 'Marathi', category: 'Contemporary', duration: '3:50', plays: '58.8K', type: 'Music Video', status: 'Published', art: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=500&h=500&fit=crop' },
  { id: 19, title: 'Onam Song', artist: 'Arjun Menon', language: 'Tamil', category: 'Folk', duration: '4:30', plays: '17.7K', type: 'Audio Only', status: 'Draft', art: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&h=500&fit=crop' },
  { id: 20, title: 'Sufi Sky', artist: 'Amaan Ali', language: 'Punjabi', category: 'Devotional', duration: '5:40', plays: '69.9K', type: 'Music Video', status: 'Published', art: 'https://images.unsplash.com/photo-1499364615650-ec38552f4f34?w=500&h=500&fit=crop' },
];

const toggleValue = (values: string[], value: string) =>
  values.includes(value) ? values.filter((item) => item !== value) : [...values, value];

export function SongsSection({ onNavigate }: SongsSectionProps) {
  const [activeTab, setActiveTab] = useState<'library' | 'upload'>('library');
  const [query, setQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('All');
  const [languageFilter, setLanguageFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [openMenu, setOpenMenu] = useState<number | null>(null);
  const [songType, setSongType] = useState<SongType>('Audio Only');
  const [selectedOccasions, setSelectedOccasions] = useState<string[]>(['General']);
  const [selectedInstruments, setSelectedInstruments] = useState<string[]>([]);
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [audioProgress, setAudioProgress] = useState(0);
  const [mediaProgress, setMediaProgress] = useState(0);
  const [noVideo, setNoVideo] = useState(false);
  const [lyricsEnabled, setLyricsEnabled] = useState(false);
  const [lyrics, setLyrics] = useState('[00:10.00] First line of the song\n[00:18.00] Second line appears here');
  const [pricing, setPricing] = useState<Pricing>('Free (AVOD)');

  const filteredSongs = useMemo(() => {
    return songs.filter((song) => {
      const matchesSearch = `${song.title} ${song.artist}`.toLowerCase().includes(query.toLowerCase());
      const matchesType = typeFilter === 'All' || song.type === typeFilter;
      const matchesLanguage = languageFilter === 'All' || song.language === languageFilter;
      const matchesCategory = categoryFilter === 'All' || song.category === categoryFilter;
      const matchesStatus = statusFilter === 'All' || song.status === statusFilter;
      return matchesSearch && matchesType && matchesLanguage && matchesCategory && matchesStatus;
    });
  }, [categoryFilter, languageFilter, query, statusFilter, typeFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredSongs.length / 12));
  const pagedSongs = filteredSongs.slice((page - 1) * 12, page * 12);
  const parsedLyrics = lyrics.split('\n').filter(Boolean).map((line) => {
    const match = line.match(/^\[(.*?)\]\s?(.*)$/);
    return match ? { time: match[1], text: match[2] } : { time: '--:--', text: line };
  });

  const simulateUpload = (target: 'audio' | 'media') => {
    let value = 0;
    target === 'audio' ? setAudioProgress(0) : setMediaProgress(0);
    const interval = window.setInterval(() => {
      value += 20;
      target === 'audio' ? setAudioProgress(Math.min(value, 100)) : setMediaProgress(Math.min(value, 100));
      if (value >= 100) window.clearInterval(interval);
    }, 220);
  };

  const chipGroup = (items: string[], selected: string[], onClick: (value: string) => void) => (
    <div className="chip-grid">
      {items.map((item) => (
        <button key={item} type="button" className={`song-chip ${selected.includes(item) ? 'active' : ''}`} onClick={() => onClick(item)}>
          {item}
        </button>
      ))}
    </div>
  );

  return (
    <section className="songs-section">
      <div className="songs-bg" />
      <div className="songs-overlay" />
      <div className="songs-content">
        <div className="songs-header">
          <div>
            <h1>Songs</h1>
            <p>Regional, folk, classical, devotional, and contemporary music.</p>
          </div>
          <div className="songs-tabs">
            <button className={activeTab === 'library' ? 'active' : ''} onClick={() => setActiveTab('library')}>Song Library</button>
            <button className={activeTab === 'upload' ? 'active' : ''} onClick={() => setActiveTab('upload')}>Upload Song</button>
          </div>
        </div>

        {activeTab === 'library' ? (
          <>
            <div className="song-stats">
              {['Total Songs: 284', 'Audio Only: 180', 'Music Videos: 104', 'This Month Added: 18'].map((stat, index) => (
                <div className="song-stat" style={{ animationDelay: `${index * 0.06}s` }} key={stat}><Music /><span>{stat}</span></div>
              ))}
            </div>

            <div className="filter-row">
              <input className="song-input search" placeholder="Search by title or artist" value={query} onChange={(e) => { setQuery(e.target.value); setPage(1); }} />
              <select className="song-input" value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(1); }}><option>All</option><option>Audio Only</option><option>Music Video</option></select>
              <select className="song-input" value={languageFilter} onChange={(e) => { setLanguageFilter(e.target.value); setPage(1); }}><option>All</option>{languages.map((item) => <option key={item}>{item}</option>)}</select>
              <select className="song-input" value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}><option>All</option>{categories.map((item) => <option key={item}>{item}</option>)}</select>
              <select className="song-input" value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}><option>All</option><option>Published</option><option>Draft</option></select>
            </div>

            <div className="song-grid">
              {pagedSongs.map((song, index) => (
                <article className="song-card" style={{ animationDelay: `${index * 0.04}s` }} key={song.id}>
                  <div className="song-art"><img src={song.art} alt="" /><button><Play /></button></div>
                  <div className="song-card-head">
                    <div><h3>{song.title}</h3><p>{song.artist}</p></div>
                    <button className="menu-btn" onClick={() => setOpenMenu(openMenu === song.id ? null : song.id)}>...</button>
                    {openMenu === song.id && <div className="song-menu"><button>Edit</button><button onClick={() => onNavigate('content-detail')}>View Details</button><button>Unpublish</button><button>Delete</button></div>}
                  </div>
                  <div className="badge-row"><span>{song.language}</span><span>{song.category}</span></div>
                  <div className="song-meta"><span>{song.duration}</span><span>{song.plays} plays</span></div>
                  <div className="song-footer">
                    <span className="type-badge">{song.type === 'Audio Only' ? '🎵 Audio' : '🎬 Music Video'}</span>
                    <span className={`status-badge ${song.status.toLowerCase()}`}>{song.status}</span>
                  </div>
                </article>
              ))}
            </div>

            <div className="pagination">
              <button disabled={page === 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</button>
              <span>Page {page} of {totalPages}</span>
              <button disabled={page === totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>Next</button>
            </div>
          </>
        ) : (
          <div className="upload-form">
            <FormSection title="Song Details" icon={<Music />}>
              <div className="form-grid">
                <label>Title<input className="song-input" required /></label>
                <label>Artist Name<div className="artist-row"><input className="song-input" required /><button type="button">Link to Actor Profile</button></div></label>
                <label>Language<select className="song-input">{languages.map((item) => <option key={item}>{item}</option>)}</select></label>
                <label>Category<select className="song-input">{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
              </div>
              <div className="toggle-row">{(['Audio Only', 'Music Video'] as SongType[]).map((item) => <button type="button" className={songType === item ? 'active' : ''} onClick={() => setSongType(item)} key={item}>{item}</button>)}</div>
            </FormSection>

            <FormSection title="Cultural Metadata" icon={<Globe />}>
              <label>Region/State<select className="song-input">{states.map((item) => <option key={item}>{item}</option>)}</select></label>
              <MetaBlock title="Festival/Occasion">{chipGroup(occasions, selectedOccasions, (item) => setSelectedOccasions((values) => toggleValue(values, item)))}</MetaBlock>
              <MetaBlock title="Primary Instruments">{chipGroup(instruments, selectedInstruments, (item) => setSelectedInstruments((values) => toggleValue(values, item)))}</MetaBlock>
              <MetaBlock title="Mood Tags">{chipGroup(moods, selectedMoods, (item) => setSelectedMoods((values) => toggleValue(values, item)))}</MetaBlock>
            </FormSection>

            <FormSection title="Audio Upload" icon={<Upload />}>
              <UploadBox label="Audio file" note="MP3/WAV/FLAC, max 50MB" progress={audioProgress} onUpload={() => simulateUpload('audio')} />
              <p className="quality-note">Premium (320 Kbps) and Free (128 Kbps) versions will be generated automatically</p>
            </FormSection>

            {songType === 'Music Video' && (
              <FormSection title="Music Video" icon={<Play />}>
                <label className="inline-toggle"><input type="checkbox" checked={noVideo} onChange={(e) => setNoVideo(e.target.checked)} /> No video? Upload album art instead</label>
                <UploadBox label={noVideo ? 'Album art image' : 'Music video file'} note={noVideo ? 'Square JPG or PNG artwork' : 'MP4/MOV video file'} progress={mediaProgress} onUpload={() => simulateUpload('media')} />
              </FormSection>
            )}

            <FormSection title="Lyrics" icon={<Mic2 />}>
              <label className="inline-toggle"><input type="checkbox" checked={lyricsEnabled} onChange={(e) => setLyricsEnabled(e.target.checked)} /> Add Lyrics Sync</label>
              {lyricsEnabled && <div className="lyrics-grid"><label>LRC input<textarea className="song-textarea" value={lyrics} onChange={(e) => setLyrics(e.target.value)} /></label><div className="lyrics-preview"><strong>Preview</strong>{parsedLyrics.map((line, index) => <p key={`${line.time}-${index}`}><span>{line.time}</span>{line.text}</p>)}</div></div>}
              {lyricsEnabled && <p className="quality-note">Paste LRC format for karaoke-style sync. Plain text also accepted.</p>}
            </FormSection>

            <FormSection title="Pricing" icon={<Heart />}>
              <div className="pricing-row">{(['Free (AVOD)', 'Premium Only', 'Per-purchase'] as Pricing[]).map((item) => <label className="pricing-option" key={item}><input type="radio" checked={pricing === item} onChange={() => setPricing(item)} /> {item}{item === 'Per-purchase' && pricing === item && <input className="song-input price" placeholder="₹49" />}</label>)}</div>
            </FormSection>

            <div className="form-actions"><button>Save as Draft</button><button className="primary">Publish</button></div>
          </div>
        )}
      </div>

      <style>{`
        .songs-section{position:relative;min-height:100vh;padding:28px 0 56px}.songs-bg{position:fixed;inset:0;background-image:url('/dashboard_bg.jpg');background-size:cover;background-position:center;background-attachment:fixed}.songs-overlay{position:fixed;inset:0;background:linear-gradient(to bottom,rgba(22,7,9,.86),rgba(22,7,9,.93) 50%,rgba(22,7,9,.98))}.songs-content{position:relative;z-index:10;max-width:1400px;margin:0 auto;padding:0 24px}.songs-header,.song-stat,.filter-row,.song-card,.upload-form-section{background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.02)),rgba(50,18,23,.58);border:1px solid var(--border);border-radius:26px;backdrop-filter:blur(24px);box-shadow:var(--shadow-soft)}.songs-header{display:flex;align-items:center;justify-content:space-between;gap:20px;padding:26px 30px;margin-bottom:26px}.songs-header h1{color:var(--text-primary);font-size:36px;margin-bottom:8px}.songs-header p{color:var(--text-secondary);font-size:14px}.songs-tabs{display:flex;gap:8px;padding:6px;border:1px solid var(--border);border-radius:14px;background:rgba(255,255,255,.04)}.songs-tabs button,.toggle-row button,.form-actions button,.pagination button{min-height:38px;padding:8px 13px;border:1px solid transparent;border-radius:8px;background:transparent;color:var(--text-secondary);font-weight:700;cursor:pointer}.songs-tabs button.active,.toggle-row button.active,.form-actions .primary{background:linear-gradient(135deg,var(--accent-hover),var(--accent));border-color:var(--accent);color:#fff}.song-stats{display:grid;grid-template-columns:repeat(4,1fr);gap:16px;margin-bottom:22px}.song-stat{display:flex;align-items:center;gap:12px;padding:18px;animation:rise .4s ease both}.song-stat svg,.section-title svg{color:var(--accent)}.song-stat span{color:var(--text-primary);font-weight:800}.filter-row{display:grid;grid-template-columns:2fr repeat(4,1fr);gap:12px;padding:18px;margin-bottom:24px}.song-input,.song-textarea{width:100%;padding:12px 14px;border-radius:12px;border:1px solid var(--border);background:rgba(255,255,255,.05);color:var(--text-primary);outline:none}.song-textarea{min-height:180px;resize:vertical}.song-input:focus,.song-textarea:focus{border-color:var(--accent);box-shadow:0 0 0 4px rgba(128,0,32,.1)}.song-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:18px}.song-card{position:relative;padding:16px;animation:rise .45s ease both}.song-art{position:relative;aspect-ratio:1/1;overflow:hidden;border-radius:18px;margin-bottom:14px}.song-art img{width:100%;height:100%;object-fit:cover}.song-art button{position:absolute;right:12px;bottom:12px;width:44px;height:44px;border:none;border-radius:50%;background:rgba(128,0,32,.9);color:#fff;display:flex;align-items:center;justify-content:center;cursor:pointer}.song-card-head{display:flex;justify-content:space-between;gap:10px}.song-card h3{color:var(--text-primary);font-size:18px;margin-bottom:4px}.song-card p,.song-meta,.quality-note{color:var(--text-secondary);font-size:13px}.menu-btn{width:34px;height:34px;border:1px solid var(--border);border-radius:8px;background:rgba(255,255,255,.04);color:var(--text-primary);cursor:pointer}.song-menu{position:absolute;right:14px;top:52px;z-index:4;display:grid;min-width:150px;padding:8px;border:1px solid var(--border);border-radius:12px;background:rgba(19,23,30,.98)}.song-menu button{padding:9px;border:none;background:transparent;color:var(--text-secondary);text-align:left;cursor:pointer}.badge-row,.song-footer,.song-meta,.toggle-row,.pricing-row,.form-actions{display:flex;align-items:center;gap:10px;flex-wrap:wrap}.badge-row{margin:14px 0}.badge-row span,.type-badge,.status-badge,.song-chip{padding:6px 9px;border-radius:999px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.05);color:var(--text-secondary);font-size:12px;font-weight:700}.status-badge.published{color:#86efac;background:rgba(34,197,94,.12)}.status-badge.draft{color:#fbbf24;background:rgba(245,158,11,.12)}.song-footer{justify-content:space-between;margin-top:12px}.pagination{display:flex;justify-content:center;align-items:center;gap:14px;margin-top:26px;color:var(--text-secondary)}.pagination button{border-color:var(--border);background:rgba(255,255,255,.04);color:var(--text-primary)}.pagination button:disabled{opacity:.45;cursor:not-allowed}.upload-form{display:grid;gap:22px}.upload-form-section{padding:24px}.section-title{display:flex;align-items:center;gap:10px;margin-bottom:18px}.section-title h2{color:var(--text-primary);font-size:20px}.form-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}label{display:flex;flex-direction:column;gap:8px;color:var(--text-secondary);font-size:13px;font-weight:700}.artist-row{display:flex;gap:10px}.artist-row button,.form-actions button{border:1px solid var(--border);border-radius:8px;background:rgba(128,0,32,.12);color:var(--text-primary);font-weight:800;cursor:pointer;padding:10px 12px;white-space:nowrap}.toggle-row{margin-top:18px}.toggle-row button{border-color:var(--border);background:rgba(255,255,255,.04)}.meta-block{margin-top:16px}.meta-block h3{color:var(--text-primary);font-size:14px;margin-bottom:10px}.chip-grid{display:flex;gap:8px;flex-wrap:wrap}.song-chip{cursor:pointer}.song-chip.active{background:rgba(128,0,32,.18);border-color:rgba(128,0,32,.34);color:var(--text-primary)}.upload-box{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;min-height:190px;border:1px dashed rgba(255,255,255,.22);border-radius:20px;background:rgba(255,255,255,.04);cursor:pointer;text-align:center}.upload-box input{display:none}.upload-box svg{width:34px;height:34px;color:var(--accent)}.progress{width:min(460px,88%);height:8px;border-radius:999px;overflow:hidden;background:rgba(255,255,255,.08)}.progress div{height:100%;border-radius:inherit;background:linear-gradient(135deg,var(--accent-hover),var(--accent));transition:width .25s ease}.inline-toggle{display:flex;flex-direction:row;align-items:center;margin-bottom:16px}.lyrics-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}.lyrics-preview{padding:16px;border:1px solid var(--border);border-radius:16px;background:rgba(255,255,255,.04);color:var(--text-primary)}.lyrics-preview p{display:flex;gap:10px;color:var(--text-secondary);font-size:13px}.lyrics-preview span{color:var(--accent);font-weight:800}.pricing-option{flex-direction:row;align-items:center;padding:14px;border:1px solid var(--border);border-radius:12px;background:rgba(255,255,255,.04)}.price{width:110px}.form-actions{justify-content:flex-end}.form-actions button{min-width:130px}@keyframes rise{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}@media(max-width:1180px){.song-grid{grid-template-columns:repeat(2,1fr)}.song-stats,.filter-row{grid-template-columns:repeat(2,1fr)}}@media(max-width:720px){.songs-header{align-items:flex-start;flex-direction:column}.song-grid,.song-stats,.filter-row,.form-grid,.lyrics-grid{grid-template-columns:1fr}.artist-row{flex-direction:column}}
      `}</style>
    </section>
  );
}

function FormSection({ title, icon, children }: { title: string; icon: ReactNode; children: ReactNode }) {
  return <section className="upload-form-section"><div className="section-title">{icon}<h2>{title}</h2></div>{children}</section>;
}

function MetaBlock({ title, children }: { title: string; children: ReactNode }) {
  return <div className="meta-block"><h3>{title}</h3>{children}</div>;
}

function UploadBox({ label, note, progress, onUpload }: { label: string; note: string; progress: number; onUpload: () => void }) {
  return (
    <label className="upload-box">
      <input type="file" onChange={onUpload} />
      <Upload />
      <strong>{label}</strong>
      <span>{note}</span>
      <div className="progress"><div style={{ width: `${progress}%` }} /></div>
    </label>
  );
}
