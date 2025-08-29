const container = document.querySelector('#container');
const right = document.querySelector('#right');
const center = document.querySelector('#center');
const left = document.querySelector('#left');
const searchBar = document.querySelector('.search-bar');
const searchBarInput = document.querySelector('#search-input');
const apiKey = 'apiKey=3fdfd75262a34189a3dfe28ae7b16820';


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
    onRecipeClick2(null,parsedDishInfo, parsedDishInfoTarget);
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
    //////////// delete previous////////////
    const previousSearch = left.querySelector('.recipe-container');
    if (previousSearch) {
        previousSearch.remove();
    }
    const previousSearchDishInfoArr = localStorage.getItem('dishInfoArr');
    if(previousSearchDishInfoArr){
        localStorage.removeItem('dishInfoArr');
    }
    ////////////search///////////
    if(searchBarInput.value){
        const url = `https://api.spoonacular.com/recipes/complexSearch?${apiKey}&query=`;
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
    div.className = 'recipe-container'
    for (let obj of results) {
        let {id, title, image} = obj;

        if (title.length >= 60){
            title = title.substr(0,57);
            title += '...';
        }


        const div1 = document.createElement('div');
        const img = document.createElement('img');
        const divInner = document.createElement('div');
        const h2 = document.createElement('h2');
        h2.dataset.dishId = id;

        div1.className = 'recipe-item';
        divInner.className = 'recipe-item-inner-div';
        img.className = 'recipe-img';

        div1.dataset.dishId = id;
        img.src = image;
        h2.innerText = title;

        img.style.height = '125px';
        img.style.width = '125px';
        img.style.borderRadius = '60px';
        img.dataset.dishId = id;

        div1.appendChild(img);
        divInner.appendChild(h2);
        div1.appendChild(divInner);
        div.appendChild(div1);
        fetchById(div1,id);
        div1.addEventListener('click', onRecipeClick2);
    }
    left.appendChild(div);
}

function fetchById(target,id){
    const dishInfoArr = localStorage.getItem('dishInfoArr');
    
    if(dishInfoArr){
        let parsedDishInfoArr = JSON.parse(dishInfoArr);
        let parsedDishInfoArrLength = parsedDishInfoArr.length
        if(parsedDishInfoArrLength >= 10){
        let r = returnDishFromDishInfoArr(id);
        fetchById2(r,target,false);
        return;
        }
    }
    let url=`https://api.spoonacular.com/recipes/${id}/information?${apiKey}&includeNutrition=false`;
    fetch(url)
    .then(r => r.json())
    .then(r => fetchById2(r,target,true));
}
function fetchById2(r,target,isNeededToSaveToStorage){
    target.dataset.recipeInfo = JSON.stringify(r);
    const innerDiv = target.querySelector('.recipe-item-inner-div');
    let {id, sourceName} = r;
    const p = document.createElement('p');
    p.dataset.dishId = id;
    p.innerText = sourceName;
    innerDiv.appendChild(p);
    /////////// save //////////
    if(isNeededToSaveToStorage){
    const dishInfoArr = localStorage.getItem('dishInfoArr');
    if(dishInfoArr){
        let parsedDIA = JSON.parse(dishInfoArr);
        parsedDIA.push(JSON.stringify(r));
        localStorage.setItem('dishInfoArr',JSON.stringify(parsedDIA));
    } else {
        let DIA = [];
        DIA.push(JSON.stringify(r));
        localStorage.setItem('dishInfoArr',JSON.stringify(DIA));
    }
}
}

function onRecipeClickSave(r,t){
    localStorage.setItem('dishInfo', JSON.stringify(r));
    localStorage.setItem('dishInfoTarget', JSON.stringify(t));
}

function returnDishFromDishInfoArr(dishId){
    const dishInfoArr = localStorage.getItem('dishInfoArr');
    let parsedDishInfoArr = JSON.parse(dishInfoArr);
            for (const element of parsedDishInfoArr) {
                const parsedElement = JSON.parse(element);
                let {id} = parsedElement;
                if (id == dishId) {
                    return parsedElement;
                }
            }
}

function onRecipeClick2(event,r,target){
    if(event){
        target = event.target;
        let dishId = target.dataset.dishId;
        const dishInfoArr = localStorage.getItem('dishInfoArr');
        if (dishInfoArr) {
            r = returnDishFromDishInfoArr(dishId);
        }

    }
    onRecipeClickSave(r,target);

    ///////// delete /////////
    const previous = center.querySelector('.desc-container');
    if (previous) {
        previous.remove();
    }
    const LSTaste = localStorage.getItem('taste');
    if (LSTaste) {
        localStorage.removeItem('taste');
    }
    //////////////////////////
        let {id,title,image,servings,readyInMinutes,cookingMinutes,preparationMinutes,sourceName,sourceUrl,
        spoonacularSourceUrl,dishTypes,extendedIngredients,summary,creditsText,instructions} = r;

    const div = document.createElement('div');
    div.classList.add('desc-container');
    div.dataset.r = JSON.stringify(r,['id','title','image']);
    
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
            // i.innerText = parseFloat(i.innerText).toFixed(2);
            // if (parseFloat(i.innerText)%1 >= 0.96){
            //     i.innerText = Math.ceil(i.innerText);
            // }
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
            // i.innerText = parseFloat(i.innerText).toFixed(2);
            // if (parseFloat(i.innerText)%1 <= 0.04){
            //     i.innerText = Math.floor(i.innerText);
            // }
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

    const tasteDiv = document.createElement('div');
    tasteDiv.classList.add('taste-div');
    div.appendChild(tasteDiv);

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

    const SourceUrlButton = document.createElement('button');
    SourceUrlButton.classList.add('directions-btn');
    SourceUrlButton.textContent = "Directions";
    SourceUrlButton.addEventListener('click', function() {
            window.open(spoonacularSourceUrl, '_blank');
        });
    div.appendChild(SourceUrlButton);
        

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

        div1.addEventListener('click',onRecipeClick2)

        div1.appendChild(div2);
    }
    heartMenu.appendChild(div1);

}

