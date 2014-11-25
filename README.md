1plus1
======
Web-based tool for generating pairings based on teams.

## Installation

Run the following command to install dependencies:
```bash
$ npm install
```

Next, run the next command to run the app:
```bash
$ node app
```

## Usage
1. Set up the teams by filling out and submitting the form for each team.
2. Click the "Generate Pairs" button to generate pairs for the following weeks.
3. You can keep clicking "Generate Pairs" to create more pairs.

## Strategy
My strategy was to develop a heuristic to find good pairs, score the results, then use a greedy algorithm to determine
the pairs. The following is the description given of what the ideal algorithm should behave like:

* Every person in the organization should participate in a 1+1 pair each week.
* Every person should only participate in a single 1+1 pair per week (remember, people can be members of multiple teams).
* The same two teammates should not be paired together in consecutive weeks.
* Teammates should be paired with equal frequency: if **A** and **B** are paired together this week, **A** shouldn't be paired with **B** again until **A** has paired with every other person on the team.

In designing a heuristic, I took into account that the third condition could not be satisfied with a two person team
if one of the teammates was only a member of that one team. Therefore, I adjusted the requirements a bit and
allowed non-teammates to be paired up with each other if it meant not having the same people paired up in
subsequent weeks.

So with that in mind, the first heuristic generated teams with the following criteria:

1. Did not exist the week before
2. If there were valid pairs with teammates -- that is, the team consisted of more than two people -- it deleted any pairs with other teams

Scoring the pairs was determined based on the following algorithm:
1. Figure out how long it has been since the last pairing.

## Testing
The only thing that is tested is the algorithm, as everything else is rather simple and already has unit tests written for it.
I used my existing module [Preston](http://ian.pw/preston) for the backend and [Restangular](https://github.com/mgonto/restangular) for the frontend, so I did not need to test any database code.

You can run the tests using Mocha with the following:

```bash
$ npm test
```

## Other Notes

