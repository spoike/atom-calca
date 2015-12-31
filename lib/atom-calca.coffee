{CompositeDisposable} = require 'atom'
CalcaEditor = require './CalcaEditor'

module.exports = OpenCalca =
  subscriptions: null

  activate: (state) ->
    # Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    @subscriptions = new CompositeDisposable

    # Register command that toggles this view
    #@subscriptions.add atom.commands.add 'atom-workspace', 'open-calca:toggle': => @toggle()
    @subscriptions.add atom.workspace.observeTextEditors (editor) => @observe(editor)

  deactivate: ->
    @subscriptions.dispose()

  serialize: ->

  observe: (editor) ->
    grammar = editor.getGrammar()
    if grammar.scopeName is "source.calca"
      @subscriptions.add new CalcaEditor(editor)
