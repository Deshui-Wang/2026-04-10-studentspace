<template>
  <div class="scholarships-page">
    <!-- 顶部总览卡片 -->
    <div class="summary-card">
      <div class="summary-content">
        <div class="summary-main">
          <div class="summary-label">累计奖学金总额</div>
          <div class="total-amount">
            <span class="currency">¥</span>
            <span class="amount-value">{{ totalAmount.toLocaleString() }}</span>
          </div>
        </div>
        <div class="summary-stats">
          <div class="stat-item">
            <div class="stat-value">{{ scholarshipList.length }}</div>
            <div class="stat-label">获得次数</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">¥{{ maxAmount.toLocaleString() }}</div>
            <div class="stat-label">最高金额</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">{{ latestYear }}</div>
            <div class="stat-label">最近获得</div>
          </div>
        </div>
      </div>
      <div class="summary-decoration">
        <div class="circle circle-1"></div>
        <div class="circle circle-2"></div>
      </div>
    </div>

    <!-- 奖学金列表（模拟支票样式） -->
    <div class="scholarships-grid">
      <div v-for="item in scholarshipList" :key="item.id" class="check-card">
        <!-- 支票顶部信息 -->
        <div class="check-header">
          <div class="check-bank-info">
            <div class="bank-logo">🎓</div>
            <div class="bank-names">
              <div class="bank-name-cn">学生荣誉发展中心</div>
              <div class="bank-name-en">Student Honor Development Center</div>
            </div>
          </div>
          <div class="check-number">
            NO. {{ item.id.toString().padStart(8, '0') }}
          </div>
        </div>

        <!-- 支票主体 -->
        <div class="check-body">
          <div class="check-row date-row">
            <span class="row-label">DATE</span>
            <span class="row-value underline">{{ formatDate(item.awardDate) }}</span>
          </div>

          <div class="check-row payee-row">
            <span class="row-label">PAY TO THE ORDER OF</span>
            <span class="row-value underline payee-name">{{ userName }}</span>
            <div class="amount-box">
              <span class="currency">¥</span>
              <span class="amount-number">{{ item.amount }}</span>
            </div>
          </div>

          <div class="check-row amount-words-row">
            <span class="row-label">AMOUNT</span>
            <span class="row-value underline amount-words">
              {{ amountToChinese(item.amount) }}
            </span>
          </div>

          <div class="check-row memo-row">
            <div class="memo-content">
              <span class="row-label">FOR</span>
              <span class="row-value underline">{{ item.name }}</span>
            </div>
            <div class="signature-content">
              <div class="signature-line"></div>
              <span class="row-label signature-label">AUTHORIZED SIGNATURE</span>
              <div class="official-seal">
                <div class="seal-inner">荣誉之章</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 支票底部装饰 -->
        <div class="check-footer">
          <div class="micr-line">
            ⑈ 00{{ item.id }} ⑈  012345678 ⑆ 987654321 ⑈
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const userName = ref('李启明') // 假设当前用户名

const scholarshipList = ref([
  {
    id: 1,
    name: '国家奖学金',
    type: 'national-gov',
    amount: 8000,
    awardDate: '2025-11-15',
    organization: '教育部'
  },
  {
    id: 2,
    name: '校长奖学金',
    type: 'school',
    amount: 5000,
    awardDate: '2025-12-20',
    organization: '学校'
  },
  {
    id: 3,
    name: '华为奖学金',
    type: 'enterprise-social',
    amount: 3000,
    awardDate: '2025-09-10',
    organization: '华为技术有限公司'
  },
  {
    id: 4,
    name: '励志奖学金',
    type: 'national-gov',
    amount: 5000,
    awardDate: '2024-11-30',
    organization: '教育部'
  }
])

// 计算属性
const totalAmount = computed(() => {
  return scholarshipList.value.reduce((sum, item) => sum + item.amount, 0)
})

const maxAmount = computed(() => {
  return Math.max(...scholarshipList.value.map(item => item.amount))
})

const latestYear = computed(() => {
  if (scholarshipList.value.length === 0) return '-'
  const dates = scholarshipList.value.map(item => new Date(item.awardDate))
  const latest = new Date(Math.max(...dates))
  return `${latest.getFullYear()}年`
})

// 工具函数
const formatDate = (dateStr) => {
  const d = new Date(dateStr)
  return `${d.getFullYear()} / ${String(d.getMonth() + 1).padStart(2, '0')} / ${String(d.getDate()).padStart(2, '0')}`
}

