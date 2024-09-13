import { createContext, useContext, useEffect, useState } from "react";
import "./App.css";

const RouterContext = createContext(null);

const routes = [
  {
    id: crypto.randomUUID(),
    name: "Home",
    url: "#/",
    element: <Home />,
  },
  {
    id: crypto.randomUUID(),
    name: "About",
    url: "#/about",
    element: <About />,
  },
  {
    id: crypto.randomUUID(),
    name: "Posts",
    url: "#/posts",
    element: <Posts />,
  },
  {
    id: crypto.randomUUID(),
    name: "Contact",
    url: "#/contact",
    element: <Contact />,
  },
];

const notFound = {
  name: "Page not found",
  element: <NotFound />,
  // url: '',
};

function getRoute(routeUrl) {
  const route = routes.find((x) => x.url === routeUrl);
  return route ?? notFound;
}

const title = "App";

function setTitle(pageTitle) {
  document.title = `${pageTitle} - ${title}`;
}

function App() {
  // const [route, setRoute] = useState(location.hash.length < 2 ? '#/' : location.hash);
  // const [route, setRoute] = useState(location.hash.length < 2 ? routes[0] : getRoute(location.hash));
  const [route, setRoute] = useState(() => {
    if (location.hash.length < 2) {
      return routes[0];
    }

    return getRoute(location.hash);
  });

  useEffect(() => {
    setTitle(route.name);
  }, [route]);

  useEffect(() => {
    window.addEventListener("hashchange", function () {
      setRoute(getRoute(location.hash));
    });
  }, []);

  return (
    <div className="container">
      <RouterContext.Provider value={route}>
        <Header />
        <Main />
        <Footer />
      </RouterContext.Provider>
    </div>
  );
}

function Main() {
  return (
    <div className="main">
      <Content />
      <Sidebar />
    </div>
  );
}

function Header() {
  return (
    <div className="header">
      <a href="#/" className="logo">
        App
      </a>
      <Nav />
    </div>
  );
}

function Nav() {
  const route = useContext(RouterContext);

  return (
    <ul className="nav">
      {routes.map((x) => (
        <li key={x.id}>
          <a href={x.url} className={route.url === x.url ? "selected" : ""}>
            {x.name}
          </a>
        </li>
      ))}
    </ul>
  );
}

function Content() {
  const route = useContext(RouterContext);

  return (
    <div className="content">
      <h1>{route.name}</h1>
      {route.element}
    </div>
  );
}

function Footer() {
  return (
    <div className="footer">
      <p> &copy; 2024 </p>
    </div>
  );
}

function Sidebar() {
  return (
    <div className="sidebar">
      <div className="widget">
        <LikeBtn />
      </div>
    </div>
  );
}

function LikeBtn() {
  const [likeCount, setLikeCount] = useState(localStorage.likeCount ? parseInt(localStorage.likeCount) : 0);

  useEffect(() => {
    localStorage.likeCount = likeCount;
  }, [likeCount]);

  function increaseLikeCount() {
    setLikeCount(likeCount + 1);
  }

  return (
    <button className="likeBtn" onClick={increaseLikeCount}>
      😍 {likeCount}
    </button>
  );
}

function Home() {
  return <></>;
}

function About() {
  return (
    <>
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusamus harum mollitia veniam, quidem fugiat corporis ab
        voluptatum odit sequi voluptate error repellat numquam nulla quae corrupti vero sunt delectus minus.
      </p>
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusamus harum mollitia veniam, quidem fugiat corporis ab
        voluptatum odit sequi voluptate error repellat numquam nulla quae corrupti vero sunt delectus minus.
      </p>
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusamus harum mollitia veniam, quidem fugiat corporis ab
        voluptatum odit sequi voluptate error repellat numquam nulla quae corrupti vero sunt delectus minus.
      </p>
      <p>
        Lorem ipsum dolor sit, amet consectetur adipisicing elit. Accusamus harum mollitia veniam, quidem fugiat corporis ab
        voluptatum odit sequi voluptate error repellat numquam nulla quae corrupti vero sunt delectus minus.
      </p>
    </>
  );
}

function Contact() {
  return <></>;
}

function Posts() {
  const [postId, setPostId] = useState(null);

  return <>{postId ? <PostDetail postId={postId} setPostId={setPostId} /> : <PostList setPostId={setPostId} />}</>;
}

