<script setup>
import { useMotion } from '@vueuse/motion'
import { computed, ref } from 'vue'
import HeapTree from './HeapTree.vue'

const props = defineProps({
  array: Array,
  activeIndices: Array,
  nodes: Array,
  algorithmType: String,
  leftBound: Number,
  rightBound: Number,
  midIndex: Number,
  currentValue: Number,
  pivotValue: Number,
  leftPointer: Number,
  rightPointer: Number,
  partitionState: String,
  mergeState: String,
  range: Object,
  tempArray: Array,
  comparing: Array,

  currentHeapNode: Number,
  currentLeftChild: Number,
  currentRightChild: Number
})

const mergeRange = computed(() => {
  if (!props.range || !props.array?.length) return null
  const barWidth = barPositions.value[0]?.width || 0
  return {
    startX: barPositions.value[props.range.start]?.left || 0,
    endX: (barPositions.value[props.range.end]?.left || 0) + barWidth,
    midX: barPositions.value[props.range.mid]?.left + barWidth || 0
  }
})

const tempArrayPositions = computed(() => {
  return props.tempArray?.map((val, i) => ({
    x: (i * 100) / props.tempArray.length + '%',
    width: (100 / props.tempArray.length) + '%',
    height: (val / maxValue.value) * 80 + '%'
  })) || []
})

const maxValue = computed(() => Math.max(...props.array, 1))
const containerRef = ref(null)

// 新增快速排序相关计算属性
const pivotLinePosition = computed(() => {
  if (!props.pivotValue) return 0
  return (props.pivotValue / maxValue.value) * 80 + 10
})

const barPositions = computed(() => {
  if (!containerRef.value) return []
  const containerWidth = containerRef.value.offsetWidth
  const barCount = props.array.length
  return props.array.map((_, i) => ({
    left: (i * containerWidth) / barCount,
    width: (containerWidth / barCount) - 4
  }))
})

const lineMotion = useMotion(containerRef, {
  initial: { opacity: 0 },
  enter: { opacity: 1 }
})
</script>

<template>
  <div class="visualization" ref="containerRef">
    <template v-if="algorithmType === '二路归并排序'">
      <div 
        v-if="mergeRange && mergeState"
        class="merge-overlay"
      >
      <div 
          v-if="['split', 'pre-merge'].includes(mergeState)"
          class="split-line"
          :style="{ left: mergeRange.midX + 'px' }"
        ></div>
        <div
          class="merge-range"
          :style="{
            left: mergeRange.startX + 'px',
            width: (mergeRange.endX - mergeRange.startX) + 'px'
          }"
        ></div>
        <template v-if="comparing">
          <div
            v-for="index in comparing"
            :key="index"
            class="merge-pointer"
            :style="{ left: barPositions[index]?.left + 'px' }"
          >
            {{ index === comparing[0] ? 'L' : 'R' }}
          </div>
        </template>
        <div 
          v-if="tempArray.length > 0"
          class="temp-array"
        >
          <div 
            v-for="(pos, i) in tempArrayPositions"
            :key="i"
            class="temp-bar"
            :style="{
              left: pos.x,
              width: pos.width,
              height: pos.height
            }"
          >
          {{ tempArray[i] }}
          </div>
          <div class="temp-label">临时数组</div>
        </div>
      </div>
    </template>

    <div v-if="algorithmType === '快速排序'" class="quick-sort-overlay">
        <div 
          v-if="pivotValue !== undefined"
          class="pivot-indicator"
          :style="{ bottom: `${pivotLinePosition}%` }"
        >
          <span class="pivot-label">基准值: {{ pivotValue }}</span>
        </div>

        <div 
          v-if="leftPointer !== undefined"
          class="pointer left-pointer"
          :style="{ left: `${barPositions[leftPointer]?.left}px` }"
        >
          <span>← L</span>
        </div>

        <div 
          v-if="rightPointer !== undefined"
          class="pointer right-pointer"
          :style="{ left: `${barPositions[rightPointer]?.left}px` }"
        >
          <span>R →</span>
        </div>

        <div 
          v-if="partitionState"
          class="partition-state"
        >
          {{ partitionState }}
        </div>
      </div>
    <div v-if="algorithmType === '链表插入排序'">
      <LinkedListDisplay :nodes="nodes" />
    </div>
    <div v-else-if="algorithmType === '堆排序'" class="heap-sort-container">
      <HeapTree
        :array="array"
        :active-indices="activeIndices"
        :current="currentHeapNode"
        :left-child="currentLeftChild"
        :right-child="currentRightChild"
      />
      <div class="heap-stats">
        <div v-if="currentHeapNode !== null" class="heap-stat-item">
          当前节点: {{ array[currentHeapNode] }} [{{ currentHeapNode }}]
        </div>
        <div v-if="currentLeftChild !== null" class="heap-stat-item">
          左子节点: {{ array[currentLeftChild] }} [{{ currentLeftChild }}]
        </div>
        <div v-if="currentRightChild !== null" class="heap-stat-item">
          右子节点: {{ array[currentRightChild] }} [{{ currentRightChild }}]
        </div>
      </div>
     </div>
    <div v-else class="bar-container">
      <div 
        v-for="(value, index) in array"
        :key="index"
        class="bar"
        :style="{
          height: `${(value / maxValue) * 80}%`,
          backgroundColor: activeIndices?.includes(index) ? '#e74c3c' : '#3498db'
        }"
      >
        <span class="bar-label">{{ value }}</span>
      </div>

      <template v-if="algorithmType === '折半插入排序'">
        <div 
          v-if="leftBound !== undefined"
          class="bound-line left"
          :style="{
            left: `${barPositions[leftBound]?.left}px`,
            width: `${barPositions[leftBound]?.width}px`
          }"
        >
          <span class="bound-label">L</span>
        </div>

        <div 
          v-if="rightBound !== undefined"
          class="bound-line right"
          :style="{
            left: `${barPositions[rightBound]?.left}px`,
            width: `${barPositions[rightBound]?.width}px`
          }"
        >
          <span class="bound-label">R</span>
        </div>

        <div
          v-if="midIndex !== undefined"
          class="mid-highlight"
          :style="{
            left: `${barPositions[midIndex]?.left}px`,
            width: `${barPositions[midIndex]?.width}px`
          }"
        >
          <span class="mid-label">MID</span>
        </div>

        <div
          v-if="currentValue !== undefined"
          class="current-value"
        >
          <span>查找值: {{ currentValue }}</span>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped>
