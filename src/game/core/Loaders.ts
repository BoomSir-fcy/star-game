import { Loader, LoaderResource } from '@pixi/loaders';
import { spines } from 'game/effectConfig';

interface LoadItem {
  name: string;
  src: string;
}
class Loaders extends EventTarget {
  loader = new Loader();

  loaded = false;

  loading = false;

  static progressEvent = new ProgressEvent('progress');

  load(items: LoadItem[]) {
    if (this.loading) {
      return;
    }
    if (this.loaded) {
      this.dispatchEvent(new Event('complete'));
      return;
    }
    this.loading = true;
    items.forEach(item => {
      this.loader.add(item.name, item.src);
    });
    this.loader.onProgress.add(_loader => {
      this.dispatchEvent(
        new ProgressEvent('progress', { loaded: _loader.progress, total: 100 }),
      );
    });
    this.loader.onComplete.add(_loader => {
      this.loaded = true;
      this.loading = false;
      this.dispatchEvent(new Event('complete'));
    });
    this.loader.load();
  }

  async loadSpineAll() {
    this.load(spines);
  }
}
const loaders = new Loaders();

export default loaders;
