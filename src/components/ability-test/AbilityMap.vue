<template>
  <div class="ability-map-container">
    <div class="map-header">
    </div>
    
    <div class="ability-map">
      <svg :width="mapWidth" :height="mapHeight" class="map-svg">
        <defs>
          <!-- 中心节点渐变 -->
          <radialGradient id="centerGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style="stop-color:#ff6b9d;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#e91e63;stop-opacity:1" />
          </radialGradient>
          
          <!-- 一级节点渐变 -->
          <radialGradient id="firstLevelGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style="stop-color:#a8a2ff;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#7c3aed;stop-opacity:1" />
          </radialGradient>
          
          <!-- 二级节点渐变 -->
          <radialGradient id="secondLevelGradient" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style="stop-color:#4facfe;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#00d4ff;stop-opacity:1" />
          </radialGradient>
          
          <!-- 三级节点渐变1 -->
          <radialGradient id="thirdLevelGradient1" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style="stop-color:#5b4c96;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#3b2f5f;stop-opacity:1" />
          </radialGradient>
          
          <!-- 三级节点渐变2 -->
          <radialGradient id="thirdLevelGradient2" cx="50%" cy="50%" r="50%">
            <stop offset="0%" style="stop-color:#ff6b9d;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#e91e63;stop-opacity:1" />
          </radialGradient>
          
          <!-- 连接线渐变 -->
          <linearGradient id="connectionGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#a8a2ff;stop-opacity:0.8" />
            <stop offset="100%" style="stop-color:#7c3aed;stop-opacity:0.6" />
          </linearGradient>
          
          <linearGradient id="connectionGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#4facfe;stop-opacity:0.8" />
            <stop offset="100%" style="stop-color:#00d4ff;stop-opacity:0.6" />
          </linearGradient>
          
          <linearGradient id="connectionGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#8374bf;stop-opacity:0.8" />
            <stop offset="100%" style="stop-color:#5b4c96;stop-opacity:0.6" />
          </linearGradient>
          
          <linearGradient id="connectionGradient4" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#ff6b9d;stop-opacity:0.8" />
            <stop offset="100%" style="stop-color:#e91e63;stop-opacity:0.6" />
          </linearGradient>
          
          <!-- 阴影滤镜 -->
          <filter id="nodeShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.2)"/>
          </filter>
          
          <filter id="centerShadow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="rgba(0,0,0,0.3)"/>
          </filter>
          
          <!-- 连接线阴影 -->
          <filter id="lineShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="1" stdDeviation="1" flood-color="rgba(0,0,0,0.1)"/>
          </filter>
        </defs>
        <!-- 连接线 -->
        <g class="connections">
          <!-- 中心到一级节点的连接线 -->
          <line
            v-for="(node, index) in firstLevelNodes"
            :key="`center-${index}`"
            :x1="centerX"
            :y1="centerY"
            :x2="node.x"
            :y2="node.y"
            stroke="url(#connectionGradient1)"
            filter="url(#lineShadow)"
            class="connection-line level-1"
          />
          
          <!-- 一级到二级节点的连接线 -->
          <line
            v-for="connection in secondLevelConnections"
            :key="`second-${connection.from}-${connection.to}`"
            :x1="connection.x1"
            :y1="connection.y1"
            :x2="connection.x2"
            :y2="connection.y2"
            stroke="url(#connectionGradient2)"
            filter="url(#lineShadow)"
            class="connection-line level-2"
          />
          
          <!-- 二级到三级节点的连接线 -->
          <line
            v-for="(connection, index) in thirdLevelConnections"
            :key="`third-${connection.from}-${connection.to}`"
            :x1="connection.x1"
            :y1="connection.y1"
            :x2="connection.x2"
            :y2="connection.y2"
            :stroke="connection.to % 2 === 0 ? 'url(#connectionGradient3)' : 'url(#connectionGradient4)'"
            filter="url(#lineShadow)"
            class="connection-line level-3"
          />
        </g>
        
        <!-- 节点 -->
        <g class="nodes">
          <!-- 中心节点 -->
          <circle
            :cx="centerX"
            :cy="centerY"
            :r="centerRadius"
            fill="url(#centerGradient)"
            filter="url(#centerShadow)"
            class="node center-node"
          />
          <text
            :x="centerX"
            :y="centerY"
            class="node-text center-text"
            text-anchor="middle"
            dominant-baseline="middle"
          >
            {{ studentName }}
          </text>
          
          <!-- 一级节点 -->
          <circle
            v-for="(node, index) in firstLevelNodes"
            :key="`first-${index}`"
            :cx="node.x"
            :cy="node.y"
            :r="firstLevelRadius"
            fill="url(#firstLevelGradient)"
            filter="url(#nodeShadow)"
            class="node first-level"
          />
          <text
            v-for="(node, index) in firstLevelNodes"
            :key="`first-text-${index}`"
            :x="node.x"
            :y="node.y"
            class="node-text first-level-text"
            text-anchor="middle"
            dominant-baseline="middle"
          >
            {{ node.name }}
          </text>
          
          <!-- 二级节点 -->
          <circle
            v-for="(node, index) in secondLevelNodes"
            :key="`second-${index}`"
            :cx="node.x"
            :cy="node.y"
            :r="secondLevelRadius"
            fill="url(#secondLevelGradient)"
            filter="url(#nodeShadow)"
            class="node second-level"
          />
          <text
            v-for="(node, index) in secondLevelNodes"
            :key="`second-text-${index}`"
            :x="node.x"
            :y="node.y"
            class="node-text second-level-text"
            text-anchor="middle"
            dominant-baseline="middle"
          >
            {{ node.name }}
          </text>
          
          <!-- 三级节点 -->
          <circle
            v-for="(node, index) in thirdLevelNodes"
            :key="`third-${index}`"
            :cx="node.x"
            :cy="node.y"
            :r="thirdLevelRadius"
            :fill="index % 2 === 0 ? 'url(#thirdLevelGradient1)' : 'url(#thirdLevelGradient2)'"
            filter="url(#nodeShadow)"
            class="node third-level"
          />
          <text
            v-for="(node, index) in thirdLevelNodes"
            :key="`third-text-${index}`"
            :x="node.x"
            :y="node.y"
            class="node-text third-level-text"
            text-anchor="middle"
            dominant-baseline="middle"
          >
            {{ node.name }}
          </text>
        </g>
      </svg>
    </div>
    
  </div>
