import _isFinite from "lodash/isFinite";

import { makeLoop, throttleLog } from "@/lib/chanting";

let _mediaPlayerSingleton = null;

export const getMediaPlayerSingleton = () => {
  if (!_mediaPlayerSingleton) {
    _mediaPlayerSingleton = new ChantMediaPlayer();
  }
  return _mediaPlayerSingleton;
};

class ChantMediaPlayer {
  constructor() {
    this.reset();
    this.loop = makeLoop(this._loop.bind(this));
  }

  attach() {
    this.loop.start();
  }

  detach() {
    this.loop.stop();
    this.reset();
  }

  getPlaybackRate() {
    return this.playbackRate;
  }

  getStateCode() {
    return {
      ENDED: "E",
      PLAYING: "P",
      REQUEST_PLAY: "R",
      REQUEST_STOP: "X",
      STOPPED: "S",
      WAITING_FOR_PLAY: "W",
    }[this.state];
  }

  getTime() {
    return this.audio.currentTime ?? 0;
  }

  getUrl() {
    return this.url;
  }

  getVolume() {
    return this.volume;
  }

  isPlaying() {
    return this.state === "PLAYING";
  }

  play() {
    if (this.state === "STOPPED" || this.state === "ENDED") {
      this.state = "REQUEST_PLAY";
    }
  }

  preload() {
    this._updateSourceAndTime();
  }

  reset() {
    this.enqueueTime = null;
    this.playbackRate = 1;
    this.state = "STOPPED";
    this.url = null;
    this.volume = 1;
    this._destroyAudio();
    this._createAudio();
  }

  setPlaybackRate(playbackRate) {
    this.playbackRate = playbackRate;
  }

  setTime(time) {
    this.enqueueTime = time;
  }

  setUrl(url) {
    this.url = url;
  }

  setVolume(volume) {
    this.volume = volume;
  }

  stop({ force = false } = {}) {
    if (force) {
      this.audio.pause();
    } else if (this.state === "PLAYING") {
      this.state = "REQUEST_STOP";
    } else if (this.state === "ENDED") {
      this.state = "STOPPED";
    }
  }

  _loop() {
    switch (this.state) {
      case "ENDED":
        break;

      case "PLAYING": {
        if (this.audio.paused) {
          this.state = "REQUEST_PLAY";
        } else if (this.audio.ended) {
          this.state = "ENDED";
        } else {
          this._updateSourceAndTime();
        }
        break;
      }

      case "REQUEST_PLAY": {
        this._updateSourceAndTime();
        // Ensure this doesn't loop around.
        if (
          !this.audio.duration ||
          Math.abs(this.audio.currentTime - this.audio.duration) > 0.05
        ) {
          this.audio
            .play()
            .then(() => {
              if (this.state === "WAITING_FOR_PLAY") this.state = "PLAYING";
            })
            .catch(() => {
              if (this.state === "WAITING_FOR_PLAY")
                this.state = "REQUEST_PLAY";
            });
          this.state = "WAITING_FOR_PLAY";
        } else {
          this.state = "ENDED";
        }
        break;
      }

      case "REQUEST_STOP": {
        if (!this.audio.paused) this.audio.pause();
        this.state = "STOPPED";
        break;
      }

      case "STOPPED": {
        if (this.audio.paused) {
          this._updateSourceAndTime();
        } else {
          this.audio.pause();
        }
        break;
      }

      case "WAITING_FOR_PLAY":
        break;
    }
  }

  _createAudio() {
    const audio = new window.Audio();
    audio.controls = false;
    audio.autoplay = false;
    this.audio = audio;
  }

  _destroyAudio() {
    if (this.audio) {
      this.audio.pause();
      this.audio.removeAttribute("src");
      this.audio.load();
      delete this.audio;
    }
  }

  _updateSourceAndTime() {
    let load = false;
    const time = this.enqueueTime;
    const url = this.url ?? "";
    if (this.audio.src !== url) {
      this.audio.src = url;
      load = url !== "";
    }
    if (_isFinite(time)) {
      load = load || !_isFinite(this.audio.currentTime);
      this.audio.currentTime = time;
      this.enqueueTime = null;
    }
    if (load) {
      throttleLog("ChantMediaPlayer audio.load", url, time);
      this.audio.load();
    }
    if (this.audio.playbackRate !== this.playbackRate) {
      this.audio.playbackRate = this.playbackRate;
    }
    if (this.audio.volume !== this.volume) {
      this.audio.volume = this.volume;
    }
  }
}

export default ChantMediaPlayer;
