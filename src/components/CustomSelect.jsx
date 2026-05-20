import { useEffect, useRef, useState } from 'react';

const normalizeOptions = options => options.map(option => (
  typeof option === 'string' ? { value: option, label: option } : option
));

export function CustomSelect({ value, options = [], onChange, className = '', disabled = false }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const items = normalizeOptions(options);
  const selected = items.find(item => item.value === value);

  useEffect(() => {
    const close = event => {
      if (ref.current && !ref.current.contains(event.target)) setOpen(false);
    };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  const select = item => {
    if (item.disabled) return;
    onChange?.(item.value);
    setOpen(false);
  };

  const handleTriggerKeyDown = event => {
    if (disabled) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setOpen(v => !v);
    }
    if (event.key === 'Escape') setOpen(false);
  };

  const handleOptionKeyDown = (event, item) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      select(item);
    }
    if (event.key === 'Escape') setOpen(false);
  };

  return (
    <div ref={ref} className={`custom-select ${className} ${open ? 'open' : ''} ${disabled ? 'disabled' : ''}`}>
      <div
        className="custom-select-trigger"
        role="button"
        tabIndex={disabled ? -1 : 0}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-disabled={disabled}
        onClick={() => !disabled && setOpen(v => !v)}
        onKeyDown={handleTriggerKeyDown}
      >
        <span>{selected?.label || 'Select'}</span>
        <div className="custom-select-chevron" aria-hidden="true" />
      </div>
      {open && (
        <div className="custom-select-menu" role="listbox">
          {items.map(item => (
            <div
              key={item.value}
              className={`custom-select-option ${item.value === value ? 'selected' : ''}`}
              role="option"
              tabIndex={item.disabled ? -1 : 0}
              aria-selected={item.value === value}
              aria-disabled={item.disabled}
              onClick={() => select(item)}
              onKeyDown={event => handleOptionKeyDown(event, item)}
            >
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