</template>

<script>
export default {
  name: 'AbilityMap',
  data() {
    return {
      mapWidth: 1000,
      mapHeight: 700,
      centerX: 500,
      centerY: 350,
      centerRadius: 80,
      firstLevelRadius: 45,
      secondLevelRadius: 30,
      thirdLevelRadius: 20,
      studentName: '李启明A¯',
      
      // 能力分类数据
      abilityData: {
        '学术能力': {
          description: '学术研究、学习能力、知识掌握',
          children: {
            '学习能力': {
              description: '自主学习、知识获取、方法掌握',
              children: ['自主学习', '知识获取', '学习方法', '学习效率']
            },
            '研究能力': {
              description: '学术研究、论文写作、实验设计',
              children: ['文献调研', '数据分析', '实验设计', '论文写作']
            },
            '创新能力': {
              description: '创新思维、问题解决、创意表达',
              children: ['创新思维', '问题解决', '创意表达', '批判性思维']
            }
          }
        },
        '执行能力': {
          description: '任务执行、项目管理、效率提升',
          children: {
            '计划能力': {
              description: '目标设定、计划制定、时间管理',
              children: ['目标设定', '计划制定', '时间管理', '优先级排序']
            },
            '执行能力': {
              description: '任务执行、质量控制、结果导向',
              children: ['任务执行', '质量控制', '结果导向', '持续改进']
            },
            '应变能力': {
              description: '问题处理、危机应对、灵活调整',
              children: ['问题处理', '危机应对', '灵活调整', '快速学习']
            }
          }
        },
        '社会能力': {
          description: '人际交往、团队协作、沟通表达',
          children: {
            '沟通能力': {
              description: '表达交流、倾听理解、语言表达',
              children: ['口头表达', '书面表达', '倾听能力', '非语言沟通']
            },
            '协作能力': {
              description: '团队合作、协调配合、共同目标',
              children: ['团队合作', '协调配合', '共同目标', '冲突解决']
            },
            '领导能力': {
              description: '团队领导、项目管理、影响力',
              children: ['团队领导', '项目管理', '影响力', '决策能力']
            }
          }
        },
        '思想品格': {
          description: '道德品质、价值观念、人格修养',
          children: {
            '道德品质': {
              description: '诚信正直、责任担当、公平正义',
              children: ['诚信正直', '责任担当', '公平正义', '道德判断']
            },
            '价值观念': {
              description: '价值追求、人生目标、价值判断',
              children: ['价值追求', '人生目标', '价值判断', '价值实现']
            },
            '人格修养': {
              description: '自我管理、情绪控制、品格塑造',
              children: ['自我管理', '情绪控制', '品格塑造', '自我反思']
            }
          }
        },
        '职业发展': {
          description: '职业规划、技能发展、职业素养',
          children: {
            '职业规划': {
              description: '职业目标、发展路径、规划能力',
              children: ['职业目标', '发展路径', '规划能力', '目标调整']
            },
            '专业技能': {
              description: '专业能力、技能提升、知识更新',
              children: ['专业能力', '技能提升', '知识更新', '技术应用']
            },
            '职业素养': {
              description: '职业操守、工作态度、职业形象',
              children: ['职业操守', '工作态度', '职业形象', '职业发展']
            }
          }
        }
      }
    }
  },
  computed: {
    firstLevelNodes() {
      const nodes = []
      const angleStep = (2 * Math.PI) / 5
      const radius = 200
      
      Object.keys(this.abilityData).forEach((key, index) => {
        const angle = index * angleStep - Math.PI / 2
        nodes.push({
          name: key,
          x: this.centerX + radius * Math.cos(angle),
          y: this.centerY + radius * Math.sin(angle),
          data: this.abilityData[key]
        })
      })
      
      return nodes
    },
    
    secondLevelNodes() {
      const nodes = []
      let nodeIndex = 0
      
      this.firstLevelNodes.forEach((firstNode, firstIndex) => {
        const children = firstNode.data.children
        if (children) {
          const childKeys = Object.keys(children)
          const angleStep = (2 * Math.PI) / childKeys.length
          const radius = 130
          
          childKeys.forEach((key, childIndex) => {
            const angle = (firstIndex * (2 * Math.PI) / 5) + (childIndex * angleStep / 3) - Math.PI / 2
            nodes.push({
              name: key,
              x: firstNode.x + radius * Math.cos(angle),
              y: firstNode.y + radius * Math.sin(angle),
              data: children[key],
              parentIndex: firstIndex
            })
            nodeIndex++
          })
        }
      })
      
      return nodes
    },
    
    thirdLevelNodes() {
      const nodes = []
      let nodeIndex = 0
      
      this.secondLevelNodes.forEach((secondNode, secondIndex) => {
        const children = secondNode.data.children
        if (children && Array.isArray(children)) {
          const angleStep = (2 * Math.PI) / children.length
          const radius = 80
          
          children.forEach((child, childIndex) => {
            const angle = (secondIndex * (2 * Math.PI) / 15) + (childIndex * angleStep / 2) - Math.PI / 2
            nodes.push({
              name: child,
              x: secondNode.x + radius * Math.cos(angle),
              y: secondNode.y + radius * Math.sin(angle),
              data: { name: child, description: child },
              parentIndex: secondIndex
            })
            nodeIndex++
          })
        }
      })
      
      return nodes
    },
    
    secondLevelConnections() {
      const connections = []
      this.secondLevelNodes.forEach((node, index) => {
        const parentNode = this.firstLevelNodes[node.parentIndex]
        connections.push({
          from: `first-${node.parentIndex}`,
          to: `second-${index}`,
          x1: parentNode.x,
          y1: parentNode.y,
          x2: node.x,
          y2: node.y
        })
      })
      return connections
    },
    
    thirdLevelConnections() {
      const connections = []
      this.thirdLevelNodes.forEach((node, index) => {
        const parentNode = this.secondLevelNodes[node.parentIndex]
        connections.push({
          from: `second-${node.parentIndex}`,
          to: `third-${index}`,
          x1: parentNode.x,
          y1: parentNode.y,
          x2: node.x,
          y2: node.y
        })
      })
      return connections
    },
    
  },
  methods: {
    // 移除了节点交互方法
  }
}
</script>

