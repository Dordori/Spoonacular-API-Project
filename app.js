const container = document.querySelector('#container');
const right = document.querySelector('#right');
const center = document.querySelector('#center');
const left = document.querySelector('#left');
const searchBar = document.querySelector('.search-bar');
const searchBarInput = document.querySelector('#search-input');


document.addEventListener('DOMContentLoaded',() => {
  const searchResult = localStorage.getItem('searchResult');
  const dishInfo = localStorage.getItem('dishInfo');
  const dishInfoTarget = localStorage.getItem('dishInfoTarget');
  if(searchResult){
  const parsedSearchResult = JSON.parse(searchResult);
  printSearchResult(parsedSearchResult);
  }
  if (dishInfo && dishInfoTarget) {
    const parsedDishInfo = JSON.parse(dishInfo);
    const parsedDishInfoTarget = JSON.parse(dishInfoTarget);
    onRecipeClick2(parsedDishInfo, parsedDishInfoTarget);
    loadFavoritesFromStorage();
  }
});

  document.addEventListener('DOMContentLoaded', () => {
        const tooltipContainer = document.querySelector('.tooltip-c');
        const tooltipMenu = document.querySelector('.tooltip-m');

        if (tooltipContainer && tooltipMenu) {
            tooltipContainer.addEventListener('mouseover', () => {
                tooltipMenu.style.visibility = 'visible';
                tooltipMenu.style.opacity = '1';
            });

            tooltipContainer.addEventListener('mouseout', () => {
                tooltipMenu.style.visibility = 'hidden';
                tooltipMenu.style.opacity = '0';
            });
        }
    });

searchBar.addEventListener('submit', onSearch)

function onSearch(e){
    e.preventDefault();
    if(searchBarInput.value){
        const url = 'https://api.spoonacular.com/recipes/complexSearch?apiKey=3fdfd75262a34189a3dfe28ae7b16820&query=';
        console.log(url)
        const query = searchBarInput.value;
        fetch(url+query)
        .then(r => r.json())
        .then(r => printSearchResult(r))
    }
}

function saveSearchResult(r){
    localStorage.setItem('searchResult', JSON.stringify(r));
}

function printSearchResult(responseObJ){
    saveSearchResult(responseObJ);
    let {results} = responseObJ;
    const div = document.createElement('div');
    div.className = 'recipe-container-all'
    for (let obj of results) {
        let {id, title, image} = obj;

        if (title.length >= 60){
            title = title.substr(0,57);
            title += '...';
        }


        const div1 = document.createElement('div');
        const img = document.createElement('img');
        const h2 = document.createElement('h2');
        h2.dataset.dishId = id;

        div1.className = 'recipe-container'
        img.className = 'recipe-img'

        div1.dataset.dishId = id;
        img.src = image;
        h2.innerText = title;

        img.style.height = '125px';
        img.style.width = '125px';
        img.style.borderRadius = '60px';
        img.dataset.dishId = id;

        div1.appendChild(img);
        div1.appendChild(h2);
        div.appendChild(div1);
        // fetchId(div1,id);
        div1.addEventListener('click', onRecipeClick1);
    }
    left.appendChild(div);
}

// function fetchId(target,id){
//     let url=`https://api.spoonacular.com/recipes/${id}/information?apiKey=3fdfd75262a34189a3dfe28ae7b16820&includeNutrition=false`;
//     fetch(url)
//     .then(r => r.json())
//     .then(r => idFetched(r,target));
// }
// function idFetched(r,t){
//     t.dataset.recipeInfo = r;
    
// }
function onRecipeClick1(e){
    let target = e.target;

    // if(!target.hasChildNodes() || target.tagName == 'A'){
    //     target = target.parentElement;
    // }
    let id = target.dataset.dishId;
    if(id){
        let url=`https://api.spoonacular.com/recipes/${id}/information?apiKey=3fdfd75262a34189a3dfe28ae7b16820&includeNutrition=false`;
        fetch(url)
        .then(r => r.json())
        .then(r => onRecipeClick2(r,target));
    } else {
        console.log('error 1220')
        return;
    }
}
function onRecipeClickSave(r,t){
    localStorage.setItem('dishInfo', JSON.stringify(r));
    localStorage.setItem('dishInfoTarget', JSON.stringify(t));
}

