# Template for data-related interactions with the server

## Cloning and running the experiment

```
# clone the repo, e.g.:
git clone https://github.com/babe-project/DynamicDataTemplate

# go to 'DynamicDataTemplate'

# open 'index.html' in the browser to see the experiment
```

## Documentation

This template focuses on aspects related to dynamically fetching data from the server during an experiment and manually storing data records on the server for later retrieval. It is based on the [MinimalTemplate](https://github.com/babe-project/MinimalTemplate).

Extensive documentation for the project is provided on the [_babe site](http://babe-project.github.io/babe_site/index.html).

The following sections highlight the aspects of this template which are related to data interaction with the server.

### Manually uploading data to the server

In this example, the data for trials are stored on and fetched from the server instead of loaded locally, as is the case in MinimalTemplate.

- First, the data files `trial_info/main_trials.csv` and `trial_info/practice_trials.json` are uploaded to the server via the [web interface for managing custom records](https://babe-demo.herokuapp.com/custom_records) (click on the "New" button in the interface).
- The data can then be retrieved in JSON format from their respective API endpoints: https://babe-demo.herokuapp.com/api/retrieve_custom_record/2 and https://babe-demo.herokuapp.com/api/retrieve_custom_record/3.

    The relevant code can be found in `experiment.js`
    ```javascript
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
    ```

### Dynamically retrieve previous experiment results

The server allows dynamically retrieving previous results of an experiment. This can be helpful when information from previous cases is needed to generate new trials.

- First, [on the server interface for managing this experiment](https://babe-demo.herokuapp.com/experiments/3/edit), one needs to specify the keys that are to be retrieved. In this case, keys `trial_type` and `option_chosen` are specified.
- The data can then be retrieved in JSON format from the API endpoint: https://babe-demo.herokuapp.com/api/retrieve_experiment/3.

    ```js
    const prevTrialInfoPromise = fetch('https://babe-demo.herokuapp.com/api/retrieve_experiment/3');
    prevTrialInfoPromise
      .then((dataLoad) => dataLoad.json())
      .then(json => console.log(json))
    ```

The function `showPreviousExperimentResults` in `main.js` retrieves all experiment results up to now, calculates the number of times each response was chosen, and displays them in a table after the current experiment is finished.
