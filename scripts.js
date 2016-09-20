var Blog = Backbone.Model.extend({
    defaults : {
        author: '',
        title: '',
        url: ''
    }
});

var Blogs = Backbone.Collection.extend({});

var blogs = new Blogs();

// each new blog has an individual table / row
var BlogView = Backbone.View.extend({
    model: new Blog(),
    tagName: 'tr',
    initialize: function() {
        this.template = _.template($('blogs-list-template').html());
    },
    render: function() {
        this.$el.html(this.template(this.model.toJSON()));
        return this;
    }
});

var BlogsView = Backbone.View.extend({
    model: blogs,
    el: $('.blogs-list'),
    initialize: function() {
        this.model.on('add', this.render, this);
    },
    render: function() {
        var self = this;
        this.$el.html('');
        _.each(this.model.toArray(), function(blog) {
            self.$el.append((new BlogView({model: blog})).render().$el);
        });
        return this;
    }
});

var blogsView = new BlogsView();

$(document).ready(function() {
    $('.add-blog').on('click', function() {
        var author = $('.author-input').val();
        var title = $('.title-input').val();
        var url = $('.url-input').val();
        if (!this.author || !this.title || this.url) {
            // do some form validation here...
            return
        }
        var blog = new Blog({
            author: this.author,
            title: this.title,
            url: this.url
        });
        $('.author-input').val('');
        $('.title-input').val('');
        $('.url-input').val('');
        console.log(blog);
        blogs.add(blog);
    });
});