<style scoped>
.ability-map-container {
  padding: 20px;
  background: #f8f9fa;
  min-height: 500px;
  width: 100%;
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.map-header {
  text-align: center;
  margin-bottom: 30px;
}

.map-header h2 {
  color: #2c3e50;
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
}

.map-header p {
  color: #7f8c8d;
  font-size: 16px;
}

.ability-map {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-bottom: 0;
  width: 100%;
  height: 100%;
}

.map-svg {
  border: 1px solid #e1e8ed;
  border-radius: 8px;
  background: #ffffff;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  max-width: 100%;
  width: 100%;
  min-width: 800px;
}

/* 连接线样式 */
.connection-line {
  stroke: #e2e8f0;
  stroke-width: 2;
  fill: none;
  transition: all 0.3s ease;
  opacity: 0.8;
}

.connection-line.level-1 {
  stroke: #ff6b9d;
  stroke-width: 3;
  opacity: 0.9;
}

.connection-line.level-2 {
  stroke: #a8a2ff;
  stroke-width: 2;
  opacity: 0.7;
}

.connection-line.level-3 {
  stroke-width: 1.5;
  opacity: 0.6;
}

/* 节点样式 */
.node {
  transition: all 0.3s ease;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
}


.center-node {
  stroke: none;
}

.first-level {
  stroke: none;
}

.second-level {
  stroke: none;
}

.third-level {
  stroke: none;
}


/* 文字样式 */
.node-text {
  font-family: 'PingFang SC', -apple-system, BlinkMacSystemFont, sans-serif;
  font-weight: 600;
  pointer-events: none;
  user-select: none;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
  fill: #1f2937;
}

.center-text {
  fill: white;
  font-size: 16px;
  font-weight: 700;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);
}

.first-level-text {
  fill: white;
  font-size: 13px;
  font-weight: 600;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.5);
}

.second-level-text {
  fill: white;
  font-size: 11px;
  font-weight: 500;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);
}

.third-level-text {
  fill: white;
  font-size: 9px;
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}


/* 响应式设计 */
@media (max-width: 1200px) {
  .map-svg {
    width: 100%;
    height: auto;
    max-width: 900px;
    min-width: 600px;
  }
}

@media (max-width: 768px) {
  .map-svg {
    width: 100%;
    height: auto;
    max-width: 100%;
    min-width: 400px;
  }
  
  .center-text {
    font-size: 12px;
  }
  
  .first-level-text {
    font-size: 10px;
  }
  
  .second-level-text {
    font-size: 8px;
  }
  
  .third-level-text {
    font-size: 6px;
  }
}
</style>
