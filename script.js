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

        name: "",
        email: "",
        phone: "",
        modal: false,

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

                    if (this.charIndex > current.length) {
                        this.direction = "backward"
                        clearInterval(typingInterval)
                        setTimeout(() => {
                            typingInterval = setInterval(startTyping, this.typeSpeed)
                        }, this.pauseEnd)
                        return
                    }

                    this.text = current.substring(0, this.charIndex)

                    if (this.direction === "forward") {
                        this.charIndex += 1
                    } else {
                        if (this.charIndex === 0) {
                            this.direction = "forward"
                            clearInterval(typingInterval)
                            setTimeout(() => {
                                this.textIndex += 1
                                if (this.textIndex >= this.textArray.length) {
                                    this.textIndex = 0
                                }
                                typingInterval = setInterval(startTyping, this.typeSpeed)
                            }, this.pauseStart)
                        }
                        this.charIndex -= 1
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

        submitForm() {
            fetch("https://script.google.com/macros/s/AKfycbx09Q2djGfeVz_Vs9W_iZy3BGGupINwlcpNe6yMwzE_Pyi_VAytycS-kpuTe85JPAzong/exec", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: this.name,
                    email: this.email,
                    phone: this.phone,
                }),
            })
            .then(res => res.json())
            .then(res => alert("Enviado com sucesso!"))
        },

    }))
})
