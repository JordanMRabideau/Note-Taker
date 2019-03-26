$(function() {
    $.ajax("/", {
        type: "POST"
    }).then(function() {
        console.log("Scraped")
    })
})