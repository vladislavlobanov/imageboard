(function () {
    Vue.component("modal-img", {
        template: "#modal-img-template",
        props: ["imgId", "arrNew"],
        data: function () {
            return {
                modalImgData: "",
            };
        },
        mounted: function () {
            axios
                .get("/images", {
                    params: {
                        numEl: this.arrNew.length,
                    },
                })
                .then(({ data }) => {
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].id == this.imgId) {
                            this.modalImgData = data[i];
                            break;
                        }
                    }
                    let d = new Date(this.modalImgData.created_at);
                    var options = {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        second: "numeric",
                        hour12: false,
                    };
                    d = new Intl.DateTimeFormat("en-US", options)
                        .format(d)
                        .toString();
                    this.modalImgData.created_at = d;
                })
                .catch((err) =>
                    console.log("err in component, /images: ", err)
                );
        },
        methods: {
            insideComponentClose: function () {
                this.$emit("close");
            },
        },
    });

    new Vue({
        el: ".board",
        data: {
            images: [],
            title: "",
            description: "",
            username: "",
            file: "",
            componentKey: 0,
            showError: false,
            showModal: null,
            showButton: true,
        },
        mounted: function () {
            axios
                .get("/images")
                .then(({ data }) => {
                    this.images = data;
                })
                .catch((err) => console.log("err in /images: ", err));
        },
        methods: {
            uploadImage: function () {
                if (
                    !this.file ||
                    !this.title ||
                    !this.description ||
                    !this.username
                ) {
                    this.showError = true;
                    return;
                }

                var title = this.title;
                var desc = this.description;
                var username = this.username;
                var file = this.file;

                var formData = new FormData();
                formData.append("title", title);
                formData.append("desc", desc);
                formData.append("username", username);
                formData.append("file", file);

                axios
                    .post("/upload", formData)
                    .then((results) => {
                        this.images.unshift({
                            url: results.data.url,
                            username: results.data.username,
                            title: results.data.title,
                            description: results.data.description,
                            id: results.data.id,
                        });

                        this.url = "";
                        this.username = "";
                        this.title = "";
                        this.description = "";
                        this.componentKey += 1;
                        this.showError = false;
                    })
                    .catch((err) => {
                        console.log(err);
                        this.showError = true;
                    });
            },
            handleFileSelection: function (e) {
                this.file = e.target.files[0];
            },
            selectImg: function (id) {
                this.showModal = id;
            },
            insideMainClose: function () {
                this.showModal = null;
            },
            getLowestId: function () {
                let newArr = [];
                for (let i = 0; i < this.images.length; i++) {
                    newArr.push(this.images[i].id);
                }
                let lowest = newArr.sort((a, b) => a - b)[0];

                axios
                    .get("/getmore", {
                        params: {
                            id: lowest,
                        },
                    })
                    .then((results) => {
                        for (let i = 0; i < results.data.length; i++) {
                            this.images.push(results.data[i]);
                        }

                        for (let i = 0; i < this.images.length; i++) {
                            if (
                                this.images[i].id ==
                                this.images[this.images.length - 1].lowestId
                            ) {
                                this.showButton = false;
                            }
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            },
        },
    });
})();
