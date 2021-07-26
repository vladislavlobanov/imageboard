(function () {
    new Vue({
        el: ".board",
        data: {
            images: [],
            title: "",
            description: "",
            username: "",
            file: "",
        },
        mounted: function () {
            axios
                .get("/images")
                .then(({ data }) => {
                    this.images = data.reverse();
                })
                .catch((err) => console.log("err in /images: ", err));
        },
        methods: {
            uploadImage: function () {
                var title = this.title;
                var desc = this.description;
                var username = this.username;
                var file = this.file;

                var formData = new FormData();
                formData.append("title", title);
                formData.append("desc", desc);
                formData.append("username", username);
                formData.append("file", file);

                axios.post("/upload", formData).then((results) => {
                    this.images.unshift({
                        url: results.data.url,
                        username: results.data.username,
                        title: results.data.title,
                        description: results.data.description,
                    });
                });
            },
            handleFileSelection: function (e) {
                this.file = e.target.files[0];
            },
        },
    });
})();
