let formatText = (string)  => {
    console.log(string);

    string = string.replace(/(!)(\S+?)(!)/g, (match, p1, p2, p3) => {
        return `<mark>${p2}</mark>`;
    });
    string = string.replace(/(\*)(\S+?)(\*)/g, (match, p1, p2, p3) => {
        return `<b>${p2}</b>`;
    });
    string = string.replace(/^\s{3}\S+$/g, (match, p1, p2, p3) => {
        return `<span>* ${p2}</span>`;
    })
    return string;
}   

function findAffectedRow(oldArr, newArr) {
    for (let i = 0; i < oldArr.length; i++) {
        switch(i) {
            case 0:
                if (oldArr[i] != newArr[i]) {
                    return 0;
                }
                break;
                
            default:
                if (oldArr[i] != newArr[i]) {
                    return i;
                    break;
                } 
                break;
        }
    }
}

let normalizeNameForP = () => {
    let pTags = document.getElementsByClassName("output_p");
    for (let i = 0; i < pTags.length; i++) {    
        pTags[i].attributes[0].value = i;
    }
};

let oldStringArray = [];
let formHandler = (event) => {
    let titleOutput = document.getElementById("titleOut");
    let textOutput = document.getElementById("textOut");
    
    if (event.target.name == "title") {
        titleOutput.innerHTML = event.target.value;

    } else if (event.target.name == "text") {
        let inputText = event.target.value;
        let splitedText = inputText.split("\n");

        if (oldStringArray.length >= 1) {         
            //if input ENTER     
            if (splitedText.length > oldStringArray.length) {
                let pIndexForAdd = findAffectedRow(splitedText, oldStringArray);
                let pBefore = document.querySelector(`p[data_id="${pIndexForAdd - 1}"]`);
                if (!pBefore) {
                    textOutput.insertAdjacentHTML("afterbegin", `<p data_id="${pIndexForAdd}" class="output_p"></p>`);
                } else {
                    pBefore.insertAdjacentHTML("afterend", `<p data_id="${pIndexForAdd}" class="output_p"></p>`);
                }
                

            } else if (splitedText.length < oldStringArray.length) {
                //if paragrapth(s) deleted
                let countPForDelete = oldStringArray.length - splitedText.length;
                let pIndexForDelete = findAffectedRow(oldStringArray, splitedText);
                let pTags = document.getElementsByClassName(`output_p`);
                let nextPTagIndex = pIndexForDelete + countPForDelete;
                let changedPId = pTags[nextPTagIndex].getAttribute("data_id");
                let changedP = document.querySelector(`p[data_id="${changedPId}"]`);
                changedP.innerHTML = splitedText[0];
                for (let i = 0; i < countPForDelete; i++) {
                    pTags[pIndexForDelete].remove();
                }

            
            } else if (splitedText.length == oldStringArray.length) {
                //if only paragrapth value changed
                for (let i = 0; i < splitedText.length; i++) {
                    if (splitedText[i] != oldStringArray[i]) {
                        let formatedText = formatText(splitedText[i]);    
                        let pTags = document.getElementsByTagName("p");
                        pTags[i].innerHTML = formatedText === undefined ? "" : formatedText;
                    }
                }
            }
            normalizeNameForP();
            oldStringArray = splitedText;

        } else {
            let pTags = "";
            for (let i = 0; i < splitedText.length; i++) {
                pTags += `<p data_id="${i}" class="output_p"></p>`;
            }
            textOutput.innerHTML = pTags;

            for (let i = 0; i < splitedText.length; i++) {
                let dataToP = formatText(splitedText[i]);
                let p = document.querySelector(`p[data_id="${i}"]`);
                p.innerHTML = dataToP;
            }
            oldStringArray = splitedText;
        }

    }
};

let processInputData = (text, isOneParagraph) => {
    let newStrArray = text.split("\n");
    
    let lable;   
    console.time(lable);

    for (let i = 0; i < newStrArray.length; i++) {
        newStrArray[i] = formatText(newStrArray[i]);
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

module.exports.formHandler = formHandler;
module.exports.findAffectedRow = findAffectedRow;
module.exports.processInputData = processInputData;