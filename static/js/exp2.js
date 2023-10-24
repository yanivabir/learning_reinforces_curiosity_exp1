// Parameters
var sess = 2,
  version = 1.01
var images = [];

// ------- Determine subject level variables ----- //
var PID = jsPsych.data.getURLVariable('workerId');

// Is this a debug run?
var debug = PID.includes("debug");

// Keep important variables in global scope for convenience
var viewed_answers;

// Load items from local csv file
Papa.parse("../static/secSessStims/S" + PID + "_secondSessStims.csv", {
  download: true,
  header: true,
  dynamicTyping: true,
  complete: function(results) {
    viewed_answers = results.data;
    postLoad();
  },
  error: function() {
    document.body.innerHTML = "<div id='instruct'><p>Sorry, an error has occured while trying to retrieve your data.</p>\
      <p>Please contact ya2402+mutrk@columbia.edu to resolve this issue.</p>\
      <p>Thank you!</p></div>"
  }
});

var experiment = [];

function preventRefresh(e) {
  // Cancel the event
  e.preventDefault();
  e.returnValue = '';
}


// Execute all of this experiment prep and run after we load items from local
// csv file
function postLoad() {

  // Fullscreen experiment, save PID, counterbalancing
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
        sess: sess,
        version: version
      });
    }
  }

  var welcome = {
    type: "instructions",
    pages: [
      "<div id='instruct'><p>Welcom back to this study!</p>\
      <p>On week ago, you completed a task abour to your curiosity \
      towards different questions.</p>\
      <p>Today, we are interested in your memory of the previous session. \
      Throughout this session, you will be asked to recall \
      the reading material from last week.</p></div>",
      "<div id='instruct'><p>When prompted, please try your best to remember \
      the relevant piece of information from last week.</p><p>We will be going over \
      responses, and awarding a $1 bonus payment only to participants who made a sincere \
      effort at remembering.</p><p>This bonus will be processed within 48 hours from \
      completing this session.</p></div>"
    ],
    show_clickable_nav: true,
    allow_keys: false,
    data: {
      category: 'welcome'
    },
    post_trial_gap: 200
  };

  // Shuffle questions for recall
  viewed_answers = jsPsych.randomization.shuffle(viewed_answers);

  // Answer recall block
  var answer_recall_block = {
    timeline: recall_trial,
    timeline_variables: viewed_answers
  }

  // Debriefing and data upload
  // Removed debrief about corona
  var debrief = [{
      type: "instructions",
      pages: ['<div id="instruct">Thank you for participating in this experiment!<p>\
      In this study we were interested in people\'s curiosity about different \
      types of questions.</p>\
      <p>We will process your data within 48h and grant you an extra $1 to any \
      participant that made an honest attempt at recalling previous answers.</p></div>'],
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
            function() {
              window.removeEventListener('beforeunload', preventRefresh);
              window.location.replace("https://connect.cloudresearch.com/participant/project/974ea70e0fd84155994561b4db92102c/complete" + 
              window.location.search)
        });
          });
      }
    }
  ];


  // Put it all together
  // Removed corona recall block, pre-questionnaire message, gallup block, anxiety questionnaire, corona perception block, and demographic block.
  experiment.push(fullscreen);
  experiment.push(welcome);
  experiment.push(recall_instructions1);
  experiment = experiment.concat(answer_recall_block);
  experiment = experiment.concat(debrief);

  // Prevent right click, refresh
  if (!debug) {
    // Prevent right-click
    document.addEventListener('contextmenu', event => event.preventDefault());

    // Prompt before refresh
    window.addEventListener('beforeunload', preventRefresh);

  }

  // Initiate experiment
  jsPsych.init({
    timeline: experiment,
    preload_images: images
  });

}
