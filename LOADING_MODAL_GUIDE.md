# Loading Modal with Progress - Implementation Guide

## What Was Added

A **global loading modal** with percentage progress indicator that appears when data is loading.

### Files Created

1. **`src/components/LoadingModal.jsx`** — The modal UI component
   - Shows spinner animation
   - Displays progress bar (0-100%)
   - Shows loading message
   - Auto-hides when done

2. **`src/hooks/useLoading.js`** — Global loading state management
   - `LoadingProvider` — Wraps app, provides context
   - `useLoading()` — Hook to access loading state anywhere

3. **`src/modules/agro-monitor/LoadingTracker.js`** — Utility for tracking multi-stage loads
   - Simple API to track progress through stages
   - Automatically calculates percentages

## How to Use

### Basic Usage (Any Component)

```javascript
import { useLoading } from '../hooks/useLoading';

function MyComponent() {
  const { startLoading, updateProgress, stopLoading } = useLoading();

  useEffect(() => {
    startLoading('Fetching data...');
    
    // Simulate progress
    updateProgress(25);
    // ... fetch data 1
    
    updateProgress(50);
    // ... fetch data 2
    
    updateProgress(75);
    // ... fetch data 3
    
    stopLoading();
  }, []);

  return <div>My content</div>;
}
```

### With LoadingTracker (Recommended)

```javascript
import { useLoading } from '../hooks/useLoading';
import { createProgressTracker } from '../modules/agro-monitor/LoadingTracker';

function AgroMonitor() {
  const loadingHook = useLoading();
  
  useEffect(() => {
    const progress = createProgressTracker(loadingHook);
    
    // Start with 5 stages of loading
    progress.start('Loading dashboard...', 5);
    
    // Fetch data and advance
    try {
      const stats = await api.fetchDashboardStats();
      progress.nextStage(); // 20%
      
      const trends = await api.fetchDashboardTrends();
      progress.nextStage(); // 40%
      
      const plots = await api.fetchPlotsIntelligence();
      progress.nextStage(); // 60%
      
      const zones = await api.fetchRestorationZones();
      progress.nextStage(); // 80%
      
      const alerts = await api.fetchAlerts();
      progress.nextStage(); // 100%
      
      progress.stop();
    } catch (err) {
      progress.stop();
      console.error(err);
    }
  }, [loadingHook]);
  
  return <div>Dashboard content</div>;
}
```

## Integration with AgroMonitor

The AgroMonitor component at `src/modules/agro-monitor/AgroMonitor.jsx` has several useEffect hooks that fetch data. To integrate loading progress:

1. Import the hook:
   ```javascript
   import { useLoading } from '../../hooks/useLoading';
   import { createProgressTracker } from './LoadingTracker';
   ```

2. Get the loading hook:
   ```javascript
   const loadingHook = useLoading();
   ```

3. Wrap data fetching with progress:
   ```javascript
   useEffect(() => {
     const progress = createProgressTracker(loadingHook);
     progress.start('Loading farm data...', 3);
     
     // Fetch data...
     progress.nextStage();
     // More fetches...
     progress.nextStage();
     
     progress.stop();
   }, [loadingHook]);
   ```

## Styling

The modal has a clean, modern design:
- **Dark overlay** (70% opacity) behind the modal
- **White modal box** with rounded corners
- **Green progress bar** (#16A34A) matching brand colors
- **Smooth animations** for progress and completion
- **Responsive** — works on mobile and desktop

## Customization

### Change the color

In `LoadingModal.jsx`, line with `borderTop: '4px solid #16A34A'`:
```javascript
borderTop: '4px solid #YOUR_COLOR', // Change spinner color
```

And progress bar:
```javascript
background: 'linear-gradient(90deg, #YOUR_COLOR, #YOUR_COLOR_LIGHT)',
```

### Change the message

Pass a custom message to `startLoading()`:
```javascript
progress.start('Loading satellite imagery...');
```

### Manual control

```javascript
const { loading, progress, message, startLoading, updateProgress, stopLoading } = useLoading();

// Start manually
startLoading('Custom message');

// Update at specific percentages
updateProgress(42);

// Stop
stopLoading();
```

## Current State

✅ **Done:**
- LoadingModal component created
- useLoading hook with context
- LoadingProvider wraps app in main.jsx
- PortalLayout integrated with modal
- LoadingTracker utility ready

⏳ **Next Step:** Integrate LoadingTracker into AgroMonitor's useEffect hooks (lines 899+) to show real progress as data loads.

## Testing

1. Open frontend: http://localhost:5173
2. Login as okomu or olam
3. Navigate to any Map panel
4. You should see loading modal with progress (0-100%)
5. Once data loads, modal auto-disappears

## Example Output

```
┌─────────────────────────────────────┐
│  🔄 Loading farm data...            │
│                                     │
│  ████████░░░░░░░░░░░░░░░░░░░░░░░░ │
│  42%                                │
│                                     │
│  Fetching satellite imagery,        │
│  weather data, and analytics...     │
└─────────────────────────────────────┘
```

## Notes

- Modal appears automatically when `useLoading().startLoading()` is called
- Progress updates smoothly with CSS transitions
- Auto-hides after completion (500ms fade)
- Works globally across all components that use `useLoading()`
- No breaking changes to existing code
