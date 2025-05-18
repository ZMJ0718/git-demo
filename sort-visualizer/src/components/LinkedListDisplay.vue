<script setup>
import { computed } from 'vue'
import * as d3 from 'd3-shape'

const props = defineProps({
  nodes: {
    type: Array,
    required: true
  }
})

const nodePositions = computed(() => {
  return props.nodes.map((node, i) => ({
    ...node,
    x: i * 120 + 50,
    y: 200
  }))
})

const calculateLinkPath = (start, end) => {
  const lineGenerator = d3.line()
    .x(d => d.x)
    .y(d => d.y)
    .curve(d3.curveBasis)
  
  const midX = (start.x + end.x) / 2
  return lineGenerator([
    { x: start.x + 40, y: start.y + 20 },
    { x: midX, y: start.y + 50 },
    { x: end.x - 20, y: end.y + 20 }
  ])
}
</script>

<template>
  <div class="linked-list-container">
    <svg class="links">
      <path 
        v-for="(node, index) in nodePositions" 
        v-if="index < nodePositions.length - 1"
        :d="calculateLinkPath(node, nodePositions[index + 1])"
        stroke="#3498db"
        fill="none"
        stroke-width="2"
      />
    </svg>
    
    <div
      v-for="(node, index) in nodePositions"
      :key="index"
      class="node"
      :style="{
        left: `${node.x}px`,
        top: `${node.y}px`,
        borderColor: node.active ? '#e74c3c' : '#3498db'
      }"
    >
      <div class="value">{{ node.value }}</div>
      <div class="next-pointer"></div>
    </div>
  </div>
</template>

<style>
.linked-list-container {
  position: relative;
  height: 400px;
}

.node {
  position: absolute;
  width: 60px;
  height: 60px;
  border: 2px solid;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  transition: all 0.3s ease;
}

.value {
  font-size: 18px;
  font-weight: bold;
}

.next-pointer {
  position: absolute;
  right: -15px;
  top: 50%;
  transform: translateY(-50%);
  width: 20px;
  height: 2px;
  background: #3498db;
}

.links {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>