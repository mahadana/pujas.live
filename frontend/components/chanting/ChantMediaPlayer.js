import { Component } from "react";

const MEDIA_TYPES = {
  ogg: "audio/ogg",
  mp3: "audio/mpeg",
};

class ChantMediaPlayer extends Component {
  constructor(props) {
    super(props);
    this.audio = null;
  }

  setUrl(url) {
    const match = String(url).match(/\.(.{1,4})$/);
    const type = MEDIA_TYPES[match?.[1]];
    if (type) {
      this.remove();
      const audio = new Audio();
      audio.controls = false;
      audio.autoplay = false;
      const source = document.createElement("source");
      source.src = url;
      source.type = type;
      audio.appendChild(source);
      this.audio = audio;
    } else {
      console.warn(`Invalid URL: ${url}`);
    }
  }

  remove() {
    this.pause();
    this.audio = null;
  }

  play() {
    if (this.audio) this.audio.play();
  }

  pause() {
    if (this.audio) this.audio.pause();
  }

  getTime() {
    if (this.audio) return this.audio.currentTime;
  }

  setTime(time) {
    if (this.audio) this.audio.currentTime = time;
  }

  isPlaying() {
    return this.audio && !this.audio.paused;
  }

  render() {
    return null;
  }
}

export default ChantMediaPlayer;
