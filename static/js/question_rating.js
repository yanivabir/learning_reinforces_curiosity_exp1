// Javascript functions and varialbes for meusring ratings about questions
var rating_ITI = 500
// This is the list of probes each question should be rated on
var rating_probes = [{
    prompt: "How curious are you to know the answer to this question?",
    labels: ["1<br>Not at all", "2", "3", "4", "5<br>Very much"],
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
      return "How curious are you to know:<br><i>" + 
        jsPsych.timelineVariable('question', true) +
        "</i>"} ,
    choices: ["1", "2", "3", "4", "5"],
    prompt: "<div id='satisfaction_prompt'><i>1</i> = Not at all, <i>5</i> = Extremely curious</div>",
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
    presented with 20 qustions. We would like you to rate each of these \
    questions on several scales.</p></div>",
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