<script setup>
import { ref, watch, onMounted } from 'vue'
import hljs from 'highlight.js'

const props = defineProps({
  code: Array,
  currentLine: Number
})

const highlightedLines = ref([])

const updateHighlight = () => {
  const codeStr = props.code.join('\n')
  const highlighted = hljs.highlight(codeStr, { 
    language: 'javascript',
    ignoreIllegals: true
  }).value
  highlightedLines.value = highlighted.split('\n')
}

onMounted(() => {
  hljs.configure({ classPrefix: 'hljs-' })
  updateHighlight()
})

watch(() => props.code, updateHighlight)
</script>

<template>
  <div class="code-highlighter">
    <pre><code class="hljs">
      <div
        v-for="(line, index) in highlightedLines"
        :key="index"
        :class="['code-line', { 'highlighted': currentLine === index + 1 }]"
      >
        <span class="line-number">{{ index + 1 }}.</span>
        <span class="line-content" v-html="line"></span>
      </div>
    </code></pre>
  </div>
</template>

<style>
.code-highlighter {
  background: #1e1e1e;
  border-radius: 8px;
  padding: 15px;
  font-family: 'Fira Code', monospace;
}

pre {
  margin: 0;
  counter-reset: line;
}

.code-line {
  display: flex;
  min-height: 22px;
  padding: 2px 0;
}

.line-number {
  color: #858585;
  min-width: 40px;
  text-align: right;
  padding-right: 15px;
  user-select: none;
}

.line-content {
  flex: 1;
  color: #d4d4d4;
}

.highlighted {
  background: rgba(255, 255, 0, 0.15);
  box-shadow: inset 3px 0 0 #ffe564;
}
</style>