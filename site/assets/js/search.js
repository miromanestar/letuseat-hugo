document.addEventListener("DOMContentLoaded", function () {
    let searchResults = [];
    const searchWrapper = document.querySelector("aside[role=search]");
    const searchResultElement = searchWrapper.querySelector(".search-results");
    const searchInput = searchWrapper.querySelector("input");

    document.querySelectorAll(".toggle-search").forEach(function (el) {
        el.addEventListener("click", function (e) {
            if (searchWrapper.classList.contains("active")) {
                searchWrapper.classList.add("visible");
                setTimeout(function () {
                    searchWrapper.classList.remove("visible");
                }, 300);
                searchWrapper.classList.remove("active");
            } else {
                searchWrapper.classList.add("active");
                searchInput.focus();
            }
        });
    });

    function tags(tags, searchString) {
        let tagHTML = (tags.split(" ; ") || [])
            .filter(function (i) {
                return i && i.length > 0;
            })
            .map(function (i) {
                return "<span class='tag'>" + mark(i, searchString) + "</span>";
            })
        return tagHTML.join("");
    }

    function mark(content, search) {
        if (search) {
            let pattern = /^[a-zA-Z0-9]*:/i;
            search.split(" ").forEach(function (s) {
                if (pattern.test(s)) {
                    s = s.replace(pattern, "");
                }
                if (s && s.startsWith("+")) {
                    s = s.substring(1);
                }
                if (s && s.indexOf("~") > 0 && s.length > s.indexOf("~") && parseInt(s.substring(s.indexOf("~") + 1)) == s.substring(s.indexOf("~") + 1)) {
                    s = s.substring(0, s.indexOf("~"));
                }
                if (!s || s.startsWith("-")) {
                    return;
                }
                let re = new RegExp(s, "i");
                content = content.replace(re, function (m) {
                    return "<mark>"+m+"</mark>";
                });
            });
        }

        return content;
    }

    axios.get("/searchjson")
        .then(function (result) {
            const searchContent = result.data;
            const searchIndex = lunr(function () {
                this.ref("id")
                this.field("content");
                this.field("tag");
                this.field("title");
                this.field("url");
                this.b(0.1);

                Array.from(result.data).forEach(function (doc) {
                    this.add(doc)
                }, this)
            })
            searchInput.removeAttribute("disabled");
            searchInput.addEventListener("keyup", function (e) {
                let searchString = e.target.value;
                if (searchString && searchString.length >= 2) {
                    try {
                        searchResults = searchIndex.search(searchString);
                    } catch (err) {
                        if (err instanceof lunr.QueryParseError) {
                            return;
                        }
                    }
                } else {
                    searchResults = [];
                }

                if (searchResults.length > 0) {
                    searchResultElement.innerHTML = searchResults.map(function (match) {
                        let item = searchContent.find(function(e) {
                            return e.id == parseInt(match.ref);
                        });
                        return "<li class='search-item bg-grey-1 pl-3 pr-3 br1 raise'><a href='" + item.url + "'>" +
                        "<h4 title='field: title'>" + mark(item.title, searchString) + "</h4>" +
                        "<p class='nav-url' title='field: url'>" + mark(item.url, searchString) + "</p>" +
                        "<p class='summary' title='field: content'>" +
                        mark((item.content.length > 200 ? (item.content.substring(0, 200) + "...") : item.content), searchString) + "</p>" +
                        "<p class='tags' title='field: tag'>" + tags(item.tag, searchString) + "</p>" +
                        "<p class='link b dib black mb0'>Read more →</p>" +
                        "</a></li>";
                    }).join("");
                } else {
                    searchResultElement.innerHTML = "<li><p class='no-result'>No results found</p></li>";
                }
            });
        })
        .catch(function (error) {
            console.error(error);
        });
});