function onRecipeClick2(r,target){
    onRecipeClickSave(r,target);
    const previous = document.querySelector('.desc-container');
    if (previous) {
        previous.remove();
    }
    const lsTaste = localStorage.getItem('taste');
    if (lsTaste) {
        localStorage.removeItem('taste');
    }
        // console.log(target.tagName);
    // dishTypes = arr
    // summary = string
    // extendedIngredients = arr of obj
    
        // let r = target.dataset.recipeInfo;
        console.log(r,'1330');
        for (const key of Object.keys(r)) {
        console.log('response obj: ',`Key: ${key}, Value: ${r[key]}`);
        }
        let {id,title,image,servings,readyInMinutes,cookingMinutes,preparationMinutes,sourceName,sourceUrl,
        spoonacularSourceUrl,dishTypes,extendedIngredients,summary,creditsText,instructions} = r;

    const div = document.createElement('div');
    div.classList.add('desc-container');
    div.dataset.r = JSON.stringify(r,['id','title','image']);
    

            console.log(div.dataset.r,'2550')
    const img = document.createElement('img');
    img.src = image;
    img.style.height = '30%';
    img.style.width = '100%';
    div.appendChild(img);
    
    const h1 = document.createElement('h1');
    h1.innerText = 'Title: ' + title;
    div.appendChild(h1);

    const favoriteBtn = document.createElement('button');
    favoriteBtn.innerHTML = '<b>Add To Favorites</b>';
    favoriteBtn.classList.add('favorite-btn');
    div.appendChild(favoriteBtn);
    favoriteBtn.addEventListener('click', saveToFavorites);
    

    

    if (preparationMinutes) {
        const preparationMinutesSpan = document.createElement('span');
        preparationMinutesSpan.innerHTML = '<br><br><b>Preparation Minutes:</b> ' + preparationMinutes;
        div.appendChild(preparationMinutesSpan);
    }
    if (cookingMinutes) {
        const cookingMinutesSpan = document.createElement('span');
        cookingMinutesSpan.innerHTML = '<br><b>Cooking Minutes:</b> ' + cookingMinutes;
        div.appendChild(cookingMinutesSpan);
    }
    
    const readyInMinutesSpan = document.createElement('span');
    readyInMinutesSpan.innerHTML = '<br><b>Ready In Minutes:</b> ' + readyInMinutes;
    div.appendChild(readyInMinutesSpan);


    if(dishTypes){
    const dishTypesSpan = document.createElement('span');
    dishTypesSpan.innerHTML = '<br><b>Suggested Dish Types: </b>' + dishTypes.join(', ')+'<br><br>';
    div.appendChild(dishTypesSpan);
    }

        const servingsDiv = document.createElement('div');
    servingsDiv.classList.add('serving-div')
    const servingsSpan = document.createElement('p');
    servingsSpan.innerHTML = '<b>Servings:</b>';
    const servingsAmountDiv = document.createElement('div');
    servingsAmountDiv.classList.add('serving-amount-div')
    servingsAmountDiv.innerHTML = servings;
    const servingPlus = document.createElement('button');
    servingPlus.innerHTML = '+';
    servingPlus.addEventListener('click', () => {
        const servings = document.querySelector('.serving-amount-div');
        const ingridientsAmounts = document.getElementsByClassName('amount-div');
        servings.innerHTML = parseFloat(servings.innerHTML)+1;
        for (let i of ingridientsAmounts) {
            i.innerText = parseFloat(i.innerText)+parseFloat(i.parentElement.dataset.ratio);
        }}
    )
    const servingsMinus = document.createElement('button');
    servingsMinus.innerText = '-';
    servingsMinus.addEventListener('click', () => {
        const servings = document.querySelector('.serving-amount-div');
        if (servings.innerHTML <= 1) {
            return;
        }
        const ingridientsAmounts = document.getElementsByClassName('amount-div');
        servings.innerHTML = parseFloat(servings.innerHTML)-1;
        for (let i of ingridientsAmounts) {
            i.innerText = parseFloat(i.innerText)-parseFloat(i.parentElement.dataset.ratio);
        }}
    )

    servingsDiv.appendChild(servingsSpan);
    servingsDiv.appendChild(servingsAmountDiv);
    servingsDiv.appendChild(servingPlus);
    servingsDiv.appendChild(servingsMinus);
    div.appendChild(servingsDiv);

    const ingridientsList = document.createElement('div');
    ingridientsList.classList.add('ingridients-list');
    ingridientsList.style = 'display: block';
    ingridientsList.style.padding = '2px';
    ingridientsList.style.margin = '2px';
    const ingridientsListTitle = document.createElement('h3');
    ingridientsListTitle.innerHTML = '<br><b>INGRIDIENTS:</b> <br>';
    ingridientsList.appendChild(ingridientsListTitle);
    // console.log(extendedIngredients)
    let ingridientsArrForCart = [];
    for(let obj of extendedIngredients){
        ingridientsArrForCart.push(JSON.stringify(obj,['name', 'amount', 'unit']))
        let {name, amount, unit} = obj;
        const ingridientList = document.createElement('div');
        ingridientList.classList.add('ingridient-list');
        ingridientList.dataset.originalAmount = parseFloat(amount);
        ingridientList.dataset.originalServings = parseFloat(servings);
        ingridientList.dataset.ratio = parseFloat(ingridientList.dataset.originalAmount / ingridientList.dataset.originalServings);
        const nameDiv = document.createElement('div');
        nameDiv.classList.add('name-div');
        nameDiv.innerText = name;
        const amountDiv = document.createElement('div');
        amountDiv.classList.add('amount-div');
        amountDiv.innerText = amount;
        const unitDiv = document.createElement('div');
        unitDiv.classList.add('unit-div');
        unitDiv.innerText = unit;
        ingridientList.appendChild(unitDiv);
        
        ingridientList.appendChild(amountDiv);
        ingridientList.appendChild(nameDiv);
        ingridientsList.appendChild(ingridientList);
    }
    div.appendChild(ingridientsList);
    div.dataset.ingridients = JSON.stringify(ingridientsArrForCart);

    const cartBtn = document.createElement('button');
    cartBtn.innerHTML = '<b>Add To Shopping List</b>';
    cartBtn.classList.add('cart-btn');
    div.appendChild(cartBtn);
    cartBtn.addEventListener('click', addToCart);

    const taste = document.createElement('div');
    taste.classList.add('taste-div');

    if(instructions){
    const instructionsSpan = document.createElement('span');
    instructionsSpan.innerHTML = '<br><b>Detailed Instructions:</b>'+instructions+'<br>';
    div.appendChild(instructionsSpan);
    }

    const summarySpan = document.createElement('span');
    summarySpan.innerHTML = '<b>SUMMARY: </b>'+summary+'<br>';
    div.appendChild(summarySpan);

        const sourceNameSpan = document.createElement('span');
    sourceNameSpan.innerHTML = '<br><b>source:</b> ' + sourceName + ''+ '<br><br>' ;
    div.appendChild(sourceNameSpan);

        const spoonacularSourceUrlA = document.createElement('a');
    spoonacularSourceUrlA.href = spoonacularSourceUrl;
    spoonacularSourceUrlA.innerHTML = 'FOR MORE INFO CLICK HERE<br><br><br><br>';
    div.appendChild(spoonacularSourceUrlA);
        

    center.appendChild(div);
    fetchTaste(id);
}

