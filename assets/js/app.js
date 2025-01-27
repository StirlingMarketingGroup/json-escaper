'use strict';

var src, dst;

var err;

require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.23.0/min/vs' }});
require(['vs/editor/editor.main'], function() {
    monaco.editor.defineTheme('error', {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'custom-error', foreground: 'ff0000' },
        ]
    });

    src = monaco.editor.create(document.getElementById('src'), {
        value: example,
        language: 'text',
        theme: 'error',
        minimap: {
            enabled: false
        }
    });
    src.onDidFocusEditorText(() => setTimeout(() => src.setSelection(src.getModel().getFullModelRange()), 100));

    // Register a new language
    monaco.languages.register({ id: 'error' });

    // Register a tokens provider for the language
    monaco.languages.setMonarchTokensProvider('error', {
        tokenizer: {
            root: [
                [/.*/, "custom-error"],
            ]
        }
    });

    dst = monaco.editor.create(document.getElementById('dst'), {
        value: '',
        language: 'json',
        theme: 'error',
        minimap: {
            enabled: false
        },
        readOnly: true
    });
    dst.onDidFocusEditorText(() => setTimeout(() => dst.setSelection(dst.getModel().getFullModelRange()), 100));

    let settingSrc = false;
    let settingDst = false;

    src.getModel().onDidChangeContent(() => {
        if (settingSrc) return;
        settingDst = true;
        dst.getModel().setValue(JSON.stringify(src.getModel().getValue()));
        settingDst = false;
    });

    dst.getModel().onDidChangeContent(() => {
        if (settingDst) return;
        settingSrc = true;
        try {
            monaco.editor.setModelLanguage(src.getModel(), "text");
            src.getModel().setValue(ts);
        } catch (e) {
            monaco.editor.setModelLanguage(src.getModel(), "error")
            src.getModel().setValue(err);
        }
        settingSrc = false;
    });
});