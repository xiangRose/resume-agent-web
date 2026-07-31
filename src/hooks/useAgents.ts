import { useState, useEffect, useCallback } from 'react';
import { CustomAgent } from '../types';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'customAgents';

// 预置的求职 Agent（不可删除，不持久化）
const DEFAULT_AGENTS: CustomAgent[] = [
  {
    id: 'preset-overview',
    name: '海投总助',
    description: '统筹海投全流程：岗位筛选→简历匹配→求职信→投递计划',
    systemPrompt: '你是「海投简历」总规划助手。你的目标是帮助求职者高效完成大规模投递。请按以下流程工作：1) 先了解用户的背景、目标岗位方向与简历情况；2) 帮用户筛选高匹配度岗位并排出投递优先级；3) 协调「简历优化」「求职信生成」「岗位匹配」等专项任务；4) 给出可执行的多日投递计划。回复要结构清晰、可操作，避免空话。如需读取用户本地简历或 JD 文件，请明确说明需要的工作目录。',
    icon: 'Sparkles',
    color: '#0052d9',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'preset-resume',
    name: '简历优化师',
    description: '按目标岗位重写 / 润色简历，ATS 友好',
    systemPrompt: '你是资深简历优化师。当用户给出目标岗位（JD）和现有简历时，请：1) 提取 JD 中的核心能力与关键词；2) 将用户经历用「成就 + 数据」的 STAR 句式重写，突出与目标岗位的匹配；3) 产出 ATS（申请人追踪系统）友好的排版与措辞；4) 指出明显短板并给出补强建议。输出可直接复制使用。',
    icon: 'FileText',
    color: '#00a870',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'preset-coverletter',
    name: '求职信生成器',
    description: '生成个性化求职信 / 自荐邮件',
    systemPrompt: '你是求职信写作专家。根据用户提供的目标公司、岗位与简历亮点，生成一封有温度、不套话、强针对性的求职信或自荐邮件。要求：开场点明来意与来源渠道；中段用 1-2 个具体经历证明匹配度；结尾给出明确的行动呼吁（如希望获得面试机会）。语气专业且自然，长度控制在 300-500 字。',
    icon: 'Lightbulb',
    color: '#ed7b2f',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'preset-matching',
    name: '岗位匹配官',
    description: '评估 JD 与简历匹配度，给出差距清单',
    systemPrompt: '你是岗位匹配分析师。给定一份 JD 和一份简历，请输出：1) 综合匹配度评分（0-100）及简要理由；2) 命中项（简历已具备的 JD 要求）；3) 差距清单（缺失或偏弱的能力，按重要性排序）；4) 面试前建议恶补的知识点。结论要客观、可量化，便于用户决定是否投递。',
    icon: 'Globe',
    color: '#a25eb5',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const isPreset = (id: string) => DEFAULT_AGENTS.some(a => a.id === id);

export function useAgents() {
  const [agents, setAgents] = useState<CustomAgent[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        return [...DEFAULT_AGENTS, ...parsed.map((a: any) => ({
          ...a,
          createdAt: new Date(a.createdAt),
          updatedAt: new Date(a.updatedAt),
        }))];
      }
    } catch (e) {
      console.error('Failed to load agents:', e);
    }
    return [...DEFAULT_AGENTS];
  });

  // 保存到 localStorage（排除预置 agent）
  const saveAgents = useCallback((newAgents: CustomAgent[]) => {
    const toSave = newAgents.filter(a => !isPreset(a.id));
    localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  }, []);

  const addAgent = useCallback((agent: Omit<CustomAgent, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAgent: CustomAgent = {
      ...agent,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setAgents(prev => {
      const updated = [...prev, newAgent];
      saveAgents(updated);
      return updated;
    });
    return newAgent;
  }, [saveAgents]);

  const updateAgent = useCallback((id: string, updates: Partial<Omit<CustomAgent, 'id' | 'createdAt'>>) => {
    setAgents(prev => {
      const updated = prev.map(a => 
        a.id === id ? { ...a, ...updates, updatedAt: new Date() } : a
      );
      saveAgents(updated);
      return updated;
    });
  }, [saveAgents]);

  const deleteAgent = useCallback((id: string) => {
    if (isPreset(id)) return; // 不能删除预置 agent
    setAgents(prev => {
      const updated = prev.filter(a => a.id !== id);
      saveAgents(updated);
      return updated;
    });
  }, [saveAgents]);

  const getAgent = useCallback((id: string) => {
    return agents.find(a => a.id === id);
  }, [agents]);

  return {
    agents,
    addAgent,
    updateAgent,
    deleteAgent,
    getAgent,
    defaultAgent: DEFAULT_AGENTS[0],
  };
}
