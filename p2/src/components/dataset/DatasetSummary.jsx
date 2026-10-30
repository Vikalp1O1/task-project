import { FileSpreadsheet, Layers, HardDrive, Hash, Sparkles } from 'lucide-react';
import { formatBytes, formatNumber } from '../../lib/utils';

export function DatasetSummary({ dataset }) {
  return (
    <div className="mb-6 space-y-3">
      <section aria-label="Current dataset" className="dataset-banner">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-white shadow-md shadow-emerald-600/30">
          <FileSpreadsheet size={22} strokeWidth={2.2} />
        </div>
        <div className="min-w-0 flex-1 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <h1 className="truncate text-base font-bold text-slate-900 tracking-tight" title={dataset.name}>
              {dataset.name}
            </h1>
            {dataset.isSample ? (
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 border border-emerald-200/80 shrink-0">
                <Sparkles size={11} className="text-emerald-500" />
                Sample
              </span>
            ) : (
              <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-700 border border-slate-200 shrink-0">
                CSV
              </span>
            )}
          </div>
        </div>
      </section>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200/90 bg-white shadow-2xs">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100">
            <Hash size={16} strokeWidth={2.2} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rows</p>
            <p className="text-sm font-bold text-slate-900 tabular-nums">{formatNumber(dataset.rows.length)}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200/90 bg-white shadow-2xs">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600 border border-sky-100">
            <Layers size={16} strokeWidth={2.2} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Columns</p>
            <p className="text-sm font-bold text-slate-900 tabular-nums">{dataset.columns.length}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-xl border border-slate-200/90 bg-white shadow-2xs">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600 border border-purple-100">
            <HardDrive size={16} strokeWidth={2.2} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Size</p>
            <p className="text-sm font-bold text-slate-900 tabular-nums">{formatBytes(dataset.size)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
