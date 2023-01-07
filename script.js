//Variable declaration and accessing html elements
let favouriteList = [];
let RecipeList = [];
let favPage = false;
let URI = `https://www.themealdb.com/api/json/v1/1/search.php?s=`;
let SingleURI=`https://www.themealdb.com/api/json/v1/1/lookup.php?i=`;
let searchInput = document.getElementById('search-recipe');
let displayRecipes = document.getElementById('main-content');
let singleRecipeData;

//Fetch favourite Data from local Storage
let data = localStorage.getItem('meal-app');
if (data) {
    favouriteList = JSON.parse(data);
}
else {
    localStorage.setItem('meal-app', []);
}
displayList(RecipeList);

//Getting all input Searched Data from API
async function fetchData(search) {
    let response = await fetch(URI + search);
    let data = await response.json();
    if (data.meals) {
        RecipeList = data.meals;
        displayList(RecipeList);
    }
    else {
        RecipeList = [];
        displayRecipes.innerHTML=`<h1>No Meal Found with the searched result</h1>`;
    }

}

//Getting single recipe data
async function fetchSingleData(id){
    let response=await fetch(SingleURI+id);
    let data=await response.json();
    if(data.meals){
        singleRecipeData=data.meals[0];
        displaySingleData(singleRecipeData);
    }
    else{
        showNotification("No Data found");
        return;
    }
}

//Display Data of recipes and favourites list on Screen
function displayList(dataList) {
    let list =
        `<h2>${favPage ? "List of Favourites" : "List of Recipes"}</h2><div id="recipe-list">`;
    if (dataList.length > 0) {
        dataList.map((element) => {
            let isFavourite = favouriteList.filter((elem) => {
                return elem.idMeal === element.idMeal;
            })
            list += `
            <div class="recipe-items"> 
                <div class="recipe-img">
                    <img src=${element.strMealThumb} alt="">
                    <button class="recipe-view-more" id=${element.idMeal}>View Details</button>
                </div>
                <div class="recipe-details">
                    <h4>Name - ${element.strMeal}</h4>
                    <p>Category - ${element.strCategory}</p>
                    <p>Origin - ${element.strArea}</p>
                    <button id=${element.idMeal} class="fav-btn">${isFavourite.length>0?'Remove from ':'Add to'} Favourite<span><i class='${isFavourite.length > 0 ? `fa-solid fa-heart fav-empty` : `fa-regular fa-heart fav-filled`}'></i></span></button>
                </div>
            </div>
            `
        })
        list += `
        </div>`;
    }
    else {
        list = `<h1>No Data to Display! Search Above</h1>`;
    }
    displayRecipes.innerHTML = list;
}

//Toggle Favourite List
function toggleFavourite(id) {
    let favList = favouriteList.filter((elem) => {
        return elem.idMeal === id;
    })
    if (favList.length > 0) {
        favList = favouriteList.filter((elem) => {
            return elem.idMeal !== id;
        })
        favouriteList = favList;
        showNotification("Recipe deleted from Favourites");
    }
    else {
        let list = RecipeList.filter((elem) => {
            return elem.idMeal === id;
        })
        favouriteList.push(list[0]);
        showNotification("Recipe added to Favourites");
    }
    localStorage.setItem('meal-app', JSON.stringify(favouriteList));
    favPage = true;
    displayList(favouriteList);
}


//Get Alert 
function showNotification(text) {
    alert(text)
}

//Event Listeners
searchInput.addEventListener('input', (e) => {
    //Event for Input Search
    if (e.target.value !== '') {
        favPage=false;
        displayRecipes.innerHTML = `<h1 style="display:flex; align-items:center; gap: 1rem;">LOADING <img style="width: 3rem; height: 3rem;" src="https://i2.wp.com/raw.githubusercontent.com/Codelessly/FlutterLoadingGIFs/master/packages/cupertino_activity_indicator.gif?w=770&is-pending-load=1#038;ssl=1" /></h1>`;
        setTimeout(()=>{
            fetchData(e.target.value);
        },1000)
    }
    else {
        favPage = false;
        displayList(RecipeList);
    }
});

document.addEventListener('click', (element) => {
    //Event for Favourite Toggling
    if (element.target.className === 'fav-btn' || element.target.className==='fav-btn-single') {
        toggleFavourite(element.target.id);
    }
    //Event for Displaying Favourites
    if (element.target.id === 'Favourites-btn') {
        favPage = true;
        displayList(favouriteList);
    }
    //Event for Displaying Single Recipe Data
    if (element.target.className === 'recipe-view-more') {
        fetchSingleData(element.target.id);
    }
    //Event to go back from Single Recipe Page
    if (element.target.className === 'go-back') {
        favPage = false;
        displayList(RecipeList);
    }
    //Event to go to home page by clicking Logo
    if(element.target.tagName==='H1'){
        RecipeList=[];
        searchInput.value='';
        displayList(RecipeList);
    }
})


