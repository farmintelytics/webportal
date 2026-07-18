// Small shared bits duplicated between Onboarding's farm step and the
// Organizations quick-add-farm form, so the two don't drift independently.

export const SENSOR_OPTIONS = ['sentinel-2', 'sentinel-1', 'landsat-9'];

export const toggleInList = (list, v) => (list.includes(v) ? list.filter(x => x !== v) : [...list, v]);

// size: 'sm' (compact, used in the Organizations quick-add form) | 'md' (default, Onboarding)
export const chipStyle = (active, color = '#16a34a', size = 'md') => ({
  padding: size === 'sm' ? '5px 11px' : '7px 14px',
  borderRadius: '8px', cursor: 'pointer',
  fontSize: size === 'sm' ? '11px' : '13px', fontWeight: 700,
  background: active ? `${color}18` : '#ffffff',
  border: active ? `1px solid ${color}55` : '1px solid #cbd5e1',
  color: active ? color : '#6b7280', transition: 'all 0.15s',
  fontFamily: "'Roboto', sans-serif",
});
