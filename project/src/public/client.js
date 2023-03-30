// global state
let store = Immutable.Map({
    rovers: Immutable.List(["Curiosity", "Opportunity", "Spirit"]),
    showing: Immutable.List([]),
    showTime: false,
    loading: false,
});

const root = document.getElementById("root");

// function to update global state
const updateStore = (store, newState) => {
    store = store.merge(newState);
    render(root, store);
};

// function to render app html with global state
const render = async (root, state) => {
    root.innerHTML = App(state);
};

// listening for load event because page should load before any JS is called
window.addEventListener("load", () => {
    render(root, store);
});

// function to create app html content
const App = (state) => {
    const rovers = state.get("rovers").toArray();

    const showTime = state.get("showTime");

    const showing = state.get("showing").toArray();

    const loading = state.get("loading");

    return `
        <header>
            ${showTime ? Header(rovers) : ""}
        </header>
        <main>
        ${
            loading
                ? Loader()
                : showTime
                ? ImagesShow(showing)
                : RoverShow(rovers)
        }
        </main>
        <footer></footer>
        `;
};

// function to create loader html content
const Loader = () => {
    return `
    <div class="loader-box">
        <div class="loader"></div>
        <p class="loader-content">Please be patient my fellow Earthan, Martian photos are coming to you... </p>
    </div>
    `;
};

// function to create header including back button & nav bar buttons, being shown on the photo gallery page
const Header = (rovers) => {
    const content = rovers
        .map(
            (i) =>
                `<button type="button" class="btn btn__${i.toLowerCase()}" onclick="showTime('${i}')">${i}</button>`
        )
        .join("\n");

    return `
    <button class="btn btn__back" onclick="EndShowTime()">Back</button>

    <nav class="nav-bar">
        ${content}
    </nav>
    `;
};

// function to create home page title & buttons
const RoverShow = (rovers) => {
    return `
    <div class="rover-show">
        <h1 class="rover-show__title">Mars Rover Show</h1>
        ${Rovers(rovers)}
    </div>
    `;
};

// function to create home page rover buttons
const Rovers = (rovers) => {
    const content = rovers
        .map(
            (i) => `
            <button class="rover-btn" title="Click to see latest images taken by ${i}" type="button" onclick="showTime('${i}')">
                <h3 class="rover-btn__title">${i}</h3>

                <img
                    class="rover-btn__img"
                    src="./assets/images/${i.toLowerCase()}.jpg"
                    alt="${i} Illustration"
                />
            </button>`
        )
        .join("\n");

    return `
    <div class="rover-btn-box">
        ${content}
    </div>
    `;
};

// function to create photo gallery
const ImagesShow = (images) => {
    const content = images.map((i) => Image(i)).join("\n");

    return `
    <div class="img-container">
        ${content}
    </div>
    `;
};

// function to create each photo and its content
const Image = (i) => {
    return `
        <div class="img-box">
            <img
            class="img-box__img"
            src="${i.img_src}"
            />

            <div class="img-box__content">
                <p>Launch Date: ${i.rover.launch_date}</p>
                <p>Landing Date: ${i.rover.landing_date}</p>
                <p>Status: ${i.rover.status}</p>
                <p>Rover's Name: ${i.rover.name}</p>
                <p>Earth Day: ${i.earth_date} </p>
                <p>Martian Sol: ${i.sol}</p>
                <p>Taken by: ${i.camera.name} (aka ${i.camera.full_name})</p>
            </div>
        </div>
    `;
};

// function to toggle loader & load photo gallery from data returned from server
const showTime = async (rover) => {
    updateStore(store, { loading: true });

    let images = await getRoverImages(rover);

    updateStore(store, {
        showing: Immutable.List(images),
        showTime: true,
        loading: false,
    });
};

// function to go back to home page
const EndShowTime = () => {
    updateStore(store, { showTime: false });
};

// function to call API to get latest images from server based on rover's name
const getRoverImages = async (rover) => {
    try {
        const res = await (
            await fetch(`http://localhost:3000/${rover}`)
        ).json();

        return res.images.photos;
    } catch (err) {
        console.log(err);
    }
};
