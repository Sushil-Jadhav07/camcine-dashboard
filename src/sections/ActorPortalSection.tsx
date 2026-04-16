import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  BadgeCheck, Camera, CheckCircle, ChevronLeft, ChevronRight, Clock, Film,
  Link, Loader2, Mail, Music, Phone, Plus, Upload, User, Video, X
} from 'lucide-react';
import type { Section } from '../App';

interface ActorPortalSectionProps {
  onNavigate: (section: Section) => void;
  userId: string;
}

type PortalState = 'wizard' | 'success' | 'dashboard';
type Role = 'Actor' | 'Actress' | 'Director' | 'Music Director' | 'Lyricist' | 'Cinematographer' | 'Producer';
type WorkType = 'Movie' | 'Series' | 'Short' | 'Song';

interface FilmographyEntry {
  id: number;
  title: string;
  year: string;
  role: string;
  type: WorkType;
}

interface WizardData {
  role: Role | '';
  email: string;
  phone: string;
  fullName: string;
  stageName: string;
  dob: string;
  nationality: string;
  languages: string;
  bio: string;
  instagram: string;
  imdb: string;
  website: string;
  headshotName: string;
  headshotPreview: string;
  showreelName: string;
  showreelUrl: string;
  filmography: FilmographyEntry[];
}

const newEntry = (id = Date.now()): FilmographyEntry => ({ id, title: '', year: '', role: '', type: 'Movie' });

const initialData: WizardData = {
  role: '', email: '', phone: '', fullName: '', stageName: '', dob: '',
  nationality: '', languages: '', bio: '', instagram: '', imdb: '', website: '',
  headshotName: '', headshotPreview: '', showreelName: '', showreelUrl: '',
  filmography: [newEntry(1)]
};

const roles = [
  ['Actor', User, 'On-screen performer for films and series.'],
  ['Actress', User, 'Lead, supporting, and character performer.'],
  ['Director', Film, 'Creative lead for film and video projects.'],
  ['Music Director', Music, 'Composer and music production professional.'],
  ['Lyricist', Music, 'Songwriter and lyrical contributor.'],
  ['Cinematographer', Camera, 'Camera and visual storytelling specialist.'],
  ['Producer', Film, 'Production owner, studio, or project producer.'],
] as const;

const updateFields = [
  'Role', 'Full Name', 'Screen/Stage Name', 'Date of Birth', 'Nationality',
  'Languages Spoken', 'Bio', 'Instagram URL', 'IMDb Profile URL',
  'Official Website URL', 'Headshot', 'Showreel'
];

