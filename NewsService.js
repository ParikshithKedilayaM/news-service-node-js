function newsStory (id, author, title, isPublic, storyContent, date) {
    
    this.id = id;
    this.author = author;
    this.title = title;
    this.isPublic = isPublic;
    this.storyContent = storyContent;
    this.date = date;
}

function newsStore () {

    this.news = [];
    this.index = 0;
    
    this.writeNewNewsStory = (author, title, isPublic, storyContent, date) => {
        try {
            this.news[this.index] = new newsStory(this.index++, author, title, isPublic, storyContent, date);
        } catch (error) {
            throw "Failed to write story, Please try again!";
        }
    }
    
    this.updateHeadlineOfNewsStory = (id, newTitle) => {
        try {
            this.news[id].title = newTitle;
        } catch (error) {
            throw `${id} does not exist`;
        }
    }
    
    this.changeContentOfExistingNewsStory = (id, author, title, isPublic, storyContent, date) => {
        try {
            this.news[id].author = author,
            this.news[id].title = title,
            this.news[id].isPublic = isPublic,
            this.news[id].storyContent = storyContent,
            this.news[id].date = date;
        } catch (error) {
            throw `${id} does not exist`;
        }
    }
    
    this.deleteAnExistingNewsStory = (id) => {
        try {
            if (this.news[id] === undefined) {
                throw error
            }
            delete this.news[id];
        } catch (error) {
            throw `${id} does not exist`;
        }
    }
    
    this.getNewsByFilter = (filterTitle, filterAuthor, startDate, endDate) => {
        var resultArray = [];
        for (let i in this.news) {
            if (filterAuthor !== undefined && this.news[i].author !== filterAuthor) {
                continue;
            }
            if (filterTitle !== undefined && !this.news[i].title.includes(filterTitle)) {
                continue;
            }
            if (startDate !== undefined && endDate !== undefined 
                && !(this.news[i].date.getTime() >= startDate.getTime() && this.news[i].date.getTime() <= endDate.getTime())) {
                    continue;
            }
            resultArray.push(this.news[i]);
        }
        return resultArray;
    }
}

module.exports = {newsStore}; // comment this if using .load