function PostList({ setPostId }) {
  const [posts, setPosts] = useState([]);
  const [limit, setLimit] = useState(5);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  async function getPosts() {
    const skip = (page - 1) * limit;

    const fetchUrl = `https://dummyjson.com/posts?delay=0&limit=${limit}&skip=${skip}`;

    const data = await fetch(fetchUrl).then((res) => res.json());
    setPosts([...data.posts]);
    setTotal(data.total);
  }

  useEffect(() => {
    getPosts();
  }, [page, limit]);

  function changePage(pageNumber) {
    setPage(pageNumber);
  }

  const pageCount = Math.ceil(total / limit);

  function handlePrevPage(e) {
    e.preventDefault();
    if (page - 1 > 0) {
      setPage(page - 1);
    }
  }

  function handleNextPage(e) {
    e.preventDefault();
    if (page + 1 <= pageCount) {
      setPage(page + 1);
    }
  }

  function handleChangeP(e) {
    const newLimit = parseInt(e.target.value);
    setLimit(newLimit);
    setPage(1);
  }
  return (
    <>
      {posts.map((x) => (
        <h3 key={x.id}>
          {x.title}{" "}
          <a
            href={"#/posts/" + x.id}
            onClick={(e) => {
              e.preventDefault();
              setPostId(x.id);
            }}
          >
            &gt;&gt;
          </a>
        </h3>
      ))}
      <div>
        {pageCount > 0 && (
          <div className="paginationContainer">
            <div className="pagination">
              <button onClick={handlePrevPage}>
                <a href="#">&lt;</a>
              </button>
              {Array.from({ length: pageCount }, (v, i) => i + 1).map((x) => (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    changePage(x);
                  }}
                  key={x}
                >
                  <a href="#" className={page === x ? "activePage" : ""}>
                    {x}
                  </a>
                </button>
              ))}
              <button onClick={handleNextPage}>
                <a href="#">&gt;</a>
              </button>
            </div>
            <div>
              <select name="pages" onChange={handleChangeP}>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="30">30</option>
                <option value="40">40</option>
                <option value="50">50</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

function PostDetail({ postId, setPostId }) {
  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [username, setUsername] = useState("");

  async function getData() {
    const postData = await fetch("https://dummyjson.com/posts/" + postId).then((r) => r.json());
    const commentsData = await fetch(`https://dummyjson.com/posts/${postId}/comments`).then((r) => r.json());

    setPost(postData);
    setComments(commentsData.comments);
    getLocalComments();
  }

  useEffect(() => {
    getData();
  }, []);

  function getLocalComments() {
    const localComments = localStorage.getItem(`comments-${postId}`);
    if (localComments) {
      setComments([...JSON.parse(localComments)]);
    }
  }
  function handleClick(e) {
    e.preventDefault();
    setPostId(null);
  }
  function handleComment() {
    const dialog = document.querySelector(".dialog");
    dialog.showModal();
  }

  function Submit(e) {
    e.preventDefault();

    if (newComment.trim() === "") {
      return;
    }
    //bos yorum eklenmesin diye yaptin

    const addedComment = {
      postId,
      id: crypto.randomUUID(),
      user: { fullName: username },
      body: newComment,
      likes: 0,
    };

    //  setComments([...comments, addedComment])
    //boyle yapinca ilk comment gelmiyo

    setComments((prev) => {
      const updatedComments = [...prev, addedComment];
      save(updatedComments);
      return updatedComments;
    });

    // setComments fonksiyonu asenkron oldugu icin save'i icinde calistirdin

    setNewComment("");
    setUsername("");

    console.log("Form");
    document.querySelector(".dialog").close();
  }

  function save(updatedComments) {
    localStorage.setItem(`comments-${postId}`, JSON.stringify(updatedComments));
  }

  function closeDialog() {
    document.querySelector(".dialog").close();
  }

  return (
    <>
      <p>
        <a href="#" onClick={handleClick}>
          back
        </a>
      </p>
      <h3>{post.title}</h3>
      <p>{post.body}</p>
      <hr />
      <h4>Comments: </h4>
      <div>
        <button onClick={handleComment}>Add comment</button>
      </div>
      {comments.map((x) => (
        <p key={x.id}>
          <strong>{x.user.fullName}</strong> says: {x.body}
        </p>
      ))}

      <dialog className="dialog">
        <form onSubmit={Submit}>
          <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
          <input type="text" placeholder="Add a comment" value={newComment} onChange={(e) => setNewComment(e.target.value)} />
          <button type="submit">Submit</button>
        </form>
        <button onClick={closeDialog}>exit</button>
      </dialog>
    </>
  );
}

function NotFound() {
  return (
    <p>
      Page not found. <a href="#/">return home</a>
    </p>
  );
}

export default App;

// her yere ayni propu gezdirme derdinden kurtaran hook useContext <3
