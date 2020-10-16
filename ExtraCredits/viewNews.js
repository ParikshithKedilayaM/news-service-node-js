const header = require('./loginPage');

function viewNews(store, username, role) {
    return (
        `
        <!DOCTYPE html>
        <html>
        ${header.header}
            <body>
                ${header.headerPanel(username, role)}
                ${checkAuthor(role)}
                <hr>
                ${getNewsList(store, role, username).map(n => `${n} <br />`).join('')}
            </body>
        </html>
        `
    )
}

function checkAuthor(role) {
    if (role === 'author') {
        return `<br /><a href="/create">New Story</a>`;
    }
    return '';
}

function getNewsList(store, role, username) {
    let newsList = store.getNewsByFilter();
    if (role === 'subscriber') {
        newsList = newsList.map(element => {
            return element = `<a href="/news/${element.id}"> ${element.title} </a>`;
        });
    } else if (role === 'guest') {
        newsList = newsList.map(element => {
            if (element.isPublic) {
                return `<a href="/news/${element.id}"> ${element.title} </a>`;
            } else {
                return element.title;
            }
        });
    } else {
        newsList = newsList.map(element => {
            if (element.isPublic || element.author === username) {
                return `<a href="/news/${element.id}"> ${element.title} </a>`;
            } else {
                return element.title;
            }
        });
    }
    return newsList;
}

function renderNewsPage(response, news, author, retry, role) {
    if (news === undefined) {
        response.writeHead(404, {"Content-Type": "text/html"});
        response.write(`<h1>404: Page Not Found</h1>`);
        return;
    }
    if ((role === 'guest' && news.isPublic === false) 
        || (role === 'author' && news.author !== author && news.isPublic === false)) {
        response.writeHead(403, {"Content-Type": "text/html"});
        response.write(`<h1>403: Forbidden</h1>`);
        return;
    }
    response.writeHead(200, {
        'Content-type': 'text/html',
        "Cache-Control": "no-cache, no-store, must-revalidate"
    });
    response.write(`<!DOCTYPE html>
    <html>
    ${header.header}
        <body>
            ${header.headerPanel(author, role)}
            ${isRetry(retry)}
            <h2>${news.title}</h2>
            <i> Written by: ${news.author} </i> <br />
            <i> Published on ${news.date} </i>
            <br />
            
            <p>${news.storyContent}</p><br />

            ${deleteButton(news, author)}
        </body>
    </html>`)

}

function isRetry(retry) {
    if (retry === true) {
        return `<h2>Could not delete</h2>`;
    }
    return '';
}

function deleteButton(news, author) {
    if (news.author === author) {
        return `<a href='/delete/${news.id}'>Delete</a>`;
    }
    return ``;
}
module.exports = { viewNews, renderNewsPage };