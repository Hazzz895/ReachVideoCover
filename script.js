class ReachVideoCover {
  /**
   * Возвращает URL видео для фона, если оно доступно.
   * @returns {String|null}
   */
  get videoUrl() {
    return this.meta?.backgroundVideoUri;
  }

  /**
   * Возвращает объект с метаданными текущего трека.
   * @returns {any}
   */
  get meta() {
    return player?.state?.queueState?.currentEntity?.value?.entity?.entityData
      ?.meta;
  }

  /**
   * Возвращает статус аудиоплеера. (paused, playing и т.д.)
   * @returns {String}
   */
  get status() {
    return window?.player?.state?.currentMediaPlayer?.value?.audioPlayerState
      ?.status?.value;
  }

  constructor() {
    this.main();
  }

  /**
   * Элемент предоставляющий видео фон.
   * @type {HTMLVideoElement|null}
   */
  video = null;

  /**
   * Элемент предоставляющий постер (фотообложку) трека в полноэкранном режиме.
   * @type {HTMLDivElement|null}
   */
  fullscreenPoster = null;

  /**
   * Элемент предоставляющий содержание полноэкранного режима.
   * @type {HTMLDivElement}
   */
  fullscreenContent = null;

  /**
   * Объект с настройками.
   * @type {any}
   */
  settings = null;

  /**
   * Интервал обновления настроек.
   * @type {Number}
   */
  settingsUpdateInterval = null;

  /**
   * Вызывается при инициализации класса.
   */
  main() {
    // Наблюдатель за изменениями в DOM.
    const observer = new MutationObserver((mutationsList) => {
      for (const mutation of mutationsList) {
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach(async (node) => {
            if (!(node instanceof HTMLElement)) return;

            // Если настройки не загружены, загружаем их.
            if (!this.settings) {
              this.settings = {};
              this.settings = await this.getSettings();
              if (
                this.settings.settingsUpdateIntervalEnabled.value &&
                this.settings.settingsUpdateInterval.value > 0
              ) {
                this.settingsUpdateInterval = setInterval(async () => {
                  this.settings = await this.getSettings();
                  this.applySettings();
                }, this.settings.settingsUpdateInterval.value * 1000);
              }
            }

            // Если открыт полноэкранный режим, пытаемся загрузить видео.
            if (
              node.querySelector?.('[data-test-id="FULLSCREEN_PLAYER_MODAL"]')
            ) {
              this.loadVideo();
            }
            // Если был открыт дополнительный контент (очередь, текст трека и т.д.), устанавливаем затемнение видео из настроек.
            else if (
              node.matches?.(
                ".FullscreenPlayerDesktopContent_additionalContent__tuuy7"
              ) ||
              node.querySelector?.(
                ".FullscreenPlayerDesktopContent_additionalContent__tuuy7"
              )
            ) {
              this.setVideoFilter(this.settings.videoLyricsBrightness.value);
            }
          });

          // Если был закрыт дополнительный контент, устанавливаем затемнение видео по умолчанию.
          mutation.removedNodes.forEach((node) => {
            if (!(node instanceof HTMLElement)) return;

            if (
              node.matches?.(
                ".FullscreenPlayerDesktopContent_additionalContent__tuuy7"
              )
            ) {
              this.setVideoFilter(this.settings.videoBrightness.value);
            }
          });
        }
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    window?.player?.state?.playerState?.event.onChange(async (event) => {
      switch (event) {
        // Если трек поставлен на паузу
        case "audio-paused":
        case "audio-ended":
        case "audio-end":
          this.pauseVideo();
          break;
        // Если трек был убран с паузы
        case "audio-resumed":
          this.playVideo();
          break;
        // После того как трек загрузился
        case "audio-canplay":
          this.loadVideo();
          break;
      }
    });
  }

  /**
   * Останавливает видео фон
   */
  pauseVideo() {
    if (this.video) {
      this.video.classList.add("reachVideoCover_backgroundVideo--paused");
      this.video.pause();
    }
    if (this.fullscreenPoster) {
      this.fullscreenPoster.classList.remove(
        "reachVideoCover_FullscreenPlayerDesktopPoster_hidden"
      );
    }
    if (this.fullscreenContent && this.settings.playerBackgroundEnabled.value) {
      this.fullscreenContent.style.background = null;
      this.fullscreenContent.style.backdropFilter = null;
    }
  }

  setVideoFilter(brightness) {
    if (!this.video) return;
    this.video.style.filter =
      `brightness(${brightness}%) ` +
      this.settings.videoBackdrop.videoBackdropValue.value;
  }

  /**
   * Создает и загружает видео фон, если он доступен.
   * @returns {void}
   */
  loadVideo() {
    if (!this.videoUrl) {
      if (this.video) {
        this.pauseVideo();
        this.video.remove();
        this.video = null;
        this.fullscreenContent = null;
        this.fullscreenPoster = null;
      }
      return;
    }

    const fullscreenModal = document.querySelector(
      '[data-test-id="FULLSCREEN_PLAYER_MODAL"]'
    );

    if (!fullscreenModal) return;

    const fullscreenRoot = fullscreenModal.querySelector(
      ".FullscreenPlayerDesktopContent_root__tKNGK"
    );

    if (fullscreenRoot && this.video?.src != this.videoUrl || !fullscreenRoot.querySelector(".reachVideoCover_backgroundVideo")) {
      this.fullscreenPoster = fullscreenRoot.querySelector(
        ".FullscreenPlayerDesktopPoster_root__d__YD"
      );
      this.fullscreenContent = fullscreenRoot.querySelector(
        ".FullscreenPlayerDesktopContent_fullscreenContent__Nvety"
      );
      this.video = this.createVideoBackground(this.videoUrl);
      fullscreenRoot.appendChild(this.video);
    }

    if (this.status == "paused") {
      this.pauseVideo();
    } else {
      this.playVideo();
    }
  }

  /**
   * Возобновляет видео фон.
   */
  playVideo() {
    if (this.video) {
      this.video.classList.remove("reachVideoCover_backgroundVideo--paused");
      this.video.play();

      if (
        document.querySelector(
          ".FullscreenPlayerDesktopContent_additionalContent__tuuy7"
        )
      ) {
        this.setVideoFilter(this.settings.videoLyricsBrightness.value);
      } else {
        this.setVideoFilter(this.settings.videoBrightness.value);
      }
    }
    if (this.fullscreenPoster) {
      if (this.settings.playerVisibility.value >= 2) {
        this.fullscreenPoster.classList.add(
          "reachVideoCover_FullscreenPlayerDesktopPoster_hidden"
        );
      } else {
        this.fullscreenPoster.classList.remove(
          "reachVideoCover_FullscreenPlayerDesktopPoster_hidden"
        );
      }
    }

    if (this.fullscreenContent) {
      if (this.settings.playerBackgroundEnabled.value) {
        this.fullscreenContent.style.backgroundColor = this.hexToRgba(
          (this.settings.playerBackgroundColor.value == "#123456"
            ? this.meta.derivedColors.accent
            : this.settings.playerBackgroundColor.value
          ).toString() +
            Math.floor(
              (this.settings.playerBackgroundOpacity.value / 100) * 255
            )
              .toString(16)
              .padStart(2, "0")
        );

        this.fullscreenContent.style.backdropFilter =
          this.settings.playerBackgroundBackdrop.playerBackgroundBackdropValue.value;
      } else {
        this.fullscreenContent.style.background = null;
        this.fullscreenContent.style.backdropFilter = null;
      }
    }
  }

  /**
   * Преобразует hex в rgba
   * @param {string} hex Цвет в формате hex
   * @returns {string} Цвет в формате rgba
   */
  hexToRgba(hex) {
    hex = hex.replace(/^#/, "");

    if (hex.length === 3 || hex.length === 4) {
      hex = hex
        .split("")
        .map((c) => c + c)
        .join("");
    }

    if (hex.length !== 6 && hex.length !== 8) {
      throw new Error("Неверный формат hex цвета");
    }

    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    const a =
      hex.length === 8 ? +(parseInt(hex.slice(6, 8), 16) / 255).toFixed(3) : 1;

    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  /**
   * Создает и возращает элемент видео фона.
   * @param {string} url Ссылка на видео.
   * @returns {HTMLVideoElement} Элемент предоставляющий видео фон.
   */
  createVideoBackground(url) {
    if (!this.video) {
      var video = document.createElement("video");
    } else {
      var video = this.video;
      video.src = url;
      return video;
    }

    video.src = url;
    video.autoplay = true;
    video.loop = true;
    video.muted = true;
    video.playsinline = true;
    video.style.opacity = 0;

    video.classList.add("reachVideoCover_backgroundVideo");

    video.addEventListener("loadstart", () => {
      document
        .querySelector(".FullscreenPlayerDesktopContent_root__tKNGK")
        ?.classList.add("reachVideoCover_background--loading");
    });

    video.addEventListener("canplaythrough", () => {
      video.style.opacity = null;
      document
        .querySelector(".FullscreenPlayerDesktopContent_root__tKNGK")
        ?.classList.remove("reachVideoCover_background--loading");
    });

    return video;
  }

  /**
   * Получает CSS класс по его имени.
   * @unused Больше не используется, когда-нибудь понадобится. 🥸
   * @param {string} name Имя класса CSS, который нужно найти. 
   * @returns {any} CSS класс
   */
  getClass(name) {
    for (let sheet of document.styleSheets) {
      for (let rule of sheet.cssRules) {
        if (rule.selectorText === name) {
          return rule.style;
        }
      }
    }
  }

  /**
   * Получает настройки из API.
   * @returns {Promise<any>}
   */
  async getSettings() {
    try {
      const response = await fetch(
        `http://localhost:2007/get_handle?name=${this.constructor.name}`
      );
      if (!response.ok) throw new Error(`Ошибка сети: ${response.status}`);

      const { data } = await response.json();
      if (!data?.sections) {
        console.warn("Структура данных не соответствует ожидаемой");
        return null;
      }

      return this.transformJSON(data);
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  /**
   * Преобразует JSON данные в объект с настройками.
   * @param {any} data JSON данные с настройками.
   * @returns {any} Объект с настройками.
   */
  transformJSON(data) {
    const result = {};

    try {
      data.sections.forEach((section) => {
        section.items.forEach((item) => {
          if (item.type === "text" && item.buttons) {
            result[item.id] = {};
            item.buttons.forEach((button) => {
              result[item.id][button.id] = {
                value: button.text,
                default: button.defaultParameter,
              };
            });
          } else {
            result[item.id] = {
              value:
                item.bool ||
                item.input ||
                item.selected ||
                item.value ||
                item.filePath,
              default: item.defaultParameter,
            };
          }
        });
      });
    } finally {
      return result;
    }
  }

  /**
   * Применяет настройки к видео фону и полноэкранному режиму.
   * @returns {void}
   */
  applySettings() {
    if (!this.settings) return;

    if (this.status == "paused") {
      this.pauseVideo();
    } else {
      this.playVideo();
    }

    if (!this.settings.settingsUpdateIntervalEnabled.value) {
      clearInterval(this.settingsUpdateInterval);
    }
  }
}

new ReachVideoCover();