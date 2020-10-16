const loginPage = require('./loginPage');
const viewNews = require('./viewNews');
const newsStore = require('./NewsService');
const createNews = require('./createNews');
const Logger = require('./Logger');

const http = require('http');
const qs = require('querystring');
const url = require('url');

const httpHeader = {
    'Content-type': 'text/html', 
    "Cache-Control": "no-cache, no-store, must-revalidate"
}

const store = new newsStore.newsStore();

var logger = new Logger();

http.createServer(onRequest).listen(3000);

function onRequest(request, response) {
    try {
        var cookieList = parseCookies(request);
        var username = cookieList['username'];
        var role = cookieList['role'];
        var isLoggedIn = cookieList['isLoggedIn'];
        var requestUrl = url.parse(request.url).pathname;
        var ip = request.connection.remoteAddress;

        if (requestUrl === '/') {
            
            if (isLoggedIn === 'false') {
                response.writeHead(200, httpHeader);
                response.write(`<div><h1>Welcome ${role}: ${username}, Please enter your password</h1></div>
                 ${loginPage.loginPage(username, role)}`);
            } else if (username === undefined || role === undefined || isLoggedIn === undefined) {
                response.writeHead(200, httpHeader);
                response.write(loginPage.loginPage());
            } else {
                logger.emit('userLogin', {username, ip});
                response.writeHead(301, {
                    'Content-type': 'text/html', 
                    "Cache-Control": "no-cache, no-store, must-revalidate",
                    Location: '/dashboard'
                });
            }
            response.end();
        } else if (requestUrl === '/login') {
            validateUser(request, response);
        } else if (isLoggedIn === 'true') {
            if (requestUrl === '/logout') {
                logger.emit('userLogout', {username, ip})
                response.writeHead(200, {
                    'Set-Cookie': [`username=${username};`, `role=${role};`, `isLoggedIn=false;`],
                    'Content-type': 'text/html', 
                    "Cache-Control": "no-cache, no-store, must-revalidate"
                });
                response.write(`<div><h1>Welcome ${role}: ${username}, Please enter your password</h1></div>
                 ${loginPage.loginPage(username, role)}`);
                response.end();
            } else if (requestUrl.includes('/news/')) {
                let uri = requestUrl;
                let id = uri.substring(uri.lastIndexOf('/') + 1);
                viewNews.renderNewsPage(response, store.news[id], username, false, role);
                response.end();
            } else if (role==='author' && requestUrl === '/create') {
                response.writeHead(200,  httpHeader );
                response.write(createNews.createNews(username, role));
                response.end();
            } else if (role==='author' && requestUrl === '/saveNews') {
                saveNews(request, response, username, role);
            } else if (requestUrl === '/dashboard') {
                response.write(viewNews.viewNews(store, username, role));
                response.end();
            } else if (role==='author' && requestUrl.includes('/delete/')) {
                let uri = requestUrl;
                let id = uri.substring(uri.lastIndexOf('/') + 1);
                deleteStory(response, id, username, role);
            } else {
                response.writeHead(404, httpHeader);
                response.write(`<h1>404: Page Not Found</h1>`);
                response.end();
            }
        } else {
            response.writeHead(301, {
                'Content-type': 'text/html', 
                "Cache-Control": "no-cache, no-store, must-revalidate",
                Location: '/'
            });
            response.end();
        }
    } catch (e) {
        logger.emit('errorOccured', {username, ip: request.connection.remoteAddress, error: e});
        response.writeHead(500, httpHeader);
        response.write(`<h1>500: Internal Server Error</h1>`);
        response.end();
    }
}

function parseCookies (request) {
    var list = {},
        rc = request.headers.cookie;

    rc && rc.split(';').forEach(function( cookie ) {
        var parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}


function validateUser(request, response) {
    if (request.method == 'POST') {
        let body = '';
        request.on('data', function (data) {
            body += data;
        });

        request.on('end', function () {
            let post = qs.parse(body);
            username = post.username;
            role = post.role;
            if (userDetails[post.username] !== undefined
                && userDetails[post.username].password === post.password 
                && userDetails[post.username].role === post.role) {
                    logger.emit('userLogin', {username: post.username, ip: request.connection.remoteAddress});
                    response.writeHead(301, {
                        'Set-Cookie': [`username=${post.username};`, `role=${post.role};`, `isLoggedIn=true;`],
                        'Content-type': 'text/html', "Cache-Control": "no-cache, no-store, must-revalidate",
                        Location: '/dashboard'
                    });
                // /response.writeHead(301, { Location: '/dashboard' } );
            } else {
                logger.emit('userLoginFailed', {username, ip: request.connection.remoteAddress});
                response.writeHead(200, httpHeader);
                response.write(loginPage.errorPage());
            }
            response.end();
        });
    } else {
        logger.emit('errorOccured', {username, ip: request.connection.remoteAddress, error: 'User tried GET request'});
        response.writeHead(405, httpHeader);
        response.write(`<h2>405 Method Not Allowed</h2>`);
        response.end();
    }
}

function saveNews(request, response, username, role) {
    if (request.method == 'POST') {
        try {
            let body = '';
            request.on('data', function (data) {
                body += data;
            });

            request.on('end', function () {
                let post = qs.parse(body);
                if (post !== undefined) {
                    store.writeNewNewsStory(username, post.title, (post.isPrivate === 'true'), post.storyContent, new Date(post.date));
                    response.writeHead(301, {
                        'Content-type': 'text/html', 
                        "Cache-Control": "no-cache, no-store, must-revalidate",
                        Location: '/dashboard'
                    });
                    response.end();
                } else {
                    response.writeHead(500, httpHeader);
                    response.write(`
                        <h2>Internal Server Error: Could not save the data. Try again!</h2>
                        ${createNews.createNews(username, role)}
                    `);
                    response.end();
                }
            });
            
        } catch (e) {
            logger.emit('errorOccured', {username, ip: request.connection.remoteAddress, error: e});
            response.writeHead(500, httpHeader);
            response.write(`
                <h2>Internal Server Error: Could not save the data. Try again!</h2>
                ${createNews.createNews(username, role)}
            `);
            response.end();
        }
    } else {
        logger.emit('errorOccured', {username, ip: request.connection.remoteAddress, error: 'User tried GET request'});
        response.writeHead(405, httpHeader);
        response.write(`<h2>405 Method Not Allowed</h2>`);
        response.end();
    }
}

function deleteStory(response, id, username, role) {
    try {
        if (store.news[id] !== undefined && store.news[id].author === username) {
            store.deleteAnExistingNewsStory(id);
        }
        
        response.writeHead(301, { 
            'Content-type': 'text/html', 
            "Cache-Control": "no-cache, no-store, must-revalidate",
            Location: '/dashboard'
        });
        response.end();
    } catch (e) {
        logger.emit('errorOccured', {username, ip: request.connection.remoteAddress, error: e});
        response.writeHead(500, httpHeader);
        viewNews.renderNewsPage(response, store.news[id], username, true, role);
        response.end();
    }
}

const userDetails = {
    'author': {
        username: "author",
        role: "author",
        password: "author"
    },
    'guest': {
        username: "guest",
        role: "guest",
        password: "guest"
    },
    'subscriber': {
        username: "subscriber",
        role: "subscriber",
        password: "subscriber"
    },
    'author1': {
        username: "author1",
        role: "author",
        password: "author1"
    },
    'author2': {
        username: "author2",
        role: "author",
        password: "author2"
    }
}
