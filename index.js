const addBtn = document.querySelector(".addBtn");
const checkBtns = document.querySelectorAll(".checkBtn");
const delBtns = document.querySelectorAll(".delBtn");
const textInput = document.querySelector("input[type='text']");
const taskContainerList = document.querySelector(".taskContList");
const userFilter = document.querySelectorAll("input[name='filter']");
// console.log(taskContainerList.childNodes)
for (const radioBtn of userFilter){
    radioBtn.addEventListener("change",(e)=>{
        const userFilterVal = document.querySelector("input[name='filter']:checked").value;
        // console.log(userFilterVal);
        for (const taskDiv of taskContainerList.childNodes){
            switch(userFilterVal){
                case "All" :
                    taskDiv.style.display = "flex";
                    break
                
                case "completed" :
                    if (taskDiv.children[0].classList.contains("checkBtn-click")){
                        taskDiv.style.display = "flex";
                    }
                    else{
                        taskDiv.style.display = "none";
                    }
                    break
                
                case "pending" :
                    if (!taskDiv.children[0].classList.contains("checkBtn-click")){
                        taskDiv.style.display = "flex";
                    }
                    else{
                        taskDiv.style.display = "none";
                    }
                    break
            }
        }
    })
}

// Functions

// Function to add event listener to check btns
function checkBtnEventAdd(checkBtn){
    checkBtn.addEventListener("click", (e)=>{
        const tasktext = checkBtn.parentElement.children[1];
        const taskList = JSON.parse(localStorage.getItem("taskList"));
        checkBtn.classList.toggle("checkBtn-click");
        checkBtn.children[0].classList.toggle("display-none"); 
        tasktext.classList.toggle("text-line-through");
        let status = taskList.filter(taskObj => taskObj["taskText"] === tasktext.innerHTML)[0]["status"];
        status = (status === "pending" ? "completed" : "pending");
        taskList[taskList.indexOf(taskList.filter(taskObj => taskObj["taskText"] === tasktext.innerHTML)[0])]["status"] = status;
        localStorage.setItem("taskList", JSON.stringify(taskList));
    })
}

// Function to add event listener to delete btns
function delBtnEventAdd(delBtn){
    delBtn.addEventListener("click", (e)=>{
        // Code to execute after the delete button is clicked
        // console.log(delBtn.parentElement)
        delBtn.parentElement.classList.add("deleteAnimation");
        setTimeout(()=>{
            delBtn.parentElement.classList.add("display-none");
            const taskToDel = delBtn.parentElement.children[1].innerHTML;
            removeItemFromStorage(taskToDel, delBtn.parentElement);
        }, 1000)
    })
}


function createAndAddTask(userInput, status){
    const taskClass = (status === "pending" ? "display-none" : "");
    const textDecorClass = (status === "completed" ? "text-line-through" : "");

    const newTaskCont = document.createElement("div");
    newTaskCont.classList.add("taskContainer", "flex-group", "designed-row");

    const newCheckBtn = document.createElement("button");
    newCheckBtn.classList.add("checkBtn");
    if (status === "completed"){
        newCheckBtn.classList.add("checkBtn-click")
    }
    newCheckBtn.type = "submit";
    newCheckBtn.innerHTML = `<img src="images/icon-check.svg" alt="Check Button" class=${taskClass}>`;
    checkBtnEventAdd(newCheckBtn);
    newTaskCont.appendChild(newCheckBtn);

    const newTaskText = document.createElement("div");
    newTaskText.classList.add("taskText");
    if (textDecorClass !== ""){
        newTaskText.classList.add(textDecorClass);
    }
    newTaskText.innerText = userInput;

    newTaskCont.appendChild(newTaskText);

    const newDelBtn = document.createElement("button");
    newDelBtn.classList.add("delBtn");
    newDelBtn.innerHTML = `<img src="images/icon-cross.svg" alt="Delete Button">`;
    delBtnEventAdd(newDelBtn);
    newTaskCont.appendChild(newDelBtn);

    return newTaskCont

}

function removeItemFromStorage(taskText, parentCont){
    const newTaskList = [];
    for (taskObj of JSON.parse(localStorage.getItem("taskList"))){
        if(taskObj["taskText"] !== taskText){
            newTaskList.push(taskObj);
        }
    }
    // const newTaskList = JSON.parse(localStorage.getItem("taskList")).filter(taskObj => taskObj["taskText"] !== taskObjDel["taskText"]);
    localStorage.setItem("taskList", JSON.stringify(newTaskList))
    // console.log(newTaskList)
}

//  Adding Event Listeners

document.addEventListener("DOMContentLoaded", ()=>{
    // localStorage.clear()
    const taskArray = (localStorage.getItem("taskList") === null ? [] : JSON.parse(localStorage.getItem("taskList")));
    if (taskArray !== []){
        taskArray.forEach((taskObj)=>{
            const task = taskObj["taskText"];
            const taskStatus = taskObj["status"];
            taskContainerList.appendChild(createAndAddTask(task, taskStatus));
        });
    }
})


addBtn.addEventListener("click", (e)=>{
    e.preventDefault();
    const userInput = textInput.value;
    // console.log(userInput)
    const newTaskObj = {
        taskText: userInput,
        status: "pending"
    }
    let newTaskArray = (localStorage.getItem("taskList") === null ? [newTaskObj] : JSON.parse(localStorage.getItem("taskList")));
    if (newTaskArray.indexOf(newTaskObj) === -1){
        newTaskArray.push(newTaskObj);
        localStorage.setItem("taskList", JSON.stringify(newTaskArray));
        const newTaskCont = createAndAddTask(userInput, newTaskObj["status"]);
        taskContainerList.appendChild(newTaskCont);
    }
    textInput.value = "";

})

Array.from(checkBtns).forEach((checkBtn)=>{
    checkBtnEventAdd(checkBtn);
})

Array.from(delBtns).forEach((delBtn)=>{
    delBtnEventAdd(delBtn);
})