function saveToFavorites(){
    
        const dataContainer = document.querySelector('.desc-container');
        let r = dataContainer.dataset.r;
        if(!r){ return }
        let favorites = localStorage.getItem('favorites');
        let parsedFavorites = [];
        if (favorites) {
            parsedFavorites = JSON.parse(favorites);
        } 
        parsedFavorites.push(r);
        localStorage.setItem('favorites', JSON.stringify(parsedFavorites));
        loadFavoritesFromStorage();
}

function loadFavoritesFromStorage(){
    let favorites = localStorage.getItem('favorites');
    if(!favorites){return}
    const heartMenu = document.querySelector('#heart-menu');
    heartMenu.innerHTML = '';
    const div1 = document.createElement('div');
    div1.classList.add('fav-container');
    let paresedFavorites = JSON.parse(favorites);
    
    let x = 0;
    for (let JSONstr of paresedFavorites) {
        let parsedItem = JSON.parse(JSONstr);
        let {id,title,image} = parsedItem;

        if (title.length >= 20){
            title = title.substr(0,17);
            title += '...';
        }

        const div2 = document.createElement('div');
        div2.classList.add('fav-item');
        div2.dataset.dishId = id
        div2.dataset.id = x++;

        const img = document.createElement('img');
        img.src = image;
        img.style.width = '48%';
        img.style.height = '8%';
        img.className = 'fav-item-img'
        img.dataset.dishId = id

        const p = document.createElement('p');
        p.innerText = title;
        p.dataset.dishId = id;

        const deleteBtn = document.createElement('button');
        deleteBtn.innerText = 'delete';
        deleteBtn.addEventListener('click',deleteFromFavorites)

        let a = [img,p,deleteBtn];
        a.forEach((i)=>{div2.appendChild(i)});

        div1.addEventListener('click',onRecipeClick1)

        div1.appendChild(div2);
    }
    heartMenu.appendChild(div1);

}

function deleteFromFavorites(e){
    let t = e.target.parentElement;
    let id = t.dataset.id;
    console.log(t.tagName,id);
    const favorites = localStorage.getItem('favorites');
    let parsedFavorites = JSON.parse(favorites);
    parsedFavorites.splice(id,1);
    localStorage.setItem('favorites',JSON.stringify(parsedFavorites));
    t.remove();
    loadFavoritesFromStorage()
}

