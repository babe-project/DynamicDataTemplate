// customize the experiment by specifying a view order and a trial structure
exp.customize = function () {

    // record current date and time in global_data
    this.global_data.startDate = Date();
    this.global_data.startTime = Date.now();
    // specify view order
    this.views_seq = [
        intro,
        instructions,
        practice,
        beginMainExp,
        main,
        /*loop([practice,
        beginMainExp,
        main], 2),*/
        postTest,
        thanks
    ];

    // prepare information about trials (procedure)
    // Use ES6 Promise
    const practice_trial_promise = fetch('https://babe-demo.herokuapp.com/api/retrieve_custom_record/2');
    const main_trial_promise = fetch('https://babe-demo.herokuapp.com/api/retrieve_custom_record/3');

    Promise
        .all([practice_trial_promise, main_trial_promise])
        .then((responses) => Promise.all(responses.map((res) => res.json())))
        .then(([practice_trials, main_trials]) => {
            this.trial_info.practice_trials = practice_trials;
            // randomize main trial order, but keep practice trial order fixed
            this.trial_info.main_trials = _.shuffle(main_trials.concat(practice_trials));
        })

    // adds progress bars to the views listed
    // view's name is the same as object's name
    this.progress_bar_in = ['main'];
    // this.progress_bar_in = ['practice', 'main'];
    // styles: chunks, separate or default
    this.progress_bar_style = 'default';
    // the width of the progress bar or a single chunk
    this.progress_bar_width = 100;
};