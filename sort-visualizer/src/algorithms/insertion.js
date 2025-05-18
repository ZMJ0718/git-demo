export const straightInsertion = {
  code: `function insertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let current = arr[i];
    let j = i - 1;
    while (j >= 0 && arr[j] > current) {
      arr[j + 1] = arr[j];
      j--;
    }
    arr[j + 1] = current;
  }
  return arr;
}`,

  async *sort(arr, stats) {
    for (let i = 1; i < arr.length; i++) {
      const current = arr[i]
      let j = i - 1
      const active = [i]
      
      yield { 
        array: [...arr], 
        activeIndices: active,
        line: 2,
        comparisons: stats.comparisons
      }

      while (j >= 0) {
        stats.comparisons++
        yield { 
          array: [...arr],
          activeIndices: [j, ...active],
          line: 3,
          comparisons: stats.comparisons
        }
        
        if (arr[j] > current) {
          arr[j + 1] = arr[j]
          j--
          yield { 
            array: [...arr],
            activeIndices: [j + 1, ...active],
            line: 4,
            comparisons: stats.comparisons
          }
        } else {
          break
        }
      }
      
      arr[j + 1] = current
      yield { 
        array: [...arr],
        activeIndices: [j + 1],
        line: 6,
        comparisons: stats.comparisons
      }
    }
    return arr
  }
}

export const binaryInsertion = {
  code: `function binaryInsertionSort(arr) {
  for (let i = 1; i < arr.length; i++) {
    let current = arr[i];
    let left = 0, right = i - 1;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      if (arr[mid] > current) {
        right = mid - 1;
      } else {
        left = mid + 1;
      }
    }
    for (let j = i - 1; j >= left; j--) {
      arr[j + 1] = arr[j];
    }
    arr[left] = current;
  }
  return arr;
}`,

  async *sort(arr, stats) {
    for (let i = 1; i < arr.length; i++) {
      const current = arr[i]
      let left = 0, right = i - 1
      
      yield {
        array: [...arr],
        activeIndices: [i],
        currentValue: current,
        line: 2,
        comparisons: stats.comparisons
      }

      while (left <= right) {
        const mid = Math.floor((left + right) / 2)
        stats.comparisons++
        
        yield {
          array: [...arr],
          activeIndices: [mid],
          leftBound: left,
          rightBound: right,
          midIndex: mid,
          currentValue: current,
          line: 5,
          comparisons: stats.comparisons
        }
        
        if (arr[mid] > current) {
          right = mid - 1
        } else {
          left = mid + 1
        }

        yield {
          array: [...arr],
          leftBound: left,
          rightBound: right,
          currentValue: current,
          line: 5,
          comparisons: stats.comparisons
        }
      }

      for (let j = i - 1; j >= left; j--) {
        arr[j + 1] = arr[j]
        yield {
          array: [...arr],
          activeIndices: [j, j + 1],
          currentValue: current,
          line: 10,
          comparisons: stats.comparisons
        }
      }

      arr[left] = current
      yield {
        array: [...arr],
        activeIndices: [left],
        currentValue: null,
        line: 12,
        comparisons: stats.comparisons
      }
    }
    return arr
  }
}

export const linkedListInsertion = {
  code: `class Node {
  constructor(value) {
    this.value = value;
    this.next = null;
  }
}

function linkedInsertionSort(arr) {
  let head = new Node(arr[0]);
  
  for (let i = 1; i < arr.length; i++) {
    const newNode = new Node(arr[i]);
    let current = head;
    let prev = null;
    
    // 寻找插入位置
    while (current && current.value < newNode.value) {
      prev = current;
      current = current.next;
    }
    
    // 插入新节点
    if (!prev) {
      newNode.next = head;
      head = newNode;
    } else {
      prev.next = newNode;
      newNode.next = current;
    }
  }
  
  // 转换回数组
  const sorted = [];
  while (head) {
    sorted.push(head.value);
    head = head.next;
  }
  return sorted;
}`,

  async *sort(arr, stats) {
    // 初始化链表
    let head = { value: arr[0], next: null }
    let nodes = [head]
    yield this.createState(head, nodes, 0, stats)

    for (let i = 1; i < arr.length; i++) {
      const newNode = { value: arr[i], next: null }
      let current = head
      let prev = null
      let pos = 0

      // 可视化当前处理的新节点
      yield this.createState(head, nodes, i, stats, {
        newNode,
        current,
        prev
      })

      // 寻找插入位置
      while (current && current.value < newNode.value) {
        stats.comparisons++
        prev = current
        current = current.next
        pos++
        
        yield this.createState(head, nodes, i, stats, {
          newNode,
          current,
          prev,
          comparing: true
        })
      }

      // 执行插入
      if (!prev) {
        newNode.next = head
        head = newNode
      } else {
        prev.next = newNode
        newNode.next = current
      }
      nodes.splice(pos, 0, newNode)
      
      yield this.createState(head, nodes, i, stats, {
        inserted: true
      })
    }

    // 转换回数组
    const sorted = []
    current = head
    while (current) {
      sorted.push(current.value)
      current = current.next
    }
    return sorted
  },

  createState(head, nodes, step, stats, extras = {}) {
    return {
      array: nodes.map(n => n.value),
      nodes: nodes.map((node, index) => ({
        value: node.value,
        active: extras.current === node || 
               extras.newNode === node ||
               extras.prev === node
      })),
      line: extras.comparing ? 12 : 
           extras.inserted ? 18 : 6,
      comparisons: stats.comparisons
    }
  }
}


export const shellSort = {
  code: `function shellSort(arr) {
  let gap = Math.floor(arr.length / 2);
  while (gap > 0) {
    for (let i = gap; i < arr.length; i++) {
      const temp = arr[i];
      let j = i;
      while (j >= gap && arr[j - gap] > temp) {
        arr[j] = arr[j - gap];
        j -= gap;
      }
      arr[j] = temp;
    }
    gap = Math.floor(gap / 2);
  }
  return arr;
}`,

  async *sort(arr, stats) {
    let gap = Math.floor(arr.length / 2)
    while (gap > 0) {
      for (let i = gap; i < arr.length; i++) {
        const temp = arr[i]
        let j = i
        
        yield {
          array: [...arr],
          activeIndices: [i],
          line: 4,
          comparisons: stats.comparisons
        }

        while (j >= gap) {
          stats.comparisons++
          yield {
            array: [...arr],
            activeIndices: [j, j - gap],
            line: 5,
            comparisons: stats.comparisons
          }
          
          if (arr[j - gap] > temp) {
            arr[j] = arr[j - gap]
            j -= gap
            yield {
              array: [...arr],
              activeIndices: [j, j + gap],
              line: 6,
              comparisons: stats.comparisons
            }
          } else {
            break
          }
        }
        arr[j] = temp
        yield {
          array: [...arr],
          activeIndices: [j],
          line: 8,
          comparisons: stats.comparisons
        }
      }
      gap = Math.floor(gap / 2)
    }
    return arr
  }
}