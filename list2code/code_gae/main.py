
from google.appengine.ext.webapp.util import run_wsgi_app
from list2code.ajaxcalls import RPCHandler
from list2code.base import BaseRequestHandler, AppSettings
from google.appengine.ext import webapp
import os.path


class MainPage(BaseRequestHandler):    
    
    def get(self):
        values = {"Title": "List2Code",
                  "Info": self.request.path,
                  "menuactivemain": True}
        self.generate("List2Code.html", values)

class DocPage(BaseRequestHandler):    
    
    def get(self):
        values = {"Title": "List2Code - Documentation",
                  "Info": self.request.path}
        self.generate("doc.html", values)
        
class AdminPage(BaseRequestHandler):
    
    def get(self):
        values = {"Title": "List2Code - Documentation",
                  "Info": self.request.path,
                  "menuactivedoc": "class='active'"}
        self.generate("admin.html", values)


application = webapp.WSGIApplication([('/', MainPage),
                                      ('/docs.html', DocPage),
                                      ('/rpc',RPCHandler)], debug=AppSettings.debug)


def main():
    AppSettings.apppath = os.path.dirname(__file__);
    AppSettings.debug = False;
    run_wsgi_app(application)

if __name__ == "__main__":
    main()
