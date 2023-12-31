
import React, { useEffect, useRef } from 'react'
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/dracula.css'
import 'codemirror/mode/javascript/javascript'
import 'codemirror/addon/edit/closetag'
import 'codemirror/addon/edit/closebrackets'
import ACTIONS from '../Action';

const Editor = ({ socketRef, roomId, onCodeChange }) => {

    const editorRef = useRef(null);

    useEffect(() => {
        async function init() {
            //The CodeMirror.fromTextArea method provides another way to initialize an editor. It takes a textarea DOM node as first argument and an optional configuration object as second.
            editorRef.current = Codemirror.fromTextArea(document.getElementById('realTimeEditor'), {
                mode: { name: 'javascript', json: true },
                theme: 'dracula',
                autoCloseTags: true,
                autoCloseBrackets: true,
                lineNumbers: true,

            });

            editorRef.current.on('change', (instance, changes) => {
                console.log('changes', changes);
                const { origin } = changes;
                const code = instance.getValue();

                onCodeChange(code)

                if (origin !== 'setValue') {
                    socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                        roomId,
                        code,
                    })
                }

                console.log(code);
            });



        }
        init();
    }, []);

    useEffect(() => {

        if (socketRef.current) {
            socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {

                if (code !== null) {
                    editorRef.current.setValue(code);
                }
            })
        }

        return () => {
            socketRef.current.off(ACTIONS.CODE_CHANGE)
        }

    }, [socketRef.current])


    return (
        <textarea id='realTimeEditor'></textarea>
    )
}

export default Editor