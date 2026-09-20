/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Header from './components/Header';
import ExpertForm from './components/ExpertForm';
import MiniRaioXDisplay from './components/MiniRaioXDisplay';
import ContentOutput from './components/ContentOutput';
import { ContentInputs, GeneratedContent } from './types';
import { generateExpertContent } from './services/expertService';
import { RefreshCw, ArrowLeft, Sparkles, Send } from 'lucide-react';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GeneratedContent | null>(null);
  const [lastInputs, setLastInputs] = useState<ContentInputs | null>(null);

  const handleGenerate = async (inputs: ContentInputs) => {
    setLoading(true);
    setError(null);
    setLastInputs(inputs);
    try {
      const data = await generateExpertContent(inputs);
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Ocorreu um erro inesperado.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div className="flex flex-col min-h-screen lg:h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900 lg:overflow-hidden">
      <Header />

      <div className="flex flex-col lg:flex-row flex-1 lg:overflow-hidden">
        {/* Left Sidebar: Inputs & Raio-X */}
        <aside className="w-full lg:w-80 xl:w-96 bg-white border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col lg:overflow-y-auto">
          <div className="p-6 md:p-8 space-y-8 flex-1">
            <div className="space-y-4">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Briefing do Conteúdo</h2>
              <ExpertForm onSubmit={handleGenerate} isLoading={loading} slimVer />
            </div>

            <AnimatePresence>
              {result && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 bg-indigo-900 rounded-2xl p-6 text-white shadow-xl shadow-indigo-200/50"
                >
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] opacity-60 mb-6 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-400" /> Mini-Raio-X Obrigatório
                  </h3>
                  <MiniRaioXDisplay data={result.miniRaioX} darkMode />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </aside>

        {/* Main Content: Output */}
        <main className="flex-1 flex flex-col bg-slate-50/50 min-h-0 lg:overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 md:p-8">
            <div className="max-w-4xl mx-auto h-full flex flex-col">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
                <div>
                  <h1 className="text-2xl font-bold text-slate-800">Draft do Conteúdo</h1>
                  <p className="text-sm text-slate-500">Linguagem humana, acolhedora e baseada em evidências.</p>
                </div>
                {result && (
                  <button 
                    onClick={reset}
                    className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors uppercase tracking-widest"
                  >
                    <ArrowLeft className="w-4 h-4" /> Novo rascunho
                  </button>
                )}
              </div>

              <div className="flex-1 min-h-[400px]">
                <AnimatePresence mode="wait">
                  {loading ? (
                    <motion.div
                      key="loading"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="h-full flex flex-col items-center justify-center py-12 gap-6"
                    >
                      <div className="relative">
                        <div className="w-16 h-16 border-4 border-indigo-100 border-t-indigo-600 rounded-full animate-spin" />
                        <Sparkles className="absolute inset-0 m-auto w-6 h-6 text-indigo-300 animate-pulse" />
                      </div>
                      <div className="text-center">
                        <p className="font-serif text-xl text-slate-600 italic">Estruturando narrativa ética...</p>
                        <p className="text-slate-400 text-xs mt-2 uppercase tracking-widest">Aguarde enquanto traduzimos os conceitos</p>
                      </div>
                    </motion.div>
                  ) : result ? (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                    >
                      <ContentOutput data={result} />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="h-full flex flex-col items-center justify-center border-4 border-dashed border-slate-200 rounded-3xl p-8 md:p-12 text-center"
                    >
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300">
                        <Send className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-400">Pronto para começar?</h3>
                      <p className="text-slate-400 max-w-xs mx-auto mt-2">
                        Preencha o briefing acima para gerar seu roteiro psicoeducativo.
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 bg-rose-50 border border-rose-200 p-6 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm"
                >
                  <div className="space-y-1">
                    <p className="text-rose-800 text-sm font-semibold">Atenção ao gerar conteúdo</p>
                    <p className="text-rose-600 text-xs leading-relaxed">{error}</p>
                  </div>
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    {lastInputs && (
                      <button 
                        onClick={() => handleGenerate(lastInputs)} 
                        disabled={loading}
                        className="flex-1 sm:flex-none text-xs font-bold uppercase text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg transition-colors cursor-pointer"
                      >
                        Tentar Novamente
                      </button>
                    )}
                    <button 
                      onClick={reset} 
                      className="flex-1 sm:flex-none text-xs font-bold uppercase text-rose-700 bg-rose-100 hover:bg-rose-200 px-4 py-2 rounded-lg transition-colors cursor-pointer"
                    >
                      Fechar
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>

          <footer className="px-6 md:px-8 py-6 bg-white border-t border-slate-200 flex flex-col md:flex-row justify-between items-center text-[10px] font-bold text-slate-400 uppercase tracking-widest gap-4">
            <div className="flex flex-col items-center md:items-start gap-1">
              <span>DEPRESSÃO 360 - RoseIA</span>
              <span className="text-[9px] opacity-70">Psicóloga Rosiléia Lopes - CRP 05/94842</span>
            </div>
            <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
              <span>Instagram @rosileialopes.psi</span>
              <span>WhatsApp 2196762-3128</span>
              <span>rosileialopes.com.br</span>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