function deleteFromFavorites(e){
    let t = e.target.parentElement;
    let id = t.dataset.id;
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
    let pi = JSON.parse(ingridients);
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
        const amountInput = document.createElement('input');
        amountInput.type = 'number';
        amountInput.min = '0';
        amountInput.value = amount;
        if( unit == 'cup' || unit == 'cups' || unit == 'tablespoon' || unit == 'teaspoon' || unit == 'tbsp' || unit == 'tsp'){
            amountInput.step = '0.25';
        }
        amountInput.classList.add('cart-amount-input');
        amountDiv.appendChild(amountInput);
        const unitDiv = document.createElement('div');
        unitDiv.classList.add('c-unit-div');
        unitDiv.innerText = unit;
        const delBtn = document.createElement('button');
        delBtn.innerText = 'Delete';
        delBtn.addEventListener('click', deleteParent);

        ingridientList.appendChild(unitDiv);
        ingridientList.appendChild(amountDiv);
        ingridientList.appendChild(nameDiv);
        ingridientList.appendChild(delBtn);
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
                    e.children[1].children[0].value = parseFloat(e.children[1].children[0].value)+parseFloat(amount);
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
            const amountInput = document.createElement('input');
            amountInput.type = 'number';
            amountInput.min = '0';
            amountInput.value = amount;
            if( unit == 'cup' || unit == 'cups' || unit == 'tablespoon' || unit == 'teaspoon' || unit == 'tbsp' || unit == 'tsp'){
            amountInput.step = '0.25';}
            amountInput.classList.add('cart-amount-input');
            amountDiv.appendChild(amountInput);
            const unitDiv = document.createElement('div');
            unitDiv.classList.add('c-unit-div');
            unitDiv.innerText = unit;
        const delBtn = document.createElement('button');
        delBtn.innerText = 'Delete';
        delBtn.addEventListener('click', deleteParent);

        ingridientList.appendChild(unitDiv);
        ingridientList.appendChild(amountDiv);
        ingridientList.appendChild(nameDiv);
        ingridientList.appendChild(delBtn);
            cart.appendChild(ingridientList);
            }
        }}
}
function deleteParent(e){
    e.target.parentElement.remove();
}

function fetchTaste(id){
    const taste = localStorage.getItem('taste');
    if(taste){
        addTaste(JSON.parse(taste));
        return;
    }
    let url = `https://api.spoonacular.com/recipes/${id}/tasteWidget.json?${apiKey}`
    fetch(url)
    .then(r => r.json())
    .then(r => saveTaste(r));// לא לשכוח למחוק כל פעם מהמסך האמצעי אחרת אותו טעם של מנה ישנה יופיע מחדש
}

function saveTaste(r){
    localStorage.setItem('taste',JSON.stringify(r));
    addTaste(r);
}

function addTaste(r){
    const tasteDiv = center.querySelector('.taste-div');
    const tasteContainer = document.createElement('div');
    tasteContainer.classList.add('.taste-c');
    tasteContainer.style.border = '1px solid';
    tasteContainer.style.margin = '2px';
    tasteContainer.style.marginTop = '3em';

    const h3 = document.createElement('h3');
    h3.innerHTML = '<b>Taste</b>';
    tasteContainer.appendChild(h3);
    h3.style.textAlign = 'center';
    
    for (const key of Object.keys(r)) {
    const p = document.createElement('p');
    p.innerHTML = `<b>${key}:</b> ${r[key]} =`;
    let val = Math.floor(parseFloat(r[key]));
    let icon;
    if(key=='sweetness'){
    icon = '🍬';}
    if(key=='saltiness'){
    icon = '🧂';}
    if(key=='sourness'){
    icon = '🍋';}
    if(key=='bitterness'){
    icon = '☕';}
    if(key=='savoriness'){
    icon = '😋';}
    if(key=='fattiness'){
    icon = '🧈';}
    if(key=='spiciness'){
    icon = '🌶️';}
    let numToAdd = Math.round(val/10);
    for (let i = 0; i < numToAdd; i++) {
        p.innerHTML += icon;
    }
    if(numToAdd == 0){
        p.innerHTML += ' 0';
    }

    tasteContainer.appendChild(p);
    }
    tasteDiv.appendChild(tasteContainer);
}