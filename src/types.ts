/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface MiniRaioXData {
  emotion: string;
  pain: string;
  desire: string;
  conflict: string;
}

export interface ContentInputs {
  niche: string;
  audience: string;
  theme: string;
  contentType: ContentType;
  objective?: string;
  selectedHook?: string;
  selectedAngle?: string;
}

export type ContentType = 'Reels' | 'Post' | 'Carrossel' | 'Stories' | 'WhatsApp' | 'Vídeo (Feed/YT - 2min)';

export interface GeneratedContent {
  miniRaioX: MiniRaioXData;
  content: string;
  titles?: string[];
  variations?: string[];
  closings: {
    reflection: string;
    psychotherapyInvite: string;
    initialConsultationInvite: string;
  };
}
