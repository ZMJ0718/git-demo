<script setup>
import { computed } from 'vue'
import * as d3 from 'd3-shape'

const props = defineProps({
  array: Array,
  activeIndices: Array,
  current: Number,
  leftChild: Number,
  rightChild: Number
})

const nodePositions = computed(() => {
  const nodes = []
  const height = Math.ceil(Math.log2(props.array.length + 1))
  const maxWidth = Math.pow(2, height - 1) * 60
  
  const traverse = (index, depth, posX, parentPos) => {
    if (index >= props.array.length) return null
    
    const node = {
      value: props.array[index],
      index,
      x: posX,
      y: depth * 100 + 50,
      parent: parentPos
    }
    
    nodes.push(node)
    
    const horizontalOffset = maxWidth / Math.pow(2, depth + 2)
    node.leftChild = traverse(2 * index + 1, depth + 1, posX - horizontalOffset, node)
    node.rightChild = traverse(2 * index + 2, depth + 1, posX + horizontalOffset, node)
    
    return node
  }

  traverse(0, 0, maxWidth / 2, null)
  return nodes
})

const connections = computed(() => {
  const lines = []
  
  nodePositions.value.forEach(node => {
    if (node.leftChild) {
      lines.push({
        type: 'line',
        from: { x: node.x, y: node.y + 15 },
        to: { x: node.leftChild.x, y: node.leftChild.y - 15 }
      })
    }
    if (node.rightChild) {
      lines.push({
        type: 'line',
        from: { x: node.x, y: node.y + 15 },
        to: { x: node.rightChild.x, y: node.rightChild.y - 15 }
      })
    }
  })
  
  return lines
})
</script>

<template>
  <div class="heap-container">
    <svg class="heap-connections">
      <path
        v-for="(conn, i) in connections"
        :key="i"
        :d="`M${conn.from.x},${conn.from.y} L${conn.to.x},${conn.to.y}`"
        stroke="#3498db"
        fill="none"
        stroke-width="2"
      />
    </svg>
    
    <div
      v-for="node in nodePositions"
      :key="node.index"
      class="heap-node"
      :class="{
        'current-node': node.index === current,
        'compared-node': [leftChild, rightChild].includes(node.index),
        'active-node': activeIndices?.includes(node.index)
      }"
      :style="{
        left: `${node.x - 25}px`,
        top: `${node.y}px`
      }"
    >
      <div class="node-value">{{ node.value }}</div>
      <div class="node-index">[{{ node.index }}]</div>
    </div>
  </div>
</template>

<style scoped>
.heap-container {
  position: relative;
  min-height: 500px;
  margin: 20px 0;
}

.heap-node {
  position: absolute;
  width: 50px;
  height: 50px;
  border: 2px solid #3498db;
  border-radius: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: white;
  transition: all 0.3s ease;
  z-index: 2;
}

.node-value {
  font-size: 16px;
  font-weight: bold;
}

.node-index {
  font-size: 10px;
  color: #666;
}

.current-node {
  border-color: #e74c3c;
  box-shadow: 0 0 10px rgba(231, 76, 60, 0.3);
}

.compared-node {
  border-color: #2ecc71;
  box-shadow: 0 0 10px rgba(46, 204, 113, 0.3);
}

.active-node {
  transform: scale(1.1);
}

.heap-connections {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}
</style>