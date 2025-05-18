export const radixSort = {
    code: `function radixSort(arr) {
    const maxDigits = Math.max(...arr).toString().length;
    let buckets = Array.from({ length: 10 }, () => []);
    
    for (let i = 0; i < maxDigits; i++) {
      for (const num of arr) {
        const digit = getDigit(num, i);
        buckets[digit].push(num);
      }
      arr = [].concat(...buckets);
      buckets.forEach(b => b.length = 0);
    }
    return arr;
  }
  
  function getDigit(num, place) {
    return Math.floor(Math.abs(num) / Math.pow(10, place)) % 10;
  }`,
  
    async *sort(arr, stats) {
      const maxDigits = Math.max(...arr).toString().length
      let buckets = Array.from({ length: 10 }, () => [])
  const originalIndices = new Map(arr.map((num, idx) => [num, idx]))
      for (let i = 0; i < maxDigits; i++) {
        // Distribute
        for (const num of arr) {
          const digit = this.getDigit(num, i)
          buckets[digit].push(num)
          stats.comparisons++  // 添加比较计数  
          yield {
            array: [...arr],
            activeIndices: [arr.indexOf(num)],
            line: 6,
          }
        }
        
        // Collect
        arr = [].concat(...buckets)
        yield {
          array: [...arr],
          activeIndices: [],
          line: 7,
        }
              // 更新原始索引映射    
        originalIndices.clear()
        arr.forEach((num, idx) => originalIndices.set(num, idx))
        // Clear buckets
        buckets.forEach(b => b.length = 0)
      }
      return arr
    },
  
    getDigit(num, place) {
      return Math.floor(Math.abs(num) / Math.pow(10, place)) % 10
    }
  }