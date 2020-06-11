#!/usr/local/bin/python3

from cgitb import enable 
enable()

from cgi import FieldStorage
from html import escape
from hashlib import sha256
from time import time
from shelve import open
from http.cookies import SimpleCookie
import pymysql as db

form_data = FieldStorage()
username = ''
result = ''
if len(form_data) != 0:
    username = escape(form_data.getfirst('username', '').strip())
    password = escape(form_data.getfirst('password', '').strip())
    if not username or not password:
        result = '<p>Error: user name and password are required</p>'
    else:
        sha256_password = sha256(password.encode()).hexdigest()
        try:
            connection = db.connect('cs1.ucc.ie', 'eg6', 'naika', 'cs6503_cs1106_eg6')
            cursor = connection.cursor(db.cursors.DictCursor)
            cursor.execute("""SELECT * FROM users2 
                              WHERE username = %s
                              AND password = %s""", (username, sha256_password))
            if cursor.rowcount == 0:
                result = '<p>Error: incorrect user name or password</p>'
            else:
                cookie = SimpleCookie()
                sid = sha256(repr(time()).encode()).hexdigest()
                cookie['sid'] = sid
                session_store = open('sess_' + sid, writeback=True)
                session_store['authenticated'] = True
                session_store['username'] = username
                session_store.close()
                result = """
                   <p>Succesfully logged in!</p>
                   <p>Welcome back!</p>
                   <ul>
                       <li><a href="feedback.py">Feedback form - Members only.</a></li> 
                       <li><a href="logout.py">Logout</a></li>
                   </ul>"""
                print(cookie)
            cursor.close()  
            connection.close()
        except (db.Error, IOError):
            result = '<p>Sorry! We are experiencing problems at the moment. Please call back later.</p>'
        
print('Content-Type: text/html')
print()
print("""
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="utf-8" />
            <link rel="stylesheet" href="styles.css" />
            <title>Login</title>
        </head>
        <body>
        <header>
            <figure>
                <a href="register.py"><p>Dont have an account? Click Here</p></a>
                
                <a href="index.html"><img id="logo"  src="images/logo.png" 
                title="logo" 
                alt="An image of our logo, the space invader alien."/></a>

                <h1>
                    Retro Arcade Games
                </h1>
            
            </figure>
        </header>
            <h2>Log In</h2>
            <form action="login.py" method="post">
                <figure>
                <label for="username">User name: </label>
                <input type="text" name="username" id="username" value="%s" />
                </figure>
                
                <figure>
                <label for="password">Password: </label>
                <input type="password" name="password" id="password" />
                </figure>

                <figure>
                <input type="submit" value="Login" />
                </figure>
            </form>
            %s
            <footer>&copy; Retro Arcade Games Ltd.</footer>
        </body>
    </html>""" % (username, result))