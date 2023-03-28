import { useEffect, useState, useRef } from "react"

/**
 * @description 播放在线音乐
 * @param {String} url 在线音乐链接
 * @returns
 */

export const useAudio = (url) => {
    const [onMusic, setOnMusic] = useState(false)
    const audio: any = useRef()
    
    const play = () => {
        audio.current = null
        audio.current = new Audio()
        audio.current.src = url
        audio.current.play()
        audio.current.addEventListener('ended', () => {
            audio.current.play()
        })
    }

    const pause = () => {
        if (audio.current) audio.current.pause()
    }

    useEffect(() => {
        if (onMusic) {
            play()
        } else {
            pause()
        }
    }, [onMusic])

    return [
        onMusic,
        setOnMusic
    ]
}