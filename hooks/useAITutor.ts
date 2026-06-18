'use client'
import { useState, useEffect, useCallback } from 'react'
import type { AIMessage } from '@/types'

export interface ChatMessage {
  id:   number
  role: 'user' | 'ai'
  text: string
  time: string
}

export function useAITutor(lessonId?: number) {
  const [convId,   setConvId]   = useState<number | null>(null)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [typing,   setTyping]   = useState(false)

  const hhmm = () => new Date().toLocaleTimeString('vi', { hour:'2-digit', minute:'2-digit' })

  useEffect(() => {
    fetch('/api/ai-tutor/conversations', {
      method:  'POST',
      headers: { 'Content-Type':'application/json' },
      body:    JSON.stringify({ lesson_id: lessonId, title: lessonId ? `Hỏi đáp bài ${lessonId}` : 'AI Tutor' }),
    })
      .then(r => r.json())
      .then(d => { if (d.data?.id) setConvId(d.data.id) })
      .catch(() => {})
  }, [lessonId])

  const send = useCallback(async (text: string) => {
    if (!text.trim()) return
    setMessages(p => [...p, { id: Date.now(), role:'user', text, time: hhmm() }])
    setTyping(true)

    try {
      if (convId) {
        const r = await fetch('/api/ai-tutor/messages', {
          method:  'POST',
          headers: { 'Content-Type':'application/json' },
          body:    JSON.stringify({ conversation_id: convId, message: text }),
        })
        const d = await r.json()
        setTyping(false)
        setMessages(p => [...p, { id: Date.now()+1, role:'ai', text: d.data?.ai_response || 'Xin lỗi, có lỗi xảy ra.', time: hhmm() }])
      } else {
        await new Promise(r => setTimeout(r, 1000))
        setTyping(false)
        setMessages(p => [...p, { id: Date.now()+1, role:'ai', text: 'Đang kết nối AI Tutor...', time: hhmm() }])
      }
    } catch {
      setTyping(false)
      setMessages(p => [...p, { id: Date.now()+1, role:'ai', text: 'Lỗi kết nối. Vui lòng thử lại.', time: hhmm() }])
    }
  }, [convId])

  return { messages, typing, send, convId }
}