$(document).on('ready', function () {});
var quiz = mcdData[0];
console.log(quiz);
var questions = quiz.results;
questions = questions.sort((a, b) =>
  a.section > b.section ? 1 : b.section > a.section ? -1 : 0
);
var currentQuestion = questions[1];
setQuestion(currentQuestion);
console.log(quiz);
function setQuestion(question) {
  $('#question').html(question.prompt.question);
  var optionChar = 'a';
  question.prompt.answers.forEach((item) => {
    $('#options').append(setAnswers(optionChar, item));
    optionChar = String.fromCharCode(optionChar.charCodeAt(0) + 1);
  });
}

function setAnswers(value, answerOption) {
  return (
    '<div class="ans ml-2">' +
    '<label class="radio"> <input type="radio" name="radio" value="' +
    value +
    '"> <span>' +
    answerOption +
    '</span>' +
    '</label>    ' +
    '</div>'
  );
}
