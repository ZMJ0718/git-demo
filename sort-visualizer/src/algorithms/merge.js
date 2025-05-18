export const mergeSort = {
  code: `function mergeSort(arr) {
  if (arr.length <= 1) return arr;
  const mid = Math.floor(arr.length / 2);
  const left = mergeSort(arr.slice(0, mid));
  const right = mergeSort(arr.slice(mid));
  return merge(left, right);
}

function merge(left, right) {
  let result = [];
  let i = 0, j = 0;
  while (i < left.length && j < right.length) {
    if (left[i] < right[j]) {
      result.push(left[i++]);
    } else {
      result.push(right[j++]);
    }
  }
  return result.concat(left.slice(i)).concat(right.slice(j));
}`,

  async *sort(arr, stats) {
    const temp = new Array(arr.length)
    yield* this.mergeSortRecursive(arr, 0, arr.length - 1, temp, stats)
  },

  *mergeSortRecursive(arr, start, end, temp, stats) {
    if (start >= end) return

    const mid = Math.floor((start + end) / 2)
    
    yield {
      array: [...arr],
      mergeState: 'split',
      range: { start, mid, end },
      line: 2
    }
    
    yield* this.mergeSortRecursive(arr, start, mid, temp, stats)
    yield* this.mergeSortRecursive(arr, mid + 1, end, temp, stats)
    
    yield {
      array: [...arr],
      mergeState: 'pre-merge',
      range: { start, mid, end },
      tempArray: [],
      line: 3
    }
    
    yield* this.merge(arr, start, mid, end, temp, stats)
  },

  *merge(arr, start, mid, end, temp, stats) {
    let i = start
    let j = mid + 1
    let k = start
    const tempArray = []

    while (i <= mid && j <= end) {
      stats.comparisons++
      
      yield {
        array: [...arr],
        mergeState: 'comparing',
        range: { start, mid, end },
        comparing: [i, j],
        tempArray: [...tempArray],
        line: 9
      }

      if (arr[i] <= arr[j]) {
        tempArray.push(arr[i])
        temp[k++] = arr[i++]
      } else {
        tempArray.push(arr[j])
        temp[k++] = arr[j++]
      }

      yield {
        array: [...arr],
        mergeState: 'collecting',
        range: { start, mid, end },
        tempArray: [...tempArray],
        line: 11
      }
    }

    while (i <= mid) {
      tempArray.push(arr[i])
      temp[k++] = arr[i++]
      yield {
        array: [...arr],
        mergeState: 'collecting',
        range: { start, mid, end },
        tempArray: [...tempArray],
        line: 15
      }
    }

    while (j <= end) {
      tempArray.push(arr[j])
      temp[k++] = arr[j++]
      yield {
        array: [...arr],
        mergeState: 'collecting',
        range: { start, mid, end },
        tempArray: [...tempArray],
        line: 16
      }
    }

    for (let m = start; m <= end; m++) {
      arr[m] = temp[m]
      yield {
        array: [...arr],
        mergeState: 'writing',
        range: { start: m, end: m },
        tempArray: [...tempArray],
        line: 13
      }
    }

    yield {
      array: [...arr],
      mergeState: 'merged',
      range: { start, mid, end },
      line: 13
    }
  }
}