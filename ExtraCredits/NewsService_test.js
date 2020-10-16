//Adding these two lines to flush out any old data present in the news.txt file
var fs = require('fs');
fs.writeFileSync('./news.txt', '', {encoding:'utf8', flag:'w'});

var newsService = require('./NewsService');
var newsStoreObj = new newsService.newsStore();
// If using .load, comment the above two lines and uncomment below line
// var newsStoreObj = new newsStore();

var allTestCasesPassed = true;

function testWriteNewNewsStory() {
    newsStoreObj.writeNewNewsStory('Parikshith', 'Software Engineering', true, 'This is a sample work', new Date());
    assertEquals(Object.keys(newsStoreObj.news).length, 1);
}

function testUpdateHeadlineOfNewsStory() {
    newsStoreObj.updateHeadlineOfNewsStory(0, 'Web Development');
    assertEquals(newsStoreObj.news[0].title, 'Web Development');
}

function testChangeContentOfExistingNewsStory() {
    newsStoreObj.changeContentOfExistingNewsStory(0, 'Dr. Gary', 'Socket Programming', false, 'Networking in Java', new Date(2018, 07, 01));
    assertEquals(newsStoreObj.news[0].author, 'Dr. Gary');
}

function testDeleteAnExistingNewsStory() {
    newsStoreObj.deleteAnExistingNewsStory(0);
    assertEquals(newsStoreObj.news[0]);
}

function testDeleteAnExistingNewsStoryIfItDoesnotExist() {
    try {
        newsStoreObj.deleteAnExistingNewsStory(10);
        console.log('Failed');
        allTestCasesPassed = false;
    } catch (e) {
        console.log('Passed');
    }
}

function generateDataForFilterTestCases() {
    newsStoreObj.writeNewNewsStory('Parikshith', 'Software Engineering', true, 'This is a sample work', new Date(2000, 01, 01));
    newsStoreObj.writeNewNewsStory('Parikshith', 'Web Development', true, 'This is a sample work', new Date(2020, 01, 01));
    newsStoreObj.writeNewNewsStory('Kedilaya', 'Software Engineering', true, 'This is a sample work', new Date(2019, 01, 01));
    newsStoreObj.writeNewNewsStory('Kedilaya', 'Web Development', true, 'This is a sample work', new Date(2018, 01, 01));
}

function testGetNewsByFilterTitle() {
    let filteredResults = newsStoreObj.getNewsByFilter('Software Engineering');
    assertEquals(filteredResults[0].date.getTime(), new Date(2000, 01, 01).getTime());
    assertEquals(filteredResults[1].date.getTime(), new Date(2019, 01, 01).getTime());
}

function testGetNewsByFilterAuthor() {
    let filteredResults = newsStoreObj.getNewsByFilter(undefined, 'Parikshith');
    assertEquals(filteredResults[0].date.getTime(), new Date(2000, 01, 01).getTime());
    assertEquals(filteredResults[1].date.getTime(), new Date(2020, 01, 01).getTime());
}

function testGetNewsByFilterRangeDate() {
    let filteredResults = newsStoreObj.getNewsByFilter(undefined, undefined, new Date(2018, 01, 01), new Date(2021, 01, 01));
    assertEquals(filteredResults.length, 3);
}

function testGetNewsByFilterTitleAuthor() {
    let filteredResults = newsStoreObj.getNewsByFilter('Web Development', 'Kedilaya');
    assertEquals(filteredResults.length, 1);
}

function testGetNewsByFilterTitleAuthorRangeDate() {
    let filteredResults = newsStoreObj.getNewsByFilter('Web Development', 'Parikshith', new Date(1999, 01, 01), new Date(1999, 10, 10));
    assertEquals(filteredResults.length, 0);
}

function assertEquals(actual, expected) {
    if (actual === expected) {
        console.log('Passed');
    } else {
        console.log('Failed');
        allTestCasesPassed = false;
    }
}

function driverTestCases() {
    testWriteNewNewsStory();
    testUpdateHeadlineOfNewsStory();
    testChangeContentOfExistingNewsStory();
    testDeleteAnExistingNewsStory();
    testDeleteAnExistingNewsStoryIfItDoesnotExist();

    // IMPORTANT: Do this before calling filter test cases
    generateDataForFilterTestCases();

    testGetNewsByFilterTitle();
    testGetNewsByFilterAuthor();
    testGetNewsByFilterRangeDate();
    testGetNewsByFilterTitleAuthor();
    testGetNewsByFilterTitleAuthorRangeDate();

    if (allTestCasesPassed) console.log("All test cases passed");
    else console.log("Some test cases Failed!");
}

// Starts here!
driverTestCases();

