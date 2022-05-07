// 测试回调函数和闭包的垃圾回收机制

class GcTest extends EventTarget {
  play() {
    this.dispatchEvent(new Event('play'));
  }

  create() {
    console.log(this);
  }
}
