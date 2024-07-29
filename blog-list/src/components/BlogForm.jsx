import { useState } from "react"


// export const BlogForm = ({onSubmit, title, author, url, onChangeTitle, onChangeAuthor, onChangeUrl }) => {
export const BlogForm = ({ createBlog }) => {
    const [newTitle, setNewTitle] = useState('')
    const [newAuthor, setNewAuthor] = useState('')
    const [newUrl, setNewUrl] = useState('')
    

    const addBlog = (event) => {
        event.preventDefault()
    
        createBlog({
          title: newTitle,
          author: newAuthor,
          url: newUrl,
        })

        setNewTitle('')
        setNewAuthor('')
        setNewUrl('')
      }
    
    return (
        <form onSubmit={addBlog}>
            <div>
                Title: <input type="text" value={newTitle} onChange={event => setNewTitle(event.target.value)}/>
            </div>
            <div>
                Author: <input type="text" value={newAuthor} onChange={event => setNewAuthor(event.target.value)}/>
            </div>
            <div>
                URL: <input type="text" value={newUrl} onChange={event => setNewUrl(event.target.value)}/>
            </div>
            <div>
                <button type='submit'>Create</button>
            </div>
      </form>
    )
}