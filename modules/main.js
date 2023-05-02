import fetchCategoriesAPI from "./api.js";
import {
  formSetup,
  categoryDropdown,
  difficultyDropdown,
  quizUI,
} from "./dom.js";
//import { initQuiz } from "./quiz.js";

(async () => {
  const categoryList = await fetchCategoriesAPI();
  categoryList.sort((a, b) => a.name.localeCompare(b.name));
  categoryList.forEach((categoryItem) => {
    const categoryOption = document.createElement("option");
    categoryOption.value = categoryItem.id;
    categoryOption.textContent = categoryItem.name;
    categoryDropdown.appendChild(categoryOption);
  });
})();

formSetup.addEventListener("submit", async (event) => {
  event.preventDefault();

  const selectedCategory = categoryDropdown.value;
  const selectedDifficulty = difficultyDropdown.value;
  const quizQuestions = await fetchQuizQuestions(
    10,
    selectedCategory,
    selectedDifficulty
  );

  if (quizQuestions.length === 0) {
    alert(
      "No questions found for the selected category and difficulty. Please try another combination."
    );
    return;
  }

  formSetup.classList.add("hidden");
  quizUI.classList.remove("hidden");
  initQuiz(quizQuestions);
});
