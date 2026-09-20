/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import ReactMarkdown from 'react-markdown';
import { Copy, CheckCircle2, ChevronRight, Share2 } from 'lucide-react';
import { GeneratedContent } from '../types';
import { motion } from 'motion/react';
import { useState } from 'react';

interface Props {
  data: GeneratedContent;
}

export default function ContentOutput({ data }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(data.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Editorial Header Suggestions */}
      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
        {data.titles?.map((title, i) => (
          <div key={i} className="flex-shrink-0 px-4 py-3 bg-white border border-slate-200 rounded-xl flex flex-col min-w-[200px] shadow-sm hover:border-indigo-200 transition-colors cursor-default">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1.5 flex items-center gap-2">
              <Share2 className="w-3 h-3 text-indigo-400" /> Título Sugerido
            </span>
            <span className="text-sm font-semibold text-slate-800 line-clamp-1">{title}</span>
          </div>
        ))}
      </div>

      {/* Main Content White Card (The Editor) */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 md:p-8 shadow-sm relative min-h-[400px] flex flex-col">
        <div className="flex justify-end mb-4">
          <button 
            onClick={handleCopy}
            className="w-full sm:w-auto p-2 px-4 rounded-xl bg-slate-50 text-slate-400 hover:bg-indigo-50 hover:text-indigo-600 transition-all flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest border border-slate-100"
          >
            {copied ? 'Copiado!' : <><Copy className="w-4 h-4" /> Exportar Copys</>}
          </button>
        </div>

        <div className="flex-1 max-w-2xl mx-auto w-full">
          <div className="markdown-body">
             <ReactMarkdown>{data.content}</ReactMarkdown>
          </div>

          <div className="mt-12 pt-8 border-t border-slate-100 space-y-8 mb-20">
            <div>
              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3 italic">Opção 1: Reflexão Pessoal</h4>
              <p className="text-sm leading-relaxed text-slate-800 font-medium border-l-4 border-slate-200 pl-4 py-1 italic">
                {data.closings.reflection}
              </p>
            </div>

            <div>
              <h4 className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-3 italic">Opção 2: Convite Ético (Ajuda Psicológica)</h4>
              <p className="text-sm leading-relaxed text-slate-800 font-semibold border-l-4 border-indigo-100 pl-4 py-1 italic">
                {data.closings.psychotherapyInvite}
              </p>
            </div>

            <div>
              <h4 className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mb-3 italic">Opção 3: Convite Ético (Consulta Inicial)</h4>
              <p className="text-sm leading-relaxed text-slate-800 font-semibold border-l-4 border-emerald-100 pl-4 py-1 italic">
                {data.closings.initialConsultationInvite}
              </p>
            </div>
          </div>
        </div>

        {/* Safety Check Badge - Fixed at bottom of card */}
        <div className="mt-auto pt-6">
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 bg-emerald-50 rounded-xl border border-emerald-100 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-100 shrink-0">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <p className="text-[10px] font-black text-emerald-800 tracking-wider">VERIFICAÇÃO ÉTICA CONCLUÍDA</p>
                <p className="text-[9px] md:text-[10px] text-emerald-600 font-medium whitespace-normal">Sem diagnóstico | Linguagem acolhedora | Incentivo ao apoio psicológico</p>
              </div>
            </div>
            <span className="text-[10px] font-black text-emerald-700 bg-emerald-100 px-3 py-1 rounded-lg border border-emerald-200 shrink-0">ÉTICO V1.0</span>
          </div>
        </div>
      </div>


      {/* Footer Controls: Variations */}
      <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
        {data.variations?.map((v, i) => (
          <div key={i} className="flex-shrink-0 px-4 py-3 bg-white border border-slate-200 border-dashed rounded-xl flex flex-col min-w-[240px] shadow-sm hover:bg-slate-50 transition-colors cursor-pointer group">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1.5 flex items-center justify-between">
              VARIAÇÃO / ADAPTAÇÃO
              <ChevronRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </span>
            <span className="text-xs font-medium text-slate-600 italic">"{v}"</span>
          </div>
        ))}
      </div>
    </div>
  );
}
