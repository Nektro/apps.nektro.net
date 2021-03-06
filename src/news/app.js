//
export function makeElement(tag, attrs={}, children=[]) {
    let ele = document.createElement(tag);
    for (const prop in attrs) {
        ele.setAttribute(prop, attrs[prop]);
    }
    for (const child of children) {
        if (child instanceof HTMLElement) ele.appendChild(child);
        else ele.appendChild(document.createTextNode(child));
    }
    return ele;
}
//
document.getElementById("pivot").addEventListener("fl-pivot.select", function() {
    const piv_item = (this.querySelector(`${this.selector_nav}.active`));
    const i = Array.from(piv_item.parentElement.children).indexOf(piv_item);
    const piv_content = this.querySelectorAll(this.selector_content)[i].children[1];
    const cat = piv_item.getAttribute("data-cat");
    // const fetched = piv_item.getAttribute("data-fed") !== null;
    const API_KEY = "b74dfab7ae05467db9bea1fbf4693138";
    //
    if (piv_item.getAttribute("data-fed") === null) {
        fetch("https://newsapi.org/v2/top-headlines"
            +`?category=${cat}`
            +"&language=en"
            +"&country=us"
            +"&sortBy=publishedAt"
            +`&apiKey=${API_KEY}`)
        .then(r => r.json())
        .then(r => {
            console.log(`Loaded category: ${cat}`);
            if (r.status === "ok") {
                r.articles.sort(function(a, b) {
                    if (b.publishedAt === null) return 1;
                    return b.publishedAt.localeCompare(a.publishedAt);
                })
                .forEach((a) => {
                    piv_content.appendChild(makeElement("a", { href:a.url, target:"_blank" }, [
                        makeElement("div", {class:"x-card"}, [
                            makeElement("img", { src:a.urlToImage, alt:a.title }),
                            makeElement("h4", {}, [a.title]),
                            makeElement("p", {}, [
                                makeElement("img", { src:`${(a.url.substring(0,a.url.indexOf("/",8)))}/favicon.ico`, alt:"", width:"16", height:"16" }),
                                makeElement("span", {}, [a.source.name])
                            ])
                        ])
                    ]));
                });
            }
        })
        .catch(() => {
            piv_content.parentElement.appendChild(makeElement("h4", {}, ["Oops!"]));
            piv_content.parentElement.appendChild(makeElement("p", {}, ["Couldn\"t reach News API :("]));
        })
        .finally(() => {
            piv_item.setAttribute("data-fed", "true");
        });
    }
});
