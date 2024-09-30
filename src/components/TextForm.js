import React, { useState } from 'react';

export default function TextForm(props) {

    const [text, setText] = useState("");

    let writeText = (event) => {
        setText(event.target.value);
    };


    let toUpperCase = () => {
        setText(text.toUpperCase());
    }

    let toLowerCase = () => {
        setText(text.toLowerCase());
    }

    let calculateWords = () => {
        if (text === "" || text === null) {
            return 0;
        }
        let wordLenth = text.split(" ").length;
        if (text.charAt(text.length - 1) === " ") {
            return wordLenth - 1;
        }
        return wordLenth;
    }

    return (
        <>
            <div className="container">
                <span>{props.heading}</span>
                <div className="form-group">
                    <textarea className="form-control" value={text} onChange={writeText} rows="8" placeholder='Start typing...'></textarea>
                </div>
                <br />
                <div className='btns my-1'>
                    <button className="btn-upperCase" onClick={toUpperCase}>To Upper</button>
                    <button className="btn-lowerCase ms-2" onClick={toLowerCase}>To Lower</button>
                </div>
            </div>
            <div className="container my-4">
                <h4>Your Typing Summery:</h4>
                <span>Words: {calculateWords}</span> <br />
                <span>Characters: {text.length}</span>
                <h4>Preview:</h4>
                <span>{text}</span>
            </div>
        </>
    )
}