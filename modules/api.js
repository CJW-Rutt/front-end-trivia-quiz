const TRIVIA_API_URL = "https://opentdb.com";

async function getCategoryData() {
  const apiResponse = await fetch(`${TRIVIA_API_URL}/api_category.php`);
  const jsonData = await apiResponse.json();
  return jsonData.trivia_categories;
}

export default getCategoryData;

async function getQuizData(numberOfQuestions, selectedCategoryId, chosenDifficulty) {
  const apiResponse = await fetch(
    `${TRIVIA_API_URL}/api.php?amount=${numberOfQuestions}&category=${selectedCategoryId}&difficulty=${chosenDifficulty}&type=multiple`
  );
  const jsonData = await apiResponse.json();

  return jsonData.results.map((singleQuestion) => {
    const randomCorrectIndex = Math.floor(Math.random() * 4);
    const optionList = [...singleQuestion.incorrect_answers];
    optionList.splice(randomCorrectIndex, 0, singleQuestion.correct_answer);
    return {
      question: singleQuestion.question,
      options: optionList,
      correctAnswerIndex: randomCorrectIndex,
    };
  });
}

async function sendQuizResults(data) {
  const response = await fetch("https://apipool.azurewebsites.net/api/quizzes", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Failed to send quiz results");
  }

  return await response.json();
}

export { sendQuizResults };

export { getQuizData as fetchQuizQuestions };