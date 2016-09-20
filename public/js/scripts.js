Backbone.Model.prototype.idAttribute = '_id';

var Blog = Backbone.Model.extend({
    defaults : {
        author: '',
        title: '',
        url: ''
    }
});

var Blogs = Backbone.Collection.extend({
    url: 'http://localhost:3000/api/blogs'
});

var blogs = new Blogs();

// each new blog has an individual table / row
var BlogView = Backbone.View.extend({
    model: new Blog(),
    tagName: 'tr',
    events: {
        'click .edit-blog': 'edit',
        'click .update-blog': 'update',
        'click .cancel': 'cancel',
        'click .delete-blog': 'delete'
    },
    edit: function() {
        $('.edit-blog').hide();
        $('.delete-blog').hide();
        this.$('.update-blog').show();
        this.$('.cancel').show();

        var author = this.$('.author').html();
        var title = this.$('.title').html();
        var url = this.$('.url').html();
        this.$('.author').html(
            '<input type="text" class="form-control author-update" value='+ author +'>');
        this.$('.title').html(
            '<input type="text" class="form-control title-update" value='+ title +'>');
        this.$('.url').html(
            '<input type="text" class="form-control url-update" value='+ url +'>');
    },
    update: function() {
        this.model.set('author', $('.author-update').val());
        this.model.set('title', $('.title-update').val());
        this.model.set('url', $('.url-update').val());
        this.model.save(null, {
            success: function(res) {
                console.log('Successfully UPDATED blog with _id: ' + res.toJSON()._id);
            },
            error: function(res) {
                console.log('Failed to update blog!');
            }
        });
    },
    cancel: function() {
        blogsView.render();
    },
    delete: function() {
        this.model.destroy({
            success: function(res) {
                console.log(
                    'Successfully DELETED blog with _id: ' + res.toJSON()._id);
            },
            error: function() {
                console.log('Failed to DELETE blog!');
            }
        });
    },
    initialize: function() {
        this.template = _.template($('.blogs-list-template').html());
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
        var self = this;
        this.model.on('add', this.render, this);
        this.model.on('change', function() {
            setTimeout(function() {
                self.render();
            }, 30)
        }, this);
        this.model.on('remove', this.render, this);
        this.model.fetch({
            success: function(response) {
                _.each(response.toJSON(), function(item) {
                    console.log('Successfully GOT blog with _id: ' + item._id);
                });
            },
            error: function() {
                console.log('Failed to get blogs!');
            }
        });
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
        console.log(author);
        if (!author || !title || !url) {
            // do some form validation here...
            console.log("None")
            return
        }
        var blog = new Blog({
            author: author,
            title: title,
            url: url
        });
        $('.author-input').val('');
        $('.title-input').val('');
        $('.url-input').val('');
        blogs.add(blog);
        blog.save(null, {
            success: function(res) {
                console.log(
                    'Successfully SAVED blog with _id: ' + res.toJSON()._id);
            },
            error: function() {
                console.log('Failed to save blog!');
            }
        });
    });
});
