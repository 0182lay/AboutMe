/* =========================================================
   PROJECT IMAGE CAROUSEL / SLIDER
   ---------------------------------------------------------
   HOW TO ADD REAL IMAGES:
   1. Put your screenshots in:  image/imgpj/<project>/
   2. List their file paths in the arrays below.
      (Encode spaces in filenames as %20)
   If a file is missing, a themed placeholder is shown
   automatically (so the slider always works).
   ========================================================= */

const GALLERIES = {
    learndeepj: {
        title: "LearnDeepJ",
        images: [
            "image/imgpj/learndee/Screenshot%20(22).png",
            "image/imgpj/learndee/Screenshot%20(23).png",
            "image/imgpj/learndee/Screenshot%20(24).png",
            "image/imgpj/learndee/Screenshot%20(25).png",
            "image/imgpj/learndee/Screenshot%20(26).png"
        ]
    },
    shoplink: {
        title: "ShopLink",
        images: [
            "image/imgpj/shoplink/Screenshot%20(12).png",
            "image/imgpj/shoplink/Screenshot%20(13).png",
            "image/imgpj/shoplink/Screenshot%20(14).png",
            "image/imgpj/shoplink/Screenshot%20(15).png",
            "image/imgpj/shoplink/Screenshot%20(16).png",
            "image/imgpj/shoplink/Screenshot%20(17).png"
        ]
    },
    portfolio: {
        title: "This Portfolio",
        images: [
            "image/imgpj/portfolio/1.png",
            "image/imgpj/portfolio/2.png"
        ]
    }
};

(function () {
    const modal = document.getElementById("carouselModal");
    if (!modal) return;

    const track = document.getElementById("carouselTrack");
    const dotsBox = document.getElementById("carouselDots");
    const titleEl = document.getElementById("carouselTitle");
    const counterEl = document.getElementById("carouselCounter");
    const prevBtn = document.getElementById("carouselPrev");
    const nextBtn = document.getElementById("carouselNext");

    let index = 0;
    let count = 0;

    /* Themed SVG placeholder for missing images */
    function placeholder(title, n) {
        const svg =
            "<svg xmlns='http://www.w3.org/2000/svg' width='800' height='450'>" +
            "<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>" +
            "<stop offset='0' stop-color='#0c1418'/><stop offset='1' stop-color='#111c22'/>" +
            "</linearGradient></defs>" +
            "<rect width='800' height='450' fill='url(#g)'/>" +
            "<rect x='1.5' y='1.5' width='797' height='447' fill='none' stroke='#01ccff' stroke-opacity='0.35'/>" +
            "<text x='400' y='205' fill='#01ccff' font-family='sans-serif' font-size='36' font-weight='bold' text-anchor='middle'>" +
            title + "</text>" +
            "<text x='400' y='250' fill='#6a8a96' font-family='sans-serif' font-size='18' text-anchor='middle'>Screenshot " + n + "</text>" +
            "<text x='400' y='285' fill='#48606a' font-family='sans-serif' font-size='14' text-anchor='middle'>&#3776; &#3776; &#3776;</text>" +
            "</svg>";
        return "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
    }

    function build(gallery) {
        track.innerHTML = "";
        dotsBox.innerHTML = "";
        count = gallery.images.length;

        gallery.images.forEach((src, i) => {
            const slide = document.createElement("div");
            slide.className = "carousel-slide";

            const img = document.createElement("img");
            img.alt = gallery.title + " – " + (i + 1);
            img.loading = "lazy";
            img.onerror = function () {
                img.onerror = null;
                img.src = placeholder(gallery.title, i + 1);
            };
            img.src = src;

            slide.appendChild(img);
            track.appendChild(slide);

            const dot = document.createElement("button");
            dot.className = "carousel-dot";
            dot.setAttribute("aria-label", "Slide " + (i + 1));
            dot.addEventListener("click", () => goTo(i));
            dotsBox.appendChild(dot);
        });
    }

    function update() {
        track.style.transform = "translateX(" + (-index * 100) + "%)";
        dotsBox.querySelectorAll(".carousel-dot").forEach((d, i) => {
            d.classList.toggle("active", i === index);
        });
        counterEl.textContent = (index + 1) + " / " + count;
    }

    function goTo(i) {
        index = (i + count) % count;
        update();
    }
    const next = () => goTo(index + 1);
    const prev = () => goTo(index - 1);

    function open(key) {
        const gallery = GALLERIES[key];
        if (!gallery) return;
        titleEl.textContent = gallery.title;
        build(gallery);
        index = 0;
        update();
        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
        document.body.style.overflow = "hidden";
    }

    function close() {
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
        document.body.style.overflow = "";
    }

    /* ---- Open from project cards ---- */
    document.querySelectorAll("[data-gallery]").forEach((card) => {
        card.addEventListener("click", (e) => {
            // let the "Code" link work normally
            if (e.target.closest(".code-link")) return;
            // "Demo" link should open the gallery, not jump to #
            if (e.target.closest(".live-link")) e.preventDefault();
            open(card.getAttribute("data-gallery"));
        });
        card.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                open(card.getAttribute("data-gallery"));
            }
        });
    });

    /* ---- Controls ---- */
    nextBtn.addEventListener("click", next);
    prevBtn.addEventListener("click", prev);
    modal.querySelectorAll("[data-close]").forEach((el) =>
        el.addEventListener("click", close)
    );

    document.addEventListener("keydown", (e) => {
        if (!modal.classList.contains("open")) return;
        if (e.key === "Escape") close();
        else if (e.key === "ArrowRight") next();
        else if (e.key === "ArrowLeft") prev();
    });

    /* ---- Touch swipe ---- */
    let startX = 0;
    let dragging = false;
    track.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
        dragging = true;
    }, { passive: true });
    track.addEventListener("touchend", (e) => {
        if (!dragging) return;
        dragging = false;
        const dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 40) (dx < 0 ? next : prev)();
    });
})();
