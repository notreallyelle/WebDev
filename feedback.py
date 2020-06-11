#!/usr/local/bin/python3

from cgitb import enable 
enable()

from os import environ
from shelve import open
from http.cookies import SimpleCookie

print('Content-Type: text/html')
print()

result = """
   <p>You do not have permission to access this page.</p>
   <ul>
       <li><a href="register.py">Register</a></li>
       <li><a href="login.py">Login</a></li>
   </ul>"""
   
try:
    cookie = SimpleCookie()
    http_cookie_header = environ.get('HTTP_COOKIE')
    if http_cookie_header:
        cookie.load(http_cookie_header)
        if 'sid' in cookie:
            sid = cookie['sid'].value
            session_store = open('sess_' + sid, writeback=False)
            if session_store.get('authenticated'):
                result = """

                    <figure>
<header>
    <a href="logout.py"><p>Log Out</p></a>

    <a href="index.html"><img id="logo"  src="images/logo.png" 
    title="logo" 
    alt="An image of our logo, the space invader alien."/></a>

  <h1 id="rac">
      Retro Arcade Games
  </h1>
  </figure>
</header>
<section>
    <h1>Feedback</h1>
        <p>Tell us how we can improve, %s!</p>
        <p>Suggestions of games to add are also welcome.</p>
        <form action="submit.html">
            <figure>
                Your name:<br/>
                <input type="text" name="name" value=""/>
            </figure>

            <figure>
                Your email address:<br/>
                <input type="text" name="email" value=""/>
            </figure>

            <figure>
                Enter your feedback and suggestions here:<br/>
                <input type="text" name="feedback" value=""/>
            </figure>
            <figure>
                <input type="submit" value="Submit" href="submit.html"/>
            </figure>
        </form>
</section>""" % session_store.get('username')
            session_store.close()
except IOError:
    result = '<p>Sorry! We are experiencing problems at the moment. Please call back later.</p>'

print("""
    <!DOCTYPE html>
    <html lang="en">
        <head>
            <meta charset="utf-8" />
            <title>Feedback</title>
            <link rel="stylesheet" href="styles.css" />
        </head>
        <body>
            %s
        </body>
    </html>""" % (result))