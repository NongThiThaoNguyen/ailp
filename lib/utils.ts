// Shared utility helpers

export function fmtMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} phút`
  const h = Math.floor(minutes / 60)
  const m = minutes % 60
  return m > 0 ? `${h}h ${m}m` : `${h}h`
}

export function fmtNumber(n: number): string {
  return new Intl.NumberFormat('vi-VN').format(n)
}

export function fmtCurrency(amount: number): string {
  if (amount === 0) return 'Miễn phí'
  return new Intl.NumberFormat('vi-VN', { style:'currency', currency:'VND' }).format(amount)
}

export function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1)  return 'Vừa xong'
  if (mins < 60) return `${mins} phút trước`
  const hrs = Math.floor(mins / 60)
  if (hrs  < 24) return `${hrs} giờ trước`
  const days = Math.floor(hrs / 24)
  if (days < 7)  return `${days} ngày trước`
  return new Date(dateStr).toLocaleDateString('vi-VN')
}

export function clsx(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function truncate(str: string, len = 60): string {
  return str.length > len ? str.slice(0, len) + '...' : str
}

export function pctColor(pct: number): string {
  if (pct >= 80) return '#4ECDC4'
  if (pct >= 60) return '#6C63FF'
  if (pct >= 40) return '#FFB347'
  return '#FF5757'
}