.bar-container {
  position: relative;
  height: 400px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 8px;
  padding: 20px;
}

.bar {
  flex: 1;
  max-width: 60px;
  transition: all 0.3s ease;
  border-radius: 4px 4px 0 0;
  position: relative;
}

.bar-label {
  position: absolute;
  bottom: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 12px;
  color: #2c3e50;
}

.bound-line {
  position: absolute;
  bottom: 0;
  height: 100%;
  border: 3px solid;
  pointer-events: none;
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.left {
  border-color: #2ecc71;
}

.right {
  border-color: #e67e22;
}

.bound-label {
  position: absolute;
  top: -25px;
  left: 50%;
  transform: translateX(-50%);
  font-weight: bold;
  color: #fff;
  background: rgba(0,0,0,0.7);
  padding: 2px 6px;
  border-radius: 4px;
}

.mid-highlight {
  position: absolute;
  bottom: 0;
  height: 100%;
  background: rgba(255, 235, 59, 0.3);
  transition: all 0.5s ease;
}

.mid-label {
  position: absolute;
  bottom: -35px;
  left: 50%;
  transform: translateX(-50%);
  color: #f39c12;
  font-weight: bold;
}

.current-value {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0,0,0,0.8);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.quick-sort-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.pivot-indicator {
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: #f1c40f;
  animation: pulse 1s infinite;
}

.pivot-label {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  top: -25px;
  background: rgba(241, 196, 15, 0.9);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.pointer {
  position: absolute;
  bottom: -40px;
  color: #2ecc71;
  font-weight: bold;
  font-size: 14px;
  white-space: nowrap;
  padding: 4px 8px;
  background: rgba(46, 204, 113, 0.1);
  border-radius: 4px;
}

.left-pointer {
  animation: bounce-left 0.8s infinite;
}

.right-pointer {
  animation: bounce-right 0.8s infinite;
}

.partition-state {
  position: absolute;
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(46, 204, 113, 0.9);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

@keyframes pulse {
  0% { opacity: 0.4; }
  50% { opacity: 1; }
  100% { opacity: 0.4; }
}

@keyframes bounce-left {
  0% { transform: translateX(0); }
  50% { transform: translateX(-8px); }
  100% { transform: translateX(0); }
}

@keyframes bounce-right {
  0% { transform: translateX(0); }
  50% { transform: translateX(8px); }
  100% { transform: translateX(0); }
}

.merge-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.split-line {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 2px;
  background: #f1c40f;
  animation: pulse 1s infinite;
}

.merge-range {
  position: absolute;
  top: 0;
  bottom: 0;
  background: rgba(46, 204, 113, 0.1);
  border: 2px solid #2ecc71;
}

.merge-pointer {
  position: absolute;
  bottom: -30px;
  background: #e74c3c;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
}

.temp-array {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 100px;
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid #3498db;
  border-radius: 8px;
  display: flex;
  align-items: flex-end;
  padding: 10px;
}

.temp-bar {
  background: #3498db;
  margin: 0 2px;
  transition: all 0.3s ease;
  text-align: center;
  color: white;
  font-size: 12px;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.temp-label {
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  color: #3498db;
  font-weight: bold;
}

@keyframes pulse {
  0% { opacity: 0.4; }
  50% { opacity: 1; }
  100% { opacity: 0.4; }
}

.heap-sort-container {
  position: relative;
  min-height: 600px;
}

.heap-stats {
  position: absolute;
  bottom: 20px;
  left: 20px;
  background: rgba(255, 255, 255, 0.9);
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.heap-stat-item {
  margin: 8px 0;
  padding: 6px;
  background: #f8f9fa;
  border-radius: 4px;
}
</style>