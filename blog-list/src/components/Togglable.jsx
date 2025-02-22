import { useState, forwardRef, useImperativeHandle } from "react";
import PropTypes from 'prop-types'

export const Togglable = forwardRef(({ buttonLabel, children }, refs) => {
    const [visible, setVisible] = useState(false)

    const hideWhenVisible = { display: visible ? 'none' : '' }
    const showWhenVisible = { display: visible ? '' : 'none' }

    const toggleVisibility = () => {
        setVisible(!visible)
    }

    useImperativeHandle(refs, () => {
        return {
          toggleVisibility
        }
    })

    Togglable.propTypes = {
        buttonLabel: PropTypes.string.isRequired
    }

    return (
        <div>
            <div style={hideWhenVisible}>
                <button onClick={toggleVisibility}>{buttonLabel}</button>
            </div>
            <div style={showWhenVisible}>
                {children}
                <button onClick={toggleVisibility}>Cancel</button>
            </div>
        </div>
    )
})