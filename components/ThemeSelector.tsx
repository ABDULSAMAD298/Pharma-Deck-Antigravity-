'use client'

import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

export const THEMES = [
  {
    id: "clinical_white",
    name: "Clinical White",
    tag: "Clean & Professional",
    templateId: "d057960b-19c7-4770-bfda-ca5277a1ff6e",
    bg: "#F8FAFC",
    accent: "#10B981",
    textColor: "#0F172A",
  },
  {
    id: "pharma_dark",
    name: "Pharma Dark",
    tag: "Modern Dark",
    templateId: "c24a122c-0add-4e89-be25-4bca4dd4800c",
    bg: "#0F172A",
    accent: "#10B981",
    textColor: "#F1F5F9",
  },
  {
    id: "medical_blue",
    name: "Medical Blue",
    tag: "Hospital Style",
    templateId: "7cb7ba9a-eed6-4d3c-9f41-74c1edf75f3e",
    bg: "#EFF6FF",
    accent: "#1D4ED8",
    textColor: "#1E3A8A",
  },
  {
    id: "lab_green",
    name: "Lab Green",
    tag: "Science & Biology",
    templateId: "130b50c8-4eed-40ca-a796-8af1f7471318",
    bg: "#F0FDF4",
    accent: "#15803D",
    textColor: "#14532D",
  },
  {
    id: "anatomy_red",
    name: "Anatomy Red",
    tag: "Bold Medical",
    templateId: "c5cfd7f3-752f-40e7-900a-beced24e1954",
    bg: "#FFF5F5",
    accent: "#991B1B",
    textColor: "#7F1D1D",
  },
  {
    id: "research_purple",
    name: "Research Purple",
    tag: "Academic",
    templateId: "b69db67f-25dc-46a0-bbe7-ed20ebd8b0fa",
    bg: "#FAF5FF",
    accent: "#6D28D9",
    textColor: "#4C1D95",
  },
  {
    id: "modern_teal",
    name: "Modern Teal",
    tag: "Fresh & Modern",
    templateId: "d49e695f-5f66-48ec-bee3-91b43048caab",
    bg: "#F0FDFA",
    accent: "#0F766E",
    textColor: "#134E4A",
  },
  {
    id: "pharma_gold",
    name: "Pharma Gold",
    tag: "Premium ✨",
    templateId: "c765a1bc-9856-42dd-bb58-4b874b2decdd",
    bg: "#0F172A",
    accent: "#D97706",
    textColor: "#FEF3C7",
  },
  {
    id: "clinical_minimal",
    name: "Clinical Minimal",
    tag: "Ultra Clean",
    templateId: "c11ac0f8-17a7-486f-82c6-c7026b2f4c52",
    bg: "#FFFFFF",
    accent: "#1E293B",
    textColor: "#0F172A",
  },
  {
    id: "ocean_blue",
    name: "Ocean Blue",
    tag: "Deep & Bold",
    templateId: "ae5f68eb-1ecd-4e18-919b-0ecf1e89bf9f",
    bg: "#0C1A2E",
    accent: "#0EA5E9",
    textColor: "#E0F2FE",
  },
]

interface ThemeSelectorProps {
  selectedId: string
  onSelect: (id: string) => void
}

export default function ThemeSelector({ selectedId, onSelect }: ThemeSelectorProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-slate-300">
        🎨 Presentation Theme
      </label>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {THEMES.map((theme) => {
          const isSelected = selectedId === theme.templateId
          
          return (
            <motion.div
              key={theme.id}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect(theme.templateId)}
              className={`relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all duration-200 ${
                isSelected 
                  ? 'border-emerald-400 ring-2 ring-emerald-400 ring-offset-2 ring-offset-slate-900 scale-105 z-10' 
                  : 'border-slate-700 hover:border-slate-500'
              }`}
            >
              {/* Top Preview */}
              <div 
                className="h-20 w-full relative flex items-center justify-center"
                style={{ backgroundColor: theme.bg }}
              >
                {/* Left vertical bar */}
                <div 
                  className="absolute left-0 top-0 bottom-0 w-2"
                  style={{ backgroundColor: theme.accent }}
                />
                {/* Bottom horizontal bar */}
                <div 
                  className="absolute bottom-0 left-0 right-0 h-1.5"
                  style={{ backgroundColor: theme.accent }}
                />
                {/* Centered text */}
                <span 
                  className="font-bold text-sm"
                  style={{ color: theme.textColor }}
                >
                  Aa Bb
                </span>
                
                {/* Checkmark */}
                {isSelected && (
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-2 right-2 w-5 h-5 bg-emerald-400 rounded-full flex items-center justify-center"
                  >
                    <Check className="w-3 h-3 text-white" />
                  </motion.div>
                )}
              </div>
              
              {/* Bottom Label */}
              <div className="bg-slate-800 py-2 px-2">
                <p className="text-white text-[10px] sm:text-xs font-semibold text-center truncate">
                  {theme.name}
                </p>
                <p className="text-slate-400 text-[10px] text-center mt-0.5 truncate">
                  {theme.tag}
                </p>
              </div>
            </motion.div>
          )
        })}
      </div>
      
      {/* Selected Theme Name indicator */}
      {selectedId && (
        <div className="flex items-center gap-2 pt-1 animate-in fade-in slide-in-from-top-1">
          <div 
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: THEMES.find(t => t.templateId === selectedId)?.accent }}
          />
          <p className="text-emerald-400 text-xs font-medium">
            Theme: {THEMES.find(t => t.templateId === selectedId)?.name}
          </p>
        </div>
      )}
    </div>
  )
}
