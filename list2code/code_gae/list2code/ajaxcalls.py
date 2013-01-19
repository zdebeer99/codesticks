from django.utils import simplejson
from google.appengine.ext import webapp
from list2code.models import GCounter
from google.appengine.ext import db
import random
from google.appengine.api import memcache

__author__ = 'zdebeer'

class RPCHandler(webapp.RequestHandler):
    """ Allows the functions defined in the RPCMethods class to be RPCed."""

    def __init__(self):
        webapp.RequestHandler.__init__(self)
        self.methods = RPCMethods()

    def get(self):
        func = None

        action = self.request.get('action')
        if action:
            if action[0] == '_':
                self.error(403) # access denied
                return
            else:
                func = getattr(self.methods, action, None)

        if not func:
            self.error(404) # file not found
            return

        args = ()
        while True:
            key = 'arg%d' % len(args)
            val = self.request.get(key)
            if val:
                args += (simplejson.loads(val),)
            else:
                break
        result = func(*args)
        self.response.out.write(simplejson.dumps(result))



class RPCMethods:
    """ Defines the methods that can be RPCed.
    NOTE: Do not allow remote callers access to private/protected "_*" methods.
    """
    def ServerSum(self, *args):
        # The JSON encoding may have encoded integers as strings.
        # Be sure to convert args to any mandatory type(s).
        ints = [int(arg) for arg in args]
        return sum(ints)


    def IncrementGenCount(self):
        CounterController.increment(CounterController.Default_Counter)
        return CounterController.get_count(CounterController.Default_Counter)

    def GetGenCount(self):
        return CounterController.get_count(CounterController.Default_Counter)





class CounterController:
    NUM_SHARDS = 20
    Default_Counter = 'Default'

    @staticmethod
    def get_count(name):
        """Retrieve the value for a given sharded counter.

        Parameters:
          name - The name of the counter
        """
        total = memcache.get(name)
        if total is None:
            total = 0
            for counter in GCounter.all().filter('name = ', name):
                total += counter.count
            memcache.add(name, total, 60)
        return total

    @staticmethod
    def increment(name):
        """Increment the value for a given sharded counter.

        Parameters:
          name - The name of the counter
        """
        def txn():
            index = random.randint(0, CounterController.NUM_SHARDS - 1)
            shard_name = name + str(index)
            counter = GCounter.get_by_key_name(shard_name)
            if counter is None:
                counter = GCounter(key_name=shard_name, name=name)
            counter.count += 1
            counter.put()
        db.run_in_transaction(txn)
        # does nothing if the key does not exist
        memcache.incr(name)