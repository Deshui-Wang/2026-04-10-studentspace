import appConfig from '../config/app.config'

async function fetchJson(url, options = {}) {
  const resp = await fetch(url, { ...options, headers: { 'Content-Type': 'application/json', ...(options.headers || {}) } })
  if (!resp.ok) throw new Error(`HTTP ${resp.status}`)
  return resp.json()
}

export async function getSemesterMeta() {
  const base = appConfig.apiBase || ''
  try {
    const data = await fetchJson(`${base}${appConfig.endpoints.semesterMeta}`)
    return {
      semesterWeeks: Number(data.semesterWeeks) || appConfig.defaults.semesterWeeks,
      semesterStart: data.semesterStart || appConfig.defaults.semesterStart,
      semesterEnd: data.semesterEnd || appConfig.defaults.semesterEnd
    }
  } catch (e) {
    return {
      semesterWeeks: appConfig.defaults.semesterWeeks,
      semesterStart: appConfig.defaults.semesterStart,
      semesterEnd: appConfig.defaults.semesterEnd
    }
  }
}

export async function getCourseProgress() {
  const base = appConfig.apiBase || ''
  try {
    const data = await fetchJson(`${base}${appConfig.endpoints.courseProgress}`)
    if (Array.isArray(data)) return data.map(x => ({ name: String(x.name || ''), percent: Number(x.percent) || 0 }))
    return appConfig.defaults.courseProgress
  } catch (e) {
    return appConfig.defaults.courseProgress
  }
} 