//Get the single Recipe Data
function displaySingleData(singleData) {
        let isFavourite = favouriteList.filter((elem) => {
        return elem.idMeal === singleData.idMeal;
         })
        let htmlData = `
    <div class="single-page-div">
    <div class="left-side">
        <img class="single-page-img" src="${singleData.strMealThumb}" >
        <div class="recipe-single-details">
            <p><span>Name</span> - ${singleData.strMeal}</p>
            <p><span>Category</span> - ${singleData.strCategory}</p>
            <p><span>Origin</span> - ${singleData.strArea}</p>
            <div class="recipe-single-btns">
                <a target="_blank" href="${singleData.strSource}"><button id="blog-btn">View Full Blog</button></a>
                <a target="_blank" href="${singleData.strYoutube}"><button id="video-btn">View Video</button></a>
            </div>
        </div>
    </div>
    <div class="right-side">
        <p><span>Instructions - </span> ${singleData.strInstructions}</p>

        <table class="ingredient-list">
            <tr>
                <th>Ingredient</th>
                <th>Name</th>
                <th>Quantity</th>
            </tr>
            <tr>
                <td>Ingredient 1</td>
                <td>${singleData.strIngredient1}</td>
                <td>${singleData.strMeasure1}</td>
            </tr>
            <tr>
                <td>Ingredient 2</td>
                <td>${singleData.strIngredient2}</td>
                <td>${singleData.strMeasure2}</td>
            </tr>
            <tr>
                <td>Ingredient 3</td>
                <td>${singleData.strIngredient3}</td>
                <td>${singleData.strMeasure3}</td>
            </tr>
            <tr>
                <td>Ingredient 4</td>
                <td>${singleData.strIngredient4}</td>
                <td>${singleData.strMeasure4}</td>
            </tr>
            <tr>
                <td>Ingredient 5</td>
                <td>${singleData.strIngredient5}</td>
                <td>${singleData.strMeasure5}</td>
            </tr>
            <tr>
                <td>Ingredient 6</td>
                <td>${singleData.strIngredient6}</td>
                <td>${singleData.strMeasure6}</td>
            </tr>
            <tr>
                <td>Ingredient 7</td>
                <td>${singleData.strIngredient7}</td>
                <td>${singleData.strMeasure7}</td>
            </tr>
            <tr>
                <td>Ingredient 8</td>
                <td>${singleData.strIngredient8}</td>
                <td>${singleData.strMeasure8}</td>
            </tr>
            <tr>
                <td>Ingredient 9</td>
                <td>${singleData.strIngredient9}</td>
                <td>${singleData.strMeasure9}</td>
            </tr>
            <tr>
                <td>Ingredient 10</td>
                <td>${singleData.strIngredient10}</td>
                <td>${singleData.strMeasure10}</td>
            </tr>
            <tr>
                <td>Ingredient 11</td>
                <td>${singleData.strIngredient11}</td>
                <td>${singleData.strMeasure11}</td>
            </tr>
            <tr>
                <td>Ingredient 12</td>
                <td>${singleData.strIngredient12}</td>
                <td>${singleData.strMeasure12}</td>
            </tr>
            <tr>
                <td>Ingredient 13</td>
                <td>${singleData.strIngredient13}</td>
                <td>${singleData.strMeasure13}</td>
            </tr>
            <tr>
                <td>Ingredient 14</td>
                <td>${singleData.strIngredient14}</td>
                <td>${singleData.strMeasure14}</td>
            </tr>
            <tr>
                <td>Ingredient 15</td>
                <td>${singleData.strIngredient15}</td>
                <td>${singleData.strMeasure15}</td>
            </tr>
            <tr>
                <td>Ingredient 16</td>
                <td>${singleData.strIngredient16}</td>
                <td>${singleData.strMeasure16}</td>
            </tr>
            <tr>
                <td>Ingredient 17</td>
                <td>${singleData.strIngredient17}</td>
                <td>${singleData.strMeasure17}</td>
            </tr>
            <tr>
                <td>Ingredient 18</td>
                <td>${singleData.strIngredient18}</td>
                <td>${singleData.strMeasure18}</td>
            </tr>
            <tr>
                <td>Ingredient 19</td>
                <td>${singleData.strIngredient19}</td>
                <td>${singleData.strMeasure19}</td>
            </tr>
            <tr>
                <td>Ingredient 20</td>
                <td>${singleData.strIngredient20}</td>
                <td>${singleData.strMeasure20}</td>
            </tr>
        </table>
        <div>
        <button id=${singleData.idMeal} class="fav-btn-single">${isFavourite.length>0?'Remove from ':'Add to'} Favourite<span><i class='${isFavourite.length > 0 ? `fa-solid fa-heart fav-empty` : `fa-regular fa-heart fav-filled`}'></i></span></button>
        <button class="go-back">Go Back</button>
        </div>
    </div>
</div>
    `;
        displayRecipes.innerHTML = htmlData;
}
