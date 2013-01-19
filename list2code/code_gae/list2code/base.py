'''
Created on 16 Aug 2012

@author: zdebeer
'''

import os
from google.appengine.ext import webapp
from google.appengine.ext.webapp import template
from google.appengine.api import users

class BaseRequestHandler(webapp.RequestHandler):
    """Supplies a common template generation function.
    
    When you call generate(), we augment the template variables supplied with
    the current user in the 'user' variable and the current webapp request
    in the 'request' variable.
    """
    def generate(self, template_name, template_values={}):
        User = users.get_current_user()
        if (User==None):
            userlink = "<a href='"+users.create_login_url("/")+"'>Login</a>"
        else:
            userlink = "<a href='"+users.create_logout_url("/")+"'>"+User.nickname()+"</a>"        
        values = {
          'request': self.request,
          'application_name': 'List2Code',
          'currentuser':userlink, 
        }
        values.update(template_values)
        directory = AppSettings.apppath
        path = os.path.join(directory, os.path.join('templates', template_name))
        self.response.out.write(template.render(path, values, debug=AppSettings.debug))

class AppSettings:    
    apppath = ""
    debug = True
    