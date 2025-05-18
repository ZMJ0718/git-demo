export const bubbleSort = {
  code: `function bubbleSort(arr) {
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j] > arr[j + 1]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}`,

  async *sort(arr, stats) {
    for (let i = 0; i < arr.length; i++) {
      for (let j = 0; j < arr.length - i - 1; j++) {
        stats.comparisons++
        const active = [j, j + 1]
        
        // 比较阶段
        yield { 
          array: [...arr],
          activeIndices: active,
          line: 3,
          comparisons: stats.comparisons
        }

        if (arr[j] > arr[j + 1]) {
          // 交换阶段
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]]
          yield { 
            array: [...arr], 
            activeIndices: active,
            line: 4,
            comparisons: stats.comparisons
          }
        }
      }
    }
    return arr
  }
}

export const quickSort = {
  code: `function quickSort(arr, low = 0, high = arr.length - 1) {
  if (low < high) {
    const pi = partition(arr, low, high);
    quickSort(arr, low, pi - 1);
    quickSort(arr, pi + 1, high);
  }
  return arr;
}

function partition(arr, low, high) {
  const pivot = arr[high];
  let i = low - 1;
  for (let j = low; j < high; j++) {
    if (arr[j] < pivot) {
      i++;
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }
  [arr[i+1], arr[high]] = [arr[high], arr[i+1]];
  return i + 1;
}`,

  async *sort(arr, stats, low = 0, high = arr.length - 1) {
    if (low < high) {
      const partitionGenerator = this.partition(arr, low, high, stats)
      let result
      while (!(result = partitionGenerator.next()).done) {
        yield { 
          ...result.value,
          line: 3,
          algorithmType: '快速排序'
        }
      }
      const pi = result.value

      yield {
        array: [...arr],
        activeIndices: [],
        pivotValue: null,
        leftPointer: null,
        rightPointer: null,
        partitionState: `分区完成 (基准位置: ${pi})`,
        line: 3
      }

      yield* this.sort(arr, stats, low, pi - 1)
      yield* this.sort(arr, stats, pi + 1, high)
    }
  },

  *partition(arr, low, high, stats) {
    const pivot = arr[high]
    let i = low - 1

    // 初始化分区状态
    yield {
      array: [...arr],
      activeIndices: [high],
      pivotValue: pivot,
      leftPointer: i,
      rightPointer: low,
      partitionState: "选择基准值",
      line: 12
    }

    for (let j = low; j < high; j++) {
      stats.comparisons++
      
      // 比较阶段
      yield {
        array: [...arr],
        activeIndices: [j, high],
        pivotValue: pivot,
        leftPointer: i,
        rightPointer: j,
        partitionState: "比较元素",
        line: 12,
        comparisons: stats.comparisons
      }

      if (arr[j] < pivot) {
        i++
        // 交换元素前状态
        yield {
          array: [...arr],
          activeIndices: [i, j],
          pivotValue: pivot,
          leftPointer: i,
          rightPointer: j,
          partitionState: "准备交换",
          line: 14,
          comparisons: stats.comparisons
        }
        
        // 执行交换
        ;[arr[i], arr[j]] = [arr[j], arr[i]]
        
        // 交换后状态
        yield {
          array: [...arr],
          activeIndices: [i, j],
          pivotValue: pivot,
          leftPointer: i,
          rightPointer: j,
          partitionState: "完成交换",
          line: 14,
          comparisons: stats.comparisons
        }
      }
    }

    // 最终交换基准值
    yield {
      array: [...arr],
      activeIndices: [i + 1, high],
      pivotValue: pivot,
      leftPointer: i + 1,
      rightPointer: high,
      partitionState: "最终交换基准值",
      line: 17,
      comparisons: stats.comparisons
    }
    
    ;[arr[i + 1], arr[high]] = [arr[high], arr[i + 1]]
    
    return i + 1
  }
}