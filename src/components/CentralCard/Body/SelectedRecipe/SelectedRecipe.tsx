import React, { useContext, useEffect, useState, useReducer } from "react";
import { useRouter } from "next/router";

import { StylesContext } from "../../../store/styles-context";
import { ErrorContext } from "../../../store/error-context";

import classes from "./SelectedRecipe.module.css";

import ImageAndTitle from "./SelectedRecipeComponent/ImageAndTitle/ImageAndTitle";
import RecipeDetails from "./SelectedRecipeComponent/RecipeDetails/RecipeDetails";
import RecipeIngredients from "./SelectedRecipeComponent/RecipeIngredients/RecipeIngredients";

import useFetchSelectedRecipe from "../../../hooks/useFetchSelectedRecipe";

import { BsEmojiSmile } from "react-icons/bs";
import LinearProgress from "@mui/material/LinearProgress";

const SelectedRecipe = () => {
  const [servings, setServings] = useState({ newServings: 0, oldServings: 0 });
  const [ingredients, setIngredients] = useState([
    {
      quantity: 0,
      unit: "",
      description: "",
    },
  ]);



  const stylesCtx = useContext(StylesContext);
  const errorCtx = useContext(ErrorContext);
  const router = useRouter();
  const recipeId = router.query.id;

  const foundRecipesControllerState =
    stylesCtx.state.foundRecipesControllerState;
  const isSelectedRecipeLoading = stylesCtx.state.selectedRecipeLoadingState;
  const fetchSelectedRecipesHasError = errorCtx.fetchSelectedRecipeStatus;
  const fetchFoundRecipesHasError = errorCtx.fetchRecipesStatus;
  const fetchSelectedRecipesErrorMessage =
    errorCtx.fetchSelectedRecipeErrorMessage;
  const fetchFoundRecipesErrorMessage = errorCtx.fetchRecipesErrorMessage;

  const closeFoundRecipes = () => {
    if (foundRecipesControllerState) {
      stylesCtx.changeFoundRecipesControllerState(false);
    }
  };

  const recipeData = useFetchSelectedRecipe();

  const addServings = () => {
    if (servings.newServings < 20) {
      setServings({
        newServings: servings.oldServings + 1,
        oldServings: servings.oldServings,
      });
      ingredients.forEach((ingredient) => {
        ingredient.quantity =
          (ingredient.quantity * servings.newServings) / servings.oldServings;
      });
    }
  };

  const removeServings = () => {
    ingredients.forEach((ingredient) => {
      ingredient.quantity =
        (ingredient.quantity * servings.newServings) / servings.oldServings;
    });
  };

  useEffect(() => {
    setServings({
      newServings: recipeData.servings,
      oldServings: recipeData.servings,
    });
    setIngredients(recipeData.ingredients);
  }, [recipeData.servings, recipeData.ingredients]);

  return (
    <div
      className={`${classes.body} ${
        foundRecipesControllerState &&
        !fetchFoundRecipesHasError &&
        classes["found-recipes-open"]
      }`}
      onClick={closeFoundRecipes}
    >
      {fetchSelectedRecipesHasError && (
        <span
          className={`${classes["fetch-selected-recipe-error-message"]} ${classes["error-message"]}`}
        >
          {fetchSelectedRecipesErrorMessage}
        </span>
      )}
      {fetchFoundRecipesHasError && (
        <span
          className={`${classes["fetch-found-recipes-error-message"]} ${classes["error-message"]}`}
        >
          {fetchFoundRecipesErrorMessage}
        </span>
      )}
      {recipeId === undefined && (
        <span className={classes["starting-message"]}>
          <BsEmojiSmile className={classes["starting-message-emoji"]} />
          Start by searching for a recipe or an ingredient. Have fun!
        </span>
      )}
      {isSelectedRecipeLoading && (
        <LinearProgress className={classes["loading-bar"]} />
      )}

      {recipeData.image !== "" && recipeId !== undefined && (
        <>
          <ImageAndTitle image={recipeData.image} title={recipeData.title} />
          <RecipeDetails
            cookingTime={recipeData.cookingTime}
            servings={servings.newServings}
            image={recipeData.image}
            publisher={recipeData.publisher}
            title={recipeData.title}
            id={recipeData.id}
            changeServings={(servings: {
              newServings: number;
              oldServings: number;
            }) =>
              setServings({
                newServings: servings.newServings,
                oldServings: servings.oldServings,
              })
            }
            addServings={addServings}
            removeServings={removeServings}
          />
          <RecipeIngredients
            ingredients={ingredients}
            id={recipeData.id}
            source={recipeData.source}
          />
        </>
      )}
    </div>
  );
};

export default SelectedRecipe;
