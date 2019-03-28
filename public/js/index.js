$(document).ready(function() {

    const showNotes = (articleId) => {
        $("#new-note").val("")
        console.log(articleId)
        $(".note-container").empty();
        $.ajax({
            method: "GET",
            url: "/articles/" + articleId
        }).then(function(data) {
            // console.log(data.note);
            for (let i in data.note) {
                let note = $("<li class='list-group-item'>");
                note.text(data.note[i].body);
                $(".note-container").append(note);
            }
        })
        $(".addNote").attr("data-id", articleId)
        $("#notes-modal").modal("show")
    };

    const deleteArticle = (articleId) => {
        $.ajax({
            method: "DELETE",
            url: "/articles/" + articleId
        })
          .then(function(data) {
            console.log("deleted")
            console.log(data)

            // location.reload();
        })
    }

    const scrapeClickhole = () => {
        $.ajax({
            method: "GET",
            url: "/scrape"
        }).then(function() {
            location.reload();
        })
    }

    const addNote = (articleId) => {
        let newNoteContent = $("#new-note").val().trim();
        console.log(newNoteContent)
        $.ajax({
            method: "POST",
            url: "/articles/" + articleId,
            data: {
                body: newNoteContent
            }
        })
    }

    // Grab the articles as a json
    $(".notes").click(function() {
        const articleId = $(this).attr("data-id");
        showNotes(articleId);
    });

    $(".scrape-new").click(scrapeClickhole);

    $(".addNote").click(function () {
        const articleId = $(this).attr("data-id");
        addNote(articleId)
    });
   
    $(".delete").click(function() {
        const articleId = $(this).attr("data-id");
        deleteArticle(articleId);
    })
})

