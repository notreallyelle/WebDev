#!/usr/local/bin/python3

from cgitb import enable 
enable()

from os import environ
from shelve import open
from http.cookies import SimpleCookie

print('Content-Type: text/html')
print()

result = '<p>You are already logged out</p>'
try:
    cookie = SimpleCookie()
    http_cookie_header = environ.get('HTTP_COOKIE')
    if http_cookie_header:
        cookie.load(http_cookie_header)
        if 'sid' in cookie:
            sid = cookie['sid'].value
            session_store = open('sess_' + sid, writeback=True)
            session_store['authenticated'] = False
            session_store.close()
            result = """
            <header>
                <figure>
                    
                    <a href="index.html"><img id="logo"  src="images/logo.png" 
                    title="logo" 
                    alt="An image of our logo, the space invader alien."/></a>

                    <h1>
                        Retro Arcade Games
                    </h1>
                
                </figure>
                
            </header>
                <p>You have been logged out.</p>
                <p><a href="login.py">Login again</a></p>
                
                <footer> &copy; Retro Arcade Games Ltd."""
except IOError:
    result = '<p>Sorry! We are experiencing problems at the moment. Please call back later.</p>'

print("""
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="utf-8" />
            <title>Logout</title>
            <link rel="stylesheet" href="styles.css" />
        </head>
        <body>
            %s
        </body>
    </html>""" % (result))