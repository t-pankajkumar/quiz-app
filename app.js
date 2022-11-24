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
function setQuestion(question) {
  $('#question').html(question.prompt.question);
  // $('#question').html('test');
  $('#options').html('');
  var optionChar = 'a';
  question.prompt.answers.forEach((item,index) => {
    $('#options').append(setAnswers(optionChar, item,index));
    optionChar = String.fromCharCode(optionChar.charCodeAt(0) + 1);
  });
}

function setAnswers(value, answerOption,index) {
  return (
  	'<label for="'+index+'" class="bg-light">'+
	    '<div class="form-check">' +
		    '<input class="form-check-input m-2" type="radio" name="answer" value="' + value + '" id="'+index+'">' +
		    '<span class="fw-bold">'+value.toUpperCase()+'. </span>'+
			'<label class="form-check-label p-2 w-100 ms-2 bg-secondary" style="--bs-bg-opacity: .1;" for="'+index+'">'+ answerOption + '</label>' +
	    '</div>'+
    '</label>'
  );
}

$("#next").on('click',function(){
	var selectedAnswer = $(document).find("input[name=answer]:checked").val();
	if (!selectedAnswer){
		showMessage('danger','Please select and option');
		return false;
	}
  if (currentQuestionIndex < questions.length - 1) {
	questions[currentQuestionIndex].user_answer = selectedAnswer;
    currentQuestionIndex++;
    setQuestion(questions[currentQuestionIndex]);
    $("#questionNumber").html(currentQuestionIndex + 1);
    $("#quizProgress").html(
      currentQuestionIndex + 1 + " of " + questions.length
    );
    $("#previous").removeClass('invisible');
  }
});

$("#previous").on('click',function(){
	if(currentQuestionIndex > 0){
		currentQuestionIndex--;
		setQuestion(questions[currentQuestionIndex]);
		$("#questionNumber").html(currentQuestionIndex + 1)
		$("#quizProgress").html(currentQuestionIndex + 1+" of "+questions.length);
    $('input[name="answer"][value="'+questions[currentQuestionIndex].user_answer+'"]').prop('checked',true)
	}
	if(currentQuestionIndex === 0){
		$("#previous").addClass("invisible");
	}
});

function showMessage(status,message) {
  status = status === "success" ? "primary" : "danger";
  var toastConetent =
    '<div id="liveToast" class="toast align-items-center text-bg-' +
    status +
    '" role="alert" aria-live="assertive" aria-atomic="true">' +
    '<div class="d-flex">' +
    '<div class="toast-body">' +
    message +
    "</div>" +
    '<button type="button" class="btn-close me-2 m-auto btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>' +
    "</div>" +
    "</div>";
  $(".toastHolder").html(toastConetent);
  var toast = new bootstrap.Toast($(document).find("#liveToast"));

  toast.show();
}

