(function () {
    Vue.component("comments-sect", {
        template: "#comments-sect-template",
        props: ["imgId"],
        data: function () {
            return {
                comments: [],
                username: "",
                commentInput: "",
                showCommentErr: false,
                noComments: false,
            };
        },
        mounted: function () {
            axios
                .get("/comments", {
                    params: {
                        imageId: this.imgId,
                    },
                })
                .then((results) => {
                    if (results.data.length == 0) {
                        this.noComments = true;
                        return;
                    }

                    this.noComments = false;
                    this.comments = results.data;
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        methods: {
            sendComment: function () {
                if (!this.commentInput || !this.username) {
                    this.showCommentErr = true;
                    return;
                } else {
                    this.showCommentErr = false;
                }
                axios
                    .post("/comments", {
                        user: this.username,
                        comment: this.commentInput,
                        id: this.imgId,
                    })
                    .then((results) => {
                        this.noComments = false;
                        this.comments.push(results.data);
                    })
                    .catch((err) => {
                        console.log(err);
                    });
            },

            convertDate: function (dateToConvert) {
                let d = new Date(dateToConvert);
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
                return d;
            },
        },
    });

    Vue.component("modal-img", {
        template: "#modal-img-template",
        props: ["imgId", "arrNew"],
        data: function () {
            return {
                modalImgData: "",
                mdlShow: true,
            };
        },
        mounted: function () {
            axios
                .get("/images", {
                    params: {
                        numEl: this.imgId,
                    },
                })
                .then(({ data }) => {
                    //clean this (not necessary to have a loop for one item, arrNew not necessary anymore)

                    for (let i = 0; i < data.length; i++) {
                        if (data[i].id == this.imgId) {
                            this.modalImgData = data[i];
                            break;
                        }
                    }

                    if (this.modalImgData == []) {
                        this.mdlShow = false;
                        return;
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
                .catch((err) => {
                    console.log("err in component, /images: ", err);
                });
        },
        methods: {
            insideComponentClose: function () {
                this.$emit("close");
            },
        },
        watch: {
            imgId: function () {
                axios
                    .get("/images", {
                        params: {
                            numEl: this.imgId,
                        },
                    })
                    .then(({ data }) => {
                        //clean this (not necessary to have a loop for one item, arrNew not necessary anymore)

                        for (let i = 0; i < data.length; i++) {
                            if (data[i].id == this.imgId) {
                                this.modalImgData = data[i];
                                break;
                            }
                        }

                        if (this.modalImgData == []) {
                            this.mdlShow = false;
                            return;
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
                    .catch((err) => {
                        console.log("err in component, /images: ", err);
                    });
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
            showModal: location.hash.slice(1),
            showButton: false,
        },
        mounted: function () {
            addEventListener("hashchange", () => {
                this.showModal = location.hash.slice(1);
            });

            axios
                .get("/images")
                .then(({ data }) => {
                    this.images = data;
                    for (let i = 0; i < this.images.length; i++) {
                        if (
                            this.images[i].id ==
                            this.images[this.images.length - 1].lowestId
                        ) {
                            this.showButton = false;
                        } else {
                            this.showButton = true;
                        }
                    }
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

                        if (this.showButton == true) {
                            this.images.pop();
                        }

                        this.url = "";
                        this.username = "";
                        this.title = "";
                        this.description = "";
                        this.showError = false;
                        this.file = "";
                        this.$refs.fileupload.value = null;
                        this.componentKey += 1;
                    })
                    .catch((err) => {
                        console.log(err);
                        this.showError = true;
                    });
            },
            handleFileSelection: function (e) {
                this.file = e.target.files[0];
            },

            insideMainClose: function () {
                history.pushState({}, "", "/");
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
                            } else {
                                this.showButton = true;
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

(function ($, window, document, undefined) {
    $(".inputfile").each(function () {
        var $input = $(this),
            $label = $input.next("label"),
            labelVal = $label.html();

        $input.on("change", function (e) {
            var fileName = "";
            if (this.files && this.files.length > 1)
                fileName = (
                    this.getAttribute("data-multiple-caption") || ""
                ).replace("{count}", this.files.length);
            else if (e.target.value) {
                fileName = e.target.value.split("\\").pop();
            }

            if (fileName) {
                $label.find("span").html(fileName);
            } else $label.html(labelVal);
        });

        // Firefox bug fix
        $input
            .on("focus", function () {
                $input.addClass("has-focus");
            })
            .on("blur", function () {
                $input.removeClass("has-focus");
            });
    });
})(jQuery, window, document);
