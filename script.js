document.addEventListener("alpine:init", () => {
    Alpine.data("alpine", () => ({

        progress: 0,
        progressInterval: null,
        text: "",
        textArray : [
            "Estamos chegando em breve",
            "Uma nova experiência de treino",
            "Chegou a hora de subir o nível",
        ],
        textIndex: 0,
        charIndex: 0,
        typeSpeed: 100,
        cursorSpeed: 500,
        pauseEnd: 1500,
        pauseStart: 0,
        direction: "forward",
        loading: false,
        modal: false,
        show: false,
        message: "",

        init() {
            this.progressInterval = setInterval(() => {
                this.progress = this.progress + 1
                if (this.progress >= 85) {
                    clearInterval(this.progressInterval)
                }
            }, 150)

            this.$nextTick(() => {
                let typingInterval

                const startTyping = () => {
                    let current = this.textArray[this.textIndex]

                    if (this.direction === "forward") {
                        this.text = current.substring(0, this.charIndex)
                        if (this.charIndex < current.length) {
                            this.charIndex += 1
                        } else {
                            clearInterval(typingInterval)
                            setTimeout(() => {
                                this.direction = "backward"
                                typingInterval = setInterval(startTyping, this.typeSpeed)
                            }, this.pauseEnd)
                        }
                    }
                    else if (this.direction === "backward") {
                        this.text = current.substring(0, this.charIndex)
                        if (this.charIndex > 0) {
                            this.charIndex -= 1
                        } else {
                            clearInterval(typingInterval)
                            setTimeout(() => {
                                this.textIndex += 1
                                if (this.textIndex >= this.textArray.length) {
                                    this.textIndex = 0
                                }
                                this.direction = "forward"
                                this.charIndex = 0
                                typingInterval = setInterval(startTyping, this.typeSpeed)
                            }, this.pauseStart)
                        }
                    }
                }

                typingInterval = setInterval(startTyping, this.typeSpeed)

                setInterval(() => {
                    if (this.$refs.cursor && this.$refs.cursor.classList.contains("hidden")) {
                        this.$refs.cursor.classList.remove("hidden")
                    } else if (this.$refs.cursor) {
                        this.$refs.cursor.classList.add("hidden")
                    }
                }, this.cursorSpeed)
            })
        },

        async submitForm(event) {
            this.loading = true
            const form = event.target
            const data = new FormData(form)

            try {
                await fetch("https://script.google.com/macros/s/AKfycbx09Q2djGfeVz_Vs9W_iZy3BGGupINwlcpNe6yMwzE_Pyi_VAytycS-kpuTe85JPAzong/exec", {
                    method: "POST",
                    body: data,
                })
                this.modal = false
                this.show = true
                setTimeout(() => this.show = false, 5000)
            } catch (error) {
                alert("Ocorreu um erro ao enviar. Tente novamente.")
            } finally {
                this.loading = false
            }
        },

    }))
})
