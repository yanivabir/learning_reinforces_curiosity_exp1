// Javascript functions and varialbes for measuring ratings about questions
var rating_ITI = 500
// This is the list of probes each question should be rated on
var rating_probes = [{
    prompt: "How curious are you to know the answer to this question?",
    labels: ["0<br>Know","1<br>Not at all", "2", "3", "4", "5<br>Very much"],
    required: true,
    name: "curiousity_rating"

  },
]

// Rating trial
var rating_trial = [fullscreen_prompt,
  {
    // Curiosity rating
    type: "html-button-response",
    stimulus: function() {
      return "How curious are you to know:<br>" + 
        jsPsych.timelineVariable('question', true) +
        ""} ,
    choices: ["0","1", "2", "3", "4", "5"],
    prompt: "<div id='satisfaction_prompt'><i>0</i> = Know, <i>1</i> = Not at all, <i>5</i> = Extremely curious</div>",
    margin_horizontal: "30px",
    margin_vertical: "80px",
    post_trial_gap: rating_ITI,
    data: {
      category: "curiosity_rating",
      questionId: jsPsych.timelineVariable('questionId'),
      type: jsPsych.timelineVariable('type'),
      block: jsPsych.timelineVariable('block')
    }
  },
]

// Rating instructions
var rating_instructions = {
  type: "instructions",
  pages: [
    "<div id='instruct'><p>In the next part of this experiment, you will be \
    presented with 30 qustions. We would like you to rate each of these \
    questions on several scales.</p></div>",
    "<div id='instruct'><p>If you are 100% confident that you know the answer \
    to the question press 'Know' instead of rating your curiosity to the question. \
    Only use this option for question you are absolutely sure you know the answer to. </p></div>",
    "<div id='instruct'><p>In this study we are interested in your own personal \
    judgment. Therefore it is important that you rely only on your own \
    knowledge and give your best answer \"off the top of your head.\"</p></div>",
    "<div id='instruct'><p>Press the <i>Next</i> button to begin this part of \
    the experiment.</p></div>"
  ],
  show_clickable_nav: true,
  allow_keys: false,
  data: {
    category: "rating_instructions1"
  }
}

var post_rating_qs = jsPsych.randomization.shuffle([{
          prompt: "Trivia about animals",
          labels: ["1<br>Not at all", "2", "3", "4", "5<br>Very interesting"],
          required: true,
          name: "post_animals"
        },
        {
          prompt: "Trivia about geography",
          labels: ["1<br>Not at all", "2", "3", "4", "5<br>Very interesting"],
          required: true,
          name: "post_geography"
        },
        {
          prompt: "Trivia about the arts",
          labels: ["1<br>Not at all", "2", "3", "4", "5<br>Very interesting"],
          required: true,
          name: "post_art"
        },
        {
          prompt: "Trivia about food",
          labels: ["1<br>Not at all", "2", "3", "4", "5<br>Very interesting"],
          required: true,
          name: "post_food"
        }]);

var post_rating = {
  type: "survey-likert",
  preamble: '<div id="instruct"><p>Plese rate how interesting you found the information, both waiting and rating tasks, presented so far for each topic in this study:</p></div>',
  randomize_question_order: true,
  scale_width: 500,
  data: {
    category: "post_task_preferences"
  },
  timeline: [
    {questions: post_rating_qs.splice(0,2)},
    {questions: post_rating_qs}
  ]
  }