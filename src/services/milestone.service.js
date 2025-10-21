import { reactive, computed } from 'vue'

const state = reactive({
  milestones: [
    { id: 1, title: '新手上路', status: 'completed' },
    { id: 2, title: '学有所成', status: 'completed' },
    { id: 3, title: '初入佳境', status: 'in_progress' },
    { id: 4, title: '融会贯通', status: 'pending' },
    { id: 5, title: '登堂入室', status: 'pending' },
    { id: 6, title: '炉火纯青', status: 'pending' }
  ]
})

export const useMilestones = () => {
  const milestones = computed(() => state.milestones)

  const setMilestones = (newMilestones) => {
    state.milestones = newMilestones.map((m, index) => ({
      id: index + 1,
      title: m.title,
      status: m.completed ? 'completed' : 'pending'
    }))

    // Try to set one as in_progress
    const firstPending = state.milestones.findIndex(m => m.status === 'pending')
    if (firstPending > 0) {
        const lastCompleted = state.milestones.map(m => m.status).lastIndexOf('completed')
        if (lastCompleted === firstPending - 1) {
            state.milestones[firstPending].status = 'in_progress'
        }
    } else if (firstPending === 0) {
        state.milestones[firstPending].status = 'in_progress'
    }
  }

  return {
    milestones,
    setMilestones
  }
}
