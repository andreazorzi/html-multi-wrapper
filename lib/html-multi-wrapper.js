'use babel';

// import HtmlMultiWrapperView from './html-multi-wrapper-view';
import { CompositeDisposable } from 'atom';

export default {

  subscriptions: null,

  activate(state) {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'html-multi-wrapper:wrap': () => this.wrap()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  wrap() {
    let editor
    if (editor = atom.workspace.getActiveTextEditor()) {
        var arra = editor.getSelectedBufferRanges();
        
        arra.sort(function(a, b) {
            if(a.end.row != b.end.row){
                if(a.end.row > b.end.row){
                    return -1
                }
                else{
                    return 1
                }
            }
            else
                if(a.end.column != b.end.column){
                    if(a.end.column > b.end.column){
                        return -1
                    }
                    else{
                        return 1
                    }
                }
                else{
                    return 0
                }
        });
        
        for(var i = 0; i < arra.length; i++){
            var range = arra[i];
            editor.setSelectedBufferRange(range);
            console.log(editor.getSelectedText());
            selectedText = editor.getSelectedBufferRange()
            if(!(selectedText.end.column == selectedText.start.column && selectedText.end.row == selectedText.start.row)){
                editor.backspace()
            }
            editor.selectToBeginningOfLine()
            tab = editor.getSelectedBufferRange()
            console.log(tab)
            if(!(selectedText.end.column == selectedText.start.column && selectedText.end.row == selectedText.start.row)){
                editor.undo()
            }
            tab = Array((tab.end.column - tab.start.column) + 1).join(" ")
            editor.setSelectedBufferRange(selectedText)
            editor.indentSelectedRows()
            textindent = editor.getSelectedText()
            editor.undo()
            editor.insertText("<div>\n"+tab+"    "+textindent+"\n"+tab+"</div>")
            selectedText.start.row += 1
            selectedText.start.column += 4
            selectedText.end.row += 1
            selectedText.end.column += 4
            editor.setSelectedBufferRange(selectedText)
        }
        
        console.log(arra);
    }
  }

};
