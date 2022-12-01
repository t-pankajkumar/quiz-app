$(document).on('ready', function () {});
var questions;
var currentQuestionIndex = 0;
var selectedQuiz = 0;

$('#quizSet').html('');
var quizSet = '';
mcdData.forEach((item, index) => {
  quizSet += '<option value=' + index + '>' + (index + 1) + '</option>';
});
$('#quizSet').html(quizSet);

$('#quizSet').on('change', function () {
  selectedQuiz = $('#quizSet option:selected').val();
  currentQuestionIndex = 0;
  setQuizSet(selectedQuiz);
});

function setQuizSet(index) {
  var quiz = mcdData[index];
  console.log(quiz);
  questions = quiz.results;
  questions = questions.sort((a, b) =>
    a.section > b.section ? 1 : b.section > a.section ? -1 : 0
  );

  var currentQuestion = questions[currentQuestionIndex];
  $('#quizProgress').html(currentQuestionIndex + 1 + ' of ' + questions.length);
  $('#questionNumber').html(currentQuestionIndex + 1 + '.');
  setQuestion(currentQuestion);
}
setQuizSet(selectedQuiz);

function setQuestion(question) {
  $('#question').html(question.prompt.question);
  // $('#question').html('test');
  $('#options').html('');
  var optionChar = 'a';
  question.prompt.answers.forEach((item, index) => {
    $('#options').append(setAnswers(optionChar, item, index));
    optionChar = String.fromCharCode(optionChar.charCodeAt(0) + 1);
  });
  $('#explanation').html(question.prompt.explanation);
}

function setAnswers(value, answerOption, index,item) {
  var bg = '';
  if(item && item.correct_response.includes(item.user_answer) && item.user_answer == value){
    bg = 'border border-2 border-success';
  }
  else if(item && item.user_answer == value){
    bg = 'border border-2 border-danger';
  }
  if(item && item.correct_response.includes(value)){
    bg = 'border border-2 border-success';
  }
  return (
    '<label for="' +
    index +
    '" class="bg-light '+bg+'">' +
    '<div class="form-check">' +
    '<input class="form-check-input m-2" type="radio" name="answer" value="' +
    value +
    '" id="' +
    index +
    '">' +
    '<span class="fw-bold">' +
    value.toUpperCase() +
    '. </span>' +
    '<label class="form-check-label p-2 w-100 ms-2 bg-secondary" style="--bs-bg-opacity: .1;" for="' +
    index +
    '">' +
    answerOption +
    '</label>' +
    '</div>' +
    '</label>'
  );
}

$('#next').on('click', function () {
  var selectedAnswer = $(document).find('input[name=answer]:checked').val();
  if (!selectedAnswer) {
    showMessage('danger', 'Please select and option');
    return false;
  }
  $('#collapseOne').removeClass('show');
  if (currentQuestionIndex < questions.length - 1) {
    questions[currentQuestionIndex].user_answer = selectedAnswer;
    currentQuestionIndex++;
    setQuestion(questions[currentQuestionIndex]);
    $('#questionNumber').html(currentQuestionIndex + 1 + '.');
    $('#quizProgress').html(
      currentQuestionIndex + 1 + ' of ' + questions.length
    );
    $('#previous').removeClass('invisible');
    if (questions[currentQuestionIndex].hasOwnProperty('user_answer')) {
      $(
        'input[name="answer"][value="' +
          questions[currentQuestionIndex].user_answer +
          '"]'
      ).prop('checked', true);
    }
  }
  if (currentQuestionIndex === questions.length - 1) {
    $('#next').addClass('d-none');
    $('#submit').removeClass('d-none');
    console.log('submit');
  }
});

$('#submit').on('click', function () {
  var selectedAnswer = $(document).find('input[name=answer]:checked').val();
  if (!selectedAnswer) {
    showMessage('danger', 'Please select and option');
    return false;
  }
  questions[currentQuestionIndex].user_answer = selectedAnswer;
  var correctQuestions = questions.filter((item) =>
    item.correct_response.includes(item.user_answer)
  ).length;
  $('#quizBlock').addClass('d-none');
  $('#resultBlock').removeClass('d-none');
  $('#result').html(correctQuestions + '/' + questions.length);
  var summary = '';
  $('#summary').html();
  questions.forEach((item,index) => {
    summary = summary + summaryBlock(item,index)
  })
  $('#summary').append(summary);
});

function summaryBlock(item,index){
  var optionChar = 'a';
  var optionHtml = '';
  item.prompt.answers.forEach((item1, index1) => {
    optionHtml += setAnswers(optionChar, item1, index1,item);
    optionChar = String.fromCharCode(optionChar.charCodeAt(0) + 1);
  });
  return '<div class="question bg-white p-3 border-bottom d-flex">'+
  '<div class="pe-1">'+
    '<span class="mt-1" id="questionNumber">'+(index+1)+'. </span>'+
  '</div>'+
  '<div>'+
    '<span class="mt-1" id="question">'+item.prompt.question+'</span>'+
    '<div class="d-grid gap-3 mt-2" id="options">'+optionHtml+'</div>'+
    '<div class="accordion mt-2" id="accordionExample">'+
      '<div class="accordion-item">'+
        '<h2 class="accordion-header" id="headingOne">'+
          '<button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapse'+index+'" aria-expanded="true" aria-controls="collapse'+index+'">Show Explanation</button>'+
        '</h2>'+
        '<div id="collapse'+index+'" class="accordion-collapse collapse"  aria-labelledby="headingOne" data-bs-parent="#accordionExample">'+
          '<div class="accordion-body" id="explanation">'+
              item.prompt.explanation +
          '</div>'+
        '</div>'+
      '</div>'+
    '</div>'+
  '</div>'+
'</div>'
}

$('#nextSet').on('click', function () {
  $('#quizSet')
    .val(++selectedQuiz)
    .trigger('change');
  $('#quizBlock').removeClass('d-none');
  $('#resultBlock').addClass('d-none');
  $('#next').removeClass('d-none');
  $('#submit').addClass('d-none');
});

$('#previous').on('click', function () {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    setQuestion(questions[currentQuestionIndex]);
    $('#questionNumber').html(currentQuestionIndex + 1 + '.');
    $('#quizProgress').html(
      currentQuestionIndex + 1 + ' of ' + questions.length
    );
    $(
      'input[name="answer"][value="' +
        questions[currentQuestionIndex].user_answer +
        '"]'
    ).prop('checked', true);
    $('#next').removeClass('d-none');
    $('#submit').addClass('d-none');
  }
  if (currentQuestionIndex === 0) {
    $('#previous').addClass('invisible');
  }
});

function showMessage(status, message) {
  status = status === 'success' ? 'primary' : 'danger';
  var toastConetent =
    '<div id="liveToast" class="toast align-items-center text-bg-' +
    status +
    '" role="alert" aria-live="assertive" aria-atomic="true">' +
    '<div class="d-flex">' +
    '<div class="toast-body">' +
    message +
    '</div>' +
    '<button type="button" class="btn-close me-2 m-auto btn-close-white" data-bs-dismiss="toast" aria-label="Close"></button>' +
    '</div>' +
    '</div>';
  $('.toastHolder').html(toastConetent);
  var toast = new bootstrap.Toast($(document).find('#liveToast'));

  toast.show();
}
