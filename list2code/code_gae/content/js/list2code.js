var Controller = function () {
    var self = this;
    self.model = new Model();

    self.generate = function(){
        var m = self.model;
        if (m.delimiter()=="comma" || m.delimiter()=="auto")
            simpletxt.col_delimit=',';
        if (m.delimiter()=="tab")
            simpletxt.col_delimit='\t';
        m.generated(simpletxt.generate(m.data(), m.template()));
        m.inc();
        console.log("Generated Code Counter:"+m.counter().toString());
    };

    self.keep = function(content,text){
        var m = self.model;
        var name = text.substring(0,10);
        var item = {content:content,name:name,text:text};
        self.model.contentHistory[content].unshift(item);
        return item;
    };

    self.keepdata = function(){
        self.keep("data",self.model.data());
    };

    self.keeptemplate = function(){
        self.keep("template",self.model.template());
    };

    self.cleardata = function(){
        self.model.data("");
    };

    self.cleartemplate = function(){
        self.model.template("");
    };

    self.setdata = function(item){
        self.model.data(item.text);
    };

    self.settemplate = function(item){
        self.model.template(item.text);
    };

    self.deleteitem = function(item){
        self.model.contentHistory[item.content].remove(item);
    };


    self.controlMapping = function(){
        self.model.data($("#initdata").text())
        self.model.template($("#inittemplate").text())


        $.get("/rpc?action=GetGenCount",function(data){
            self.model.servercounter(parseInt(data));
        })
    };
};

var list2code = new Controller();

function Model()
{
    var self = this;
    self.delimiter = ko.observable('comma');
    self.clientcounter = ko.observable(0);
    self.servercounter = ko.observable(0);
    self.contentHistory = {"data":ko.observableArray(),
                           "template":ko.observableArray(),
                           "default":ko.observableArray()};
    self.data = ko.observable();
    self.template = ko.observable();
    self.generated = ko.observable();
    self.counter = ko.computed(function(){ return this.clientcounter()+this.servercounter();},this);
    self.inc = function(){
        var cnt=0;
        $.get("/rpc?action=IncrementGenCount",function(data){
            self.servercounter(parseInt(data));
        });
        self.clientcounter(cnt)
    };
}


$(document).ready(function () {
    ko.applyBindings(list2code);
    list2code.controlMapping();
});