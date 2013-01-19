'''
Created on 16 Aug 2012

@author: zdebeer
'''

from google.appengine.ext import db

class GLang(db.Model):
    Name = db.StringProperty();

class GTemplate(db.Model):
    Created = db.DateTimeProperty(auto_now_add=True)
    Name = db.StringProperty()
    Template = db.StringProperty(multiline=True)
    Lang = db.ReferenceProperty(GLang)

class GCounter(db.Model):
    """Shards for each named counter"""
    name = db.StringProperty(required=True)
    count = db.IntegerProperty(required=True, default=0)


    
