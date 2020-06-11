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
    password1 = escape(form_data.getfirst('password1', '').strip())
    confirm = escape(form_data.getfirst('confirm', '').strip())
    if not username or not password1 or not confirm:
        result = '<p>Error: user name and passwords are required</p>'
    elif password1 != confirm:
        result = '<p>Error: passwords must be equal</p>'
    else:
        try:
            connection = db.connect('cs1.ucc.ie', 'eg6', 'naika', 'cs6503_cs1106_eg6')
            cursor = connection.cursor(db.cursors.DictCursor)
            cursor.execute("""SELECT * FROM users2
                              WHERE username = %s""", (username))
            if cursor.rowcount > 0:
                result = '<p>Error: user name already taken</p>'
            else:
                sha256_password = sha256(password1.encode()).hexdigest()
                cursor.execute("""INSERT INTO users2 (username, password) 
                                  VALUES (%s, %s)""", (username, sha256_password))
                connection.commit()
                cursor.close()  
                connection.close()
                cookie = SimpleCookie()
                sid = sha256(repr(time()).encode()).hexdigest()
                cookie['sid'] = sid
                session_store = open('sess_' + sid, writeback=True)
                session_store['authenticated'] = True
                session_store['username'] = username
                session_store.close()
                result = """
                   <p>Succesfully inserted!</p>
                   <p>Thanks for joining Retro Arcade Games! Feel free to give us some feedback below.</p>
                   <ul>
                       <li><a href="feedback.html">Feedback - Members only.</a></li> 
                       <li><a href="logout.py">Logout</a></li>
                   </ul>"""
                print(cookie)
        except (db.Error, IOError):
            result = '<p>Sorry! We are experiencing problems at the moment. Please call back later.</p>'
        
print('Content-Type: text/html')
print()
print("""
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="utf-8" />
            <title>Sign Up</title>
            <link rel="stylesheet" href="styles.css" />
        </head>
        <body>
            </head>
    <body>
    <header>
        <figure>
            <a href="login.py"><p>Already signed up? Log in!</p></a>
            
            <a href="index.html"><img id="logo"  src="images/logo.png" 
            title="logo" 
            alt="An image of our logo, the space invader alien."/></a>

            <h1>
                Retro Arcade Games
            </h1>
        
        </figure>
        
    </header>
            <h2>Sign Up</h2>
            <form action="register.py" method="post">
                <figure>
                <label for="username">User name: </label>
                <input type="text" name="username" id="username" value="%s" />
                </figure>

                <figure>
                <label for="password1">Password: </label>
                <input type="password" name="password1" id="password1" />
                </figure>

                <figure>
                <label for="confirm">Re-enter password: </label>
                <input type="password" name="confirm" id="confirm" />
                </figure>

                <figure>
                <input type="submit" value="Sign Up" />
                </figure>
            </form>
            %s

            <footer>&copy; Retro Arcade Games Ltd.</footer>
        </body>
    </html>""" % (username, result))