from django.shortcuts import render_to_response,redirect
from django.template import RequestContext
from blogwang import settings
from models import Blog
from django.contrib import auth

def render_with_user(page,req,data):
    user = auth.get_user(req)
    welcome = "Login"
    if user.id is not None:
        welcome = "Welcome," + user.username
        data["welcome"] = welcome
        return render_to_response(page,RequestContext(req,data))

# Create your views here.
def home(req,page="1"):
    page = int(page)
    max_page = (Blog.objects.all().count() - 1)/settings.LIST_PAGE_SIZE + 1
    if page > max_page:
        return redirect('/')

    blogs = Blog.objects.all().order_by('-ts')[(page-1)*settings.LIST_PAGE_SIZE:page*settings.LIST_PAGE_SIZE]

    prev_pages = range(max(1,page - 3),page)
    next_pages = range(page + 1,min(max_page,page + 3) + 1)
    # User Info



    return render_with_user('index.html',req,{"blogs":blogs,
    "pagination":{"prevs": prev_pages, "flws": next_pages, "curr":page}})


def blog(req,blog_id):
    try:
        blog = Blog.objects.get(id=blog_id)
    except:
        return redirect('/')
    blogs = Blog.objects.exclude(id=blog.id).order_by('-ts')[:6]
    return render_with_user('post.html',req,{"blog":blog,"titles":blogs})

def about(req):
    return render_with_user('about.html',req,{})

