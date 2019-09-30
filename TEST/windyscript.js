const options = {
    key: 'vWCQDzEAmipjHnT3ZQ3cjPDp5sQ864xH',
    lat: 40.6,
    lon: -111.9,
    zoom: 10,
    hourFormat: '12h',
};

windyInit(options, windyAPI => {
    const { store } = windyAPI;
});