export function ActorPortalSection({ onNavigate, userId }: ActorPortalSectionProps) {
  const [portalState, setPortalState] = useState<PortalState>('wizard');
  const [currentStep, setCurrentStep] = useState(1);
  const [wizardData, setWizardData] = useState<WizardData>(initialData);
  const [isVerified, setIsVerified] = useState({ email: false, phone: false });
  const [emailOtpSent, setEmailOtpSent] = useState(false);
  const [phoneOtpSent, setPhoneOtpSent] = useState(false);
  const [emailOtp, setEmailOtp] = useState('');
  const [phoneOtp, setPhoneOtp] = useState('');
  const [verifying, setVerifying] = useState<'email' | 'phone' | null>(null);
  const [headshotProgress, setHeadshotProgress] = useState(0);
  const [showreelProgress, setShowreelProgress] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [field, setField] = useState(updateFields[0]);
  const [newValue, setNewValue] = useState('');
  const [reason, setReason] = useState('');
  const [updatePending, setUpdatePending] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (emailOtp.length === 6 && !isVerified.email && !verifying) {
      setVerifying('email');
      const timer = setTimeout(() => {
        setIsVerified((v) => ({ ...v, email: true }));
        setVerifying(null);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [emailOtp, isVerified.email, verifying]);

  useEffect(() => {
    if (phoneOtp.length === 6 && !isVerified.phone && !verifying) {
      setVerifying('phone');
      const timer = setTimeout(() => {
        setIsVerified((v) => ({ ...v, phone: true }));
        setVerifying(null);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [phoneOtp, isVerified.phone, verifying]);

  const progress = (currentStep / 8) * 100;
  const displayName = wizardData.stageName || wizardData.fullName || userId || 'Profile';
  const canContinue = useMemo(() => {
    if (currentStep === 1) return Boolean(wizardData.role);
    if (currentStep === 2) return isVerified.email && isVerified.phone;
    if (currentStep === 3) return Boolean(wizardData.fullName.trim());
    return true;
  }, [currentStep, isVerified, wizardData.fullName, wizardData.role]);

  const setData = <K extends keyof WizardData>(key: K, value: WizardData[K]) => {
    setWizardData((data) => ({ ...data, [key]: value }));
  };

  const handleOtp = (raw: string, type: 'email' | 'phone') => {
    const value = raw.replace(/\D/g, '').slice(0, 6);
    type === 'email' ? setEmailOtp(value) : setPhoneOtp(value);
  };

  const upload = (file: File | undefined, target: 'headshot' | 'showreel') => {
    if (!file) return;
    let value = 0;
    if (target === 'headshot') {
      setData('headshotName', file.name);
      setData('headshotPreview', URL.createObjectURL(file));
      setHeadshotProgress(0);
    } else {
      setData('showreelName', file.name);
      setShowreelProgress(0);
    }
    const interval = window.setInterval(() => {
      value += 20;
      target === 'headshot' ? setHeadshotProgress(Math.min(value, 100)) : setShowreelProgress(Math.min(value, 100));
      if (value >= 100) window.clearInterval(interval);
    }, 220);
  };

  const updateEntry = (id: number, key: keyof FilmographyEntry, value: string) => {
    setWizardData((data) => ({
      ...data,
      filmography: data.filmography.map((entry) => entry.id === id ? { ...entry, [key]: value } : entry)
    }));
  };

  const currentValue = () => {
    const values: Record<string, string> = {
      Role: wizardData.role, 'Full Name': wizardData.fullName, 'Screen/Stage Name': wizardData.stageName,
      'Date of Birth': wizardData.dob, Nationality: wizardData.nationality,
      'Languages Spoken': wizardData.languages, Bio: wizardData.bio,
      'Instagram URL': wizardData.instagram, 'IMDb Profile URL': wizardData.imdb,
      'Official Website URL': wizardData.website, Headshot: wizardData.headshotName,
      Showreel: wizardData.showreelName || wizardData.showreelUrl
    };
    return values[field] || 'Not provided';
  };

  const OtpInput = ({ value, type }: { value: string; type: 'email' | 'phone' }) => (
    <div className="otp-row">
      {[0, 1, 2, 3, 4, 5].map((index) => (
        <input
          key={index}
          className="otp-box"
          value={value[index] || ''}
          inputMode="numeric"
          maxLength={1}
          onChange={(event) => {
            const next = value.split('');
            next[index] = event.target.value;
            handleOtp(next.join(''), type);
          }}
        />
      ))}
    </div>
  );

  const UploadZone = ({ target }: { target: 'headshot' | 'showreel' }) => {
    const fileName = target === 'headshot' ? wizardData.headshotName : wizardData.showreelName;
    const value = target === 'headshot' ? headshotProgress : showreelProgress;
    return (
      <label
        className="upload-zone"
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          upload(event.dataTransfer.files[0], target);
        }}
      >
        <input type="file" accept={target === 'headshot' ? 'image/png,image/jpeg' : 'video/*'} onChange={(event) => upload(event.target.files?.[0], target)} />
        <Upload />
        <strong>{target === 'headshot' ? 'Upload portrait headshot' : 'Upload showreel video'}</strong>
        <span>{target === 'headshot' ? 'Portrait orientation, min 800x1000px, JPG or PNG, max 5MB' : 'Upload a video file or paste a YouTube/Vimeo link.'}</span>
        {fileName && <div className="upload-status"><span>{fileName}</span><div className="bar"><div style={{ width: `${value}%` }} /></div></div>}
      </label>
    );
  };

  const step = () => {
    switch (currentStep) {
      case 1:
        return <><StepTitle title="Select your industry role" text="Choose the professional category that best represents your work." /><div className="role-grid">{roles.map(([title, Icon, description]) => <button key={title} className={`role-card ${wizardData.role === title ? 'selected' : ''}`} onClick={() => setData('role', title)}><Icon /><strong>{title}</strong><span>{description}</span></button>)}</div></>;
      case 2:
        return <><StepTitle title="Verify your email and phone" text="Enter any 6-digit code after sending OTP to simulate verification." /><div className="two-grid">
          <div className="sub-card"><h3><Mail /> Email OTP {isVerified.email && <CheckCircle />}</h3><div className="field-row"><input className="wizard-input" value={wizardData.email} onChange={(e) => setData('email', e.target.value)} placeholder="you@example.com" /><button onClick={() => setEmailOtpSent(true)}>Send OTP</button></div>{emailOtpSent && <OtpInput value={emailOtp} type="email" />}{verifying === 'email' && <p className="status"><Loader2 /> Verifying email...</p>}{isVerified.email && <p className="status ok"><CheckCircle /> Email verified</p>}</div>
          <div className="sub-card"><h3><Phone /> Phone OTP {isVerified.phone && <CheckCircle />}</h3><div className="field-row"><input className="wizard-input" value={wizardData.phone} onChange={(e) => setData('phone', e.target.value)} placeholder="+91 98765 43210" /><button onClick={() => setPhoneOtpSent(true)}>Send OTP</button></div>{phoneOtpSent && <OtpInput value={phoneOtp} type="phone" />}{verifying === 'phone' && <p className="status"><Loader2 /> Verifying phone...</p>}{isVerified.phone && <p className="status ok"><CheckCircle /> Phone verified</p>}</div>
        </div></>;
      case 3:
        return <><StepTitle title="Basic profile info" text="This information appears on your verified professional profile." /><div className="form-grid"><Field label="Full Name" value={wizardData.fullName} onChange={(v) => setData('fullName', v)} /><Field label="Screen/Stage Name" value={wizardData.stageName} onChange={(v) => setData('stageName', v)} /><Field label="Date of Birth" type="date" value={wizardData.dob} onChange={(v) => setData('dob', v)} /><Field label="Nationality" value={wizardData.nationality} onChange={(v) => setData('nationality', v)} /><Field label="Languages Spoken" wide value={wizardData.languages} onChange={(v) => setData('languages', v)} placeholder="Hindi, English, Tamil" /></div></>;
      case 4:
        return <><StepTitle title="Bio and social links" text="Add a short professional bio and official public profiles." /><label className="wide label">Bio<textarea className="wizard-textarea" maxLength={500} value={wizardData.bio} onChange={(e) => setData('bio', e.target.value)} /><span>{wizardData.bio.length}/500 characters</span></label><div className="form-grid"><Field icon={<Camera />} label="Instagram URL" value={wizardData.instagram} onChange={(v) => setData('instagram', v)} /><Field icon={<Film />} label="IMDb Profile URL" value={wizardData.imdb} onChange={(v) => setData('imdb', v)} /><Field icon={<Link />} label="Official Website URL" wide value={wizardData.website} onChange={(v) => setData('website', v)} /></div></>;
      case 5:
        return <><StepTitle title="Upload your headshot" text="Portrait orientation, min 800x1000px, JPG or PNG, max 5MB." /><div className="two-grid"><UploadZone target="headshot" /><div className="sub-card center"><div className="crop">{wizardData.headshotPreview ? <img src={wizardData.headshotPreview} alt="Headshot preview" /> : <User />}</div><strong>{wizardData.headshotName || 'No headshot selected'}</strong><span>Circle crop preview</span></div></div></>;
      case 6:
        return <><StepTitle title="Showreel" text="Optional - you can skip this." /><div className="two-grid"><UploadZone target="showreel" /><div className="sub-card center"><Video /><Field label="YouTube/Vimeo link" value={wizardData.showreelUrl} onChange={(v) => setData('showreelUrl', v)} placeholder="https://" /><button className="skip" onClick={() => setCurrentStep(7)}>Skip this step</button></div></div></>;
      case 7:
        return <><StepTitle title="Filmography" text="Add past work, credits, and notable appearances." /><div className="film-list">{wizardData.filmography.map((entry) => <div className="film-row" key={entry.id}><input className="wizard-input" placeholder="Title" value={entry.title} onChange={(e) => updateEntry(entry.id, 'title', e.target.value)} /><input className="wizard-input" placeholder="Year" type="number" value={entry.year} onChange={(e) => updateEntry(entry.id, 'year', e.target.value)} /><input className="wizard-input" placeholder="Role" value={entry.role} onChange={(e) => updateEntry(entry.id, 'role', e.target.value)} /><select className="wizard-input" value={entry.type} onChange={(e) => updateEntry(entry.id, 'type', e.target.value as WorkType)}><option>Movie</option><option>Series</option><option>Short</option><option>Song</option></select><button className="icon-btn" onClick={() => setWizardData((data) => ({ ...data, filmography: data.filmography.length === 1 ? data.filmography : data.filmography.filter((item) => item.id !== entry.id) }))}><X /></button></div>)}</div><button className="ghost-btn" onClick={() => setWizardData((data) => ({ ...data, filmography: [...data.filmography, newEntry()] }))}><Plus /> Add Entry</button></>;
      case 8:
        return <><StepTitle title="Review and submit" text="Check your details before sending the profile for verification." /><div className="review-grid"><Review title="Verification Status" lines={[`Email: ${isVerified.email ? 'Verified' : 'Pending'}`, `Phone: ${isVerified.phone ? 'Verified' : 'Pending'}`]} /><Review title="Profile Info" lines={[displayName, wizardData.role || 'Role not selected', wizardData.nationality || 'Nationality not provided', wizardData.languages || 'Languages not provided']} /><Review title="Bio" wide lines={[wizardData.bio || 'No bio added.']} /><Review title="Social Links" lines={[wizardData.instagram || 'Instagram not provided', wizardData.imdb || 'IMDb not provided', wizardData.website || 'Website not provided']} /><div className="sub-card"><h3>Headshot</h3>{wizardData.headshotPreview ? <img className="review-thumb" src={wizardData.headshotPreview} alt="Headshot" /> : <p>No headshot uploaded.</p>}</div><Review title="Filmography" wide lines={wizardData.filmography.map((e) => `${e.title || 'Untitled'} - ${e.year || 'Year'} - ${e.role || 'Role'} - ${e.type}`)} /></div></>;
      default:
        return null;
    }
  };

  const submit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setPortalState('success');
    }, 2000);
  };

  return (
    <section className="actor-portal-section">
      <div className="actor-bg" style={{ opacity: isVisible ? 1 : 0, transform: isVisible ? 'scale(1)' : 'scale(1.06)' }} />
      <div className="actor-overlay" />
      <div className="actor-content">
        <div className="portal-header"><div><h1>Actor Portal</h1><p>Create and manage your verified film industry profile.</p></div><button className="portal-btn secondary" onClick={() => onNavigate('settings')}>Settings</button></div>
        {portalState === 'wizard' && <div className="portal-panel"><div className="progress-meta"><span>Step {currentStep} of 8</span><strong>{Math.round(progress)}%</strong></div><div className="bar"><div style={{ width: `${progress}%` }} /></div><div className="step-shell" key={currentStep}>{step()}</div><div className="wizard-actions"><button className="portal-btn secondary" onClick={() => setCurrentStep((s) => Math.max(1, s - 1))} disabled={currentStep === 1}><ChevronLeft /> Back</button>{currentStep === 8 ? <button className="portal-btn primary" onClick={submit} disabled={isSubmitting}>{isSubmitting ? <Loader2 /> : <CheckCircle />} Submit for Review</button> : <button className="portal-btn primary" onClick={() => setCurrentStep((s) => Math.min(8, s + 1))} disabled={!canContinue}>Continue <ChevronRight /></button>}</div></div>}
        {portalState === 'success' && <div className="success-state"><div className="success-check"><CheckCircle /></div><h1>Profile Submitted for Review</h1><p>Our team will verify your identity documents and approve your profile within 2-3 business days.</p><span>You'll receive an email notification at {wizardData.email || 'your registered email'}.</span><button className="portal-btn primary" onClick={() => setPortalState('dashboard')}>View Request Status</button></div>}
        {portalState === 'dashboard' && <div className="actor-dashboard"><div className="profile-card"><div className="profile-headshot">{wizardData.headshotPreview ? <img src={wizardData.headshotPreview} alt="Profile headshot" /> : <User />}</div><div><h1>{displayName}</h1><p>{wizardData.role || 'Verified professional'}</p><span className="verified"><BadgeCheck /> Verified</span></div></div><div className="timeline-card"><h3>Status Timeline</h3><div className="timeline">{['Submitted', 'Under Review', 'Approved'].map((item) => <div className="timeline-step" key={item}><CheckCircle /><strong>{item}</strong></div>)}</div><button className="portal-btn primary" onClick={() => setModalOpen(true)}>Request Profile Update</button></div></div>}
      </div>
      {modalOpen && <div className="modal-backdrop"><div className="update-modal"><button className="modal-close" onClick={() => setModalOpen(false)}><X /></button><h2>Request Profile Update</h2>{updatePending ? <div className="pending"><Clock /><h3>Update request pending</h3><p>Your change request has been submitted for review.</p></div> : <><label>Which field do you want to update?<select className="wizard-input" value={field} onChange={(e) => setField(e.target.value)}>{updateFields.map((item) => <option key={item}>{item}</option>)}</select></label><label>Current value<input className="wizard-input" value={currentValue()} readOnly /></label><label>New value<input className="wizard-input" value={newValue} onChange={(e) => setNewValue(e.target.value)} /></label><label>Reason for change<textarea className="wizard-textarea" value={reason} onChange={(e) => setReason(e.target.value)} /></label><button className="portal-btn primary" onClick={() => setUpdatePending(true)}>Submit Request</button></>}</div></div>}
      <style>{`
        .actor-portal-section{position:relative;min-height:100vh;padding:28px 0 56px}.actor-bg{position:fixed;inset:0;background-image:url('/dashboard_bg.jpg');background-size:cover;background-position:center;background-attachment:fixed;transition:opacity .9s ease,transform .9s ease}.actor-overlay{position:fixed;inset:0;background:linear-gradient(to bottom,rgba(22,7,9,.86),rgba(22,7,9,.93) 50%,rgba(22,7,9,.98))}.actor-content{position:relative;z-index:10;max-width:1200px;margin:0 auto;padding:0 24px}.portal-header,.portal-panel,.success-state,.actor-dashboard,.update-modal{background:linear-gradient(180deg,rgba(255,255,255,.08),rgba(255,255,255,.02)),rgba(50,18,23,.58);border:1px solid var(--border);border-radius:28px;backdrop-filter:blur(26px);box-shadow:var(--shadow-soft)}.portal-header{display:flex;align-items:center;justify-content:space-between;gap:18px;padding:26px 30px;margin-bottom:26px}.portal-header h1,.success-state h1,.profile-card h1{color:var(--text-primary);font-size:36px;margin-bottom:8px}.portal-header p,.step-title p,.success-state p,.success-state span,.profile-card p{color:var(--text-secondary);font-size:14px}.portal-panel,.actor-dashboard{padding:26px}.progress-meta{display:flex;justify-content:space-between;color:var(--text-secondary);font-size:13px;margin-bottom:10px}.progress-meta strong{color:var(--text-primary)}.bar{height:8px;overflow:hidden;border-radius:999px;background:rgba(255,255,255,.08)}.bar div{height:100%;border-radius:inherit;background:linear-gradient(135deg,var(--accent-hover),var(--accent));transition:width .3s ease}.step-shell{padding-top:28px;animation:rise .45s ease}.step-title{margin-bottom:24px}.step-title h2{color:var(--text-primary);font-size:28px;margin-bottom:8px}.role-grid,.two-grid,.form-grid,.review-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:16px}.role-card,.sub-card,.profile-card,.timeline-card{background:rgba(255,255,255,.04);border:1px solid var(--border);border-radius:20px;padding:20px;color:var(--text-primary)}.role-card{display:flex;flex-direction:column;align-items:flex-start;gap:10px;text-align:left;cursor:pointer;transition:all .2s ease}.role-card:hover,.role-card.selected{border-color:var(--accent);background:rgba(128,0,32,.16);transform:translateY(-3px)}.role-card svg,.sub-card h3 svg,.label svg{width:22px;height:22px;color:var(--accent)}.role-card span,.sub-card p{color:var(--text-secondary);font-size:13px}.sub-card h3{display:flex;align-items:center;gap:10px;color:var(--text-primary);margin-bottom:16px}.field-row{display:flex;gap:10px}.field-row button,.ghost-btn,.skip{padding:11px 14px;background:rgba(128,0,32,.12);border:1px solid var(--border);border-radius:8px;color:var(--text-primary);font-weight:700;cursor:pointer;white-space:nowrap}.wizard-input,.wizard-textarea{width:100%;background:rgba(255,255,255,.05);border:1px solid var(--border);border-radius:12px;color:var(--text-primary);font-size:14px;outline:none;padding:12px 14px}.wizard-input:focus,.wizard-textarea:focus{border-color:var(--accent);box-shadow:0 0 0 4px rgba(128,0,32,.1)}.wizard-textarea{min-height:130px;resize:vertical}label{display:flex;flex-direction:column;gap:8px;color:var(--text-secondary);font-size:13px;font-weight:600}.wide{grid-column:1/-1}.otp-row{display:flex;gap:8px}.otp-box{width:42px;height:46px;border-radius:8px;border:1px solid var(--border);background:rgba(255,255,255,.05);color:var(--text-primary);font-size:18px;font-weight:800;text-align:center}.status{display:flex;align-items:center;gap:8px;color:var(--text-secondary);font-size:13px;margin-top:14px}.status svg,.portal-btn svg{width:16px;height:16px}.status:not(.ok) svg,.portal-btn:disabled svg{animation:spin .8s linear infinite}.status.ok{color:var(--success)}.upload-zone{min-height:260px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;border:1px dashed rgba(255,255,255,.22);border-radius:22px;background:rgba(255,255,255,.04);cursor:pointer;padding:24px;text-align:center}.upload-zone input{display:none}.upload-zone svg,.sub-card.center>svg{width:34px;height:34px;color:var(--accent)}.upload-status{width:100%;margin-top:12px}.center{text-align:center}.crop{width:180px;height:180px;display:flex;align-items:center;justify-content:center;overflow:hidden;margin:0 auto 18px;border-radius:50%;border:2px solid rgba(128,0,32,.4);background:rgba(128,0,32,.1)}.crop img,.profile-headshot img{width:100%;height:100%;object-fit:cover}.crop svg{width:56px;height:56px;color:var(--accent)}.skip{width:100%;margin-top:16px}.film-list{display:flex;flex-direction:column;gap:12px;margin-bottom:16px}.film-row{display:grid;grid-template-columns:2fr 1fr 1.4fr 1fr auto;gap:10px;align-items:center}.icon-btn,.modal-close{width:42px;height:42px;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.04);border:1px solid var(--border);border-radius:8px;color:var(--text-primary);cursor:pointer}.ghost-btn{display:inline-flex;align-items:center;gap:8px}.review-thumb{width:92px;height:92px;object-fit:cover;border-radius:50%;border:2px solid rgba(128,0,32,.4)}.wizard-actions{display:flex;justify-content:space-between;gap:12px;margin-top:28px;padding-top:22px;border-top:1px solid rgba(255,255,255,.08)}.portal-btn{min-height:44px;display:inline-flex;align-items:center;justify-content:center;gap:8px;padding:11px 16px;border:1px solid var(--border);border-radius:8px;color:var(--text-primary);font-weight:800;cursor:pointer}.portal-btn.primary{background:linear-gradient(135deg,var(--accent-hover),var(--accent));border-color:var(--accent)}.portal-btn.secondary{background:rgba(255,255,255,.04)}.portal-btn:disabled{opacity:.45;cursor:not-allowed}.success-state{min-height:560px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;padding:44px;text-align:center}.success-check{width:94px;height:94px;display:flex;align-items:center;justify-content:center;border-radius:50%;color:#86efac;background:rgba(34,197,94,.14);animation:checkPulse 1.3s ease infinite}.success-check svg{width:52px;height:52px}.actor-dashboard{display:grid;gap:20px}.profile-card{display:flex;align-items:center;gap:22px}.profile-headshot{width:130px;height:130px;display:flex;align-items:center;justify-content:center;overflow:hidden;border-radius:28px;color:var(--accent);background:rgba(128,0,32,.1);border:1px solid rgba(255,255,255,.08)}.verified{display:inline-flex;align-items:center;gap:6px;margin-top:10px;padding:7px 10px;border-radius:999px;color:#86efac;background:rgba(34,197,94,.12);font-size:13px;font-weight:800}.timeline{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin:20px 0}.timeline-step{padding:18px;border-radius:16px;background:rgba(255,255,255,.04);border:1px solid rgba(34,197,94,.3);color:var(--text-primary)}.timeline-step svg{display:block;color:#86efac;margin-bottom:10px}.modal-backdrop{position:fixed;inset:0;z-index:2000;display:flex;align-items:center;justify-content:center;padding:20px;background:rgba(7,2,3,.72);backdrop-filter:blur(8px)}.update-modal{position:relative;width:min(560px,100%);padding:28px}.update-modal h2{color:var(--text-primary);margin-bottom:20px}.update-modal label{margin-bottom:14px}.modal-close{position:absolute;top:18px;right:18px}.pending{text-align:center;color:var(--text-secondary);padding:30px 0}.pending svg{width:42px;height:42px;color:var(--accent);margin-bottom:14px}@keyframes spin{to{transform:rotate(360deg)}}@keyframes rise{from{opacity:0;transform:translateY(22px)}to{opacity:1;transform:translateY(0)}}@keyframes checkPulse{0%,100%{transform:scale(1);box-shadow:0 0 0 0 rgba(34,197,94,.28)}50%{transform:scale(1.04);box-shadow:0 0 0 14px rgba(34,197,94,0)}}@media(max-width:900px){.role-grid,.two-grid,.form-grid,.review-grid,.timeline{grid-template-columns:1fr}.film-row{grid-template-columns:1fr}.icon-btn{width:100%}}@media(max-width:640px){.portal-header,.wizard-actions,.profile-card{align-items:flex-start;flex-direction:column}.portal-header h1,.success-state h1,.profile-card h1{font-size:30px}.field-row,.otp-row{flex-wrap:wrap}}
      `}</style>
    </section>
  );
}

function StepTitle({ title, text }: { title: string; text: string }) {
  return <div className="step-title"><h2>{title}</h2><p>{text}</p></div>;
}

function Field({ label, value, onChange, type = 'text', placeholder = '', wide = false, icon }: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
  wide?: boolean;
  icon?: ReactNode;
}) {
  return <label className={wide ? 'wide label' : 'label'}>{icon}{label}<input className="wizard-input" type={type} placeholder={placeholder} value={value} onChange={(event) => onChange(event.target.value)} /></label>;
}

function Review({ title, lines, wide = false }: { title: string; lines: string[]; wide?: boolean }) {
  return <div className={wide ? 'sub-card wide' : 'sub-card'}><h3>{title}</h3>{lines.map((line, index) => <p key={`${line}-${index}`}>{line}</p>)}</div>;
}
