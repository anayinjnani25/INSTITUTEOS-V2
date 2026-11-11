import React, { useState } from 'react'
import { ShieldCheck, Copy, Check } from 'lucide-react'

interface SqlBlockProps {
  sql: string
  readOnly?: boolean
  className?: string
}

export const SqlBlock: React.FC<SqlBlockProps> = ({ sql, readOnly = true, className = '' }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = () => {
    navigator.clipboard.writeText(sql)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Syntax highlight for SQL keywords
  const highlightSql = (text: string) => {
    const keywords = [
      'SELECT',
      'FROM',
      'JOIN',
      'LEFT JOIN',
      'INNER JOIN',
      'ON',
      'WHERE',
      'AND',
      'OR',
      'GROUP BY',
      'ORDER BY',
      'LIMIT',
      'AS',
      'BETWEEN',
      'IN',
      'DESC',
      'ASC',
      'IS',
      'NOT',
      'NULL',
      'ROUND',
      'AVG',
      'SUM',
      'COUNT',
      'DATE_TRUNC',
    ]

    // Tokenize into keywords, strings, numbers, and plain code
    const tokenRegex = /(\b(?:SELECT|FROM|LEFT\s+JOIN|INNER\s+JOIN|JOIN|ON|WHERE|AND|OR|GROUP\s+BY|ORDER\s+BY|LIMIT|AS|BETWEEN|IN|DESC|ASC|IS|NOT|NULL|ROUND|AVG|SUM|COUNT|DATE_TRUNC)\b|'[^']*'|\b\d+(?:\.\d+)?\b|--[^\n]*)/gi

    const parts = text.split(tokenRegex)

    return parts.map((part, index) => {
      if (!part) return null
      const upper = part.toUpperCase()
      if (keywords.includes(upper)) {
        return (
          <span key={index} className="text-[#C4A7FF] font-medium">
            {part}
          </span>
        )
      }
      if (part.startsWith("'") && part.endsWith("'")) {
        return (
          <span key={index} className="text-[#7EE2B0]">
            {part}
          </span>
        )
      }
      if (/^\d+(?:\.\d+)?$/.test(part)) {
        return (
          <span key={index} className="text-[#FFCB6B]">
            {part}
          </span>
        )
      }
      if (part.startsWith('--')) {
        return (
          <span key={index} className="text-[#6E7684] italic">
            {part}
          </span>
        )
      }
      return <span key={index} className="text-[#E6EDF3]">{part}</span>
    })
  }

  return (
    <div className={`rounded-[18px] border border-white/10 bg-[#141313]/85 backdrop-blur-xl shadow-[0_18px_40px_-20px_rgba(0,0,0,0.7)] font-mono text-xs overflow-hidden ${className}`}>
      <div className="flex items-center justify-between px-3.5 py-2 border-b border-white/[0.07] bg-white/[0.03] text-[#8B93A1] text-xs">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1.5 mr-1" aria-hidden="true">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
            <span className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
          </span>
          {readOnly && (
            <span className="inline-flex items-center gap-1 text-[11px] font-mono text-[#7EE2B0] bg-[#7EE2B0]/10 border border-[#7EE2B0]/25 px-2 py-0.5 rounded-full">
              <ShieldCheck className="w-3 h-3 text-[#7EE2B0]" strokeWidth={1.5} />
              Read-only
            </span>
          )}
          <span className="text-[11px] text-[#8B93A1] font-mono">PostgreSQL</span>
        </div>
        <button
          onClick={handleCopy}
          className="inline-flex items-center gap-1 hover:text-white text-[#8B93A1] p-1 rounded-full transition-colors text-xs"
          title="Copy SQL"
        >
          {copied ? <Check className="w-3 h-3 text-[#7EE2B0]" strokeWidth={1.5} /> : <Copy className="w-3 h-3" strokeWidth={1.5} />}
          <span>{copied ? 'Copied' : 'Copy'}</span>
        </button>
      </div>

      <pre className="p-3 overflow-x-auto text-[#E6EDF3] text-xs leading-relaxed whitespace-pre font-mono">
        <code>{highlightSql(sql.trim())}</code>
      </pre>
    </div>
  )
}
