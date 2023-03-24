import * as model from './model.js';
import recipeView from './Views/recipeView.js';
import searchView from './Views/searchView.js';
import resultView from './Views/resultView.js';
import paginationView from './Views/paginationView.js';
import bookmarksView from './Views/bookmarksView.js';
import addRecipeView from './Views/addRecipeView.js';
import { MODELCLOSE_SEC } from './config.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';
import addRecipeView from './Views/addRecipeView.js';

// if (module.hot) {
//   module.hot.accept();
// }

const recipeContainer = document.querySelector('.recipe');

// https://forkify-api.herokuapp.com/v2

///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    //loading spinner
    if (!id) return;
    resultView.renderSpinner();

    //***some issue here: shoud use "update" instead of "render"
    resultView.render(model.getSearchResult());
    bookmarksView.render(model.state.bookmarks);

    //loading recipe
    await model.loadRecipe(id);

    // rendering recipe
    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
    console.error(err);
  }
};

const controlSearchResults = async function () {
  try {
    //get search query
    const query = searchView.getQuery();

    if (!query) return;

    await model.loadSearchResults(query);

    resultView.render(model.getSearchResult());

    paginationView.render(model.state.search);
  } catch (err) {
    console.error(err);
  }
};

const controlPagination = function (goToPage) {
  resultView.update(model.getSearchResult(goToPage));
  paginationView.update(model.state.search);
};

const controlServing = function (newServings) {
  //update the recipe serving
  model.updateServing(newServings);

  //rendering recipe again
  // recipeView.render(model.state.recipe);

  recipeView.update(model.state.recipe);
};

const controlBookmark = function () {
  //1) add & remove book mark
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  //2) update recipe view
  recipeView.update(model.state.recipe);

  //3) Render bookmarks
  bookmarksView.update(model.state.bookmarks);
};

const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();

    //upload new recipe data
    await model.uploadRecipe(newRecipe);

    //render recipe
    recipeView.render(model.state.recipe);

    //success message
    addRecipeView.renderSuccess();

    //render bookmark view
    bookmarksView.render(model.state.bookmarks);

    //change ID in url

    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    //close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODELCLOSE_SEC * 1000);
  } catch (err) {
    console.error(err);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServing(controlServing);
  recipeView.addHanderAddBookmark(controlBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerupload(controlAddRecipe);
};
init();
