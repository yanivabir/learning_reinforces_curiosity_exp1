// Parameters
var sess = 1, // Session number
  version = 1.0, // Code version number
  n_for_ratings = 5; // How many items to save for rating measurement
var images = ["../static/images/wait_instructions.jpg"]; // Images to preload

// Get participant id form url
var PID = jsPsych.data.getURLVariable('workerId')



// Is this a debug run?
var debug = PID.includes("debug");

// Keep important variables in global scope for convenience while debugging
var items,
  items,
  items_waiting,
  items_rating;

// Load questions from local csv file
Papa.parse("../static/questions.csv", {
  download: true,
  header: true,
  dynamicTyping: true,
  complete: function(results) {
    items = results.data;
    postLoad()
  }
});

var experiment = [];

// Loading csvs takes time. That's why we wrap everything else in a function that only
// runs after the csvs load
function postLoad() {
var practice_items=[]
  var Categories = jsPsych.randomization.shuffle(
    ["Animal", "Art", "Food", "Geography"])
  for (i=0;i<4;i++)
  {practice_items.push (jsPsych.randomization.shuffle(
    items).filter(x => x['type'] == Categories[i]).splice(0,1))}
// Remove them from general list
items = items.filter(x => !practice_items.includes(x));
  

  // Split items to curiosity and ratings sets ----
  // First shuffle items makeing sure both types are evenly disperesed throughout list
  items = pseudoShuffle(items, Categories, 12);


  // Choose items for wtw task and ratings for each block
  items_waiting = items.slice(0,
    items.length - n_for_ratings);
  items_rating = items.slice(
    items.length - n_for_ratings, items.length);



  // Set timing parameters for waiting task practice block
  practice_items = drawTimes(practice_items);

  // Draw timing parameters for waiting task
  items_waiting = drawTimes(items_waiting);

  // Set up the first trial, the transitions to fullscreen.
  // This trial also saves the PID to the data, and sets the counterbalanced
  // order of blocks.
  var fullscreen = {
    type: 'fullscreen',
    fullscreen_mode: true,
    message: '<p>This study runs in fullscreen. To switch to full screen mode \
      and start the experiment, press the button below.</p>',
    on_finish: function() {
      // Hide mouse
      var stylesheet = document.styleSheets[0];
      // stylesheet.insertRule("* {cursor: none;}", stylesheet.cssRules.length);
      jsPsych.data.addProperties({
        n_warnings: 0,
        PID: PID,
        firstBlock: firstBlock,
        sess: sess,
        version: version
      });
    }
  }

  // Welcome message
  var welcome = {
    type: "html-button-response",
    stimulus: "<div id='instruct'><p>In this study, you will be asked to complete \
      several tasks and answer multiple questions. Throughout the study, we are \
      interested in your own personal judgments, views and knowledge.</p>\
      <p>It is important that you stay engaged throughout this study. We will\
      monitor the data for use of other apps or lack of attention, and give \
      an extra $2 bonus for full engagement with the task.</p><p>Thank you for\
      participating!</p></div>",
      choices: ["Continue"],
      margin_vertical: "80px",
      data: {
        category: 'welcome'
      },
      post_trial_gap: 200
  }

  // Build waiting task blocks
  wait_practice_block = {
    timeline: wait_timeline,
    timeline_variables: practice_items
  }

  wait_block1 = {
    timeline: wait_timeline,
    timeline_variables: items_waiting 
  }

  wait_block2 = {
    timeline: wait_timeline,
    timeline_variables: firstBlock == "corona" ? items_waiting : items_waiting
  }

  wait_block3 = {
    timeline: wait_timeline,
    timeline_variables: third_block_items_waiting
  }

  // Building rating block
  var items_rating = items_rating.concat(items_rating).concat(third_block_items_rating);

  // Shuffle probe order across trials
  for (i = 0; i < items_rating.length; i++) {
    items_rating[i]["probes"] =
      jsPsych.randomization.shuffle(rating_probes);
  }

  // Rating block variable
  var rating_block = {
    timeline: rating_trial,
    timeline_variables: items_rating,
    randomize_order: true
  }

  // Message that shows up before the questionnaire section
  var pre_questionnaires_message = {
    type: "html-button-response",
    stimulus: '<div id="instruct"><p>For the last part of the experiment, we ask \
      you to answer a few questions about your opinions and beliefs, and about \
      yourself.</p><p>Please answer these questions as truthfully and accurately \
      as possible</p></div>',
      choices: ["Continue"],
      margin_vertical: "80px",
      data: {
        category: 'pre_questionnaires_message'
      },
      post_trial_gap: 200
  }

  // Debriefing and data upload
  var debrief = [{
      type: "instructions",
      pages: ['<div id="instruct">Thank you for participating in this experiment!<p>\
      In this study we were interested in people\'s curiosity about different \
      types of questions.</p>\
      <p>Any health information presented in this experiment was based on the \
      researchers’ reading of current publicly available information from the \
      Center for Disease Control and other reputable health and news media \
      websites but should not be taken as medical advice. If you have any \
      questions about your health, you should seek the judgment of a medical \
      professional.</p>\
      <p>We will process your data within 48h and grant you an extra $2 to any \
      participant that stayed engaged throughout the task.</p>\
      <p>You will recieve an email invitiation for the next session early next week.</p>\
      <p>You\'ll  recieve $2 special bonus for participating in another session.</p></div>'],
      show_clickable_nav: true,
      allow_keys: false,
      data: {
        category: "debrief"
      }
    },
    {
      type: 'fullscreen',
      fullscreen_mode: false
    },
    {
      type: "instructions",
      pages: ["<div id ='instruct'><p>Once you press the <i>Next</i> \
    button, your results will be uploaded to the server, and the experiment will\
    complete. <b>This may take several minutes - do not \
    refresh or close your browser during this time.</b></p>\
    <p>After your results are uploaded to the server, you will be presented \
    with the completion code for MTurk.\
    <p>Press the <i>Next</i> button to upload your results.</p></div>"],
      show_clickable_nav: true,
      allow_keys: false,
      data: {
        category: "debrief"
      }
    },
    {
      type: "html-keyboard-response",
      data: {
        category: "save_data"
      },
      stimulus: "<div id='instruct'><p>Data uploading. To ensure proper completion \
      of the experiment, please don't refresh, \
      close your browser or open another tab.\
      </p></div>",
      choices: jsPsych.NO_KEYS,
      on_load: function() {
        var d = new Date;
        saveData(PID, sess, '', jsPsych.data.get().csv(),
          function() {
            saveData(PID, sess, '_int', jsPsych.data.getInteractionData().csv(),
          jsPsych.finishTrial);
          });
      }
    },
    {
      type: "html-keyboard-response",
      data: {
        category: "data_saved"
      },
      stimulus: "<div class='instructions'><p>Your results have successfully uploaded.</p>\
    <p>Your completion code for this study is: <br> <b>EK64HN7</b></p>\
    <p>Use it to submit this HIT on MTurk.</p>\
    <p>You may now close this window.</p></div>",
      choices: jsPsych.NO_KEYS
    }
  ];


  // Put it all together
  experiment.push(fullscreen);
  // experiment.push(welcome);
  // experiment = experiment.concat(wait_instructions1);
  // experiment.push(wait_practice_block);
  experiment.push(wait_instructions_post_practice);
  experiment.push(wait_block1);
  // experiment.push(wait_instructions2);
  // experiment.push(wait_block2);
  // experiment.push(wait_instructions2);
  // experiment.push(wait_block3);
  // experiment.push(rating_instructions);
  // experiment.push(rating_block);
  // experiment.push(forced_choice_instructions1);
  // experiment = experiment.concat(forced_choice_trial);
  // experiment.push(forced_choice_instructions2);
  // experiment.push(read_fact_block);
  // experiment.push(pre_questionnaires_message);
  // experiment = experiment.concat(five_d);
  // experiment = experiment.concat(gallup_block);
  // experiment = experiment.concat(resilience_quest);
  // experiment = experiment.concat(anxiety);
  // experiment = experiment.concat(perception_block);
  // experiment = experiment.concat(demographic_block);
  // experiment = experiment.concat(debrief);

  // Prevent right clicking and refreshing the page
  if (!debug) {
    // Prevent right-click
    document.addEventListener('contextmenu', event => event.preventDefault());

    // Prompt before refresh
    window.addEventListener('beforeunload', function(e) {
      // Cancel the event
      e.preventDefault();
      e.returnValue = '';
    });

  }

  // Initiate experiment
  jsPsych.init({
    timeline: experiment,
    preload_images: images
  });

}
