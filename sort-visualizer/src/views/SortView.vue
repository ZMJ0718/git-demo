<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import AlgorithmDisplay from '../components/AlgorithmDisplay.vue'
import CodeHighlighter from '../components/CodeHighlighter.vue'
import * as insertion from '../algorithms/insertion'
import * as exchange from '../algorithms/exchange'
import * as selection from '../algorithms/selection'
import * as merge from '../algorithms/merge'
import * as radix from '../algorithms/radix'

const route = useRoute()
const inputArray = ref('5,3,8,4,2,7,1,6')
const array = ref([])
const stats = ref({ comparisons: 0, time: 0 })
const isSorting = ref(false)
const algorithm = ref(null)
const codeLines = ref([])
const activeIndices = ref([])
const currentLine = ref(-1)

const leftBound = ref(null)
const rightBound = ref(null)
const midIndex = ref(null)
const currentValue = ref(null)

// 新增状态
const currentPartition = ref({
  pivot: null,
  left: null,
  right: null,
  state: ''
})

const mergeState = ref(null)
const range = ref(null)
const tempArray = ref([])
const comparing = ref([])

const currentHeapNode = ref(null)
const currentLeftChild = ref(null)
const currentRightChild = ref(null)

const algorithmMap = {
  '直接插入排序': insertion.straightInsertion,
  '折半插入排序': insertion.binaryInsertion,
  '链表插入排序': insertion.linkedListInsertion,
  'Shell排序': insertion.shellSort,
  '起泡排序': exchange.bubbleSort,
  '快速排序': exchange.quickSort,
  '直接选择排序': selection.straightSelection,
  '堆排序': selection.heapSort,
  '二路归并排序': merge.mergeSort,
  '基数排序': radix.radixSort
}

onMounted(() => {
  const algoName = route.params.algorithm
  algorithm.value = algorithmMap[algoName]
  codeLines.value = algorithm.value.code.split('\n')
  parseArray()
})

const parseArray = () => {
  array.value = inputArray.value.split(',')
    .map(Number)
    .filter(n => !isNaN(n) && n > 0)
}

const nodes = ref([])

const visualizeSort = async () => {
  if (isSorting.value || array.value.length === 0) return
  isSorting.value = true
  stats.value = { comparisons: 0, time: 0 }
  activeIndices.value = []
  currentLine.value = -1
  // 重置新增状态
  leftBound.value = null
  rightBound.value = null
  midIndex.value = null
  currentValue.value = null
  
  mergeState.value = null
  range.value = null
  tempArray.value = []
  comparing.value = []

  currentHeapNode.value = null
  currentLeftChild.value = null
  currentRightChild.value = null

  const startTime = performance.now()
  const arr = [...array.value]
  const generator = algorithm.value.sort(arr, stats.value)
  
  try {
    for await (const step of generator) {
      array.value = [...step.array]
      nodes.value = step.nodes || []
      activeIndices.value = step.activeIndices || []
      // 更新新增状态
      leftBound.value = step.leftBound
      rightBound.value = step.rightBound
      midIndex.value = step.midIndex
      currentValue.value = step.currentValue

            // 更新归并排序状态
            mergeState.value = step.mergeState
      range.value = step.range
      tempArray.value = step.tempArray || []
      comparing.value = step.comparing || []

      // 更新堆排序相关状态
      currentHeapNode.value = step.currentHeapNode ?? null
      currentLeftChild.value = step.currentLeftChild ?? null
      currentRightChild.value = step.currentRightChild ?? null

      currentPartition.value = {
        pivot: step.pivotValue ?? null,
        left: step.leftPointer ?? null,
        right: step.rightPointer ?? null,
        state: step.partitionState ?? ''
      }

      currentLine.value = step.line ?? -1
      stats.value.time = performance.now() - startTime
      await new Promise(resolve => setTimeout(resolve, 800))
    }
  } finally {
    isSorting.value = false
    currentLine.value = -1
    // 重置新增状态
    leftBound.value = null
    rightBound.value = null
    midIndex.value = null
    currentValue.value = null

    currentHeapNode.value = null
    currentLeftChild.value = null
    currentRightChild.value = null

    currentPartition.value = {
      pivot: null,
      left: null,
      right: null,
      state: ''
    }

        // 重置归并排序状态
        mergeState.value = null
    range.value = null
    tempArray.value = []
    comparing.value = []
  }
}
</script>

<template>
  <div class="container">
    <div class="left-panel">
      <AlgorithmDisplay 
        :array="array"
        :nodes="nodes"
        :algorithm-type="route.params.algorithm"
        :active-indices="activeIndices"
        :left-bound="leftBound"
        :right-bound="rightBound"
        :mid-index="midIndex"
        :current-value="currentValue"
        :pivot-value="currentPartition.pivot"
        :left-pointer="currentPartition.left"
        :right-pointer="currentPartition.right"
        :partition-state="currentPartition.state"

        :merge-state="mergeState"
        :range="range"
        :temp-array="tempArray"
        :comparing="comparing"

        :current-heap-node="currentHeapNode"
        :current-left-child="currentLeftChild"
        :current-right-child="currentRightChild"
      />
      <div class="controls">
        <div class="array-input">
          <input
            v-model="inputArray"
            placeholder="输入数字，用逗号分隔"
            :disabled="isSorting"
          >
          <button @click="parseArray" :disabled="isSorting">更新数组</button>
        </div>
        <button 
          @click="visualizeSort" 
          :disabled="isSorting"
          class="start-btn"
        >
          {{ isSorting ? '排序进行中...' : '开始排序' }}
        </button>
      </div>
    </div>
    
    <div class="right-panel">
      <div class="stats-panel">
        <h3>统计信息</h3>
        <div class="stats-item">
          <span>比较次数:</span>
          <span>{{ stats.comparisons }}</span>
        </div>
        <div class="stats-item">
          <span>执行时间:</span>
          <span>{{ stats.time.toFixed(2) }}ms</span>
        </div>
      </div>
      <div class="code-panel">
        <CodeHighlighter 
          :code="codeLines" 
          :current-line="currentLine" 
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px;
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.controls {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.array-input {
  display: flex;
  gap: 10px;
}

input {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
}

button {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s;
}

button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.start-btn {
  background: #27ae60;
  color: white;
  padding: 12px 24px;
}

.stats-panel {
  background: #f8f9fa;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
}

.stats-item {
  display: flex;
  justify-content: space-between;
  margin: 8px 0;
  padding: 8px;
  background: white;
  border-radius: 4px;
}
</style>