//Variable declaration and accessing html elements
let favouriteList = [];
let RecipeList = [];
let favPage=false;
let URI = `https://www.themealdb.com/api/json/v1/1/search.php?s=`;
let searchInput = document.getElementById('search-recipe');
let displayRecipes = document.getElementById('main-content')

//Fetch favourite Data from local Storage
let data = localStorage.getItem('meal-app');
if (data) {
    favouriteList = JSON.parse(data);
}
else {
    localStorage.setItem('meal-app', []);
}
displayList(RecipeList);

//Getting all Search Data from API
async function fetchData(search) {
    displayRecipes.innerHTML = `<h1>LOADING</h1>`
    let response = await fetch(URI + search);
    let data = await response.json();
    if (data.meals) {
        RecipeList = data.meals;
        setTimeout(() => {
            displayList(RecipeList);
        }, 2000)
    }
    else {
        RecipeList = [];
        showNotification("No Data Found!");
        displayList(RecipeList);
    }

}

//Display Data on Screen
function displayList(dataList) {
    let list = 
    `<h2>${favPage?"List of Favourites":"List of Recipes"}</h2><div id="recipe-list">`;
    if (dataList.length > 0) {
        dataList.map((element) => {
            let isFavourite=favouriteList.filter((elem)=>{
                return elem.idMeal===element.idMeal;
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
                    <button id=${element.idMeal} class="fav-btn">Add to Favourite<span><i class='${isFavourite.length>0 ? `fa-solid fa-heart fav-empty` : `fa-regular fa-heart fav-filled`}'></i></span></button>
                </div>
            </div>
            `
        })
        list+=`
        </div>`;
    }
    else {
        list = `<h1>No Data to Display! Search Above</h1>`;
    }
    displayRecipes.innerHTML = list;
}

//Toggle Favourite List
function addToFavourite(id) {
    let favList=favouriteList.filter((elem)=>{
        return elem.idMeal===id;
    })
    if(favList.length>0){
        favList=favouriteList.filter((elem)=>{
            return elem.idMeal!==id;
        })
        favouriteList=favList;
        showNotification("Recipe deleted from Favourites");
    }
    else{
        let list=RecipeList.filter((elem)=>{
            return elem.idMeal===id;
        })
        favouriteList.push(list[0]);
        showNotification("Recipe added to Favourites");
    }
    localStorage.setItem('meal-app',JSON.stringify(favouriteList));
    favPage=true;
    displayList(favouriteList);
}


//Get Alert 
function showNotification(text) {
    alert(text)
}

//Even Listeners
searchInput.addEventListener('input', (e) => {
    if(e.target.value !== ''){
        fetchData(e.target.value);
    }
    else{
        favPage=false;
        displayList(RecipeList);
    }
});

document.addEventListener('click', (element) => {
    element.preventDefault();
    if (element.target.className === 'fav-btn') {
        addToFavourite(element.target.id);
    }
    if (element.target.id === 'Favourites-btn') {
        favPage=true;
        displayList(favouriteList);
        console.log("Clicked on favourites");
    }
    if(element.target.className==='recipe-view-more'){
        console.log("View More")
        displaySingleData(element.target.id);
    }
})


//Get the single Recipe Data
function displaySingleData(id){
    let singleRecipe=RecipeList.filter((elem)=>{
        return elem.idMeal===id;
    })
    singleData=singleRecipe[0];
    let htmlData=`
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
        <a href="index.html"><button class="go-back">Go Back</button></a>
    </div>
</div>
    `;
    displayRecipes.innerHTML=htmlData;
}
