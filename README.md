# README: SER 421 Lab 2 pkedilay

To grade, use the code in the Extra Credits folder for the required functionality with Extra Credits functionalities.

If something fails, use code in this (root) folder.

## C4: How to instantiate

1. How to instantiate newsStore object:

    `const newsStore = require('./NewsService');`

    `const store = new newsStore.newsStore();`
2. Invoking APIs

    `newsStoreObj.writeNewNewsStory('Parikshith', 'Software Engineering', true, 'This is a sample work', new Date());`

    `newsStoreObj.updateHeadlineOfNewsStory(0, 'Web Development');`

    `newsStoreObj.changeContentOfExistingNewsStory(0, 'Dr. Gary', 'Socket Programming', false, 'Networking in Java', new Date(2018, 07, 01));`

    `newsStoreObj.deleteAnExistingNewsStory(0);`

    `newsStoreObj.getNewsByFilter('Web Development', 'Parikshith', new Date(1999, 01, 01), new Date(1999, 10, 10));`

## To Test Activity 1

I have used module exports, so the code can be tested directly by running

`node NewsService_test.js`

Instructions to run `node .load` way for `NewsService.js` is written in the file itself.

## To Test Activity 2

1. Run the following command to start the server:

    `node activity2.js`
2. Then go to `http://localhost:3000` on your web browser to access the application

3. Use these user details to login:
    1. Username: `guest` Password: `guest` Role: `Guest`
    2. Username: `subscriber` Password: `subscriber` Role: `Subscriber`
    3. Username: `author` Password: `author` Role: `Author`
    4. Username: `author1` Password: `author1` Role: `Author`
    5. Username: `author2` Password: `author2` Role: `Author`

## Some Important Information

1. Logs are written once every 5 seconds into `activity2.log` file
2. To test Activity 1 using test file, `news.txt` must be empty. This is done to get persistent results, so first two lines of code in
`ExtraCredits` > `NewsService_test.js` has been added to flush out any old data in that file.
