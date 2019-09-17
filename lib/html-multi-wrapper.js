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
        
        var addedRow = 0;
        var addedRow2 = arra.length * 2;
        var newSelection = [];
        
        for(var i = 0; i < arra.length; i++){
            var range = arra[i];
            editor.setSelectedBufferRange(range);
            selectedText = editor.getSelectedBufferRange();
            tab = Array(selectedText.start.column + 1).join(" ");
            textindent = editor.getSelectedText();
            console.log(textindent);
            editor.insertText("<div>\n"+tab+"    "+textindent+"\n"+tab+"</div>");
            
            newSelection.push([
                [range.start.row + addedRow2 - 1, range.start.column + 4],
                [range.end.row + addedRow2 - 1, range.end.column + 4]
            ]);
            
            addedRow += 2;
            addedRow2 -= 2;
        }
        
        var lastSelection = [
            [arra[arra.length-1].start.row, arra[arra.length-1].start.column],
            [arra[0].end.row + addedRow, arra[0].end.column + 5]
        ];
        
        editor.setSelectedBufferRange(lastSelection);
        var changed = editor.getSelectedText();
        
        for(var i = 0; i < arra.length; i++){
            editor.undo()
        }
        
        lastSelection = [
            [arra[arra.length-1].start.row, arra[arra.length-1].start.column],
            [arra[0].end.row, arra[0].end.column]
        ];
        
        editor.setSelectedBufferRange(lastSelection)
        editor.insertText(changed);
        editor.setSelectedBufferRanges(newSelection)
    }
  }

};
