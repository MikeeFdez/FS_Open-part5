import { useState } from "react"
import blogService from "../services/blogs"

export const Blog = ({ blog, onClickLikes, onClickRemove }) => {
  const [visible, setVisible] = useState(false)
  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const userThatCreatedTheBlog = blog?.user?.name
  // El encadenamiento opcional ?. detiene la evaluación y devuelve undefined si el valor antes del ?. es undefined o null

  const isTheUser = (user) => {
    if (user != null) {
      return (<p><button onClick={onClickRemove}>remove</button></p>)
    }
    return null
  }

  return (
    <div style={blogStyle}>
      <div style={hideWhenVisible} className="entryBlog" data-testid="entry">
        {blog.title} - {blog.author}
        <button onClick={toggleVisibility}>show details</button>
      </div>
      <div style={showWhenVisible} className="entryBlogDetails">
        <p>{blog.title} - {blog.author}</p>
        <p>{blog.url}</p>
        <p>{userThatCreatedTheBlog}</p>
        <p data-testid="likes">{blog.likes} <button onClick={onClickLikes}>Likes</button></p>
        {/* <p><button onClick={onClickRemove}>remove</button></p> */}
        {isTheUser(userThatCreatedTheBlog)}
        <button onClick={toggleVisibility}>hide details</button>
      </div>
    </div>
  )
}
  
  
