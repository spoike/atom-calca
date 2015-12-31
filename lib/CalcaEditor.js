'use babel';

import { CompositeDisposable } from 'atom';
import { debounce } from 'lodash';
import { parse } from './parser';

export default class CalcaEditor {
  constructor (editor) {
    if (typeof editor !== 'object' || typeof editor.markBufferRange !== 'function') {
      throw new Error('Given editor is not really an editor');
    }

    this.editor = editor;
    this.subscriptions = new CompositeDisposable();

    this.subscriptions.add(this.editor.onDidDestroy( () => this.dispose() ));
    this.subscriptions.add(this.editor.onDidChange(debounce(() => {
      this.parse();
    }, 600)))
  }

  parse () {
    parse(this.editor);
  }

  dispose () {
    this.subscriptions.dispose();
  }
}
