import {
  ArrowUpRight,
  BookOpen,
  Database,
  HelpCircle,
  PanelLeftClose,
  PanelLeftOpen,
  Table2,
  Upload,
} from 'lucide-react';
import { lazy, Suspense, useState } from 'react';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';

const HelpDialog = lazy(() => import('./HelpDialog'));

function Brand() {
  return (
    <a href="./" className="flex items-center gap-2.5" aria-label="Column home">
      <span className="brand-mark">
        <span />
        <span />
        <span />
      </span>
      <span className="text-[22px] font-extrabold tracking-tight text-white">
        column<span className="text-emerald-400">.</span>
      </span>
    </a>
  );
}

export function AppShell({ children, onUpload }) {
  const [helpOpen, setHelpOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <div className="min-h-screen bg-canvas text-ink antialiased">
      {mobileOpen && (
        <button
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
        />
      )}
      <aside className={cn('sidebar', mobileOpen && 'sidebar-open')}>
        <div className="flex items-center justify-between px-1">
          <Brand />
          <button
            className="icon-button text-slate-400 hover:text-white lg:hidden"
            aria-label="Close navigation"
            onClick={() => setMobileOpen(false)}
          >
            <PanelLeftClose size={18} />
          </button>
        </div>

        <nav aria-label="Main navigation" className="mt-8 space-y-1.5 flex-1">
          <a
            href="#explorer"
            className="nav-item nav-active"
            onClick={() => setMobileOpen(false)}
            aria-current="page"
          >
            <Table2 size={17} className="shrink-0 text-emerald-400" />
            <span className="flex-1 truncate">Data Explorer</span>
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
          </a>
          <button
            type="button"
            className="nav-item w-full"
            onClick={() => {
              onUpload();
              setMobileOpen(false);
            }}
          >
            <Upload size={17} className="shrink-0 text-slate-400" />
            <span className="flex-1 text-left truncate">Import CSV</span>
          </button>
          <button type="button" className="nav-item w-full" onClick={() => setHelpOpen(true)}>
            <BookOpen size={17} className="shrink-0 text-slate-400" />
            <span className="flex-1 text-left truncate">Guide</span>
            <ArrowUpRight size={13} className="text-slate-500" />
          </button>
        </nav>

        <div className="sidebar-bottom border-t border-slate-800/80 pt-3">
          <button type="button" className="nav-item w-full" onClick={() => setHelpOpen(true)}>
            <HelpCircle size={16} className="text-slate-400" />
            <span className="flex-1 text-left">Help</span>
          </button>
        </div>
      </aside>

      <div className="lg:ml-64">
        <header className="topbar">
          <div className="flex min-w-0 items-center gap-2.5 text-xs">
            <button
              type="button"
              className="icon-button lg:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation"
            >
              <PanelLeftOpen size={18} />
            </button>
            <Database size={16} className="text-emerald-600 shrink-0" />
            <span className="font-semibold text-slate-800 text-sm">Data Explorer</span>
          </div>
          <Button size="sm" variant="primary" onClick={onUpload}>
            <Upload size={14} />
            Upload CSV
          </Button>
        </header>

        <main id="explorer" className="mx-auto max-w-[1600px] px-4 py-6 md:px-7 lg:px-9 lg:py-8">
          {children}
        </main>
      </div>

      <Suspense fallback={null}>
        {helpOpen && <HelpDialog open={helpOpen} onClose={() => setHelpOpen(false)} />}
      </Suspense>
    </div>
  );
}

export default AppShell;
