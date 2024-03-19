'use client'

import { faArrowUp } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import classNames from 'classnames'
import { useEffect, useState } from 'react'

export const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false)

  const toggleVisibility = () => {
    if (window.scrollY > window.screen.availHeight) {
      setIsVisible(true)
    } else {
      setIsVisible(false)
    }
  }
  
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility)

    return () => {
      window.removeEventListener('scroll', toggleVisibility)
    }
  }, [])

  return (
    <div
      className={classNames(
        'fixed bottom-20 right-10',
        isVisible ? 'visible' : 'hidden',
      )}
    >
      <button
        type="button"
        onClick={scrollToTop}
        className={classNames(
          isVisible ? 'opacity-100' : 'opacity-0',
          'inline-flex items-center justify-center rounded-full size-12 shadow-sm',
          'transition-opacity focus:outline-none focus:ring-2 focus:ring-offset-2',
          'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white',
        )}
      >
        <FontAwesomeIcon icon={faArrowUp} />
      </button>
    </div>
  )
}
