let boldHandler = (el) => {
    if (el[0] == "*" && el[1] == "*" && el[el.length - 1] == "*" && el[el.length - 2] == "*") {
        return `<b>${ el.substr(2, el.length - 4) }</b>`;
    } else {
        return el;
    }
}
let warningHandler = (el) => {
    if (el[0] == "!" && el[el.length - 1] == "!") {
        return `<mark>${ el.substr(1, el.length - 2) }</mark>`;
    } else {
        return el;
    }
}

let formatText = (string)  => {
    for (let i = 0; i < string.length; i++) {
        
        string = string.replace(/(!)(.+)(!)/g, (match, p1, p2, p3) => {
            return `<mark>${p2}</mark>`;
        });
        var newString = string.replace(/(\*)(.+)(\*)/g, (match, p1, p2, p3) => {
            return `<b>${p2}</b>`;
        });

    }
    return newString
}


function editArticle() {
   
}


let editArticleBeta = (text, oldStrArray, setStrArray) => {
    let newStrArray = text.split("\n\n");
    console.log(oldStrArray);
    console.log(newStrArray);

    for (let i = 0; i < newStrArray.length; i++) {
        let oldStrLength;
        if (oldStrArray[i] === undefined) {
            oldStrLength = 0;
        } else {
            oldStrLength = oldStrArray[i].length;
        }
        
        if (newStrArray[i].length != oldStrLength) {
            console.log("change", i);
            
            setStrArray(newStrArray);
            for (let j = 0; j < newStrArray[i].length; j++) {
                if (newStrArray[i][j] == "\n") {
                    newStrArray[i] = newStrArray[i].replace("\n", " ");
                }
                   
                let splitedStr = newStrArray[i].split(" ");
                
                //pass text handlers here
                splitedStr = splitedStr.map(boldHandler);
                splitedStr = splitedStr.map(warningHandler);
                
                newStrArray[i] = splitedStr.join(" ");
            }

            let content = "";
            for(let i = 0; i < newStrArray.length; i++) {
                content = content + `<p>${newStrArray[i]}</p>`;
            }

            return content;
        }
    }
}

let processInputData = (text, isOneParagraph) => {
    let newStrArray = text.split("\n");
    
    let lable;   
    console.time(lable);

    for (let i = 0; i < newStrArray.length; i++) {
        for (let j = 0; j < newStrArray[i].length; j++) {
            if (newStrArray[i][j] == "\n") {
                newStrArray[i] = newStrArray[i].replace("\n", " ");
            }
                
            let splitedStr = newStrArray[i].split(" ");

            //pass text handlers here
            splitedStr = splitedStr.map(boldHandler);
            splitedStr = splitedStr.map(warningHandler);

            newStrArray[i] = splitedStr.join(" ");
        }
    }
    console.timeEnd();
    if (isOneParagraph) {
        return `<p>${newStrArray[0]}</p>`;
    }

    let content = "";
    for(let i = 0; i < newStrArray.length; i++) {
        content = content + `<p>${newStrArray[i]}</p>`;
    }
    return content;
}

module.exports.formatText = formatText;
module.exports.processInputData = processInputData;
module.exports.editText = editArticle;
module.exports.boldHandler = boldHandler;