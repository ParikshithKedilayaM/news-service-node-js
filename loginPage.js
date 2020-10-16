const header = `<head>
<meta charset="UTF-8">
<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate" />
<meta http-equiv="Pragma" content="no-cache" />
<meta http-equiv="Expires" content="0" />
<title>
    Activity2 pkedilay
</title>
</head>`;

function headerPanel(username, role) {
    return (`<div><p>Welcome ${username}, you are logged in as a ${role}</p></div>
                <div><a href = "/logout"> Logout </a></div>`);
}

function loginPage(username='', role='') {
    return (
        `<!DOCTYPE html>
        <html>
        
        ${header}
        
        <body>
            <form action="/login" method="POST">
                <div>
                    <label for="username">Username: </label>
                    <input type="text" name="username" value= "${username}" required />
                </div>
                <div>
                    <label for="password">Password: </label>
                    <input type="password" name="password" required />
                </div>
                <div>
                    
                    <input type="radio" name="role" value="author" ${isChecked('author', role)} />
                    <label for="author">Author </label>
                
                    
                    <input type="radio" name="role" value="guest" ${isChecked('guest', role)} />
                    <label for="guest">Guest </label>
                
                    
                    <input type="radio" name="role" value="subscriber" ${isChecked('subscriber', role)} />
                    <label for="subscriber" default>Subscriber </label>
                </div>
                <div>
                    <input type="submit" value="Log In" />
                </div>
            </form>
        </body>
        
        </html>`
    );
};

function isChecked(option, role) {
    if (option === role || (role === '' && option === 'guest')) {
        return 'checked';
    }
    return '';
}

function errorPage() {
    return (
        `<!DOCTYPE html>
        <html>
        
        ${header}
        
        <body>
            
            <div>
                <h1>
                    Username or Password Incorrect
                </h1><br />
                <h3>
                    <a href = "/">Click here to login again</a>
                </h3>
            </div>
        
        </body>
        
        </html>`
    )
}

module.exports = {loginPage, errorPage, header, headerPanel};