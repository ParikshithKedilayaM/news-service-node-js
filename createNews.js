const header = require('./loginPage');

function createNews(username, role) {
    return (`
        <!DOCTYPE html>
        <html>
        ${header.header}
            <body>
            ${header.headerPanel(username, role)}
                <h2>Enter the story below</h2>
                <form action="/saveNews" method="POST">
                    <label>Title:</label> <input type="text" name="title" /><br />
                    <label>Content:</label> <br /><textarea name="storyContent" ></textarea><br />
                    <label>Public?</label> 
                    <input type="radio" name="isPrivate" value="false" checked />No
                    <input type="radio" name="isPrivate" value="true" />Yes
                    <br />
                    <label>Date: </label><input type="datetime-local" name="date" required />
                    <br />
                    <input type="submit" value="Save" />
                    
                </form>
                <form action="/dashboard" method="GET">
                    <button type="submit" >Cancel</button>
                </form>
            </body>
        </html>
    `)
}

module.exports ={ createNews };