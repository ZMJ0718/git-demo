<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const categories = [
  { name: '插入排序', algorithms: ['直接插入排序', '折半插入排序', '链表插入排序', 'Shell排序'] },
  { name: '交换排序', algorithms: ['起泡排序', '快速排序'] },
  { name: '选择排序', algorithms: ['直接选择排序', '堆排序'] },
  { name: '归并排序', algorithms: ['二路归并排序'] },
  { name: '基数排序', algorithms: ['基数排序'] }
]

const selectedAlgorithm = ref('')
const router = useRouter()

const navigateToAlgorithm = () => {
  if (selectedAlgorithm.value) {
    router.push({ name: 'sort', params: { algorithm: selectedAlgorithm.value } })
  }
}
</script>

<template>
  <div class="container">
    <h1>交互式排序算法可视化平台</h1>
    <div class="algorithm-selector">
      <select v-model="selectedAlgorithm" @change="navigateToAlgorithm">
        <option value="">请选择排序算法</option>
        <optgroup v-for="category in categories" :label="category.name" :key="category.name">
          <option v-for="algo in category.algorithms" :value="algo" :key="algo">{{ algo }}</option>
        </optgroup>
      </select>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 20px;
}

.algorithm-selector {
  margin-top: 2rem;
}

select {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 2px solid #3498db;
  border-radius: 6px;
  background-color: white;
}
</style>