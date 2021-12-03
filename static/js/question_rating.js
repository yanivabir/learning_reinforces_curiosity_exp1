// Javascript functions and varialbes for meusring ratings about questions

// This is the list of probes each question should be rated on
var rating_probes = [{
    prompt: "...something that has an element of randomness",
    labels: ["1<br>Not at all", "2", "3", "4", "5", "6", "7<br>Very much"],
    required: true,
    name: "epstm_random_element"
  },
  {
    prompt: "...knowable in principle, given enough information",
    labels: ["1<br>Not at all", "2", "3", "4", "5", "6", "7<br>Very much"],
    required: true,
    name: "epstm_knowable"
  },
  {
    prompt: "...determined by chance factors",
    labels: ["1<br>Not at all", "2", "3", "4", "5", "6", "7<br>Very much"],
    required: true,
    name: "epstm_detemined_chance"
  },
  {
    prompt: "…something that well-informed people would agree on",
    labels: ["1<br>Not at all", "2", "3", "4", "5", "6", "7<br>Very much"],
    required: true,
    name: "epstm_informed_agree"
  },
  {
    prompt: "...something that would be useful for me to know",
    labels: ["1<br>Not at all", "2", "3", "4", "5", "6", "7<br>Very much"],
    required: true,
    name: "useful_me"
  },
  {
    prompt: "...something that would be useful for the average person to know",
    labels: ["1<br>Not at all", "2", "3", "4", "5", "6", "7<br>Very much"],
    required: true,
    name: "useful_average"
  }
]

// Rating trial
var rating_trial = [fullscreen_prompt,
  // Introduce questions
  {
    type: "html-button-response",
    stimulus: function() {
      return "<div id='instruct'><p>We are interested in your judgment about this question:</p>\
      <p><i>" + jsPsych.timelineVariable('question', true) + "</i></p></div>"
    },
    choices: ["Continue"],
    data:{
      category: "rating_intro_question",
      questionId: jsPsych.timelineVariable('questionId')
    }
  },
  // First page of probes
  {
    type: "survey-likert",
    preamble: function() {
      return "<p><i>" + jsPsych.timelineVariable('question', true) + "</i></p>\
      <p>The answer to the question above is…</p>"
    },
    questions: function() {
      return jsPsych.timelineVariable('probes', true).slice(0, 3)
    },
    scale_width: 400,
    post_trial_gap: 100,
    data:{
      category: "rating_question1",
      questionId: jsPsych.timelineVariable('questionId')
    }
  },
  // Second page of probes
  {
    type: "survey-likert",
    preamble: function() {
      return "<p><i>" + jsPsych.timelineVariable('question', true) + "</i></p>\
      <p>The information in the question above is…</p>"
    },
    questions: function() {
      return jsPsych.timelineVariable('probes', true).slice(3, 6)
    },
    scale_width: 400,
    post_trial_gap: 300,
    data:{
      category: "rating_question2",
      questionId: jsPsych.timelineVariable('questionId')
    }
  }
]

// Rating instructions
var rating_instructions = {
  type: "instructions",
  pages: [
    "<div id='instruct'><p>In the next part of this experiment, you will be \
    presented with 20 qustion. We would like you to rate each of these \
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
