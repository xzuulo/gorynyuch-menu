const receiptList = document.querySelector(".receipt-list")
const totalSumElement = document.querySelector(".total-sum")

let selectedDish = null
let dishCost = 0
let addsCost = 0
let dishAdds = []
let receiptCost = 0
let receiptObjects = []

document.querySelector(".menu").addEventListener("click",(e)=>{
    const target=e.target.closest(".dish")
    if(target==null) return
    if(selectedDish!=target && selectedDish!=null){
        reset()
    }
    selectedDish = target
    selectedDish.setAttribute("class","dish selected")
    dishCost=+selectedDish.getAttribute("cost")
})
document.querySelector(".menu").addEventListener("click",(e)=>{
    const add = e.target.closest(".add")
    if(add==null) return
    if( add.getAttribute("class")=="add selectedAdd"){
        add.setAttribute("class","add")
        dishAdds.splice(dishAdds.indexOf(add),1)
        console.log("-"+add.getAttribute("cost")+" к цене блюда")
        addsCost-=+add.getAttribute("cost")
        return
    }
    
    add.setAttribute("class","add selectedAdd")
    addsCost+= +add.getAttribute("cost")
    dishAdds.push(add)
})

document.querySelector(".submit").addEventListener("click",(e)=>{
    if(selectedDish==null) return
    dishAdds.sort((a,b)=> a.getAttribute("addNameRU").localeCompare(b.getAttribute("addNameRU")))
    let addsText = ""
    let addsClass = ''
    for (let i = 0; i < dishAdds.length; i++) {
        addsClass+=dishAdds[i].getAttribute("addNameRU")
    }

    let receiptObject = document.createElement("div")
    receiptObject.setAttribute("count","1")
    let already_created = false
    let count = 1

    if(receiptObjects.length>0){
        for (let i = 0; i < receiptObjects.length; i++) {
            if(receiptObjects[i].getAttribute("dishName") === selectedDish.getAttribute("dishName") && receiptObjects[i].getAttribute("adds") === addsClass){
                receiptObject = receiptObjects[i]
                count = +receiptObject.getAttribute("count")+1
                receiptObject.setAttribute("count",count)
                already_created = true
            }
        }
    }
    receiptObject.setAttribute("class","receiptObject")
    receiptObject.setAttribute("dishName",`${selectedDish.getAttribute("dishName")}`)
    receiptObject.setAttribute("adds",`${addsClass}`)
    
    let absoluteCost = dishCost + addsCost
    receiptObject.setAttribute("singleCost", absoluteCost)

    create_receipt(receiptObject,count,selectedDish,dishCost,dishAdds)

    if(!already_created){
        receiptList.appendChild(receiptObject)
        receiptObjects.push(receiptObject)
    }
    
    update_total()
    reset()
})

function change_count(buttonElement, operation){
    const receiptObject = buttonElement.closest(".receiptObject")
    let count = +receiptObject.getAttribute("count")
    let singleCost = +receiptObject.getAttribute("singleCost")

    if (operation === "delete") {
        count = 0
    } else {
        count = count + operation
    }

    if (count <= 0) {
        receiptObjects.splice(receiptObjects.indexOf(receiptObject), 1)
        receiptObject.remove()
    } else {
        receiptObject.setAttribute("count", count)
        
        const countSpan = receiptObject.querySelector(".count-num")
        const costSpan = receiptObject.querySelector(".cost-num")
        
        countSpan.textContent = count
        costSpan.textContent = singleCost * count + "р."

    update_total()
    }
}

function create_receipt(receiptObject,count,selectedDish,dishCost,dishAdds){
    let addsText = ""
    for (let i = 0; i < dishAdds.length; i++) {
        addsText+=`--- ${dishAdds[i].getAttribute("addNameRU")} - +${dishAdds[i].getAttribute("cost")}р. <br>`
    }

    let singleCost = dishCost + addsCost
    let totalDishCost = singleCost * count

    receiptObject.innerHTML=`<span>${selectedDish.getAttribute("dishNameRU")} <span class='knopka' onclick='change_count(this, -1)'>(-)</span><span class='count-num'>${count}</span><span class='knopka' onclick='change_count(this, 1)'>(+)</span>  - <span class='cost-num'>${totalDishCost}р.</span> <span class='knopka' onclick='change_count(this, "delete")'>[X]</span></span><br>`+addsText+"<br>"
}

function update_total(){
    let sum = 0
    for (let i = 0; i < receiptObjects.length; i++) {
        let count = +receiptObjects[i].getAttribute("count")
        let singleCost = +receiptObjects[i].getAttribute("singleCost")
        sum += singleCost * count
    }
    totalSumElement.innerHTML = `<h3>Итого: ${sum}р.</h3>`
}

function reset(){
    if (selectedDish != null) {
        selectedDish.setAttribute("class","dish")
    }
    for (let i = 0; i < dishAdds.length; i++) {
        dishAdds[i].setAttribute("class","add")
    }
    dishAdds=[]
    dishCost=0
    addsCost=0
    selectedDish = null
}
