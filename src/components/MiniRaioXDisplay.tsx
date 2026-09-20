/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MiniRaioXData } from '../types';
import { motion } from 'motion/react';

interface Props {
  data: MiniRaioXData;
  darkMode?: boolean;
}

export default function MiniRaioXDisplay({ data, darkMode }: Props) {
  const items = [
    { label: 'Emoção Predominante', value: data.emotion },
    { label: 'Dor/Sintoma (Leigo)', value: data.pain },
    { label: 'Desejo Emocional', value: data.desire },
    { label: 'Conflito ou Crença', value: data.conflict },
  ];

  return (
    <div className="space-y-6">
      {items.map((item, index) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 }}
          className="space-y-1"
        >
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold opacity-60 uppercase tracking-widest leading-none">
              {item.label}
            </p>
          </div>
          <p className="text-sm font-medium leading-relaxed italic text-indigo-100">
            {item.value}
          </p>
          {index < items.length - 1 && (
            <div className={`h-px mt-4 ${darkMode ? 'bg-white/10' : 'bg-slate-100'}`}></div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
