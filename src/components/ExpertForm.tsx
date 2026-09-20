/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { ContentInputs, ContentType } from '../types';
import { cn } from '../lib/utils';

interface Props {
  onSubmit: (inputs: ContentInputs) => void;
  isLoading: boolean;
  slimVer?: boolean;
}

const CONTENT_TYPES: ContentType[] = ['Post', 'Reels', 'Carrossel', 'Stories', 'WhatsApp', 'Vídeo (Feed/YT - 2min)'];
const SUGGESTED_NICHES = ['Ansiedade', 'Depressão', 'Relacionamentos', 'Luto', 'Autoestima'];
const SUGGESTED_AUDIENCES = ['Leigos adultos', 'Adolescentes', 'Pais', 'Mulheres', 'Casais'];

const HOOK_OPTIONS = [
  { value: 'auto', label: 'Rotação Automática (Aleatório)' },
  { value: 'Pergunta provocativa', label: 'Pergunta Provocativa' },
  { value: 'Quebra de expectativa', label: 'Quebra de Expectativa' },
  { value: 'Cenário/Cena do cotidiano', label: 'Cenário do Cotidiano' },
  { value: 'Estatística ou fato sutil', label: 'Estatística/Fato Sutil' },
];

const ANGLE_OPTIONS = [
  { value: 'auto', label: 'Rotação Automática (Aleatório)' },
  { value: 'Ângulo Educativo', label: 'Ângulo Educativo' },
  { value: 'Ângulo de Identificação (Storytelling)', label: 'Storytelling / Identificação' },
  { value: 'Ângulo Prático/Direto', label: 'Prático / Direto' },
  { value: 'Ângulo de Acolhimento/Validação', label: 'Acolhimento / Validação' },
];

export default function ExpertForm({ onSubmit, isLoading, slimVer }: Props) {
  const [inputs, setInputs] = useState<Partial<ContentInputs>>({
    contentType: 'Post',
    audience: '',
    selectedHook: 'auto',
    selectedAngle: 'auto',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputs.niche && inputs.theme && inputs.contentType) {
      onSubmit(inputs as ContentInputs);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("space-y-6", !slimVer && "bg-white p-8 rounded-3xl shadow-sm border border-stone-100 max-w-2xl mx-auto")}>
      <div className="space-y-5">
        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Nicho</label>
          <div className="flex flex-wrap gap-1 mb-2">
            {SUGGESTED_NICHES.map(n => (
              <button
                key={n}
                type="button"
                onClick={() => setInputs({ ...inputs, niche: n })}
                className={cn(
                  "text-[9px] px-2 py-1 rounded-md border transition-all",
                  inputs.niche === n ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "bg-slate-50 border-slate-200 text-slate-500"
                )}
              >
                {n}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Ex: Luto, Ansiedade..."
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium"
            value={inputs.niche || ''}
            onChange={(e) => setInputs({ ...inputs, niche: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Público-Alvo</label>
          <div className="flex flex-wrap gap-1 mb-2">
            {SUGGESTED_AUDIENCES.map(a => (
              <button
                key={a}
                type="button"
                onClick={() => setInputs({ ...inputs, audience: a })}
                className={cn(
                  "text-[9px] px-2 py-1 rounded-md border transition-all",
                  inputs.audience === a ? "bg-indigo-50 border-indigo-200 text-indigo-700" : "bg-slate-50 border-slate-200 text-slate-500"
                )}
              >
                {a}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Padrão: Adultos leigos no IG"
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
            value={inputs.audience || ''}
            onChange={(e) => setInputs({ ...inputs, audience: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">Tema / Assunto</label>
          <textarea
            rows={slimVer ? 4 : 3}
            placeholder="Do que vamos falar hoje?"
            className="w-full px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all resize-none font-medium"
            value={inputs.theme || ''}
            onChange={(e) => setInputs({ ...inputs, theme: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2.5">Formato</label>
          <div className="flex flex-wrap gap-1.5">
            {CONTENT_TYPES.map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setInputs({ ...inputs, contentType: type })}
                className={cn(
                  "px-3 py-1.5 rounded-full text-[10px] font-bold tracking-tight transition-all border",
                  inputs.contentType === type
                    ? "bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-100"
                    : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                )}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* DIRETRIZ DE ANTIRREPETIÇÃO E VARIABILIDADE CRIATIVA */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <div className="flex items-center gap-1.5 text-indigo-900 font-bold text-[10px] uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
            <span>Alternância & Antirrepetição</span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Estilo de Gancho (Hook)</label>
              <select
                value={inputs.selectedHook || 'auto'}
                onChange={(e) => setInputs({ ...inputs, selectedHook: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium cursor-pointer"
              >
                {HOOK_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Perspectiva de Abordagem</label>
              <select
                value={inputs.selectedAngle || 'auto'}
                onChange={(e) => setInputs({ ...inputs, selectedAngle: e.target.value })}
                className="w-full px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium cursor-pointer"
              >
                {ANGLE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
          <p className="text-[9px] text-slate-400 italic leading-snug">
            Garante abordagens inovadoras e tom variado que protegem a originalidade e evitam padrões mecânicos.
          </p>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || !inputs.niche || !inputs.theme}
        className="w-full bg-indigo-600 text-white py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-100 group mt-4"
      >
        {isLoading ? (
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <Sparkles className="w-4 h-4 text-indigo-300 group-hover:scale-110 transition-transform" />
            GERAR ROTEIRO
          </>
        )}
      </button>
    </form>
  );
}
