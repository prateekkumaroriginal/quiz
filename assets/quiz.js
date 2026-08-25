document.querySelectorAll("[data-quiz]").forEach(function (quiz) {
  var feedback = quiz.querySelector("[data-feedback]");
  var buttons = quiz.querySelectorAll("button[data-answer]");

  buttons.forEach(function (button) {
    button.addEventListener("click", function () {
      buttons.forEach(function (candidate) {
        candidate.setAttribute("aria-pressed", "false");
      });

      button.setAttribute("aria-pressed", "true");
      var isCorrect = button.dataset.answer === quiz.dataset.correct;
      feedback.dataset.state = isCorrect ? "correct" : "incorrect";
      feedback.textContent = isCorrect
        ? quiz.dataset.correctMessage
        : quiz.dataset.incorrectMessage;
    });
  });
});

