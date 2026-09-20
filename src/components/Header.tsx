/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export default function Header() {
  return (
    <nav className="bg-white border-b border-slate-200 px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-50">
      <div className="flex items-center gap-2 md:gap-3">
        <div className="w-8 h-8 md:w-10 md:h-10 bg-indigo-600 rounded-lg md:rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 shrink-0">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="md:w-6 md:h-6">
            <path d="M2 12a10 10 0 1 0 20 0 10 10 0 1 0-20 0Z"/><path d="M8 12h8"/><path d="M12 8v8"/>
          </svg>
        </div>
        <span className="font-bold text-sm md:text-xl tracking-tight text-indigo-900 uppercase truncate max-w-[150px] sm:max-w-none">
          DEPRESSÃO 360 - RoseIA
        </span>
      </div>
      <div className="hidden lg:flex gap-6 text-sm font-medium text-slate-500">
        <span className="text-indigo-600 border-b-2 border-indigo-600 pb-1 cursor-pointer">Novo Conteúdo</span>
        <span className="hover:text-slate-800 cursor-pointer transition-colors">Biblioteca</span>
        <span className="hover:text-slate-800 cursor-pointer transition-colors">Diretrizes Éticas</span>
      </div>
      <div className="flex items-center gap-2 bg-slate-100 rounded-full px-3 py-1.5 md:px-4 md:py-2 border border-slate-200 shrink-0">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-[8px] md:text-[10px] font-bold tracking-wider text-slate-600 uppercase">ATIVO</span>
      </div>
    </nav>
  );
}
