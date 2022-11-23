$(document).on('ready', function () {});
var quiz = mcdData[0];
console.log(quiz);
var questions = quiz.results;
questions = questions.sort((a, b) =>
  a.section > b.section ? 1 : b.section > a.section ? -1 : 0
);
var currentQuestionIndex = 0;
var currentQuestion = questions[currentQuestionIndex];
$("#quizProgress").html(currentQuestionIndex + 1+" of "+questions.length);
setQuestion(currentQuestion);
console.log(currentQuestion);
function setQuestion(question) {
  // $('#question').html(question.prompt.question);
  $('#question').html('test');
  $('#options').html('');
  var optionChar = 'a';
  question.prompt.answers.forEach((item,index) => {
    $('#options').append(setAnswers(optionChar, item,index));
    optionChar = String.fromCharCode(optionChar.charCodeAt(0) + 1);
  });
}

function setAnswers(value, answerOption,index) {
  return (
  	'<label for="'+index+'" class="p-2 bg-light border">'+
	    '<div class="form-check">' +
		    '<input class="form-check-input" type="radio" name="radio" value="' + value + '" id="'+index+'">' +
		    '<span class="fw-bold">'+value.toUpperCase()+'. </span>'+
			'<label class="form-check-label" for="'+index+'">'+ answerOption + '</label>' +
	    '</div>'+
    '</label>'
  );
}

$("#next").on('click',function(){
	if(currentQuestionIndex < questions.length -1){
		currentQuestionIndex++;
		setQuestion(questions[currentQuestionIndex]);
		$("#questionNumber").html(currentQuestionIndex + 1)
		$("#quizProgress").html(currentQuestionIndex + 1+" of "+questions.length);
	}
});

$("#previous").on('click',function(){
	if(currentQuestionIndex > 0){
		currentQuestionIndex--;
		setQuestion(questions[currentQuestionIndex]);
		$("#questionNumber").html(currentQuestionIndex + 1)
		$("#quizProgress").html(currentQuestionIndex + 1+" of "+questions.length);
	}
});
