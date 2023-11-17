package main

import (
	"context"
	"net/http"
	"sort"
	"sync"

	"connectrpc.com/connect"
	"github.com/google/uuid"
	"golang.org/x/net/http2"
	"golang.org/x/net/http2/h2c"

	blogv1 "starter/apis/blog/v1"
	blogv1connect "starter/apis/blog/v1/blogv1connect"
)

type BlogServer struct {
	blogv1connect.UnimplementedBlogServiceHandler

	postStore sync.Map
}

type Post struct {
	title   string
	content string
}

func (s *BlogServer) CreatePost(ctx context.Context, req *connect.Request[blogv1.CreatePostRequest]) (*connect.Response[blogv1.CreatePostResponse], error) {
	s.postStore.Store(uuid.New(), Post{title: req.Msg.Title, content: req.Msg.Content})

	return connect.NewResponse(&blogv1.CreatePostResponse{}), nil
}

func (s *BlogServer) ListPosts(ctx context.Context, req *connect.Request[blogv1.ListPostsRequest]) (*connect.Response[blogv1.ListPostsResponse], error) {
	var posts []*blogv1.Post

	s.postStore.Range(func(key, value any) bool {
		post := value.(Post)
		posts = append(posts, &blogv1.Post{
			Id:      key.(uuid.UUID).String(),
			Title:   post.title,
			Content: post.content,
		})
		return true
	})

	sort.Slice(posts, func(i, j int) bool {
		return posts[i].Id < posts[j].Id
	})

	return connect.NewResponse(&blogv1.ListPostsResponse{
		Posts: posts,
	}), nil
}

func (s *BlogServer) DeletePost(ctx context.Context, req *connect.Request[blogv1.DeletePostRequest]) (*connect.Response[blogv1.DeletePostResponse], error) {
	s.postStore.Delete(uuid.MustParse(req.Msg.Id))

	return connect.NewResponse(&blogv1.DeletePostResponse{}), nil
}

func main() {
	blogServer := &BlogServer{}
	mux := http.NewServeMux()
	path, handler := blogv1connect.NewBlogServiceHandler(blogServer)
	mux.Handle(path, handler)
	http.ListenAndServe("127.0.0.1:8080", h2c.NewHandler(mux, &http2.Server{}))
}
