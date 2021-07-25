(function () {
    new Vue({
        el: ".board",
        data: {
            test: "hello",
            images: [],
        },
        mounted: function () {
            axios
                .get("/images")
                .then(({ data }) => {
                    this.images = data.reverse();
                })
                .catch((err) => console.log("err in /images: ", err));
        },
    });
})();