const amountToChinese = (n) => {
  const fraction = ['角', '分']
  const digit = ['零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖']
  const unit = [['元', '万', '亿'], ['', '拾', '佰', '仟']]
  let head = n < 0 ? '欠' : ''
  n = Math.abs(n)
  let s = ''
  for (let i = 0; i < fraction.length; i++) {
    s += (digit[Math.floor(n * 10 * Math.pow(10, i)) % 10] + fraction[i]).replace(/零./, '')
  }
  s = s || '整'
  n = Math.floor(n)
  for (let i = 0; i < unit[0].length && n > 0; i++) {
    let p = ''
    for (let j = 0; j < unit[1].length && n > 0; j++) {
      p = digit[n % 10] + unit[1][j] + p
      n = Math.floor(n / 10)
    }
    s = p.replace(/(零.)*零$/, '').replace(/^$/, '零') + unit[0][i] + s
  }
  return head + s.replace(/(零.)*零元/, '元').replace(/(零.)+/g, '零').replace(/^整$/, '零元整')
}
</script>

<style scoped>
.scholarships-page {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  background-color: #f8fafc;
  min-height: 100vh;
}

/* 总览卡片样式 */
.summary-card {
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  border-radius: 24px;
  padding: 40px;
  color: white;
  position: relative;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(99, 102, 241, 0.2);
}

.summary-content {
  position: relative;
  z-index: 1;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-label {
  font-size: 16px;
  opacity: 0.9;
  margin-bottom: 8px;
}

.total-amount {
  display: flex;
  align-items: baseline;
  gap: 8px;
}

.currency {
  font-size: 24px;
  font-weight: 600;
}

.amount-value {
  font-size: 48px;
  font-weight: 800;
  letter-spacing: -1px;
}

.summary-stats {
  display: flex;
  gap: 48px;
}

.stat-item {
  text-align: right;
}

.stat-value {
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  opacity: 0.8;
}

.summary-decoration .circle {
  position: absolute;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
}

.circle-1 {
  width: 300px;
  height: 300px;
  top: -150px;
  right: -50px;
}

.circle-2 {
  width: 200px;
  height: 200px;
  bottom: -100px;
  left: -50px;
}

/* 支票卡片样式 */
.scholarships-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(600px, 1fr));
  gap: 24px;
}

.check-card {
  background: #fdfdfd;
  background-image: radial-gradient(#e5e7eb 0.5px, transparent 0.5px);
  background-size: 10px 10px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
  position: relative;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.check-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
}

.check-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.check-bank-info {
  display: flex;
  gap: 12px;
  align-items: center;
}

.bank-logo {
  font-size: 32px;
}

.bank-names {
  display: flex;
  flex-direction: column;
}

.bank-name-cn {
  font-size: 18px;
  font-weight: 700;
  color: #1f2937;
  letter-spacing: 1px;
}

.bank-name-en {
  font-size: 10px;
  color: #6b7280;
  text-transform: uppercase;
}

.check-number {
  font-family: 'Courier New', Courier, monospace;
  font-size: 18px;
  color: #ef4444;
  font-weight: 700;
}

.check-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.check-row {
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.row-label {
  font-size: 10px;
  font-weight: 700;
  color: #4b5563;
  white-space: nowrap;
}

.underline {
  border-bottom: 1px solid #374151;
  padding-bottom: 2px;
}

.row-value {
  font-family: "Ma Shan Zheng", "Kaiti", serif;
  font-size: 18px;
  color: #111827;
}

.date-row {
  justify-content: flex-end;
}

.payee-row {
  display: flex;
}

.payee-name {
  flex: 1;
  font-size: 24px;
  padding-left: 20px;
}

.amount-box {
  border: 2px solid #374151;
  padding: 4px 12px;
  display: flex;
  align-items: center;
  gap: 4px;
  background: white;
  min-width: 140px;
  justify-content: center;
}

.amount-number {
  font-size: 24px;
  font-weight: 800;
  font-family: 'Courier New', Courier, monospace;
}

.amount-words-row .amount-words {
  flex: 1;
  font-size: 20px;
  font-style: italic;
}

.memo-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-top: 10px;
}

.memo-content {
  flex: 1;
  display: flex;
  align-items: baseline;
  gap: 12px;
}

.memo-content .row-value {
  flex: 1;
}

.signature-content {
  width: 240px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.signature-line {
  width: 100%;
  border-top: 1px solid #374151;
  margin-bottom: 4px;
}

.signature-label {
  font-size: 8px;
}

.official-seal {
  position: absolute;
  top: -40px;
  right: 20px;
  width: 80px;
  height: 80px;
  border: 2px solid rgba(239, 68, 68, 0.6);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotate(-15deg);
  pointer-events: none;
}

.seal-inner {
  color: rgba(239, 68, 68, 0.6);
  font-size: 14px;
  font-weight: 800;
  text-align: center;
  line-height: 1.2;
}

.check-footer {
  margin-top: 10px;
  border-top: 1px dashed #d1d5db;
  padding-top: 10px;
}

.micr-line {
  font-family: 'Courier New', Courier, monospace;
  font-size: 16px;
  color: #1f2937;
  letter-spacing: 4px;
  text-align: center;
}

@media (max-width: 768px) {
  .scholarships-grid {
    grid-template-columns: 1fr;
  }
  .check-card {
    min-width: unset;
  }
}
</style>
