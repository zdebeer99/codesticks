'''
Created on 16 Aug 2012

@author: zdebeer
'''

from google.appengine.ext import webapp
from google.appengine.ext.webapp.util import run_wsgi_app
from list2code.base import *

class AdminPage(BaseRequestHandler):
    def get(self):
        values = {"Title": "Admin",
                  "Info": self.request.path}
        self.generate("Admin.html", values)       


application = webapp.WSGIApplication([('/', AdminPage)], debug=AppSettings.debug)


def main():
    AppSettings.apppath = os.path.dirname(__file__);
    AppSettings.debug = True;
    run_wsgi_app(application)

if __name__ == "__main__":
    main()