function addToCart(){
    const dataContainer = document.querySelector('.desc-container');
    const ingridients = dataContainer.dataset.ingridients; 
    console.log(ingridients.length)
    let pi = JSON.parse(ingridients);
    console.log(pi.length)
    for (const e of pi) {
        console.log(e)
    }
    const exist = document.querySelector('.cart');
    if(!exist){
        const cart = document.createElement('div');
        cart.classList.add('cart');
         for (const i of pi) {
        let p = JSON.parse(i);
        let {name, amount, unit} = p;
        const ingridientList = document.createElement('div');
        ingridientList.classList.add('cart-item-list');
        const nameDiv = document.createElement('div');
        nameDiv.classList.add('c-name-div');
        nameDiv.innerText = name;
        const amountDiv = document.createElement('div');
        amountDiv.classList.add('c-amount-div');
        amountDiv.innerText = amount;
        const unitDiv = document.createElement('div');
        unitDiv.classList.add('c-unit-div');
        unitDiv.innerText = unit;
        ingridientList.appendChild(unitDiv);
        
        ingridientList.appendChild(amountDiv);
        ingridientList.appendChild(nameDiv);
        cart.appendChild(ingridientList);

         }
         right.appendChild(cart)
    } else {
        const cart = document.querySelector('.cart');
        const existingItems = document.getElementsByClassName('cart-item-list');
        for (const i of pi) {
            let foundExisiting = false;
            let p = JSON.parse(i);
            let {name, amount, unit} = p;
            for (const e of existingItems) {
                if(name == e.children[2].innerText && unit == e.children[0].innerText){
                    e.children[1].innerText = parseFloat(e.children[1].innerText)+parseFloat(amount);
                    foundExisiting =true;
                    break;
                }
            }
            if(!foundExisiting){
            const ingridientList = document.createElement('div');
            ingridientList.classList.add('cart-item-list');
            const nameDiv = document.createElement('div');
            nameDiv.classList.add('c-name-div');
            nameDiv.innerText = name;
            const amountDiv = document.createElement('div');
            amountDiv.classList.add('c-amount-div');
            amountDiv.innerText = amount;
            const unitDiv = document.createElement('div');
            unitDiv.classList.add('c-unit-div');
            unitDiv.innerText = unit;
            ingridientList.appendChild(unitDiv);
            
            ingridientList.appendChild(amountDiv);
            ingridientList.appendChild(nameDiv);
            cart.appendChild(ingridientList);
            }
        }}
}

function fetchTaste(id){
    const taste = localStorage.getItem('taste');
    if(taste){
        addTaste(JSON.parse(taste));
        return;
    }
    let url = `https://api.spoonacular.com/recipes/${id}/tasteWidget.json?apiKey=3fdfd75262a34189a3dfe28ae7b16820`
    fetch(url)
    .then(r => json())
    .then(r => saveTaste(r));//לא לשכוח למחוק כל פעם מהמסך האמצעי אחרת אותו טעם של מנה ישנה יופיע בכל המנות
}

function saveTaste(r){
    localStorage.setItem('taste',JSON.stringify(r));
    addTaste(r);
}

function addTaste(r){
    const tasteDiv = document.querySelector('.taste-div');
    const tasteContainer = document.createElement('div');
    tasteContainer.classList.add('.taste-c');
    
    for (const key of Object.keys(r)) {
    console.log('response obj: ',`Key: ${key}, Value: ${r[key]}`);
    const p = document.createElement('p');
    p.innerHTML = `<b>${key}:</b> ${r[key]}`;
    let val = Math.floor(parseFloat(r[key]));
    if (val>=100) {
        p.innerHTML += ' &#128128;'
    }
    if (val>90 && val<100) {
        p.innerHTML += ' &#128128;'
    }
    if (val>80 && val<90) {
        p.innerHTML += ' &#128128;'
    }
    if (val>70 && val<80) {
        p.innerHTML += ' &#128128;'
    }
    if (val>60 && val<70) {
        p.innerHTML += ' &#128128;'
    }
    if (val>50 && val<60) {
        p.innerHTML += ' &#128128;'
    }
    if (val>40 && val<50) {
        p.innerHTML += ' &#128128;'
    }
    if (val>30 && val<40) {
        p.innerHTML += ' &#128128;'
    }
    if (val>20 && val<30) {
        p.innerHTML += ' &#128128;'
    }
    if (val>10 && val<20) {
        p.innerHTML += ' &#128128;'
    }
    if (val>0 && val<10) {
        p.innerHTML += ' &#128128;'
    }
    tasteContainer.appendChild(p);
    }
    tasteDiv.appendChild(tasteContainer);
}