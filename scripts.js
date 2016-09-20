var Blog = Backbone.Model.extend({
    defaults : {
        author: '',
        title: '',
        url: ''
    }
});

var Blogs = Backbone.Collection.extend({});
