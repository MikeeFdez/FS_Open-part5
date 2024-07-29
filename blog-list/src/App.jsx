import { useState, useEffect, useRef } from 'react'
import { Blog } from './components/Blog'
import { LoginForm } from './components/LoginForm'
import { BlogForm } from './components/BlogForm'
import { Notification } from './components/Notification'
import { Togglable } from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  // const [loginVisible, setLoginVisible] = useState(false)
  const blogFormRef = useRef()

  useEffect(() => {
    blogService
      .getAll()
      .then(b => {
        setBlogs(b)
      })  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])


  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({ 
        username, password 
      })
      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('Wrong credentials')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
  }

    
  const addBlog = (blogObject) => {
    blogFormRef.current.toggleVisibility()
    blogService
    .create(blogObject)
      .then(returnedBlog => {
        setBlogs(blogs.concat(returnedBlog))
        setErrorMessage('New Entry was added. Great!')
        setTimeout(() => {
          setErrorMessage(null)
        }, 5000)
    })
  }

  const handleLikes = (blog) => {
    const updatedBlog = ({...blog, likes: blog.likes + 1})
    const updatedBlogId = updatedBlog.id
    
    blogService
    .update(updatedBlogId, updatedBlog)
    .then(returnedBlog => {
      setBlogs(blogs.map(b => b.id !== updatedBlogId ? b : returnedBlog))
    })
  }

  const handleDelete = (selectedBlog) => {
    window.confirm(`Do you want to delete ${selectedBlog.title} from ${selectedBlog.author}?`)
      ? (blogService.remove(selectedBlog.id), setBlogs(blogs.filter(blog => blog.id != selectedBlog.id)))
      : null
  }



  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={errorMessage} />
        <LoginForm onSubmit={handleLogin} username={username} password={password} 
        onUsernameChange={({ target }) => setUsername(target.value)} 
        onPasswordChange={({ target }) => setPassword(target.value)}/>
      </div>
    )
  }

  return (
    <div>
      <h2>Blogs</h2>
      <p>{user.name} logged in <button onClick={handleLogout}>Logout</button></p>
      <h2>Create new Blog</h2>
      <Notification message={errorMessage} />
      <Togglable buttonLabel={"New Blog"} ref={blogFormRef}>
        <BlogForm createBlog={addBlog}/>
      </Togglable>
      <br />
      {blogs.sort((a, b) => b.likes - a.likes).map((blog, i) =>
        <Blog key={i} blog={blog} 
        onClickLikes={() => handleLikes(blog)} 
        onClickRemove={() => handleDelete(blog)} />
      )}
    </div>
  )
}

export default App
