$(() => {
    $(document).on("click", "#searchButton", search);

    function search(event) {
        event.preventDefault();
        let searchQuery = $("#searchBar").val();
        window.location.href = `#/search/${searchQuery}`;
    }
});