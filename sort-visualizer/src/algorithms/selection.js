export const straightSelection = {
  code: `function selectionSort(arr) {
  for (let i = 0; i < arr.length - 1; i++) {
    let minIndex = i;
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[j] < arr[minIndex]) {
        minIndex = j;
      }
    }
    [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]];
  }
  return arr;
}`,

  async *sort(arr, stats) {
    for (let i = 0; i < arr.length - 1; i++) {
      let minIndex = i
      yield {
        array: [...arr],
        activeIndices: [i],
        line: 2,
        comparisons: stats.comparisons
      }

      for (let j = i + 1; j < arr.length; j++) {
        stats.comparisons++
        yield {
          array: [...arr],
          activeIndices: [j, minIndex],
          line: 4,
          comparisons: stats.comparisons
        }
        
        if (arr[j] < arr[minIndex]) {
          minIndex = j
          yield {
            array: [...arr],
            activeIndices: [minIndex],
            line: 5,
            comparisons: stats.comparisons
          }
        }
      }

      if (minIndex !== i) {
        [arr[i], arr[minIndex]] = [arr[minIndex], arr[i]]
        yield {
          array: [...arr],
          activeIndices: [i, minIndex],
          line: 7,
          comparisons: stats.comparisons
        }
      }
    }
    return arr
  }
}

export const heapSort = {
  code: `function heapSort(arr) {
  // Build max heap
  for (let i = Math.floor(arr.length / 2) - 1; i >= 0; i--) {
    heapify(arr, arr.length, i);
  }

  // Extract elements
  for (let i = arr.length - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]];
    heapify(arr, i, 0);
  }
  return arr;
}

function heapify(arr, n, i) {
  let largest = i;
  const left = 2 * i + 1;
  const right = 2 * i + 2;

  if (left < n && arr[left] > arr[largest]) {
    largest = left;
  }

  if (right < n && arr[right] > arr[largest]) {
    largest = right;
  }

  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]];
    heapify(arr, n, largest);
  }
}`,

async *sort(arr, stats) {
  const n = arr.length

  // Build max heap
  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    yield* this.heapify(arr, n, i, stats)
    yield {
      array: [...arr],
      line: 4,
      currentHeapNode: i,
      currentLeftChild: 2*i+1,
      currentRightChild: 2*i+2
    }
  }

  // Extract elements
  for (let i = n - 1; i > 0; i--) {
    [arr[0], arr[i]] = [arr[i], arr[0]]
    yield {
      array: [...arr],
      activeIndices: [0, i],
      line: 8,
      currentHeapNode: 0,
      currentLeftChild: 1,
      currentRightChild: 2
    }
    yield* this.heapify(arr, i, 0, stats)
  }
},

*heapify(arr, n, i, stats) {
  let largest = i
  const left = 2 * i + 1
  const right = 2 * i + 2

  // 比较左子节点
  if (left < n) {
    stats.comparisons++
    yield {
      array: [...arr],
      activeIndices: [i, left],
      currentHeapNode: i,
      currentLeftChild: left,
      currentRightChild: null,
      line: 15
    }
    if (arr[left] > arr[largest]) {
      largest = left
    }
  }

  // 比较右子节点
  if (right < n) {
    stats.comparisons++
    yield {
      array: [...arr],
      activeIndices: [largest, right],
      currentHeapNode: largest,
      currentLeftChild: null,
      currentRightChild: right,
      line: 19
    }
    if (arr[right] > arr[largest]) {
      largest = right
    }
  }

  // 执行交换
  if (largest !== i) {
    [arr[i], arr[largest]] = [arr[largest], arr[i]]
    yield {
      array: [...arr],
      activeIndices: [i, largest],
      currentHeapNode: largest,
      currentLeftChild: 2*largest+1,
      currentRightChild: 2*largest+2,
      line: 23
    }
    yield* this.heapify(arr, n, largest, stats)
  }
}
}