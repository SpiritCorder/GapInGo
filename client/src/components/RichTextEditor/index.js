import {useState, useEffect} from 'react';
import { Editor } from 'react-draft-wysiwyg';
import { EditorState, convertToRaw, convertFromRaw, convertFromHTML, ContentState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
// import htmlToDraft from 'html-to-draftjs';
import {stateToHTML} from 'draft-js-export-html';

// import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import "../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import './styles/richTextEditor.css';


const RichTextEditor = ({updateDetailedDescription, detailedDescription}) => {

    // const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const [editorState, setEditorState] = useState(EditorState.createEmpty());

    useEffect(() => {
        const blocksFromHTML = htmlToDraft(detailedDescription);
        // const blocksFromHTML = convertFromHTML(rowHtml);
    
        const initState = ContentState.createFromBlockArray(
            blocksFromHTML.contentBlocks,
            blocksFromHTML.entityMap,
        );

        setEditorState(EditorState.createWithContent(initState))
    
    }, [detailedDescription])

    const onEditorStateChange = (eS) => {
        setEditorState(eS);
    }

    const uploadImageCallBack = async (file) => {

        const baseUrl = URL.createObjectURL(file);
        console.log(baseUrl);

        return {
            data: {
                link: baseUrl
            }
        }

        // d4b90ccef161bf0
        // const data = new FormData();

        // data.append('image', file);

        // try {

        //     const res = await fetch('https://api.imgur.com/3/image', {
        //         method: 'POST',
        //         headers: {
        //             'Authorization': 'd4b90ccef161bf0',
        //             'Content-Type': 'multipart/form-data'
        //         },
        //         body: data
        //     })

        //     const result = await res.json();
        //     return result;
        // } catch(err) {
        //     console.log(err);
        // }

        // new Promise(
        //     (resolve, reject) => {
        //       const xhr = new XMLHttpRequest();
        //       xhr.open('POST', 'https://api.imgur.com/3/image');
        //       xhr.setRequestHeader('Authorization', 'Client-ID d4b90ccef161bf0');
        //       const data = new FormData();
        //       data.append('image', file);
        //       xhr.send(data);
        //       xhr.addEventListener('load', () => {
        //         const response = JSON.parse(xhr.responseText);
        //         console.log(response)
        //         resolve(response);
        //       });
        //       xhr.addEventListener('error', () => {
        //         const error = JSON.parse(xhr.responseText);
        //         console.log(error)
        //         reject(error);
        //       });
        //     }
        //   )
        //   .then((response) => ({...response, data: {...response.data, link: "http://localhost:3000/images/airpods.jpg"}}))
        //   .catch(err => ({...err, data: {...err.data, link: "http://localhost:3000/images/airpods.jpg"}}))
    }

    return (
        <>
            <Editor
                editorState={editorState}
                
                wrapperClassName="demo-wrapper"
                editorClassName="demo-editor"
                onEditorStateChange={onEditorStateChange}
                toolbar={{
                    
                    image: {
                        uploadEnabled: true,
                        uploadCallback: uploadImageCallBack,
                        previewImage: true,
                    //   alt: { present: true, mandatory: false },
                        inputAccept: 'image/gif,image/jpeg,image/jpg,image/png,image/svg',
                        alt: { present: true, mandatory: true },
                        defaultSize: {
                            height: 'auto',
                            width: 'auto',
                        }
                    },
                }}
            />
            <div className='mt-3 save-description-btn'>
                <button type="button" className='btn rounded-pill' onClick={() => {
                    const output = draftToHtml(convertToRaw(editorState.getCurrentContent()));
                    //const output = convertToRaw(editorState.getCurrentContent());
                    //const outputHTML = convertFromRaw(output);
                    //const outputHTML = stateToHTML(editorState.getCurrentContent())
                    console.log(output);
                    
                    updateDetailedDescription(output)
                }}>Done</button>
            </div>
        </>
    );
}

export default RichTextEditor;